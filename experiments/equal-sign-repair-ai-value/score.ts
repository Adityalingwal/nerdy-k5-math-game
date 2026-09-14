/**
 * Scoring for one route over one pass of the fixture set.
 *
 * Probe agreement is identical to label agreement by construction, because the
 * probe is assigned by the deterministic `LABEL_TO_PROBE` map after validation.
 * Both are reported anyway, as the contract requires, and the identity is a
 * fact about the design rather than a measured coincidence.
 */

import type { FallbackReason, Label, ProbeId } from './contract.ts';
import { LABELS } from './contract.ts';

export interface CaseOutcome {
  readonly caseId: string;
  readonly group: string;
  readonly equation: string;
  readonly explanation: string;
  readonly placedValue: number | null;
  readonly correctMissing: number;
  readonly expectedLabel: Label;
  readonly expectedProbeId: ProbeId;
  readonly predictedLabel: Label;
  readonly predictedProbeId: ProbeId;
  readonly labelCorrect: boolean;
  readonly probeCorrect: boolean;
  readonly highRisk: boolean;
  /** Rule id for the baseline; fallback reason or "model" for the model route. */
  readonly decidedBy: string;
  readonly fallbackReason?: FallbackReason;
  readonly reportedConfidence?: number | null;
  readonly latencyMs?: number;
  readonly note: string;
}

export interface GroupScore {
  readonly group: string;
  readonly total: number;
  readonly correct: number;
}

export interface RouteScore {
  readonly route: string;
  readonly total: number;
  readonly labelAgreement: number;
  readonly probeAgreement: number;
  readonly labelAgreementPct: number;
  readonly probeAgreementPct: number;
  readonly confusion: Readonly<Record<Label, Readonly<Record<Label, number>>>>;
  readonly byGroup: readonly GroupScore[];
  readonly highRiskErrors: readonly CaseOutcome[];
  readonly fallbackCount: number;
  readonly fallbackBreakdown: Readonly<Record<string, number>>;
  readonly latencyP50Ms: number | null;
  readonly latencyP95Ms: number | null;
  readonly outcomes: readonly CaseOutcome[];
}

/** predicted OPERATIONAL_EQUAL where the adult label says valid reasoning or a slip. */
export function isHighRisk(expected: Label, predicted: Label): boolean {
  return (
    predicted === 'OPERATIONAL_EQUAL' &&
    (expected === 'RELATIONAL_VALID' || expected === 'ARITHMETIC_SLIP')
  );
}

function percentile(sorted: readonly number[], p: number): number | null {
  if (sorted.length === 0) return null;
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return Math.round((sorted[Math.max(0, index)] as number) * 10) / 10;
}

export function scoreRoute(route: string, outcomes: readonly CaseOutcome[]): RouteScore {
  const confusion = {} as Record<Label, Record<Label, number>>;
  for (const expected of LABELS) {
    confusion[expected] = {} as Record<Label, number>;
    for (const predicted of LABELS) confusion[expected][predicted] = 0;
  }

  const groups = new Map<string, { total: number; correct: number }>();
  const fallbackBreakdown: Record<string, number> = {};
  let labelAgreement = 0;
  let probeAgreement = 0;
  let fallbackCount = 0;
  const latencies: number[] = [];

  for (const outcome of outcomes) {
    (confusion[outcome.expectedLabel] as Record<Label, number>)[outcome.predictedLabel] += 1;
    if (outcome.labelCorrect) labelAgreement += 1;
    if (outcome.probeCorrect) probeAgreement += 1;
    const group = groups.get(outcome.group) ?? { total: 0, correct: 0 };
    group.total += 1;
    if (outcome.labelCorrect) group.correct += 1;
    groups.set(outcome.group, group);
    if (outcome.fallbackReason) {
      fallbackCount += 1;
      fallbackBreakdown[outcome.fallbackReason] =
        (fallbackBreakdown[outcome.fallbackReason] ?? 0) + 1;
    }
    if (typeof outcome.latencyMs === 'number') latencies.push(outcome.latencyMs);
  }

  const total = outcomes.length;
  const sortedLatency = [...latencies].sort((a, b) => a - b);

  return {
    route,
    total,
    labelAgreement,
    probeAgreement,
    labelAgreementPct: total === 0 ? 0 : Math.round((labelAgreement / total) * 1000) / 10,
    probeAgreementPct: total === 0 ? 0 : Math.round((probeAgreement / total) * 1000) / 10,
    confusion,
    byGroup: [...groups.entries()]
      .map(([group, value]) => ({ group, total: value.total, correct: value.correct }))
      .sort((a, b) => a.group.localeCompare(b.group)),
    highRiskErrors: outcomes.filter((o) => o.highRisk),
    fallbackCount,
    fallbackBreakdown,
    latencyP50Ms: percentile(sortedLatency, 50),
    latencyP95Ms: percentile(sortedLatency, 95),
    outcomes,
  };
}
