/**
 * AI value test harness.
 *
 * Runs the same synthetic explanations through the deterministic keyword table
 * and, when a key is configured, through the model, then prints an agreement
 * table and every disagreement. It also generates erroneous examples and pushes
 * each one through the engine's verifier to measure the rejection rate.
 *
 * Nothing here touches the browser or a real learner. Every explanation is
 * hand-written test data.
 *
 *   npm run ai-value-test
 *
 * Without OPENROUTER_API_KEY the model columns are reported as
 * "model path untested" rather than silently skipped.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_MODEL,
  handleLlmRequest,
  readLlmConfigFromEnv,
  type LlmConfig,
} from '../src/ai/core.ts';
import { classifyByKeyword } from '../src/ai/keyword.ts';
import {
  bankExample,
  pickTask,
  verifyErroneousExample,
  type ErroneousTask,
} from '../src/ai/erroneous.ts';
import { format } from '../src/engine/decimal.ts';
import { FIXTURES, type ExplanationFixture } from './explanation-fixtures.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

/** Minimal .env reader so the harness works without an extra dependency. */
function loadDotEnv(): void {
  try {
    const raw = readFileSync(join(ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // No .env file: the harness runs the fallback path only.
  }
}

interface Row {
  readonly fixture: ExplanationFixture;
  readonly keyword: string;
  readonly model?: string;
  readonly modelNote?: string;
}

const ITEM_FOR_SEEDS = { anchor: '0.8', target: '0.45', trueLarger: '0.8' };

async function classifyWithModel(
  fixture: ExplanationFixture,
  config: LlmConfig,
): Promise<{ label?: string; note?: string }> {
  if (fixture.text.trim().length === 0) return { label: 'UNCLEAR', note: 'empty' };
  const result = await handleLlmRequest(
    {
      op: 'classify',
      ...ITEM_FOR_SEEDS,
      step: fixture.step ?? 'why',
      text: fixture.text,
      learnerTreatedTargetAsLarger: true,
    },
    config,
  );
  if (result.ok && result.op === 'classify') {
    return { label: result.label, note: `confidence ${result.confidence}` };
  }
  return { note: result.ok ? 'unexpected' : result.reason };
}

async function runClassification(config: LlmConfig, useModel: boolean): Promise<Row[]> {
  const rows: Row[] = [];
  for (const fixture of FIXTURES) {
    const keyword = classifyByKeyword(fixture.text, {
      allowValid: fixture.step === 'correction',
    }).label;
    if (!useModel) {
      rows.push({ fixture, keyword });
      continue;
    }
    const model = await classifyWithModel(fixture, config);
    rows.push({
      fixture,
      keyword,
      ...(model.label ? { model: model.label } : {}),
      ...(model.note ? { modelNote: model.note } : {}),
    });
  }
  return rows;
}

interface GenerationResult {
  readonly rule: 'L' | 'S';
  readonly task: ErroneousTask;
  readonly accepted: boolean;
  readonly reason?: string;
  readonly claim?: string;
}

async function runGenerations(
  config: LlmConfig,
  useModel: boolean,
  perRule: number,
): Promise<GenerationResult[]> {
  const out: GenerationResult[] = [];
  if (!useModel) return out;
  for (const rule of ['L', 'S'] as const) {
    for (let i = 0; i < perRule; i += 1) {
      const task = pickTask(rule, i);
      const result = await handleLlmRequest(
        {
          op: 'erroneous-example',
          rule,
          anchor: format(task.item.anchor),
          target: format(task.item.target),
          wrongLarger: format(task.wrongLarger),
          separator: '.',
        },
        config,
      );
      if (!result.ok || result.op !== 'erroneous-example') {
        out.push({
          rule,
          task,
          accepted: false,
          reason: result.ok ? 'unexpected' : result.reason,
        });
        continue;
      }
      const verdict = verifyErroneousExample(
        { peerClaim: result.peerClaim, peerReason: result.peerReason },
        task,
      );
      out.push({
        rule,
        task,
        accepted: verdict.ok,
        ...(verdict.reason ? { reason: verdict.reason } : {}),
        claim: `${result.peerClaim} ${result.peerReason}`,
      });
    }
  }
  return out;
}

function pct(part: number, total: number): string {
  return total === 0 ? 'n/a' : `${Math.round((part / total) * 100)}%`;
}

function table(rows: Row[], useModel: boolean): string[] {
  const lines: string[] = [];
  lines.push(
    useModel
      ? '| # | group | explanation | expected | keyword | model |'
      : '| # | group | explanation | expected | keyword |',
  );
  lines.push(useModel ? '| --- | --- | --- | --- | --- | --- |' : '| --- | --- | --- | --- | --- |');
  for (const row of rows) {
    const text = row.fixture.text === '' ? '(empty)' : row.fixture.text.replace(/\|/g, '/');
    const base = `| ${row.fixture.id} | ${row.fixture.group} | ${text} | ${row.fixture.expected} | ${row.keyword} |`;
    lines.push(useModel ? `${base} ${row.model ?? `- (${row.modelNote})`} |` : base);
  }
  return lines;
}

async function main(): Promise<void> {
  loadDotEnv();
  const config = readLlmConfigFromEnv(process.env as Record<string, string | undefined>);
  const useModel = Boolean(config.apiKey);
  // Local date, so the file name matches the day the operator ran it.
  const now = new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;

  const rows = await runClassification(config, useModel);
  const generations = await runGenerations(config, useModel, 20);

  const keywordAgree = rows.filter((r) => r.keyword === r.fixture.expected).length;
  const modelAgree = rows.filter((r) => r.model && r.model === r.fixture.expected).length;
  const modelAnswered = rows.filter((r) => r.model).length;
  const bothWrong = rows.filter(
    (r) => r.keyword !== r.fixture.expected && r.model && r.model !== r.fixture.expected,
  ).length;
  const modelOnly = rows.filter(
    (r) => r.keyword !== r.fixture.expected && r.model === r.fixture.expected,
  );
  const keywordOnly = rows.filter(
    (r) => r.keyword === r.fixture.expected && r.model && r.model !== r.fixture.expected,
  );

  const out: string[] = [];
  out.push(`# AI value test - ${date}`);
  out.push('');
  out.push(
    'Synthetic explanations only. No child wrote any of this text and nothing here is stored by the game.',
  );
  out.push('');
  out.push(`- Cases: ${rows.length}`);
  out.push(`- Model: ${useModel ? config.model : 'not run (no OPENROUTER_API_KEY)'}`);
  out.push(`- Default model id: \`${DEFAULT_MODEL}\``);
  out.push(
    `- Keyword table agrees with the adult label on ${keywordAgree}/${rows.length} (${pct(keywordAgree, rows.length)})`,
  );
  if (useModel) {
    out.push(
      `- Model agrees with the adult label on ${modelAgree}/${modelAnswered} answered (${pct(modelAgree, modelAnswered)})`,
    );
    out.push(`- Both wrong: ${bothWrong}`);
    out.push(`- Model right where the keyword table is wrong: ${modelOnly.length}`);
    out.push(`- Keyword table right where the model is wrong: ${keywordOnly.length}`);
  } else {
    out.push('- **Model path untested**: no OPENROUTER_API_KEY was present in the environment.');
  }
  out.push('');
  out.push('## Agreement table');
  out.push('');
  out.push(...table(rows, useModel));
  out.push('');
  out.push('## Disagreements with the adult label');
  out.push('');
  const disagreements = rows.filter(
    (r) => r.keyword !== r.fixture.expected || (r.model && r.model !== r.fixture.expected),
  );
  if (disagreements.length === 0) {
    out.push('None.');
  } else {
    for (const row of disagreements) {
      out.push(
        `- \`${row.fixture.id}\` expected **${row.fixture.expected}**, keyword **${row.keyword}**${
          row.model ? `, model **${row.model}**` : ''
        }${row.fixture.note ? ` - ${row.fixture.note}` : ''}`,
      );
    }
  }
  out.push('');
  out.push('## Erroneous-example generation through the verifier');
  out.push('');
  if (!useModel) {
    out.push(
      'Not run: no OPENROUTER_API_KEY. The authored fallback bank was used in its place; every authored example passes the verifier (see `tests/verifier.test.ts`).',
    );
  } else {
    for (const rule of ['L', 'S'] as const) {
      const forRule = generations.filter((g) => g.rule === rule);
      const accepted = forRule.filter((g) => g.accepted).length;
      out.push(
        `- Rule ${rule}: ${accepted}/${forRule.length} accepted, rejection rate ${pct(
          forRule.length - accepted,
          forRule.length,
        )}`,
      );
    }
    out.push('');
    const rejected = generations.filter((g) => !g.accepted);
    if (rejected.length > 0) {
      out.push('Rejected outputs (the authored bank was served instead):');
      out.push('');
      for (const r of rejected) {
        out.push(`- ${r.rule} / ${r.task.item.id}: ${r.reason} - ${r.claim ?? ''}`);
      }
    }
  }
  out.push('');
  out.push('## Fallback bank sample');
  out.push('');
  for (const rule of ['L', 'S'] as const) {
    const task = pickTask(rule, 0);
    const example = bankExample(task);
    out.push(`- ${rule}: "${example.peerClaim} ${example.peerReason}"`);
  }
  out.push('');

  const report = out.join('\n');
  const dir = join(ROOT, 'docs', 'evidence');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `ai-value-test-${date}.md`);
  writeFileSync(file, report, 'utf8');

  console.log(report);
  console.log(`\nWritten to ${file}`);
  if (!useModel) {
    console.log('\nMODEL PATH UNTESTED: set OPENROUTER_API_KEY to run the model columns.');
  }
}

await main();
