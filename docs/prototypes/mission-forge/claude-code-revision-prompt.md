# Claude Code Prompt — Mission Forge One Bounded Revision

Copy everything below into a fresh Claude Code session.

---

Work only in the authoritative repository:

`/Users/mac/Desktop/nerdy-k5-math-game`

Do not use any old workspace under `/Users/mac/Documents/Codex/`.

Your task is to perform the single bounded Mission Forge revision authorized by
D-010. This is not a new game, broad redesign, final concept selection or
runtime-AI integration.

Before changing anything, completely read these files in order:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/00-index.md`
4. `docs/rules-and-compliance.md`
5. `docs/decision-log.md`, especially D-009 and D-010
6. `docs/prototypes/mission-forge/build-report.md`
7. `docs/prototypes/mission-forge/acceptance-and-review.md`
8. `docs/prototypes/mission-forge/revision-brief.md`
9. all four current runtime files under `prototypes/mission-forge/`

Then inspect `git status`. Preserve all existing uncommitted work.

Implement the revision exactly as specified in `revision-brief.md`. The key
acceptance fact is this:

> Changing the first story between `3 crystals in each ship` and `3 ships
> sharing 12 crystals` must change the role labels, intended world, Robo's
> opposite world, repair action, explanation and transfer orientation.

Hard boundaries:

- Modify runtime code only under `prototypes/mission-forge/`.
- Preserve the root Decimal Dock and do not edit `src/`, `api/`, `scripts/`,
  root `index.html`, package/lock files, Vite/TypeScript/Vitest config, existing
  tests or deployment files.
- Add no dependency, API, model, backend, network call, key, persistence,
  analytics or child data.
- Do not run Fusion, spawn sub-agents or reopen broad ideation.
- Keep exactly the two equations and one division-role misconception.
- Keep deterministic math and mission-role truth. The local interpreter may
  select only a closed story-role schema and must disclose that no AI runs.
- Do not copy or add third-party assets, fonts, characters, sounds or code.
- Do not commit, push, deploy or change repository visibility.
- Do not claim learning efficacy or mastery.

Implementation expectations:

1. Give Aditya a short Hinglish checkpoint before editing: what you verified,
   what will change and what remains untouched.
2. Refactor the current fixed `ships` mission only as much as needed so both
   valid story structures drive the full downstream state.
3. Keep one editable story input and add two clear example controls for testing
   the two meanings.
4. Make Robo's wrong world the opposite interpretation of the selected story,
   not one globally fixed mistake.
5. Use the correct constructive action for each path: repeat a known group size
   or fill a known number of fixed groups.
6. Make `20 / 5 = 4` contrast with whichever first path was selected.
7. Fix the narrow/mobile battery pile overlap seen during the live review.
8. Preserve honest unsupported/ambiguous handling, keyboard support, visible
   focus, reduced motion and Replay.
9. Complete both paths in a real browser at desktop and mobile-like sizes. Test
   at least one wrong construction on each path, keyboard-only completion,
   Replay, reduced motion, console output and network requests.
10. Run `npm test` and `npm run build`.
11. Save new screenshots and verification output only under
    `docs/evidence/prototypes/mission-forge/revision/`; do not overwrite the
    original evidence.
12. Create `docs/prototypes/mission-forge/revision-build-report.md` with exact
    files changed, exact checks/results, remaining limitations and the strongest
    reason to drop the concept after this revision.
13. Update `docs/progress.md` and `docs/evidence-register.md` only with verified
    implementation/test/asset facts. Do not change D-010 or lock Mission Forge.

Stop and report the exact blocker if meeting a requirement would require
changing Decimal Dock, adding runtime AI, expanding curriculum scope or making
an unsafe assumption.

At completion, respond in concise Hinglish with:

- local URL;
- exact files changed;
- both story paths demonstrated;
- exact test/build/browser results;
- evidence and revision-report paths;
- incomplete items;
- strongest remaining reason to drop.

---
