import { describe, expect, it } from 'vitest';
import {
  inferRule,
  judgeMastery,
  lengthRuleSignature,
  mostDiagnostic,
  scorePlacement,
  type ScoredPlacement,
} from '../src/engine/classifier.ts';
import {
  buildPlaceRound,
  buildTransferRound,
  predictedByL,
  predictedByS,
  type Item,
} from '../src/engine/items.ts';

type Responder = (item: Item) => boolean;

/** Answer as if the learner follows a rule: returns "is the target larger?". */
const asL: Responder = (item) => predictedByL(item);
const asS: Responder = (item) => predictedByS(item);
const asExpert: Responder = (item) => item.target.t > item.anchor.t;

function place(item: Item, treatTargetAsLarger: boolean, attempt = 1): ScoredPlacement {
  // Drop 60 thousandths to the correct side of the anchor.
  const offset = treatTargetAsLarger ? 60 : -60;
  const placed = Math.min(1000, Math.max(0, item.anchor.t + offset));
  return { item, placement: scorePlacement(item, placed, attempt) };
}

function run(items: readonly Item[], responder: Responder): ScoredPlacement[] {
  return items.map((item) => place(item, responder(item)));
}

const round = buildPlaceRound(4, 4242);

describe('rule classifier', () => {
  it('codes a consistent longer-is-larger learner as L', () => {
    const inference = inferRule(run(round, asL));
    expect(inference.code).toBe('L');
    expect(inference.type1Correct).toBe(0);
    expect(inference.type2Correct).toBe(4);
    expect(inference.enoughEvidence).toBe(true);
  });

  it('codes a consistent shorter-is-larger learner as S', () => {
    const inference = inferRule(run(round, asS));
    expect(inference.code).toBe('S');
    expect(inference.type1Correct).toBe(4);
    expect(inference.type2Correct).toBe(0);
  });

  it('codes a correct learner as A', () => {
    expect(inferRule(run(round, asExpert)).code).toBe('A');
  });

  it('codes a mixed pattern as U', () => {
    const mixed = round.map((item, index) =>
      place(item, index % 3 === 0),
    );
    expect(inferRule(mixed).code).toBe('U');
  });

  it('tolerates exactly one deviation, per the paper coarse coding', () => {
    const almostL = run(round, asL);
    // Flip one Type 1 answer to correct: still L (at most 1 correct on Type 1).
    const firstT1 = almostL.findIndex((s) => s.item.type === 'T1');
    almostL[firstT1] = place(almostL[firstT1]!.item, asExpert(almostL[firstT1]!.item));
    expect(inferRule(almostL).code).toBe('L');

    // Flip a second Type 1 answer: now 2 correct, no longer L.
    const secondT1 = almostL.findIndex(
      (s, i) => s.item.type === 'T1' && i !== firstT1,
    );
    almostL[secondT1] = place(almostL[secondT1]!.item, asExpert(almostL[secondT1]!.item));
    expect(inferRule(almostL).code).toBe('U');
  });

  it('breaks A when two Type 2 answers are wrong', () => {
    const nearlyExpert = run(round, asExpert);
    const t2 = nearlyExpert
      .map((s, i) => ({ s, i }))
      .filter((x) => x.s.item.type === 'T2')
      .slice(0, 2);
    for (const { s, i } of t2) nearlyExpert[i] = place(s.item, !asExpert(s.item));
    expect(inferRule(nearlyExpert).code).not.toBe('A');
  });

  it('ignores retries: only first attempts are scored', () => {
    const scored = run(round, asL);
    const retries = scored.map((s) => place(s.item, asExpert(s.item), 2));
    expect(inferRule([...scored, ...retries]).code).toBe('L');
  });

  it('needs four of each type before it claims enough evidence', () => {
    const short = run(buildPlaceRound(2, 7), asL);
    expect(inferRule(short).enoughEvidence).toBe(false);
  });

  it('records signed position error so guessers are visible', () => {
    const inference = inferRule(run(round, asL));
    expect(Number.isFinite(inference.meanSignedError)).toBe(true);
  });

  it('picks the largest wrong placement as the diagnostic item', () => {
    const scored = run(round, asL);
    const pick = mostDiagnostic(scored);
    expect(pick).toBeDefined();
    expect(pick?.placement.correct).toBe(false);
    expect(pick?.item.type).toBe('T1');
  });

  it('returns no diagnostic item when everything was right', () => {
    expect(mostDiagnostic(run(round, asExpert))).toBeUndefined();
  });
});

describe('transfer mastery', () => {
  const transfer = buildTransferRound(2);

  it('passes a learner who gets all five right without a length signature', () => {
    const scored = transfer.map((item) => {
      if (item.target.t === item.anchor.t) {
        return { item, placement: scorePlacement(item, item.anchor.t, 1) };
      }
      return place(item, item.target.t > item.anchor.t);
    });
    const result = judgeMastery(scored);
    expect(result.correct).toBe(5);
    expect(result.signature).toBe(false);
    expect(result.mastered).toBe(true);
  });

  it('fails a learner who still uses the length rule', () => {
    const scored = transfer.map((item) => place(item, predictedByL(item)));
    const result = judgeMastery(scored);
    expect(result.mastered).toBe(false);
    expect(lengthRuleSignature(scored).present).toBe(true);
    expect(lengthRuleSignature(scored).lHits).toBeGreaterThanOrEqual(2);
  });

  it('flags a shorter-is-larger signature too', () => {
    const scored = transfer.map((item) => place(item, predictedByS(item)));
    expect(lengthRuleSignature(scored).sHits).toBeGreaterThanOrEqual(2);
  });
});

describe('placement scoring', () => {
  const item = buildPlaceRound(4, 1).find((i) => i.type === 'T1')!;

  it('is correct when the target lands on the right side of the anchor', () => {
    const correctSide = item.target.t > item.anchor.t ? 60 : -60;
    expect(scorePlacement(item, item.anchor.t + correctSide, 1).correct).toBe(true);
    expect(scorePlacement(item, item.anchor.t - correctSide, 1).correct).toBe(false);
  });

  it('uses a tolerance for the equal-value trailing zero item', () => {
    const equalItem = buildTransferRound(2).find((i) => i.transferKind === 'trailing-zero')!;
    expect(scorePlacement(equalItem, equalItem.anchor.t, 1).correct).toBe(true);
    expect(scorePlacement(equalItem, equalItem.anchor.t + 10, 1).correct).toBe(true);
    expect(scorePlacement(equalItem, equalItem.anchor.t + 100, 1).correct).toBe(false);
  });
});
