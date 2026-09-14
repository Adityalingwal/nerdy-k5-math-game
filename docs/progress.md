# Progress

Last updated: 2026-09-14

## Completed

- Reviewed the full live challenge landing page.
- Reviewed the full official rules, including eligibility, submission, judging,
  ownership, licenses, child-data restrictions, publicity, and hiring language.
- Selected the K-5 Math Game prompt.
- Created the canonical documentation and agent handoff structure.
- Defined a bounded research workflow without locking the final concept.
- Initialized Git and pushed the documentation to the private repository at
  https://github.com/Adityalingwal/nerdy-k5-math-game.
- Changed the repository policy so internal agent instructions, working docs,
  references, notes, and private material remain local-only. The GitHub working
  tree is intentionally minimal until implementation begins.
- Saved a durable new-chat handoff at
  `/Users/mac/.codex/memories/extensions/ad_hoc/notes/20260904-222524-nerdy-k5-hackathon-handoff.md`.
- Renamed the working repository to `nerdy-k5-math-game` and moved its local
  checkout to `/Users/mac/Desktop/nerdy-k5-math-game`.
- Completed and consolidated the line-by-line working interpretation of Nerdy's
  K-5 product prompt without locking the learner, concept, mechanic, or AI role.
- Completed and consolidated the line-by-line practical interpretation of
  Nerdy's official eligibility, submission, licensing, child-safety, ownership,
  and judging rules.
- Accepted a geography-neutral core-learning direction: define the learner by
  prerequisite ability and observable difficulty, research transfer across
  multiple regions, and keep language/context localizable without claiming
  universal effectiveness.
- Completed the first bounded misconception-research chunk and documented three
  language-light diagnostic task families: addition-fact/quantity combination,
  bidirectional digit-position mapping, and ten-for-one unitizing/regrouping.
- Recorded the source-to-claim evidence, population limits, product implications,
  deterministic/AI boundary, and unresolved questions in
  `docs/research/grade-2-3-misconceptions.md` without locking the final concept.

- Ran two independent blind candidate-discovery lanes (Claude, Codex; 15
  candidates each) without access to the current hypothesis; reports in
  `docs/research/independent/`. Both ranked decimal comparison, equal sign,
  fraction magnitude, and division remainder in their top five; both failed the
  Grade 2/3 place-value/regrouping concept on the genuine-AI test.
- Cross-reviewed both reports against the canonical research; merged a
  five-candidate shortlist; ran bounded deep research (Sonnet background
  agents) on decimal comparison, division remainder, and subtraction
  smaller-from-larger; notes in `docs/research/deep/`.
- Locked the core concept (D-008): decimal comparison "longer is larger",
  age 9-11, zoomable number line, erroneous examples, one bounded AI role.
  Rejected D-003.

- Built the Day 1-3 MVP of "Decimal Dock" at the repository root: Vite +
  TypeScript + PixiJS v8 scaffold, deterministic engine, Pixi dock, DOM
  overlay, OpenRouter proxy, AI value test harness, Vitest suites, README,
  `.env.example` and `vercel.json`. Nothing is committed; the working tree is
  left for review.
  - `src/engine/`: decimals as integer thousandths with a separator-aware
    display, the Steinle and Stacey Type 1 / Type 2 item bank plus transfer
    items, the tolerant L/S/A/U classifier, the loop state machine, the
    three-step feedback ladder and an anonymous in-memory event log.
  - `src/game/dock.ts`: the 0-1 dock with pier posts at tenths, drag with snap
    preview and bounce, three zoom levels that reflow labels (0.8 shows as 0.80
    in place), off-view edge chips, pier lamps, and an arrow-key plus Enter
    alternative to dragging.
  - `src/ui/`: profile picker, prompt banner, WHY box with Skip, Robo's
    delivery-log panel, worked-example and summary cards, gear panel
    (separator, money word, AI on/off, language hook). Only the AI toggle is
    persisted, in localStorage.
  - `api/llm.ts` plus a matching Vite dev middleware: two operations
    (`classify`, `erroneous-example`) against OpenRouter at temperature 0 with
    a 4 s timeout and defensive JSON extraction. The key is server-side only.
  - `src/ai/`: closed label set with a 0.6 confidence gate, keyword fallback
    classifier, engine-owned verifier for generated erroneous examples, and an
    authored bank of 6 examples per rule. Generated examples are pre-requested
    in the background and cached per rule and pair.
  - `scripts/ai-value-test.ts`: 39 synthetic explanations, agreement table,
    disagreement list, verifier rejection reporting; writes to
    `docs/evidence/`.
  - Verified: `npm install`, `npm run build` and 81 Vitest tests all pass; the
    whole loop completes in Chrome for the L, S and U branches with no console
    errors; screenshots in `docs/evidence/screenshots/`; the production bundle
    contains no key, no `process.env` reference and no dev hook.
  - Not verified: the model path. No `OPENROUTER_API_KEY` was available, so the
    harness reports "model path untested" and every run used the deterministic
    fallbacks. A Vercel deployment has not been attempted.

- Reopened final concept selection after Aditya's product review of Decimal
  Dock; preserved the implementation and research rather than deleting it.
- Compared Equal-Sign Repair, Remainder Rescue, and an experience-first Mission
  Forge challenger without locking any replacement concept.
- Accepted D-009: build one isolated scripted Mission Forge slice only as
  product-decision evidence.
- Created the self-contained Claude Code handoff package:
  - `docs/prototypes/mission-forge/build-brief.md`
  - `docs/prototypes/mission-forge/acceptance-and-review.md`
  - `docs/prototypes/mission-forge/claude-code-prompt.md`
- Updated `CLAUDE.md` to route implementation agents to the current handoff and
  prevent the historical Decimal plan from being mistaken for current scope.

- 2026-09-12: Built the isolated scripted Mission Forge slice (D-009) with
  Claude Code under Aditya's direction. Runtime files are
  `prototypes/mission-forge/index.html`, `styles.css`, `main.js` and
  `README.md`: plain HTML/CSS/inline SVG/JS, no dependency, no network call, no
  runtime AI. Nothing outside `prototypes/mission-forge/` and local `docs/`
  was changed. Nothing was committed.
  - Loop implemented: `12 ÷ 3 = 4` mission, editable story with a transparent
    local interpreter (demo wording plus alternate wordings; honest refusals
    for ambiguous, sharing and unrelated text), compile reveal, Robo's 3×4
    role swap, `Yes`/`No` branches with a mission scanner, constructive repair
    (load one ship, `Repeat this group`), Teach Robo slots, `20 ÷ 5 = 4`
    transfer with 5 fixed rovers, summary, Replay and concept-review return.
  - Verified: `npm test` 81/81 and `npm run build` pass. The Mission Forge
    verification script passed 97/97 checks in capture mode and 96/96 on the
    Replay-button path. It covered desktop pointer, keyboard-only, 390×844
    touch and reduced-motion runs, with 0 console errors or warnings and
    localhost-only requests. The Decimal Dock full loop still reaches SUMMARY
    for the L, S and U personas with no console errors.
  - Evidence: `docs/prototypes/mission-forge/build-report.md`, 21 screenshots
    and verification logs in `docs/evidence/prototypes/mission-forge/`.
  - Not verified: a human 2-3 minute run, touch drag, screen-reader use.

- 2026-09-12: Reviewed the Mission Forge build in code and through a complete
  live browser run under Aditya's direction. The underlying division-role
  distinction and constructive consequence were retained as promising, while
  the fixed downstream schema made the story and proposed AI role removable.
  The live narrow view also exposed a battery-pile/story overlap in Mission 2.
- Accepted D-010: take the one allowed revision branch. Created
  `docs/prototypes/mission-forge/revision-brief.md` and
  `docs/prototypes/mission-forge/claude-code-revision-prompt.md`. The revision
  must make both valid meanings of `12 / 3 = 4` control the entire downstream
  loop, remain scripted, preserve Decimal Dock and end at an advance-or-drop
  gate.

- 2026-09-13: Executed the single D-010 revision inside
  `prototypes/mission-forge/` only (`main.js`, `styles.css`, `index.html`,
  `README.md`). The learner's story now selects one of two closed schemas for
  `12 ÷ 3 = 4`, and that selection controls the role labels, intended world,
  Robo's opposite world, scanner comparison, repair action (repeat a known
  group size vs fill a known number of groups), Robo's explanation and the
  orientation of the `20 ÷ 5 = 4` transfer. One editable story field remains,
  with two example controls (`3 in each ship`, `3 ships share`). Honest
  refusals for ambiguous, contradictory and unrelated text remain; the
  disclosure now names the reading the script chose. Still no runtime AI, no
  dependency, no network call and no change to Decimal Dock. Nothing committed.
  - Narrow defect fixed: the loose pile overflowed onto the Mission 2 story
    text at 390 × 720 and shorter (it did not reproduce at 390 × 844). The pile
    now shrinks first, and short narrow windows scroll instead of overlapping.
  - Verified: `npm test` 81/81 and `npm run build` pass. The revision
    verification script passed **252/252** checks with 0 console errors or
    warnings and only `http://localhost:5173` requests, across eight runs:
    refusals, both meanings on desktop pointer with Replay between them on one
    page, two keyboard-only runs using typed (not example) wordings, both
    meanings at 390 × 844 touch, 390 × 720, and reduced motion; re-confirmed
    252/252 on the final files. A separate layout probe reported 100 ok and 0
    overlaps across both paths at ten viewports from 320 × 568 to 1280 × 720.
  - Evidence: `docs/prototypes/mission-forge/revision-build-report.md`, 53 new
    screenshots and the verification log in
    `docs/evidence/prototypes/mission-forge/revision/`. The original 21
    screenshots and both original logs are unchanged.
  - Not verified: a human 2-3 minute run, touch drag, screen-reader use.
  - D-010 is unchanged and Mission Forge is still not selected.

- 2026-09-13: Independently reviewed the final D-010 files and selected the
  `drop` gate as D-011 under Aditya's direction. Fresh checks passed: `npm test`
  81/81, `npm run build`, both story paths manually completed with wrong and
  correct constructions, Replay reset, 252/252 browser checks, and 100/100
  layout checks across ten viewports. The causal revision succeeded, but the
  loop remained highly guided and its two-schema interpreter did not make AI
  necessary. Mission Forge is preserved as local decision evidence and must not
  receive a second revision or runtime-AI integration.

- 2026-09-13: Accepted D-012 under Aditya's direction: Equal-Sign Repair is the
  only candidate authorized for one bounded CLI AI-value comparison. Authored
  the Claude Code handoff at
  `docs/prototypes/equal-sign-repair/claude-code-ai-value-test-prompt.md`. No
  learner-facing prototype, runtime change, dependency, real learner data,
  commit, push or deployment is authorized by this decision.

- 2026-09-13: Built and ran the D-012 bounded Equal-Sign Repair AI-value test as
  a local CLI experiment in `experiments/equal-sign-repair-ai-value/`. The
  closed four-label contract, deterministic label→probe map, `0.70` confidence
  threshold, equation engine, 45 adult-authored synthetic cases and a 13-rule
  deterministic baseline are implemented; both routes receive the identical
  input, and the baseline uses the action trace as well as the text. 14/14
  experiment self-checks, `npm test` 81/81, `npm run build` and the
  experiment-local typecheck all pass; the secret scan is clean and the only new
  git entry is `?? experiments/`.

  Result: the rules baseline agrees with the adult labels on 43/45 (95.6 %) with
  one high-risk error. **`real model path untested`** — no `OPENROUTER_API_KEY`
  was configured and Aditya chose to run baseline-only, so every model-dependent
  metric is recorded as `not measured`. Provisional gate: **`unresolved`**, for
  two independent reasons — the model never ran, and the 95.6 % baseline leaves
  only 4.4 points of headroom against the pre-registered 15-point advance
  margin, so this fixture set cannot discriminate the routes. Build report:
  `docs/prototypes/equal-sign-repair/ai-value-test-build-report.md`. No concept
  was selected, no learner-facing build was started, and Decimal Dock and
  Mission Forge were not touched.

- 2026-09-14: Accepted D-013 under Aditya's direction: before spending model
  calls, test Equal-Sign Repair game feel through one isolated deterministic UI
  slice with four simulated D-012 interpretation paths. Authored the bounded
  build brief and Claude Code prompt under
  `docs/prototypes/equal-sign-repair/`. No runtime code was implemented by this
  documentation step, and no API key or real-model call is required for the
  scripted UI.

- 2026-09-14: Added a preliminary official-source K-5 math-game market
  reference scan covering Prodigy, SplashLearn, DragonBox, DreamBox and ST
  Math. The scan records product patterns, evidence limits, IP-safe inspiration,
  anti-patterns, AI terminology, a D-013 comparison checklist and open
  questions. It identifies ST Math's listed `Tug Boat with Pictures`
  equal-amounts activity as especially close prior product territory. This is
  product-reference evidence, not a full authenticated-app audit, efficacy
  proof or final-concept decision. The current D-013 Claude Code build is not
  interrupted; the scan will guide its review and any later iteration.

- 2026-09-14: Implemented the D-013 Equal-Sign Repair scripted UI slice
  ("Equalizer Lab") as four new plain HTML/CSS/JS files under
  `prototypes/equal-sign-repair/`, with no dependency, no config change, no
  network call, no storage and no runtime AI. All four scripted paths
  (`OPERATIONAL_EQUAL`, `ARITHMETIC_SLIP`, `RELATIONAL_VALID`, `UNCLEAR`) run end
  to end and change the starting state, the probe, the repair interaction and
  the transfer scaffold, not only the label text. Verification in installed
  Google Chrome through the existing dev-only playwright-core: 564/564 behaviour
  checks and 228/228 layout states passed, with 0 console errors or warnings and
  only `http://localhost:5173` requests; `npm test` 81/81 and `npm run build`
  pass unchanged. Evidence in
  `docs/evidence/prototypes/equal-sign-repair/scripted-ui/`; report in
  `docs/prototypes/equal-sign-repair/scripted-ui-build-report.md`. Decimal Dock,
  Mission Forge and the D-012 harness were not touched, nothing was committed,
  and no concept or next gate was selected. The strongest recorded reason to
  drop: the repair answer and the transfer answer are both `4`, so the transfer
  cannot distinguish relational reasoning from repeating a number.

- 2026-09-14: Independently reviewed the completed D-013 slice and accepted
  D-014 to drop Equal-Sign Repair. Fresh checks passed: `npm test` 81/81,
  `npm run build`, 564/564 browser behaviour checks and 228/228 layout checks.
  All four scripted paths work, but the transfer repeats the repair answer,
  visual equalization does not establish changed understanding of `=`, and the
  closed branch map does not justify runtime AI. The D-012 real-model route will
  not be run. No runtime code was deleted or changed, and nothing was committed,
  pushed or deployed by this decision step.

- 2026-09-14: Accepted D-015 under Aditya's direction: keep the GitHub
  repository public and publish the useful research, decisions, source
  snapshots, reports, verification records, Decimal Dock reference app,
  D-012 experiment and dropped prototypes for collaborator reference. This
  supersedes the research-phase private/local-only defaults in D-004 and D-005.
  Secrets, generated builds, private notes, local agent state and roughly 50 MB
  of repetitive generated prototype screenshots remain excluded. No
  open-source license or final product selection was made.

- 2026-09-14: Published the D-015 public research and prototype archive to
  `origin/main` through four purpose-separated commits: repository hygiene
  (`5cd3668`), research and decisions (`3ec25cd`), Decimal Dock reference app
  (`59c69a8`), and rejected concept archives (`afaecd5`). Fresh pre-push checks:
  `npm test` 81/81, `npm run build`, Equal-Sign Repair harness self-checks
  14/14, experiment typecheck, staged whitespace checks and tracked secret scan
  all passed. The remote was 0 commits ahead before the push. Bulk generated
  prototype PNGs and local/private material remain untracked and were not
  deleted.

- 2026-09-14: Added a zero-knowledge collaborator handoff and copy-paste
  Claude/Codex onboarding prompt. The first session now uses a bounded reading
  order, fresh install/test/build checks and inspection of all three runnable
  paths, then stops at a report separating verified facts, recorded decisions,
  product judgment, unresolved issues and one next research task. It authorizes
  no code change, API key, model call, branch, commit, push or deployment.

- 2026-09-14: Accepted D-016 and prepared a market-guided Claude Code research
  prompt. The next research pass must study observable loops in Prodigy,
  SplashLearn, DragonBox, DreamBox and ST Math; extract IP-safe mechanisms;
  combine them with existing misconception evidence; generate exactly six
  original hypotheses; and recommend only a cheap non-code validation target.
  It is not blind ideation and authorizes no runtime change, real-model call,
  prototype or final selection.

## Current checkpoint

Final concept selection remains open. Decimal Dock remains preserved. Mission
Forge is closed by D-011, and Equal-Sign Repair is closed by D-014. Its
real-model comparison will not be run. Remainder Routing remains a researched
fallback, not an authorized build. No product implementation is currently
authorized.

## Next actions

Immediate:

- Run the D-016 market-guided Claude Code prompt and independently review its
  report before authorizing any product implementation.
- Have the new collaborator run the separate read-only onboarding prompt and
  return their assessment independently.
- Do not resume Mission Forge or Equal-Sign Repair work. Preserve Decimal Dock
  and both closed experiments as reference material until the final concept is
  deliberately selected.

Standing:

- Record every new dependency, model, API and asset in the evidence register
  as it is added; re-run the license scan before submission.
- Revisit repository visibility and judge access before submission.
