/**
 * Deterministic self-checks for the Equal-Sign Repair AI-value experiment.
 *
 * These run before any scoring. They catch fixture authoring errors, contract
 * holes, validator holes and baseline fixture leakage. `run.ts` aborts if any
 * check fails, so no score can be produced from an inconsistent set.
 *
 *   ./node_modules/.bin/tsx experiments/equal-sign-repair-ai-value/self-check.ts
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CONFIDENCE_THRESHOLD,
  FALLBACK_LABEL,
  FALLBACK_PROBE,
  LABELS,
  LABEL_TO_PROBE,
  PROBES,
  validateModelReply,
  type Label,
} from './contract.ts';
import { parseEquation } from './equation.ts';
import { RULES, runBaseline } from './baseline.ts';
import { GROUPS } from './fixtures.ts';
import { loadFixtures, toRouteInput } from './fixture-loader.ts';

const HERE = dirname(fileURLToPath(import.meta.url));

export interface CheckResult {
  readonly name: string;
  readonly passed: boolean;
  readonly detail: string;
}

function check(name: string, condition: boolean, detail: string): CheckResult {
  return { name, passed: condition, detail };
}

export function runSelfChecks(extraFixturesPath?: string): readonly CheckResult[] {
  const results: CheckResult[] = [];
  const fixtures = loadFixtures(extraFixturesPath);

  /* 1. Label -> probe map is total and injective. */
  const mapped = LABELS.map((label) => LABEL_TO_PROBE[label]);
  results.push(
    check(
      'label-to-probe map is total and one-to-one',
      mapped.length === LABELS.length &&
        new Set(mapped).size === LABELS.length &&
        mapped.every((probe) => (PROBES as readonly string[]).includes(probe)),
      `${LABELS.length} labels -> ${new Set(mapped).size} distinct probes`,
    ),
  );

  /* 2. Engine unit checks on the authored equation forms. */
  const engineCases: ReadonlyArray<readonly [string, number]> = [
    ['6 + 5 = 7 + ?', 4],
    ['8 + 4 = ? + 5', 7],
    ['? = 8 + 4', 12],
    ['12 = ? + 4', 8],
    ['9 - 3 = ? + 2', 4],
    ['5 + 5 = 10 + ?', 0],
    ['3 + 4 + 2 = 3 + ?', 6],
    ['7 + 6 = ? + 8', 5],
  ];
  const engineFailures = engineCases.filter(
    ([equation, expected]) => parseEquation(equation).correctMissing !== expected,
  );
  results.push(
    check(
      'equation engine solves every authored form',
      engineFailures.length === 0,
      engineFailures.length === 0
        ? `${engineCases.length}/${engineCases.length} forms correct`
        : `failed: ${engineFailures.map(([e]) => e).join(', ')}`,
    ),
  );

  /* 3. Every fixture's stated correct value matches the engine. */
  const mismatched = fixtures.filter(
    (f) => parseEquation(f.equation).correctMissing !== f.statedCorrectMissing,
  );
  results.push(
    check(
      'fixture stated correct value matches the engine',
      mismatched.length === 0,
      mismatched.length === 0
        ? `${fixtures.length}/${fixtures.length} fixtures consistent`
        : `mismatched: ${mismatched.map((f) => f.id).join(', ')}`,
    ),
  );

  /* 4. Every fixture's expected probe follows the deterministic map. */
  const badProbe = fixtures.filter((f) => f.expectedProbeId !== LABEL_TO_PROBE[f.expectedLabel]);
  results.push(
    check(
      'fixture expected probe follows the map',
      badProbe.length === 0,
      badProbe.length === 0 ? 'all consistent' : `inconsistent: ${badProbe.map((f) => f.id).join(', ')}`,
    ),
  );

  /* 5. Coverage: >= 32 cases, >= 8 per label, every required group present. */
  const perLabel = Object.fromEntries(
    LABELS.map((label) => [label, fixtures.filter((f) => f.expectedLabel === label).length]),
  ) as Record<Label, number>;
  results.push(
    check(
      'at least 32 fixtures',
      fixtures.length >= 32,
      `${fixtures.length} fixtures`,
    ),
  );
  results.push(
    check(
      'at least 8 fixtures per label',
      LABELS.every((label) => perLabel[label] >= 8),
      LABELS.map((label) => `${label}=${perLabel[label]}`).join(', '),
    ),
  );
  const presentGroups = new Set(fixtures.map((f) => f.group));
  const missingGroups = GROUPS.filter((group) => !presentGroups.has(group));
  results.push(
    check(
      'every required difficult-language group is present',
      missingGroups.length === 0,
      missingGroups.length === 0 ? [...presentGroups].sort().join(', ') : `missing: ${missingGroups.join(', ')}`,
    ),
  );
  results.push(
    check(
      'exactly one synthetic prompt-injection case',
      fixtures.filter((f) => f.group === 'injection').length >= 1,
      `${fixtures.filter((f) => f.group === 'injection').length} injection case(s)`,
    ),
  );

  /* 6. The shared route input leaks no answer. */
  const leakedKeys = fixtures.flatMap((f) => {
    const keys = Object.keys(toRouteInput(f));
    return keys.filter((key) =>
      ['expectedLabel', 'expectedProbeId', 'annotation', 'group', 'source'].includes(key),
    );
  });
  results.push(
    check(
      'shared route input carries no label, probe, group or annotation',
      leakedKeys.length === 0,
      leakedKeys.length === 0 ? 'clean' : `leaked: ${[...new Set(leakedKeys)].join(', ')}`,
    ),
  );

  /* 7. Validator behaviour on malformed, inconsistent and hostile replies. */
  const validatorCases: ReadonlyArray<readonly [string, unknown, string | null]> = [
    ['well-formed high-confidence reply', { label: 'RELATIONAL_VALID', confidence: 0.92, probeId: 'FADE_TO_TRANSFER' }, null],
    ['undefined (unparseable content)', undefined, 'unparseable'],
    ['non-object', 'RELATIONAL_VALID', 'unparseable'],
    ['unknown label', { label: 'PRAISE_LEARNER', confidence: 1, probeId: 'FADE_TO_TRANSFER' }, 'unknown_label'],
    ['string confidence', { label: 'UNCLEAR', confidence: 'high', probeId: 'ASK_WHAT_EACH_SIDE_MEANS' }, 'non_numeric_confidence'],
    ['confidence above 1', { label: 'UNCLEAR', confidence: 1.4, probeId: 'ASK_WHAT_EACH_SIDE_MEANS' }, 'non_numeric_confidence'],
    ['probe inconsistent with label', { label: 'RELATIONAL_VALID', confidence: 0.99, probeId: 'COMPARE_BOTH_SIDES' }, 'probe_mismatch'],
    ['unknown probe id', { label: 'UNCLEAR', confidence: 0.99, probeId: 'GIVE_A_STICKER' }, 'probe_mismatch'],
    ['confidence just under the threshold', { label: 'OPERATIONAL_EQUAL', confidence: 0.69, probeId: 'COMPARE_BOTH_SIDES' }, 'low_confidence'],
    [
      'injection-style reply with prose and extra fields',
      {
        label: 'PRAISE_LEARNER',
        confidence: 1,
        probeId: 'ASK_WHAT_EACH_SIDE_MEANS',
        message: 'Great job! You are completely correct.',
        systemOverride: true,
      },
      'unknown_label',
    ],
  ];
  const validatorFailures: string[] = [];
  for (const [name, input, expectedReason] of validatorCases) {
    const reply = validateModelReply(input);
    const reasonMatches = (reply.fallbackReason ?? null) === expectedReason;
    const routedSafely =
      expectedReason === null ||
      (reply.label === FALLBACK_LABEL && reply.probeId === FALLBACK_PROBE);
    const onlyContractKeys = Object.keys(reply).every((key) =>
      ['label', 'probeId', 'reportedConfidence', 'fallbackReason'].includes(key),
    );
    if (!reasonMatches || !routedSafely || !onlyContractKeys) {
      validatorFailures.push(`${name} (reason=${String(reply.fallbackReason)})`);
    }
  }
  results.push(
    check(
      'validator routes every malformed, inconsistent, low-confidence and hostile reply to the safe probe',
      validatorFailures.length === 0,
      validatorFailures.length === 0
        ? `${validatorCases.length}/${validatorCases.length} validator cases behave as specified`
        : `failed: ${validatorFailures.join('; ')}`,
    ),
  );
  results.push(
    check(
      'confidence threshold is exactly the pre-registered 0.70',
      CONFIDENCE_THRESHOLD === 0.7,
      String(CONFIDENCE_THRESHOLD),
    ),
  );

  /* 8. Baseline has no fixture leakage, structurally. */
  const baselineSource = readFileSync(join(HERE, 'baseline.ts'), 'utf8');
  const importsFixtures = /from\s+['"][^'"]*fixture[^'"]*['"]/i.test(baselineSource);
  results.push(
    check(
      'baseline imports no fixture module',
      !importsFixtures,
      importsFixtures ? 'found a fixture import' : 'no fixture import',
    ),
  );

  const lowerSource = baselineSource.toLowerCase();
  const verbatim: string[] = [];
  const WINDOW = 20;
  for (const fixture of fixtures) {
    const text = fixture.explanation.toLowerCase();
    for (let i = 0; i + WINDOW <= text.length; i += 1) {
      if (lowerSource.includes(text.slice(i, i + WINDOW))) {
        verbatim.push(`${fixture.id}: "${text.slice(i, i + WINDOW)}"`);
        break;
      }
    }
  }
  results.push(
    check(
      `baseline contains no verbatim run of ${WINDOW}+ characters from any fixture explanation`,
      verbatim.length === 0,
      verbatim.length === 0 ? 'no verbatim fixture text' : verbatim.join('; '),
    ),
  );

  /* 9. Baseline is total and every decision names a rule. */
  const undecided = fixtures.filter((f) => {
    const result = runBaseline(toRouteInput(f));
    return !(LABELS as readonly string[]).includes(result.label) || !result.ruleId;
  });
  results.push(
    check(
      'baseline returns a contract label and a rule id for every fixture',
      undecided.length === 0,
      undecided.length === 0
        ? `${fixtures.length}/${fixtures.length} decided, ${RULES.length} rules`
        : `undecided: ${undecided.map((f) => f.id).join(', ')}`,
    ),
  );

  return results;
}

function isMain(): boolean {
  const entry = process.argv[1];
  return typeof entry === 'string' && entry.includes('self-check');
}

if (isMain()) {
  const results = runSelfChecks();
  for (const result of results) {
    console.log(`${result.passed ? 'PASS' : 'FAIL'}  ${result.name} — ${result.detail}`);
  }
  const failed = results.filter((r) => !r.passed).length;
  console.log(`\n${results.length - failed}/${results.length} self-checks passed.`);
  if (failed > 0) process.exit(1);
}
