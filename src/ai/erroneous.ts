/**
 * Erroneous examples ("Robo's delivery log").
 *
 * The engine chooses the pair and the wrong answer BEFORE any model call, so
 * the model only ever supplies wording. Everything a model returns is checked
 * by `verifyErroneousExample` before it can reach the learner.
 */

import {
  type Dec,
  type Separator,
  format,
  formatAtPlaces,
  fractionDigits,
  isGreater,
  MAX_PLACES,
} from '../engine/decimal.ts';
import { type Item, TYPE_1_ITEMS, TYPE_2_ITEMS } from '../engine/items.ts';

export type LengthRule = 'L' | 'S';

export interface ErroneousTask {
  /** The rule Robo is imitating. */
  readonly rule: LengthRule;
  /** The engine-chosen pair. */
  readonly item: Item;
  /** The package Robo wrongly calls larger. */
  readonly wrongLarger: Dec;
  /** The package that really is larger. */
  readonly trueLarger: Dec;
}

export interface ErroneousExample {
  readonly peerClaim: string;
  readonly peerReason: string;
}

/** Pairs used for L-rule erroneous examples: the longer decimal is smaller. */
export const L_TASK_ITEMS: readonly Item[] = TYPE_1_ITEMS.slice(0, 6);
/** Pairs used for S-rule erroneous examples: the longer decimal is larger. */
export const S_TASK_ITEMS: readonly Item[] = TYPE_2_ITEMS.slice(0, 6);

export function taskItemsFor(rule: LengthRule): readonly Item[] {
  return rule === 'L' ? L_TASK_ITEMS : S_TASK_ITEMS;
}

/** Build the task for a chosen pair. */
export function buildTask(rule: LengthRule, item: Item): ErroneousTask {
  // For L the mistake is "the longer one wins", for S "the shorter one wins".
  // In every item the target is the longer decimal and the anchor the shorter.
  const wrongLarger = rule === 'L' ? item.target : item.anchor;
  const trueLarger = isGreater(item.target, item.anchor) ? item.target : item.anchor;
  return { rule, item, wrongLarger, trueLarger };
}

/** Pick the nth pair for a rule (round-robin, so a second example differs). */
export function pickTask(rule: LengthRule, index: number): ErroneousTask {
  const items = taskItemsFor(rule);
  const item = items[index % items.length];
  if (!item) throw new Error(`No erroneous-example item for rule ${rule}`);
  return buildTask(rule, item);
}

/* ------------------------------------------------------------------ */
/* Verification (plan 4.3) - engine owned, runs on every model output. */
/* ------------------------------------------------------------------ */

export const MAX_EXAMPLE_WORDS = 40;

export type RejectReason =
  | 'empty'
  | 'too-many-words'
  | 'missing-pair'
  | 'third-number'
  | 'no-comparison'
  | 'claim-is-correct'
  | 'wrong-claimed-larger';

export interface VerificationResult {
  readonly ok: boolean;
  readonly reason?: RejectReason;
}

/** Every numeric token the output is allowed to contain. */
function allowedNumberTokens(task: ErroneousTask, separator: Separator): Set<string> {
  const allowed = new Set<string>();
  for (const value of [task.item.anchor, task.item.target]) {
    for (const places of range(value.places, MAX_PLACES)) {
      let text: string;
      try {
        text = formatAtPlaces(value, places, { separator });
      } catch {
        continue;
      }
      allowed.add(normaliseToken(text));
      allowed.add(normaliseToken(formatAtPlaces(value, places, { separator: '.' })));
      allowed.add(normaliseToken(formatAtPlaces(value, places, { separator: ',' })));
    }
    // A faithful L-rule reason compares the bare digits after the point
    // ("because 45 beats 8"), so those integers are allowed too.
    const digits = fractionDigits(value);
    allowed.add(normaliseToken(digits));
    allowed.add(normaliseToken(String(Number(digits))));
  }
  return allowed;
}

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from; i <= to; i += 1) out.push(i);
  return out;
}

function normaliseToken(token: string): string {
  return token.replace(',', '.').replace(/^0+(?=\d)/, '');
}

/** All numeric tokens in a piece of text, separator-aware. */
export function numberTokens(text: string): string[] {
  return text.match(/\d+(?:[.,]\d+)?/g) ?? [];
}

const LARGER_WORDS = /\b(bigger|larger|more|greater|higher|heavier|beats|wins over|tops)\b/i;
const SMALLER_WORDS = /\b(smaller|less|lower|lighter|tinier|loses to)\b/i;

/**
 * Which decimal does the claim say is larger?
 * Returns the matched decimal's normalised token, or undefined.
 */
export function claimedLarger(claim: string): string | undefined {
  const tokens = numberTokens(claim);
  if (tokens.length < 2) return undefined;
  const first = normaliseToken(tokens[0] as string);
  const second = normaliseToken(tokens[1] as string);
  const firstIndex = claim.indexOf(tokens[0] as string);
  const secondIndex = claim.indexOf(tokens[1] as string, firstIndex + 1);
  const between = claim.slice(firstIndex, secondIndex);
  if (LARGER_WORDS.test(between)) return first;
  if (SMALLER_WORDS.test(between)) return second;
  // "0.75 wins." style: comparison word after both numbers.
  const tail = claim.slice(secondIndex);
  if (LARGER_WORDS.test(tail)) return second;
  if (SMALLER_WORDS.test(tail)) return first;
  return undefined;
}

/**
 * Reject anything that could teach the learner the wrong thing:
 * a pair that is not the engine's pair, an extra number, a claim that is
 * actually correct, a claim naming the wrong package, or more than 40 words.
 */
export function verifyErroneousExample(
  example: ErroneousExample,
  task: ErroneousTask,
  separator: Separator = '.',
): VerificationResult {
  const claim = (example.peerClaim ?? '').trim();
  const reason = (example.peerReason ?? '').trim();
  if (claim.length === 0 || reason.length === 0) return { ok: false, reason: 'empty' };

  const words = `${claim} ${reason}`.trim().split(/\s+/).filter(Boolean);
  if (words.length > MAX_EXAMPLE_WORDS) return { ok: false, reason: 'too-many-words' };

  const allowed = allowedNumberTokens(task, separator);
  const claimTokens = numberTokens(claim).map(normaliseToken);
  const allTokens = [...claimTokens, ...numberTokens(reason).map(normaliseToken)];
  for (const token of allTokens) {
    if (!allowed.has(token)) return { ok: false, reason: 'third-number' };
  }

  const anchorForms = new Set(
    range(task.item.anchor.places, MAX_PLACES).map((p) =>
      normaliseToken(formatAtPlaces(task.item.anchor, p, { separator: '.' })),
    ),
  );
  const targetForms = new Set(
    range(task.item.target.places, MAX_PLACES).map((p) =>
      normaliseToken(formatAtPlaces(task.item.target, p, { separator: '.' })),
    ),
  );
  const mentionsAnchor = claimTokens.some((t) => anchorForms.has(t));
  const mentionsTarget = claimTokens.some((t) => targetForms.has(t));
  if (!mentionsAnchor || !mentionsTarget) return { ok: false, reason: 'missing-pair' };

  const claimed = claimedLarger(claim);
  if (!claimed) return { ok: false, reason: 'no-comparison' };

  const wrongIsAnchor =
    task.wrongLarger.t === task.item.anchor.t &&
    task.wrongLarger.places === task.item.anchor.places;
  const wrongForms = wrongIsAnchor ? anchorForms : targetForms;
  const trueForms = wrongIsAnchor ? targetForms : anchorForms;
  if (trueForms.has(claimed)) return { ok: false, reason: 'claim-is-correct' };
  if (!wrongForms.has(claimed)) return { ok: false, reason: 'wrong-claimed-larger' };
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Authored fallback bank: 6 examples per rule.                        */
/* ------------------------------------------------------------------ */

interface BankEntry {
  readonly rule: LengthRule;
  readonly itemId: string;
  readonly peerClaim: string;
  readonly peerReason: string;
}

const BANK: readonly BankEntry[] = [
  // L rule: Robo believes the longer decimal wins.
  {
    rule: 'L',
    itemId: 't1-05-036',
    peerClaim: '0.36 is bigger than 0.5.',
    peerReason: 'It has two numbers after the point, so it must be worth more.',
  },
  {
    rule: 'L',
    itemId: 't1-08-075',
    peerClaim: '0.75 is bigger than 0.8.',
    peerReason: 'It runs on for longer after the point, so it is the heavier box.',
  },
  {
    rule: 'L',
    itemId: 't1-037-0216',
    peerClaim: '0.216 is bigger than 0.37.',
    peerReason: 'It has the most digits after the point, so it goes furthest right.',
  },
  {
    rule: 'L',
    itemId: 't1-08-063',
    peerClaim: '0.63 is bigger than 0.8.',
    peerReason: 'Two digits after the point beat one digit, so this one wins.',
  },
  {
    rule: 'L',
    itemId: 't1-07-0485',
    peerClaim: '0.485 is bigger than 0.7.',
    peerReason: 'The longer number after the point must be the bigger number.',
  },
  {
    rule: 'L',
    itemId: 't1-06-0512',
    peerClaim: '0.512 is bigger than 0.6.',
    peerReason: 'More digits after the point means a bigger load, so it sits further right.',
  },
  // S rule: Robo believes the shorter decimal wins.
  {
    rule: 'S',
    itemId: 't2-05-075',
    peerClaim: '0.5 is bigger than 0.75.',
    peerReason: 'Fewer digits after the point means bigger, because extra digits are tiny bits.',
  },
  {
    rule: 'S',
    itemId: 't2-03-0426',
    peerClaim: '0.3 is bigger than 0.426.',
    peerReason: 'The short one wins, because a longer tail is made of smaller pieces.',
  },
  {
    rule: 'S',
    itemId: 't2-062-0736',
    peerClaim: '0.62 is bigger than 0.736.',
    peerReason: 'The shorter number is bigger, because three digits means tiny little parts.',
  },
  {
    rule: 'S',
    itemId: 't2-052-0836',
    peerClaim: '0.52 is bigger than 0.836.',
    peerReason: 'The shorter one wins, because a longer tail is only tiny crumbs.',
  },
  {
    rule: 'S',
    itemId: 't2-05-061',
    peerClaim: '0.5 is bigger than 0.61.',
    peerReason: 'Fewer digits after the point means a bigger box, so the short one wins.',
  },
  {
    rule: 'S',
    itemId: 't2-043-0542',
    peerClaim: '0.43 is bigger than 0.542.',
    peerReason: 'The shorter tail wins, because longer tails are only small crumbs.',
  },
];

export const AUTHORED_BANK = BANK;

/** Authored example for the engine-chosen task. Always defined. */
export function bankExample(task: ErroneousTask): ErroneousExample {
  const entry = BANK.find(
    (b) => b.rule === task.rule && b.itemId === task.item.id,
  );
  if (!entry) {
    throw new Error(
      `No authored erroneous example for ${task.rule}/${task.item.id}`,
    );
  }
  return { peerClaim: entry.peerClaim, peerReason: entry.peerReason };
}

/** Rewrite an authored example for a non-default separator. */
export function withSeparator(
  example: ErroneousExample,
  _task: ErroneousTask,
  separator: Separator,
): ErroneousExample {
  if (separator === '.') return example;
  const swap = (text: string) =>
    text.replace(/\d+\.\d+/g, (m) => m.replace('.', separator));
  return { peerClaim: swap(example.peerClaim), peerReason: swap(example.peerReason) };
}

/** Human-readable pair description used in prompts and the UI. */
export function describeTask(task: ErroneousTask, separator: Separator = '.'): string {
  return `${format(task.item.anchor, { separator })} vs ${format(task.item.target, {
    separator,
  })}`;
}
