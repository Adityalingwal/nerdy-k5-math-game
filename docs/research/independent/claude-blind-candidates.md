Status: External blind candidate report; not canonical evidence and not an
accepted product decision.

# Blind Divergent Discovery: K-5 Arithmetic Learning-Loop Candidates

Author: Claude (independent research lane, Phase A)
Date: 2026-09-07
Scope: divergent candidate generation before seeing the team's detailed
hypothesis, research plan, decision log, progress, evidence register, or
existing misconception research. No code, no scope lock, no canonical edits.

Files read for this report (in order): `AGENTS.md`, `CLAUDE.md`,
`docs/00-index.md` (orientation only), `docs/hackathon-brief.md`,
`docs/rules-and-compliance.md`,
`references/2026-09-04-landing-page-facts.md`,
`references/2026-09-04-official-rules-facts.md`. Nothing else under `docs/`,
`references/`, `notes/`, or memory was opened. No sub-agent, Fusion, Codex, or
other model was invoked; the advisor tool was also not used, to keep the lane
blind.

Evidence-handling note: findings below come from web searches of peer-reviewed
abstracts, IES/WWC documents, ERIC records, and a few reputable secondary
summaries. Where a number was seen only in a search summary or abstract rather
than a full text, it is tagged "(abstract-level)". Any figure carried into the
canonical evidence register should be re-verified against the primary source.

---

## 0. How to read this report

1. Section 1: constraints restated as tests, so the elimination step is
   auditable.
2. Section 2: cross-cutting findings that shape every candidate (curriculum,
   learner behavior, intervention evidence, AI-role evidence). Verified facts,
   inferences, and hypotheses are labeled.
3. Section 3: fifteen candidates, generated before any ranking. Same fourteen
   fields for each.
4. Section 4: neutral selection criteria, defined before scoring.
5. Section 5: elimination, top five, why each could win, strongest challenger.
6. Section 6: what is verified, what is inferred, what is hypothesis, what is
   unresolved.
7. Section 7: source list.

Labels used throughout:
- **[V]** verified finding from a research source (abstract or full text).
- **[I]** my product-design inference from the evidence.
- **[H]** hypothesis that would need testing or more evidence.
- **[?]** unresolved question.

---

## 1. Constraints as tests

Every candidate is later checked against six tests derived from the brief and
rules:

| Test | Pass condition |
|---|---|
| T1 Learner-problem | One learner defined by prerequisite ability and observable behavior; one precise misconception or barrier; consequence for later math is documented. |
| T2 Research | Curriculum expectation, observed learner behavior, and at least some intervention evidence exist; population/country limits are stated; disconfirming evidence was sought. |
| T3 Mechanic | The essential game action is the mathematics. A themed multiple-choice quiz fails. |
| T4 AI | AI has a product responsibility that deterministic rules cannot do as well; deterministic math stays the correctness source of truth; a safe fallback exists. |
| T5 Safety | No real student data, no child testing assumed, no biometric/affect inference, no face/voice retention; works with synthetic profiles and adult demo operators. |
| T6 Demo | A viewer sees misconception, targeted support, self-correction, and transfer inside three minutes without narration doing the work. |

Additional practical filter (not from the brief, stated openly): the entry
period closes 2026-09-18, eleven days from this report, for a single entrant.
Feasibility is therefore scored, but it is the last criterion, not the first.

---

## 2. Cross-cutting findings

### 2.1 Curriculum expectations (where topics sit, and why "K-5" is not one age)

[V] Common Core (US): two-digit place value and addition within 100 with
place-value strategies in Grade 1; fluent add/subtract within 100 and regrouping
in Grade 2 (2.NBT.5); multiplication/division concepts and fractions as numbers
in Grade 3; fraction equivalence, decimal notation to hundredths and decimal
comparison in Grade 4; decimal operations to hundredths in Grade 5.
[V] England: fractions as numbers and hundredths in Year 4; decimals to three
places in Year 5.
[V] India (NCERT/CBSE): multiplication introduced as repeated addition from
Class 1-2; place value beyond 1000 and its role in algorithms in Class 5;
fractions and decimals in Classes 4-5 (abstract-level, secondary syllabus
summaries; verify against NCERT textbooks).
[V] Subtraction algorithms differ by country and era: decomposition
("borrowing") dominates the US and Germany; equal additions dominated France,
Italy, England historically; the Austrian (additive) method is used in parts of
Europe. Any regrouping game must not hard-code one written algorithm as "the"
method.
[V] Number-word structure differs: Chinese/Japanese/Vietnamese number words are
base-ten transparent; English has opaque teens; German and Dutch invert tens and
units (24 = "four-and-twenty"), producing about half of first-graders'
transcoding errors in German; Hindi number words to 99 are largely irregular.
[V] Decimal separators differ (point vs comma) across countries.
[I] A core mechanic can be geography-neutral only if it operates on quantities
and positions, not on a written algorithm or on number words. Language,
notation, and algorithm variants must be configuration, not core.

### 2.2 Observed learner behavior (what errors look like and how stable they are)

[V] Early quantity: many 3-4-year-olds recite counts without cardinal meaning;
subitizing ability predicts cardinality-principle acquisition; "label-first,
then count" instruction was most effective in one study (abstract-level).
[V] Whole-number magnitude: preschool/K children's number-line placements are
compressed; feedback and linear board games improve estimation. Disconfirming:
the "log-to-linear shift" is contested by proportion-judgment accounts (Barth &
Paladino), and a 2023 preschool training study found number-comparison
training, not number-line training, improved symbolic approximate arithmetic.
[V] Place value: Ross found many Grade 2-5 children could not say what the tens
digit represents in a two-digit number; a five-level place-value model
(Herzog/Ehlert/Fritz) has been validated in Germany, South Africa, and Turkey.
Transcoding (spoken to written) error rates are roughly 49-54% at age 6 and
16-36% at age 8, mostly syntactic (writing 1003 for 103) (abstract-level).
[V] Multi-digit subtraction: "smaller-from-larger" is the most common bug across
decades of studies (Brown & Burton, VanLehn); in one US study 25-31% of children
with math difficulty showed it versus 9% of controls; a Spanish study analyzed
7,140 subtractions from 357 pupils aged 7-13 with the same bug taxonomy.
[V] Addition regrouping: writing the whole column sum (27 + 15 = 312) is a
recognized bug; one large Grade 4-5 study reported that 78% of addition errors
were systematic and 48% place-value related (abstract-level; country unclear).
[V] Equal sign: most US Grades 1-6 students treat "=" operationally; only
around half of Grade 3 students in one study went beyond operational;
Chinese and South Korean students perform markedly better, attributed to
textbook treatment. Operational understanding predicts poorer equation solving
later, even controlling for ability.
[V] Compare word problems: "how many more" problems with unknown referent set
are hardest; relational-terminology understanding mediates intervention
effects (Fuchs).
[V] Multiplication: children hold a robust repeated-addition/equal-groups
conception; this supports distributivity but constrains commutativity
(Sweden); arrays make commutativity visible but some children cannot see equal
groups in arrays (UK).
[V] Division with remainder: many students give non-realistic answers (e.g.,
"13 1/3 buses"); Grade 3 children using models sometimes outperform older
children using the algorithm; replicated with Grade 4 Mexican and Spanish
secondary students.
[V] Fractions: whole-number bias (adding numerators and denominators, "1/8 is
bigger than 1/3 because 8 > 3") is present in Grade 4 and decreases only slowly
to Grade 8; fraction magnitude knowledge predicts later achievement across three
continents (US, China, Belgium).
[V] Partitioning: kindergarten children use "half" to mean "cut" and accept
unequal parts (Canada); replicated with 7-8-year-olds (Australia).
[V] Decimals: "longer is larger" (0.45 > 0.8) is the most prevalent decimal
misconception; in an Australian sample of 5,383 students fewer than 70% of Year
10 students could reliably compare decimals; it appears from Year 4 and is
persistent. Earlier work (Resnick et al., 1989) found the same rules in the US,
France, and Israel.
[V] Ruler/measurement: children count hatch marks rather than intervals; the
error surfaces when the object is not aligned at zero; cross-national
longitudinal data exist.
[V] Additive/multiplicative confusion: Grades 4-6 are dominantly additive
reasoners and later overuse proportional reasoning (Belgium).

### 2.3 Intervention evidence (what actually moves learning, and its limits)

[V] Early numeracy interventions for low-performing PK-1 children: mean g =
0.64 (Nelson & McMaster, 2019); counting with one-to-one correspondence and
short (<= 8 weeks) programs did best. A 2025 synthesis found computer-game
counting interventions *without* instructional strategies had no significant
effect on preschoolers; modeling, guided practice, feedback, and multiple
representations did.
[V] Linear number board games: original studies showed strong gains for
low-income US preschoolers; a 2025 meta-analysis of 18 PK-2 studies gives a
modest pooled g = 0.21, with dosage, opponent, control condition, and board
characteristics as moderators. Effects are real but smaller than the headline
studies.
[V] Number-line training: Calcularis (Switzerland; Bayesian-network student
model) improved arithmetic and number-line estimation in dyscalculic Grade 2-5
children (g about 0.44-0.55), stable at 3 months; benefits were smaller for
children with high math anxiety or comorbid reading disorder.
[V] Number Race vs Graphogame-Math (Finland): both improved number comparison
only, gains in arithmetic did not hold over time. Caution for "number sense"
games.
[V] Base-ten blocks approach (Fuson & Briars): Grade 1-2 classes reached
meaningful multi-digit addition/subtraction; CRA sequences are effective for
regrouping in students with math difficulty.
[V] Strategic counting instruction plus deliberate practice improved number
combination fluency and transferred to procedural calculation in Grade 3
children with math difficulty (Fuchs, 2010). Fact-fluency interventions overall:
g about 0.76 in a 2024 meta-analysis (abstract-level).
[V] Equal sign: practicing problems in nontraditional formats (e.g., "__ = 9 +
8") improved understanding more than traditional formats or no practice
(McNeil); comparing with inequality symbols and "substitution" framings also
help.
[V] Word problems: schema-based instruction with embedded relational-language
instruction outperformed schema-only instruction (Fuchs).
[V] Inverse relation: explicit teaching of inversion helped 8-year-olds strongly
and 5-year-olds only partially (UK); concrete representations transferred better
for low prior knowledge.
[V] Fractions: Fraction Face-Off (US Grade 4 at-risk; five RCTs; ES about 0.64
on number-line and fraction outcomes); Motion Math (US; ~15% test gain after 5 x
20 min); Fraction Ball (US, Kosovo, Mexico; six experimental studies); Slice
Fractions (Quebec Grade 3; reached Grade 4 level after ~3 hours). The IES
practice guide recommends number lines as the central representation.
[V] Decimals: interactive erroneous examples produced better *delayed* test
scores than problem solving in 390 US middle schoolers (no immediate
difference); the Decimal Point game beat a conventional tutor (d = 0.43
immediate, 0.37 delayed).
[V] Feedback in computer environments: elaborated feedback (explanations) d =
0.49 vs correctness-only 0.05; larger in mathematics; delayed feedback hurts.
[V] Comparing solution methods helps students with some prior knowledge; for
novices only when paced slowly; classroom RCT of the materials showed no gain
because teachers used them rarely.
[V] Virtual manipulatives: moderate pooled effect (0.34) vs other instruction.
[V] Digital math games K-12: small-to-medium pooled effect (d about 0.37,
Byun & Joung), from only 17 analyzable studies.
[V] Ruler misconception: a 2024 study found disconfirming evidence (measuring
with shifted rulers) overturned the hatch-mark misconception.
[I] Across domains, the interventions that work share four ingredients:
a visible magnitude/structure representation, explicit modeling of the target
strategy, immediate elaborated feedback, and short spaced sessions. A game loop
should be judged on whether it contains all four, not on its theme.

### 2.4 AI-role evidence (what deterministic systems already do, and what only AI adds)

[V] Rule-based diagnosis of procedural bugs in subtraction dates to
BUGGY/DEBUGGY (1978-1982); MalruleLib (2026) provides large-scale executable
misconception rules with step traces. Deterministic diagnosis of structured
errors is a solved, cheap problem.
[V] Elo/IRT adaptive practice (Math Garden, 3,648 children, 3.5M items) works
with only correctness and response time; no LLM needed for difficulty
adaptation.
[V] Bayesian knowledge tracing suffers a cold-start problem with few
observations; a single demo session gives 10-30 observations, so any "learner
model" claim must be modest.
[V] LLMs diagnose student errors reasonably when constrained by topic (up to
~84% precision on an algebra benchmark) but hallucinate misconceptions when
unconstrained; LLM hints are ~75% accurate in some settings and sometimes
misleading. ChatGPT-family models have been evaluated on decimal feedback with
mixed accuracy.
[V] Elaborated feedback is the highest-value feedback type; hint abuse and
help avoidance affect 10-40% of students in tutors, so free hints need gating.
[V] Child speech recognition has 2-5x adult word error rates, worst at ages
4-7; non-identifying speech input is permitted by the rules but is unreliable
for K-2 and would need a typed fallback.
[I] The genuine AI responsibilities that deterministic rules cannot do well are:
(a) interpreting a learner's free-form explanation of *why* they made a move
(typed, or spoken for older children), to separate a conceptual misconception
from a slip or a guess; (b) generating situation-rich, language-appropriate
problem contexts and "peer" explanations tuned to the learner's own stated
rule; (c) choosing a bridging analogy or contrasting case from the learner's
history. Everything else (correctness, bug matching on structured actions,
difficulty, mastery gating, spacing) should be deterministic.
[I] AI-washing test used below: if the candidate's meaningful adaptation is
fully achievable with a bug library plus an Elo-style difficulty rule, the AI
claim fails unless the loop *requires* natural-language reasoning about the
learner's thinking or about the situation.

---

## 3. Candidate learning loops (15)

Format for each: target learner; misconception; consequence; evidence and
limits; revealing action; representation; core mechanic; three-level
feedback; mastery and transfer; deterministic responsibility; genuine AI
responsibility; fallback; three-minute demo; strongest reason to reject.

### C1. "Exactly N": cardinality from counting (Pre-K/K)

- Target learner: age 3-5, can recite number words to 10 and subitize 1-3, but
  when asked to "give five" grabs a handful or keeps counting ("subset-knower").
- Misconception/barrier: counting is a recitation ritual; the last word said is
  not understood as the size of the set.
- Consequence: cardinality is the gateway to all later arithmetic; early
  numeracy predicts later achievement; interventions here have the largest
  effects of any early-numeracy content (Nelson & McMaster).
- Evidence and limits: strong developmental literature (Give-N, Wynn); recent
  instruction comparisons (label-first vs count-first). Mostly US/European
  preschool samples; number-word irregularity (Hindi, German) changes the
  difficulty of the count list itself.
- Revealing action: creature asks for exactly N snacks; learner drags items
  into its bowl; a subset-knower over- or under-delivers for N > their level.
- Representation: physical set plus a growing "count strip" that highlights the
  last-counted item.
- Core mechanic: feeding/packing exact quantities under playful pressure
  (creature refuses wrong amounts; too many spill).
- Feedback levels: (1) creature counts back the bowl aloud and stops at the
  last item; (2) items snap into a five-frame so the last item is visible; (3)
  guided "count then say the last word again" with the learner tapping each.
- Mastery/transfer: Give-N titration (Wynn's method) shows knower-level rising;
  transfer to "how many" on novel item types and to N+1 requests.
- Deterministic responsibility: knower-level titration, set correctness,
  five-frame rendering, session pacing.
- Genuine AI responsibility: weak. Possibly generating varied verbal prompts in
  the learner's language, or interpreting spoken counting (but ASR at ages 3-5
  is the least reliable band).
- Fallback: fully deterministic loop is complete without AI.
- Demo: creature asks for 4, learner gives 6, feedback shows last-word rule,
  learner gives 4, then 5 with a new item type.
- Strongest reason to reject: AI-washing risk is maximal; the whole meaningful
  adaptation is Wynn's titration rule. Also pre-readers cannot type
  explanations, removing AI's main role.

### C2. "Where does 64 live?": whole-number magnitude on a line (K-2)

- Target learner: age 5-7, counts and reads numerals to 100, but places 20
  near the middle of a 0-100 line and cannot say whether 64 is nearer 50 or
  100.
- Misconception/barrier: compressed magnitude representation and/or landmark
  misuse (counting tick marks, ignoring the scale).
- Consequence: number-line estimation predicts arithmetic learning and
  achievement in Grades 1-4; Booth & Siegler showed magnitude presentation
  improved addition learning.
- Evidence and limits: Siegler & Ramani (US low-income preschoolers), Whyte &
  Bull (UK), Elofsson (Sweden), Calcularis (Switzerland). Disconfirming: 2025
  meta-analysis pooled g = 0.21; 2023 preschool study favored comparison
  training over number-line training for arithmetic; the representational-shift
  theory is contested. So the *task* is diagnostic, but the *training* effect
  is modest and mechanism-uncertain.
- Revealing action: launch a character to a target number on an unmarked line;
  the landing spot is the learner's estimate.
- Representation: bounded 0-100 (later 0-1000) number line with optional
  midpoint landmark; true position revealed after each throw.
- Core mechanic: estimation-to-land (frog jump, zipline) where accuracy, not
  speed, scores; the line range expands with mastery.
- Feedback levels: (1) show true spot and distance; (2) reveal the midpoint and
  ask "more or less than 50?"; (3) count-by-tens ladder overlaid.
- Mastery/transfer: percent absolute error falling below a threshold on
  untrained numbers; transfer to magnitude comparison and approximate sums
  ("about where does 30 + 40 land?").
- Deterministic responsibility: error scoring, range expansion, landmark
  scaffolds, fitting the learner's bias curve.
- Genuine AI responsibility: weak. Fitting a bias curve is statistics, not AI.
  Possible role: narrating the learner's own pattern ("you always land too far
  right for numbers above 50") in child-friendly language.
- Fallback: fully deterministic.
- Demo: learner places 20 at midpoint, feedback, three more throws, error
  shrinks, then a fresh 0-1000 line shows the strategy transferring.
- Strongest reason to reject: a well-known mechanic (Calcularis, Math Garden,
  many apps); modest training effect; AI role decorative.

### C3. "What does the 1 in 16 mean?": digit meaning and unitizing (Grades 1-2)

- Target learner: age 6-8, reads and writes two-digit numbers, counts by tens,
  but when shown 16 objects and asked what the "1" stands for, circles one
  object (or says "one").
- Misconception: digits are treated as concatenated single-digit counts; the
  ten is not a unit.
- Consequence: without unitizing tens, regrouping in addition/subtraction is
  learned as a symbol trick; place-value understanding explains number-writing
  and predicts arithmetic (Germany).
- Evidence and limits: Ross (US Grades 2-5), Herzog/Fritz five-level model
  validated in Germany, South Africa, Turkey; Miura's language effects
  (Asian-language speakers form canonical tens-and-ones representations
  earlier); Hindi irregular number names likely slow the mapping (limited
  direct research). Prevalence rates vary a lot by sample.
- Revealing action: asked to pack 16 loose sticks for shipping where boxes hold
  exactly ten, then to "point to what the 1 means" on the label.
- Representation: loose units and ten-bundles that can be built and broken;
  digit cards that update live as bundles change.
- Core mechanic: packing/unpacking to fulfil orders (the warehouse only ships
  full tens and loose ones); larger orders need hundreds crates.
- Feedback levels: (1) label highlights the tens digit while the bundle glows;
  (2) count the bundle by ones to show it is ten; (3) "make it with only ones,
  now with tens" side-by-side.
- Mastery/transfer: correct digit-to-quantity mapping on novel numbers; non-
  canonical representations (16 = 0 tens 16 ones = 1 ten 6 ones); transfer to
  "how many tens in 130".
- Deterministic responsibility: quantity/label consistency, level progression
  along the validated five-level model, order generation.
- Genuine AI responsibility: moderate. Interpreting the learner's typed
  explanation of what a digit means; generating number-word variants for the
  configured language (English teens, Hindi names) to *expose* rather than hide
  language irregularity.
- Fallback: deterministic loop plus templated explanations.
- Demo: learner points to one stick for the "1", warehouse refuses, bundling
  reveals the ten, learner relabels, then solves 23 + 10 by adding a box.
- Strongest reason to reject: the diagnostic interview task is a known research
  probe, not a game; explanations from 6-year-olds are thin; AI role is
  add-on. Also overlaps heavily with C6/C7.

### C4. "Say it, build it": listening-to-writing number transcoding (Grades 1-2) [wildcard: language]

- Target learner: age 6-8, hears "one hundred two" and writes 1002; or in
  inversion languages writes 45 for "four-and-fifty".
- Misconception: number words are written left-to-right as heard
  (syntactic transcoding error); the zero placeholder is absent.
- Consequence: transcoding mediates the working-memory to arithmetic link;
  error rates of 16-54% at ages 6-8; errors propagate into column arithmetic.
- Evidence and limits: strong cognitive literature (Power & Dal Martello; Zuber
  et al.; Steiner et al.) but heavily language-dependent: inversion languages
  (German, Dutch), opaque teens (English), irregular names (Hindi), transparent
  (Vietnamese, Chinese). The core problem is real everywhere, but its shape is
  local.
- Revealing action: an audio order ("send one hundred two") must be built with
  arrow (Gattegno) place-value cards; a wrong build ships the wrong quantity.
- Representation: overlapping place-value cards (100 + 2 -> 102) with a
  quantity display that the built number produces.
- Core mechanic: dispatch center; hear, build, ship; quantity mismatch is
  visible (the truck shows 1002 crates instead of 102).
- Feedback levels: (1) quantity mismatch shown; (2) cards separate into
  hundreds/tens/ones with the spoken chunks; (3) the number is spoken again in
  chunks while cards slide.
- Mastery/transfer: novel numbers with internal zeros; reverse task (write ->
  say via multiple-choice audio); transfer to reading numbers on a number line.
- Deterministic responsibility: card algebra, quantity rendering, error
  classification (lexical vs syntactic).
- Genuine AI responsibility: text-to-speech in multiple languages/number
  systems and, for older learners, non-identifying speech recognition of number
  words. Both are AI services, but not learner-reasoning AI.
- Fallback: text prompts instead of audio.
- Demo: hear 102, build 1002, truck overflows, cards split, rebuild, then 340.
- Strongest reason to reject: the mechanic is language-bound at its core, which
  contradicts "geography-neutral core"; child ASR is unreliable at this age;
  AI contribution is a service, not judgment.

### C5. "Fill the tray first": from counting-all to bridging ten (Grade 1)

- Target learner: age 6-7, solves 9 + 5 by counting all or counting on with
  fingers, slow and error-prone above 10; knows partners of 10 unreliably.
- Barrier (not a misconception): no decomposition strategy; every sum is a
  fresh count.
- Consequence: fact retrieval builds from efficient strategies (Siegler's
  overlapping waves); strategic counting plus practice transfers to procedural
  calculation; fluency interventions have large effects.
- Evidence and limits: Fuchs 2010 (US, Grade 3 with math difficulty); Swedish
  structural-approach study (Grade 1, 8 months); Japanese/Singapore curricula
  teach make-ten explicitly (curriculum fact, not evaluated here); a 2024
  meta-analysis of fact fluency (g about 0.76, abstract-level). Most evidence is
  US clinical samples; classroom generalization varies.
- Revealing action: add 9 + 5 by moving counters onto a double ten-frame; the
  system observes whether the learner fills the first frame before placing the
  rest.
- Representation: double ten-frame with counters; a number sentence rewriting
  itself (9 + 5 = 9 + 1 + 4 = 10 + 4).
- Core mechanic: loading trays onto a conveyor that only accepts full trays
  first; speed matters mildly, structure matters more.
- Feedback levels: (1) tray highlights the gap to ten; (2) one counter jumps
  across automatically and the sentence rewrites; (3) partner-of-ten flash.
- Mastery/transfer: strategy use inferred from move order and latency; transfer
  to 8 + 7, to 19 + 5, and to subtraction 14 - 9 via the same frame.
- Deterministic responsibility: move-order strategy detection, latency model,
  spacing schedule.
- Genuine AI responsibility: weak-moderate. Strategy detection is deterministic
  from moves. AI could explain the learner's own move sequence back to them.
- Fallback: fully deterministic.
- Demo: learner counts all on 9 + 5, tray hint, learner fills ten first, then
  18 + 7 using the same move, response time drops.
- Strongest reason to reject: it is a strategy-training loop rather than a
  misconception loop; risk of becoming a fluency drill; AI role thin.

### C6. "Ten ones become a ten": addition regrouping (Grade 2)

- Target learner: age 7-8, adds single digits fluently, knows tens and ones,
  writes 27 + 15 = 312 or 32 without carrying (drops the ten).
- Misconception: column sums are written whole; the composed ten is not
  re-placed as a unit.
- Consequence: regrouping is where symbolic arithmetic first diverges from
  quantity; systematic errors are the majority of addition errors in Grades
  4-5 samples.
- Evidence and limits: bug taxonomies (Brown & Burton); Fuson & Briars base-ten
  approach (US Grades 1-2); CRA evidence for students with math difficulty;
  game-based place-value teaching RCT with d = 0.75 (single small study,
  abstract-level, country not confirmed). Algorithm notation differs by country
  (where the carried 1 is written); the mechanic should avoid the written
  layout.
- Revealing action: combine two piles (27 and 15) into one order; the ones tray
  overflows at ten; learner must decide what to do with the overflow.
- Representation: ones tray (capacity 10) that visibly overflows; bundling
  animation to a ten rod; digit display updates from quantities.
- Core mechanic: merging shipments; the ones tray cannot hold 12; the learner
  must bundle to proceed.
- Feedback levels: (1) tray overflow warning; (2) bundle-ten affordance
  highlighted; (3) side-by-side quantity vs symbol trace.
- Mastery/transfer: correct sums with regrouping on novel pairs; three-digit
  transfer; explaining "where did the 1 go".
- Deterministic responsibility: bug matching (no-carry, write-both-digits,
  carry-to-wrong-column), quantity/symbol consistency, difficulty.
- Genuine AI responsibility: weak-moderate; same as C7.
- Fallback: fully deterministic.
- Demo: 27 + 15 -> 312, overflow, bundle, 42, then 58 + 36.
- Strongest reason to reject: easier and less diagnostic than subtraction (the
  "312" bug is quickly self-evident to most children once quantities are
  shown); overlaps with C7 and is the weaker twin.

### C7. "You can't take 7 from 2": subtraction smaller-from-larger (Grades 2-3)

- Target learner: age 7-9, subtracts single digits fluently, can bundle tens,
  but computes 42 - 17 = 35 by subtracting the smaller digit from the larger in
  each column.
- Misconception: columns are independent single-digit subtractions;
  subtraction is thought commutative within a column; the ten is not a
  breakable unit.
- Consequence: the most common subtraction bug across four decades; strongly
  over-represented in children with math difficulty; blocks multi-digit
  subtraction, then money, time, and later decimal subtraction. In India only
  about a third of rural Class 3 children could solve a subtraction item (ASER
  2024), making this problem locally consequential as well.
- Evidence and limits: Brown & Burton / VanLehn (US, ~1,000 Grades 3-5); MD
  study (US); Spanish sample of 7,140 subtractions; German diagnostic-item
  study for bridging errors. Intervention: base-ten blocks approach (Fuson &
  Briars), CRA. Limits: bug instability (children switch bugs between
  sessions), algorithm variants by country (decomposition vs equal additions vs
  Austrian), and most bug data are from written work, not manipulatives.
- Revealing action: the learner must physically remove 17 from 42 built as 4
  rods and 2 units; removing 7 units from 2 is impossible on screen, so the
  learner either unbundles a rod or tries to remove units from the rods
  directly (which reveals the "take smaller from larger" or "borrow from the
  wrong place" thinking).
- Representation: rods and units with an unbundle gesture; a live symbol trace
  that records the quantity moves without prescribing a written algorithm.
- Core mechanic: "customer returns / take-away" or "defend the wall": remove an
  exact quantity from a structure under a rule that only full units can be
  removed and rods must be broken to release units.
- Feedback levels: (1) the drag of 7 units from 2 fails with a visible
  shortfall of 5; (2) the rod's break affordance pulses ("open a ten"); (3) a
  worked contrast: 42 - 17 side-by-side with 47 - 12, asking which one needed
  breaking and why.
- Mastery/transfer: three consecutive novel items with regrouping and zero
  bugs; transfer to subtraction across zero (300 - 47) and to a "which is
  bigger, 42 - 17 or 47 - 12" magnitude check; retention on a spaced re-test
  inside the demo.
- Deterministic responsibility: full bug library (smaller-from-larger, borrow-
  from-zero, borrow-no-decrement, and so on), quantity truth, difficulty
  ladder, spacing.
- Genuine AI responsibility: interpreting the learner's explanation after a
  failed move ("I did 7 take away 2") to distinguish the commutativity
  misconception from a slip, then generating a contrasting pair and a short
  explanation in the learner's language that references the learner's own
  words. Constrained by the bug library so it cannot invent a diagnosis.
- Fallback: bug library plus templated explanations; the loop is complete
  without AI.
- Demo: learner types 35; blocks; drag fails; learner explains "7 minus 2 is
  5"; AI restates the confusion and shows the contrast pair; learner breaks a
  rod; correct; then 300 - 47 succeeds with the same move.
- Strongest reason to reject: the diagnosis has been deterministic since 1982;
  AI's role is confined to explanation handling, which judges may read as a
  chatbot bolted onto a manipulative.

### C8. "Both sides the same": equal sign as balance (Grades 1-3)

- Target learner: age 6-9, adds within 20 fluently, answers 8 + 4 = __ + 5
  with 12 (or 17).
- Misconception: "=" means "the answer comes next" (operational), not
  "same value on both sides" (relational).
- Consequence: operational understanding predicts poorer equation solving
  in middle school even after controlling for ability; this is the algebra
  gateway inside arithmetic.
- Evidence and limits: extensive US work (McNeil, Alibali, Knuth); prevalence
  differs by country (Chinese Grade 1 students already 55% correct on a + b =
  c + __; Korean students also stronger), attributed to textbook sequencing.
  Intervention evidence: nontraditional formats, inequality comparisons,
  substitution framing. Limit: in countries where textbooks already teach
  relational meaning early, the problem is smaller; a demo must state the
  learner profile explicitly.
- Revealing action: balance a scale by placing weights; the learner who thinks
  operationally puts 12 on the right pan of 8 + 4 = __ + 5 and the scale tips.
- Representation: two-pan balance with numbered weights; the tilt is
  proportional to the difference.
- Core mechanic: balancing loads to cross a bridge; both sides must be equal or
  the bridge tilts; formats rotate (__ = 9 + 8; 6 + 3 = __ + 4; 5 + 5 = 10 +
  __).
- Feedback levels: (1) scale tilts and shows the difference; (2) each pan's
  total is displayed; (3) the "5" on the right glows and asks "the right pan
  already has 5; how many more to match 12?".
- Mastery/transfer: correct on all three nontraditional formats; transfer to
  missing-addend equations (5 + __ = 9, where operational learners answer 14)
  and to a two-step balance (3 + 4 + 2 = 3 + __).
- Deterministic responsibility: balance physics, format rotation, operational-
  response detection (12 or 17 on 8 + 4 = __ + 5 are diagnostic), spacing.
- Genuine AI responsibility: moderate-strong. The learner is asked "why does
  12 go there?"; the AI classifies the typed explanation as operational,
  relational, or unclear (constrained to those labels), and chooses the next
  format and a bridging prompt accordingly. Distinguishing "12 because 8 + 4"
  from "12 because I guessed" changes the next move.
- Fallback: deterministic detection from the numeric response alone.
- Demo: 12 placed, bridge tilts, explanation typed, AI response, learner
  places 7, then solves 5 + __ = 9 and __ = 9 + 8 correctly.
- Strongest reason to reject: prevalence varies by curriculum; the balance
  metaphor is well known; some researchers note that "sameness" vs
  "substitution" are separate components and one metaphor may not carry both.

### C9. "How many more?": compare situations and relational language (Grades 1-2)

- Target learner: age 6-8, adds and subtracts within 20, but for "Ana has 8,
  Ben has 5, how many more does Ana have?" answers 13 because "more means
  add".
- Misconception: keyword-driven operation choice; no model of the difference
  as a quantity.
- Consequence: compare problems are the hardest additive-structure problems;
  relational-terminology understanding mediates intervention effects; this
  feeds directly into later "times as many" and ratio confusions.
- Evidence and limits: Riley & Greeno (US); Fuchs schema-based instruction RCTs
  (US Grades 2-3, mostly students with math difficulty); relational terms and
  their difficulty differ by language ("more than" vs "fewer than" has no
  symmetric form in some languages); reading load is high for Grade 1.
- Revealing action: the learner builds two bars (8 and 5) and must shade or
  cut the part that answers the question; an "add" learner builds a 13 bar.
- Representation: comparison bar model (two aligned bars; the difference is
  the uncovered part).
- Core mechanic: "match the towers": build, align, and read off the gap to
  deliver a package of exactly that size; wrong size does not fit.
- Feedback levels: (1) the delivered package does not fit the gap; (2) bars
  align automatically and the gap is outlined; (3) the sentence is re-read with
  the roles highlighted ("Ana ... more than Ben").
- Mastery/transfer: all three compare subtypes (difference unknown, compared
  unknown, referent unknown) at criterion; transfer to "fewer" wording and to a
  novel context.
- Deterministic responsibility: bar geometry, subtype scheduling, answer
  correctness.
- Genuine AI responsibility: strong and intrinsic. Generating varied
  situations in the learner's language with controlled relational terms;
  parsing the learner's own retelling ("who has more?") to locate the
  misreading; checking that the learner's built model matches the text, which
  requires reading the text semantically.
- Fallback: a fixed bank of authored problems and templated retelling.
- Demo: 8 and 5, learner builds 13, package does not fit, bars align, gap of
  3, learner retells, then a "fewer" problem and a referent-unknown problem.
- Strongest reason to reject: heavy on reading and language for the youngest
  band; the mechanic is a word-problem trainer more than an arithmetic game;
  language variants make the "geography-neutral core" claim weaker.

### C10. "Rows and columns": equal groups, arrays, commutativity (Grades 2-3)

- Target learner: age 7-9, can skip-count and add repeatedly, but computes 4 x
  6 by counting 24 ones, cannot use 6 x 4 when 4 x 6 is unknown, and sees 3 x 4
  and 4 x 3 as different problems.
- Misconception/barrier: multiplication is "add this number that many times"
  only; no structure-based view; commutativity is not seen.
- Consequence: the repeated-addition-only conception later constrains
  multi-digit and decimal multiplication (Sweden) and underlies "multiplication
  makes bigger".
- Evidence and limits: Barmby et al. (UK), Larsson et al. (Sweden, longitudinal
  case studies), Kim (Korea, Grade 3); mostly small qualitative samples;
  intervention evidence for arrays specifically is thin at the RCT level.
- Revealing action: tile a rectangular floor 4 by 6; a learner who counts by
  ones is detected by move pattern; then asked to tile 6 by 4 with the same
  tiles: does the learner rotate or rebuild?
- Representation: array with row/column highlighting; rotation animation
  showing the same tiles.
- Core mechanic: tiling and packing rectangles; bonus for reusing a known
  array by rotation or by splitting (distributivity).
- Feedback levels: (1) row highlight with count-by-rows; (2) rotate the array
  to show 6 x 4; (3) split into (4 x 5) + (4 x 1).
- Mastery/transfer: solves unknown facts via commuted or split known facts;
  transfer to area of a 7 by 8 room without tiles shown.
- Deterministic responsibility: move-pattern strategy detection, array truth,
  fact scheduling.
- Genuine AI responsibility: moderate. Interpreting "why is 4 x 6 the same as
  6 x 4?" explanations; generating context stories for arrays.
- Fallback: deterministic.
- Demo: counts by ones, rotate hint, solves 6 x 4 instantly, splits 7 x 8.
- Strongest reason to reject: the misconception is diffuse (a conception, not a
  crisp error), so the "aha" is less visible in three minutes; AI role modest.

### C11. "What about the leftover?": division with remainder sense-making (Grades 3-4) [wildcard: reasoning-in-context]

- Target learner: age 8-10, can divide with a remainder procedurally (17 / 5 =
  3 r 2) but answers "3 r 2 buses" or "3.4 buses" to a real situation.
- Misconception/barrier: the remainder is treated as a notation, not a quantity
  that must go somewhere; the answer is not checked against the situation.
- Consequence: sense-making failures persist into secondary school (US bus
  problem; Spain); they undermine measurement, money, and later modelling.
- Evidence and limits: Silver et al. (US middle school), Grade 3 model-based
  successes (US), Grade 4 Mexico, Spain secondary. Intervention evidence is
  mostly instructional-design recommendations (delay the algorithm, use
  contexts), not RCTs. Contexts are culture-bound (buses vs auto-rickshaws;
  sharing rotis vs pizzas); K-5 fit is Grades 3-5 only.
- Revealing action: the learner loads 17 people into 5-seat vehicles and must
  press "go"; two people are left on the platform; the learner must decide:
  add a vehicle (round up), leave them (round down), or share (fraction), and
  the situation determines which is right.
- Representation: discrete objects packed into containers, with the remainder
  physically visible.
- Core mechanic: dispatch/packing puzzles where the situation (people, ribbon,
  money, cookies) changes what the leftover means; the vehicle will not leave
  until the leftover is handled sensibly.
- Feedback levels: (1) the leftover objects blink; (2) the three interpretations
  are shown as choices with consequences animated; (3) a contrasting situation
  with the same numbers.
- Mastery/transfer: correct interpretation across the three remainder types on
  novel contexts; transfer to a written problem without objects.
- Deterministic responsibility: quotient/remainder truth, packing animation,
  interpretation-type labels for each authored situation.
- Genuine AI responsibility: strong and intrinsic. Generating fresh situations
  with a known interpretation type; judging the learner's typed justification
  ("we need 4 buses because 2 people can't stay") against the situation;
  adapting contexts to the learner's locale (configured, not inferred).
- Fallback: an authored situation bank with deterministic interpretation
  labels.
- Demo: 17 / 5 -> "3 r 2 buses"; platform shows 2 people; learner adds a bus;
  same numbers with ribbon -> 3 pieces and a scrap; then a cookie-sharing case
  needing 3 and 2/5.
- Strongest reason to reject: less "foundational arithmetic" than the brief's
  emphasis; the misconception is about interpretation rather than computation;
  AI judging free-text justifications from 9-year-olds risks unfair
  misclassification.

### C12. "Which is bigger, 1/3 or 1/4?": fraction magnitude and whole-number bias (Grades 3-4)

- Target learner: age 8-10, can name fractions from area pictures and knows
  whole-number order, but says 1/4 > 1/3 "because 4 is bigger", places 1/2 at
  the same spot on a 0-1 and a 0-2 line, and adds 1/8 + 1/8 = 2/16.
- Misconception: whole-number bias; fractions are two whole numbers, not one
  magnitude; the unit is ignored.
- Consequence: fraction magnitude knowledge in Grade 4-5 predicts algebra and
  overall achievement years later across the US, China, and Belgium; the bias
  persists to adulthood.
- Evidence and limits: strongest intervention base of any candidate for a game
  mechanic (Fraction Face-Off, Motion Math, Fraction Ball, Slice Fractions,
  IES guide). Limits: most RCTs are US; effect sizes of apps are from short
  studies; Fraction Face-Off is a 12-week tutoring program, not a game; the
  number-line representation itself carries tick-mark and unit misconceptions
  (Grade 3 US study).
- Revealing action: the learner places 1/3 and 1/4 on a 0-1 line to catch
  falling items; placing 1/4 to the right of 1/3 is the whole-number-bias
  signature; a 0-2 line follow-up reveals unit confusion.
- Representation: number line with switchable unit length; optional fraction
  strip overlay that partitions the unit.
- Core mechanic: estimation-to-catch (Motion Math family) plus "unit shifts"
  where the 0-1 segment stretches or the line becomes 0-2 or 0-3.
- Feedback levels: (1) true position shown; (2) unit partition overlay; (3)
  contrasting pair (1/3 vs 1/4 with strips) and "more pieces means smaller
  pieces" prompt.
- Mastery/transfer: placement error below threshold on novel fractions and
  units; transfer to comparison without a line and to a simple sum (1/2 +
  1/4 placed, not computed).
- Deterministic responsibility: error scoring, bias-signature detection
  (systematic right-shift for larger denominators), unit switching, spacing.
- Genuine AI responsibility: moderate. Interpreting "why did you put 1/4
  there?"; generating a bridging story (sharing a chapati among 3 vs 4 people)
  tied to the learner's explanation; choosing the next contrast from the
  learner's history. Detection itself is deterministic.
- Fallback: deterministic loop plus templated contrasts.
- Demo: 1/4 placed right of 1/3, miss, strips overlay, learner explains,
  bridging story, correct on 1/5 vs 1/6, then 0-2 line with 1/2.
- Strongest reason to reject: the mechanic closely resembles existing products
  (Motion Math, Fraction Ball); AI's role is add-on; Grade 3-4 fraction
  timing differs across countries (India introduces fractions later and
  lighter than the US).

### C13. "Fair shares": equal partitioning and the unit fraction (Grades 1-3)

- Target learner: age 6-8, can say "half" and "quarter", but cuts a cake into
  three unequal strips and calls each "a third", and accepts "half" for any cut
  into two.
- Misconception: fraction names refer to the count of pieces, not to equal
  pieces of a whole; "half" means "cut".
- Consequence: without equal-parts understanding, every later fraction idea
  (equivalence, magnitude, operations) is built on sand; the IES guide's first
  recommendation is to build on sharing.
- Evidence and limits: Pothier & Sawada (Canada, kindergarten), Charles & Nason
  (Australia, ages 7-8), sharing-based early fraction research; intervention
  evidence is mostly design-based, with fewer RCTs; area partitioning is
  culturally neutral but the foods are not.
- Revealing action: share one cake among 3 friends by cutting; each friend
  weighs their piece; unequal pieces cause complaints.
- Representation: continuous area (rectangles and circles) with cut tools and
  a visible weighing/overlay comparison of pieces.
- Core mechanic: fair-sharing puzzles with increasing part counts and odd
  numbers (thirds, fifths), multiple wholes, and different whole shapes; pieces
  can be stacked to check equality.
- Feedback levels: (1) friends compare pieces and complain; (2) overlay shows
  the size difference; (3) a fold/guide line suggests where to cut.
- Mastery/transfer: equal parts on odd counts and novel shapes; transfer to
  "which piece is 1/3 of this bar" and to sharing 2 cakes among 3 (quotient
  meaning).
- Deterministic responsibility: area computation, equality tolerance,
  progression by part count and shape.
- Genuine AI responsibility: weak-moderate. Explaining why a cut is unfair
  in the learner's words; generating sharing stories. Detection and feedback
  are geometric.
- Fallback: deterministic.
- Demo: uneven thirds, complaint, overlay, re-cut, then fifths on a circle,
  then two cakes for three.
- Strongest reason to reject: precise free-hand cutting on screen is a motor
  task that can mask the concept; AI role thin.

### C14. "Longer is larger": decimal comparison on a zoomable line (Grades 4-5)

- Target learner: age 9-11, understands whole-number place value and reads
  decimals aloud, but says 0.45 > 0.8 "because 45 is more than 8" (or the
  reverse rule: shorter-is-larger, treating 0.45 as smaller than 0.8 because
  "hundredths are smaller than tenths").
- Misconception: decimals are whole numbers to the right of the point; the
  digits are not tied to positions.
- Consequence: one of the most persistent misconceptions documented in
  mathematics education: in an Australian sample of 5,383 students fewer than
  70% of Year 10 students could reliably compare decimals; it appears when
  decimals are introduced (Year 4) and resists normal instruction; it
  undermines measurement, money with cents/paise, and percentages.
- Evidence and limits: Steinle & Stacey (Australia, longitudinal, Years 4-10);
  Resnick et al. 1989 (US, France, Israel: same rules across countries and
  curricula); Sackur-Grisvard & Leonard (France). Intervention: interactive
  erroneous examples produced better delayed retention than problem solving
  in 390 US middle schoolers; Decimal Point game beat a tutor (d = 0.43
  immediate, 0.37 delayed). Limits: intervention samples are US Grades 6-7,
  older than the K-5 band; K-5 fit is Grade 4-5 only (CCSS 4.NF.7, England
  Year 4-5, India Class 5); decimal separators differ (point/comma) and must
  be configurable.
- Revealing action: the learner sorts decimal "packages" by size onto a
  conveyor and places them on a 0-1 line; placing 0.45 to the right of 0.8 is
  the longer-is-larger signature; placing 0.8 right of 0.45 but 0.799 left of
  0.45 is the shorter-is-larger signature. Steinle & Stacey's Decimal
  Comparison Test already classifies learners into these rule groups from a
  handful of items, so the diagnostic is deterministic and validated.
- Representation: a zoomable number line (0-1, zoom into tenths, then
  hundredths, then thousandths) where zooming shows that 0.8 = 0.80 = 0.800
  sits at the same place while 0.45 stays left of it; optional place-value
  strips.
- Core mechanic: "zoom-and-place": the learner must land a package at its
  decimal address; zooming is the tool for resolving close values; a second
  phase is "find the error": a classmate's sorting is shown and the learner
  must find and fix the wrong placement (erroneous example).
- Feedback levels: (1) true position after zoom-in; (2) 0.8 rewritten as 0.80
  next to 0.45 on the same zoom level; (3) an erroneous example in the
  learner's own rule ("Sam says 0.45 is bigger because 45 > 8"), which the
  learner must correct and explain.
- Mastery/transfer: correct comparisons that violate both length rules
  (0.7 vs 0.65; 0.099 vs 0.1); ordering five decimals; transfer to money
  (0.5 vs 0.45 in rupees/dollars) and to a measurement reading (1.05 m vs
  1.5 m).
- Deterministic responsibility: rule classification (L, S, expert, unclassified)
  from placements, all magnitude truth, zoom rendering, item selection that
  discriminates between rules, spacing and mastery gating.
- Genuine AI responsibility: moderate-strong and pedagogically grounded.
  (a) Generate erroneous examples that use the learner's own inferred rule and,
  where the learner has typed an explanation, their own words, so the "find the
  error" phase targets the actual misconception rather than a generic one.
  (b) Judge the learner's free-text correction and explanation of the
  erroneous example (did they name the positional reason, or just flip the
  answer?), which gates whether the next item is a transfer item or another
  erroneous example. (c) Explain the zoom result in the learner's language.
  All outputs are constrained to the classifier's rule label; the LLM never
  decides which number is larger.
- Fallback: a bank of authored erroneous examples per rule and keyword-based
  explanation checks; the loop remains complete and correct without AI.
- Demo: learner places 0.45 right of 0.8; zoom shows 0.80 vs 0.45; learner
  explains "45 is more"; AI produces Sam's mistake using that logic; learner
  fixes it and types why; then 0.7 vs 0.65 (correct despite length), then
  money transfer. The viewer sees rule -> targeted erroneous example ->
  self-correction -> transfer.
- Strongest reason to reject: it sits at the top edge of K-5 and can look like
  a middle-school topic; the intervention RCTs are Grades 6-7; erroneous
  examples are effective on delayed tests, which a three-minute demo cannot
  show; "foundational arithmetic" reviewers may prefer whole-number topics.

### C15. "Where does the ruler start?": unit intervals in measurement (Grades 1-3) [wildcard: measurement]

- Target learner: age 6-9, can count and read numerals, measures a 4-unit
  object placed from the 2 mark as "6" (reads the end number) or counts hatch
  marks and gets 5.
- Misconception: hatch marks are the units; the ruler is a counting strip
  rather than a scale of intervals from zero.
- Consequence: the same interval/tick confusion undermines whole-number number
  lines (Grade 2-3) and fraction number lines (Grade 3); measurement is a
  curriculum strand in every country.
- Evidence and limits: Solomon et al. (US); a 2024 study showing disconfirming
  evidence (shifted objects, broken rulers) overturns the misconception;
  cross-national longitudinal data (Spain and others). Units differ
  (inches/cm) but the interval concept does not.
- Revealing action: cut a plank to bridge a gap using a ruler whose zero is
  hidden or broken; a plank cut by end-number reading is too long or too short
  and the bridge fails.
- Representation: ruler with movable object; unit tiles that can be laid along
  the object to show intervals.
- Core mechanic: build-to-fit; measurements that read the end number fail
  visibly; broken rulers and shifted starts are the difficulty ladder.
- Feedback levels: (1) the plank does not fit and the gap is shown; (2) unit
  tiles lay along the object; (3) ruler slides so zero aligns, then slides
  back.
- Mastery/transfer: correct with shifted starts and broken rulers; transfer to
  a whole-number number line (how far from 3 to 7) and to a fraction line.
- Deterministic responsibility: geometry, fit check, ruler configurations.
- Genuine AI responsibility: weak. Explanation interpretation only.
- Fallback: deterministic.
- Demo: misread 6, bridge fails, unit tiles, correct 4, broken ruler, then
  number-line distance.
- Strongest reason to reject: judges may not read measurement as "core
  numeracy"; AI role decorative.

### Considered but not expanded (to avoid cosmetic variants)

- "Multiplication makes bigger / division makes smaller" (Grades 5+): evidence
  mostly from older students and preservice teachers; decimal multiplication
  sits at the very top of K-5; folded into C10's consequence.
- Missing-addend / inverse relation (5 + __ = 9 -> 14): folded into C8 as the
  transfer test, since it shares the operational-equal-sign root.
- Additive vs multiplicative overgeneralization (Van Dooren): Grades 4-6 and
  beyond; mostly proportional-reasoning territory outside "foundational
  arithmetic".
- Computational estimation ("is this answer reasonable?"): real curriculum
  gap (UK analysis) but weak misconception specificity; emergence after age 8.
- Zero as placeholder: real but subsumed by C3/C4/C14.
- Fact-fluency drill with spacing: strong effect sizes but it is a practice
  scheduler, not a misconception loop; would be a quiz reskin.
- Erroneous examples and comparison of methods: these are mechanics, not
  concepts; used inside C7, C8, C14.

---

## 4. Neutral selection criteria (defined before scoring)

Each criterion scored 1-5. Weights are equal except where the brief's hard
constraints demand a pass/fail gate (T1-T6 in Section 1). Scores are my
judgment and are stated so they can be disputed.

| Code | Criterion | 5 means |
|---|---|---|
| S1 Problem | Precision and consequence of the misconception | One crisp, observable error with documented long-term cost |
| S2 Evidence | Breadth and quality of learner-behavior and intervention evidence, with multi-country coverage | Replicated across countries with intervention RCTs |
| S3 Mechanic | The essential action is the mathematics; reasoning is visible in play | Wrong thinking produces a visibly wrong game state, not a red X |
| S4 Demo | Misconception -> support -> self-correction -> transfer visible in three minutes | A viewer with no narration would understand the change |
| S5 AI | Genuine, constrained AI responsibility with a deterministic fallback | The loop is better *because* of language reasoning, and safe without it |
| S6 Safety and neutrality | Works with synthetic learners and adult operators; core is geography-neutral; language/notation are configuration | No speech, no child data, no locale hard-coding in core |
| S7 Feasibility | One person, eleven days, deterministic core plus one AI integration | Small state space, few assets, testable offline |

---

## 5. Elimination, top five, challengers

### 5.1 Gate results (T1-T6)

| Candidate | T1 | T2 | T3 | T4 | T5 | T6 | Result |
|---|---|---|---|---|---|---|---|
| C1 Cardinality | pass | pass | pass | **fail** (AI-washing) | pass | pass | eliminated |
| C2 Whole-number line | pass | pass (modest training effect) | pass | **fail** (AI decorative) | pass | pass | eliminated |
| C3 Digit meaning | pass | pass | pass | weak | pass | weak (aha is an interview probe) | eliminated |
| C4 Transcoding | pass | pass | pass | weak (AI is a service) | weak (child ASR) | pass | eliminated |
| C5 Bridging ten | weak (barrier, not misconception) | pass | pass | **fail** | pass | pass | eliminated |
| C6 Addition regrouping | pass | pass | pass | weak | pass | pass | eliminated as weaker twin of C7 |
| C7 Subtraction bug | pass | pass | pass | pass (constrained) | pass | pass | **advances** |
| C8 Equal sign | pass | pass (country-variant prevalence) | pass | pass | pass | pass | **advances** |
| C9 Compare problems | pass | pass | pass | pass (intrinsic) | weak (language-bound core) | weak (reading load) | eliminated, narrowly |
| C10 Arrays | weak (diffuse) | weak (thin RCTs) | pass | weak | pass | weak | eliminated |
| C11 Remainder sense | pass | weak (few RCTs) | pass | pass (intrinsic) | pass | pass | **advances** |
| C12 Fraction magnitude | pass | pass (strongest) | pass | weak-moderate | pass | pass | **advances** |
| C13 Fair shares | pass | weak (design-based) | pass | weak | pass | weak (motor noise) | eliminated |
| C14 Decimal comparison | pass | pass | pass | pass | pass | pass | **advances** |
| C15 Ruler intervals | pass | pass | pass | **fail** | pass | pass | eliminated |

### 5.2 Scores for the five that advanced

| Candidate | S1 | S2 | S3 | S4 | S5 | S6 | S7 | Total /35 |
|---|---|---|---|---|---|---|---|---|
| C14 Decimal comparison | 5 | 4 | 4 | 5 | 4 | 4 | 4 | 30 |
| C7 Subtraction smaller-from-larger | 5 | 5 | 5 | 5 | 3 | 4 | 4 | 31 |
| C12 Fraction magnitude | 5 | 5 | 4 | 4 | 3 | 4 | 4 | 29 |
| C8 Equal sign balance | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 30 |
| C11 Remainder sense-making | 3 | 3 | 4 | 4 | 5 | 3 | 4 | 26 |

The raw totals put C7 first by one point. I nonetheless rank C14 first, for a
reason stated openly: the brief's hard requirement is a *genuine* AI
responsibility, and S5 is the only criterion where C7 scores below 4. If the
team judges that a constrained explanation-interpreter is enough AI for a
subtraction manipulative, C7 wins on totals. This is the single most important
judgment call in the report and is flagged as unresolved (Section 6).

### 5.3 Evidence-informed top five (ranked)

**1. C14 Decimal comparison ("longer is larger") on a zoomable line, with AI-
generated erroneous examples.**
Why it could beat the others: the misconception is rule-shaped, so a validated
deterministic classifier (Steinle & Stacey's rule groups) gives crisp,
defensible diagnosis; the zoom mechanic makes the position-value idea *visible*
in a way no other candidate's representation does; erroneous examples are the
one intervention in this set with evidence of superior *delayed* learning; and
generating an erroneous example in the learner's own inferred rule and words,
then judging their written correction, is a real language task that templates
do poorly. The topic is cross-nationally consistent (US, France, Israel,
Australia) and the core mechanic is notation-neutral once the separator is
configurable.

**2. C7 Subtraction smaller-from-larger with forced unbundling.**
Why it could beat the others: the deepest and widest evidence base (four
decades, US/Spain/Germany), the most foundational skill, the most physically
embodied "impossible move" reveal, and locally consequential (ASER). It loses
only on AI genuineness, because DEBUGGY-style diagnosis is deterministic and
the AI is confined to explanation handling.

**3. C12 Fraction magnitude / whole-number bias on a number line.**
Why it could beat the others: the strongest intervention evidence for a *game*
mechanic (four product-style studies plus five RCTs of a tutoring program);
best-documented long-term consequence (predicts algebra across three
continents). It loses on originality (Motion Math and Fraction Ball exist) and
on AI genuineness.

**4. C8 Equal sign as balance.**
Why it could beat the others: highest downstream stakes per minute of play
(algebra gateway), simplest build, tight diagnostic (12 or 17 on 8 + 4 = __ +
5), and a natural AI job (classify the learner's stated reason to choose the
next format). It loses because prevalence is curriculum-dependent (China/Korea
learners rarely have it) and the balance metaphor is familiar.

**5. C11 Division with remainder sense-making.**
Why it could beat the others: it is the one candidate where the AI is
*indispensable* (situations and justifications are language), and the packing
mechanic makes the leftover physically present. It loses on evidence depth
(few RCTs), on "foundational arithmetic" fit, and on the fairness risk of
grading 9-year-olds' free text.

### 5.4 Strongest challenger to number one

**C7 (subtraction smaller-from-larger)** is the strongest challenger. It beats
C14 on evidence breadth, foundational status, embodiment, and local consequence,
and it ties on demo clarity. The tie-breaker is entirely the AI-genuineness
criterion. Two further challengers that should be argued against C14 before any
decision: C12 (if the team weights intervention RCT evidence for games above AI
genuineness) and C8 (if the team weights downstream consequence and build
simplicity).

Three candidates that strongly challenge the top choice, as required: C7, C12,
C8.

---

## 6. What is verified, inferred, hypothesized, unresolved

### Verified findings [V]
- Grade placements per curriculum body as listed in 2.1 (abstract-level for
  India; verify against NCERT texts).
- Prevalence and persistence of: smaller-from-larger (US, Spain), longer-is-
  larger decimals (Australia; US/France/Israel), whole-number bias in fractions
  (US; three-continent prediction), operational equal sign (US; lower in China
  and Korea), remainder sense-making failures (US, Mexico, Spain), transcoding
  errors (German, English, French/Vietnamese contrasts), partitioning errors
  (Canada, Australia), hatch-mark counting (US, cross-national).
- Intervention effects: early numeracy g = 0.64; board games g = 0.21 pooled;
  Calcularis g about 0.44-0.55; Fraction Face-Off ES about 0.64; Decimal Point
  d = 0.43/0.37; erroneous examples delayed advantage; elaborated feedback d =
  0.49; virtual manipulatives 0.34; digital math games d about 0.37;
  strategic counting plus practice transfers.
- AI limits: child ASR 2-5x worse; LLM misconception diagnosis reliable only
  when constrained; hint abuse 10-40%; BKT cold start.

### Product inferences [I]
- Deterministic systems should own correctness, structured-error matching,
  difficulty, mastery gating, and spacing; AI should own free-text
  interpretation, situation generation, and learner-tuned erroneous examples
  or contrasts.
- Geography neutrality is achievable only for quantity/position mechanics, not
  for written algorithms or number words.
- A three-minute demo needs the misconception to have a *visible wrong game
  state*, which favors manipulative-overflow (C6/C7), tilt (C8), position
  (C12/C14), and leftover (C11) over any answer-entry format.

### Hypotheses [H]
- H1: Erroneous examples generated in the learner's own rule and words will
  produce more accurate self-corrections than generic erroneous examples
  (untested; the McLaren studies used authored examples).
- H2: A constrained LLM classifier (three labels) on typed explanations from
  9-11-year-olds will agree with human raters at a usable rate (unknown; must
  be measured on synthetic and adult-operated data before any claim).
- H3: The zoom interaction alone, without the erroneous-example phase, will not
  shift the longer-is-larger rule durably (consistent with Steinle & Stacey's
  persistence finding, but not tested).
- H4: Subtraction learners will attempt to remove units directly from rods
  when the "impossible move" appears, making the misconception visible without
  any typed explanation (plausible from bug taxonomies; untested in a
  manipulative UI).

### Unresolved questions [?]
- Q1: Does the team weight AI genuineness above evidence breadth? This decides
  C14 vs C7.
- Q2: Is a Grade 4-5 topic acceptable under "foundational arithmetic", or does
  the brief's spirit push toward Grades 1-3?
- Q3: How will typed explanations be obtained from a 9-11-year-old in a demo
  operated by adults with synthetic profiles, and how will the classifier's
  accuracy be evidenced without child data?
- Q4: Which decimal separator and currency does the demo use, and is that a
  configuration shown on screen?
- Q5: For C7, which regrouping representation is shown in the symbol trace so
  that no single national algorithm is privileged?
- Q6: The Nelson 2025 board-game meta-analysis moderators and the 2024
  fact-fluency meta-analysis were seen only at abstract level; any use in the
  evidence register requires the full text.

No final project decision is made or recorded here.

---

## 7. Sources consulted (by topic)

Curriculum
- Common Core Grade 4 and 5 introductions: https://www.thecorestandards.org/Math/Content/4/introduction/ , https://www.thecorestandards.org/Math/Content/5/introduction/
- England (TIMSS encyclopedia): https://timssandpirls.bc.edu/timss2015/encyclopedia/countries/england/the-mathematics-curriculum-in-primary-and-lower-secondary-grades/
- India (secondary syllabus summaries; verify against NCERT): https://www.cuemath.com/maths/class-5/ , https://www.grade1to6.com/syllabus-cbse-ncert-class-1-maths.html
- Subtraction algorithm history (Ross 1999): https://doi.org/10.1111/j.1949-8594.1999.tb17499.x

Early quantity and magnitude
- Siegler & Ramani 2008: https://siegler.tc.columbia.edu/wp-content/uploads/2019/02/sieg-ram08.pdf
- Siegler & Ramani 2009 (linear vs circular): https://siegler.tc.columbia.edu/wp-content/uploads/2019/02/sieg-ram09.pdf
- Nelson et al. 2025 meta-analysis of linear number board games: https://journals.sagepub.com/doi/10.3102/00346543251383552
- Elofsson et al. 2016: https://www.sciencedirect.com/science/article/abs/pii/S0732312316300657
- Number comparison vs number line training (2023): https://www.sciencedirect.com/science/article/pii/S0885200623000893
- Proportion-judgment account (Barth & Paladino line): https://www.sciencedirect.com/science/article/abs/pii/S0022096517302643
- Calcularis efficacy 2020: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.01115/full
- Calcularis design 2013: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2013.00489/full
- Number Race vs Graphogame-Math (Rasanen 2009): https://www.sciencedirect.com/science/article/abs/pii/S0885201409000641
- Cardinality instruction: https://www.sciencedirect.com/science/article/abs/pii/S0885200618300292 , https://link.springer.com/article/10.1007/s11858-020-01150-0
- Nelson & McMaster 2019: https://www.semanticscholar.org/paper/2518bdc42b896d601595c719bcc1cfbf69312c8a
- Counting-focused synthesis 2025: https://journals.sagepub.com/doi/10.1177/09388982251321538
- Clements & Sarama 2008: https://journals.sagepub.com/doi/abs/10.3102/0002831207312908

Place value, transcoding, language
- Ross 1986: https://eric.ed.gov/?id=ED273482
- Herzog/Fritz model (Turkey validation): https://files.eric.ed.gov/fulltext/EJ1327520.pdf
- Place value and number writing (2021): https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.642153/full
- Language account reexamined (Miura line): https://www.sciencedirect.com/science/article/abs/pii/S0022096514001544
- German inversion transcoding: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4462644/ , https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3990049/
- Language effects on number writing/reading: https://jnc.psychopen.eu/index.php/jnc/article/view/6929
- Year 1 two-digit writing (UK): https://eprints.whiterose.ac.uk/id/eprint/166862/7/1_s2.0_S0885201420301210_main.pdf
- Fuson & Briars 1990: https://pubs.nctm.org/view/journals/jrme/21/3/article-p180.xml
- Game-based place value RCT (abstract-level): https://files.eric.ed.gov/fulltext/EJ1363998.pdf

Addition and subtraction
- Burton, Diagnosing bugs (DEBUGGY): https://exquisitive.com/library/DiagnosingBugsSimpleProceduralSkill.pdf
- Subtraction errors and math difficulty: https://pmc.ncbi.nlm.nih.gov/articles/PMC2788949/
- Diagnostic items for bridging errors (2020): https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2020.537531/full
- Spanish subtraction error study: https://core.ac.uk/works/156713990
- Primary addition errors: https://www.researchgate.net/publication/350856732_PRIMARY_SCHOOL_CHILDREN'S_ERRORS_IN_ADDITION
- Fuchs 2010 strategic counting: https://www.sciencedirect.com/science/article/abs/pii/S1041608009000661
- Swedish structural approach (2024): https://link.springer.com/article/10.1007/s10649-024-10339-z
- Codding 2011 fact fluency: https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1540-5826.2010.00323.x ; 2024 meta-analysis: https://pubmed.ncbi.nlm.nih.gov/41787952/
- Nunes & Bryant inverse relation: https://www.tandfonline.com/doi/abs/10.1080/10986060802583980
- ASER 2024 summary: https://www.ideasforindia.in/topics/human-development/aser-2024-more-than-a-post-pandemic-recovery-in-learning

Equal sign and word problems
- McNeil et al. 2006: https://cladlab.nd.edu/assets/250420/mcneiletal06.pdf
- Nontraditional practice formats (McNeil et al.): https://cladlab.nd.edu/assets/384440/mcneilhornburgbrletic_shipleymatthews_inpress.pdf
- Knuth et al., equal sign as gateway: https://files.eric.ed.gov/fulltext/ED514405.pdf
- Chinese Grade 1 equal sign: https://files.eric.ed.gov/fulltext/ED661101.pdf
- Early-grade equal sign (US): https://files.eric.ed.gov/fulltext/EJ1184961.pdf
- Swedish case: https://link.springer.com/article/10.1007/s10763-020-10144-z
- Substitution vs sameness: https://pmc.ncbi.nlm.nih.gov/articles/PMC9330929/
- Compare problems and relational terminology (Fuchs): https://www.sciencedirect.com/science/article/abs/pii/S0022096511002682
- Schema-based instruction with language: https://pmc.ncbi.nlm.nih.gov/articles/PMC7989819

Multiplication and division
- Barmby et al. 2009 arrays: https://eric.ed.gov/?id=EJ833856
- Larsson et al. 2017: https://www.sciencedirect.com/science/article/abs/pii/S0732312316301055
- Kim 2025 (Korea): https://journals.sagepub.com/doi/10.1177/27527263251335686
- Multiplication makes bigger (review): https://eric.ed.gov/?id=EJ952821
- Silver et al., remainders: https://www.researchgate.net/publication/258510299
- Mexican Grade 4 remainders: https://eric.ed.gov/?id=EJ1382676
- Spain remainders: https://link.springer.com/article/10.1007/BF03178766
- Van Dooren additive/multiplicative: https://link.springer.com/article/10.1007/s10212-011-0087-0

Fractions and decimals
- Braithwaite & Siegler 2018 whole number bias: https://onlinelibrary.wiley.com/doi/abs/10.1111/desc.12541
- Three continents: https://www.sciencedirect.com/science/article/abs/pii/S0959475214000255
- IES fractions practice guide: https://ies.ed.gov/ncee/wwc/practiceguide/15
- Fraction Face-Off WWC report: https://ies.ed.gov/ncee/wwc/Docs/InterventionReports/wwc_STEM_FFO_IR_mar2020.pdf
- Motion Math (Riconscente 2013): https://journals.sagepub.com/doi/abs/10.1177/1555412013496894 ; McKevett 2020: https://onlinelibrary.wiley.com/doi/abs/10.1111/ldrp.12211
- Fraction Ball RCT: https://www.sciencedirect.com/science/article/abs/pii/S0361476X24000419
- Slice Fractions: https://library.iated.org/view/CYR2016GAM
- Third-grade number-line misunderstandings: https://www.tandfonline.com/doi/full/10.1080/19477503.2016.1245035
- Pothier & Sawada partitioning: https://www.researchgate.net/publication/271697473 ; NZCER summary: https://www.nzcer.org.nz/nzcerpress/set/articles/fractions-partitioning-and-part-whole-concept
- Steinle & Stacey decimals: https://link.springer.com/doi/10.1007/BF03217300 ; Roche 2005: https://eric.ed.gov/?id=EJ794018
- Erroneous examples delayed effect (McLaren 2015): https://link.springer.com/article/10.1007/s40593-015-0064-x
- Decimal Point vs tutor: https://www.cs.cmu.edu/~bmclaren/pubs/McLarenEtAl-ComputerBasedGameThatPromotesMathLearningMoreThanAConventionalApproach-IJGBL2017.pdf ; decade review: https://link.springer.com/chapter/10.1007/978-3-031-71232-6_9
- ChatGPT decimal feedback evaluation: https://arxiv.org/pdf/2306.16639

Measurement and estimation
- Ruler misconceptions (Solomon et al.): https://escholarship.org/content/qt5cz2r7vj/qt5cz2r7vj_noSplash_977c3c793a51d2d529f807d247272840.pdf
- Disconfirming evidence for ruler (2024): https://doi.org/10.3390/jintelligence12070062
- Cross-national ruler longitudinal: https://www.sciencedirect.com/science/article/pii/S0732312323000184
- Computational estimation strategies: https://jnc.psychopen.eu/index.php/jnc/article/view/7299 ; UK curricula: https://www.tandfonline.com/doi/full/10.1080/0020739X.2020.1868591

Feedback, games, tutors, AI
- Van der Kleij et al. 2015 feedback meta-analysis: https://journals.sagepub.com/doi/abs/10.3102/0034654314564881
- Byun & Joung 2018 games meta-analysis: https://eric.ed.gov/?id=EJ1175390
- Moyer-Packenham virtual manipulatives: https://eric.ed.gov/?id=EJ1154970
- Comparison of methods (Rittle-Johnson, Star, Durkin): https://journals.sagepub.com/doi/10.1177/2372732216655543
- Math Garden (Klinkenberg 2011): https://www.sciencedirect.com/science/article/abs/pii/S0360131511000418
- Help-seeking and gaming: https://www.sciencedirect.com/science/article/abs/pii/S0959475210000538 ; https://www.researchgate.net/publication/279556346_Why_Students_Engage_in_Gaming_the_System
- LLM feedback in ITS (GPT-4 diagnosis): https://link.springer.com/article/10.1007/s40593-025-00505-6
- Misconception benchmark (algebra): https://link.springer.com/article/10.1007/s44217-025-00742-w
- Eedi misconceptions competition: https://www.kaggle.com/competitions/eedi-mining-misconceptions-in-mathematics
- MalruleLib: https://arxiv.org/pdf/2601.03217
- LLM hint generation: https://arxiv.org/pdf/2411.03495
- Child ASR limits: https://the-learning-agency.com/guides-resources/closing-the-child-speech-recognition-gap-evidence-limitations-and-paths-forward/
- BKT overview and cold start: https://en.wikipedia.org/wiki/Bayesian_Knowledge_Tracing
