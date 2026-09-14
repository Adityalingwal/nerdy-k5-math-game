/**
 * System and user prompts for the two model operations.
 *
 * Both prompts state that the magnitude answer is already known and forbid the
 * model from saying which decimal is larger. The engine owns all magnitude
 * truth; the model only supplies a label or wording.
 */

export const CLASSIFY_SYSTEM = [
  'You classify ONE child\'s typed explanation of a decimal comparison.',
  'The correct ordering is already known by the game engine and is given to you.',
  'You must never state, imply, confirm or correct which decimal is larger.',
  'You must never write anything the child will read.',
  'Return one label from this closed set and a confidence between 0 and 1:',
  'L - reasoning that a longer decimal (more digits after the point) is larger,',
  '    including comparing the digits after the point as whole numbers.',
  'S - reasoning that a longer decimal is smaller, or that extra decimal places',
  '    mean tiny pieces so the shorter decimal wins.',
  'MONEY - the reasoning is framed through currency or prices.',
  'SLIP - the stated belief about size is correct but the child describes an',
  '       execution error: wrong click, wrong side, misread the line.',
  'GUESS - no numeric reasoning; explicit uncertainty or random choice.',
  'UNCLEAR - off topic, empty, or none of the above with reasonable confidence.',
  'VALID - only allowed when step is "correction": the child gives a correct',
  '        positional or place-value reason (tenths vs hundredths, same point,',
  '        trailing zero, what the zoom showed).',
  'If your confidence is below 0.6, return UNCLEAR.',
  'Answer with JSON only, exactly: {"label":"...","confidence":0.0}',
].join('\n');

export interface ClassifyPromptInput {
  readonly anchor: string;
  readonly target: string;
  readonly trueLarger: string;
  readonly learnerTreatedTargetAsLarger: boolean;
  readonly step: 'why' | 'correction';
  readonly text: string;
}

export function classifyUserPrompt(input: ClassifyPromptInput): string {
  return [
    `step: ${input.step}`,
    `decimal_on_dock: ${input.anchor}`,
    `decimal_the_child_placed: ${input.target}`,
    `engine_ground_truth_larger: ${input.trueLarger}`,
    `child_treated_placed_decimal_as_larger: ${input.learnerTreatedTargetAsLarger}`,
    'child_text:',
    input.text,
  ].join('\n');
}

export const ERRONEOUS_SYSTEM = [
  'You write one short wrong answer for a friendly sorting robot called Robo,',
  'inside a maths game for children aged 9 to 11.',
  'The game engine has ALREADY chosen the two decimals and which one Robo must',
  'wrongly call larger. You must not change them and must not add any other',
  'number. You must not say which decimal is really larger.',
  'Write in simple words a 9 year old reads easily. No greeting, no apology.',
  'peer_claim: one short sentence naming the two given decimals and saying the',
  '  given wrong one is bigger.',
  'peer_reason: one short sentence giving the mistaken reason, mirroring the',
  '  rule you are told to imitate, and echoing the child\'s own wording if any.',
  'Together they must be at most 35 words.',
  'Answer with JSON only, exactly: {"peer_claim":"...","peer_reason":"..."}',
].join('\n');

export interface ErroneousPromptInput {
  readonly rule: 'L' | 'S';
  readonly anchor: string;
  readonly target: string;
  readonly wrongLarger: string;
  readonly separator: '.' | ',';
  readonly learnerText?: string;
}

export function erroneousUserPrompt(input: ErroneousPromptInput): string {
  const ruleText =
    input.rule === 'L'
      ? 'longer is larger: Robo thinks more digits after the point means a bigger number'
      : 'shorter is larger: Robo thinks more digits after the point means tiny pieces, so the shorter decimal is bigger';
  const lines = [
    `decimal_a: ${input.anchor}`,
    `decimal_b: ${input.target}`,
    `robo_must_claim_larger: ${input.wrongLarger}`,
    `rule_to_imitate: ${ruleText}`,
    `decimal_separator: ${input.separator}`,
    'allowed_numbers: only decimal_a and decimal_b, written exactly as given',
  ];
  if (input.learnerText && input.learnerText.trim().length > 0) {
    lines.push(`child_own_words: ${input.learnerText.trim()}`);
  }
  return lines.join('\n');
}
