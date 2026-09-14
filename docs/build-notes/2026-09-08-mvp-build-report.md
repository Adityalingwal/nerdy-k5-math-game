# Decimal Dock — MVP build report (plan Day 1-3)

Date: 2026-09-08
Repo: `/Users/mac/Desktop/nerdy-k5-math-game`
Status: **MVP complete and verified on the deterministic path. Nothing committed** —
the working tree is left for review (`git status` shows only new/modified files).

Biggest open issue: **the model path is untested.** No `OPENROUTER_API_KEY` was
present in the environment, so every run used the deterministic fallbacks and
the harness reports "model path untested". The Vercel function has also never
run outside the local Vite middleware.

---

## 1. What was built — file map

### Root config
| File | Purpose |
| --- | --- |
| `package.json` | scripts: `dev`, `build`, `test`, `ai-value-test`, `capture`. deps: pixi.js 8.20.1. devDeps: vite 7.3.6, typescript 5.9.3, vitest 3.2.7, tsx 4.23.13, @types/node 24.13.3, playwright-core 1.63.0 |
| `tsconfig.json` | strict, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `allowImportingTsExtensions`, `noEmit` |
| `vite.config.ts` | build config + the dev middleware that serves `POST /api/llm` locally, mirroring the Vercel function. Uses `loadEnv(mode, cwd, '')` server-side only; the key never enters `define` |
| `vitest.config.ts` | node environment, `tests/**/*.test.ts` |
| `index.html` | 1280x720 board host, inline SVG data-URI favicon (no extra request, no asset file) |
| `vercel.json` | framework vite, build `npm run build`, output `dist`, `api/llm.ts` maxDuration 10, `no-store` on `/api/*` |
| `.env.example` | documents `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` (default `anthropic/claude-sonnet-5`). No secrets |
| `README.md` | public-facing, English: what it is, run instructions, env vars, the deterministic/AI boundary in two sentences, accessibility/privacy, layout, third-party components |
| `.gitignore` | added `.vercel/`, `test-results/` (dist, .env, node_modules already ignored) |

No `LICENSE` file was added (D-004).

### `src/engine/` — deterministic source of truth
| File | Contents |
| --- | --- |
| `decimal.ts` | `Dec = {t: integer thousandths, places}`. `dec()`, `compare/isGreater/equals`, `format`, `formatAtPlaces` (0.8 → "0.80"), `significantPlaces`, `fractionDigits`, `unitFraction`. Separator-aware display that never touches the value. Floats are never used for ordering |
| `items.ts` | Type 1 (8 items) and Type 2 (6 items) pairs, tagged, plus 5 transfer items + 1 alternate. Presentation convention: shorter decimal = anchor (pre-placed), longer decimal = dragged target. `predictedByL/S`, seeded `shuffle`, `buildPlaceRound` (interleaved T1/T2), `buildTransferRound` |
| `classifier.ts` | `scorePlacement` (side-of-anchor, with a 15-thousandth tolerance for the equal-value item), `inferRule` with the paper's tolerant coding (L/S/A/U, one deviation allowed, first attempts only), mean signed position error, `lengthRuleSignature`, `judgeMastery` (4 of 5 transfer, no signature), `mostDiagnostic` |
| `state.ts` | The `Session` state machine and the 5 profiles. Phases PROFILE→PLACE→INFER→ZOOM→WHY→WORKED→ERRONEOUS→TRANSFER→SUMMARY with every documented branch. Feedback ladder levels 1-3, max 3 attempts, max 2 erroneous examples |
| `events.ts` | `EventLog`: anonymous, in-memory, session-only. Nothing persisted, nothing sent |

### `src/ai/` — the bounded AI layer (pure TS, no DOM)
| File | Contents |
| --- | --- |
| `labels.ts` | closed label set + `VALID` (see deviation D1), 0.6 confidence gate |
| `keyword.ts` | deterministic fallback classifier. Ordered checks: SLIP → MONEY → VALID (correction step only) → L → S → GUESS → UNCLEAR |
| `prompts.ts` | both system prompts. Each states the ordering is already known, forbids saying which decimal is larger, forbids learner-facing text, demands JSON only |
| `erroneous.ts` | `buildTask`/`pickTask` (engine picks the pair and the wrong answer *before* any call), `verifyErroneousExample` (plan 4.3), and the authored bank of 6 examples per rule |
| `core.ts` | shared model core: OpenRouter chat-completions, temperature 0, 4 s `AbortController` timeout, `extractJsonObject` (balanced-brace scan, string-aware), request validation, `readLlmConfigFromEnv`. Takes the key as an argument — never reads `process.env` itself |
| `client.ts` | browser side: `POST /api/llm`, keyword fallback on any failure, engine-side verification of generated examples, per rule+pair in-memory cache, `prefetchErroneousExample` for background pre-request |

### `src/game/`
`dock.ts` — the PixiJS dock. 1280x720 stage, dock line 0-1, pier posts at tenths.
Three zoom levels (0-1 → tenths → hundredths) with label reflow (0.8 renders as
0.80 in place at level 1, 0.800 at level 2). Drag with snap preview, wrong-drop
bounce, ghost shadows at true positions, level-3 "written the same way"
comparison, pier lamps for progress, off-view edge chips, and the keyboard
alternative (arrows move by one snap step, Shift = 10, Enter/Space drops).
A drop only counts once the package has actually been moved.

### `src/ui/`
- `overlay.ts` — DOM overlay in the same fixed box as the canvas (so no layout
  shift): profile picker, prompt banner, toast, card (centre/low variants),
  WHY box with Skip, Robo delivery-log panel with a source label, summary, gear
  panel (separator, money word, AI on/off, disabled language hook).
- `settings.ts` — only the AI toggle is persisted, and only in localStorage,
  wrapped in try/catch.

### `src/main.ts`
Wiring only. Phase renderer, feedback ladder application, zoom replay, worked
example, erroneous phase with background pre-request, WHY/correction submission,
summary with an honest "which path ran" line, window fit-to-scale, and a
`import.meta.env.DEV`-gated debug hook used by the capture script (verified
absent from `dist/`).

### `api/llm.ts`
Vercel serverless handler. Parses the body manually (works whether or not the
platform pre-parsed it), always answers 200 with `{ok:false, reason}` on
failure so the client always has one code path, `no-store`.

### `scripts/`
- `explanation-fixtures.ts` — 39 hand-written synthetic explanations: the 10
  deep-research seeds, L/S paraphrases, slips, money, code-mixed
  Hindi-English, off-topic/empty, and correction-step cases. Each has an
  adult-assigned `expected` label and, where the table is known to fail, an
  explicit `keywordExpected`.
- `ai-value-test.ts` — the harness. Runs the keyword table and (with a key) the
  model, prints an agreement table + every disagreement, runs 20 generations
  per rule through the verifier and reports the rejection rate, writes
  `docs/evidence/ai-value-test-<local date>.md`. Reads `.env` with a tiny
  built-in parser (no extra dependency).
- `capture-screens.ts` — drives Chrome via playwright-core (dev tool only) and
  saves a screenshot of every phase for three personas.

### `tests/` — 81 tests, 7 files
`decimal.test.ts` (10), `items.test.ts` (8), `classifier.test.ts` (16),
`state.test.ts` (16), `verifier.test.ts` (16), `keyword.test.ts` (9),
`core.test.ts` (6).

Covers: integer number handling and display; the classifier on synthetic
response patterns for all four codes including the one-error tolerance and the
first-attempt-only rule; state-machine transitions (A→TRANSFER; U→WORKED→short
PLACE→INFER; second U→TRANSFER; SLIP→TRANSFER; GUESS/UNCLEAR→WORKED→ERRONEOUS;
MONEY→ERRONEOUS; max 2 erroneous examples); the feedback ladder; the verifier
rejecting bad outputs (third number, wrong pair, correct claim, no comparison,
>40 words, empty); the keyword classifier on the 10 seed explanations and on
all 39 fixtures; **every authored bank example passing the verifier**, with
both separators.

---

## 2. How to run

```
npm install
npm run dev            # http://localhost:5173
npm test               # 81 tests
npm run build          # tsc --noEmit && vite build -> dist/
npm run ai-value-test  # harness -> docs/evidence/ai-value-test-<date>.md
npm run capture        # needs `npm run dev` running; screenshots -> docs/evidence/screenshots/
```

Env: copy `.env.example` to `.env` and set `OPENROUTER_API_KEY` (optional) and
`OPENROUTER_MODEL` (optional, defaults to `anthropic/claude-sonnet-5`).

---

## 3. Verification results

### 3.1 install / build / test — all pass
- `npm install` — 67 packages, 0 vulnerabilities.
- `npm run build` — `tsc --noEmit` clean, vite build OK (`dist/assets/index-*.js`
  319 kB, 100 kB gzip).
- `npm test` — **7 files, 81 tests, all pass.**

### 3.2 Browser runs — full loop, twice (plus a third branch), model OFF
Run through Chrome at 1280x800 against `npm run dev`, driven by
`scripts/capture-screens.ts`. The first placement of each run used the real
keyboard path (ArrowLeft/Right then Enter); the rest used the same engine entry
point the pointer path calls.

| Run | Inferred code | Path taken | Result |
| --- | --- | --- | --- |
| Maya (answers as longer-is-larger) | **L** | PLACE → INFER → ZOOM → WHY → ERRONEOUS → fix → correction → TRANSFER → SUMMARY | mastered, 5/5 transfer |
| Sam (answers as shorter-is-larger) | **S** | same, with an S-rule Robo note built on a Type 2 pair | mastered, 5/5 transfer |
| Guesser (scatter) | **U** | PLACE → INFER(U) → WORKED → short PLACE → INFER(U again) → TRANSFER → SUMMARY | did not loop; ended correctly |

**No console errors** in any run (the one 404 found on the first pass was a
missing favicon; fixed with an inline data-URI icon and re-verified).

Screenshots (all under `/Users/mac/Desktop/nerdy-k5-math-game/docs/evidence/screenshots/`):

```
maya-01-profile.png      maya-02-place.png        maya-03-infer.png
maya-04-zoom.png         maya-05-why.png          maya-07-erroneous.png
maya-08-erroneous-fix.png maya-09-correction.png  maya-10-transfer.png
maya-10-feedback.png     maya-11-summary.png
sam-01-profile.png ... sam-11-summary.png            (same 11 files)
guesser-01-profile.png   guesser-02-place.png     guesser-03-infer.png
guesser-03b-worked.png   guesser-03c-place.png    guesser-03c-feedback.png
guesser-10-transfer.png  guesser-10-feedback.png  guesser-11-summary.png
settings-panel.png       settings-comma-model-off.png
```

Also verified interactively in the in-app browser:
- gear panel opens; switching the separator to `,` immediately re-renders the
  tick labels, both packages and the prompt as `0,512` / `0,6`
  (`settings-comma-model-off.png`);
- turning the AI helper off writes `decimal-dock.model-enabled=false` to
  localStorage and nothing else;
- a real pointer drag (pointerdown/pointermove/pointerup on the canvas) moves
  the package, scores the drop and advances the item.
  Note: the in-app browser tool's own `left_click_drag` and coordinate clicks
  did not reach the page in this pane (its ref-based clicks did). The pointer
  path was therefore confirmed by dispatching genuine `PointerEvent`s in the
  page. This is a harness limitation, not an app defect.

### 3.3 Model path — **untested**
`OPENROUTER_API_KEY` was absent. Consequences, all as designed:
- `POST /api/llm` returns `{"ok":false,"reason":"not_configured"}` (verified with
  curl, along with `method_not_allowed` for GET and `bad_json` for bad bodies);
- every classification fell back to the keyword table, every Robo note came
  from the authored bank, and the summary screen said so;
- the harness printed and wrote **"Model path untested"** and skipped the 20
  generations per rule.

Harness run 1 (`docs/evidence/ai-value-test-2026-09-08.md`): 39 cases; the
keyword table agrees with the adult label on **29/39**. The 10 disagreements are
exactly where the model is expected to earn its place: L paraphrases
(`seed-03`, `seed-04`, `para-l-01/02/04`), an S paraphrase (`para-s-04`), an
unphrased slip (`slip-02`), and the code-mixed Hindi-English cases
(`mix-01/02/05`).

### 3.4 Bundle secret check — clean
`grep -ril "openrouter|process.env|api[_-]key|sk-or-|__decimalDock" dist/` → no
matches. The dev debug hook is stripped from the production build.

### 3.5 License audit
Direct: pixi.js MIT, vite MIT, typescript Apache-2.0, vitest MIT, tsx MIT,
@types/node MIT, playwright-core Apache-2.0 (dev only, downloads no browser).
Full `node_modules` scan: **58 MIT, 3 BSD-3-Clause, 3 ISC, 3 Apache-2.0**. No
GPL/LGPL/AGPL/SSPL/OFL. No Google Fonts, no third-party art or audio; system
font stack only; all graphics are procedural Pixi shapes; favicon is an inline
SVG written for this project.

### 3.6 Model id verification
Fetched `https://openrouter.ai/api/v1/models` (public, no key) on 2026-09-08.
Claude Sonnet-class ids present: `anthropic/claude-sonnet-5`,
`anthropic/claude-sonnet-4.6`, `anthropic/claude-sonnet-4.5`,
`anthropic/claude-sonnet-4`. Chose **`anthropic/claude-sonnet-5`**; recorded in
`.env.example`, `src/ai/core.ts` and evidence row E-033. No id was guessed.

---

## 4. Deviations from the plan, and why

**D1 — added a `VALID` label.** Plan 3.4.6 routes the ERRONEOUS correction on
"positional reason → TRANSFER", but the closed label set (L/S/MONEY/SLIP/GUESS/
UNCLEAR) contains no such label. Added `VALID`, available **only** at the
correction step (the model is told this, and `core.ts` rejects `VALID` at the
WHY step). Without it the correction step cannot be routed.

**D2 — replaced the suggested Type 2 pair `0.825 vs 0.516`.** Both have three
decimal places, so it is not a length-contrast item at all and an L-thinker
cannot "pass" it by rule. The paper's original (2.8325 vs 2.516) needs four
places, which exceeds the engine's thousandths precision. Substituted the
structurally faithful `0.52 vs 0.836` (shorter/smaller vs longer/larger).
Caught by `tests/items.test.ts`.

**D3 — measurement transfer item scaled into 0-1.** Plan 3.2 names `1.05 m vs
1.5 m`, which is outside the 0-1 dock. Used the structurally identical
`0.15 m vs 0.105 m` (leading zero in the fraction, longer decimal smaller).

**D4 — "order five decimals" not implemented.** Plan 3.2 lists it among
transfer material, but plan 3.4.7 defines TRANSFER as exactly five items
(both-rules, trailing zero, tenths-tie, money, measurement). Followed 3.4.7.

**D5 — second U round terminates.** The plan sends U to WORKED then back to
PLACE, but never says what a second U does. It now goes straight to TRANSFER
(there is no rule to target with an erroneous example). Recorded and tested.

**D6 — MONEY at WHY routes to ERRONEOUS.** Plan 3.4.5 lists MONEY as a label but
3.4.6 gives it no route. It is treated like L/S, and the erroneous example is
built from the *placement-inferred* rule, not from the label.

**D7 — "4 fresh items" after a U round means reshuffled reuse.** Only 6 Type 2
pairs exist inside 0-1, so a second round of 2+2 draws from the same bank with a
different seed.

**D8 — the learner can zoom at any time.** The plan describes the magnifier as a
diagnostic device; "Zoom in / Zoom out" buttons are available during placement
too. Needed so the equal-value trailing-zero transfer item is solvable at a
snap step finer than the tolerance, and it matches the intended "zoom when you
are not sure" mechanic.

**D9 — verifier number whitelist.** Plan 4.3 says "reject any output containing
a third number", but a faithful L-rule reason says "because 75 beats 8". The
whitelist is: both decimals at every trailing-zero rewrite, in both separators,
plus the bare fraction-digit integers of each. Anything else is rejected.

**D10 — only the AI toggle is persisted.** The separator and money word reset on
reload, per the literal instruction "persist toggle in localStorage only".

**D11 — a DEV-only debug hook** (`window.__decimalDock`) exists for the capture
script. It is read-only apart from forwarding a drop to the same handler the
pointer path uses, and it is stripped from production builds (verified).

**D12 — toolchain versions.** Used vite 7.3.6 / vitest 3.2.7 / typescript 5.9.3
rather than the newest majors on npm (vite 8.2.2, vitest 5.0.0, typescript
7.0.2). Same licence rows; chosen to avoid spending build time on brand-new
major-version behaviour. Worth revisiting later, not now.

---

## 5. Open issues

1. **Model path untested (biggest).** No key was available. `classify` and
   `erroneous-example`, the verifier's behaviour on real model output, the 4 s
   timeout, prompt quality and the rejection rate are all unmeasured.
   Everything is wired and unit-tested against the failure paths only.
2. **Vercel deployment untried.** `api/llm.ts` imports `../src/ai/core.ts` with
   an explicit `.ts` extension (which Vite, tsx and Vitest all handle). Vercel's
   esbuild-based Node builder is expected to handle it, but this has not been
   proven. If the deploy fails on that import, changing it to an extensionless
   specifier is the first thing to try.
3. **`vercel.json` pins no function runtime.** Deliberate — pinning would have
   meant guessing a `@vercel/node` version string. Vercel auto-detects Node
   functions in `api/`. Verify on the first deploy.
4. **Cards overlap the dock.** ZOOM/WORKED/ERRONEOUS cards use the low position
   and now sit clear of the packages, but they still cover the tick labels. A
   layout pass belongs in the Day 4 game-feel work.
5. **Presentation is functional, not polished.** No Robo character art, no
   animation easing beyond the zoom tween and drop bounce, no sound. Day 4.
6. **Mobile is out of scope** as planned; below 1280x720 the whole board scales
   down uniformly.
7. **`docs/evidence/` is gitignored** (D-005 keeps `docs/` local). The harness
   report and the screenshots therefore live only on this machine. Decide before
   submission whether any of it needs a public home.

---

## 6. Exact next steps (Day 4-7)

**Before anything else (blocking the "genuine AI" claim):**
1. Put a real key in `.env`, run the loop once with the AI helper on, and check
   that a model-written Robo note passes the verifier and appears with the
   "written by the AI helper" label.
2. Run `npm run ai-value-test` with the key and read the disagreement list and
   the per-rule rejection rate. Expect prompt tuning on the code-mixed and
   paraphrase rows.
3. `vercel deploy` with both env vars set; confirm `POST /api/llm` works there
   and that the signed-out URL loads.

**Day 4 — game feel:** drag/lens/lamp animation pass; a drawn Robo; optional
Web Audio bleeps; on-screen operator notes per profile; move the cards clear of
the dock labels.

**Day 5 — evidence and rehearsal:** harness run 2 with tuned prompts; write the
three-minute demo script from `docs/research/deep/decimal-longer-is-larger.md`
section 5; rehearse, showing the model toggle once.

**Day 6 — submission material:** record the video (adult operator, synthetic
profile, under 3:00); write the English description separating verified
research, design inference and the untested learning hypothesis; complete the
AI and third-party disclosures; re-audit the evidence register and licences.

**Day 7 — freeze:** buffer; decide judge access (live URL only vs public repo,
D-004); stop substantive changes; confirm the deployment stays reachable
through 2026-09-23.

---

## 7. Documentation updated

- `docs/evidence-register.md` — added **E-024 to E-038**: every dependency with
  version/licence/URL, the full-tree licence scan, the OpenRouter API, the
  default model id with its verification date, the no-third-party-assets row,
  the harness run, the loop-verification run, and both AI-disclosure rows
  (build-time and runtime).
- `docs/progress.md` — "Completed" now lists what was built, what was verified
  and what was not; "Next actions" replaced with the Day 4-7 plan above.
- `docs/00-index.md` — current phase updated to implementation; added links to
  the implementation plan and `docs/evidence/`.

**Nothing was committed or pushed.** `git status`: modified `.gitignore`,
`README.md`; untracked `.env.example`, `api/`, `index.html`, `package.json`,
`package-lock.json`, `scripts/`, `src/`, `tests/`, `tsconfig.json`,
`vercel.json`, `vite.config.ts`, `vitest.config.ts`.
