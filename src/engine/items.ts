/**
 * Item bank.
 *
 * Core comparison items follow Steinle and Stacey (PME27, 2003, Table 1):
 *   Type 1 - the LONGER decimal is SMALLER. L-thinkers ("longer is larger")
 *            fail these; S-thinkers ("shorter is larger") pass them.
 *   Type 2 - the LONGER decimal is LARGER. S-thinkers fail; L-thinkers pass.
 *
 * The dock runs from 0 to 1, so only the paper's 0-1 pairs are used verbatim
 * and the rest are structurally identical 0-1 pairs built the same way.
 *
 * Presentation convention: the SHORTER decimal is the anchor and is already
 * on the dock; the learner drags the LONGER decimal (the target). That makes
 * a wrong side-of-anchor placement a direct read-out of the length rule.
 */

import { type Dec, dec, isGreater, equals } from './decimal.ts';

export type ItemType = 'T1' | 'T2' | 'TRANSFER';

export type TransferKind =
  | 'both-rules'
  | 'trailing-zero'
  | 'tenths-tie'
  | 'money'
  | 'measurement';

export type ItemContext = 'plain' | 'money' | 'measurement';

export interface Item {
  readonly id: string;
  readonly type: ItemType;
  /** Already placed on the dock. */
  readonly anchor: Dec;
  /** The package the learner drags. */
  readonly target: Dec;
  readonly context: ItemContext;
  readonly transferKind?: TransferKind;
  /** Source note kept for the evidence trail. */
  readonly source: 'steinle-stacey-table-1' | 'structural-0-1' | 'transfer';
}

function item(
  id: string,
  type: ItemType,
  anchorLiteral: string,
  targetLiteral: string,
  source: Item['source'],
  extra: Partial<Item> = {},
): Item {
  return {
    id,
    type,
    anchor: dec(anchorLiteral),
    target: dec(targetLiteral),
    context: 'plain',
    source,
    ...extra,
  };
}

/** Type 1: longer decimal is smaller. */
export const TYPE_1_ITEMS: readonly Item[] = [
  // Verbatim 0-1 pairs from the paper's Table 1.
  item('t1-05-036', 'T1', '0.5', '0.36', 'steinle-stacey-table-1'),
  item('t1-08-075', 'T1', '0.8', '0.75', 'steinle-stacey-table-1'),
  item('t1-037-0216', 'T1', '0.37', '0.216', 'steinle-stacey-table-1'),
  // Structurally identical additions kept inside 0-1.
  item('t1-08-063', 'T1', '0.8', '0.63', 'structural-0-1'),
  item('t1-07-0485', 'T1', '0.7', '0.485', 'structural-0-1'),
  item('t1-06-0512', 'T1', '0.6', '0.512', 'structural-0-1'),
  item('t1-09-087', 'T1', '0.9', '0.87', 'structural-0-1'),
  item('t1-04-0325', 'T1', '0.4', '0.325', 'structural-0-1'),
];

/** Type 2: longer decimal is larger. */
export const TYPE_2_ITEMS: readonly Item[] = [
  // Verbatim 0-1 pairs from the paper's Table 1.
  item('t2-05-075', 'T2', '0.5', '0.75', 'steinle-stacey-table-1'),
  item('t2-03-0426', 'T2', '0.3', '0.426', 'steinle-stacey-table-1'),
  // Structurally identical additions kept inside 0-1.
  item('t2-062-0736', 'T2', '0.62', '0.736', 'structural-0-1'),
  item('t2-052-0836', 'T2', '0.52', '0.836', 'structural-0-1'),
  item('t2-05-061', 'T2', '0.5', '0.61', 'structural-0-1'),
  item('t2-043-0542', 'T2', '0.43', '0.542', 'structural-0-1'),
];

/**
 * Transfer items. Never used for L/S/A/U classification; they test whether the
 * learner can compare without leaning on either length rule.
 */
export const TRANSFER_ITEMS: readonly Item[] = [
  // Defeats a digit-count reading and the "a zero right after the point makes
  // it tiny" variant at the same time.
  item('tr-01-0099', 'TRANSFER', '0.1', '0.099', 'transfer', {
    transferKind: 'both-rules',
  }),
  // Trailing zero: the two packages name the same point on the dock.
  item('tr-08-080', 'TRANSFER', '0.8', '0.80', 'transfer', {
    transferKind: 'trailing-zero',
  }),
  // Same tenths digit: separates true experts from tenths-only comparers.
  item('tr-094-0942', 'TRANSFER', '0.94', '0.942', 'transfer', {
    transferKind: 'tenths-tie',
  }),
  // Money framing.
  item('tr-money-05-045', 'TRANSFER', '0.5', '0.45', 'transfer', {
    transferKind: 'money',
    context: 'money',
  }),
  // Measurement framing, scaled into the 0-1 dock.
  item('tr-measure-015-0105', 'TRANSFER', '0.15', '0.105', 'transfer', {
    transferKind: 'measurement',
    context: 'measurement',
  }),
];

/** Alternate both-rule item used when the loop is replayed. */
export const ALTERNATE_BOTH_RULES: Item = item(
  'tr-07-065',
  'TRANSFER',
  '0.7',
  '0.65',
  'transfer',
  { transferKind: 'both-rules' },
);

export const ALL_ITEMS: readonly Item[] = [
  ...TYPE_1_ITEMS,
  ...TYPE_2_ITEMS,
  ...TRANSFER_ITEMS,
  ALTERNATE_BOTH_RULES,
];

/** True when the dragged package really is larger than the anchor. */
export function targetIsLarger(it: Item): boolean {
  return isGreater(it.target, it.anchor);
}

/** True when the pair names the same point (the trailing-zero item). */
export function isEqualPair(it: Item): boolean {
  return equals(it.target, it.anchor);
}

/** Which decimal in the pair is actually larger. */
export function largerOf(it: Item): Dec {
  return isGreater(it.target, it.anchor) ? it.target : it.anchor;
}

/** What a longer-is-larger thinker would answer: is the target larger? */
export function predictedByL(it: Item): boolean {
  // The target is always written with at least as many places as the anchor.
  return it.target.places > it.anchor.places;
}

/** What a shorter-is-larger thinker would answer: is the target larger? */
export function predictedByS(it: Item): boolean {
  return it.target.places < it.anchor.places;
}

/** Deterministic, seedable shuffle so replays reshuffle but tests stay stable. */
export function shuffle<T>(list: readonly T[], seed: number): T[] {
  const out = list.slice();
  let state = seed >>> 0 || 1;
  const next = () => {
    // xorshift32
    state ^= state << 13;
    state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    const a = out[i] as T;
    const b = out[j] as T;
    out[i] = b;
    out[j] = a;
  }
  return out;
}

/**
 * Build the PLACE round: equal numbers of Type 1 and Type 2 items, interleaved
 * so the learner never sees a run of one type.
 */
export function buildPlaceRound(perType: number, seed: number): Item[] {
  const t1 = shuffle(TYPE_1_ITEMS, seed).slice(0, perType);
  const t2 = shuffle(TYPE_2_ITEMS, seed ^ 0x9e3779b9).slice(0, perType);
  const out: Item[] = [];
  for (let i = 0; i < perType; i += 1) {
    const a = t1[i];
    const b = t2[i];
    if (a) out.push(a);
    if (b) out.push(b);
  }
  return out;
}

/** Build the 5-item transfer round. */
export function buildTransferRound(seed: number): Item[] {
  const useAlternate = (seed & 1) === 1;
  return TRANSFER_ITEMS.map((it) =>
    it.transferKind === 'both-rules' && useAlternate ? ALTERNATE_BOTH_RULES : it,
  );
}
