# Equal-Sign Repair — Scripted UI Slice Build Report

Date: 2026-09-14
Authorised by: D-013
Implemented by: Claude Code (Opus 5) as a coding agent, from
`docs/prototypes/equal-sign-repair/scripted-ui-brief.md` and
`claude-code-scripted-ui-prompt.md`.

**Scope statement, up front.** This is *synthetic, adult-operated
product-design evidence*. It is not proof of child learning, not proof of AI
value, not a statement about grade suitability or mastery, and it selects no
concept and no next gate. The prototype contains no runtime AI: the four
"interpretation" results are adult-authored fixed scripts, and the UI says so on
every step.

---

## 1. Verified facts

### 1.1 Files added

Four runtime files, all new, all under `prototypes/equal-sign-repair/`:

| File | Lines |
| --- | --- |
| `prototypes/equal-sign-repair/index.html` | 158 |
| `prototypes/equal-sign-repair/styles.css` | 976 |
| `prototypes/equal-sign-repair/main.js` | 1065 |
| `prototypes/equal-sign-repair/README.md` | 148 |

Evidence added, all new, all under
`docs/evidence/prototypes/equal-sign-repair/scripted-ui/`:

| File | What it is |
| --- | --- |
| `esr-verify.mjs` | behaviour suite (564 checks) |
| `layout-probe.mjs` | layout/overlap/touch-target probe (228 states) |
| `verification-log.txt` | full output of the behaviour suite |
| `layout-probe-log.txt` | full output of the layout probe |
| 109 `.png` files | screenshots, named by run tag × path × step |

Documentation added or appended: this report (new), one dated bullet appended to
`docs/progress.md`, and rows `E-059`–`E-062` appended to
`docs/evidence-register.md`.

### 1.2 Files NOT changed

No file was modified by this work outside `prototypes/equal-sign-repair/`,
`docs/prototypes/equal-sign-repair/`, `docs/evidence/prototypes/equal-sign-repair/`,
`docs/progress.md` and `docs/evidence-register.md`.

Two other files changed on disk **during** this session but were not touched by
this work: `docs/00-index.md` and the new
`docs/research/k5-math-game-market-patterns-2026-09-14.md`, both written
concurrently from outside this implementation. They were left exactly as found.

Specifically untouched and verified untouched by a modification-time sweep
against a marker stamped before any edit: `src/`, `api/`, `scripts/`, `tests/`,
root `index.html`, `package.json`, `package-lock.json`, `tsconfig.json`,
`vite.config.ts`, `vitest.config.ts`, `vercel.json`, `.env.example`,
`.gitignore`, root `README.md`, `AGENTS.md`, `CLAUDE.md`,
`docs/decision-log.md`, `prototypes/mission-forge/` and all of its evidence, and
`experiments/equal-sign-repair-ai-value/`.

`docs/` is gitignored and `prototypes/` was already untracked, so adding
`prototypes/equal-sign-repair/` produces **no new line in `git status`**. The
tracked state was verified instead by: `git status --short --branch` identical
to the pre-work list; `git diff --check` clean; `ls prototypes/` showing exactly
`mission-forge` and `equal-sign-repair`; and the modification-time sweep above.
Nothing was committed, pushed, branched or deployed.

### 1.3 Test and build results

| Command | Result |
| --- | --- |
| `npm test` | **81/81 passed**, 7 files — unchanged from before this work |
| `npm run build` (`tsc --noEmit && vite build`) | **passed**, built in 1.50 s |

The built `dist/` contains no reference to `equalizer` or `equal-sign-repair`:
the root `tsconfig.json` includes only `src, api, scripts, tests,
vite.config.ts, vitest.config.ts`, and `vite build` bundles only the root
`index.html`, so `prototypes/` is outside both. No package, lockfile or config
file was edited.

### 1.4 Browser verification

Tooling: the repository's existing dev-only `playwright-core` 1.63.0 (E-030)
driving the installed **Google Chrome 152.0.7977.83**, headless, on Node
v22.23.2. Nothing was downloaded and no dependency was added. Dev server:
`npm run dev`; the recorded logs come from the final run on port **5173**
(an earlier identical run used 5174 because 5173 was momentarily taken). URL
`http://localhost:5173/prototypes/equal-sign-repair/`. The server was stopped
after the runs. Both scripts take `ESR_URL`, so they re-run on any port.

**`esr-verify.mjs` — 564 checks passed, 0 failed.** Every check asserts a
specific expected value read from the read-only `window.__equalizerLab` hook
(step name, both side totals, missing value, engine-correct value, equality,
attempt count, hint level, scaffold id, label, probe id, clarification, recount
index, totals visibility, matching state, rails visibility, and the full ordered
list of steps walked). No check accepts "some non-empty text appeared".

Runs inside that suite:

1. desktop `1280 × 720`, pointer — all four paths end to end;
2. narrow `390 × 844`, touch — all four paths end to end;
3. narrow `390 × 720` — the default `OPERATIONAL_EQUAL` path end to end;
4. desktop — all three Path D clarification choices, each checked against its
   mapped transfer scaffold;
5. desktop — Replay and `A → B → C → D → A` switching on **one page with no
   reload** (proved by a `window` stamp set after load and still present after
   every Replay and every path switch);
6. desktop — keyboard-only completion of a full path (Tab to reach controls,
   Enter to activate, arrow keys to build the missing value), including an
   assertion that focus lands inside the new step's controls after a transition;
7. desktop `1280 × 720` and narrow `390 × 844` under
   `prefers-reduced-motion: reduce`;
8. console and network assertions collected across every run above.

**`layout-probe.mjs` — 228 states probed, 0 problems.** Six viewports
(`320×568`, `360×640`, `390×720`, `390×844`, `1024×700`, `1280×720`) × four
paths × up to ten states each, including the worst cases: the Test-paths drawer
open, Path A's opening state with **29 unit cells**, the repair at hint level 3
(side totals + unit-matching overlay + full tool tray), the transfer, and the
summary. At every state it checks:

- `document.documentElement.scrollWidth <= window.innerWidth` — **no horizontal
  scrolling anywhere**;
- pairwise rectangle intersection across the equation, bridge, both rails, the
  bot, the explanation drawer, the tool tray, the controls, the status line and
  the three top-bar chips, skipping ancestor/descendant pairs — **no overlap**;
- every `.cell` stays inside its own rail — **no stray cells**;
- every visible `<button>` is at least 44 × 44 CSS px — **no small control**.

**Console and network.** Zero console errors and zero console warnings across
every run, and zero page errors. The only console output is Vite's own
`debug`-level `[vite] connecting… / connected.`, which is dev-server noise, not
a warning. Every network request origin observed was `http://localhost:5173` and
nothing else.

**Above-the-fold.** On first paint the primary action button's bottom edge is at
720 px at `390 × 720` (exactly at the fold) and at `390 × 844`. At `360 × 640`
and `320 × 568` the page scrolls vertically to reach it; vertical scrolling is
allowed, horizontal scrolling never occurs, and no control is fixed-position.

### 1.5 Path-by-path behaviour (observed, not intended)

All four paths use the same repair equation `6 + 5 = 7 + ?` (engine-correct
missing value `4`, left total `11`) and the same transfer `12 = 8 + ?`
(engine-correct missing value `4`, left total `12`).

**A — `OPERATIONAL_EQUAL` → `COMPARE_BOTH_SIDES`.** Opens with the synthetic
placement `11`, so the right rail carries `18` against the left rail's `11` and
the bridge shows 29 unit cells. The probe directs attention to each *complete*
side. The repair tools are `Match cells across rails` (matched cells grey out,
leftovers are ringed) plus `Remove a cell` / `Add a cell` and the number pod.
Three wrong submissions produced hint levels 1, 2, 3 with no totals at level 1,
totals at level 2 and unit matching at level 3; the missing value was unchanged
after each. Transfer scaffold `FADING_RAILS`: faint cells present at transfer
start, gone after the first construction action. Steps walked: `inspect,
consequence, interpret, repair, settled, transfer, summary` (7).

**B — `ARITHMETIC_SLIP` → `RECHECK_CALCULATION`.** Opens at `5`, right total
`12`. The probe accepts the method and asks only for a recount. `Recount next
cell` walked all 12 right-rail cells one at a time with a running count and the
index reached exactly 12. The hook's `explainedMisconception` flag stayed
**false** for the entire run — including every hint and the closing
restatement — so this path provably never enters the operational-misconception
explanation. Transfer scaffold `TOTALS_ONLY`: side totals shown, no individual
cells. Steps walked: 7, same shape as A.

**C — `RELATIONAL_VALID` → `FADE_TO_TRANSFER`.** Opens at `4`, so the bridge is
already balanced (`11 = 11`) and powering it settles the core immediately. There
is **no `repair`, no `clarify` and no `settled` step at all**; the run goes
straight to the transfer. Transfer scaffold `SYMBOLIC_ONLY`: the rails are
removed entirely, leaving the equation and the `=` core, with no cells and no
totals. Steps walked: `inspect, consequence, interpret, transfer, summary` (5) —
measurably shorter than A's and B's 7 and D's 8.

**D — `UNCLEAR` → `ASK_WHAT_EACH_SIDE_MEANS`.** Opens at `5`. No misconception
is assigned at any point (`explainedMisconception` stayed false for the whole
run). The extra `clarify` step offers three grounded choices, and the repair
that follows is neutral: an `Outline both complete sides` tool that draws
brackets and prints **no numerals**, so it does not leak the hint ladder's
totals. Transfer scaffold is mapped from the clarification and was verified for
all three choices: right-side total → `TOTALS_ONLY`; left-side total →
`FADING_RAILS`; missing group → `FADING_RAILS`. Steps walked: 8.

Across all four paths the scripted label and probe id are only revealed at the
`interpret` step, and both come from a fixed table keyed by the selected path.

### 1.6 Assets and dependencies

- **Zero dependencies added.** `package.json` and `package-lock.json` unchanged.
- **No third-party font, image, icon, character, sprite or audio.** Volt the
  maintenance bot, the energy cells, the rails, the `=` core, all gradients and
  the favicon are original inline SVG/CSS written for this prototype. System
  font stack only. There is no audio anywhere and none is required.
- **No network call of any kind.** A source scan of all four runtime files for
  `fetch(`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`,
  dynamic `import(`, `localStorage`, `sessionStorage`, `indexedDB`,
  `document.cookie`, `process.env`, `OPENROUTER` and `api_key` returned **zero
  hits**. The only `http://` string in the whole prototype is the SVG XML
  namespace inside the inline data-URI favicon, which issues no request.
- **No model, API, key, backend, persistence, analytics, deployment or child
  data.** No `.env` is read and no key is needed.
- **No copied code.** All four files were written for this slice.

### 1.7 Decisions the brief left open

The brief did not specify these; they were resolved here and are documented in
`prototypes/equal-sign-repair/README.md` as well.

1. **Path D clarification → transfer scaffold (the brief explicitly left this
   open).** Fixed as: *the whole right side* → `TOTALS_ONLY`; *the whole left
   side* → `FADING_RAILS`; *the missing group* → `FADING_RAILS`; nothing chosen
   → `FADING_RAILS` (the brief's stated default). Reasoning: naming the side
   that contains the blank as one whole amount is the strongest available sign
   that complete sides are being tracked, so the unit cells can go; naming only
   the side without the blank, or naming the blank itself, leaves it unresolved
   whether both complete sides are being compared, so the concrete units stay.
2. **Narrow layout.** Five-frames (at most five cells per row per group) at one
   shared unit size across both rails; cells are never click targets; all
   controls ≥ 44 px.
3. **Path B's "tap the cells".** A 44 px `Recount next cell` stepper walking the
   right rail one cell at a time, instead of tappable cells.
4. **Missing-value clamp `0..12`**, so the rails stay readable at 390 px.
5. **Transfer construction uses the number pod only**; the repair uses cells and
   the pod. The transfer rails are scaffold, not a control surface.
6. **Bridge orientation.** Side-on left-rail/`=`-core/right-rail at ≥ 901 px,
   stacked below that so 29 cells still fit at one unit size at 390 px. The
   imbalance tilt is a deliberately small ±0.5°, because it is a secondary
   signal beside the core text, the border state and the totals, and a larger
   rotation pushes a rail's bounding box into its neighbour on narrow screens.

---

## 2. Product judgment

*This section is opinion formed from operating the slice, not measurement.*

**What works.** The construction genuinely is a construction: the learner adds
and removes physical units or steps a numeral, and the two views stay locked
together, so the symbol-to-quantity link is visible rather than asserted. The
four paths are not cosmetic — they change the opening state, the number of cells
on screen, which step the run even visits, which tool appears in the tray, the
wording of all three hints, and which transfer support is granted. Path C's
"nothing to repair, here is the faded version" is the clearest demonstration
that the branch is doing real work, because it deletes three steps rather than
rewording one sentence. Path D refusing to assign a reason and asking a grounded
question instead is the second clearest.

**What feels thin.** The moment-to-moment verbs are still *press a button and
watch a number change*. The five-frame rails are legible but static; there is no
dragging, no physical grouping gesture, no sense of handling the units. Volt
reacts correctly but is a text box with a face. The bridge "tilt" had to be
reduced to ±0.5° to keep narrow layouts clean, which means the headline motion
metaphor of the brief now barely reads, and the equality signal is carried
mostly by text and colour. Against the brief's own bar — *if the game remains a
dressed-up missing-number worksheet, drop it even if the software is polished* —
this slice is closer to that line than the fantasy suggests.

**On the AI question, which D-013 did not ask this slice to settle.** Operating
the four paths makes it easier, not harder, to write the deterministic rule that
would replace the interpreter, because the paths are visibly a small closed set
with a fixed label→probe map. Nothing in the play experience revealed a branch
that obviously needs a language model.

---

## 3. Unresolved questions

1. Does the relational meaning of `=` actually land, or does the learner just
   equalise two rows of blocks? This slice cannot answer that; only a learner
   study could, and none is authorised.
2. Is the `Match cells across rails` overlay a teaching tool or an answer
   machine? It shows the leftover count directly.
3. Would the loop survive without the hint ladder? Every wrong attempt currently
   adds support, and support is what solves the problem.
4. Does the two-equation ceiling make the transfer meaningful, or is it too small
   a sample to distinguish understanding from repetition? (See §4.)
5. Is the bot worth its screen space, or would the same text in the status line
   do the same job at 390 px?
6. The brief's instruction to continue evidence rows from `E-056` conflicts with
   the register, which already contained `E-056` and `E-057`. A concurrent
   external edit then added its own `E-058` while this work was in progress, so
   the rows written here were renumbered to `E-059`–`E-062`. Nothing existing
   was renumbered or overwritten.
7. Three places where this slice reads differently from the brief's wording,
   recorded rather than silently absorbed: the explanation panel is a permanent
   side panel rather than a drawer or transient panel (brief §3); the
   `Test paths` drawer stays open after the reviewer picks a path until it is
   toggled shut, rather than re-collapsing itself (brief §5); and the bridge
   tilt is only ±0.5°, for the bounding-box reason in §1.7.

---

## 4. The strongest reason to DROP after seeing this UI

**The repair answer and the transfer answer are the same number, `4`.** A
learner can finish the entire loop — the whole demonstration that they now read
`=` relationally — by typing `4` a second time. `6 + 5 = 7 + ?` and `12 = 8 + ?`
both resolve to `4`, so the transfer, which is the *only* evidence the slice
offers that anything transferred, cannot distinguish relational reasoning from
repeating the number that worked a moment ago. D-013 fixed both equations, so
this could not be changed inside this slice; it is a property of the authorised
scope, not an implementation slip. Every path funnels into it, including Path
C's "fast path", where `4` is also the number the synthetic learner already
placed at the start. If the concept advances, the transfer equation has to
change so that its answer differs from the repair's — otherwise the concept's
central claim rests on a check it cannot pass or fail.

Three further honest weaknesses observed while building it:

- **Hint level 3 is functionally an answer reveal.** The unit-matching overlay
  greys every matched cell and rings every leftover one. Counting seven ringed
  cells and removing them is a visual instruction, not a mathematical decision.
  The prototype never *auto-fills* `4`, which was the brief's requirement, but
  the third hint makes constructing it close to mechanical. The same is true of
  Path A's `Match cells across rails` tool, which offers that overlay on demand
  at hint level 0.
- **The whole loop is solvable by visual equalisation, without engaging the
  meaning of `=` at all.** Make the right pile look like the left pile and the
  core settles. This is exactly the objection C09 recorded against the concept
  ("a balance toy may train visual equalization without changing the meaning of
  `=`") and the systematic-review caution in S25 that balance-model evidence is
  heterogeneous. Building the UI did not dissolve that objection; it made it
  concrete. Nothing in the interaction *forces* a comparison of two complete
  sides — the `Outline both complete sides` and `Match cells` tools invite it,
  but a learner who ignores them can still win.
- **The branch differences are large but authored, and the interpretation is
  the part that would need AI.** Everything genuinely distinct between the four
  paths lives in a fixed table: four labels, four probes, four tool sets, four
  scaffolds. This slice makes the branching feel worthwhile and simultaneously
  demonstrates how small and closed the branch space is — which is the same
  reasoning that closed Mission Forge under D-011.

---

## 5. What this report does not do

It does not select the final concept, choose the next gate, claim learning
efficacy, grade suitability, mastery, finalist status, winning or employment,
and it does not authorise any further revision or any runtime-AI integration.
