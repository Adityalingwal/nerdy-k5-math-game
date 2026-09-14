/**
 * Rule classifier: codes a session's placements as L, S, A or U.
 *
 * Coding follows Steinle and Stacey's tolerant coarse coding: one response
 * deviating from the expected pattern is still allowed.
 *
 *   L = at most 1 correct on Type 1 AND at least (n-1) correct on Type 2
 *   S = at least (n-1) correct on Type 1 AND at most 1 correct on Type 2
 *   A = at least (n-1) correct on both
 *   U = anything else
 *
 * The code is inferred per session from first attempts only. It is never
 * stored as a learner trait.
 */

import { type Item, predictedByL, predictedByS } from './items.ts';

export type RuleCode = 'L' | 'S' | 'A' | 'U';

export interface Placement {
  readonly itemId: string;
  /** Where the learner dropped the package, in thousandths. */
  readonly placedThousandths: number;
  /** Did the learner put the target on the correct side of the anchor? */
  readonly correct: boolean;
  /** placedThousandths - true value, in thousandths. Positive = too far right. */
  readonly signedError: number;
  /** Which side the learner chose: did they treat the target as larger? */
  readonly treatedTargetAsLarger: boolean;
  /** Only first attempts feed the rule code. */
  readonly attempt: number;
}

export interface RuleInference {
  readonly code: RuleCode;
  readonly type1Total: number;
  readonly type1Correct: number;
  readonly type2Total: number;
  readonly type2Correct: number;
  /** Mean signed position error in thousandths across scored placements. */
  readonly meanSignedError: number;
  /** True when at least 4 Type 1 and 4 Type 2 items were scored. */
  readonly enoughEvidence: boolean;
}

export interface ScoredPlacement {
  readonly item: Item;
  readonly placement: Placement;
}

/**
 * Score one drop. `placedThousandths` is the dock position the learner chose.
 * Correctness is side-of-anchor, mirroring the Decimal Comparison Test's
 * "circle the larger" response, except for the equal-value transfer item where
 * the learner must land on the anchor.
 */
export function scorePlacement(
  it: Item,
  placedThousandths: number,
  attempt: number,
  equalToleranceThousandths = 15,
): Placement {
  const anchor = it.anchor.t;
  const truth = it.target.t;
  const equalPair = truth === anchor;
  const treatedTargetAsLarger = placedThousandths > anchor;
  let correct: boolean;
  if (equalPair) {
    correct = Math.abs(placedThousandths - anchor) <= equalToleranceThousandths;
  } else {
    correct = treatedTargetAsLarger === truth > anchor;
  }
  return {
    itemId: it.id,
    placedThousandths,
    correct,
    signedError: placedThousandths - truth,
    treatedTargetAsLarger,
    attempt,
  };
}

/** Infer the session rule code from the scored PLACE round. */
export function inferRule(scored: readonly ScoredPlacement[]): RuleInference {
  const firstAttempts = scored.filter((s) => s.placement.attempt === 1);
  const t1 = firstAttempts.filter((s) => s.item.type === 'T1');
  const t2 = firstAttempts.filter((s) => s.item.type === 'T2');
  const n1 = t1.length;
  const n2 = t2.length;
  const c1 = t1.filter((s) => s.placement.correct).length;
  const c2 = t2.filter((s) => s.placement.correct).length;

  const meanSignedError =
    firstAttempts.length === 0
      ? 0
      : firstAttempts.reduce((sum, s) => sum + s.placement.signedError, 0) /
        firstAttempts.length;

  let code: RuleCode = 'U';
  if (n1 > 0 && n2 > 0) {
    const t1Nearly = c1 >= n1 - 1;
    const t2Nearly = c2 >= n2 - 1;
    const t1Failed = c1 <= 1;
    const t2Failed = c2 <= 1;
    if (t1Nearly && t2Nearly) code = 'A';
    else if (t1Failed && t2Nearly) code = 'L';
    else if (t1Nearly && t2Failed) code = 'S';
    else code = 'U';
  }

  return {
    code,
    type1Total: n1,
    type1Correct: c1,
    type2Total: n2,
    type2Correct: c2,
    meanSignedError,
    enoughEvidence: n1 >= 4 && n2 >= 4,
  };
}

/**
 * Length-rule signature on transfer items: how many wrong transfer placements
 * match what a length rule would predict. Two or more counts as a signature.
 */
export function lengthRuleSignature(scored: readonly ScoredPlacement[]): {
  lHits: number;
  sHits: number;
  present: boolean;
} {
  let lHits = 0;
  let sHits = 0;
  for (const s of scored) {
    if (s.item.type !== 'TRANSFER') continue;
    if (s.placement.attempt !== 1) continue;
    if (s.placement.correct) continue;
    if (s.placement.treatedTargetAsLarger === predictedByL(s.item)) lHits += 1;
    if (s.placement.treatedTargetAsLarger === predictedByS(s.item)) sHits += 1;
  }
  return { lHits, sHits, present: lHits >= 2 || sHits >= 2 };
}

export interface MasteryResult {
  readonly correct: number;
  readonly total: number;
  readonly signature: boolean;
  readonly mastered: boolean;
}

/** Mastery is judged on transfer items only: 4 of 5, no length-rule signature. */
export function judgeMastery(scored: readonly ScoredPlacement[]): MasteryResult {
  const transfer = scored.filter(
    (s) => s.item.type === 'TRANSFER' && s.placement.attempt === 1,
  );
  const correct = transfer.filter((s) => s.placement.correct).length;
  const { present } = lengthRuleSignature(scored);
  return {
    correct,
    total: transfer.length,
    signature: present,
    mastered: transfer.length > 0 && correct >= 4 && !present,
  };
}

/**
 * The most diagnostic wrong placement to replay in ZOOM: the wrong first
 * attempt whose position error is largest.
 */
export function mostDiagnostic(
  scored: readonly ScoredPlacement[],
): ScoredPlacement | undefined {
  const wrong = scored.filter(
    (s) => s.placement.attempt === 1 && !s.placement.correct && s.item.type !== 'TRANSFER',
  );
  if (wrong.length === 0) return undefined;
  return wrong.reduce((best, s) =>
    Math.abs(s.placement.signedError) > Math.abs(best.placement.signedError) ? s : best,
  );
}
