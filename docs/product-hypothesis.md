# Product Hypothesis

Status: **concept selection open (D-009, 2026-09-09); Mission Forge dropped
after its bounded revision (D-011, 2026-09-13); Equal-Sign Repair dropped after
its scripted UI review (D-014, 2026-09-14)**

## Selected prompt

K-5 Math Game.

## Previously locked and implemented candidate

A short game loop for a learner aged 9-11 who compares decimals as if they were
whole numbers (0.45 > 0.8 "because 45 > 8", or the reverse shorter-is-larger
rule). The learner places decimals on a zoomable 0-1 number line; zooming makes
place value visible (0.8 = 0.80 stays put, 0.45 sits to its left). After a wrong
placement the learner explains why, then finds and fixes an erroneous example
that mirrors their own rule, then meets transfer items that defeat both length
rules (0.7 vs 0.65; 0.099 vs 0.1), ordering, money, and measurement.

The deterministic engine owns magnitude truth, rule classification (L, S, A, U
from Steinle and Stacey's core items), item selection, and mastery gating. The
AI owns one bounded job: classify the typed explanation into a closed label set
with a confidence gate, generate a learner-matched erroneous example, and phrase
explanations in the configured language. It never decides which decimal is
larger. Full reasoning and accepted risks: `decision-log.md` D-008 and
`research/deep/decimal-longer-is-larger.md`.

The earlier Grade 2/3 place-value hypothesis was rejected (D-003) after two
independent blind candidate reports and a deep-research pass.

Aditya's review of the built experience reopened the final product choice on
2026-09-09. Decimal Dock remains intact as a candidate and as implementation
evidence; it is not currently assumed to be the submission concept.

## Historical bounded evaluation: Equal-Sign Repair (dropped)

The target learner can add the displayed numbers but may treat `=` as an
instruction to put an answer next rather than as a relation between equal
quantities. A possible later loop would ask the learner to repair paired
expressions such as `6 + 5 = 7 + ?`, construct equal quantities, and transfer
to unfamiliar equation forms.

D-012 authorized a local synthetic test of the proposed AI responsibility: use
an action trace plus short explanation to distinguish operational equality
reasoning, an arithmetic slip, valid relational reasoning, and uncertainty.
Its real-model route remains untested. D-013 authorized one isolated scripted
UI slice using those four fixed results without runtime AI. The slice worked as
specified, but D-014 dropped it: repair and transfer shared the answer `4`, the
visual task did not prove changed relational understanding, and the small
authored branch map did not establish a necessary AI role. Deterministic code
owns all mathematics and progression. Preserve the experiment; do not continue
it.

## Historical exploratory hypothesis: Mission Forge (dropped)

A learner around age 8-10 can calculate a simple division fact but may not track
whether its quotient names the size of each group or the number of groups. In
Mission Forge, Robo receives an equation such as `12 / 3 = 4` but cannot tell
what the numbers mean. The learner authors a short story, watches it compile
into a playable grouping world, debugs Robo's plausible role swap, teaches what
each number counts, and completes a contrasting transfer mission.

The proposed future AI contribution is to convert varied learner-authored
language into a closed, deterministic mission schema and ask a grounded
clarification when the story is ambiguous. The deterministic engine owns every
number, role, object count, equation match, and mastery decision.

The prototype deliberately has no runtime AI. Its job was to test whether
the interaction is understandable, appealing, and game-like before paying the
cost of model integration. Full boundary: `prototypes/mission-forge/build-brief.md`.

D-011 closed this experiment after the one authorized revision. The story now
causally changes the world, but the loop remains highly guided and the closed
two-schema interpretation does not make AI necessary. Preserve the constructive
repair insight and the evidence; do not continue this concept.

## Historical Mission Forge prototype loop

`Forge story -> compile world -> inspect Robo's role swap -> construct repair -> teach labels -> contrasting transfer`

The game layer must make group size, number of groups, and the quotient's unit
visible. Progression comes from constructing and transferring the distinction,
not from points, streaks, or cosmetic rewards.

## Historical proposed AI contribution (not advancing)

The proposed next step had been to test whether AI could parse varied
learner-authored stories into a closed mission schema and ask one grounded
clarification when a role was ambiguous. D-011 rejected that advance because
the revised interaction still did not establish enough product value for a
runtime parser. No Mission Forge AI integration is authorized.

## Winning and hiring signal

The demo should show product judgment and engineering depth together:

- a precise learner and learning problem;
- a mechanic that represents the math concept, not a themed quiz;
- a visible change in instruction after a meaningful mistake;
- safe, explainable AI behavior with deterministic correctness;
- an evidence trail connecting design decisions to learning research;
- a polished complete loop that can be understood in under three minutes.

## Explicitly out of scope for the first prototype

- broad K-5 curriculum coverage;
- accounts, subscriptions, classrooms, or an LMS;
- multiplayer, social feeds, or large narrative worlds;
- a full parent or teacher dashboard;
- voice, face, emotion, attention, or biometric analysis;
- real student records or production analytics infrastructure.

## Historical and retained open questions

Historical Mission Forge questions, resolved for the D-011 gate:

- Does story-to-world transformation feel meaningful rather than cosmetic?
- Can an unfamiliar adult understand Robo's group-size/number-of-groups error
  without explanation?
- Does debugging feel like mathematical play rather than a word-problem form?
- Is the experience strong enough to justify a real AI story parser and its
  safety/reliability complexity?

Historical Decimal questions, retained if that candidate advances again:

- Is within-session rule inference (a few placements) stable enough to drive
  the learner-matched erroneous example? Test on day 1-2 with synthetic traces.
- Does the explanation classifier agree with an adult rater on synthetic cases
  (paraphrases, slips, code-mixed text) at a usable rate, and does it beat a
  keyword table on the hard cases?
- Do GUESS/UNCLEAR learners need a worked correct example branch instead of
  another erroneous example (proficiency-dependent benefit)?
- Which notation profile the demo shows (US Common Core 4.NF.7 as reference;
  decimal separator and currency configurable).
