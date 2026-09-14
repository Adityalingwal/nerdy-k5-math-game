# Mission Forge — Revision Build Report (D-010)

Date: 2026-09-13
Builder: Claude Code (Opus 5), directed by Aditya, from
`revision-brief.md` and `claude-code-revision-prompt.md`.
Status: **revised, independently reviewed and dropped by D-011; preserved as
decision evidence.**

This report does not select, lock or validate Mission Forge. D-010 is
unchanged, and the next gate is still `advance` or `drop`.

## 1. What changed

The single blocking interaction from D-010 is fixed: **the learner's story now
chooses which of the two valid meanings of `12 ÷ 3 = 4` the whole mission
runs on**, and that choice controls every downstream step.

| | Meaning A — `3 in each ship` | Meaning B — `3 ships share` |
| --- | --- | --- |
| Story | `12 crystals. Put 3 crystals in each ship. How many ships can launch?` | `3 ships are sharing 12 crystals equally. How many crystals does each ship get?` |
| Role labels on `12 ÷ 3 = 4` | total crystals / crystals per ship / number of ships | total crystals / number of ships / crystals per ship |
| Intended world | 4 ships × 3 crystals | 3 ships × 4 crystals |
| Robo's opposite world | 3 ships × 4 crystals | 4 ships × 3 crystals |
| Mission scanner compares | `Story: 3 in each ship ≠ World: 4 in each ship` | `Story: 3 ships ≠ World: 4 ships` |
| Repair action | load one ship, **`Repeat this group`** | 3 ships already parked; load ship 1, **`Fill every ship the same`** |
| Robo's explanation | `3 was crystals in each ship, and 4 was the number of ships.` | `3 was the number of ships, and 4 was crystals in each ship.` |
| Transfer `20 ÷ 5 = 4` | 5 fixed rovers, *how many batteries each?* → 5 × 4 (fill) | `5 batteries in each rover`, *how many rovers?* → 4 × 5 (repeat) |

All of that is derived from **one field per schema** (`divisorRole`). There is
no second copy of the loop and no branch that can drift: the quotient's role,
the build mode, the labels, Robo's swap and the transfer pairing are computed
from it, and load-time self-checks fail loudly if the two meanings ever stop
differing or if a transfer stops reversing its first mission.

Also in scope:

- **Two example controls** (`3 in each ship`, `3 ships share`) next to one
  editable story field, so an adult can test both meanings without inventing
  wording. The field stays prefilled with meaning A.
- **Honest refusals kept and widened.** The interpreter reads two independent
  signals — what the `3` is attached to, and what the question asks for — and
  commits only when they agree. The old `different` status ("that is a real
  sharing story but I cannot build it") is gone, because both readings are now
  buildable. Ambiguous, contradictory and unrelated text still get honest
  refusals and never a fabricated world.
- **Disclosure names the reading**: `Local script read this as: 3 = number of
  ships. No AI is running.` The header badge and summary badge
  (`Scripted concept prototype — no runtime AI`) are unchanged.
- **Narrow/mobile defect fixed** (section 4).

## 2. Files changed

Runtime (all under `prototypes/mission-forge/`):

| File | Lines (was → now) | Change |
| --- | --- | --- |
| `main.js` | 1571 → 1751 | Four mission schemas derived from `divisorRole` + `TRANSFER_OF` pairing; two-signal interpreter selecting a schema; per-schema story-span rules; repair and transfer unified into one `runConstruct` driven by the schema's build mode; Robo/scanner/chip/hint/summary text generated from the selected schema; `__missionForge` hook extended for verification |
| `styles.css` | 1572 → 1631 | `.forge-examples` row and pressed-example style; pile shrink/scroll rules; short-window media query (section 4) |
| `index.html` | 207 → 214 | Below-the-fold concept-review text updated to describe the two meanings honestly, plus one new review question about whether the story now feels necessary |
| `README.md` | 92 → 124 | Meaning table, updated loop, updated scripted-vs-real table, code layout and hook list |

Local documentation and evidence (gitignored under D-005):

- `docs/prototypes/mission-forge/revision-build-report.md` (this file)
- `docs/evidence/prototypes/mission-forge/revision/` — 53 screenshots,
  `verification-log.txt` (252/252, capture run), `verification-log-final-files.txt`
  (252/252, re-run on the final files), `layout-probe-log.txt` (100 ok, 0
  overlaps), plus the two dev tools that produced them,
  `mf-verify-revision.mjs` and `layout-probe.mjs` (they use the existing
  dev-only `playwright-core`, E-030, and are not runtime code)
- `docs/progress.md` and `docs/evidence-register.md` (verified facts only)

**Not modified:** the original Mission Forge evidence in
`docs/evidence/prototypes/mission-forge/` (21 screenshots and both original
logs are byte-for-byte intact), root `index.html`, `src/`, `api/`, `scripts/`,
`tests/`, `package.json`, `package-lock.json`, `vite.config.ts`,
`vitest.config.ts`, `tsconfig.json`, `vercel.json`, `.gitignore`, root
`README.md`. A `find -mmin` sweep over the repository outside `docs/`,
`prototypes/`, `dist/` and `node_modules/` returned no files. `git status`
shows the same entries as before this work; `prototypes/` was already listed.
`npm run build` regenerated the gitignored `dist/`.

No dependency, API, model, backend, network call, key, persistence, analytics
or child data was added. No commit, push, deploy or visibility change was made.
No sub-agent and no Fusion run was used.

## 3. How to run

```bash
npm run dev
```

URL: <http://localhost:5173/prototypes/mission-forge/> (keep the trailing
slash). Decimal Dock remains at <http://localhost:5173/> and is untouched.

## 4. The narrow/mobile defect

**Reproduced first.** At 390 × 720 and shorter the loose pile overflowed the
bay and painted across the Mission 2 story text, because `.world`'s children
never shrink while the stage row does. It did *not* reproduce at 390 × 844,
which is why the original run missed it: the live review window was shorter
than the test viewport.

**Fixed in two parts.** The pile now gives up its spare rows first (it can
shrink to one scrollable row), and on narrow windows shorter than 780 px the
app grows to its content and the page scrolls instead of the bay overlapping
the dock. Desktop behaviour is unchanged (the rule is `max-width: 720px and
max-height: 780px`).

**Encoded as two automated checks.** Every verification run asserts at three
steps (Robo's world, repair start, transfer start) that `#pile`, `#groups` and
`#chips` all end above the dock, and that there is no horizontal scroll. A
separate probe, `layout-probe.mjs`, walks both story paths at five steps each
across ten viewports — 320 × 568, 360 × 640, 390 × 720, 390 × 780, 390 × 781,
390 × 800, 390 × 844, 1024 × 700, 1280 × 640 and 1280 × 720 — and reported
**100 ok, 0 overlaps** (`layout-probe-log.txt`).

## 5. Checks run and exact results

| Check | Result |
| --- | --- |
| `npm test` (after the revision) | 7 files, **81/81 tests passed** |
| `npm run build` (after the revision) | `tsc --noEmit` + `vite build` passed, `✓ built in 1.77s` |
| `mf-verify-revision.mjs --capture` (installed Google Chrome, headless) | **252/252 checks passed**, **0 console errors or warnings**, only `http://localhost:5173` requests |
| Same script re-run on the final files, after the last `index.html` edit | **252/252 checks passed**, 0 console errors, localhost only (`verification-log-final-files.txt`) |
| `layout-probe.mjs` — both story paths at 10 viewports, 5 steps each | **100/100 layout checks ok, 0 overlaps** (`layout-probe-log.txt`) |
| Code scan of `prototypes/mission-forge/` for `fetch`, XHR, WebSocket, `localStorage`, `sessionStorage`, cookies, dynamic `import(` | None found |
| Claude in-app browser (Chromium, 800 × 768) | Built meaning B, `missionId() === 'ships-count'`, Robo built 4 ships × 3, **0 console errors** |

The verification script's eight runs:

1. **Refusals, desktop.** Unrelated text (`My dog ate 7 cookies.`), ambiguous
   text (`12 crystals and 3 ships.`) and empty text are each refused without
   building a world.
2. **Run 1 — meaning A, desktop 1280 × 720, pointer.** Example button, full
   loop, `Yes, launch` + scanner, Robo's reading rejected first, wrong repair
   (4 per ship rebuilds Robo's world), taps + a real mouse drag, launch,
   swapped teach answers rejected, transfer with the 5-per-rover mistake, then
   4 per rover, wrong unit answer, summary.
3. **Replay, same page.** Replay clears the selected schema (`missionId()`
   returns `null`), the world and the equation labels without a reload.
4. **Run 2 — meaning B, same page, pointer.** The same script with the
   opposite expectations throughout; `firstMissionId()` is `ships-count`, so
   one page produced both missions.
5. **Run 3 — keyboard only, meaning B, typed wording** (`Share 12 crystals
   equally across 3 ships. How many crystals does each ship get?`), not an
   example button. Enter/Tab/Space/Arrow keys only, through to the summary;
   the focused control has a solid outline.
6. **Run 4 — keyboard only, meaning A, typed wording** (`Each ship holds 3
   crystals. There are 12 crystals. How many ships?`).
7. **Runs 5-6 — both meanings at 390 × 844 with touch**, full loops.
8. **Run 7 — meaning B at 390 × 720**, the short window from the live review.
9. **Run 8 — reduced motion, meaning A.** No flying or beam elements were
   created (MutationObserver count 0) and CSS transitions collapse to
   `0.001s`. Scripted wall time 6 s.

Wrong constructions tested on each path, each played out for real:

| Path | Step | Learner loads | Result shown |
| --- | --- | --- | --- |
| A | repair | 4 per ship | 3 ships × 4 — *"that's my world again!"* |
| A | transfer (fill) | 5 per rover | `[5,5,5,5,0]` — rover 5 left empty |
| B | repair | 3 per ship | `[3,3,3]` — 3 crystals still in the bay |
| B | transfer (repeat) | 4 per rover | `[4,4,4,4,4]` — 5 rovers, but the story says 5 in each |

## 6. Screenshots

53 PNGs in `docs/evidence/prototypes/mission-forge/revision/`, named
`desk-A-*`, `desk-B-*`, `mob-A-*`, `mob-B-*` (13 each) plus
`desk-refusal-ambiguous.png`. Each set covers: opening, story forge with both
example buttons, compile reveal, Robo's wrong world, scanner mismatch, repair
start, a wrong repair, the repaired world, Robo restating, the transfer
mission, a wrong transfer, the transfer understood, and the summary. The
original 21 screenshots and both original logs were not touched.

## 7. Dependencies, assets, network

- Dependencies added: **none.** `package.json` and the lockfile are untouched.
- Assets: **none third-party.** All art remains original inline SVG/CSS;
  system font stack; no audio.
- Network at runtime: none beyond the page's own files from the local dev
  server. No model, API, key, storage, cookies or analytics.
- Runtime AI: **none.**

## 8. Remaining limitations

- **The interpreter is still a small rule set.** It recognises a documented
  family of wordings for exactly two meanings. `3 crystals go in each ship`
  still fails, because `go` is not in its patterns. Anything outside the two
  meanings is refused.
- **Exactly two meanings exist.** There is no third reading, no second
  misconception and no adaptive difficulty.
- **On windows shorter than about 780 px the page now scrolls** rather than
  fitting one screen. Nothing overlaps, but the dock can sit below the fold at
  390 × 720 (about 60 px of scroll) and 360 × 640 (about 150 px).
- **`20 ÷ 5 = 4` is authored, not learner-written.** Only mission 1 is forged
  from the learner's own text.
- **Not measured:** a human 2-3 minute run, touch drag (mouse drag passed;
  mobile runs used taps), and screen-reader use with VoiceOver. Live-region,
  labels, `aria-describedby` world description and fieldset legends are
  implemented only.
- One guided transfer is **not** a mastery claim, and nothing here measures or
  claims a learning effect.
- Group size is capped at 6 crystals per ship and 8 batteries per rover.

## 9. Strongest evidence-based reason to drop after this revision

The old reason — that the loop ignored the story — is gone, and this build
demonstrates it. The strongest remaining reason is narrower and harder:

**The story step is now causal, but the AI is still not necessary for it.**
What the interpreter does is a two-way classification, and this build performs
it with about twenty lines of regex that passed every case in the verification
run. If the closed schema stays at two readings, a rule table is enough and
the model adds nothing the demo can show. The model only becomes necessary at
a scope where it also becomes unreliable: open-ended stories from 8-10 year
olds, short and often ambiguous, where D-008 already recorded that a
ChatGPT-class model judged comparable maths answers about 75% correctly
(E-018). In this product a misread has a uniquely bad shape — **the learner
cannot tell a parser error from Robo's deliberate mistake**, because both
appear as "Robo built the wrong world". The failure mode is camouflaged by the
core fantasy.

Two supporting concerns:

- **The example buttons make the typing look optional.** The fastest path
  through the loop — and almost certainly through a three-minute demo video —
  is to tap an example. That is exactly what this revision needed for
  testability, but it means the "author your own mission" promise is still
  unproven with a real child's typing.
- **Every new story shape needs authored world logic.** Two meanings already
  produce four schemas and two build modes. A real curriculum multiplies both
  the deterministic world builder and the art, which is scope Mission Forge
  cannot absorb before the deadline.

Before choosing **advance**, the review should play both examples back to back
and judge whether the changed world makes the story feel necessary to the
*fun*, not only to the pitch — and whether a wrong parse would be survivable
in front of a child.

## 10. Independent review and final gate

On 2026-09-13 Codex independently read the final runtime, re-ran `npm test`
(81/81) and `npm run build`, manually completed both story paths in a live
browser, exercised the wrong repair and wrong transfer on each path, and
verified Replay. The full browser script passed 252/252 again with no console
warning/error or non-localhost request. The layout probe passed 100/100 checks
across both paths and ten viewports, including 390 x 720, 390 x 844 and
1280 x 720; the battery/story overlap did not recur.

One evidence-harness limitation was found: the wrong-repair assertion checks
only that feedback is non-empty. In one fresh desktop Path B run it logged
`6 crystals are still in the bay` and still passed, while the independent
manual run and the later mobile runs produced the correct `3 crystals` result.
This is a weakness/flakiness in that evidence check, not evidence that the
deterministic repair logic is wrong.

Aditya accepted the `drop` branch after the review. D-011 records the reason:
the causal defect is fixed, but the remaining loop is highly guided, a compact
rule set already handles the two supported meanings, and expanding free text
enough to make AI necessary adds disproportionate parsing and fairness risk.
No second Mission Forge revision or runtime-AI test is authorized.
