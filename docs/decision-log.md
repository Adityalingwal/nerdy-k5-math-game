# Decision Log

## D-001: Use the provided K-5 Math Game prompt

- Status: accepted
- Date: 2026-09-04
- Reason: clear elementary learner, concrete foundational-math domain, and direct
  alignment with Nerdy's stated progression and mastery goals.
- Consequence: research and implementation will not evaluate the language or
  literacy prompts unless this decision is explicitly reopened.

## D-002: Build one polished learning loop

- Status: accepted
- Date: 2026-09-04
- Reason: the entry must communicate its learner problem, AI contribution, and
  product quality in a video no longer than three minutes. Breadth would weaken
  completion and evidence.
- Consequence: broad curriculum, LMS, account, and platform features remain out
  of scope unless essential to the loop.

## D-003: Grade 2/3 place value and regrouping

- Status: rejected on 2026-09-08 (superseded by D-008)
- Date: 2026-09-04
- Reason: it appears visually representable and produces diagnosable mistakes,
  but evidence and alternatives have not yet been compared.
- Rejection reason (2026-09-08): two independent blind candidate reports
  (Claude, Codex) both failed this concept on the genuine-AI test because a
  deterministic rule table covers all meaningful adaptation; its evidence base
  contained no prevalence or intervention studies. The base-ten research in
  `docs/research/grade-2-3-misconceptions.md` is retained as reusable
  background (representation and deterministic/AI boundary reasoning).

## D-004: Repository visibility and licensing

- Status: accepted for the research phase
- Date: 2026-09-04
- Decision: keep the working GitHub repository private until the submission IP,
  third-party licensing, and judge-access strategy is finalized.
- Reason: the official rules assign broad ownership upon submission, while the
  code and asset licensing plan is not yet complete.
- Revisit: before sharing with judges or submitting. Do not add an open-source
  license without a deliberate review of Section 7 of the official rules.

## D-005: Keep working documentation local

- Status: accepted
- Date: 2026-09-04
- Decision: keep `AGENTS.md`, `CLAUDE.md`, `docs/`, `references/`, informal notes,
  and private working material out of GitHub.
- Reason: the remote repository should contain the codebase and only deliberately
  selected public-facing documentation, not internal research or process notes.
- Consequence: these paths remain on the local system and are covered by
  `.gitignore`. Public documentation can be added later in a separately chosen
  path when it is genuinely useful for judges or users.

## D-006: Use a clear working repository name and Desktop location

- Status: accepted
- Date: 2026-09-05
- Decision: use `nerdy-k5-math-game` as the local folder and GitHub repository
  name, with the local repository at `/Users/mac/Desktop/nerdy-k5-math-game`.
- Reason: the name is professional, directly matches the selected prompt, and
  remains valid while the final product brand is still undecided.
- Consequence: rename the product and repository later only after the product
  concept and public brand are deliberately locked.

## D-007: Use a geography-neutral core learning mechanic

- Status: accepted
- Date: 2026-09-07
- Decision: define the learner primarily by mathematical prerequisites and
  observable difficulty, not by nationality. Keep the essential base-ten math
  mechanic free of country-specific currency, curriculum labels, and cultural
  assumptions; keep language and context replaceable around that core.
- Reason: the intended learning problem should be usable across countries, while
  the evidence must still account for differences in curriculum sequence,
  number language, notation, classroom practice, and learner context.
- Consequence: the first demo may use English as required for submission, but
  must not claim proven effectiveness for every country or learner. Research
  should triangulate multiple curriculum systems and cross-cultural studies
  without expanding the prototype into a global curriculum platform.

## D-008: Lock the core concept: decimal comparison ("longer is larger"), Grade 4-5

- Status: accepted on 2026-09-08; reopened for final-concept comparison by
  D-009 on 2026-09-09 (not rejected or deleted)
- Date: 2026-09-08
- Decision: the single learning loop targets the decimal-comparison
  misconception in which a learner treats decimals as whole numbers to the
  right of the point (0.45 > 0.8 "because 45 > 8"; the reverse
  shorter-is-larger rule is the second target). Target learner: age 9-11,
  reads decimals to hundredths, understands whole-number place value, shows the
  L or S rule pattern on placement items. Representation: zoomable 0-1 number
  line. Core action: place decimals, zoom to resolve; second phase: find and
  fix an erroneous example. Transfer: pairs that defeat both length rules,
  ordering, money and measurement contexts.
- Deterministic responsibility: all magnitude truth; L/S/A/U rule
  classification from placements (Steinle and Stacey Decimal Comparison Test
  core items); zoom rendering; item selection; mastery gating; spacing.
- AI responsibility (one, bounded): (a) classify the learner's typed
  explanation into a closed label set (L, S, MONEY, SLIP, GUESS, UNCLEAR) with
  a confidence gate; (b) generate an erroneous example that mirrors the
  learner's inferred rule and, where available, their own words; (c) phrase
  learner-facing explanations in the configured language. The model never
  decides which decimal is larger. Fallback: authored erroneous-example bank
  per rule plus keyword classifier; the loop is complete without the model.
- Reason: two independent blind reports and a bounded deep-research pass
  ranked it highest on combined evidence, AI genuineness, and demo clarity:
  Grade 4 prevalence of the L rule is about 70% (Steinle and Stacey, Australia,
  3,204 students, full-text verified); the rule structure gives a validated
  deterministic diagnostic; erroneous examples have delayed-learning evidence
  (McLaren et al. 2015, US middle school); a decimal game beat a conventional
  tutor (d = 0.43 immediate, 0.37 delayed, McLaren et al. 2017); age 9-11
  makes short typed explanations realistic. Details in
  `docs/research/deep/decimal-longer-is-larger.md`.
- Known risks accepted: intervention RCTs are Grades 6-7, not 4-5; the
  delayed-test benefit cannot be shown in a three-minute demo; the L/S label is
  unstable across months, so the rule is inferred per session and never stored
  as a trait; erroneous-example benefit may depend on prior proficiency, so
  GUESS/UNCLEAR learners get a worked correct example instead; ChatGPT-class
  models judged decimal answers only about 75% correctly, so the model is
  never the correctness arbiter; India's current NCERT sequence places decimals
  in Class 6, so the demo states US Common Core 4.NF.7 as the reference
  sequence and acknowledges the variation.
- Alternatives considered and set aside: subtraction smaller-from-larger
  (strongest misconception evidence, but only one narrow AI touchpoint
  survives; kept as backup); division-with-remainder sense-making (no
  intervention evidence; typed justification confounds with reading);
  equal sign (age 6-9 makes typed explanation unrealistic); fraction magnitude
  (existing products; one RCT with failed transfer). See
  `docs/research/independent/` and `docs/research/deep/`.
- Consequence: implementation planning may begin. Scope stays one learner, one
  misconception, one loop, one AI contribution. Decimal separator, currency,
  and language are configuration around a notation-neutral core.

## D-009: Reopen concept selection and authorize one isolated Mission Forge slice

- Status: accepted
- Date: 2026-09-09
- Decision: preserve the existing Decimal Dock MVP, but stop assuming it is the
  final submission concept. Build one separate scripted Mission Forge vertical
  slice as decision evidence. Mission Forge is not selected or locked by this
  authorization.
- Reason: after reviewing the live Decimal Dock experience, Aditya found the
  interaction too plain and insufficiently character-driven. Subsequent paper
  comparison found Equal-Sign Repair strongest on matched learning evidence,
  Remainder Rescue strongest on ready-made narrative consequences, and Mission
  Forge strongest on the proposed AI-native promise. More discussion cannot
  reliably establish game feel; a small playable slice can reduce that
  uncertainty without committing to a rebuild.
- Prototype boundary: one `12 / 3 = 4` learner-authored mission, Robo's
  group-size/number-of-groups role swap, one constructive repair, and one
  contrasting `20 / 5 = 4` transfer mission. Runtime AI is explicitly mocked by
  a transparent local script. No new dependency, backend, API, deployment,
  child data, or change to Decimal Dock is authorized.
- Decision gate after adult-operated review: advance to a bounded real-AI test,
  revise one blocking interaction once, or drop Mission Forge. Record that
  choice before expanding scope.

## D-010: Revise Mission Forge once so the learner's story controls the world

- Status: accepted
- Date: 2026-09-12
- Decision: take the `revise once` branch from D-009. Preserve Decimal Dock and
  revise the existing isolated Mission Forge prototype; do not create a new
  product concept or add runtime AI yet.
- Reason: live browser and product review under Aditya's direction found the
  division-role distinction legitimate and the constructive debug consequence
  promising. However, the accepted story
  wording currently selects one fixed schema, after which the world, Robo's
  mistake, repair and transfer no longer depend on the learner's story. The
  proposed AI contribution is therefore removable in the current build.
- Single blocking interaction: make the story causal. The local scripted
  interpreter must distinguish both valid meanings of `12 / 3 = 4`: `3 in each
  ship -> 4 ships` and `3 ships -> 4 in each`. That interpretation must control
  the labelled roles, intended world, opposite Robo world, constructive repair
  mode and the orientation of the contrasting `20 / 5 = 4` transfer.
- Boundary: keep the same learner, misconception, two equations, Robo fantasy
  and deterministic source of mathematical truth. Fix the observed narrow-view
  battery/story overlap as a defect. Add no dependency, API, model, backend,
  persistence, child data, deployment or change to Decimal Dock. The existing
  limitation that one guided transfer is not a mastery claim remains explicit.
- Next gate: after the revised scripted slice is played, choose either
  `advance` to a bounded real-AI parser test or `drop`. No second conceptual
  revision is authorized.

## D-011: Drop Mission Forge after the bounded revision

- Status: accepted
- Date: 2026-09-13
- Decision: close the Mission Forge experiment at the `drop` branch of the
  D-010 gate. Preserve the prototype, reports and evidence as decision
  material, but do not add runtime AI, revise the concept again or treat it as
  the submission concept.
- Reason: independent code, build and browser review confirmed that the D-010
  revision works as specified: the two valid story meanings now change the
  labels, intended and opposite worlds, repair action, explanation and transfer
  orientation. The remaining problem is product-level rather than a missing
  implementation fix. The loop is still highly guided, its two-schema story
  interpreter is adequately handled by deterministic rules, and expanding the
  language space enough to make AI necessary would also increase parsing,
  fairness and child-comprehension risk. The AI contribution is therefore not
  clear or necessary enough for this submission direction.
- Consequence: do not continue Mission Forge implementation. Return to bounded
  comparison of the already researched candidates, with Decimal Dock preserved
  as a working candidate. Do not start parallel builds or broad new ideation;
  select one next candidate before authorizing any prototype.

## D-012: Select Equal-Sign Repair for one bounded AI-value test

- Status: accepted
- Date: 2026-09-13
- Decision: select Equal-Sign Repair only for one local, CLI-based comparison
  of a constrained real-AI explanation interpreter against a compact
  deterministic rules baseline. This does not select the final submission
  concept or authorize a learner-facing game prototype.
- Reason: among the already researched candidates, Equal-Sign Repair has the
  strongest directly matched intervention evidence, small-number mathematics
  and the simplest plausible construction loop. Its main unresolved risk is
  decisive: AI may add no meaningful value over authored branching. Testing
  that risk before building UI is cheaper and more informative than another
  speculative prototype.
- Boundary: use adult-authored synthetic explanations only. Deterministic code
  owns equation truth, valid constructions and progression. The model may only
  map an action trace plus explanation to a closed reasoning label and authored
  probe ID, with confidence gating and a safe unclear fallback. Do not modify
  Decimal Dock or Mission Forge, add product UI, use real learner data, add a
  dependency, commit, push or deploy.
- Next gate: after Claude Code implements and runs the harness, Codex must
  independently inspect it, rerun both routes and add fresh holdout cases.
  Then choose `advance` to one Equal-Sign Repair prototype, `drop AI claim`, or
  `unresolved`. No prototype is authorized before that recorded review.

## D-013: Test Equal-Sign Repair game feel with one scripted UI slice

- Status: accepted
- Date: 2026-09-14
- Decision: before spending model calls, build one isolated deterministic,
  adult-operated Equal-Sign Repair UI slice that simulates the four D-012
  interpretation results. This changes the ordering of D-012's next gate but
  does not select the final concept or authorize runtime AI.
- Reason: the D-012 harness established that a real model has not yet run and
  that its authored fixture set cannot decide the AI advantage. Aditya wants to
  inspect the actual game experience first. A zero-API scripted slice can test
  whether equality construction, branch-specific repair and transfer are
  understandable and game-like; if they are weak, the concept can be dropped
  without spending model calls.
- Boundary: one learner, the operational reading of `=`, one repair equation
  (`6 + 5 = 7 + ?`), one transfer (`12 = 8 + ?`), and exactly four simulated
  labels: `OPERATIONAL_EQUAL`, `ARITHMETIC_SLIP`, `RELATIONAL_VALID`, `UNCLEAR`.
  Deterministic code owns all mathematics and progression. Runtime files stay
  under `prototypes/equal-sign-repair/`. No API, model, key, dependency,
  backend, persistence, analytics, real learner data, deployment, commit, push,
  Decimal Dock change, Mission Forge change or D-012 harness change.
- Next gate: after adult-operated browser review, choose `advance` to the
  independent holdout plus real-model test, `revise once` for one blocking
  interaction, or `drop`. No second conceptual revision is authorized.

## D-014: Drop Equal-Sign Repair after the scripted UI review

- Status: accepted
- Date: 2026-09-14
- Decision: close Equal-Sign Repair at the `drop` branch of the D-013 gate.
  Preserve the D-012 harness, the D-013 prototype, reports and evidence as
  decision material, but do not run the real-model comparison, add runtime AI,
  revise the concept again or treat it as the submission concept.
- Verified facts: fresh independent review passed `npm test` (81/81),
  `npm run build`, the 564-check browser behaviour suite and the 228-check
  layout probe. All four scripted paths work and differ in their starting
  state, probe, repair support and transfer scaffold.
- Product judgment: the successful build does not establish a strong learning
  loop or a necessary AI contribution. The repair and transfer both resolve to
  `4`, so transfer can be passed by repeating the prior answer. The visual
  equalization interaction can be completed without showing that the learner's
  meaning of `=` changed. The four branches form a small closed authored map
  that deterministic logic already handles, while the market scan found close
  existing equal-amounts game territory and therefore raises the
  differentiation bar.
- Consequence: Mission Forge and Equal-Sign Repair are closed experiments.
  Decimal Dock remains preserved, and Remainder Routing remains research only.
  Final concept selection is open; no new prototype, runtime-AI test or product
  implementation is authorized until one next direction is deliberately
  selected.

## D-015: Publish the research and prototype archive on GitHub

- Status: accepted
- Date: 2026-09-14
- Decision: supersede D-004's private-repository default and D-005's local-only
  documentation rule. Keep the existing GitHub repository public and publish
  the useful research, decisions, source snapshots, build reports, verification
  records, Decimal Dock reference implementation, D-012 experiment and both
  dropped scripted prototypes.
- Reason: Aditya wants the complete learning and decision trail available as a
  reference for his brother and future iteration. The runnable code gives the
  research concrete context even when a concept was dropped; keeping it does
  not reactivate or select that concept.
- Boundary: do not publish secrets, `.env`, dependency/build output, local agent
  state, private notes or temporary work. Keep large repetitive generated
  prototype screenshot sets out of Git history while tracking their scripts and
  text logs. Add no open-source license without a separate ownership review.
  Public visibility is not a final-product or submission decision.
- Collaboration consequence: before collaborator-authored material is included
  in a hackathon submission, record its provenance and obtain any written
  rights assignment required by the official rules.
