# Mission Forge — One Bounded Revision Brief

Status: authorized by D-010; still an exploratory scripted prototype

Date: 2026-09-12

## 1. Purpose

Revise the existing Mission Forge slice to answer one question:

> Does the story feel necessary when its mathematical meaning changes the
> world, Robo's mistake, the repair action and the transfer mission?

This is not a new game, a production rebuild or final concept selection. Do not
add runtime AI. The revision must make the proposed future AI responsibility
visible using a transparent local script first.

## 2. Keep unchanged

- Target learner: approximately age 8-10, able to calculate a basic division
  fact but not reliably tracking what the quotient counts.
- One misconception: confusing group size with number of groups.
- Fantasy: Robo can calculate but needs the learner to explain what each number
  means in the mission.
- Equations: `12 / 3 = 4` first, `20 / 5 = 4` for contrast.
- Core loop: story -> world -> plausible role swap -> constructive repair ->
  explain -> contrasting transfer.
- Deterministic code owns arithmetic, roles, object counts, validation and
  progression.
- Existing Decimal Dock and every root runtime/configuration file remain
  untouched.

## 3. The required causal change

The first equation must support both valid story structures.

### Path A: group size is known

Example:

`12 crystals. Put 3 crystals in each ship. How many ships can launch?`

- `3` means crystals in each ship.
- `4` means number of ships.
- Intended world: 4 ships with 3 crystals each.
- Robo's opposite interpretation: 3 ships with 4 crystals each.
- Repair: learner loads one 3-crystal ship, then repeats that group.

### Path B: number of groups is known

Example:

`Share 12 crystals equally across 3 ships. How many crystals does each ship get?`

- `3` means number of ships.
- `4` means crystals in each ship.
- Intended world: 3 ships with 4 crystals each.
- Robo's opposite interpretation: 4 ships with 3 crystals each.
- Repair: show 3 fixed ships; learner loads one with 4 crystals, then fills all
  ships equally.

Changing only the story from Path A to Path B must change all of these:

1. equation role labels;
2. intended world;
3. Robo's wrong world;
4. mismatch explanation;
5. repair verb and construction;
6. what `3` and `4` count;
7. orientation of the transfer mission.

The interpreter may accept a small documented family of synthetic wordings for
each path. Ambiguous or unsupported text must receive an honest clarification
or example prompt. It must never pretend to be AI.

## 4. Contrasting transfer

Keep `20 / 5 = 4`, but make it contrast with the first story:

- After Path A, use 5 fixed rovers and ask how many batteries each gets:
  5 rovers with 4 batteries each.
- After Path B, use 5 batteries per rover and ask how many rovers can be filled:
  4 rovers with 5 batteries each.

The transfer must not simply repeat the same role rule used in the first
mission. It remains one guided immediate check, not evidence of mastery.

## 5. Interaction and visual constraints

- Keep one editable story field. Provide two clearly named example buttons so
  an adult can test both meanings without inventing wording.
- Do not add levels, scores, lives, coins, dashboards or more equations.
- Keep the world and construction visually dominant.
- Fix the observed narrow/mobile defect where loose batteries overlap the
  Mission 2 story text.
- Keep pointer and keyboard completion, visible focus, reduced motion and
  non-colour mismatch cues.
- Keep the visible disclosure:
  `Scripted concept prototype — no runtime AI`.

## 6. Technical boundary

Modify only the existing runtime files under:

```text
prototypes/mission-forge/
```

Documentation and new evidence may be added under:

```text
docs/prototypes/mission-forge/
docs/evidence/prototypes/mission-forge/revision/
```

Do not modify the root Decimal Dock implementation, package files, Vite config,
tests or deployment files. Add no dependency, API, model, network call,
storage, analytics or child data. Do not commit, push or deploy.

## 7. Required verification

Complete both story paths end to end on fresh resets. For each path verify:

- the interpreter selects the correct role structure;
- the equation labels and intended world differ appropriately;
- Robo builds the opposite but numerically tidy world;
- wrong and correct repairs produce deterministic consequences;
- the transfer reverses the role orientation;
- summary text accurately describes both missions.

Also verify:

- ambiguous and unsupported story handling;
- Replay resets all story-dependent state;
- keyboard-only completion;
- approximately 390 x 844 and 1280 x 720 layouts;
- reduced motion;
- no console errors or non-localhost requests;
- `npm test` and `npm run build` still pass.

Save revision evidence separately from the original evidence. Create:

```text
docs/prototypes/mission-forge/revision-build-report.md
docs/evidence/prototypes/mission-forge/revision/
```

The report must state exact files changed, checks run, results, screenshots,
remaining limitations and the strongest reason to drop after this revision.

## 8. Final product gate

This revision does not select Mission Forge. After Aditya plays both paths,
choose exactly one:

- **Advance:** the changed story feels necessary and satisfying; run one
  bounded real-AI parser experiment against the same closed schema.
- **Drop:** the experience still feels like a guided worksheet, story creation
  still feels removable, or the AI reliability/typing cost is not worth it.

There is no second conceptual revision in this experiment.
