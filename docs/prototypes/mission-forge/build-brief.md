# Mission Forge Scripted Playable Slice — Build Brief

Status: **authorized exploratory prototype, not the selected submission concept**

- Date: 2026-09-09
- Decision authority: `docs/decision-log.md` D-009
- Audience: Claude Code or another implementation agent
- Target effort: 5-8 focused hours
- Target review session: 10-20 minutes with Aditya as the adult operator

## 1. Why this prototype exists

The current Decimal Dock MVP is technically functional but did not create a
convincing game experience for Aditya. Paper comparisons found:

- Equal-Sign Repair has the strongest matched instructional evidence and the
  lowest implementation risk, but its AI role may feel removable.
- Remainder Rescue has stronger narrative consequences and a more natural
  language-AI role, but its learning scope and evidence are weaker.
- Mission Forge has the strongest proposed AI-native promise: a learner writes
  a mathematically meaningful story and sees it become a playable world.

Text discussion cannot establish whether that promise feels magical, clear, or
game-like. This slice exists only to reduce that uncertainty. It does **not**
test child learning, establish efficacy, select the final concept, or authorize
a production rebuild.

## 2. Product hypothesis being tested

For a learner around age 8-10 who can calculate a basic division fact but does
not reliably distinguish what the quotient counts, the same expression can
describe two different situations:

1. `12 / 3 = 4`: 12 crystals shared across 3 ships means 4 crystals per ship.
2. `12 / 3 = 4`: 12 crystals packed 3 per ship means 4 ships.

The prototype asks whether this loop is understandable and appealing:

`forge a story -> watch it become a world -> spot Robo's interpretation -> debug it -> teach the distinction -> transfer`

The target misconception is narrow:

> The learner treats the quotient as an unlabelled answer and does not track
> whether it names the size of each group or the number of groups.

Do not add remainder interpretation, long division, fractions, multiplication
instruction, broad word-problem tutoring, or other misconceptions.

## 3. Evidence boundary

Verified context:

- Common Core 3.OA.A.2 explicitly asks learners to interpret whole-number
  quotients as either objects in each share or number of shares, and to describe
  a matching context:
  https://www.thecorestandards.org/Math/Content/3/OA/A/2/
- A 2022 meta-analysis of 21 problem-posing intervention studies reported an
  average positive academic-outcome effect (`g = 0.64`), with important
  variation by task structure and duration:
  https://doi.org/10.1080/19477503.2022.2105104
- Pareto's 2014 teachable-agent arithmetic environment involved 443 students
  from 22 classes in 9 schools; 314 playing students used it for three months,
  and the quasi-experimental portion reported learning gains relative to
  controls:
  https://doi.org/10.1007/s40593-014-0018-8

Limits that must remain visible:

- None of these sources tests Mission Forge, an LLM story compiler, this exact
  division loop, or a two-to-three-minute learning dose.
- This prototype produces product-design evidence only: comprehension, appeal,
  interaction quality, and feasibility.
- Do not claim that the prototype improves learning.

## 4. Required player fantasy and verbs

Fantasy:

> Robo can calculate equations but cannot understand what the numbers mean in
> a mission. The player is a Mission Forger who teaches Robo to translate math
> into a working world.

Primary player verbs:

- **Forge** a short story for an equation.
- **Watch** the story compile into a visual mission.
- **Inspect** what each number labels.
- **Debug** Robo's plausible misinterpretation.
- **Teach** the corrected rule.
- **Verify** transfer on a contrasting mission.

The initial view must feel playable within a few seconds. Avoid a landing page,
profile picker, tutorial carousel, settings page, or dashboard.

## 5. Exact scripted experience

Target duration: 2-3 minutes for an unfamiliar adult operator.

### State A — Mission arrives

- Show a compact holographic equation card: `12 / 3 = 4`.
- Robo appears in the playfield and says, in one short bubble:
  `I can calculate 4, but what does the 4 count? Forge me a mission.`
- Primary action: `Forge a mission`.
- No long explanatory paragraph.

### State B — Story forge

- Provide one real text input, prefilled or accompanied by a one-tap example:
  `12 crystals. Put 3 crystals in each ship. How many ships can launch?`
- The text remains editable so the interaction reads as creation rather than a
  multiple-choice quiz.
- Button: `Build my world`.
- For this scripted prototype, use a small transparent local interpreter. It
  may recognize the intended demo wording, a known alternate wording, and an
  ambiguous wording. Do not call any model or pretend the interpreter is AI.
- If arbitrary text is unsupported, respond honestly with a short prompt to use
  the demo idea. Never fabricate a successful interpretation.

### State C — Compile reveal

- Animate the equation turning into labelled mission roles:
  - 12 -> total crystals
  - 3 -> crystals per ship
  - 4 -> number of ships
- Crystals and ships materialize in the playfield. This transformation is the
  prototype's main delight beat; give it the strongest visual transition.
- Keep the centre and lower-middle of the playfield free of permanent panels.

### State D — Robo makes a plausible mistake

- Robo swaps the two meanings: it creates **3 ships with 4 crystals each**.
- All 12 crystals are used, so the scene is numerically tidy but semantically
  wrong. The failure must not rely on a red X alone.
- Show label chips attached to the world:
  - `3 ships`
  - `4 in each ship`
- Robo asks: `I used all 12. Did I build your mission?`
- Player chooses `Yes, launch` or `No, debug it`.
- If `Yes`, launch one ship briefly, then have the mission scanner compare the
  learner's story with the world and point to the role mismatch without shaming.

### State E — Player debugs the world

- Player first identifies what the `3` counts: `crystals per ship`.
- Then the player repairs the world through a meaningful spatial action:
  drag or tap three crystals into one ship, then use `Repeat this group` to
  produce four equal ships.
- Do not reduce the repair to typing `4` into an answer box.
- Successful repair launches four ships and leaves zero crystals.

### State F — Teach Robo

- Robo asks one compact question: `So what did 3 count, and what did 4 count?`
- Use two labelled slots or a short sentence builder for the scripted slice:
  `3 was [crystals in each ship]. 4 was [number of ships].`
- Show the future AI promise honestly in a developer-only or review note, not as
  fake runtime behavior: a real version would interpret free-form explanations
  and ask a grounded clarification question.
- Robo restates the learned distinction in one sentence.

### State G — Contrasting transfer

- Use `20 / 5 = 4`, but reverse the unknown role:
  `20 batteries are shared equally across 5 rovers. How many batteries does each rover get?`
- Show five rovers as fixed before the player acts.
- Player selects/builds 4 batteries per rover.
- The world animates the distribution; the engine checks exact counts.
- This state must reveal whether the player tracked the requested unit rather
  than memorized `divisor = group size`.

### State H — Review ending

- End with a compact result, not celebration spam:
  `You taught Robo: division can ask for group size or number of groups.`
- Buttons: `Replay` and `Back to concept review` (the latter may simply return
  to the opening state with the review questions visible below the fold).
- Include a subtle, honest badge: `Scripted concept prototype — no runtime AI`.

## 6. Visual direction

Experience: a playful cosmic fabrication bay, not a school worksheet wrapped in
space wallpaper.

- Background: deep navy/violet workshop with a restrained starfield and one
  clear launch aperture.
- Primary light: electric cyan.
- Secondary/action colour: warm amber.
- Repair/error colour: coral, paired with shape/text rather than colour alone.
- Success colour: mint, used sparingly.
- Robo: expressive procedural SVG/CSS character with eyes, antenna, arms, and
  three clear states: curious, confidently wrong, understood.
- Crystals and ships: original inline SVG or CSS shapes created in-repository.
- Typography: system font stack only; large, rounded, high-contrast labels.
- Motion: equation-to-world compile, crystal magnet/snap, Robo expression
  changes, ship launch. Avoid constant bobbing and decorative motion everywhere.
- Respect `prefers-reduced-motion`.
- No third-party art, icon pack, font, sound, or generated image in v0.
- Optional sound, only after the full loop works: short synthesized Web Audio
  cues with a mute control. No downloaded audio.

Avoid:

- generic SaaS cards or dashboard grids;
- large text panels covering the playfield;
- a permanent chat sidebar;
- neon overload, confetti, coins, streaks, lives, timers, or fake scores;
- teacher/parent dashboards or account chrome;
- a static slideshow masquerading as a game;
- visual polish that delays completion of the whole loop.

## 7. Technical boundary

This is an isolated local prototype. Preserve the existing Decimal Dock.

Required location:

```text
prototypes/mission-forge/
  index.html
  styles.css
  main.js
  README.md
```

Implementation constraints:

- Use plain HTML, CSS, SVG, and JavaScript. Existing Vite serves the nested page
  at `/prototypes/mission-forge/`; do not add a framework or dependency.
- Keep all new runtime code inside `prototypes/mission-forge/`.
- Do not edit `index.html`, `src/`, `api/`, `scripts/`, `package.json`, lockfile,
  Vite config, TypeScript config, or the Decimal tests.
- State must be a small explicit finite-state flow. Separate semantic mission
  data from DOM rendering and animation code even in this prototype.
- The deterministic mission schema owns totals, divisor role, quotient role,
  labels, object counts, and pass/fail.
- The scripted interpreter only selects among known local demo schemas. It does
  not determine mathematical truth.
- No network calls, API keys, model SDKs, persistence, analytics, cookies, or
  localStorage.
- No child data. Test with Aditya or another adult using synthetic input only.
- No copied product art or third-party copyrighted characters.
- Do not commit, push, deploy, or modify repository visibility unless Aditya
  separately requests it.

## 8. Responsive and accessible behavior

- Primary review viewport: 1280 x 720 or larger.
- Must remain usable at approximately 390 x 844 without horizontal scrolling.
- Pointer and keyboard paths must work for all required actions.
- Visible focus states, semantic buttons/labels, and status announcements for
  meaningful state changes.
- Do not make drag the only way to complete the repair; tapping/selecting plus
  `Repeat this group` is the accessible equivalent.
- Never rely only on colour to communicate the role mismatch.

## 9. Explicit non-goals

Do not build:

- real LLM integration or an AI-value harness;
- additional equations, levels, curriculum progression, accounts, saves, or
  analytics;
- voice input, microphone access, speech recognition, or child profiles;
- a production asset pipeline, backend, deployment, or content-management
  system;
- Equal-Sign Repair, Remainder Rescue, or changes to Decimal Dock in parallel;
- final branding, submission copy, or claims of learning improvement.

## 10. Decision questions this prototype must answer

The later review will judge only these questions:

1. Does the opening communicate the fantasy and first action within 10 seconds?
2. Does `story -> playable world` feel like a meaningful transformation?
3. Is Robo's 3-versus-4 mistake understandable without an adult explanation?
4. Does debugging require mathematical thinking rather than answer entry?
5. Does the transfer mission expose what the quotient counts?
6. Does the experience feel more like a game than a decorated worksheet?
7. If real AI later replaces the interpreter, is its contribution visible and
   necessary to the product promise?

Do not optimize for production readiness before these questions have answers.
