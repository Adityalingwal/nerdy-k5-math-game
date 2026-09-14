# Grade 2/3 Place-Value and Addition Misconceptions

Status: **reviewed research synthesis; product scope not locked**

Last reviewed: 2026-09-07

## Purpose

This document preserves the first bounded research chunk for future AI agents
and product work. It asks which language-light diagnostic tasks can distinguish
three possible sources of difficulty before the project commits to a learning
loop:

1. an addition-fact or quantity-combination difficulty;
2. a digit-position/place-value mapping difficulty; and
3. a ten-for-one unitizing or regrouping difficulty.

The three categories are diagnostic lenses, not permanent labels for a learner.
One wrong response is insufficient evidence of a stable misconception.

## Current provisional takeaway

Ten-for-one unitizing/regrouping is the strongest **provisional** core-loop
candidate. It makes mathematical reasoning visible through learner action and
supports targeted visual feedback and a later transfer task involving two-digit
addition.

This is not an accepted scope decision. Basic-fact knowledge and digit-position
mapping remain prerequisite checks so that the product does not misclassify
every incorrect two-digit addition response as a regrouping problem.

## What the research supports

### 1. Place value and regrouping can be distinct difficulties

Jensen, Gasteiger, and Bruns (2024) tested 100 German third graders with seven
named-unit-to-numeral tasks designed to require the place-value principle, the
regrouping principle, or both. The number of place-value errors did not
significantly correlate with the number of regrouping errors in that sample
(`rs = .161`, `p = .114`). Tasks targeting one principle mostly produced errors
attributable to that principle.

Product implication: do not use one broad label such as `place-value error`
when the learner may understand digit position but not ten-for-one exchange, or
vice versa.

Limitation: the study concerned German learners late in Grade 3 and included
three-digit named-unit notation. It supports separating the constructs; it does
not validate this project's exact two-digit interface or mastery threshold.

Source: https://doi.org/10.1007/s13138-024-00234-8

### 2. Canonical base-ten pictures can permit rote success

Chan, Au, and Tang (2014) developed a strategic-counting assessment using both
canonical and non-canonical base-ten arrangements. Some items required learners
to reorganize units or trade ten ones for one ten rather than merely count
already organized rods and cubes. Learners' strategies provided information
beyond a final correct answer, and a five-item subset predicted later
mathematics achievement in the population studied.

Product implication: observe how the learner reorganizes a quantity. Do not
treat recognition of a familiar `four rods + three cubes = 43` picture as
sufficient evidence of transferable place-value understanding.

Limitation: the reported developmental sequence and findings may be influenced
by language and instructional experience. The paper itself does not establish
that the sequence is universal.

Source: https://doi.org/10.1016/j.learninstruc.2013.09.001

### 3. Quantities, written numerals, and number language must be connected

Across four research projects, Fuson et al. (1997) identified sustained
opportunities to connect ten-structured quantities, number words, and written
two-digit numerals as crucial. Their framework also shows that learners may
hold different partial conceptions of multidigit numbers.

Product implication: the interaction should connect a visible quantity and the
written numeral. A block-only puzzle or symbol-only quiz does not demonstrate
the complete relationship needed for multidigit calculation.

Limitation: number-word structures differ across languages. Language-light
interaction reduces this confound but cannot prove equal effectiveness across
languages or countries.

Source:
https://karenfusonmath.net/wp-content/uploads/2023/06/47-MD-Methods-Conceptual-Structures-JRME-1997.pdf

### 4. Place-value knowledge consists of related but distinguishable components

Bower, Mix, Yuan, and Smith (2022) examined multiple tasks including
digit-place correspondence, base-ten counting, expanded notation,
reading/writing, magnitude comparison, and number-line estimation. Their work
supports measuring the specific component needed by a task instead of assuming
that reading a multidigit number proves complete place-value understanding.

Product implication: use bidirectional evidence. Ask the learner to map a
quantity to a numeral and a numeral back to its represented quantities.

Limitation: the study followed US kindergarten and first-grade learners. It
supports the assessment distinction, not the final target age or product
effectiveness.

Source: https://doi.org/10.1177/09567976211070242

### 5. Instruction should isolate new ideas and connect representations

The 2021 IES/What Works Clearinghouse elementary-mathematics practice guide
recommends using accessible numbers when introducing a concept, breaking a
complex procedure into smaller mathematical tasks, connecting concrete and
semi-concrete representations to notation, and providing immediate supportive
feedback. It treats basic facts and deciding whether regrouping is needed as
separate subtasks relevant to multi-digit addition and subtraction.

Product implication: the first regrouping diagnostic should not also demand a
difficult addition fact. Visual blocks, notation, feedback, and retries should
remain connected.

Limitation: a practice guide synthesizes intervention evidence and expert
judgment. Its examples are not validation of this particular game design.

Source: https://ies.ed.gov/ncee/wwc/PracticeGuide/26

### 6. Bundling ten is present in more than one curriculum context

India's National Curriculum Framework for the Foundational Stage describes
practice making bundles of ten as fundamental for place value and useful for
understanding standard addition and subtraction algorithms. England's Year 2
programme expects recognition of tens and ones, multiple partitions such as
`23 = 20 + 3` and `23 = 10 + 13`, and addition using concrete and pictorial
representations.

Product implication: a base-ten relationship is a defensible candidate for a
geography-neutral core mechanic. Grade labels, terminology, language, and
instructional sequence still require localization.

Limitation: curriculum inclusion establishes an educational expectation, not
misconception prevalence or effectiveness of the proposed intervention.

Sources:

- https://www.ncert.nic.in/pdf/NCF_for_Foundational_Stage_20_October_2022.pdf
- https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study

## Candidate diagnostic task families

### Task A: addition-fact and quantity-combination check

Show two small visual collections representing a crossing-ten fact such as
`7 + 5`. Do not introduce tens/ones columns or an exchange action. Let the
learner construct or select the total and observe whether they count all,
compose through ten, retrieve the fact, or produce an incorrect total.

Possible interpretations:

- Incorrect even with countable objects: quantity combination or counting may
  be unstable.
- Correct through one-by-one counting: conceptual addition may be available,
  while fact fluency remains inefficient.
- Accurate use of an efficient strategy: a later error is less likely to be
  explained solely by the underlying addition fact.

Product boundary: initial diagnosis should not be a speed-only test. The exact
item count and efficiency threshold remain unresolved.

### Task B: bidirectional digit-position mapping without regrouping

First show a non-regrouping quantity such as four tens and three ones in an
order or layout that does not reveal the written order. Ask the learner to build
`43` using two digit slots. Then reverse the mapping: show `43`, highlight the
`4`, and ask the learner to select the quantity represented by that digit.

Possible interpretations:

- Building `34` may indicate a position/order difficulty, but could also be a
  motor or interface reversal and must be checked again.
- Matching `43` correctly but treating the highlighted `4` as four ones may
  indicate surface numeral recognition without quantitative place meaning.
- Successful quantity-to-symbol and symbol-to-quantity mapping across varied
  items is stronger evidence than one canonical match.

Product boundary: avoid zero in the first probe because zero-as-placeholder is
an additional construct. Introduce it only if the selected scope later requires
it.

### Task C: ten-for-one unitizing/regrouping check

Show a non-canonical quantity such as two tens and thirteen ones. Require the
learner to select exactly ten ones and exchange them for one ten while
preserving the total. The resulting representation is three tens and three
ones, mapped to `33`.

Possible interpretations:

- Leaving thirteen ones ungrouped may show that the learner can count the total
  but does not spontaneously apply canonical regrouping.
- Exchanging an arbitrary number of ones may show that the exact ten-for-one
  relation is unclear.
- Moving `13` directly into the tens position may mix unit identity with digit
  position.
- Giving `33` without performing or explaining the exchange is a correct result
  but incomplete evidence of unitizing.
- Selecting exactly ten ones, creating one ten, preserving quantity, and
  mapping the result to `33` provides stronger action-level evidence.

Product boundary: teach the interaction mechanics with a neutral practice
example so that a drag error is not mistaken for a mathematical error.

## Preliminary comparison

| Candidate | Product strength | Main risk |
| --- | --- | --- |
| Basic addition facts | Easy to test and measure | Can collapse into a conventional drill; runtime AI may be unnecessary |
| Digit-position mapping | Clear visual error and short demo | Canonical items may reward rote matching; mechanic can become repetitive |
| Ten-for-one unitizing/regrouping | Reasoning is visible in learner actions; exchange supports meaningful hints, retry, and transfer | Interaction must isolate unitizing from facts, notation, and UI mistakes |

## Provisional product mapping

- **Target learner:** a learner who can usually combine small quantities and
  map tens/ones to a two-digit numeral but does not independently perform a
  ten-for-one exchange in a non-canonical representation.
- **Math concept:** ten ones are quantitatively equivalent to, and can be
  composed into, one ten without changing the total.
- **Visual representation:** proportional, countable ones and ten-bars, with an
  explicit but not automatically completed exchange.
- **Feedback:** a staged hint sequence should first focus attention on a full
  group of ten, then support selecting ten, and only finally demonstrate the
  exchange while preserving quantity.
- **Game mechanic:** organizing or exchanging units must be the play action,
  not an animation displayed after a multiple-choice response.
- **Mastery measure:** repeated independent success across varied
  non-canonical quantities, followed by transfer to a new representation or
  two-digit addition problem. Exact thresholds are not yet defined.
- **AI responsibility:** AI may classify a bounded action pattern, choose an
  appropriate probe or hint, and produce constrained/localizable explanation.
  It must not determine arithmetic correctness or make a permanent diagnosis
  from one response.
- **Demo evidence:** show two synthetic learner paths that initially produce a
  similar wrong answer but receive different support because their prerequisite
  evidence differs.

## Deterministic and AI boundary

The deterministic system should remain responsible for:

- mathematical correctness;
- whether exactly ten ones were selected;
- whether an exchange preserved the total;
- legal moves and interaction state;
- recording anonymous synthetic action events; and
- safe fallback when model output is absent, uncertain, or invalid.

A model may be useful for:

- selecting a next diagnostic probe from an approved set;
- selecting or generating a constrained hint based on an approved
  misconception schema;
- adjusting explanation language without changing the mathematics; and
- summarizing provisional evidence with uncertainty language.

The runtime AI contribution remains unresolved. If deterministic rules are
sufficient for the chosen adaptive behavior, the product must not add a
decorative or falsely necessary AI layer merely to claim AI usage.

## Geography and safety boundaries

- Define the learner by prerequisite knowledge and observed mathematical
  behavior, not nationality.
- Keep the core quantity and exchange action independent of currency, local
  objects, curriculum labels, and culture-specific stories.
- Treat written and spoken language as replaceable presentation layers; do not
  claim the interaction is language-free.
- Do not generalize results from one country or age group beyond the actual
  study population.
- Use adult testers following synthetic learner scripts. Do not use real
  student data or retain a child's identity, voice, face, or other personal
  information.

## Unresolved questions before scope acceptance

1. Which visual representation best makes ten-for-one equivalence visible
   without teaching only one block pattern?
2. What minimum prerequisite performance admits a learner into the regrouping
   loop?
3. How many varied tasks constitute enough evidence for a mastery update?
4. Does the learning transfer from the exchange mechanic to written two-digit
   addition?
5. Which adaptation genuinely benefits from a model rather than deterministic
   rules?
6. Can the complete mistake, hint, retry, and transfer story be demonstrated
   clearly within three minutes?

## Decision status

- K-5 Math Game: **accepted**.
- One polished learning loop: **accepted**.
- Geography-neutral core mechanic: **accepted design direction**.
- Grade 2/3 as the exact target: **hypothesis**.
- Ten-for-one unitizing/regrouping as the core misconception: **leading
  hypothesis, not accepted**.
- Two-digit addition with regrouping as the transfer task: **hypothesis**.
