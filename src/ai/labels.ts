/**
 * The closed label set for learner explanations.
 *
 * L, S, MONEY, SLIP, GUESS and UNCLEAR are the WHY-step labels from the plan.
 *
 * VALID is an addition used only at the ERRONEOUS correction step, where the
 * plan routes on "positional reason" but names no label for it. See the build
 * report for the recorded deviation.
 */
export const WHY_LABELS = ['L', 'S', 'MONEY', 'SLIP', 'GUESS', 'UNCLEAR'] as const;
export const CORRECTION_LABELS = [...WHY_LABELS, 'VALID'] as const;

export type WhyLabel = (typeof WHY_LABELS)[number];
export type CorrectionLabel = (typeof CORRECTION_LABELS)[number];
export type Label = CorrectionLabel;

export const CONFIDENCE_GATE = 0.6;

export interface Classification {
  readonly label: Label;
  readonly confidence: number;
  readonly source: 'model' | 'keyword' | 'empty';
  /** Short machine-readable note about why this label was chosen. */
  readonly note: string;
}

export function isWhyLabel(value: unknown): value is WhyLabel {
  return typeof value === 'string' && (WHY_LABELS as readonly string[]).includes(value);
}

export function isCorrectionLabel(value: unknown): value is CorrectionLabel {
  return (
    typeof value === 'string' && (CORRECTION_LABELS as readonly string[]).includes(value)
  );
}

/** Apply the confidence gate: anything below the gate becomes UNCLEAR. */
export function gate(c: Classification): Classification {
  if (c.confidence < CONFIDENCE_GATE && c.label !== 'UNCLEAR') {
    return { ...c, label: 'UNCLEAR', note: `${c.note}|below-gate` };
  }
  return c;
}
