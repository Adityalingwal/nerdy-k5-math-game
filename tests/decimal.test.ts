import { describe, expect, it } from 'vitest';
import {
  compare,
  dec,
  equals,
  format,
  formatAtPlaces,
  fractionDigits,
  fromThousandths,
  isGreater,
  significantPlaces,
  unitFraction,
} from '../src/engine/decimal.ts';

describe('decimal values are exact integers', () => {
  it('stores thousandths, not floats', () => {
    expect(dec('0.45').t).toBe(450);
    expect(dec('0.8').t).toBe(800);
    expect(dec('0.099').t).toBe(99);
    expect(dec('1').t).toBe(1000);
  });

  it('keeps the written number of places', () => {
    expect(dec('0.8').places).toBe(1);
    expect(dec('0.80').places).toBe(2);
    expect(dec('0.800').places).toBe(3);
  });

  it('compares without floating point error', () => {
    // 0.1 + 0.2 !== 0.3 in floats; integers make this exact.
    expect(compare(dec('0.1'), dec('0.099'))).toBeGreaterThan(0);
    expect(isGreater(dec('0.8'), dec('0.45'))).toBe(true);
    expect(isGreater(dec('0.75'), dec('0.8'))).toBe(false);
    expect(isGreater(dec('0.426'), dec('0.3'))).toBe(true);
  });

  it('treats 0.8 and 0.80 as the same value but different displays', () => {
    expect(equals(dec('0.8'), dec('0.80'))).toBe(true);
    expect(format(dec('0.8'))).toBe('0.8');
    expect(format(dec('0.80'))).toBe('0.80');
  });

  it('rewrites a value at more places for the feedback ladder', () => {
    expect(formatAtPlaces(dec('0.8'), 2)).toBe('0.80');
    expect(formatAtPlaces(dec('0.8'), 3)).toBe('0.800');
    expect(formatAtPlaces(dec('0.45'), 3)).toBe('0.450');
  });

  it('refuses to drop non-zero digits when shortening', () => {
    expect(() => formatAtPlaces(dec('0.45'), 1)).toThrow();
  });

  it('honours the separator without changing the value', () => {
    const value = dec('0.45');
    expect(format(value, { separator: ',' })).toBe('0,45');
    expect(format(value, { separator: '.' })).toBe('0.45');
    expect(dec('0,45').t).toBe(value.t);
  });

  it('rejects more than three decimal places and non-decimals', () => {
    expect(() => dec('0.4567')).toThrow();
    expect(() => dec('abc')).toThrow();
  });

  it('reports significant places and fraction digits', () => {
    expect(significantPlaces(dec('0.80'))).toBe(1);
    expect(significantPlaces(dec('0.45'))).toBe(2);
    expect(fractionDigits(dec('0.8'))).toBe('8');
    expect(fractionDigits(dec('0.45'))).toBe('45');
    expect(fractionDigits(dec('0.216'))).toBe('216');
  });

  it('maps values to dock positions', () => {
    expect(unitFraction(dec('0'))).toBe(0);
    expect(unitFraction(dec('0.5'))).toBe(0.5);
    expect(unitFraction(dec('1'))).toBe(1);
    expect(unitFraction(fromThousandths(1200))).toBe(1);
  });
});
