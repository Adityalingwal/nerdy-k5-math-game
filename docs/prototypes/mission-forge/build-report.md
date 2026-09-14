# Mission Forge Scripted Slice — Build Report

Date: 2026-09-12
Builder: Claude Code (Opus 5), directed by Aditya, from
`build-brief.md`, `acceptance-and-review.md` and `claude-code-prompt.md`.
Status: **built and machine-verified; not yet reviewed by Aditya.** This report
does not select, lock or validate Mission Forge. D-009 is unchanged.

## 1. Files

Created (runtime, all under `prototypes/mission-forge/`):

| File | Lines | Purpose |
| --- | ---: | --- |
| `prototypes/mission-forge/index.html` | 207 | Page shell, original inline SVG sprite (crystal, battery, ship, rover), procedural Robo SVG, below-the-fold review section |
| `prototypes/mission-forge/styles.css` | 1572 | Fabrication-bay look, Robo moods, world objects, dock, narrow layout, reduced-motion rules |
| `prototypes/mission-forge/main.js` | 1571 | Mission schemas, pure engine, scripted interpreter, step flow, rendering and animation |
| `prototypes/mission-forge/README.md` | 92 | Run command, loop, scripted-vs-real table, code layout, boundaries |

Created (local documentation and evidence only; `docs/` is gitignored per D-005):

- `docs/prototypes/mission-forge/build-report.md` (this file)
- `docs/evidence/prototypes/mission-forge/*.png` (21 screenshots, section 5)
- `docs/evidence/prototypes/mission-forge/verification-log.txt` (capture run, 97/97)
- `docs/evidence/prototypes/mission-forge/verification-log-replay-path.txt` (Replay-button run, 96/96)
- `docs/evidence/prototypes/mission-forge/mf-verify.mjs` (the verification script, a dev tool using the existing `playwright-core` devDependency; not runtime code)

Modified:

- `docs/progress.md` and `docs/evidence-register.md` (verified facts only).

Not modified: root `index.html`, `src/`, `api/`, `scripts/`, `tests/`,
`package.json`, `package-lock.json`, `vite.config.ts`, `vitest.config.ts`,
`tsconfig.json`, `vercel.json`, `.gitignore`, `README.md`. A
`find -mmin -180` over the repository outside `docs/`, `prototypes/`, `dist/`
and `node_modules/` returned no files. `git status` shows `prototypes/` as the
only new entry; every other entry was already present before this build.
`npm run build` regenerated `dist/` (gitignored build output) as the
acceptance checklist requires.

No commit, push, deploy, visibility change, or API-key request was made.

## 2. How to run

```bash
npm run dev
```

URL: <http://localhost:5173/prototypes/mission-forge/> (with the trailing
slash). Decimal Dock remains at <http://localhost:5173/>.

The existing Vite dev server serves the nested page with no configuration
change. `npm run build` still builds only the Decimal Dock root input, so the
prototype is not in `dist/`. That is by design, not a failure.

## 3. Interactive versus scripted

Genuinely interactive and deterministic:

- The story box is a real editable text field (Enter or `Build my world`).
- A local interpreter maps text to the single mission schema or refuses. It
  accepts the demo wording plus alternate "3 in each ship" wordings. It gives
  honest refusals for ambiguous text (`12 crystals and 3 ships.`), for a valid
  sharing story it cannot build, and for unrelated text. It never fabricates a
  world.
- All counts, labels and pass/fail results come from the mission schema and
  pure engine functions (`intendedWorld`, `roboWorld`, `repeatGroup`,
  `fillFixedGroups`, `checkWorld`). Self-checks run on page load.
- Repair is constructive. The player loads one ship by tap, drag or the
  `+ Load a crystal` button, then presses `Repeat this group`. The engine then
  plays out any group size from 1 to 6, including wrong ones. For example,
  4 per ship rebuilds Robo's 3×4 world and 5 per ship leaves 2 crystals over.
- Transfer works the same way. The player loads rover 1, then
  `Fill every rover the same` fills the other rovers. Loading 5 (divisor used
  as group size) gives `[5,5,5,5,0]` and rover 5 is left empty.
- Both verdict branches work: `Yes, launch` (ship 1 stalls, then the mission
  scanner compares story and world) and `No, debug it`.
- `Replay` resets all state without a reload. `Back to concept review` resets
  and scrolls to the review questions below the fold.

Scripted:

- Robo's mistake is always the same role swap (3 ships × 4).
- The interpreter is a transparent regex/normalisation script, labelled in the
  UI with `Local script matched the demo wording. No AI is running.` The header
  badge and the summary card both say
  `Scripted concept prototype — no runtime AI`.
- "Teach Robo" uses two fixed choice slots. A collapsed review note says a real
  version would read a free-form explanation and ask one grounded clarifying
  question.

## 4. Checks run and exact results

| Check | Result |
| --- | --- |
| `npm test` (before and after the build) | 7 files, **81/81 tests passed** |
| `npm run build` (before and after) | `tsc --noEmit` + `vite build` passed, `✓ built in 1.49s` |
| Mission Forge automated verification, capture mode (`mf-verify.mjs --capture`, installed Google Chrome, headless) | **97/97 checks passed**, 0 console errors or warnings, only `http://localhost:5173` requests |
| Same script, Replay-button path (no capture) | **96/96 checks passed**, 0 console errors or warnings |
| Decimal Dock regression: full loop for Maya (L), Sam (S) and Guesser (U) via a scratchpad copy of `scripts/capture-screens.ts` that writes outside the repo | All three reached `SUMMARY`; `No console errors.` Existing Decimal evidence files were not overwritten |
| Claude Browser pane (in-app Chromium) | Opened `/` (Decimal Dock profile screen) and `/prototypes/mission-forge/`; built a world; 0 console errors on both |
| Code scan of `prototypes/mission-forge/` for `fetch`, XHR, WebSocket, `localStorage`, `sessionStorage`, cookies, dynamic `import(` | None found |

Runs covered by the verification script (two complete desktop plays on the
same page plus two more):

1. **Desktop 1280×720, pointer.** Demo wording, unsupported-text refusal, `Yes`
   branch with scanner, wrong identification, wrong group size (4), tap + mouse
   drag repair, launch, wrong then right teach answers, transfer with the
   5-per-rover mistake, then 4 per rover, wrong then right unit answer, summary.
   The first action (`Forge a mission`) was visible in 145 ms. Scripted wall
   time was 40 s, with no human reading pauses.
2. **Desktop, keyboard only, after reset.** Enter/Tab/Space/Arrow keys only.
   Alternate wording `Each ship holds 3 crystals. There are 12 crystals. How
   many ships?` and the `No, debug it` branch. Radios were chosen with Space and
   ArrowRight. The run reached the summary with focus on `Replay`, and the
   focused control has a solid outline. Keyboard `Replay` returned to the
   opening.
3. **Mobile-like 390×844, touch taps.** Full loop, both missions. No horizontal
   scroll (`scrollWidth 390 <= 390`).
4. **Reduced motion (`prefers-reduced-motion: reduce`).** Full loop with no
   flying items or beam elements created (MutationObserver count 0). CSS
   transitions collapse to `0.001s`. Scripted wall time was 9 s.

Defects found and fixed during verification:

- In the 390 px layout, the fifth rover overlapped the battery pile (flex
  shrink). Fixed with non-shrinking world rows, `safe flex-end`, and a 5-column
  rover row.
- Group objects replayed their materialise animation when their state changed.
  Fixed by limiting entry animation to newly created objects.
- The summary card overlapped the rovers. Fixed: rovers roll out before the
  summary.
- Robo's bubble did not change on a failed repair or transfer. Fixed with
  outcome-specific lines.
- Added a timeout fallback so animation promises settle even in a hidden tab.

A test-only artefact is worth knowing about. Playwright's locator clicks can
scroll the window toward the below-the-fold review section. DOM clicks and real
mouse clicks did not (`scrollY` stayed 0). The capture script resets scroll
before each screenshot.

## 5. Screenshots

All are in `docs/evidence/prototypes/mission-forge/`:

| Required item | File(s) |
| --- | --- |
| 1. Opening equation and Robo prompt | `01-opening.png` |
| 2. Editable story forge | `02-story-forge.png` |
| 3. Compile reveal/result | `03-compile-reveal.png` |
| 4. Robo's 3-ships/4-each world | `04-robo-wrong-world.png`, `04b-scanner-mismatch.png` |
| 5. Corrected 4-ships/3-each launch | `05a-repaired-world.png`, `05-corrected-launch.png` |
| 6. Contrasting transfer mission | `06-transfer-mission.png`, `06b-transfer-divisor-as-size.png`, `06c-transfer-understood.png` |
| 7. Final learning summary | `07-final-summary.png` |
| 8. Narrow/mobile-like viewport | `08-mobile-01-opening.png` … `08-mobile-07-summary.png` (7 files incl. `08-mobile-04b-scanner.png`) |
| Extra: Teach Robo | `05b-teach-robo.png`, `05c-robo-restates.png` |

## 6. Dependencies, assets, network

- Dependencies added: **none**. `package.json` and the lockfile are untouched.
  The verification script reuses the existing dev-only `playwright-core`
  (E-030) and the installed Google Chrome.
- Assets: **none third-party.** Robo, crystals, batteries, ships, rovers,
  aperture, starfield (seeded procedural dots) and favicon are original inline
  SVG/CSS written for this prototype. System font stack only. No audio (the
  optional synthesized sound was not built).
- Network: none at runtime beyond loading the page's own files from the local
  dev server. No model, API, key, storage, cookies or analytics.
- Runtime AI: **none.**

## 7. Acceptance checklist status

A. Scope and repository safety: **all pass.**

B. Complete playable loop: **all pass.** Two notes:

- "Opening reaches a meaningful action within 10 seconds" is machine-verified
  (145 ms to a visible, actionable button). Whether an adult understands it in
  10 s needs Aditya's review.
- "Replay resets every state" is verified on the Replay-button path (96/96 run)
  and on the `Back to concept review` path.

C. Game feel and interface:

| Item | Status |
| --- | --- |
| Reads as a game scene, not a dashboard or form | Built to the brief. **Subjective, pending Aditya's review.** The opening bay is fairly empty until the first action |
| Robo curious / confidently wrong / understood expressions | Pass. There is also a `puzzled` mood for the scanner and hints |
| Story-to-world is the strongest motion beat | Built as the longest sequence: phrase tokens fly into the numbers, tags pop, a beam prints 12 crystals, and a blueprint appears. **Subjective, pending review** |
| Mismatch shown beyond red/green | Pass: `≠` symbol, dashed borders, `Story: 3 in each ship ≠ World: 4 in each ship` text, stalled ship, empty rover 5, leftover counts |
| Text short, not obscuring the playfield | Mostly pass. At 390 px the repair/transfer dock (story quote + three buttons + tip) takes about 35% of the height. The summary card covers the centre by design at the end |
| 1280×720 and 390×844 usable | Pass (screenshots and full runs) |
| Keyboard, visible focus, reduced motion, non-colour cues | Pass (run 2 and run 4) |
| No console errors through two complete replays | Pass: 0 across four full runs in each of two script executions |

D. Regression checks: **all pass** (section 4).

Partial or not verified:

- **2-3 minute unfamiliar-adult run: not measured.** No human run has happened.
  Automation takes about 40 s without reading. Aditya's session is the real test.
- **Touch drag** is not verified. Mouse drag passed; mobile runs used taps.
  Pointer events with `touch-action: none` should support it.
- **Screen reader** is not tested with VoiceOver. The live region, labels,
  `aria-describedby` world description and fieldset legends are implemented
  only.
- Optional Web Audio cues were not built.
- The equation is shown as `12 ÷ 3 = 4` (the brief writes `12 / 3 = 4`). The
  maths is the same; `÷` is the conventional Grade 3 symbol.

## 8. Known limitations

- The interpreter is brittle by design. For example,
  `3 crystals go in each ship` returns "ambiguous" because the word `go` is not
  in its patterns. Anything outside the known wordings is refused.
- Only one scripted mistake (the role swap) exists. There is no second
  misconception or adaptive difficulty.
- After launch, the teach step shows only a mission-log chip row
  (`4 ships launched · 3 in each ship · 0 left`), not the ships themselves.
- Group size is capped at 6 crystals per ship and 8 batteries per rover.
- With a group size of 1, the 12 ships crowd the narrow layout. It stays usable
  but is tight.

## 9. Strongest evidence-based reason to reject the concept

**In this build, the learning loop does not use the learner's story.** After
the forge step, the scanner, debug, repair, teach and transfer steps read only
the fixed mission schema. Evidence from this build:

- Every automated run completed the whole loop from the prefilled demo text.
  The keyboard run used a different wording and reached the identical world,
  mistake, repair and transfer.
- Robo's error is the same role swap whatever the story says.
- Replacing the forge step with an authored mission card would leave every
  check in section 4 passing.

So the proposed AI role (story → world) may read as removable decoration. That
is the same "a deterministic table covers it" failure that rejected D-003.

A second concern, also visible in this build: `12 crystals are shared across 3
ships. How many crystals in each ship?` is a valid `12 ÷ 3` story. For that
story, Robo's "mistake" would be correct, so the slice has to refuse it. A real
model would need to decide which role structure a child meant from short,
often ambiguous text. When it misreads, the product cannot easily tell a
system error from Robo's deliberate mistake. The typing load for ages 8-10 is
also untested. D-008 already flagged typed input as confounded with reading
ability for a division candidate.

Before choosing **Advance**, the review should check whether the story step
feels necessary to the fun and the learning, or only to the pitch.
