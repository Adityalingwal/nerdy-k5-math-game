import { describe, expect, it } from 'vitest';
import { isGreater } from '../src/engine/decimal.ts';
import {
  ALTERNATE_BOTH_RULES,
  buildPlaceRound,
  buildTransferRound,
  predictedByL,
  predictedByS,
  TRANSFER_ITEMS,
  TYPE_1_ITEMS,
  TYPE_2_ITEMS,
} from '../src/engine/items.ts';

describe('item bank structure', () => {
  it('Type 1 items have the longer decimal smaller (L fails, S passes)', () => {
    for (const it of TYPE_1_ITEMS) {
      expect(it.target.places).toBeGreaterThan(it.anchor.places);
      expect(isGreater(it.target, it.anchor)).toBe(false);
      // The L rule predicts the target is larger, which is wrong here.
      expect(predictedByL(it)).toBe(true);
      expect(predictedByS(it)).toBe(false);
    }
  });

  it('Type 2 items have the longer decimal larger (S fails, L passes)', () => {
    for (const it of TYPE_2_ITEMS) {
      expect(it.target.places).toBeGreaterThan(it.anchor.places);
      expect(isGreater(it.target, it.anchor)).toBe(true);
      expect(predictedByL(it)).toBe(true);
      expect(predictedByS(it)).toBe(false);
    }
  });

  it('every item stays inside the 0-1 dock', () => {
    for (const it of [...TYPE_1_ITEMS, ...TYPE_2_ITEMS, ...TRANSFER_ITEMS]) {
      expect(it.anchor.t).toBeGreaterThanOrEqual(0);
      expect(it.anchor.t).toBeLessThanOrEqual(1000);
      expect(it.target.t).toBeGreaterThanOrEqual(0);
      expect(it.target.t).toBeLessThanOrEqual(1000);
    }
  });

  it('has at least four items of each classification type', () => {
    expect(TYPE_1_ITEMS.length).toBeGreaterThanOrEqual(4);
    expect(TYPE_2_ITEMS.length).toBeGreaterThanOrEqual(4);
  });

  it('has the five transfer kinds', () => {
    expect(TRANSFER_ITEMS.map((i) => i.transferKind)).toEqual([
      'both-rules',
      'trailing-zero',
      'tenths-tie',
      'money',
      'measurement',
    ]);
    expect(ALTERNATE_BOTH_RULES.transferKind).toBe('both-rules');
  });

  it('builds an interleaved place round of the requested size', () => {
    const round = buildPlaceRound(4, 12345);
    expect(round).toHaveLength(8);
    expect(round.filter((i) => i.type === 'T1')).toHaveLength(4);
    expect(round.filter((i) => i.type === 'T2')).toHaveLength(4);
    for (let i = 0; i + 1 < round.length; i += 2) {
      expect(round[i]?.type).toBe('T1');
      expect(round[i + 1]?.type).toBe('T2');
    }
  });

  it('builds a five item transfer round', () => {
    expect(buildTransferRound(2)).toHaveLength(5);
    expect(buildTransferRound(3)).toHaveLength(5);
    expect(buildTransferRound(3)[0]?.id).toBe(ALTERNATE_BOTH_RULES.id);
  });

  it('reshuffles with a different seed', () => {
    const a = buildPlaceRound(4, 1).map((i) => i.id).join();
    const b = buildPlaceRound(4, 999).map((i) => i.id).join();
    expect(a).not.toBe(b);
  });
});
