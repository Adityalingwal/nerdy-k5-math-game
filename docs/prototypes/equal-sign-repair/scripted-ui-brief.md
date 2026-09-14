# Equal-Sign Repair — Bounded Scripted UI Brief

Status: authorized by D-013 for one isolated adult-operated concept slice.

This is not the final submission concept, a learner study, or a runtime-AI
integration. Its only job is to test whether the mathematical construction,
adaptive branches, game feel and transfer are worth taking to a real-model
evaluation.

## 1. Product question

Can a short, character-led construction game make the relational meaning of
`=` visible and enjoyable, while four simulated interpretation branches create
meaningfully different next actions rather than cosmetic wording changes?

If the game remains a dressed-up missing-number worksheet, drop it even if the
software is polished.

## 2. Learner and misconception

One learner who can add the displayed small whole numbers but may treat `=` as
an instruction to write “the answer next,” rather than as a relation saying
both sides name the same quantity.

This slice does not lock an age or grade. It tests the interaction, not learner
prevalence, learning efficacy or mastery.

## 3. Working fantasy and visual direction

Working title: **Equalizer Lab**.

Fantasy: the learner is a bridge engineer helping an original small maintenance
bot restore a floating energy bridge. Two energy rails meet at an `=` core. The
bridge stabilizes only when both sides carry the same total energy.

Viewpoint: side-on 2D. Build the playfield with original inline SVG/CSS and use
DOM controls for text and interaction. No third-party art, font or audio.

Material language: dark indigo workshop, electric cyan rails, warm amber energy
cells, coral imbalance and mint equality. Use CSS variables. Prefer a deliberate
rounded system-font stack and strong numeric typography.

Motion: the bridge tilts or flickers only when quantities differ, settles when
they match, and emits one restrained success pulse. No constant floating,
confetti, screen shake or decorative animation. Respect reduced motion.

The first view must feel playable within three seconds, not like a dashboard.
Keep the central construction area clear. Use one compact objective chip, one
small `Test paths` control and one contextual tool tray; put explanations and
test controls in drawers or transient panels.

## 4. Mathematical representation

Canonical repair:

`6 + 5 = 7 + ?`

The left rail visibly contains groups of 6 and 5 energy cells. The right rail
contains a group of 7 plus the learner-controlled missing group. Every visible
cell represents one unit; both rails use the same unit and fixed geometry.

The learner must construct the missing quantity by adding/removing cells or
adjusting a number pod. Do not reduce the main repair to four answer buttons.
Pointer/touch and keyboard must operate the same construction.

The deterministic local engine owns expression evaluation, correct missing
value, displayed totals, equality, valid construction and progression. It must
not infer reasoning from prose.

## 5. Scripted interpretation paths

Use exactly the D-012 labels:

1. `OPERATIONAL_EQUAL`
2. `ARITHMETIC_SLIP`
3. `RELATIONAL_VALID`
4. `UNCLEAR`

There is no separate `RELATIONAL` or `VALID` label.

The default playthrough is `OPERATIONAL_EQUAL`. A small `Test paths` drawer lets
an adult reviewer load any of the four synthetic action/explanation states and
Replay them. Keep the drawer collapsed during normal play. Clearly display:
`Scripted concept prototype — no runtime AI`.

Each loaded path must show the synthetic starting trace and short explanation,
then a local scripted interpreter reveals the fixed label. It must never imply
that free-form text was understood by AI.

### Path A — `OPERATIONAL_EQUAL`

- Equation: `6 + 5 = 7 + ?`.
- Synthetic placement: `11`.
- Explanation: “6 and 5 make 11, so 11 goes in the box.”
- Probe: compare the total on each full side, not just the expression before
  `=`.
- Repair verb: group/match equal cells across the two rails, then remove excess
  right-side cells until the bridge settles at missing value `4`.
- Do not reveal `4` on the first wrong repair.

### Path B — `ARITHMETIC_SLIP`

- Same equation.
- Synthetic placement: `5`.
- Explanation: “Both sides should be 11; 7 plus 5 is 11.”
- Probe: acknowledge the relational goal, then recount only the right rail.
- Repair verb: tap or step through the right-side cells and correct `5` to `4`.
- Do not send this path through the full misconception explanation.

### Path C — `RELATIONAL_VALID`

- Same equation.
- Synthetic placement: `4`.
- Explanation: “Both sides make 11: 6 plus 5 and 7 plus 4.”
- Probe: no remedial repair. Let the learner demonstrate the idea on a new
  equation with the concrete scaffold faded.
- Make this fast path visibly shorter than A and B.

### Path D — `UNCLEAR`

- Same equation.
- Synthetic placement: `5`.
- Explanation: “That is the answer.”
- Probe: ask what `that` refers to using three grounded choices: left-side
  total, right-side total, or missing group.
- Do not assign a misconception. After clarification, ask the learner to
  compare both complete sides and construct the repair neutrally.

## 6. Transfer

Use one bounded transfer equation:

`12 = 8 + ?`

The unknown changes position relative to `=`. The correct missing value is `4`.
Do not add curriculum breadth.

Support must depend on the scripted path:

- `OPERATIONAL_EQUAL`: faint equal-unit rails remain initially, then fade.
- `ARITHMETIC_SLIP`: show side totals but no individual cells.
- `RELATIONAL_VALID`: symbolic equation only.
- `UNCLEAR`: use the support implied by the learner's clarification; default to
  faint rails when still uncertain.

A correct transfer is an immediate understanding check only, not mastery.

## 7. Interaction and feedback

Core loop:

`inspect synthetic attempt -> see consequence -> receive path-specific probe -> construct repair -> transfer -> Replay/test another path`

Required behaviors:

- wrong construction visibly keeps the rails unequal and gives a specific hint;
- the first wrong attempt never immediately reveals the answer;
- a second hint may expose side totals, then unit matching;
- no points, streaks, timer, lives or punitive failure;
- the maintenance bot reacts to the mathematical state, not random rewards;
- success feedback is brief and returns focus to the next action;
- Replay fully resets state and lets the reviewer choose another path.

## 8. Responsive and accessible behavior

- Desktop reference: `1280 × 720`.
- Narrow references: `390 × 844` and `390 × 720`.
- No horizontal scrolling or overlap between the equation, bridge, cells,
  explanation drawer and controls.
- Minimum 44 px touch targets.
- Visible focus, logical tab order, Enter/Space activation and arrow-key or
  plus/minus alternatives to pointer placement.
- Color cannot be the only equality/imbalance signal; use totals, position and
  text/status icons.
- Honor `prefers-reduced-motion`.
- Do not require audio.

## 9. Hard boundaries

- Runtime files only under `prototypes/equal-sign-repair/`.
- Preserve Decimal Dock, Mission Forge and the D-012 CLI harness.
- No model, API call, key, network request, backend, persistence, analytics,
  dependency, package/config change, child data or deployment.
- No third-party assets or copied character designs.
- No claim of AI, learner benefit, grade suitability, mastery, finalist status,
  winning or employment.
- Do not commit or push.

## 10. Acceptance and gate

The slice is acceptable only if:

- all four scripted paths can be completed and Replay works;
- changing the path changes the starting trace, feedback, repair interaction
  and transfer scaffold, not just the label text;
- deterministic math rejects wrong repairs and accepts only valid equality;
- the experience remains visually readable and game-like on desktop and narrow
  screens;
- keyboard and reduced-motion routes work;
- console stays clean and network activity remains localhost-only;
- `npm test` and `npm run build` still pass.

After Aditya and Codex review the playable slice, choose only one:

1. advance to the independent holdout plus real-model test;
2. revise one blocking interaction once;
3. drop Equal-Sign Repair.

No second conceptual revision and no runtime-AI integration are authorized by
this brief.
