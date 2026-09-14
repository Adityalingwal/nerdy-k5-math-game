# Claude Code prompt: market-guided K-5 game concept research

Copy everything below the divider into Claude Code while it is running from the
root of the authoritative repository.

---

You are conducting one bounded market-guided research and concept-synthesis
pass for the Nerdy K-5 Math Game project. This is deliberately **not blind
ideation**. Existing K-5 learning games must be studied first so the project can
learn from proven interaction patterns instead of inventing its game language
from zero.

Authoritative workspace:
`/Users/mac/Desktop/nerdy-k5-math-game`

Do not use any older `/Users/mac/Documents/Codex/...` checkout.

## 1. Read the project state completely before researching

Read these files in order:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/00-index.md`
4. `docs/rules-and-compliance.md`
5. `docs/decision-log.md`, especially D-009 through D-016
6. `docs/product-hypothesis.md`
7. `docs/research/k5-math-game-market-patterns-2026-09-14.md`
8. `docs/research/independent/claude-blind-candidates.md`
9. `docs/research/independent/codex-blind-candidates.md`
10. `docs/research/deep/decimal-longer-is-larger.md`
11. `docs/research/deep/division-remainder.md`
12. `docs/research/deep/subtraction-smaller-from-larger.md`
13. `docs/prototypes/mission-forge/revision-build-report.md`
14. `docs/prototypes/equal-sign-repair/scripted-ui-build-report.md`
15. `docs/progress.md`
16. `docs/evidence-register.md`

Confirm current Git branch and status before doing anything. Treat the two
blind candidate reports as fallible prior inputs, not authoritative rankings.

Current product boundary:

- Decimal Dock is preserved as a working candidate, not selected as final.
- Mission Forge was dropped by D-011. Do not revive or cosmetically rename it.
- Equal-Sign Repair was dropped by D-014. Do not revive or cosmetically rename
  it.
- Remainder Routing is research only.
- No new prototype, runtime AI integration or final concept selection is
  authorized by this task.

## 2. Research actual market interaction patterns

Study these five required reference families:

1. Prodigy Math
2. SplashLearn
3. DragonBox, prioritising its K-5 number/fraction products
4. DreamBox Math
5. ST Math

You may add at most three additional K-5 math-game references only when they
demonstrate a materially different mechanic relevant to this project. Explain
why each addition was necessary.

Use live web research. Prefer, in order:

1. official product, curriculum, support and developer/technical pages;
2. official app-store listings, screenshots, demos and official videos;
3. recent independent full-gameplay videos or reviews for observable gameplay
   details that official sources do not show.

Marketing language verifies only what a company claims. It does not prove
efficacy, learner preference or runtime AI. Treat AI-search summaries as leads,
not sources. Cite the direct URL beside every source-derived claim and record
the access date. If a paid/login-only flow cannot be inspected, state that gap.
Do not claim visual inspection unless you actually viewed screenshots or video.
Do not download or copy proprietary assets into the repository.

For every required reference, extract the same fields:

- target grades and visible math scope;
- one complete observable learner loop: goal -> action -> feedback -> game
  consequence -> reason to replay;
- whether mathematics is the game mechanic itself or a question gate wrapped
  in an unrelated game;
- learner input: manipulation, construction, choice, movement, language or
  another action;
- how wrong reasoning becomes visible, if it does;
- scaffolding, adaptation and difficulty progression;
- character, narrative, collection or world-progression mechanisms;
- what the product explicitly claims about AI or adaptivity, and what evidence
  supports that description;
- one mechanism we may learn from without copying expression;
- one mechanism, asset, layout or scope pattern we should not copy.

Do not call every adaptive rule “AI.” Use these labels where possible:
`authored`, `deterministic adaptive`, `predictive/adaptive model`,
`generative AI`, or `unverified marketing claim`.

## 3. Build an IP-safe mechanism library

Turn the product observations into 8-12 small reusable mechanism patterns.
Describe each pattern abstractly, without product characters, artwork, branded
language, exact screen layouts or copied content.

For each mechanism state:

- the learner action;
- the immediate game consequence;
- the mathematical relationship embodied;
- what makes repetition vary;
- whether it is intrinsic mathematical play or an external reward wrapper;
- which K-5 misconception families it could fit;
- whether normal authored/deterministic logic is already sufficient.

Examples of the level of abstraction intended are “construct two equivalent
states and watch the world stabilise” or “choose a route whose capacity rule
changes the treatment of a leftover,” not “copy Prodigy's battle” or “use ST
Math's character.”

## 4. Synthesize original concepts from mechanisms plus evidence

Create exactly six original concept hypotheses. Each must combine:

1. one evidence-backed K-5 learner misconception or reasoning barrier;
2. one or more abstract mechanisms from the mechanism library;
3. one learner, one repeatable learning loop and one observable transfer;
4. one bounded possible AI contribution that is challenged against the
   strongest deterministic alternative.

Use the existing research as a base, but do not merely reskin an existing
candidate. A new concept must change the essential learner action, consequence
or adaptation—not only its story, character or art.

For every concept specify:

- learner profile and prerequisite knowledge;
- exact misconception/barrier;
- 30-second explanation of the fantasy and goal;
- moment-to-moment learner action;
- how the learner's wrong model causes a meaningful visible consequence;
- the complete repeatable loop;
- why a second play is different from the first;
- an unhinted transfer whose answer, context and visual cue do not simply repeat
  the repair;
- deterministic engine ownership;
- proposed AI ownership;
- the strongest compact deterministic substitute for that AI;
- what materially worsens if AI is removed;
- a safe unclear/fallback behavior;
- three-minute demo feasibility;
- strongest reason to reject the concept;
- closest market reference and the concrete difference that keeps the concept
  original.

AI must never own mathematical truth, correctness, safety, progression or
mastery. Do not count cosmetic prose, random story wording, generic tutoring,
art generation, difficulty selection or a small closed label table as a strong
AI contribution when authored rules can do the same job.

## 5. Apply the lessons from the failed prototypes

Reject or penalise concepts that repeat any of these failure modes:

- the math is a plain question that merely powers unrelated rewards;
- the interaction is mostly guided clicking with no meaningful construction;
- learner-authored language selects only a tiny closed authored branch map;
- AI output is decorative or removable;
- visual matching can be solved without changing the target mathematical
  interpretation;
- repair and transfer repeat the same answer, context or visual cue;
- story or character changes only labels rather than the world and consequence;
- scope requires an RPG, content library, LMS, social system, account system or
  teacher dashboard.

## 6. Compare and recommend without selecting final scope

Score all six concepts from 1-5 on:

- math intrinsic to play;
- clarity of the misconception;
- quality of matched research support;
- game feel and repeatability;
- observable transfer;
- necessary and bounded AI contribution;
- differentiation from the reference products;
- safety/accessibility;
- feasibility for one polished three-minute demo.

Explain every score in one short sentence. Do not hide weighting. Then produce:

- a top three;
- the strongest reason each top-three concept may still fail;
- one recommended concept for **further validation only**;
- one runner-up;
- the cheapest non-code test that could falsify the recommended concept;
- the exact evidence that would justify a later prototype decision.

The recommendation is product judgment, not an accepted project decision.
Do not edit `docs/decision-log.md` to select a concept.

## 7. Deliverable and allowed changes

Create:

`docs/research/market-guided-concept-ideation-2026-09-14.md`

The report must keep these sections visibly separate:

1. verified market facts;
2. access/source limitations;
3. product interpretations;
4. IP-safe mechanism library;
5. six concept hypotheses;
6. score matrix and top three;
7. recommended validation target;
8. unresolved questions;
9. complete source list.

After the report, update only:

- `docs/progress.md` with a factual research checkpoint;
- `docs/evidence-register.md` with sources and AI-assistance disclosure.

Do not change any other file. Do not change runtime code, prototypes, tests,
configuration, dependencies, `.env` or previous research records. Do not make
an OpenRouter/model call, use child data, test with children, commit, push,
deploy or select a final concept.

Before stopping, run `git diff --check` and report the exact changed files.
Return a short Hinglish checkpoint separating verified findings, product
judgment and unresolved issues. Stop for Aditya and Codex to review the report
before any further action.

---
