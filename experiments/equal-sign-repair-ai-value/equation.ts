/**
 * Deterministic equation engine for the Equal-Sign Repair AI-value test.
 *
 * Handles small integer equations written with `+`, `-`, one `=` and exactly
 * one `?` blank, in any position: `6 + 5 = 7 + ?`, `? = 8 + 4`, `12 = ? + 4`,
 * `9 - 3 = ? + 2`, `3 + 4 + 2 = 3 + ?`.
 *
 * Every equation value in the experiment comes from here. Neither the rules
 * baseline nor the model is ever asked to do arithmetic.
 */

import type { CaseFacts, TraceEvent } from './contract.ts';

/** A side of the equation as `coef * blank + konst`. */
interface LinearForm {
  readonly coef: number;
  readonly konst: number;
}

export interface EquationFacts {
  readonly equation: string;
  readonly correctMissing: number;
  readonly knownSideTotal: number | null;
  readonly sumOfAllNumerals: number;
  readonly numeralsBeforeBlankSum: number;
}

function tokenize(equation: string): string[] {
  return equation
    .replace(/([+\-=?])/g, ' $1 ')
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

function parseSide(tokens: readonly string[], equation: string): LinearForm {
  let sign = 1;
  let coef = 0;
  let konst = 0;
  let expectTerm = true;
  for (const token of tokens) {
    if (expectTerm) {
      if (token === '?') {
        coef += sign;
      } else {
        const value = Number(token);
        if (!Number.isInteger(value)) {
          throw new Error(`Equation "${equation}": expected an integer term, got "${token}"`);
        }
        konst += sign * value;
      }
      expectTerm = false;
      continue;
    }
    if (token === '+') sign = 1;
    else if (token === '-') sign = -1;
    else throw new Error(`Equation "${equation}": expected + or -, got "${token}"`);
    expectTerm = true;
  }
  if (expectTerm) throw new Error(`Equation "${equation}": ends with an operator`);
  return { coef, konst };
}

/** Parse one equation and compute every deterministic fact about it. */
export function parseEquation(equation: string): EquationFacts {
  const tokens = tokenize(equation);
  const eqIndex = tokens.indexOf('=');
  if (eqIndex === -1 || tokens.indexOf('=', eqIndex + 1) !== -1) {
    throw new Error(`Equation "${equation}": exactly one "=" is required`);
  }
  const blanks = tokens.filter((t) => t === '?').length;
  if (blanks !== 1) {
    throw new Error(`Equation "${equation}": exactly one "?" is required, found ${blanks}`);
  }

  const left = parseSide(tokens.slice(0, eqIndex), equation);
  const right = parseSide(tokens.slice(eqIndex + 1), equation);

  const denominator = left.coef - right.coef;
  if (denominator === 0) {
    throw new Error(`Equation "${equation}": the blank cancels out`);
  }
  const correctMissing = (right.konst - left.konst) / denominator;
  if (!Number.isInteger(correctMissing)) {
    throw new Error(`Equation "${equation}": the missing value is not an integer`);
  }

  const knownSideTotal =
    left.coef === 0 ? left.konst : right.coef === 0 ? right.konst : null;

  const blankIndex = tokens.indexOf('?');
  let sumOfAllNumerals = 0;
  let numeralsBeforeBlankSum = 0;
  tokens.forEach((token, index) => {
    const value = Number(token);
    if (!Number.isInteger(value)) return;
    sumOfAllNumerals += value;
    if (index < blankIndex) numeralsBeforeBlankSum += value;
  });

  return {
    equation,
    correctMissing,
    knownSideTotal,
    sumOfAllNumerals,
    numeralsBeforeBlankSum,
  };
}

/** Final value the learner left in the blank, from the raw edit trace. */
export function placedValueFromTrace(trace: readonly TraceEvent[]): number | null {
  let placed: number | null = null;
  for (const event of trace) {
    if (event.action === 'PLACE' || event.action === 'REPLACE') placed = event.value;
    else if (event.action === 'ERASE') placed = null;
  }
  return placed;
}

/** Combine equation facts and the raw trace into the shared `CaseFacts`. */
export function buildCaseFacts(
  equation: string,
  trace: readonly TraceEvent[],
): CaseFacts {
  const facts = parseEquation(equation);
  const placedValue = placedValueFromTrace(trace);

  const placedEqualsKnownSideTotal =
    placedValue !== null && facts.knownSideTotal !== null && placedValue === facts.knownSideTotal;
  const placedEqualsSumOfAllNumerals =
    placedValue !== null && placedValue === facts.sumOfAllNumerals;
  const placedEqualsNumeralsBeforeBlankSum =
    placedValue !== null &&
    facts.numeralsBeforeBlankSum > 0 &&
    placedValue === facts.numeralsBeforeBlankSum;

  const editCount = trace.filter(
    (e) => e.action === 'PLACE' || e.action === 'REPLACE' || e.action === 'ERASE',
  ).length;

  return {
    knownSideTotal: facts.knownSideTotal,
    sumOfAllNumerals: facts.sumOfAllNumerals,
    numeralsBeforeBlankSum: facts.numeralsBeforeBlankSum,
    correctMissing: facts.correctMissing,
    placedValue,
    placedIsCorrect: placedValue !== null && placedValue === facts.correctMissing,
    placedOffBy: placedValue === null ? null : placedValue - facts.correctMissing,
    placedEqualsKnownSideTotal,
    placedEqualsSumOfAllNumerals,
    placedEqualsNumeralsBeforeBlankSum,
    diagnosticOperationalPlacement:
      placedEqualsKnownSideTotal ||
      placedEqualsSumOfAllNumerals ||
      placedEqualsNumeralsBeforeBlankSum,
    editCount,
    revised: trace.some((e) => e.action === 'REPLACE' || e.action === 'ERASE'),
  };
}
