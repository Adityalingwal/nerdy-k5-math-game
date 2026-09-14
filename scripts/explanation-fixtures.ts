/**
 * Synthetic learner explanations with adult-assigned expected labels.
 *
 * None of these came from a child. They are written by hand for the AI value
 * test and for the fallback-classifier unit tests.
 *
 * Cases 1-10 are the seed set from
 * `docs/research/deep/decimal-longer-is-larger.md` section 4, for the same
 * wrong placement: 0.45 dropped to the right of 0.8.
 *
 * `keywordExpected` records what the deterministic table actually produces
 * today. Where it differs from `expected`, that gap is the measured room for
 * the model - it is reported, not hidden.
 */

import type { Label } from '../src/ai/labels.ts';

export interface ExplanationFixture {
  readonly id: string;
  readonly text: string;
  /** Adult-assigned label. */
  readonly expected: Label;
  /** What the keyword table returns. Defaults to `expected`. */
  readonly keywordExpected?: Label;
  readonly group:
    | 'seed'
    | 'paraphrase'
    | 'slip'
    | 'money'
    | 'code-mixed'
    | 'off-topic'
    | 'correction';
  /** Correction-step cases allow the VALID label. */
  readonly step?: 'why' | 'correction';
  readonly note?: string;
}

export const FIXTURES: readonly ExplanationFixture[] = [
  // ---- Seed set (deep-research section 4) --------------------------------
  {
    id: 'seed-01',
    group: 'seed',
    text: '0.45 is bigger because 45 is bigger than 8.',
    expected: 'L',
  },
  {
    id: 'seed-02',
    group: 'seed',
    text: "It has more numbers after the dot so it's more.",
    expected: 'L',
  },
  {
    id: 'seed-03',
    group: 'seed',
    text: "0.8 only goes to the tenths place, it's basically incomplete, so it's smaller.",
    expected: 'L',
    keywordExpected: 'UNCLEAR',
    note: 'Paraphrase of L that no finite keyword bank contains.',
  },
  {
    id: 'seed-04',
    group: 'seed',
    text: '0.45 has hundredths, and hundredths are bigger units than tenths, like how a hundred is bigger than ten.',
    expected: 'L',
    keywordExpected: 'UNCLEAR',
    note: 'Garbled place-value analogy; the table has no rule for it.',
  },
  {
    id: 'seed-05',
    group: 'seed',
    text: '0.45 dollars is way more than 0.8 dollars, ask anyone.',
    expected: 'MONEY',
  },
  {
    id: 'seed-06',
    group: 'seed',
    text: 'idk I just picked one, they looked about the same size on the line',
    expected: 'GUESS',
  },
  {
    id: 'seed-07',
    group: 'seed',
    text: 'I know 0.8 is bigger than 0.45 really but I clicked the wrong spot by accident, sorry',
    expected: 'SLIP',
  },
  {
    id: 'seed-08',
    group: 'seed',
    text: 'Because when I zoomed in, 0.45 was further along the line to the right, and right means bigger.',
    expected: 'L',
  },
  {
    id: 'seed-09',
    group: 'seed',
    text: 'Decimals are dumb, I hate this game',
    expected: 'UNCLEAR',
  },
  {
    id: 'seed-10',
    group: 'seed',
    text: 'I think 45 hundredths is smaller than 8 tenths but I put it on the wrong side because I read the number line backwards from right to left',
    expected: 'SLIP',
  },

  // ---- Paraphrases of the L rule -----------------------------------------
  {
    id: 'para-l-01',
    group: 'paraphrase',
    text: 'The one with the longer tail is the heavier box.',
    expected: 'L',
    keywordExpected: 'UNCLEAR',
  },
  {
    id: 'para-l-02',
    group: 'paraphrase',
    text: 'Three digits beats one digit so it goes further along.',
    expected: 'L',
    keywordExpected: 'UNCLEAR',
  },
  {
    id: 'para-l-03',
    group: 'paraphrase',
    text: 'more digits means bigger, thats how numbers work',
    expected: 'L',
  },
  {
    id: 'para-l-04',
    group: 'paraphrase',
    text: 'if you take away the point it is four hundred and fifty versus eight, easy',
    expected: 'L',
    keywordExpected: 'UNCLEAR',
  },
  {
    id: 'para-l-05',
    group: 'paraphrase',
    text: 'It is longer so it is larger.',
    expected: 'L',
  },

  // ---- Paraphrases of the S rule -----------------------------------------
  {
    id: 'para-s-01',
    group: 'paraphrase',
    text: 'More digits after the point means smaller, they are only little crumbs.',
    expected: 'S',
  },
  {
    id: 'para-s-02',
    group: 'paraphrase',
    text: 'The shorter one is bigger because hundredths are chopped up tiny.',
    expected: 'S',
  },
  {
    id: 'para-s-03',
    group: 'paraphrase',
    text: 'Longer decimals are smaller, my brother told me.',
    expected: 'S',
  },
  {
    id: 'para-s-04',
    group: 'paraphrase',
    text: 'When you keep cutting the pieces up you end up with less, so the long one loses.',
    expected: 'S',
    keywordExpected: 'UNCLEAR',
  },

  // ---- Slips --------------------------------------------------------------
  {
    id: 'slip-01',
    group: 'slip',
    text: 'oops my hand slipped, I meant to put it on the other side',
    expected: 'SLIP',
  },
  {
    id: 'slip-02',
    group: 'slip',
    text: 'I dropped it too early, that was not where I wanted it.',
    expected: 'SLIP',
    keywordExpected: 'UNCLEAR',
  },
  {
    id: 'slip-03',
    group: 'slip',
    text: 'the mouse jumped and it landed in the wrong place, I know 0.8 wins',
    expected: 'SLIP',
  },

  // ---- Money --------------------------------------------------------------
  {
    id: 'money-01',
    group: 'money',
    text: 'Like money, 45 cents is more than 8 cents so it goes on the right.',
    expected: 'MONEY',
  },
  {
    id: 'money-02',
    group: 'money',
    text: 'It is like rupees and paise, 45 paise beats 8 paise.',
    expected: 'MONEY',
  },
  {
    id: 'money-03',
    group: 'money',
    text: 'the price is higher for the long one',
    expected: 'MONEY',
  },

  // ---- Code-mixed Hindi and English --------------------------------------
  {
    id: 'mix-01',
    group: 'code-mixed',
    text: '0.45 bada hai kyunki 45 zyada hai 8 se',
    expected: 'L',
    keywordExpected: 'UNCLEAR',
  },
  {
    id: 'mix-02',
    group: 'code-mixed',
    text: 'point ke baad zyada digits hain to wo bigger hoga na',
    expected: 'L',
    keywordExpected: 'UNCLEAR',
  },
  {
    id: 'mix-03',
    group: 'code-mixed',
    text: 'mujhe nahi pata, maine bas guess kar liya',
    expected: 'GUESS',
  },
  {
    id: 'mix-04',
    group: 'code-mixed',
    text: 'galti se wrong side pe daal diya, sorry',
    expected: 'SLIP',
  },
  {
    id: 'mix-05',
    group: 'code-mixed',
    text: 'chhota wala bada hota hai kyunki lambe decimals tiny pieces hote hain',
    expected: 'S',
    keywordExpected: 'UNCLEAR',
  },

  // ---- Off topic and empty ------------------------------------------------
  {
    id: 'off-01',
    group: 'off-topic',
    text: 'can I play the racing game instead',
    expected: 'UNCLEAR',
  },
  {
    id: 'off-02',
    group: 'off-topic',
    text: 'my cat is called Biscuit',
    expected: 'UNCLEAR',
  },
  {
    id: 'off-03',
    group: 'off-topic',
    text: '',
    expected: 'UNCLEAR',
  },
  {
    id: 'off-04',
    group: 'off-topic',
    text: '??????',
    expected: 'UNCLEAR',
  },

  // ---- Correction step (VALID is available here) -------------------------
  {
    id: 'corr-01',
    group: 'correction',
    step: 'correction',
    text: '8 tenths is bigger than 75 hundredths, I saw it when we zoomed in.',
    expected: 'VALID',
  },
  {
    id: 'corr-02',
    group: 'correction',
    step: 'correction',
    text: '0.8 is the same as 0.80 so it lands past 0.75.',
    expected: 'VALID',
  },
  {
    id: 'corr-03',
    group: 'correction',
    step: 'correction',
    text: 'Robo is wrong because the tenths place decides first here.',
    expected: 'VALID',
  },
  {
    id: 'corr-04',
    group: 'correction',
    step: 'correction',
    text: 'I moved it but I do not know why',
    expected: 'GUESS',
  },
  {
    id: 'corr-05',
    group: 'correction',
    step: 'correction',
    text: 'Robo is right, more digits is more.',
    expected: 'L',
  },
];

export const SEED_FIXTURES = FIXTURES.filter((f) => f.group === 'seed');
