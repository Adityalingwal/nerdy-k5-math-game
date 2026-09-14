/**
 * Deterministic keyword and pattern classifier.
 *
 * This is the fallback path: the whole game works with the model switched off
 * and it also runs whenever the model call fails, times out, or comes back
 * unparseable. It is intentionally a competent hand-authored table, not a
 * strawman, so the AI value test measures a fair comparison.
 *
 * Check order matters. An admitted slip and a money framing are checked before
 * the length-rule patterns, because a slip sentence usually also contains a
 * correct-sounding digit comparison ("I know 0.8 is bigger ... but I clicked
 * the wrong spot").
 */

import { type Classification, gate } from './labels.ts';

const SLIP_PATTERNS: readonly RegExp[] = [
  /\boops\b/i,
  /\bsorry\b/i,
  /by accident\b/i,
  /\baccident(ally)?\b/i,
  /\bmis-?click/i,
  /clicked? the wrong/i,
  /wrong (spot|place|side|way)/i,
  /(didn'?t|did not) mean to/i,
  /\bmeant to (put|place|drop)/i,
  /\bslipped\b/i,
];

const MONEY_PATTERNS: readonly RegExp[] = [
  /\bdollars?\b/i,
  /\bcents?\b/i,
  /\brupees?\b/i,
  /\bpaise\b/i,
  /\bpounds?\b/i,
  /\beuros?\b/i,
  /\bpence\b/i,
  /\bmoney\b/i,
  /\bprice\b/i,
  /\bcosts?\b/i,
  /[$£€₹]/,
];

const GUESS_PATTERNS: readonly RegExp[] = [
  /\bidk\b/i,
  /\bi (don'?t|do not) know\b/i,
  /\bno idea\b/i,
  /\bguess(ed|ing)?\b/i,
  /just (picked|chose|clicked)/i,
  /\brandom(ly)?\b/i,
  /\bnot sure\b/i,
  /looked? (about )?the same/i,
];

/** "longer is larger": more digits, or a bare whole-number digit comparison. */
const L_PATTERNS: readonly RegExp[] = [
  /(more|extra) (numbers?|digits?|places?)[^.]{0,30}\b(bigger|larger|more|greater|higher)\b/i,
  /\b(bigger|larger|more|greater|higher)\b[^.]{0,30}(more|extra) (numbers?|digits?|places?)/i,
  /\blonger\b[^.]{0,30}\b(bigger|larger|more|greater|wins)\b/i,
  /\b(bigger|larger|more|greater)\b[^.]{0,20}\blonger\b/i,
  /\b\d+\b[^.]{0,20}\b(is )?(bigger|larger|more|greater|higher) than\b[^.]{0,20}\b\d+\b/i,
  /(further|farther) (to the )?right[^.]{0,30}\b(bigger|larger|more)\b/i,
  /\b(bigger|larger|more)\b[^.]{0,30}(further|farther) (to the )?right/i,
  /(further|farther)[^.]{0,30}\bright\b[^.]{0,30}\b(bigger|larger|more)\b/i,
  /\bright\b[^.]{0,20}means[^.]{0,20}\b(bigger|larger|more)\b/i,
];

/** "shorter is larger": more decimal places read as smaller pieces. */
const S_PATTERNS: readonly RegExp[] = [
  /(more|extra) (numbers?|digits?|places?)[^.]{0,30}\b(smaller|less|tinier|lower)\b/i,
  /\b(smaller|less|tinier|lower)\b[^.]{0,30}(more|extra) (numbers?|digits?|places?)/i,
  /\blonger\b[^.]{0,30}\b(smaller|less|tinier)\b/i,
  /\bshorter\b[^.]{0,30}\b(bigger|larger|more|greater|wins)\b/i,
  /\b(fewer|less) (numbers?|digits?|places?)[^.]{0,30}\b(bigger|larger|more)\b/i,
  /(tiny|little|small) (bits?|pieces?|parts?)[^.]{0,40}\b(smaller|less)\b/i,
  /\bhundredths\b[^.]{0,30}\b(tiny|smaller|little)\b[^.]{0,40}\bsmaller\b/i,
];

/** Positional / place-value reasoning used at the correction step. */
const VALID_PATTERNS: readonly RegExp[] = [
  /\b(\d+ )?tenths?\b[^.]{0,40}\b(bigger|larger|more) than\b[^.]{0,40}\bhundredths?\b/i,
  /\bhundredths?\b[^.]{0,40}\b(smaller|less) than\b[^.]{0,40}\btenths?\b/i,
  /\bsame (spot|place|point|number|value)\b/i,
  /\bis the same as\b/i,
  /\b(zoom|zoomed|zooming)\b[^.]{0,40}\b(left|right|before|after|between|line)\b/i,
  /\bequal(s)?\b/i,
  /\bwrite\b[^.]{0,20}\bzero\b/i,
  /\badd(ing)? a zero\b/i,
  /\bplace value\b/i,
  /\b(tenths?|hundredths?|thousandths?) place\b/i,
  /\bcomes? (before|after)\b[^.]{0,30}\bline\b/i,
];

function anyMatch(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

function hasDigits(text: string): boolean {
  return /\d/.test(text);
}

export interface KeywordOptions {
  /** At the correction step the VALID label is available. */
  readonly allowValid?: boolean;
}

/**
 * Classify a learner explanation with the deterministic table.
 * Always returns a label; never throws.
 */
export function classifyByKeyword(
  rawText: string,
  options: KeywordOptions = {},
): Classification {
  const text = (rawText ?? '').trim();
  if (text.length === 0) {
    return { label: 'UNCLEAR', confidence: 1, source: 'empty', note: 'empty' };
  }

  const make = (
    label: Classification['label'],
    confidence: number,
    note: string,
  ): Classification => gate({ label, confidence, source: 'keyword', note });

  if (anyMatch(text, SLIP_PATTERNS)) return make('SLIP', 0.8, 'slip-phrase');
  if (anyMatch(text, MONEY_PATTERNS)) return make('MONEY', 0.75, 'currency-word');
  if (options.allowValid && anyMatch(text, VALID_PATTERNS)) {
    return make('VALID', 0.7, 'positional-phrase');
  }
  if (anyMatch(text, L_PATTERNS)) return make('L', 0.75, 'longer-is-larger-phrase');
  if (anyMatch(text, S_PATTERNS)) return make('S', 0.75, 'shorter-is-larger-phrase');
  if (anyMatch(text, GUESS_PATTERNS)) return make('GUESS', 0.7, 'uncertainty-phrase');
  if (!hasDigits(text)) return make('UNCLEAR', 0.65, 'no-numeric-reasoning');
  return make('UNCLEAR', 0.5, 'no-pattern-match');
}
