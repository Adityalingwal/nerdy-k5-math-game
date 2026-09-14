# Claude Code Entry Point

Read `AGENTS.md`, then `docs/00-index.md`, before doing any work.

The canonical project record lives under `docs/`. Do not infer finalized scope
from chat history.

Current product-selection state:

- The K-5 Math Game direction and the one-learner/one-misconception/one-loop
  constraint remain accepted.
- Decimal Dock was locked and implemented on 2026-09-08, but its concept choice
  was reopened for comparison on 2026-09-09. Preserve it; do not treat it as the
  final submission concept or delete/rewrite it.
- The isolated scripted Mission Forge prototype was built, revised once under
  D-010 and independently reviewed. D-011 dropped the concept because its
  closed two-schema loop did not justify a necessary AI contribution. Preserve
  `prototypes/mission-forge/` as decision evidence; do not revise it again or
  add runtime AI.
- The D-012 Equal-Sign Repair CLI harness and D-013 deterministic scripted UI
  are built and independently reviewed. D-014 dropped the concept because the
  interaction did not establish a strong transfer test or a necessary runtime
  AI contribution. Preserve the harness, prototype and evidence; do not run
  the real-model route, revise the concept or add runtime AI.
- Final concept selection is open. No new implementation is currently
  authorized. Preserve Decimal Dock and both closed experiments until a later
  recorded decision sets the next direction.
- D-015 makes this a public research and prototype archive. Research, decisions,
  source snapshots, verification records and runnable reference code are
  intentionally versioned. Do not commit secrets, `.env`, generated builds,
  private notes, local agent state or bulk generated prototype screenshots.
  Public visibility does not reactivate a dropped concept or grant an
  open-source license.
- A zero-knowledge collaborator must follow `docs/collaborator-handoff.md`.
  Its first-pass prompt is deliberately read-only: understand, verify and
  report before proposing implementation.
- D-016 authorizes one market-guided research pass through
  `docs/prompts/claude-code-market-guided-concept-research-prompt.md`. Follow
  that prompt exactly. It may create one research report and update progress
  and evidence only; it does not authorize code, a prototype, a model API call
  or final concept selection.

For the historical Mission Forge record, read:

1. `docs/prototypes/mission-forge/build-report.md`
2. `docs/prototypes/mission-forge/acceptance-and-review.md`
3. `docs/prototypes/mission-forge/revision-brief.md`
4. `docs/prototypes/mission-forge/claude-code-revision-prompt.md`

The original handoff (`build-brief.md`, `claude-code-prompt.md`) is historical
and was already executed.
