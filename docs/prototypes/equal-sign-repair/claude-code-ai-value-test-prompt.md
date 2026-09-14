# Claude Code Prompt — Equal-Sign Repair Bounded AI-Value Test

Copy everything below into a fresh Claude Code session.

---

Work only in the authoritative repository:

`/Users/mac/Desktop/nerdy-k5-math-game`

Do not use any old workspace under `/Users/mac/Documents/Codex/`.

Your task is to implement the one bounded Equal-Sign Repair AI-value test
authorized by D-012. This is a local CLI experiment, not a game prototype,
final concept selection, learner study, UI build, deployment, or learning
efficacy test.

Before changing anything, completely read these files in order:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/00-index.md`
4. `docs/rules-and-compliance.md`
5. `docs/decision-log.md`, especially D-009 through D-012
6. `docs/research/independent/codex-blind-candidates.md`, especially C09 and
   the final ranking section for Equal-Sign Repair
7. `docs/research/independent/claude-blind-candidates.md`, especially C8
8. `docs/implementation-plan.md`, section 5, only as a historical harness
   pattern; do not carry Decimal Dock's labels or product assumptions forward
9. `scripts/ai-value-test.ts`, `scripts/explanation-fixtures.ts`,
   `src/ai/core.ts`, `.env.example`, `package.json`, and `tsconfig.json`
10. `docs/progress.md` and `docs/evidence-register.md`

Then inspect `git status --short --branch` and list the exact existing changed
and untracked files. Preserve all existing work. Do not assume any dirty file
belongs to you.

Before editing, give Aditya one short Hinglish checkpoint separating:

- verified repository facts;
- what this experiment will add;
- what will remain untouched;
- anything that would block a real model run.

## Question this experiment must answer

For a learner who can add the displayed numbers but may read `=` as “the answer
comes next,” can a constrained real-AI interpreter use the learner's action
trace plus short free-text explanation to choose a safer, more relevant next
probe than a small deterministic rules baseline?

The experiment must compare both routes on exactly the same synthetic cases.
It must not test arithmetic correctness—the deterministic engine supplies all
equation values and whether the learner's construction is valid.

## Fixed interpretation contract

Use a closed four-label schema:

1. `OPERATIONAL_EQUAL` — evidence that the learner treats `=` as an instruction
   to calculate or place “the answer,” instead of comparing both sides.
2. `ARITHMETIC_SLIP` — the learner states a relationally valid method but makes
   a calculation, transcription, or interaction slip.
3. `RELATIONAL_VALID` — the explanation demonstrates that both sides name the
   same quantity, including a valid compensation strategy.
4. `UNCLEAR` — the explanation is insufficient, ambiguous, contradictory,
   off-topic, or cannot safely support a diagnosis.

Map labels deterministically to authored probe IDs:

- `OPERATIONAL_EQUAL` -> `COMPARE_BOTH_SIDES`
- `ARITHMETIC_SLIP` -> `RECHECK_CALCULATION`
- `RELATIONAL_VALID` -> `FADE_TO_TRANSFER`
- `UNCLEAR` -> `ASK_WHAT_EACH_SIDE_MEANS`

The model may return only `label`, `confidence`, and `probeId`. It must not
generate learner-facing tutoring prose, invent an equation, decide whether an
answer is correct, or control progression. Validate every model response. If
the response is malformed, inconsistent, or below the confidence threshold,
route it to `UNCLEAR` and `ASK_WHAT_EACH_SIDE_MEANS`.

Use a confidence threshold of `0.70`. Do not tune it after seeing results.

## Synthetic fixture requirements

Create at least 32 adult-authored synthetic cases, at least eight per label.
No case may come from a real child or contain personal data.

Each fixture must include:

- stable ID and category;
- equation;
- learner edit/action trace;
- deterministic correctness facts, including the correct missing value;
- short learner explanation;
- adult-assigned expected label and expected probe ID;
- one-line annotation explaining why that label is justified.

Keep the mathematics small and exact. Center the set on equations such as
`6 + 5 = 7 + ?`, while including bounded transfer forms such as
`12 = 8 + 4` and operations on both sides. Include clean cases plus difficult
language cases:

- ordinary paraphrases;
- negation and self-correction;
- correct-sounding language paired with a stated slip;
- ambiguous referents such as “that is the answer”;
- valid compensation reasoning;
- short Hinglish/code-mixed explanations;
- empty/off-topic text;
- one synthetic prompt-injection attempt that must route safely.

Do not improve the deterministic baseline with a phrase-by-phrase lookup of
the evaluation fixtures. Keep it a compact, readable set of general rules and
record its rule count. The report must openly state that Claude authored both
the harness and the initial fixture set, so this run is not a blind benchmark.
Leave the fixture format easy for Codex to extend later with undisclosed
holdout cases during independent review.

## Implementation boundary

Create the experiment only under:

`experiments/equal-sign-repair-ai-value/`

The only other authorized changes are:

- a factual build report at
  `docs/prototypes/equal-sign-repair/ai-value-test-build-report.md`;
- run artifacts under
  `docs/evidence/experiments/equal-sign-repair/`;
- verified status/evidence additions to `docs/progress.md` and
  `docs/evidence-register.md`.

Do not modify:

- Decimal Dock runtime or tests: `src/`, `api/`, `scripts/`, `tests/`, root
  `index.html`, or its product behavior;
- `prototypes/mission-forge/` or its evidence;
- `package.json`, lockfile, TypeScript/Vite/Vitest config, `.env`, or
  `.env.example`;
- D-012 or any earlier decision;
- README, deployment files, Git history, or repository visibility.

Add no dependency, image, font, audio, dataset, backend, storage, analytics,
account system, or child data. Do not commit, push, deploy, or create a branch.

Use the already installed local `tsx` executable to run the experiment without
changing package scripts. A command such as
`./node_modules/.bin/tsx experiments/equal-sign-repair-ai-value/run.ts` is
acceptable. The harness must work in baseline-only mode when no key is present.

## Real-model boundary

Use OpenRouter only if `OPENROUTER_API_KEY` is already available through the
existing local `.env` or process environment. Never print, copy, expose, write,
or commit the key. Use `OPENROUTER_MODEL` when configured. Record the exact
served/requested model ID in the report, but do not silently replace it or call
another provider.

Use temperature `0` and a small response limit sufficient for the closed JSON
schema. Keep the test bounded to at most two model attempts per fixture. Record
timeouts, malformed replies, fallback routing, per-call latency, and any usage
metadata the provider returns. Do not send repository contents—only the fixed
system contract and one synthetic fixture at a time.

If no key is configured, implement and verify the harness but report exactly:
`real model path untested`. Do not fabricate, simulate, or infer model results.

If network access or provider authorization fails, report the exact failure and
stop retrying after one controlled retry. Do not change provider or install a
workaround.

## Required comparison and report

For the deterministic baseline and each real-model attempt, report:

- exact-label agreement with the adult labels;
- exact probe-ID agreement;
- confusion matrix;
- results by language/case group;
- malformed, low-confidence, timeout, and fallback counts;
- cases where AI is right and rules are wrong;
- cases where rules are right and AI is wrong;
- high-risk errors where valid reasoning is diagnosed as misconception, or a
  slip is diagnosed as misconception;
- per-case outputs and concise disagreement notes;
- model latency p50/p95, clearly labelled as local-run evidence only.

Pre-register this provisional product gate in the report before showing the
scores:

- `possible advance`: the real model beats the deterministic baseline by at
  least 15 percentage points on exact labels, has no high-risk error on either
  attempt, and produces valid/fallback-safe output on every case;
- `drop AI claim`: improvement is below 15 percentage points, the rules cover
  all meaningful differences, or the model has any repeatable high-risk error;
- `unresolved`: the real model did not run, results are unstable across the two
  attempts, or the small authored fixture set cannot discriminate the routes.

This is only a provisional gate. Do not select the final product and do not
declare that AI improves learning. Codex will independently inspect the code,
rerun the experiment, and add fresh holdout cases before any advance/drop
decision.

## Verification

Run and report all of the following:

1. the experiment's own deterministic self-checks;
2. baseline-only evaluation;
3. real-model evaluation twice if a key is configured;
4. `npm test`;
5. `npm run build`;
6. a secret scan of the new experiment/report/evidence files confirming that
   no key or credential was written;
7. `git diff --check` plus a final exact file-status inspection.

Store raw machine-readable results as JSON and a readable Markdown report under
the authorized evidence directory. Do not overwrite Decimal Dock or Mission
Forge evidence.

The build report must separate:

- verified implementation facts;
- measured results;
- product interpretation;
- unresolved issues and limitations.

It must explicitly say that these synthetic software checks are not evidence
of child learning, classroom effectiveness, grade suitability, or mastery.

At completion, respond in concise Hinglish with:

- exact files added/changed;
- exact commands and results;
- whether a real model actually ran and its exact model ID;
- deterministic versus model scores;
- high-risk errors and fallbacks;
- evidence and build-report paths;
- provisional gate result;
- unresolved items for Codex's independent review.

---
