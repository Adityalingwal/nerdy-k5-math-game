# Mission Forge — scripted concept prototype

**Scripted concept prototype — no runtime AI.**

This is an isolated, playable vertical slice built to help decide whether the
Mission Forge concept was worth pursuing. It is not the selected submission
concept and makes no claim about learning outcomes. **D-011 dropped this
direction after its one authorized revision.** It remains here only as runnable
decision evidence. See `docs/decision-log.md` D-011.

## Run

```bash
npm run dev
```

Then open <http://localhost:5173/prototypes/mission-forge/> (keep the trailing
slash). The existing Vite dev server serves this nested page; no config change,
dependency, or build step was added. `npm run build` still builds only the
Decimal Dock root app, so this prototype is intentionally not in `dist/`.

## The story decides the world (D-010 revision)

`12 ÷ 3 = 4` has two valid story meanings, and the prototype builds whichever
one the learner writes. Two example buttons make both testable without
inventing wording.

| | Meaning A — `3 in each ship` | Meaning B — `3 ships share` |
| --- | --- | --- |
| Story | `12 crystals. Put 3 crystals in each ship. How many ships can launch?` | `3 ships are sharing 12 crystals equally. How many crystals does each ship get?` |
| `3` counts | crystals per ship | number of ships |
| `4` counts | number of ships | crystals per ship |
| Intended world | 4 ships × 3 crystals | 3 ships × 4 crystals |
| Robo's opposite world | 3 ships × 4 crystals | 4 ships × 3 crystals |
| Scanner compares | `3 in each ship` vs `4 in each ship` | `3 ships` vs `4 ships` |
| Repair | load one ship, `Repeat this group` | load ship 1 of 3, `Fill every ship the same` |
| Transfer `20 ÷ 5 = 4` | 5 fixed rovers, `How many batteries each?` → 5 × 4 | `5 batteries in each rover`, `How many rovers?` → 4 × 5 |

Everything in that table is derived from one field in the schema
(`divisorRole`), so the two paths cannot drift apart by accident.

## The loop (about 2-3 minutes)

1. **Mission arrives:** `12 ÷ 3 = 4`. Robo can calculate 4 but not say what it counts.
2. **Forge:** one editable story field, prefilled with meaning A, plus two
   example buttons (`3 in each ship`, `3 ships share`).
3. **Compile reveal:** story phrases fly into the equation and label 12, 3 and 4
   *according to the meaning the script read*; a beam prints 12 crystals and a
   ship blueprint.
4. **Robo's mistake:** Robo swaps the roles of the story he was given and builds
   the opposite world. All 12 are used, so it looks tidy but is wrong.
   `Yes, launch` makes ship 1 stall and runs the mission scanner;
   `No, debug it` goes straight to debugging.
5. **Debug:** say what the 3 counts, then rebuild the world by hand — repeat a
   known group size, or fill a known number of ships. Wrong builds play out for
   real (4 per ship rebuilds Robo's world on path A; 3 each leaves 3 crystals in
   the bay on path B).
6. **Teach Robo:** fill `3 was [ ]` and `4 was [ ]`; Robo restates the rule.
7. **Transfer:** `20 ÷ 5 = 4`, oriented against whichever meaning was played.
8. **Summary**, `Replay` (resets story, schema and world without reloading) and
   `Back to concept review`.

Pointer and keyboard can complete everything. The loose crystals/batteries on
the bay floor are pointer-only targets; the dock buttons are the keyboard and
screen-reader path for the same actions.

## What is scripted vs real

| Real and deterministic | Scripted |
| --- | --- |
| Mission schemas, role lookup, group building, pass/fail checks | The story interpreter only recognises a small family of known wordings |
| Every count shown in the world comes from the engine | Only two story meanings exist; there is no third reading |
| Which of the two schemas the story selects, and every label, world, repair and transfer that follows | "Teach Robo" uses fixed choice slots |
| Consequences of any group size the player tries | Robo's mistake is always the opposite of the selected meaning, never a random error |

The **interpreter** (`interpretStory` in `main.js`) is a small, transparent
local script. It is not AI and never decides math truth. It recognises:

- **meaning A** wordings, where the 3 sits next to *each ship*, for example
  `Each ship holds 3 crystals. There are 12 crystals. How many ships?` or
  `12 crystals, 3 in each ship. How many ships launch?`;
- **meaning B** wordings, where the 3 counts ships and they share, for example
  `Share 12 crystals equally across 3 ships. How many crystals does each ship
  get?` or `3 ships sharing 12 crystals. How many crystals each?`;
- ambiguous text such as `12 crystals and 3 ships.`, or text that mixes the two
  signals → honest "I can't tell what the 3 counts" reply;
- anything else → honest "this prototype only knows 12 crystals, 3 and ships"
  reply.

It reads two independent signals — what the `3` is attached to, and what the
question asks for — and commits only when they agree. It never invents a third
schema and never does arithmetic.

A real version would replace this with a model that maps free text onto the
same deterministic schema, and would read a free-form "teach Robo" explanation.
None of that runs here.

## Code layout (`main.js`)

1. `MISSIONS` — four schemas: two readings of `12 ÷ 3 = 4` and the matching
   transfer for each. `TRANSFER_OF` pairs them so mission 2 always reverses
   mission 1.
2. Engine — pure functions (`intendedWorld`, `roboWorld`, `repeatGroup`,
   `fillFixedGroups`, `buildPlan`, `startingGroups`, `checkWorld`). Self-checks
   run on load and fail loudly if the two meanings ever stop differing.
3. Interpreter — `interpretStory`, `findSpans`, plus self-check cases for both
   meanings, the ambiguous cases and the refusals.
4. Flow — explicit steps, one `act()` entry point, cancellable timed sequences.
5. View — DOM rendering, keyed world reconcile, and animation helpers that
   never change mission data.

`window.__missionForge` is a read-only hook (`step()`, `busy()`, `world()`,
`missionId()`, `firstMissionId()`, `mode()`, `roles()`, `read(text)`) used only
by the verification script to wait for animations and to assert which schema a
story selected. It cannot change state.

## Boundaries

- Plain HTML, CSS, inline SVG and JavaScript. No dependency, network call,
  API key, storage, cookies, analytics or model.
- All art (Robo, crystals, ships, batteries, rovers, bay) is original inline
  SVG/CSS made for this prototype. System fonts only. No audio.
- Respects `prefers-reduced-motion`: flying items, beams and sweeps are
  skipped and CSS motion collapses; reading pauses stay.
- Use synthetic adult-operated input only. Do not test with children.
