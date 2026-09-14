# Project Index

Last reviewed: 2026-09-14

## Current truth

- Selected challenge direction: K-5 Math Game.
- Product selection: **reopened for comparison on 2026-09-09 (D-009)** after
  Aditya reviewed the Decimal Dock experience. Decimal comparison was locked
  and implemented under D-008, but it is no longer assumed to be the final
  submission concept; it remains preserved as a working candidate.
- Closed experiment: the isolated scripted Mission Forge slice was built,
  revised once under D-010, and independently reviewed in code and browser.
  The causal revision passed, but D-011 chose `drop` because the remaining
  loop stayed highly guided and the two-schema interpreter did not justify a
  necessary runtime-AI contribution. Preserve the prototype and evidence; do
  not revise or integrate AI into it.
- Superseded hypothesis: Grade 2/3 place value and regrouping (D-003,
  rejected; research retained as background).
- Closed experiment: the D-012 Equal-Sign Repair harness and D-013 scripted UI
  were built and independently reviewed. The implementation checks passed, but
  D-014 chose `drop`: the transfer could be passed by repeating the repair
  answer, the interaction did not establish changed relational understanding,
  and the small authored branch map did not justify runtime AI. Preserve the
  harness, prototype and evidence; do not run the real-model route or revise
  the concept.
- Current phase: D-016 authorizes one market-guided mechanism-research and
  concept-synthesis pass before another build. Final concept selection remains
  open. The Day 1-3 Decimal Dock MVP remains preserved at the repository root
  as a working candidate, not the final concept. Remainder Routing remains
  researched only. No new prototype, model test or product implementation is
  currently authorized.
- Repository status: D-015 authorizes the useful research, documentation,
  reference implementation and closed experiments to be published in the
  existing public GitHub repository. Secrets, generated build output, private
  notes and large repetitive prototype screenshot sets remain local. Public
  visibility does not select a final concept or grant an open-source license.
  Working repository location is `/Users/mac/Desktop/nerdy-k5-math-game`.

## Read in this order

0. [Collaborator onboarding and handoff](collaborator-handoff.md) - the short
   zero-knowledge reading, verification and contribution path. Its
   [copy-paste AI prompt](prompts/brother-onboarding-prompt.md) is read-only on
   the first pass.
1. [Hackathon brief](hackathon-brief.md) - what Nerdy is asking for.
2. [Rules and compliance](rules-and-compliance.md) - hard submission, IP,
   licensing, privacy, and testing constraints.
3. [Decision log](decision-log.md) - historical locks and the current reopened
   comparison state.
4. [Mission Forge build brief](prototypes/mission-forge/build-brief.md) - exact
   bounded scripted-slice specification; not a final product decision.
5. [Mission Forge acceptance and review](prototypes/mission-forge/acceptance-and-review.md)
   - implementation checks and the advance/revise/drop gate.
6. [Claude Code prompt](prototypes/mission-forge/claude-code-prompt.md) -
   implementation handoff (already executed on 2026-09-12).
   [Build report](prototypes/mission-forge/build-report.md) - what was built,
   verification results, gaps, and the strongest reason to reject.
   [Revision brief](prototypes/mission-forge/revision-brief.md) and
   [revision prompt](prototypes/mission-forge/claude-code-revision-prompt.md) -
   the one historical Mission Forge revision authorized by D-010; already
   executed and no longer active after D-011.
   [Revision build report](prototypes/mission-forge/revision-build-report.md) -
   what the revision changed, checks and results, limitations, and the final
   independent review. Executed on 2026-09-13; D-011 closed Mission Forge at
   the `drop` gate.
7. [Equal-Sign Repair AI-value-test prompt](prototypes/equal-sign-repair/claude-code-ai-value-test-prompt.md)
   - historical D-012 harness handoff; implemented, with the model route still
   untested.
8. [Equal-Sign Repair scripted UI brief](prototypes/equal-sign-repair/scripted-ui-brief.md)
   and [Claude Code UI prompt](prototypes/equal-sign-repair/claude-code-scripted-ui-prompt.md)
   - historical D-013 handoff; implemented and closed at the D-014 `drop` gate.
9. [Product hypothesis](product-hypothesis.md) - current and historical product
   hypotheses.
10. [Research plan](research-plan.md) - original research questions and method.
11. [K-5 math-game market reference scan](research/k5-math-game-market-patterns-2026-09-14.md)
   - preliminary official-source comparison of Prodigy, SplashLearn,
   DragonBox, DreamBox and ST Math; includes reusable patterns, anti-patterns,
   evidence limits and the checklist used to review the D-013 prototype.
   [Market-guided Claude Code research prompt](prompts/claude-code-market-guided-concept-research-prompt.md)
   - the active D-016 handoff for mechanism extraction and original concept
   synthesis; research only, no implementation.
12. [Decimal deep research](research/deep/decimal-longer-is-larger.md) -
   verified evidence, disconfirming evidence, AI value test, demo spine,
   and risks for the implemented candidate.
13. [Independent blind candidate reports](research/independent/) - Claude and
   Codex divergent discovery (15 candidates each); not canonical evidence.
14. [Deep research on set-aside candidates](research/deep/) - subtraction
   smaller-from-larger (backup) and division remainder.
15. [Grade 2/3 misconception research](research/grade-2-3-misconceptions.md) -
   superseded hypothesis; representation and deterministic/AI boundary
   reasoning remain reusable.
16. [Progress](progress.md) - completed work and immediate next actions.
17. [Implementation plan](implementation-plan.md) - historical Decimal Dock
    build spec; do not apply it to Mission Forge.
18. [Evidence register](evidence-register.md) - source, asset, dependency, AI-use,
    test, and demo proof trail.
19. [Evidence artefacts](evidence/) - AI value test runs and loop screenshots.

## Source snapshots

- [Landing-page facts](../references/2026-09-04-landing-page-facts.md)
- [Official-rules facts](../references/2026-09-04-official-rules-facts.md)

## Working rule

A fact describes what a source says. A hypothesis is something we may build. A
decision is a choice we have explicitly locked. Only the decision log can move a
hypothesis into committed scope.
