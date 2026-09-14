/**
 * Fixture loading and shared-input construction.
 *
 * The authored set lives in `fixtures.ts`. An independent reviewer can add
 * undisclosed holdout cases without touching the authored set:
 *
 *   ./node_modules/.bin/tsx experiments/equal-sign-repair-ai-value/run.ts \
 *     --extra-fixtures /absolute/path/to/holdout.json
 *
 * The JSON file must be an array of objects shaped like the authored drafts:
 *
 *   {
 *     "id": "HOLD-01",
 *     "group": "ordinary",
 *     "equation": "6 + 5 = 7 + ?",
 *     "trace": [ { "order": 1, "action": "PLACE", "value": 11 },
 *                { "order": 2, "action": "SUBMIT", "value": null } ],
 *     "explanation": "...",
 *     "expectedLabel": "OPERATIONAL_EQUAL",
 *     "statedCorrectMissing": 4,
 *     "annotation": "why that label is justified"
 *   }
 *
 * `expectedProbeId` is derived from the label, never read from the file, so a
 * holdout file cannot break the deterministic map. Every holdout case goes
 * through the same engine consistency check as the authored ones.
 */

import { readFileSync } from 'node:fs';
import type { RouteInput, TraceEvent } from './contract.ts';
import { LABEL_TO_PROBE, isLabel } from './contract.ts';
import { buildCaseFacts } from './equation.ts';
import { FIXTURES, type Fixture } from './fixtures.ts';

const TRACE_ACTIONS = ['PLACE', 'REPLACE', 'ERASE', 'SUBMIT'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseTrace(raw: unknown, id: string): readonly TraceEvent[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error(`Fixture ${id}: "trace" must be a non-empty array`);
  }
  return raw.map((entry, index) => {
    if (!isRecord(entry)) throw new Error(`Fixture ${id}: trace[${index}] is not an object`);
    const action = entry.action;
    if (typeof action !== 'string' || !(TRACE_ACTIONS as readonly string[]).includes(action)) {
      throw new Error(`Fixture ${id}: trace[${index}] has an unknown action "${String(action)}"`);
    }
    const value = entry.value;
    if (value !== null && !Number.isInteger(value)) {
      throw new Error(`Fixture ${id}: trace[${index}].value must be an integer or null`);
    }
    return {
      order: Number.isInteger(entry.order) ? (entry.order as number) : index + 1,
      action: action as TraceEvent['action'],
      value: value as number | null,
    };
  });
}

/** Parse one holdout entry into a `Fixture`. Throws on any shape problem. */
function parseHoldout(raw: unknown, index: number): Fixture {
  if (!isRecord(raw)) throw new Error(`Holdout entry ${index} is not an object`);
  const id = typeof raw.id === 'string' && raw.id.length > 0 ? raw.id : `HOLDOUT-${index + 1}`;
  if (typeof raw.equation !== 'string') throw new Error(`Fixture ${id}: "equation" must be a string`);
  if (typeof raw.explanation !== 'string') {
    throw new Error(`Fixture ${id}: "explanation" must be a string`);
  }
  if (!isLabel(raw.expectedLabel)) {
    throw new Error(`Fixture ${id}: "expectedLabel" must be one of the four contract labels`);
  }
  if (!Number.isInteger(raw.statedCorrectMissing)) {
    throw new Error(`Fixture ${id}: "statedCorrectMissing" must be an integer`);
  }
  return {
    id,
    group: typeof raw.group === 'string' && raw.group.length > 0 ? raw.group : 'holdout',
    equation: raw.equation,
    trace: parseTrace(raw.trace, id),
    explanation: raw.explanation,
    expectedLabel: raw.expectedLabel,
    expectedProbeId: LABEL_TO_PROBE[raw.expectedLabel],
    statedCorrectMissing: raw.statedCorrectMissing as number,
    annotation: typeof raw.annotation === 'string' ? raw.annotation : '(no annotation supplied)',
    source: 'holdout',
  };
}

export function loadFixtures(extraFixturesPath?: string): readonly Fixture[] {
  const all: Fixture[] = [...FIXTURES];
  if (extraFixturesPath) {
    const parsed: unknown = JSON.parse(readFileSync(extraFixturesPath, 'utf8'));
    if (!Array.isArray(parsed)) {
      throw new Error(`${extraFixturesPath}: expected a JSON array of fixture objects`);
    }
    parsed.forEach((entry, index) => all.push(parseHoldout(entry, index)));
  }
  const seen = new Set<string>();
  for (const fixture of all) {
    if (seen.has(fixture.id)) throw new Error(`Duplicate fixture id: ${fixture.id}`);
    seen.add(fixture.id);
  }
  return all;
}

/**
 * Build the identical input handed to both routes. It carries no group name,
 * no expected label and no annotation, so neither route can see the answer.
 */
export function toRouteInput(fixture: Fixture): RouteInput {
  return {
    caseId: fixture.id,
    equation: fixture.equation,
    facts: buildCaseFacts(fixture.equation, fixture.trace),
    trace: fixture.trace,
    explanation: fixture.explanation,
  };
}

/** Read `--extra-fixtures <path>` from an argv slice. */
export function readExtraFixturesArg(argv: readonly string[]): string | undefined {
  const index = argv.indexOf('--extra-fixtures');
  if (index === -1) return undefined;
  const value = argv[index + 1];
  if (!value) throw new Error('--extra-fixtures needs a file path');
  return value;
}
