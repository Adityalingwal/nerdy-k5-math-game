/**
 * Equal-Sign Repair bounded AI-value test (D-012) — runner.
 *
 *   ./node_modules/.bin/tsx experiments/equal-sign-repair-ai-value/run.ts
 *   ./node_modules/.bin/tsx experiments/equal-sign-repair-ai-value/run.ts \
 *     --extra-fixtures /absolute/path/to/holdout.json
 *
 * Writes a machine-readable JSON artifact and a readable Markdown report under
 * `docs/evidence/experiments/equal-sign-repair/`.
 *
 * The model route runs only when OPENROUTER_API_KEY is already present in the
 * environment or in the repository `.env`. When it is not, every model-derived
 * number is recorded as `not measured` and the report states
 * `real model path untested`. Nothing is simulated, mocked or inferred.
 */

import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CONFIDENCE_THRESHOLD,
  LABELS,
  LABEL_TO_PROBE,
  SYSTEM_CONTRACT,
  type Label,
} from './contract.ts';
import { BASELINE_RULE_COUNT, RULES, runBaseline } from './baseline.ts';
import { loadFixtures, readExtraFixturesArg, toRouteInput } from './fixture-loader.ts';
import type { Fixture } from './fixtures.ts';
import { REPO_ROOT, loadDotEnv } from './env.ts';
import {
  EXPERIMENT_TIMEOUT_MS,
  MAX_TOKENS,
  TEMPERATURE,
  callModel,
  readModelEnv,
  type ModelConfig,
  type TransportFailure,
} from './model.ts';
import { isHighRisk, scoreRoute, type CaseOutcome, type RouteScore } from './score.ts';

const GATE_DEFINITION = [
  '- `possible advance`: the real model beats the deterministic baseline by at least 15 percentage',
  '  points on exact labels, has no high-risk error on either attempt, and produces valid or',
  '  fallback-safe output on every case.',
  '- `drop AI claim`: improvement is below 15 percentage points, the rules cover all meaningful',
  '  differences, or the model has any repeatable high-risk error.',
  '- `unresolved`: the real model did not run, results are unstable across the two attempts, or the',
  '  small authored fixture set cannot discriminate the routes.',
  '',
  'Operationalisation of "unstable", recorded before any model result exists: the two attempts\'',
  'exact-label agreement differs by more than 5 percentage points.',
];

const ADVANCE_MARGIN_POINTS = 15;
/** Pre-registered instability threshold, in percentage points. Never tuned. */
const INSTABILITY_POINTS = 5;

function localDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
}

function baselineOutcomes(fixtures: readonly Fixture[]): readonly CaseOutcome[] {
  return fixtures.map((fixture) => {
    const input = toRouteInput(fixture);
    const result = runBaseline(input);
    const labelCorrect = result.label === fixture.expectedLabel;
    return {
      caseId: fixture.id,
      group: fixture.group,
      equation: fixture.equation,
      explanation: fixture.explanation,
      placedValue: input.facts.placedValue,
      correctMissing: input.facts.correctMissing,
      expectedLabel: fixture.expectedLabel,
      expectedProbeId: fixture.expectedProbeId,
      predictedLabel: result.label,
      predictedProbeId: result.probeId,
      labelCorrect,
      probeCorrect: result.probeId === fixture.expectedProbeId,
      highRisk: isHighRisk(fixture.expectedLabel, result.label),
      decidedBy: result.ruleId,
      note: labelCorrect
        ? `agrees (${result.ruleId})`
        : `expected ${fixture.expectedLabel}, rules said ${result.label} via ${result.ruleId}`,
    } satisfies CaseOutcome;
  });
}

interface ModelPassResult {
  readonly attempt: number;
  readonly outcomes: readonly CaseOutcome[];
  readonly servedModels: readonly string[];
  readonly usageSamples: readonly unknown[];
  readonly aborted?: { readonly caseId: string; readonly failure: TransportFailure };
}

async function modelPass(
  attempt: number,
  fixtures: readonly Fixture[],
  config: ModelConfig,
): Promise<ModelPassResult> {
  const outcomes: CaseOutcome[] = [];
  const servedModels = new Set<string>();
  const usageSamples: unknown[] = [];

  for (const fixture of fixtures) {
    const input = toRouteInput(fixture);
    let call = await callModel(input, config);
    if (!call.ok) {
      // Exactly one controlled retry for a transport failure, then abort.
      call = await callModel(input, config);
      if (!call.ok) {
        return {
          attempt,
          outcomes,
          servedModels: [...servedModels],
          usageSamples,
          aborted: { caseId: fixture.id, failure: call.failure },
        };
      }
    }
    if (call.servedModel) servedModels.add(call.servedModel);
    if (call.usage) usageSamples.push(call.usage);
    const { reply } = call;
    const labelCorrect = reply.label === fixture.expectedLabel;
    outcomes.push({
      caseId: fixture.id,
      group: fixture.group,
      equation: fixture.equation,
      explanation: fixture.explanation,
      placedValue: input.facts.placedValue,
      correctMissing: input.facts.correctMissing,
      expectedLabel: fixture.expectedLabel,
      expectedProbeId: fixture.expectedProbeId,
      predictedLabel: reply.label,
      predictedProbeId: reply.probeId,
      labelCorrect,
      probeCorrect: reply.probeId === fixture.expectedProbeId,
      highRisk: isHighRisk(fixture.expectedLabel, reply.label),
      decidedBy: reply.fallbackReason ? `fallback:${reply.fallbackReason}` : 'model',
      ...(reply.fallbackReason ? { fallbackReason: reply.fallbackReason } : {}),
      reportedConfidence: reply.reportedConfidence,
      latencyMs: Math.round(call.latencyMs * 10) / 10,
      note: labelCorrect
        ? 'agrees'
        : `expected ${fixture.expectedLabel}, model route said ${reply.label}`,
    });
  }

  return { attempt, outcomes, servedModels: [...servedModels], usageSamples };
}

/* ------------------------------------------------------------------ */
/* Report rendering                                                    */
/* ------------------------------------------------------------------ */

function escapePipes(text: string): string {
  return text.replace(/\|/g, '/').replace(/\n/g, ' ');
}

function confusionTable(score: RouteScore): string[] {
  const lines = [
    `| expected \\ predicted | ${LABELS.join(' | ')} |`,
    `| --- | ${LABELS.map(() => '---').join(' | ')} |`,
  ];
  for (const expected of LABELS) {
    const row = LABELS.map((predicted) => String(score.confusion[expected][predicted]));
    lines.push(`| ${expected} | ${row.join(' | ')} |`);
  }
  return lines;
}

function routeSection(title: string, score: RouteScore): string[] {
  const out: string[] = [];
  out.push(`### ${title}`);
  out.push('');
  out.push(
    `- Exact-label agreement: **${score.labelAgreement}/${score.total} (${score.labelAgreementPct}%)**`,
  );
  out.push(
    `- Exact probe-ID agreement: **${score.probeAgreement}/${score.total} (${score.probeAgreementPct}%)** (identical to label agreement by construction)`,
  );
  out.push(`- High-risk errors: **${score.highRiskErrors.length}**`);
  out.push(
    `- Fallback routings: ${score.fallbackCount}${
      score.fallbackCount > 0 ? ` (${JSON.stringify(score.fallbackBreakdown)})` : ''
    }`,
  );
  out.push(
    score.latencyP50Ms === null
      ? '- Latency p50 / p95: not measured (no model call in this route)'
      : `- Latency p50 / p95: ${score.latencyP50Ms} ms / ${score.latencyP95Ms} ms — local-run evidence only`,
  );
  out.push('');
  out.push('Confusion matrix:');
  out.push('');
  out.push(...confusionTable(score));
  out.push('');
  out.push('By case group:');
  out.push('');
  out.push('| group | correct | total |');
  out.push('| --- | --- | --- |');
  for (const group of score.byGroup) {
    out.push(`| ${group.group} | ${group.correct} | ${group.total} |`);
  }
  out.push('');
  const disagreements = score.outcomes.filter((o) => !o.labelCorrect);
  out.push(`Disagreements with the adult label (${disagreements.length}):`);
  out.push('');
  if (disagreements.length === 0) {
    out.push('None.');
  } else {
    for (const outcome of disagreements) {
      out.push(
        `- \`${outcome.caseId}\` (${outcome.group}) — ${escapePipes(outcome.note)}${
          outcome.highRisk ? ' **[HIGH RISK]**' : ''
        }`,
      );
    }
  }
  out.push('');
  return out;
}

function perCaseTable(score: RouteScore): string[] {
  const out: string[] = [];
  out.push('| id | group | equation | placed | correct | explanation | expected | predicted | decided by | ok |');
  out.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const o of score.outcomes) {
    out.push(
      `| ${o.caseId} | ${o.group} | \`${o.equation}\` | ${o.placedValue ?? '-'} | ${o.correctMissing} | ${
        o.explanation === '' ? '(empty)' : escapePipes(o.explanation)
      } | ${o.expectedLabel} | ${o.predictedLabel} | ${o.decidedBy} | ${o.labelCorrect ? 'yes' : 'NO'} |`,
    );
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main(): Promise<void> {
  loadDotEnv();
  const extraFixturesPath = readExtraFixturesArg(process.argv.slice(2));

  const { runSelfChecks } = await import('./self-check.ts');
  const checks = runSelfChecks(extraFixturesPath);
  const failedChecks = checks.filter((c) => !c.passed);
  for (const result of checks) {
    console.log(`${result.passed ? 'PASS' : 'FAIL'}  ${result.name} — ${result.detail}`);
  }
  if (failedChecks.length > 0) {
    console.error('\nSelf-checks failed; refusing to score. Nothing was written.');
    process.exit(1);
  }

  const fixtures = loadFixtures(extraFixturesPath);
  const baseline = scoreRoute('deterministic-baseline', baselineOutcomes(fixtures));

  const env = readModelEnv();
  const modelPasses: ModelPassResult[] = [];
  let modelScores: RouteScore[] = [];
  if (env.configured && env.config) {
    for (const attempt of [1, 2]) {
      const pass = await modelPass(attempt, fixtures, env.config);
      modelPasses.push(pass);
      if (pass.aborted) {
        console.error(
          `Model attempt ${attempt} aborted at ${pass.aborted.caseId}: ` +
            `${pass.aborted.failure.kind} ${pass.aborted.failure.status ?? ''} ${pass.aborted.failure.detail}`,
        );
        break;
      }
    }
    modelScores = modelPasses
      .filter((p) => !p.aborted)
      .map((p) => scoreRoute(`model-attempt-${p.attempt}`, p.outcomes));
  }

  const modelRan = modelScores.length > 0;
  const completedAttempts = modelScores.length;

  /* Pre-registered gate, evaluated mechanically. */
  let gate: 'possible advance' | 'drop AI claim' | 'unresolved';
  let gateReason: string;
  if (!modelRan || completedAttempts < 2) {
    gate = 'unresolved';
    gateReason = env.configured
      ? 'the real model route did not complete both attempts'
      : 'no OPENROUTER_API_KEY was configured, so the real model path was never executed (real model path untested)';
  } else {
    const bestModel = Math.min(...modelScores.map((s) => s.labelAgreementPct));
    const margin = bestModel - baseline.labelAgreementPct;
    const anyHighRisk = modelScores.some((s) => s.highRiskErrors.length > 0);
    const unstable =
      Math.abs(
        (modelScores[0] as RouteScore).labelAgreementPct -
          (modelScores[1] as RouteScore).labelAgreementPct,
      ) > INSTABILITY_POINTS;
    if (unstable) {
      gate = 'unresolved';
      gateReason = `the two model attempts disagreed by more than the pre-registered ${INSTABILITY_POINTS} percentage points`;
    } else if (margin >= ADVANCE_MARGIN_POINTS && !anyHighRisk) {
      gate = 'possible advance';
      gateReason = `the weaker model attempt beat the rules baseline by ${margin.toFixed(1)} points with no high-risk error`;
    } else {
      gate = 'drop AI claim';
      gateReason = anyHighRisk
        ? 'the model produced at least one high-risk error'
        : `the model's margin over the rules baseline was ${margin.toFixed(1)} points, below the pre-registered ${ADVANCE_MARGIN_POINTS}`;
    }
  }

  /* Headroom fact: how much improvement the fixture set can even show. */
  const headroom = Math.round((100 - baseline.labelAgreementPct) * 10) / 10;

  const date = localDate();
  const evidenceDir = join(REPO_ROOT, 'docs', 'evidence', 'experiments', 'equal-sign-repair');
  mkdirSync(evidenceDir, { recursive: true });

  const json = {
    experiment: 'equal-sign-repair-ai-value',
    decision: 'D-012',
    runDate: date,
    fixtureCount: fixtures.length,
    fixtureSources: {
      authored: fixtures.filter((f) => f.source === 'authored').length,
      holdout: fixtures.filter((f) => f.source === 'holdout').length,
      extraFixturesPath: extraFixturesPath ?? null,
    },
    perLabelFixtureCounts: Object.fromEntries(
      LABELS.map((label) => [label, fixtures.filter((f) => f.expectedLabel === label).length]),
    ) as Record<Label, number>,
    contract: {
      labels: LABELS,
      labelToProbe: LABEL_TO_PROBE,
      confidenceThreshold: CONFIDENCE_THRESHOLD,
      temperature: TEMPERATURE,
      maxTokens: MAX_TOKENS,
      requestTimeoutMs: EXPERIMENT_TIMEOUT_MS,
      systemContractSha256: createHash('sha256').update(SYSTEM_CONTRACT).digest('hex'),
      systemContractChars: SYSTEM_CONTRACT.length,
    },
    baselineRuleCount: BASELINE_RULE_COUNT,
    selfChecks: checks,
    baseline,
    model: {
      configured: env.configured,
      requestedModel: env.requestedModel,
      servedModels: modelPasses.flatMap((p) => p.servedModels),
      attemptsCompleted: completedAttempts,
      status: env.configured ? 'ran' : 'real model path untested',
      aborted: modelPasses.filter((p) => p.aborted).map((p) => p.aborted) ?? [],
      usageSamples: modelPasses.flatMap((p) => p.usageSamples),
      scores: modelScores,
    },
    gate: { result: gate, reason: gateReason, advanceMarginPoints: ADVANCE_MARGIN_POINTS },
    baselineHeadroomPoints: headroom,
  };
  const jsonPath = join(evidenceDir, `ai-value-test-${date}.json`);
  writeFileSync(jsonPath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');

  /* Markdown report. */
  const md: string[] = [];
  md.push(`# Equal-Sign Repair AI-value test — run ${date}`);
  md.push('');
  md.push(
    'Local CLI experiment authorized by D-012. Synthetic adult-authored cases only: no real child',
    'wrote any of this text, no personal data is present, and nothing is stored by any product.',
    'This is a software-behaviour comparison. It is **not** evidence of child learning, classroom',
    'effectiveness, grade suitability, or mastery.',
  );
  md.push('');
  md.push('## 1. Pre-registered gate and threshold (stated before any score)');
  md.push('');
  md.push(`Confidence threshold: \`${CONFIDENCE_THRESHOLD}\`, fixed before the run and never tuned.`);
  md.push('');
  md.push(...GATE_DEFINITION);
  md.push('');
  md.push(`Model route status: **${env.configured ? 'ran' : 'real model path untested'}**.`);
  md.push('');
  md.push(`Gate result for this run: **\`${gate}\`** — ${gateReason}.`);
  md.push('');
  md.push('## 2. Run configuration');
  md.push('');
  md.push(`- Fixtures: ${fixtures.length} (${json.fixtureSources.authored} authored, ${json.fixtureSources.holdout} holdout)`);
  md.push(
    `- Per label: ${LABELS.map((label) => `${label} ${json.perLabelFixtureCounts[label]}`).join(', ')}`,
  );
  md.push(`- Deterministic baseline rule count: **${BASELINE_RULE_COUNT}**`);
  md.push(`- Requested model id: \`${env.requestedModel}\``);
  md.push(
    env.configured
      ? `- Served model id(s): ${json.model.servedModels.length > 0 ? json.model.servedModels.map((m) => `\`${m}\``).join(', ') : 'not reported by the provider'}`
      : '- Served model id: **not measured** (no key configured)',
  );
  md.push(`- Temperature ${TEMPERATURE}, max_tokens ${MAX_TOKENS}, request timeout ${EXPERIMENT_TIMEOUT_MS} ms`);
  md.push(`- Self-checks: ${checks.length}/${checks.length} passed`);
  md.push('');
  md.push('## 3. Measured results');
  md.push('');
  md.push(...routeSection('Deterministic rules baseline', baseline));
  if (modelScores.length === 0) {
    md.push('### Real model route');
    md.push('');
    md.push('**`real model path untested`.**');
    md.push('');
    md.push(
      'No `OPENROUTER_API_KEY` was present in the process environment or in a repository `.env`,',
      'so no model call was made. Every model-dependent metric below is **not measured**, which is',
      'not the same as zero:',
    );
    md.push('');
    md.push('| metric | value |');
    md.push('| --- | --- |');
    md.push('| exact-label agreement | not measured |');
    md.push('| exact probe-ID agreement | not measured |');
    md.push('| confusion matrix | not measured |');
    md.push('| results by case group | not measured |');
    md.push('| malformed replies | not measured |');
    md.push('| low-confidence fallbacks | not measured |');
    md.push('| timeouts | not measured |');
    md.push('| cases where AI is right and rules are wrong | not measured |');
    md.push('| cases where rules are right and AI is wrong | not measured |');
    md.push('| high-risk errors | not measured |');
    md.push('| latency p50 / p95 | not measured |');
    md.push('| served model id | not measured |');
    md.push('');
  } else {
    for (const score of modelScores) md.push(...routeSection(`Model route — ${score.route}`, score));
    for (const score of modelScores) {
      const aiRight = score.outcomes.filter(
        (o) =>
          o.labelCorrect &&
          !(baseline.outcomes.find((b) => b.caseId === o.caseId)?.labelCorrect ?? false),
      );
      const rulesRight = score.outcomes.filter(
        (o) =>
          !o.labelCorrect &&
          (baseline.outcomes.find((b) => b.caseId === o.caseId)?.labelCorrect ?? false),
      );
      md.push(`Route comparison for ${score.route}:`);
      md.push('');
      md.push(`- AI right where the rules are wrong (${aiRight.length}): ${aiRight.map((o) => o.caseId).join(', ') || 'none'}`);
      md.push(`- Rules right where the AI is wrong (${rulesRight.length}): ${rulesRight.map((o) => o.caseId).join(', ') || 'none'}`);
      md.push('');
    }
  }
  md.push('## 4. Per-case outputs — deterministic baseline');
  md.push('');
  md.push(...perCaseTable(baseline));
  md.push('');
  for (const score of modelScores) {
    md.push(`## Per-case outputs — ${score.route}`);
    md.push('');
    md.push(...perCaseTable(score));
    md.push('');
  }
  md.push('## 5. Discrimination headroom');
  md.push('');
  md.push(
    `The rules baseline already agrees with the adult labels on ${baseline.labelAgreementPct}% of this`,
    `fixture set, so the largest possible improvement any route could show here is`,
    `**${headroom} percentage points** — below the pre-registered ${ADVANCE_MARGIN_POINTS}-point advance margin.`,
    'On this fixture set alone the `possible advance` branch is therefore unreachable, whatever the',
    'model scores. Independent holdout cases are required before the gate can mean anything.',
  );
  md.push('');
  md.push('## 6. Honest limitations');
  md.push('');
  md.push('- Claude (Opus 5) authored **both** the harness and the initial fixture set, so this is not a blind benchmark.');
  md.push(
    '- The rules and the fixtures were **co-developed in one pass before the first execution** (nothing changed after it),',
    'so the baseline percentage is an upper bound on rules co-designed with their own test set, not a general capability.',
    'See "Authoring order" in `docs/prototypes/equal-sign-repair/ai-value-test-build-report.md`.',
  );
  md.push('- The fixture set is small, synthetic and adult-written; it cannot establish prevalence or realism of learner language.');
  md.push('- Probe agreement equals label agreement by construction, so it is not independent evidence.');
  md.push('- These are software checks only: no child learning, classroom effectiveness, grade suitability or mastery claim follows from them.');
  md.push('');

  const mdPath = join(evidenceDir, `ai-value-test-${date}.md`);
  writeFileSync(mdPath, `${md.join('\n')}\n`, 'utf8');

  console.log('');
  console.log(`Fixtures: ${fixtures.length}; baseline rules: ${BASELINE_RULE_COUNT} (${RULES.length} entries)`);
  console.log(
    `Baseline exact-label agreement: ${baseline.labelAgreement}/${baseline.total} (${baseline.labelAgreementPct}%), high-risk errors: ${baseline.highRiskErrors.length}`,
  );
  console.log(
    env.configured
      ? `Model attempts completed: ${completedAttempts}`
      : 'Model route: real model path untested (no OPENROUTER_API_KEY).',
  );
  console.log(`Provisional gate: ${gate} — ${gateReason}`);
  console.log(`JSON: ${jsonPath}`);
  console.log(`Markdown: ${mdPath}`);
}

await main();
