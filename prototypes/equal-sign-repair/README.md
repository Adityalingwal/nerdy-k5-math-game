# Equalizer Lab — Equal-Sign Repair scripted UI slice

Isolated concept prototype authorised by **D-013**. **D-014 dropped this
direction after review.** It remains here only as runnable decision evidence;
it is not the submission concept, not a learner study, and contains **no runtime
AI**.

Run the repository dev server and open:

```
http://localhost:<vite port>/prototypes/equal-sign-repair/
```

Nothing else is needed: no key, no `.env`, no backend, no build step. These four
files are plain HTML/CSS/JavaScript served as static files. They are outside
`tsconfig.json`'s `include` list and are not referenced by the root
`index.html`, so `tsc --noEmit` and `vite build` do not touch them.

## What it is

The learner is a bridge engineer helping **Volt**, a small maintenance bot,
restore a floating energy bridge. Two energy rails meet at an `=` core. The core
only holds when both rails carry the same total energy.

Repair equation: `6 + 5 = 7 + ?` Transfer equation: `12 = 8 + ?`
Both have the missing value `4`. These two equations are the only ones D-013
authorises.

## The loop

```
inspect a synthetic attempt
  -> power the bridge and see the consequence
  -> receive the path's scripted reading and probe
  -> (Path D only) answer one grounded clarification question
  -> construct the repair with cells and the number pod
  -> transfer to 12 = 8 + ? with a path-specific scaffold
  -> Replay, or load another path
```

## The four scripted paths

The `Test paths` control (collapsed during normal play) is an **adult reviewer
tool**. It loads one of four adult-authored synthetic starting states. The
labels and probe ids are exactly D-012's:

| Path | Places | Synthetic note | Scripted reading → probe | Repair verb | Transfer scaffold |
| --- | --- | --- | --- | --- | --- |
| A | 11 | "6 and 5 make 11, so 11 goes in the box." | `OPERATIONAL_EQUAL` → `COMPARE_BOTH_SIDES` | match cells across the rails, then remove the excess | `FADING_RAILS` |
| B | 5 | "Both sides should be 11; 7 plus 5 is 11." | `ARITHMETIC_SLIP` → `RECHECK_CALCULATION` | step through the right rail and recount | `TOTALS_ONLY` |
| C | 4 | "Both sides make 11: 6 plus 5 and 7 plus 4." | `RELATIONAL_VALID` → `FADE_TO_TRANSFER` | none — no remedial repair at all | `SYMBOLIC_ONLY` |
| D | 5 | "That is the answer." | `UNCLEAR` → `ASK_WHAT_EACH_SIDE_MEANS` | clarify the referent, then compare both complete sides neutrally | mapped from the clarification |

Path A is the default playthrough. Path C is deliberately the shortest run
(5 steps against 7 for A and B and 8 for D).

**The reading is fixed in advance by the selected path.** No free-form language
is read, parsed or classified. The synthetic note is read-only text the reviewer
inspects; the "interpreter" is a scripted reveal keyed to the chosen path. The
banner `Scripted concept prototype — no runtime AI` is on screen at every step.

## Decisions this prototype had to make

The brief left some points open. They are resolved here and repeated in
`docs/prototypes/equal-sign-repair/scripted-ui-build-report.md`.

**1. Path D clarification → transfer scaffold.** The brief left this mapping
open and suggested a shape; this prototype fixes it as:

| Clarification the learner picks | Scaffold | Why |
| --- | --- | --- |
| "the amount the whole **right** side carries" | `TOTALS_ONLY` | naming the side that contains the blank as one whole amount is the strongest available sign that complete sides are being tracked, so the unit cells can go and totals are enough |
| "the amount the whole **left** side carries" | `FADING_RAILS` | naming only the side without the blank leaves it unresolved whether both sides are being compared, so keep the concrete units at first |
| "the number of cells in the **missing group**" | `FADING_RAILS` | attention is on the blank rather than on either complete side, so keep the concrete units at first |
| nothing chosen yet | `FADING_RAILS` | the brief's stated default while the referent is still uncertain |

**2. Narrow-screen cell layout.** Path A's opening state shows 29 unit cells
(left 6 + 5, right 7 + 11). Cells are laid out in **five-frames** — at most five
per row inside each group — so both rails fit at 390 px at one shared unit size.
Cells are visual units and are small (30 px, 25 px below 560 px, 22 px below
360 px); they are never click targets. Every **control** is at least 44 × 44 px.

**3. Path B's "tap the cells".** Individual cells cannot meet 44 px, so the
recount is a 44 px `Recount next cell` stepper that walks the right rail one
cell at a time with a running count. Its verb stays distinct from Path A's
`Match cells across rails` + `Remove a cell`.

**4. Hint ladder — the answer is never revealed.**

| Wrong attempt | What happens |
| --- | --- |
| 1 | a specific, path-shaped hint; **no totals** |
| 2 | side totals become visible |
| 3 | unit matching across the rails: matched cells grey out, leftovers are ringed |

The value `4` is never filled in automatically, at any hint level, in either
phase. Path B never enters the operational-misconception explanation; it only
acknowledges the relational goal and recounts the right rail. Path D assigns no
misconception at all.

**4a. Missing-value clamp.** The learner's missing group is clamped to `0..12`
so the rails stay readable at 390 px. Both authorised answers are `4`.

**5. Transfer construction.** The repair is built with cells **and** the number
pod. The transfer is the symbolic step, so it is built with the number pod only;
its rails are scaffold, not a control surface. Under `FADING_RAILS` the faint
cells stay until the learner's first construction action, then fade; hint level 3
brings them back.

## Accessibility

- every control ≥ 44 × 44 px, verified at 320, 360, 390, 1024 and 1280 px wide;
- visible focus ring, logical tab order, Enter/Space activation, and focus moved
  to the new step's primary control on every transition;
- arrow keys anywhere in the tool tray are a non-pointer alternative to placing
  cells; a complete path can be finished with the keyboard alone;
- equality is never signalled by colour alone: the core prints `same amount` /
  `not the same`, the status line names the state, the matched/leftover cells
  differ in shape as well as colour, and the totals appear as text;
- `prefers-reduced-motion: reduce` removes every transition and the success
  pulse (no busy lock at all);
- no audio anywhere.

## Assets, dependencies and network

Zero dependencies. All artwork — Volt, the energy cells, the rails, the `=`
core, the gradients and the favicon — is **original inline SVG/CSS written for
this prototype**. No third-party font, image, icon, character or audio; system
font stack only. There is no `fetch`, `XMLHttpRequest`, `WebSocket`,
`EventSource`, dynamic `import()`, `localStorage`, `sessionStorage`, `indexedDB`
or cookie use, no `.env` read and no analytics. Verified network activity during
the automated runs was localhost only.

## Test hook

`window.__equalizerLab` is a frozen, read-only accessor set used by the
verification scripts under
`docs/evidence/prototypes/equal-sign-repair/scripted-ui/`. It reports
`step, busy, path, phase, equation, leftTotal, rightTotal, missingValue,
correctMissing, isEqual, attempts, hintLevel, scaffold, label, probeId,
clarification, recountIndex, totalsVisible, matchOverlay, railsVisible,
explainedMisconception, stepsSeen, status, botLine, banner, reducedMotion` and
the missing-value bounds. It cannot change state.

## Scope

This is synthetic, adult-operated product-design evidence. It is **not** proof
of child learning, AI value, grade suitability or mastery, and it selects no
concept. See `docs/prototypes/equal-sign-repair/scripted-ui-build-report.md`,
including the honest argument for dropping the concept after seeing this UI.
