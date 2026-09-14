/**
 * Decimal values as exact integers.
 *
 * Every decimal in Decimal Dock is stored as an integer count of thousandths.
 * Floating-point comparison is never used for magnitude truth. The display
 * string is produced separately and honours a configurable separator, which
 * never changes the value.
 */

export const THOUSANDTHS = 1000;

/** Max decimal places the game supports (thousandths). */
export const MAX_PLACES = 3;

export interface Dec {
  /** Exact value as an integer number of thousandths. */
  readonly t: number;
  /** Number of decimal places the learner sees, e.g. 0.80 has places = 2. */
  readonly places: number;
}

export type Separator = '.' | ',';

export interface DisplayConfig {
  separator: Separator;
}

export const DEFAULT_DISPLAY: DisplayConfig = { separator: '.' };

/**
 * Build a Dec from a literal decimal string such as "0.45" or "0,45".
 * The number of written decimal places is preserved so "0.80" stays "0.80".
 */
export function dec(literal: string): Dec {
  const text = literal.trim().replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(text)) {
    throw new Error(`Not a decimal literal: ${literal}`);
  }
  const negative = text.startsWith('-');
  const body = negative ? text.slice(1) : text;
  const [whole = '0', frac = ''] = body.split('.');
  if (frac.length > MAX_PLACES) {
    throw new Error(`More than ${MAX_PLACES} decimal places: ${literal}`);
  }
  const padded = (frac + '000').slice(0, MAX_PLACES);
  const magnitude = Number(whole) * THOUSANDTHS + Number(padded);
  return { t: negative ? -magnitude : magnitude, places: frac.length };
}

/** Build a Dec directly from thousandths. */
export function fromThousandths(t: number, places = MAX_PLACES): Dec {
  if (!Number.isInteger(t)) throw new Error(`Not an integer: ${t}`);
  return { t, places };
}

/** Exact ordering. Returns a negative, zero, or positive number. */
export function compare(a: Dec, b: Dec): number {
  return a.t - b.t;
}

/** True when a is strictly greater than b. */
export function isGreater(a: Dec, b: Dec): boolean {
  return a.t > b.t;
}

/** True when the two values are numerically equal (0.8 equals 0.80). */
export function equals(a: Dec, b: Dec): boolean {
  return a.t === b.t;
}

/** Returns whichever of the two is larger. Ties return the first. */
export function larger(a: Dec, b: Dec): Dec {
  return a.t >= b.t ? a : b;
}

/** Value as a fraction of the 0-1 dock, clamped to [0, 1]. */
export function unitFraction(value: Dec): number {
  return Math.min(1, Math.max(0, value.t / THOUSANDTHS));
}

/** Exact numeric value. Use for rendering positions only, never for ordering. */
export function toNumber(value: Dec): number {
  return value.t / THOUSANDTHS;
}

/**
 * Display string at the value's own written precision.
 * `format(dec('0.80'))` -> "0.80"; `format(dec('0.8'))` -> "0.8".
 */
export function format(value: Dec, config: DisplayConfig = DEFAULT_DISPLAY): string {
  return formatAtPlaces(value, value.places, config);
}

/**
 * Display string rewritten to an explicit number of decimal places.
 * This is how the feedback ladder shows 0.8 as 0.80 next to 0.75.
 */
export function formatAtPlaces(
  value: Dec,
  places: number,
  config: DisplayConfig = DEFAULT_DISPLAY,
): string {
  if (places < 0 || places > MAX_PLACES) {
    throw new Error(`Unsupported places: ${places}`);
  }
  const negative = value.t < 0;
  const magnitude = Math.abs(value.t);
  const whole = Math.floor(magnitude / THOUSANDTHS);
  const fracAll = String(magnitude % THOUSANDTHS).padStart(MAX_PLACES, '0');
  const kept = fracAll.slice(0, places);
  const dropped = fracAll.slice(places);
  if (dropped.replace(/0/g, '').length > 0) {
    throw new Error(
      `Cannot show ${format(value)} at ${places} places without losing digits`,
    );
  }
  const sign = negative ? '-' : '';
  if (places === 0) return `${sign}${whole}`;
  return `${sign}${whole}${config.separator}${kept}`;
}

/** The number of decimal places actually needed to write the value exactly. */
export function significantPlaces(value: Dec): number {
  const fracAll = String(Math.abs(value.t) % THOUSANDTHS).padStart(MAX_PLACES, '0');
  const trimmed = fracAll.replace(/0+$/, '');
  return trimmed.length;
}

/** The digits after the point as an integer, ignoring trailing zeros. */
export function fractionDigits(value: Dec): string {
  const fracAll = String(Math.abs(value.t) % THOUSANDTHS).padStart(MAX_PLACES, '0');
  return fracAll.slice(0, value.places);
}
