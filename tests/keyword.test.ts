import { describe, expect, it } from 'vitest';
import { classifyByKeyword } from '../src/ai/keyword.ts';
import { CONFIDENCE_GATE, gate } from '../src/ai/labels.ts';
import { FIXTURES, SEED_FIXTURES } from '../scripts/explanation-fixtures.ts';

describe('keyword fallback classifier', () => {
  it('labels the ten seed explanations exactly as the table is documented to', () => {
    for (const fixture of SEED_FIXTURES) {
      const result = classifyByKeyword(fixture.text, {
        allowValid: fixture.step === 'correction',
      });
      expect(`${fixture.id}:${result.label}`).toBe(
        `${fixture.id}:${fixture.keywordExpected ?? fixture.expected}`,
      );
    }
  });

  it('agrees with the adult label on at least seven of the ten seeds', () => {
    const agree = SEED_FIXTURES.filter(
      (f) => classifyByKeyword(f.text).label === f.expected,
    ).length;
    expect(agree).toBeGreaterThanOrEqual(7);
  });

  it('matches the documented behaviour on every fixture', () => {
    for (const fixture of FIXTURES) {
      const result = classifyByKeyword(fixture.text, {
        allowValid: fixture.step === 'correction',
      });
      expect(`${fixture.id}:${result.label}`).toBe(
        `${fixture.id}:${fixture.keywordExpected ?? fixture.expected}`,
      );
    }
  });

  it('checks an admitted slip before a length-rule pattern', () => {
    const text = 'I know 0.8 is bigger than 0.45 but I clicked the wrong spot';
    expect(classifyByKeyword(text).label).toBe('SLIP');
  });

  it('checks a currency word before a length-rule pattern', () => {
    const text = '45 cents is bigger than 8 cents';
    expect(classifyByKeyword(text).label).toBe('MONEY');
  });

  it('returns UNCLEAR for empty text without calling anything else', () => {
    const result = classifyByKeyword('   ');
    expect(result.label).toBe('UNCLEAR');
    expect(result.source).toBe('empty');
  });

  it('only offers VALID at the correction step', () => {
    const text = '0.8 is the same as 0.80';
    expect(classifyByKeyword(text, { allowValid: true }).label).toBe('VALID');
    expect(classifyByKeyword(text, { allowValid: false }).label).not.toBe('VALID');
  });

  it('never returns a label below the confidence gate', () => {
    for (const fixture of FIXTURES) {
      const result = classifyByKeyword(fixture.text, {
        allowValid: fixture.step === 'correction',
      });
      if (result.confidence < CONFIDENCE_GATE) {
        expect(result.label).toBe('UNCLEAR');
      }
    }
  });
});

describe('confidence gate', () => {
  it('rewrites a low confidence label as UNCLEAR', () => {
    expect(
      gate({ label: 'L', confidence: 0.4, source: 'model', note: 'model' }).label,
    ).toBe('UNCLEAR');
    expect(
      gate({ label: 'L', confidence: 0.9, source: 'model', note: 'model' }).label,
    ).toBe('L');
  });
});
