/**
 * The loop state machine (plan 3.4).
 *
 *   PROFILE -> PLACE -> INFER -> ZOOM -> WHY -> ERRONEOUS -> TRANSFER -> SUMMARY
 *
 * with the documented branches:
 *   INFER A            -> TRANSFER
 *   INFER U            -> WORKED -> a second, shorter PLACE round -> INFER
 *   WHY SLIP           -> TRANSFER
 *   WHY GUESS/UNCLEAR  -> WORKED -> ERRONEOUS
 *   WHY L/S/MONEY      -> ERRONEOUS
 *   correction VALID   -> TRANSFER, otherwise one more erroneous example
 *                         (at most two) and then TRANSFER anyway.
 *
 * The engine owns every branch. The model only ever supplies a label, and even
 * that label is a suggestion the engine may replace with the keyword fallback.
 */

import { type Label } from '../ai/labels.ts';
import {
  buildTask,
  pickTask,
  taskItemsFor,
  type ErroneousExample,
  type ErroneousTask,
  type LengthRule,
} from '../ai/erroneous.ts';
import {
  inferRule,
  judgeMastery,
  mostDiagnostic,
  scorePlacement,
  type MasteryResult,
  type RuleInference,
  type ScoredPlacement,
} from './classifier.ts';
import { EventLog } from './events.ts';
import { buildPlaceRound, buildTransferRound, type Item } from './items.ts';

export type Phase =
  | 'PROFILE'
  | 'PLACE'
  | 'INFER'
  | 'ZOOM'
  | 'WHY'
  | 'WORKED'
  | 'ERRONEOUS'
  | 'TRANSFER'
  | 'SUMMARY';

export type ProfileId = 'maya' | 'sam' | 'guesser' | 'expert' | 'self';

export interface Profile {
  readonly id: ProfileId;
  readonly name: string;
  readonly blurb: string;
}

/**
 * Profiles are demo labels and operator guidance only. They pre-fill nothing
 * and never drive placements: an adult operator enacts them.
 */
export const PROFILES: readonly Profile[] = [
  {
    id: 'maya',
    name: 'Maya',
    blurb: 'Thinks a longer decimal is always bigger.',
  },
  { id: 'sam', name: 'Sam', blurb: 'Thinks a shorter decimal is always bigger.' },
  { id: 'guesser', name: 'Guesser', blurb: 'Not sure yet, drops boxes anywhere.' },
  { id: 'expert', name: 'Expert', blurb: 'Already places decimals correctly.' },
  { id: 'self', name: 'Play yourself', blurb: 'Just play. Nothing is saved.' },
];

/** Feedback ladder step shown after a wrong drop (plan 3.5). */
export type FeedbackLevel = 0 | 1 | 2 | 3;

export interface DropResult {
  readonly correct: boolean;
  readonly feedbackLevel: FeedbackLevel;
  /** True when the item is finished and the queue moved on. */
  readonly advanced: boolean;
  readonly trueThousandths: number;
}

export const PLACE_ITEMS_PER_TYPE = 4;
export const SECOND_PLACE_ITEMS_PER_TYPE = 2;
export const MAX_ATTEMPTS = 3;
export const MAX_ERRONEOUS_EXAMPLES = 2;

export interface SessionOptions {
  readonly seed?: number;
}

export class Session {
  readonly log = new EventLog();

  phase: Phase = 'PROFILE';
  profile: ProfileId = 'self';

  private seed: number;
  private queue: Item[] = [];
  private queueIndex = 0;
  private attempt = 1;
  private placeRounds = 0;

  /** Every scored drop of the session, in order. */
  readonly scored: ScoredPlacement[] = [];

  inference?: RuleInference;
  /** The rule the erroneous examples imitate. Only ever L or S. */
  rule?: LengthRule;
  whyLabel?: Label;
  whyText = '';
  correctionLabel?: Label;
  workedReason?: 'U' | 'GUESS';

  erroneousShown = 0;
  erroneousTask?: ErroneousTask;
  erroneousExample?: ErroneousExample;
  /** Which path produced the visible erroneous example. */
  erroneousSource: 'model' | 'bank' | 'none' = 'none';
  /** True once any model answer has been used this session. */
  modelUsed = false;

  constructor(options: SessionOptions = {}) {
    this.seed = options.seed ?? (Date.now() & 0x7fffffff) | 1;
  }

  /* ----------------------------- lifecycle ----------------------------- */

  start(profile: ProfileId): void {
    this.profile = profile;
    this.log.add('session_start', { profile });
    this.startPlaceRound(PLACE_ITEMS_PER_TYPE);
  }

  private startPlaceRound(perType: number): void {
    this.queue = buildPlaceRound(perType, this.seed + this.placeRounds * 7919);
    this.queueIndex = 0;
    this.attempt = 1;
    this.placeRounds += 1;
    this.phase = 'PLACE';
    this.log.add('place_round_start', { items: this.queue.length, round: this.placeRounds });
  }

  private startTransferRound(): void {
    this.queue = buildTransferRound(this.seed);
    this.queueIndex = 0;
    this.attempt = 1;
    this.phase = 'TRANSFER';
    this.log.add('transfer_start', { items: this.queue.length });
  }

  /* ------------------------------ queue -------------------------------- */

  currentItem(): Item | undefined {
    return this.queue[this.queueIndex];
  }

  queuePosition(): { index: number; total: number } {
    return { index: this.queueIndex, total: this.queue.length };
  }

  currentAttempt(): number {
    return this.attempt;
  }

  /** True when the current phase is one where the learner drops packages. */
  isPlacementPhase(): boolean {
    return this.phase === 'PLACE' || this.phase === 'TRANSFER';
  }

  /**
   * Record a drop. Only the first attempt for an item is used by the rule
   * classifier; later attempts are logged so the summary can mention retries.
   */
  drop(placedThousandths: number): DropResult {
    const item = this.currentItem();
    if (!item) throw new Error('No item to place');
    const placement = scorePlacement(item, placedThousandths, this.attempt);
    this.scored.push({ item, placement });
    this.log.add('drop', {
      item: item.id,
      attempt: this.attempt,
      correct: placement.correct,
      signedError: placement.signedError,
    });

    if (placement.correct) {
      this.nextItem();
      return {
        correct: true,
        feedbackLevel: 0,
        advanced: true,
        trueThousandths: item.target.t,
      };
    }

    const level = Math.min(this.attempt, MAX_ATTEMPTS) as FeedbackLevel;
    if (this.attempt >= MAX_ATTEMPTS) {
      this.nextItem();
      return {
        correct: false,
        feedbackLevel: level,
        advanced: true,
        trueThousandths: item.target.t,
      };
    }
    this.attempt += 1;
    return {
      correct: false,
      feedbackLevel: level,
      advanced: false,
      trueThousandths: item.target.t,
    };
  }

  private nextItem(): void {
    this.queueIndex += 1;
    this.attempt = 1;
    if (this.queueIndex < this.queue.length) return;
    if (this.phase === 'PLACE') this.enterInfer();
    else if (this.phase === 'TRANSFER') this.enterSummary();
  }

  /* ------------------------------ phases ------------------------------- */

  private enterInfer(): void {
    this.phase = 'INFER';
    const inference = inferRule(this.scored);
    this.inference = inference;
    this.log.add('infer', {
      code: inference.code,
      type1: `${inference.type1Correct}/${inference.type1Total}`,
      type2: `${inference.type2Correct}/${inference.type2Total}`,
      meanSignedError: Math.round(inference.meanSignedError),
    });
  }

  /** Called by the UI once the INFER card has been read. */
  leaveInfer(): void {
    const code = this.inference?.code ?? 'U';
    if (code === 'A') {
      this.startTransferRound();
      return;
    }
    if (code === 'U') {
      // First unclear round: show a correct worked example, then a short
      // second placement round. A second unclear round has no rule to target,
      // so the learner goes straight to transfer.
      if (this.placeRounds < 2) {
        this.workedReason = 'U';
        this.phase = 'WORKED';
        this.log.add('worked_start', { reason: 'U' });
        return;
      }
      this.log.add('infer_unclear_twice');
      this.startTransferRound();
      return;
    }
    this.rule = code;
    this.phase = 'ZOOM';
    this.log.add('zoom_start', { rule: code });
  }

  /** The wrong placement replayed in ZOOM. */
  diagnosticPlacement(): ScoredPlacement | undefined {
    return mostDiagnostic(this.scored);
  }

  /** Called by the UI when the zoom replay finishes. */
  leaveZoom(): void {
    this.phase = 'WHY';
    this.log.add('why_start');
  }

  /** Apply the WHY label (from the model or the keyword table). */
  applyWhyLabel(label: Label, text: string, source: 'model' | 'keyword' | 'empty'): void {
    this.whyLabel = label;
    this.whyText = text;
    if (source === 'model') this.modelUsed = true;
    this.log.add('why_label', { label, source });
    if (label === 'SLIP') {
      this.startTransferRound();
      return;
    }
    if (label === 'GUESS' || label === 'UNCLEAR' || label === 'VALID') {
      this.workedReason = 'GUESS';
      this.phase = 'WORKED';
      this.log.add('worked_start', { reason: 'GUESS' });
      return;
    }
    // L, S and MONEY all lead to an erroneous example built on the rule the
    // placements showed, not on the label text.
    this.enterErroneous();
  }

  /** Called by the UI when the worked example finishes. */
  leaveWorked(): void {
    if (this.workedReason === 'U') {
      this.startPlaceRound(SECOND_PLACE_ITEMS_PER_TYPE);
      return;
    }
    this.enterErroneous();
  }

  private enterErroneous(): void {
    const rule = this.rule ?? (this.inference?.code === 'S' ? 'S' : 'L');
    this.rule = rule;
    this.erroneousTask = pickTask(rule, this.erroneousShown);
    this.erroneousExample = undefined;
    this.erroneousSource = 'none';
    this.erroneousShown += 1;
    this.phase = 'ERRONEOUS';
    this.log.add('erroneous_start', {
      rule,
      item: this.erroneousTask.item.id,
      number: this.erroneousShown,
    });
  }

  /** Attach the verified example text to the current erroneous task. */
  setErroneousExample(example: ErroneousExample, source: 'model' | 'bank'): void {
    this.erroneousExample = example;
    this.erroneousSource = source;
    if (source === 'model') this.modelUsed = true;
    this.log.add('erroneous_example', { source });
  }

  /**
   * Record the learner's fix of Robo's mistake.
   * Returns true when the fix put the package on the right side.
   */
  applyCorrectionDrop(placedThousandths: number): boolean {
    const task = this.erroneousTask;
    if (!task) throw new Error('No erroneous task');
    const placement = scorePlacement(task.item, placedThousandths, 1);
    this.log.add('erroneous_fix', {
      item: task.item.id,
      correct: placement.correct,
    });
    return placement.correct;
  }

  /** Apply the label for the learner's one-line correction explanation. */
  applyCorrectionLabel(
    label: Label,
    source: 'model' | 'keyword' | 'empty',
  ): void {
    this.correctionLabel = label;
    if (source === 'model') this.modelUsed = true;
    this.log.add('correction_label', { label, source });
    if (label === 'VALID') {
      this.startTransferRound();
      return;
    }
    if (this.erroneousShown < MAX_ERRONEOUS_EXAMPLES) {
      this.enterErroneous();
      return;
    }
    this.startTransferRound();
  }

  private enterSummary(): void {
    this.phase = 'SUMMARY';
    this.log.add('summary', { mastered: this.mastery().mastered });
  }

  mastery(): MasteryResult {
    return judgeMastery(this.scored);
  }

  /** Convenience for tests and the summary screen. */
  erroneousTaskFor(rule: LengthRule, index: number): ErroneousTask {
    const items = taskItemsFor(rule);
    const item = items[index % items.length];
    if (!item) throw new Error('No erroneous item');
    return buildTask(rule, item);
  }
}
