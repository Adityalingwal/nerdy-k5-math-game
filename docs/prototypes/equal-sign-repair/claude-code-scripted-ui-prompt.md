# Claude Code Prompt — Equal-Sign Repair Scripted UI Slice

Copy everything below into a fresh Claude Code session.

---

Work only in the authoritative repository:

`/Users/mac/Desktop/nerdy-k5-math-game`

Do not use any old workspace under `/Users/mac/Documents/Codex/`.

Your task is to implement the one bounded, deterministic Equal-Sign Repair UI
slice authorized by D-013. This is an adult-operated product/game-feel test.
It is not final concept selection, a learner study or a runtime-AI integration.

Before changing anything, completely read these files in order:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `docs/00-index.md`
4. `docs/rules-and-compliance.md`
5. `docs/decision-log.md`, especially D-011 through D-013
6. `docs/product-hypothesis.md`
7. `docs/research/independent/codex-blind-candidates.md`, C09 and the final
   Equal-Sign Repair ranking section
8. `docs/research/independent/claude-blind-candidates.md`, C8
9. `docs/prototypes/equal-sign-repair/scripted-ui-brief.md`
10. `docs/prototypes/equal-sign-repair/ai-value-test-build-report.md`
11. all files under `experiments/equal-sign-repair-ai-value/`
12. `docs/progress.md` and `docs/evidence-register.md`

Then inspect `git status --short --branch` and list the exact existing changed
and untracked files. Preserve all existing work.

Before editing, give Aditya a short Hinglish checkpoint separating verified
facts, the exact UI slice you will add, files that remain untouched and known
limitations.

## Implement exactly this slice

Follow `docs/prototypes/equal-sign-repair/scripted-ui-brief.md` as the complete
product, math, visual, interaction, accessibility and scope contract.

Create runtime files only under:

`prototypes/equal-sign-repair/`

Expected minimal files:

- `index.html`
- `styles.css`
- `main.js`
- `README.md`

Use plain HTML/CSS/JavaScript with original inline SVG/CSS artwork. Add no
dependency and do not modify package or config files.

Working fantasy: **Equalizer Lab**, a side-on 2D floating energy bridge with
two equal-unit rails and one original maintenance bot. The main verbs are
inspect, add/remove cells, compare complete side totals, repair, clarify and
transfer. Keep the central playfield dominant and the UI low-chrome: one small
objective chip, one collapsed `Test paths` control and one contextual tool
tray. Avoid a generic dashboard, a worksheet-card grid, large permanent text
panels, decorative animation and answer-button-only repair.

The default path is `OPERATIONAL_EQUAL`. The collapsed test drawer must load
exactly four adult-authored synthetic paths:

- `OPERATIONAL_EQUAL`
- `ARITHMETIC_SLIP`
- `RELATIONAL_VALID`
- `UNCLEAR`

There is no separate `RELATIONAL` or `VALID` label. Each path must change the
synthetic trace, feedback, repair interaction and transfer scaffold exactly as
the brief specifies. Clearly show `Scripted concept prototype — no runtime AI`.
Do not pretend to interpret arbitrary typed language.

All equation values and progression must come from a small deterministic local
engine. Use only `6 + 5 = 7 + ?` for the repair and `12 = 8 + ?` for transfer.
The model/API layer is absent. Do not read `.env`; no OpenRouter key is needed.

## Hard boundaries

- Do not modify Decimal Dock: `src/`, `api/`, `scripts/`, `tests/`, root
  `index.html`, package/lock files, Vite/TypeScript/Vitest config or deployment
  files.
- Do not modify `prototypes/mission-forge/` or any of its evidence.
- Do not modify the D-012 experiment under
  `experiments/equal-sign-repair-ai-value/`.
- Do not change D-013 or earlier decisions.
- Add no API, model, key, backend, network call, persistence, analytics,
  dependency, child data, third-party font, image, icon, character, sound or
  copied code.
- Do not commit, push, deploy, create a branch or change repository visibility.
- Do not claim learning efficacy, grade suitability or mastery.

Stop and report the blocker if the brief appears to require changing any
protected file or expanding beyond the two equations, four scripted paths and
one repair/transfer loop.

## Required verification

Use the already installed local browser tooling without changing dependencies.
Run and record:

1. `npm test`;
2. `npm run build`;
3. all four scripted paths end to end on desktop `1280 × 720`;
4. all four paths at `390 × 844`, plus at least the default path at
   `390 × 720`;
5. at least one wrong repair before success on `OPERATIONAL_EQUAL`,
   `ARITHMETIC_SLIP` and `UNCLEAR`;
6. a wrong transfer before success;
7. `RELATIONAL_VALID` skipping remedial repair and receiving the faded
   symbolic transfer;
8. Replay and path switching on one page;
9. keyboard-only completion;
10. reduced-motion behavior;
11. horizontal overflow and element-overlap checks;
12. console warnings/errors and all network requests.

Save only new verification logs, scripts and screenshots under:

`docs/evidence/prototypes/equal-sign-repair/scripted-ui/`

Do not overwrite other evidence.

Create:

`docs/prototypes/equal-sign-repair/scripted-ui-build-report.md`

The report must state exact files changed, exact test/browser results, path-by-
path behavior, assets/dependencies, limitations and the strongest reason to
drop after seeing this UI. Explicitly separate verified facts, product
judgment and unresolved questions. State that this is synthetic adult-operated
product-design evidence, not proof of child learning or AI value.

Update `docs/progress.md` and `docs/evidence-register.md` only with facts you
actually verify. Do not select the final concept or choose the next gate.

At completion, respond in concise Hinglish with:

- local URL;
- exact files changed;
- four paths demonstrated;
- exact test/build/browser results;
- evidence and build-report paths;
- incomplete items;
- strongest remaining reason to drop.

---
