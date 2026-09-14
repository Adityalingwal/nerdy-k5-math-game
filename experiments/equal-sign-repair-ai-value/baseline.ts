/**
 * Compact deterministic rules baseline.
 *
 * FAIRNESS: this route receives exactly the same `RouteInput` as the model
 * route - the equation, the engine facts, the raw edit trace and the learner's
 * explanation. It deliberately uses the trace as well as the text, because a
 * text-only baseline would be artificially weak and would make the comparison
 * meaningless.
 *
 * NO FIXTURE LEAKAGE: this module imports nothing from any fixture module and
 * contains no phrase copied from the evaluation set. Every cue below is a
 * general vocabulary or placement pattern. `self-check.ts` enforces both of
 * those claims structurally by reading this file's own source.
 *
 * Rules are tried in order; the first one that returns a label wins.
 */

import type { Label, ProbeId, RouteInput } from './contract.ts';
import { LABEL_TO_PROBE } from './contract.ts';

/* ------------------------------------------------------------------ */
/* General cue vocabularies                                            */
/* ------------------------------------------------------------------ */

/** Text that addresses the system rather than the mathematics. */
const META = [
  /\bignore\b/,
  /\binstructions?\b/,
  /\bsystem prompt\b/,
  /\bconfidence\b/,
  /\bjson\b/,
  /\blabel\b/,
  /\b(reply|respond|answer) with\b/,
  /\byou (must|should|will)\b/,
];

/** The learner says both sides name one quantity. */
const RELATIONAL = [
  /\bboth sides?\b/,
  /\b(other|each|every|one) side\b/,
  /\b(left|right) side\b/,
  /\bthe same\b/,
  /\bsame (amount|number|value|total|thing|as)\b/,
  /\bequal\b/,
  /\bmatch(es|ing)?\b/,
  /\bbarabar\b/,
  /\bdono (side|taraf)\b/,
  /\bname the same\b/,
  /\bas much as\b/,
];

/** The learner reasons by adjusting one side against the other. */
const COMPENSATION = [
  /\b(one|two|three|four|1|2|3|4) (more|less)\b/,
  /\b(more|less) than\b/,
  /\btake(s|n)? (one|two|it|that)? ?(off|away from)\b/,
  /\balready\b/,
  /\bnothing more\b/,
  /\bhow many more\b/,
  /\bek (kam|zyada)\b/,
];

/** The learner announces a calculation or interaction failure. */
const SLIP = [
  /\bgalti\b/,
  /\bmistake\b/,
  /\bmiscount/,
  /\b(added|subtracted|counted|typed|did|got) (it |them )?wrong\b/,
  /\bcounted wrong\b/,
  /\bi meant to\b/,
  /\bpressed\b/,
  /\btypo\b/,
  /\boops\b/,
  /\bmessed up\b/,
  /\bby mistake\b/,
];

/** The learner states the "write the result next" reading of `=`. */
const OPERATIONAL = [
  /\banswer\b/,
  /\bjawab\b/,
  /\bcomes? (after|next)\b/,
  /\bafter the equals?\b/,
  /\bthat is the total\b/,
  /\badd(ed|ing)? (them |it )?all\b/,
  /\ball (of )?the numbers\b/,
];

/** The learner disclaims any method. */
const UNCERTAIN = [
  /\bguess(ed|ing)?\b/,
  /\bpata nahi\b/,
  /\bdon'?t know\b/,
  /\bdunno\b/,
  /\bnot sure\b/,
  /\bno idea\b/,
  /\bidk\b/,
];

/** Signals that an earlier statement is being retracted rather than held. */
const CORRECTION = [
  /\bfirst i\b/,
  /\bat first\b/,
  /\bi thought\b/,
  /\bi changed\b/,
  /\bactually\b/,
  /\binstead\b/,
];

/** Bare pronouns and demonstratives with nothing to anchor them. */
const REFERENT_ONLY = [/\bthat\b/, /\bthis\b/, /\bit\b/, /\bthose\b/, /\bthese\b/, /\bthere\b/];

/** Any quantity named in digits or words. */
const NUMERAL = [
  /\d/,
  /\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|twenty)\b/,
];

/** Anything that shows the learner is talking about the task at all. */
const MATH_CONTENT = [
  /\d/,
  /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|zero)\b/,
  /\b(side|sides|equal|equals|same|match|plus|minus|add|added|adding|sum|total|answer|jawab|barabar|dono|box|number|numbers|count|counted|more|less|guess|take away|nothing)\b/,
];

function hits(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

interface Cues {
  readonly normalised: string;
  readonly wordCount: number;
  readonly isEmpty: boolean;
  readonly meta: boolean;
  readonly relational: boolean;
  readonly compensation: boolean;
  readonly slip: boolean;
  readonly operational: boolean;
  readonly uncertain: boolean;
  readonly correction: boolean;
  readonly referentOnly: boolean;
  readonly mathContent: boolean;
  readonly numeral: boolean;
}

function readCues(explanation: string): Cues {
  const normalised = explanation.toLowerCase().trim();
  const words = normalised.length === 0 ? [] : normalised.split(/\s+/);
  const relational = hits(normalised, RELATIONAL);
  const compensation = hits(normalised, COMPENSATION);
  const mathContent = hits(normalised, MATH_CONTENT);
  const numeral = hits(normalised, NUMERAL);
  return {
    normalised,
    wordCount: words.length,
    isEmpty: normalised.length === 0,
    meta: hits(normalised, META),
    relational,
    compensation,
    slip: hits(normalised, SLIP),
    operational: hits(normalised, OPERATIONAL),
    uncertain: hits(normalised, UNCERTAIN),
    correction: hits(normalised, CORRECTION),
    referentOnly:
      hits(normalised, REFERENT_ONLY) && !numeral && !relational && !compensation,
    mathContent,
    numeral,
  };
}

/* ------------------------------------------------------------------ */
/* The rule set                                                        */
/* ------------------------------------------------------------------ */

export interface Rule {
  readonly id: string;
  readonly description: string;
  readonly test: (input: RouteInput, cues: Cues) => Label | null;
}

export const RULES: readonly Rule[] = [
  {
    id: 'R01',
    description:
      'Text addresses the system instead of the mathematics: refuse to diagnose and ask what each side means.',
    test: (_input, cues) => (cues.meta ? 'UNCLEAR' : null),
  },
  {
    id: 'R02',
    description:
      'The placed value matches an engine reference sum (the classic "write the result you just read" response) and the text offers no relational or slip account: operational.',
    test: (input, cues) =>
      input.facts.diagnosticOperationalPlacement &&
      !cues.relational &&
      !cues.compensation &&
      !cues.slip
        ? 'OPERATIONAL_EQUAL'
        : null,
  },
  {
    id: 'R03',
    description: 'No explanation text at all and no diagnostic placement.',
    test: (_input, cues) => (cues.isEmpty ? 'UNCLEAR' : null),
  },
  {
    id: 'R04',
    description: 'The learner disclaims any method (guessing or not knowing).',
    test: (_input, cues) => (cues.uncertain ? 'UNCLEAR' : null),
  },
  {
    id: 'R05',
    description: 'Text contains nothing about the task.',
    test: (_input, cues) => (cues.mathContent ? null : 'UNCLEAR'),
  },
  {
    id: 'R06',
    description:
      'Text asserts both the relational and the operational reading at once without retracting either.',
    test: (_input, cues) =>
      cues.relational && cues.operational && !cues.correction ? 'UNCLEAR' : null,
  },
  {
    id: 'R07',
    description: 'Only bare pronouns or demonstratives, with nothing to anchor them.',
    test: (_input, cues) => (cues.referentOnly ? 'UNCLEAR' : null),
  },
  {
    id: 'R08',
    description:
      'A single equality token with no referent is too thin to show that both sides name one quantity.',
    test: (_input, cues) => (cues.relational && cues.wordCount <= 3 ? 'UNCLEAR' : null),
  },
  {
    id: 'R09',
    description: 'The learner reports a calculation, transcription or interaction failure.',
    test: (_input, cues) => (cues.slip ? 'ARITHMETIC_SLIP' : null),
  },
  {
    id: 'R10',
    description:
      'Relational or compensation reasoning: valid when the engine says the placement is correct, otherwise the method is sound and the arithmetic is not.',
    test: (input, cues) =>
      cues.relational || cues.compensation
        ? input.facts.placedIsCorrect
          ? 'RELATIONAL_VALID'
          : 'ARITHMETIC_SLIP'
        : null,
  },
  {
    id: 'R11',
    description:
      'The text states the "answer comes next" reading even though the placement is not one of the reference sums.',
    test: (_input, cues) => (cues.operational ? 'OPERATIONAL_EQUAL' : null),
  },
  {
    id: 'R12',
    description:
      'Placement is correct but nothing in the text explains why; a correct numeral alone is not evidence.',
    test: (input) => (input.facts.placedIsCorrect ? 'UNCLEAR' : null),
  },
  {
    id: 'R13',
    description: 'Nothing above applies: do not guess a diagnosis.',
    test: () => 'UNCLEAR',
  },
];

export const BASELINE_RULE_COUNT = RULES.length;

export interface BaselineResult {
  readonly label: Label;
  readonly probeId: ProbeId;
  readonly ruleId: string;
}

export function runBaseline(input: RouteInput): BaselineResult {
  const cues = readCues(input.explanation);
  for (const rule of RULES) {
    const label = rule.test(input, cues);
    if (label) return { label, probeId: LABEL_TO_PROBE[label], ruleId: rule.id };
  }
  // Unreachable: R13 always returns. Kept so the function is total by type.
  return { label: 'UNCLEAR', probeId: LABEL_TO_PROBE.UNCLEAR, ruleId: 'R13' };
}
