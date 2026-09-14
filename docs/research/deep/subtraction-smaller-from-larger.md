Status: Bounded deep-research note (Sonnet background agent, 2026-09-08); verification labels inside are authoritative; not a product decision.

# Deep Research: Multi-Digit Subtraction "Smaller-from-Larger" Bug Candidate

Bounded research pass (~26 web searches/fetches). Research only, no code, no repo edits.
Adjacent existing docs read: `docs/research/grade-2-3-misconceptions.md` (ten-for-one unitizing
hypothesis) and `docs/evidence-register.md`.

Labels used: **full-text verified** (I read the actual primary source text/PDF),
**abstract-level** (I could only confirm via abstract/secondary summary, not full body),
**unverified** (claim from the brief that I could not confirm in bounded search — flagged,
not asserted as true), **could not access** (source blocked/paywalled/binary-unreadable).

---

## 1. Plan-critical evidence verification

### 1.1 Brown & Burton (1978), "Diagnostic Models for Procedural Bugs in Basic Mathematical Skills"
- Cognitive Science, vol. 2, pp. 155-192.
- **Could not access full text** (Wiley PDF returned 403; ScienceDirect/academia.edu mirrors not
  fetched in time budget). Abstract-level only, via search snippets: introduces "procedural
  networks" as a representation for a skill and BUGGY, a system that automatically synthesizes a
  model of a student's bug from a small number of test items.
- Downstream secondary source (full-text verified, see 1.6 below — Lee & Corter 2011) cites
  Brown & Burton (1978) and Brown & VanLehn (1980) directly for two load-bearing claims used in
  the candidate brief: (a) only about a dozen subtraction bugs occur often enough to be
  confirmed, and (b) bugs are **unstable** — a bug seen in one session may not reappear in the
  next. This is the strongest verification I could obtain for Brown & Burton without a full-text
  read of the 1978 paper itself.
- **Status: abstract-level (primary), full-text verified (via citing source's direct quotes of its claims).**

### 1.2 Burton (1982) DEBUGGY
- Not independently fetched in this pass (time-bounded). Existence and role (automated bug
  diagnosis from a student's answer sheet, successor to BUGGY) is well-established in the
  secondary literature I did read (Lee & Corter 2011 cites the Brown/Burton/VanLehn lineage
  directly). No new prevalence numbers found specific to DEBUGGY.
- **Status: unverified in this pass — treat as background lineage, not a load-bearing number.**

### 1.3 VanLehn (1982/1990) bug frequencies — "smaller-from-larger most common," ~1,000 Grade 3-5 students, 37% compound bugs
- I could **not** locate the primary VanLehn 1982 ("Bugs Are Not Enough," Journal of Mathematical
  Behavior, 3, 3-71) or the Mind Bugs (1990) book text itself online in this pass (archive.org
  listing found, not fetched/OCR'd).
- Search snippets (secondary, unverified) repeat: "In a recent experiment with approximately one
  thousand third, fourth and fifth grade students, thirty-seven percent of the diagnoses were
  compound bugs (VanLehn, 1981)." Note the year cited is 1981, not 1982/1990 — this is a
  **citation-chain claim I could not independently confirm against a primary page**, so treat the
  exact "~1,000 students / 37% compound" figure as **unverified** for this project's purposes,
  even though it is a widely repeated figure in the secondary literature.
- I could not confirm from primary text that "smaller-from-larger" is *the single most common*
  bug specifically in VanLehn's data (as opposed to being one of the most common, or most common
  only in some sub-populations). The Raghubar et al. (2009) full-text data (1.4 below) is
  consistent with smaller-from-larger being frequent, but that is a different, later, US sample —
  not VanLehn's original data.
- **Status: unverified (compound-bug %, exact N) — do not cite the "37%"/"~1,000 students" numbers
  as verified in demo materials or docs; the underlying VanLehn corpus is real and frequently
  cited, but I could not pin the exact figures to primary text in bounded time.**

### 1.4 US math-difficulty study (PMC2788949) — 25-31% smaller-from-larger vs 9% controls
- **Full-text verified.** Raghubar, K., Cirino, P., Barnes, M., Ewing-Cobbs, L., Fletcher, J., &
  Fuchs, L. (2009). "Errors in Multi-Digit Arithmetic and Behavioral Inattention in Children With
  Math Difficulties." *Journal of Learning Disabilities*.
- Sample: **291 children, Grades 3-4**, recruited from 20 schools in Houston, TX and Nashville,
  TN (USA). Four groups: No LD (control), RD-only (reading disability), MD-only (math
  difficulty), MD+RD (both).
- Exact quote: "31% of the MD+RD group committed the smaller from larger subtraction bug, which
  was significantly more than proportions of the RD (9%) and No LD groups (9%) but not the MD
  (25%) group." So: **MD+RD = 31%, MD = 25%, RD = 9%, No LD (control) = 9%.** This matches the
  brief's "25-31% in MD groups vs 9% controls" claim exactly.
- Other bugs reported: Borrow-No-Decrement (No LD 8%, RD 8%, MD 18%, MD+RD 12%); Borrow-Across-Zero
  (No LD 7%, RD 6%, MD 16%, MD+RD 20%).
- Coding method: van Lehn's detailed "Subtraction Bug Glossary" scoring system, distinguishing
  consistent procedural **bugs** from one-off **slips**.
- **Status: full-text verified. This is your single strongest, most precisely quotable prevalence
  number.** Caveat: it is a US clinical/school sample selected for learning difficulty status, not
  a general-population estimate — smaller-from-larger is still present at meaningful (9%) rates
  even in the no-LD control group, which is itself useful framing (this bug is not confined to
  children with diagnosed difficulties).

### 1.5 Spanish study — 7,140 subtractions, 357 pupils aged 7-13, VanLehn 20-item test (core.ac.uk/works/156713990)
- **Could not access primary text** (core.ac.uk returned 403; the underlying paper appears to be
  Fernández & García, "Evolutionary processes in the development of errors in subtraction
  algorithms" — likely the Spanish-language original "Los componentes generadores de errores
  algorítmicos: caso particular de la sustracción"). A PDF at academicjournals.org was fetched but
  returned as unreadable binary; I could not extract text from it in this pass.
- Confirmed via search snippets only (**abstract-level, unverified numbers**): sample matches the
  brief exactly — 357 pupils, grades 2-6, ages 7-13, 7,140 subtractions analyzed, VanLehn's
  20-subtraction test used. The study's stated aim (per abstract) is to check whether systematic
  errors persist and whether they decrease across schooling — i.e., it is itself evidence relevant
  to the "do misconceptions fade with age" question, but **I could not confirm specific bug
  prevalence-by-grade numbers.**
- **Status: could not access primary source; sample description confirmed, prevalence breakdown
  not verified.** Flag this explicitly if used in the pitch — do not quote a specific percentage
  from this study without a follow-up fetch (try the academia.edu PDF or a Google Scholar cache,
  or convert the downloaded binary with a PDF text tool outside this research pass).

### 1.6 German diagnostic-item study for bridging errors (frontiersin.org)
- **Important correction to the task brief: this study is Dutch, not German.**
- **Full-text verified** (via fetch, though not 100% of the article body): Vermeulen, J. A.,
  Béguin, A., Scheltens, F., & Eggen, T. J. H. M. (2020). "Evaluating the Characteristics of
  Diagnostic Items for Bridging Errors in Multi-Digit Subtraction." *Frontiers in Education*.
- Sample: **264 third-grade students (132 boys, 130 girls) from 12 Dutch primary schools**,
  average age 8.8 years — Netherlands, not Germany.
- Studied three specific bridging-error types: (1) smaller-from-larger (reversing digits when
  borrowing needed — matches this candidate's target bug exactly), (2) smaller-from-larger with an
  extra spurious decrement step, (3) forgetting to decrement after correctly reversing.
- Prevalence by item type: items with equal-digit minuend/subtrahend pairs (e.g., 3-digit minus
  3-digit with matched digit counts) showed the **highest bridging-error rate at 47%**; items with
  unequal digit counts showed **32%**. Multiple-choice item format elicited more bridging errors
  than open-ended response format (an interesting methodological note: how you *ask* the question
  changes the measured error rate).
- **Status: full-text verified, but wrong country in the brief — cite as Netherlands/Dutch, age 8.8,
  Grade 3, not Germany.** This is a good, recent (2020), large-enough, directly-on-target source.

### 1.7 Fuson & Briars (1990), base-ten blocks approach, Grades 1-2 (JRME)
- **Abstract/summary-level verified** (not the full paywalled JRME article itself, but a detailed
  and specific secondary summary that quotes methodology and results directly).
- Fuson, K. & Briars, D. (1990). "Using a Base-Ten Blocks Learning/Teaching Approach for First-
  and Second-Grade Place-Value and Multidigit Addition and Subtraction." *Journal for Research in
  Mathematics Education*, 21(3), 180-206.
- Sample: **First and second graders, N=169 across 8 classes** for the addition/place-value
  portion; **three classes of second graders, N=75** completed the subtraction portion specifically.
- Method: base-ten blocks embodying the named-value word system, paired with digit cards for the
  positional base-ten numeral system; each physical step was immediately recorded with written
  numerals (concrete action tied to symbol, step by step) — directly analogous to this candidate's
  "live symbol trace."
- Result (as summarized): 6 of 8 classes demonstrated meaningful multidigit addition and
  place-value up to at least 4-digit numbers; the 3 second-grade classes "demonstrated meaningful
  subtraction concepts" after the block-based subtraction unit.
- **Status: abstract/secondary-level verified. Correction to brief: this is a Grade 1-2 sample
  (not exactly "Grades 1-2" generically but specifically N=75 second graders for the subtraction
  arm), not a large-N controlled trial — it's a classroom-teaching-experiment design, not an RCT.
  Treat as instructional-design precedent, not causal-effect evidence.**

### 1.8 CRA (concrete-representational-abstract) intervention for subtraction with regrouping — Flores; Bouck
- **Abstract-level verified**, multiple sources triangulated:
  - Flores, M. et al. — CRA-Integrated (CRA-I) sequence taught to **four 4th-grade students**
    (3 with LD/OHI eligibility, 2 English language learners) using a **single-case
    multiple-probe-across-behaviors design**. Behaviors included completing equations requiring
    subtraction with regrouping in the tens place and tens-and-hundreds place. A functional
    relation was found between the CRA-I intervention and improved number-concept behaviors.
  - Flores, Hinton, & Strozier (2014), *Learning Disabilities Research & Practice* — CRA sequence
    + Strategic Instruction Model (SIM) for subtraction *and* multiplication with regrouping.
  - Bouck, E., Satsangi, R., & Park, J. (2018), *Remedial and Special Education* — "The
    Concrete-Representational-Abstract Approach for Students With Learning Disabilities: An
    Evidence-Based Practice Synthesis." This is a synthesis paper (not new primary data) that
    reviewed CRA studies and treats CRA as an evidence-based practice for computation, including
    regrouping, for students at risk of or with learning disabilities.
- **No effect sizes were retrievable in bounded search** — the Flores studies are small
  single-case-design studies (N=4, N unspecified for the 2014 one), which report "functional
  relations," not Cohen's d / effect sizes in the RCT sense. Do not claim a specific effect size in
  pitch materials.
- **Status: abstract-level verified for existence and design type; no quotable effect size found.
  Key caveat for the pitch: CRA subtraction-regrouping evidence is small-N, mostly special-education
  populations (LD/OHI), single-case design — not large-N general-population RCT evidence.**

### 1.9 ASER 2024 India — rural Class 3 / Class 5 arithmetic
- **Abstract-level verified** via a secondary analysis piece (ideasforindia.in) that quotes the
  report's headline numbers; I could not get readable text directly out of the official ASER PDF
  (binary/compressed stream, not machine-readable in this tool chain).
- As reported: **Class 3, "can do subtraction" (i.e., at least a 2-digit subtraction with
  borrowing, one level below Class-3-appropriate division on ASER's arithmetic ladder): 33.7% in
  2024, up from 25.9% in 2022, 28.2% in 2018, 25.4% in 2014.**
- **Class 5, "can do division": 30.7% in 2024, vs 25.6% in 2022, 27.9% in 2018, 26.1% in 2014.**
  (Note: the brief asked for Class 5 subtraction; ASER's ladder places division, not subtraction,
  as the Class-5-relevant skill — subtraction is the Class 3 benchmark on ASER's "at least"
  ladder. I could not find a distinct "Class 5 can do subtraction" statistic — Class 5 children
  are assessed on division as the top rung, with subtraction typically near-universal by Class 5
  and therefore not separately headlined.)
- **Status: abstract-level verified (secondary summary, not the primary PDF table). Numbers are
  plausible and match known ASER reporting conventions, but I recommend one more direct check of
  the official ASER 2024 PDF page/table number before quoting in a demo video, since I could not
  read the primary PDF directly in this pass.**
- This is still a strong, evocative statistic for framing global reach: roughly two-thirds of
  rural Indian Class 3 children (100% − 33.7%) could **not** do a Class-2-level subtraction problem
  as of 2024, despite recent recovery.

### 1.10 Jensen, Gasteiger & Bruns (2024) — does it say anything about subtraction/regrouping specifically?
- Full paper title (more precise than the evidence register's shorthand): "Place Value and
  Regrouping as Helpful Constructs to Diagnose Difficulties in Understanding the Place Value
  System" ("Stellenwert und Bündelung als hilfreiche Konstrukte zur Diagnose von Schwierigkeiten
  beim Verständnis des Stellenwertsystems"), *Journal für Mathematik-Didaktik*, 45, article 11.
- Sample confirmed: **100 third graders, ages 8-10, Germany.** (Matches existing evidence register
  E-007.)
- **Could not re-verify full text in this pass** (Springer link redirected to a login wall — the
  paper is paywalled, consistent with the existing evidence register's own "abstract-level /
  verified for the studied population" caveat).
- On the specific question of subtraction: the tasks in this study are about **translating named
  units into written numerals** (place-value principle and regrouping principle), not about the
  subtraction *procedure* or *borrowing* directly. Search snippets do surface the German term
  "Entbündeln" (un-bundling/breaking a bundle apart — the conceptual mirror of "bundling," and the
  operation this candidate's game mechanic is built on) in connection with this research group's
  broader work, but **I could not confirm in bounded search whether the specific 2024 paper itself
  uses "Entbündeln" or discusses subtraction borrowing directly**, versus the addition-direction
  "Bündeln" (bundling) only.
- **Status: abstract-level (as already recorded in the evidence register). New finding from this
  pass: this paper is about numeral-translation tasks, not directly about the subtraction
  algorithm — it supports the general "regrouping is a distinguishable construct from place-value
  mapping" claim (which underpins both the existing ten-for-one hypothesis AND this subtraction
  candidate), but it is not itself subtraction-specific evidence. Do not describe it as a
  subtraction study in pitch materials.**

---

## 2. Disconfirming evidence

### 2(a) Base-ten manipulatives do NOT reliably transfer to written subtraction
- **Found and directly on-target: Uttal, D. et al. (2013). "It Works Both Ways: Transfer
  Difficulties between Manipulatives and Written Subtraction Solutions." *Child Development
  Research*.**
- **Could not fetch full text** (Wiley 403; ResearchGate mirror not fetched). **Abstract-level
  only**, from search snippets: children were randomly assigned to written-instruction,
  manipulatives-instruction (Digi-Blocks system, chosen specifically because it is designed to
  link manipulative and written representations), or control groups for learning two-digit
  subtraction, then videotaped to see whether they used the *same* solution procedure across
  manipulative and written problem formats.
- The paper's title itself is the finding: transfer problems go **"both ways"** — children taught
  with manipulatives do not automatically use equivalent reasoning on written problems, and
  (implied by the title) the reverse transfer direction is also imperfect. This is a real,
  citable, directly-relevant caution against this candidate's core assumption that a well-designed
  rods-and-units interaction will "show up" in the child's written algorithm.
- **Status: abstract-level (title + design confirmed; could not quote the specific effect size or
  % showing transfer failure). This is the single most important disconfirming citation for this
  candidate — it should be in the pitch's own risk section, framed honestly, not hidden.**
- Product implication: the game's "live symbol trace" (recording quantity moves without a fixed
  written layout) is explicitly a hedge against the Uttal finding — instead of hoping the block
  action transfers into a written column algorithm, the candidate defers the written-algorithm
  question and treats the trace as its own representation. This is a reasonable design response,
  but it does not resolve the disconfirming evidence, only sidesteps the specific claim being
  tested. If the game's success is later measured against written-algorithm performance, this
  citation says that transfer should not be assumed.

### 2(b) Bug diagnosis reliability — bug migration/instability across sessions
- **Full-text verified**, and stronger than expected: Lee, J. & Corter, J. E. (2011). "Diagnosis of
  Subtraction Bugs Using Bayesian Networks." *Applied Psychological Measurement*, 35(1), 27-47.
  (Read directly from the PDF, pages 1-4.)
- Exact quotes (full text, page 28): "In practice, it is difficult to diagnose the existence of
  these 'bugs' in an individual's procedural skills. First of all, only a limited set of bugs
  (e.g., about a dozen bugs for subtraction skills) have been found frequently enough to confirm
  their existence (J. S. Brown & VanLehn, 1980). Second, whether a bug is exhibited can depend on
  specific problem contexts. Third, computational errors can occur when one is executing a buggy
  algorithm, just as they can when one is executing a correct algorithm, injecting noise into the
  process of bug diagnosis. For these reasons, **bugs are unstable, meaning that a bug symptom
  observed in an individual might not show up in subsequent items or in a subsequent testing
  session. Consequently, some researchers have warned that reliable diagnosis of bugs based on
  students' performance should not be expected** (J. S. Brown & Burton, 1978; J. S. Brown &
  VanLehn, 1980)."
- The whole Lee & Corter (2011) paper exists specifically to try to fix this problem using
  Bayesian networks over multiple test items plus latent "subskill" nodes — their best model
  reaches 99% correct diagnosis **only when using specific-wrong-answer diagnostic items plus
  modeled subskills**, not from a single observed action. Simple binary (correct/incorrect)
  scoring alone gives ~85% — still imperfect.
- **Status: full-text verified. This is a serious, citable, technically strong disconfirming
  point.** Direct product implication: a single failed drag-and-shortfall event, or one typed
  explanation, is **not** sufficient evidence for a stable bug diagnosis per this literature —
  multiple varied items are needed, which the candidate's "contrast pair" step partially
  addresses but does not fully resolve (one contrast pair is still just two items).
- Bonus fact surfaced here, full-text verified, worth adding to the evidence register regardless
  of which candidate ships: citing Kouba, Zawojewski, & Strutchens (1997) from NAEP data,
  **"approximately 50% of U.S. fourth-graders and 15% of eighth-graders were not able to subtract
  a two-digit number from a three-digit number with borrowing."** This is an additional, strong,
  independently-sourced prevalence figure for the general difficulty of borrowing subtraction —
  worth citing alongside the Raghubar et al. 25-31%/9% figures.

### 2(c) A subtraction-regrouping game/app evaluated with weak results
- **Not found.** I ran targeted searches for RCT/evaluation studies of a subtraction-regrouping
  game or app with null/weak results and did not surface a specific study. What I found instead
  were general virtual-manipulatives meta-analyses with **inconsistent, contradictory effect-size
  claims across different meta-analyses** (one reporting d≈0.34 "moderate", another reporting
  d≈1.6 "strong," with a systematic-review-level comment that "the evidence for the effects of
  using manipulatives to support student mathematics achievement... is generally mixed and merits
  further scrutiny"). This inconsistency across meta-analyses is itself a soft form of
  disconfirming evidence — it means "manipulatives work" is not a settled, uniformly-strong
  finding, and no single number should be quoted as if it were.
- **Status: could not find a specific negative-result subtraction game study; found instead
  meta-analytic disagreement, which should be reported honestly as "the base rate of intervention
  optimism in this literature is not fully trustworthy," rather than as a specific citation.**

---

## 3. Curriculum fit

### US Common Core
- **2.NBT.5 (Grade 2):** "Fluently add and subtract within 100 using strategies based on place
  value, properties of operations, and/or the relationship between addition and subtraction."
  Confirmed via secondary sources; **could not fetch corestandards.org directly (403)** to quote
  the canonical text verbatim, so treat as abstract-level/high-confidence-secondary rather than
  primary-verified.
  Key point relevant to the "no hard-coded written algorithm" design constraint: Grade 2 explicitly
  asks for **strategies**, not **the standard algorithm** — the standard column algorithm is
  deferred. (Common knowledge among CCSS practitioners: the standard algorithm requirement for
  multi-digit addition/subtraction is generally associated with **Grade 4 (4.NBT.4)**, not Grade 2
  or 3 — I could not fetch primary text to quote 4.NBT.4 directly in this pass, so flag this as
  **unverified precise wording**, though the grade-band placement is a well-known, low-risk claim.)
- This is a good, geography-neutral-friendly fact for the pitch: **even the US standard explicitly
  wants place-value strategies before the fixed column algorithm** at ages 7-8, which aligns with
  this candidate's "quantity-truth before written layout" design.
- **Status: abstract-level / secondary-verified; primary corestandards.org text not fetched
  (blocked). Recommend a follow-up direct check before quoting exact standard text in the pitch deck.**

### England National Curriculum
- **Year 3** (ages 7-8) is when the "formal" written column-subtraction method is introduced,
  per DfE guidance and NCETM materials (abstract-level, multiple corroborating secondary sources,
  not the primary DfE PDF itself — that fetch was not attempted directly, only search snippets).
  Year 3 pupils are expected to "subtract numbers with up to three digits using the formal written
  method of columnar subtraction," including problems that do and do not require regrouping/exchange.
- Year 2 (per the existing evidence register, E-013) already covers tens/ones recognition and
  varied partitioning (`23 = 10 + 13`) — i.e., the *conceptual* exchange precedes the *formal
  written* method by a year, which is a clean argument for why this candidate's concrete
  rods-and-units mechanic (Year 2-appropriate) should precede, not replace, the Year 3 column
  method.
- **Status: abstract-level verified (consistent secondary sources); primary DfE PDF not directly
  fetched in this pass.**

### India NCERT
- **Could not find or fetch a primary NCERT textbook source** confirming the exact class/chapter
  for subtraction-with-regrouping in this bounded pass. Secondary/commercial sources (Vedantu,
  CrestOlympiads) consistently place 3-digit subtraction-with-borrowing content at **Class 3**
  (ages 8-9), which is directionally consistent with the existing evidence register's NCERT
  Foundational Stage citation (E-012, bundling ten as foundational) and with this candidate's
  target age band, but **I could not confirm the exact textbook/chapter name** (e.g., which
  "Math-Magic" or "Ganit" chapter) from ncert.nic.in directly.
- **Status: could not access primary source in bounded time; class-level placement is
  plausible/consistent but not primary-verified. Flag as an open item if NCERT-specific claims are
  needed for the pitch.**

### Cross-curriculum synthesis relevant to the "no hard-coded written layout" constraint
All three systems place the *concept* of exchanging a ten for ten ones (or vice versa) at
essentially the same age band (7-9), but the *point at which a fixed written column algorithm is
required* varies by system and by year (England: explicit "formal method" named at Year 3; US:
conceptual strategies at Grade 2, standard algorithm generally later; India: borrowing procedure
commonly taught by Class 3 in observed textbooks, though I could not confirm exact NCERT sequencing
primary-side). This is a real, moderately-well-supported basis for the project's "geography-neutral
core mechanic, localized written layout" design principle — but the India leg of that claim rests
on secondary sources only.

---

## 4. AI value test — synthetic action-trace scenarios and honest AI-washing verdict

### Design premise
7-9-year-olds cannot reliably produce diagnostic typed self-explanations (this matches the
brief's own stated weakness, and is consistent with general findings on children's limited
metacognitive verbal reporting at this age — not separately re-verified as a new citation in this
pass, treated as a design constraint rather than a claim needing its own source). The AI value test
below is therefore built around **action traces** (sequences of drag/tap/break events with
timestamps) plus **optional tap-to-answer** micro-responses, not free-text explanation.

### 8 synthetic action-trace scenarios ending in the same wrong answer (35) via different paths

For 42 − 17, all scenarios below end with the learner recording "35" as the answer (7−2=5 style
digit-reversal signature), but the **action trace** that produced it differs:

1. **Reversal-clean:** Learner never attempts to remove any units from the ones column beyond
   what's present; taps "2" and "7" and records 5 directly in the ones without ever touching the
   rods. No unbundle attempt, no failed drag.
   - Deterministic bug library: classic smaller-from-larger, high confidence (matches the exact
     VanLehn/Raghubar-glossary signature). — AI adds nothing beyond template selection.

2. **Reversal-after-failed-drag:** Learner tries to drag 7 units off the 2 loose units, sees the
   shortfall-of-5 visual, then abandons the physical action and manually types/taps "35" anyway
   (ignoring the game's own feedback).
   - Deterministic: same bug tag, but now with an extra observed fact — the learner *saw* the
     impossible-move signal and overrode it. This is diagnostically richer than #1: it suggests
     either the learner doesn't trust/understand the shortfall visual, or is guessing/rushing.
     Rule-based logic can already flag "bug + ignored-feedback" as a distinct sub-case.
   - Genuine possible AI value: distinguishing "ignored because didn't understand the visual" vs.
     "ignored because rushing/didn't care" needs modeling attention/pacing, which a rule threshold
     can also do (e.g., time-between-shortfall-and-answer). Marginal AI value here is low.

3. **Borrow-no-decrement:** Learner correctly unbundles a rod into 10 units (4 rods+2 units →
   3 rods+12 units), correctly removes 7 units from the 12, correctly removes 1 rod... but the
   *recorded* symbol trace still shows "4" tens rather than "3" tens (forgot to record the
   decrement), giving 35 as a transcription artifact of a substantively different, more advanced
   bug.
   - Deterministic bug library: this is a **different bug** from #1 despite identical final
     answer — "borrow-no-decrement" per VanLehn's glossary (also seen at 12-18% rates in Raghubar
     et al.). A purely answer-based check (only look at "35") cannot distinguish this from #1; an
     action-trace-aware deterministic system *can*, because it watched the unbundle and removal
     actions.
   - AI value: none needed — this is exactly the kind of thing a deterministic state machine
     watching legal moves already resolves better than an LLM could (this is Lee & Corter's whole
     point: rule/probabilistic models over structured actions beat guesswork).

4. **Borrow-from-wrong-place:** Learner unbundles a rod correctly, but takes the freed units from
   the *hundreds* rod's tens-group mentally (in a 3-digit transfer problem like 300−47) rather than
   the adjacent column — a place-value mapping error layered on top of a valid unbundling action.
   - Deterministic: flags a **different, place-mapping-specific** bug tag, again purely from
     watching *which* rod was broken and where the units landed. No AI needed.

5. **Slip (single occurrence):** Learner has unbundled correctly and removed 7 units correctly
   many times before; on this one trial, mis-taps and removes only 6 units instead of 7, then
   mis-counts and reports 35 anyway. Same wrong answer, but the trace shows correct method,
   miscounted execution — i.e., a **slip**, not a bug (per VanLehn's bug/slip distinction).
   - Deterministic: bug library already encodes "consistent across N trials" vs. "one-off" as the
     defining test for slip-vs-bug (this is literally VanLehn's own operational definition) — a
     rule can apply this without any model.
   - Genuine AI angle candidate: after a slip (not a bug), the *tone* of feedback should differ —
     "you know how to do this, that was just a fast-fingers moment" vs. a full misconception
     explanation. Generating a warm, correctly-calibrated tone for a one-off slip (as opposed to a
     scripted "try again" that risks sounding either patronizing for a slip or too soft for a real
     bug) is a plausible, if modest, LLM-appropriate task — better call it "tone calibration," not
     "diagnosis."

6. **Guess / no attempt at mechanism:** Learner opens the rods/units screen, does nothing with the
   manipulatives at all (no drags, no unbundle attempts), and directly types/taps "35" within 2
   seconds of the problem appearing.
   - Deterministic: fast time-to-answer + zero manipulation events = "no engagement with the
     representation" flag, entirely rule-detectable (a timestamp + event-count threshold).
   - No genuine AI value here either — this is a classic guessing/disengagement signature that a
     threshold catches as well as or better than a model (a model risks false "sophistication" by
     inventing a story for what is actually just non-engagement).

7. **Correct method, mis-recorded answer:** Learner correctly unbundles, correctly removes 17
   units total (10 from a broken rod's units plus 7... i.e. genuinely gets 2 rods + 5 units = 25
   remaining), but then fat-fingers the numeral entry and types "35" instead of "25" (adjacent-key
   or digit-transposition slip at the *symbol* layer, unrelated to the *quantity* layer).
   - Deterministic: this is trivially distinguishable from every bug above, because the
     rods-and-units state at the moment of the typo is objectively "2 rods, 5 units" — the
     deterministic quantity truth contradicts the typed "35" outright. No ambiguity, no AI needed;
     this is exactly the kind of case where "deterministic math is the source of truth" earns its
     keep.

8. **Reversal but with a self-correcting retry within the same session:** Learner does scenario
   #1 (clean reversal), gets contrast-pair feedback, then on 47−12 (the paired problem in the
   brief's example) suddenly performs the unbundle correctly and gets 35... but that 35 is
   *correct* for 47−12! So the *same numeral* 35 appears once as a bug-signature wrong answer (for
   42−17) and once as a correct answer (for 47−12) in the same short session — a reminder that
   "ends in the same wrong answer" only means something in the context of the specific problem,
   which the deterministic engine already tracks per-item.
   - This scenario exists mainly to test whether any diagnostic logic (rule-based or AI) gets
     confused by numeral-level pattern matching across different problems — a well-built
     deterministic system keyed on problem+trace, not on the bare numeral "35", handles this
     correctly by construction.

*(This yields 8 of the requested 8-10; two more optional variants — "borrow attempted on the wrong
column of a 3-digit transfer problem," and "unbundle-then-abandon, i.e., breaks a rod, gets
distracted/times out, never completes the removal" — follow the same pattern: every one of them is
resolvable by watching the structured action trace with deterministic rules. None required
free-form language understanding to disambiguate mechanism.)*

### Honest verdict: is there a genuine AI responsibility here, or is this AI-washing?

**Mechanism diagnosis itself: no genuine AI need.** Every one of the 8 scenarios above is
distinguishable using deterministic logic over the structured action trace (which rods were
broken, how many units were moved, in what order, with what timing, compared against the legal
move rules and the bug glossary). This matches the disconfirming evidence directly: bug diagnosis
has been a solved *deterministic/probabilistic* problem since Brown & Burton (1978)/Burton (1982),
refined by Lee & Corter (2011) using Bayesian networks over structured items — not by natural
language understanding. Using an LLM to do what a rule/lookup table already does better, with more
auditability and no hallucination risk, would be a textbook case of AI-washing, and the brief's own
self-assessment ("diagnosis has been deterministic since DEBUGGY... AI role confined to explanation
handling") is correct and should not be argued away.

**Where a genuine, if modest, AI contribution can honestly be defended:**

1. **Contrast-pair explanation generation in learner-appropriate, localizable language** —
   given a *confirmed* bug tag (from the deterministic system) plus the learner's own trace
   (e.g., "you broke a ten and took out 7 units, then also took the extra 2" for a
   borrow-no-decrement case), an LLM constrained to the bug-library's approved template slots can
   generate warmer, more varied, age-appropriate phrasing than a fixed string bank, and can do so
   directly in the configured display language without a human translating every template into
   every supported language ahead of time. This is a real production concern (localization
   coverage) that a template bank handles only up to the number of languages someone pre-writes,
   while a constrained LLM call can extend coverage on demand. **Rating: legitimate but modest —
   this is "language/localization latitude," not "diagnosis."** A rules-only fallback (fixed
   template bank in a handful of languages) must still exist and be demonstrably equivalent in
   correctness, per the brief's own fallback requirement.

2. **Tone calibration for slip vs. bug vs. guess** (scenario 5 above) — choosing *how warmly or
   neutrally* to phrase a retry prompt based on the bug/slip/guess classification (already computed
   deterministically) is a bounded language-generation task suited to a small constrained model.
   **Rating: legitimate but small-surface-area** — could also be done with 3-4 pre-written tone
   variants selected by rule, so the AI's marginal value over "if slip: use tone_bank[2]" is
   genuinely thin. Be honest about this in the pitch: it is a nice-to-have polish, not a load-bearing
   AI responsibility.

3. **"Why didn't that work?" tap-to-answer dialogue** — after an impossible-move shortfall, offer
   2-3 tappable candidate reasons (e.g., "there weren't enough loose units," "I need to break a
   ten first," "I don't know") generated or selected by a model from the bug library's known
   explanations for *that specific* impasse, personalized to *that specific* trace rather than a
   single generic hint. **Rating: this is probably the most defensible "genuine AI responsibility"
   candidate of the set**, because it (a) uses the child-safe tap-to-answer format instead of
   requiring typed language from a 7-9-year-old, (b) is grounded strictly in the deterministic
   bug library (cannot invent a diagnosis, only phrase/select among pre-approved candidate
   explanations tied to the actual trace), and (c) has a clean, demonstrable deterministic
   fallback (show the top-ranked candidate reason without the tap-to-choose framing). It still is
   not diagnosis — the diagnosis is done; this is candidate-explanation selection/phrasing — but it
   is closer to "genuinely could not be done as well by a fixed lookup" than options 1-2, because
   the number of (bug × trace-specific-phrasing) combinations is combinatorially large enough that
   full pre-authoring becomes impractical at scale, which is the actual test the brief sets
   ("something rules cannot do as well").

4. **LLM summarizing evidence for a parent/teacher in plain language** — given the deterministic
   session log (bug tags observed, dates, contrast-pair results, retry outcomes), generate a
   short, jargon-free progress note. **Rating: legitimate and low-risk** (summarization of
   already-true structured data, not diagnosis, low harm if imperfect, easy fallback = a templated
   report), but it is a *reporting* feature, not a *learning-loop* feature, so it does less to
   satisfy the "AI has a role in the core loop" framing that judges likely want to see
   demonstrated live in a 3-minute video. Good secondary/bonus feature, not a strong headline AI
   moment.

**Overall verdict on this section:** There is a **real but narrow** AI responsibility available —
option 3 (trace-grounded candidate-explanation dialogue) is the most defensible, because it
operates on genuinely combinatorial content (bug × specific trace details) that a fixed template
bank cannot fully pre-author, while staying within a tap-to-answer format realistic for the age
group and remaining strictly downstream of a deterministic diagnosis. Options 1, 2, and 4 are
legitimate but honestly closer to polish/localization/reporting than to "an AI responsibility
rules cannot do as well" in the core loop. The typed-explanation mechanism described in the
original brief (learner types "I did 7 take away 2") should be **dropped or demoted to an optional
adult-facing/synthetic-tester-only channel** given the well-known unreliability of typed
self-explanation from 7-9-year-olds — the action-trace-plus-tap-to-answer design above is the
more honest, more age-appropriate substitute, and it still leaves you with one genuine, demoable
AI moment (option 3) rather than zero.

---

## 5. Demo spine (3:00 max)

- **0:00-0:20 — Setup.** One learner profile card (synthetic, labeled as such), 42 built as
  4 rods + 2 units on screen, problem "42 − 17" shown.
- **0:20-0:45 — The wrong answer happens first.** Show the learner (adult enacting synthetic
  profile) reasoning column-by-column, producing "35" via the classic reversal — either by direct
  digit entry or by a doomed drag attempt. Make the reversal legible to a judge watching without
  audio (captions/on-screen digits).
- **0:45-1:05 — The impossible move.** Learner tries to drag 7 loose units off the 2 available;
  visible shortfall-of-5 indicator fires. This is the core "math embodied in the action" beat —
  linger on it, since it is the single strongest evidence against "themed multiple-choice quiz."
- **1:05-1:25 — Deterministic support ladder, stage 1-2.** Rod's break affordance pulses; learner
  breaks a rod (3 rods + 12 units), completes the removal, lands on the correct quantity
  (2 rods + 5 units = 25), symbol trace updates without forcing one written layout.
- **1:25-1:55 — The one genuine AI beat.** After the earlier failed drag was logged, the AI
  surfaces 2-3 tap-to-answer candidate explanations grounded in that specific trace (not a generic
  hint) — learner taps "I need to break a ten first" — followed by a short, warm, localizable
  explanation line referencing the learner's own attempted action. State on-screen or in narration
  that this step is AI-generated and constrained to the deterministic bug library, with a
  fallback template shown briefly side-by-side (proves the fallback exists without needing a
  live failure demo).
- **1:55-2:20 — Contrast pair.** Show 47 − 12 immediately after: no unbundling required, learner
  completes it fluently, and a short side-by-side freeze-frame contrasts "this one needed breaking
  a ten, this one didn't — why?" tied to the digit comparison, not a rule to memorize.
- **2:20-2:45 — Transfer.** Cut to 300 − 47 (across-zero transfer case): learner applies the same
  unbundle logic recursively (hundred → tens → ones), demonstrating the mechanic generalizes
  rather than being a special-cased puzzle.
- **2:45-3:00 — Close.** One sentence stating the deterministic/AI boundary explicitly (math and
  diagnosis are rules; AI's job is the specific explanation dialogue you just saw), plus a spaced
  re-test teaser (same misconception probed again days later) to signal this is a loop, not a
  one-shot demo trick.

---

## 6. Top 5 reject reasons and mitigations

1. **"Looks like every other base-ten-blocks app."** Mitigation: the demo must foreground the
   *impossible move* (forced failure before success) and the *live symbol trace without a fixed
   written layout*, both less common in commodity base-ten apps, which usually let you drag any
   number of units freely or pre-animate the borrow. Say explicitly, on screen or in narration,
   why this differs from a "count the blocks" app (per Chan, Au & Tang 2014's point, already in
   the team's existing register, about canonical pictures permitting rote success — the same
   critique commodity apps are vulnerable to).

2. **"AI is decorative."** This is the single most dangerous reject reason given this candidate's
   own honest self-assessment above (Section 4) that most AI-shaped roles here are narrow. Mitigation:
   commit hard to option 3 (trace-grounded candidate-explanation dialogue) as the one AI beat,
   show the deterministic bug-library boundary explicitly in the video (a visible "constrained by:
   [bug tag]" indicator when the AI speaks), and show the fallback path briefly so judges see the
   system does not silently depend on the model. Do not claim the AI "diagnoses" anything — say
   "the rules diagnose, the AI explains," on screen, in those words if useful.

3. **"Bug diagnosis was solved in 1978; nothing new here."** True and unavoidable given the
   evidence gathered above (Brown & Burton, DEBUGGY, Lee & Corter). Mitigation: don't compete on
   "we invented diagnosis" — compete on (a) the specific game-mechanic embodiment of the
   impossible-move-forces-unbundling insight as a *play action* rather than a worksheet, and
   (b) honestly citing the 1978-2011 lineage as prior art you're building the interaction layer
   on top of, which reads as more credible to a technically literate judge than pretending it's
   novel.

4. **"Diagnosis from one wrong answer / one contrast pair is not reliable" (bug instability).**
   This is a real, full-text-verified risk (Section 2b). Mitigation: do not claim mastery or a
   permanent misconception label from one session in the demo narration; explicitly show the
   spaced re-test teaser (2:45-3:00 beat) as the mechanism that addresses instability, consistent
   with VanLehn's own finding that a single observation is not enough.

5. **"Typed self-explanation from a 7-9-year-old is unrealistic — the original design leans on
   it."** Confirmed as a real weakness by general knowledge of child metacognitive reporting
   limits and implicit in the brief's own flagged concern. Mitigation: the redesign in Section 4
   already drops typed explanation in favor of action-trace-plus-tap-to-answer — make sure the
   actual build follows this, not the original typed-explanation design, or this reject reason
   remains live.

---

## 7. Verdict

**Build-readiness: 3/5.**

Reasoning: the core mechanic (forced unbundling via an impossible drag) is mathematically sound,
well-precedented (Fuson & Briars-style concrete-to-symbol linkage), and satisfies "math embodied in
action, not themed multiple choice." The misconception itself is exceptionally well-evidenced
(Section 1.4, 1.6, 2b — probably the best-evidenced candidate available to this team, better
sourced than the ten-for-one hypothesis currently in the docs). What holds it at 3 rather than
4-5: (a) the AI-responsibility question is real and only narrowly resolved (one honestly-defensible
AI beat, not several), so the build must be disciplined about scoping to exactly that one AI
touchpoint rather than drifting into decorative AI elsewhere; (b) the original design's reliance on
typed self-explanation needs an actual redesign (already sketched above) before implementation,
which is a scope change, not just a caveat; (c) several supporting numbers in the original brief
(VanLehn's exact 37%/~1,000-student figures, the Spanish 7,140-subtraction study's grade breakdown,
NCERT's exact chapter) could not be verified in this bounded pass and should either be re-verified
or dropped from any pitch materials/demo narration before they're stated as fact.

### Three most important open questions
1. **Can the team actually implement and demo the "trace-grounded tap-to-answer candidate
   explanation" AI feature (Section 4, option 3) within the 6-day window**, including a working,
   demonstrable deterministic fallback? If not, is there enough time/appetite to accept a thinner
   AI story (options 1/2/4) and be transparent with judges about that being intentionally modest,
   or should the team reconsider whether this candidate can carry a credible AI narrative at all
   relative to the ten-for-one candidate?
2. **Does the team have (or can it quickly get) a corrected, verified version of the exact
   VanLehn-lineage numbers** (the ~1,000-student/37%-compound-bug claim) before committing to cite
   them anywhere public — or should the team simply lean on the full-text-verified Raghubar et al.
   (25-31% vs 9%) and Lee & Corter (bug instability, NAEP 50%/15%) numbers instead, which are
   solid, and drop the unverified VanLehn specifics entirely?
3. **How will the spaced re-test / multi-session mastery signal actually be implemented and shown**,
   given that Lee & Corter's full-text-verified finding is that single-observation bug diagnosis is
   explicitly *not* considered reliable in this literature — does the 6-day build genuinely support
   a multi-session mastery mechanic, or does the demo need to simulate/fast-forward through
   sessions to make this credible on video?

### Relationship to the team's existing "ten-for-one unitizing" hypothesis
This subtraction candidate is **not** a simple reframing of the existing addition/regrouping
hypothesis in `docs/research/grade-2-3-misconceptions.md` — it is a distinct, arguably more
mature and better-evidenced misconception, but it shares the identical underlying mathematical
object (the ten-for-one exchange) applied in the opposite direction (un-bundling/taking apart
instead of bundling/putting together). Concretely:

- **What carries over directly:** the core representational commitment (proportional, countable
  rods and units; an explicit, non-automatic exchange action as the play mechanic, not an
  animation after a multiple-choice answer); the deterministic/AI boundary framework already
  written in the existing doc's "Deterministic and AI boundary" section applies almost verbatim to
  this candidate, since both are downstream of "quantity truth is not AI's job, action-pattern
  classification and constrained explanation might be"; the geography/curriculum-neutral framing
  (Section 6 of the existing doc) and its India/England curriculum citations are directly reusable
  since both candidates sit at the same tens/ones exchange concept; and the existing doc's Task C
  (ten-for-one unitizing/regrouping check, non-canonical quantity, exchange required) is
  structurally the **addition-direction sibling** of this subtraction candidate's core action —
  the same underlying "ten ones ⇄ one ten" equivalence is tested by *building up* to a new bundle
  (existing hypothesis) versus *breaking apart* a bundle to free enough units (this candidate).
- **What is genuinely new/different:** this candidate's target learner already has (per the
  brief's own framing) the prerequisite unitizing competence and instead has an **operational bug
  in the take-away procedure itself** — treating columns as independent rather than failing to
  see a ten as breakable in the first place. That is a finer-grained, more specific claim than the
  existing doc's "does not independently perform a ten-for-one exchange in a non-canonical
  representation," and it is arguably a **downstream/transfer case** of the same underlying
  competence: a learner could pass the existing doc's Task C (build up to a ten) while still
  failing this candidate's forced-unbundling task (break down a ten under pressure of an
  impossible subtraction), because building and breaking are not guaranteed to be the same skill
  for a given child (this is itself an empirical question the existing doc does not resolve and
  this pass did not find literature directly comparing bundling-competence to unbundling-competence
  as separate constructs — flag as a genuine open research gap, not just a product one).
- **Bottom line:** treat this as a **complementary, more advanced variant** of the same core
  mechanic family, not a reframing that replaces the existing hypothesis, and not a wholly separate
  idea either. If the team wants one polished loop, the two most defensible options are (i) ship
  the existing ten-for-one *building-up* task as the core loop with this subtraction candidate's
  *forced-impossible-move* framing as a stronger design pattern borrowed into it (the "impossible
  drag" beat is a better UX hook than the existing doc's more passive "select exactly ten ones"
  framing), or (ii) ship this subtraction candidate as the core loop with the existing doc's
  Task A/B prerequisite-checking framing reused as pre-loop gating so a learner who cannot yet
  build a ten isn't thrown straight into breaking one apart. Either way, the existing research
  should not be discarded — most of its representational and AI-boundary reasoning transfers
  directly.

---

## Source list

- Brown, J. S. & Burton, R. R. (1978). Diagnostic Models for Procedural Bugs in Basic Mathematical
  Skills. *Cognitive Science*, 2, 155-192. https://onlinelibrary.wiley.com/doi/pdf/10.1207/s15516709cog0202_4
  (could not access — 403)
- VanLehn, K. (1990). *Mind Bugs: The Origins of Procedural Misconceptions.* MIT Press.
  https://mitpress.mit.edu/9780262512909/mind-bugs/ ; https://archive.org/details/mindbugsoriginso0000vanl
  (not fetched/OCR'd in this pass)
- VanLehn, K. (1982). Bugs Are Not Enough: Empirical Studies of Bugs, Impasses and Repairs in
  Procedural Skills. *Journal of Mathematical Behavior*, 3, 3-71. (not located online in this pass)
- Raghubar, K., Cirino, P., Barnes, M., Ewing-Cobbs, L., Fletcher, J., & Fuchs, L. (2009). Errors
  in Multi-Digit Arithmetic and Behavioral Inattention in Children With Math Difficulties.
  *Journal of Learning Disabilities*. https://pmc.ncbi.nlm.nih.gov/articles/PMC2788949/
  (full-text verified)
- Fernández/García (Spanish subtraction-errors study; exact title/year not fully confirmed).
  https://core.ac.uk/works/156713990 (403, could not access);
  https://academicjournals.org/article/article1379591831_Fern%C3%A1ndez%20and%20Garc%C3%ADa.pdf
  (binary/unreadable in this pass)
- Vermeulen, J. A., Béguin, A., Scheltens, F., & Eggen, T. J. H. M. (2020). Evaluating the
  Characteristics of Diagnostic Items for Bridging Errors in Multi-Digit Subtraction. *Frontiers
  in Education*. https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2020.537531/full
  (full-text verified; note: Dutch sample, not German)
- Fuson, K. & Briars, D. (1990). Using a Base-Ten Blocks Learning/Teaching Approach for First- and
  Second-Grade Place-Value and Multidigit Addition and Subtraction. *JRME*, 21(3), 180-206.
  https://pubs.nctm.org/view/journals/jrme/21/3/article-p180.xml (abstract/secondary-verified)
- Flores, M. et al. Using the CRA Sequence with Integrated Strategy Instruction to Teach
  Subtraction with Regrouping to Students with Learning Disabilities.
  https://www.researchgate.net/publication/264688220 (abstract-level)
- Flores, Hinton, & Strozier (2014). Teaching Subtraction and Multiplication with Regrouping Using
  the CRA Sequence and SIM. *Learning Disabilities Research & Practice*.
  https://eric.ed.gov/?id=EJ1029990 (abstract-level)
- Bouck, E., Satsangi, R., & Park, J. (2018). The CRA Approach for Students With Learning
  Disabilities: An Evidence-Based Practice Synthesis. https://journals.sagepub.com/doi/abs/10.1177/0741932517721712
  (abstract-level)
- ASER Centre (2024). Annual Status of Education Report 2024, National Findings.
  https://asercentre.org/wp-content/uploads/2022/12/ASER-2024-National-findings.pdf (binary/could
  not read directly); secondary: https://www.ideasforindia.in/topics/human-development/aser-2024-more-than-a-post-pandemic-recovery-in-learning
  (abstract-level)
- Jensen, S., Gasteiger, H., & Bruns, J. (2024). Place Value and Regrouping as Helpful Constructs
  to Diagnose Difficulties in Understanding the Place Value System. *Journal für
  Mathematik-Didaktik*, 45, 11. https://doi.org/10.1007/s13138-024-00234-8 (paywalled; abstract-level,
  consistent with existing evidence register E-007)
- Uttal, D. H. et al. (2013). It Works Both Ways: Transfer Difficulties between Manipulatives and
  Written Subtraction Solutions. *Child Development Research*.
  https://onlinelibrary.wiley.com/doi/full/10.1155/2013/216367 (403; abstract-level via secondary
  summary); https://www.researchgate.net/publication/260187604 (not fetched)
- Lee, J. & Corter, J. E. (2011). Diagnosis of Subtraction Bugs Using Bayesian Networks. *Applied
  Psychological Measurement*, 35(1), 27-47.
  https://www.tc.columbia.edu/faculty/jec34/faculty-profile/files/iagnosisofsubtractionbugsusingBayesiannetworks.PDF
  (full-text verified, pp. 1-4 read directly)
- Kouba, Zawojewski, & Strutchens (1997), NAEP subtraction-with-borrowing data, as cited full-text
  in Lee & Corter (2011) above (not independently re-verified against the original NAEP report).
- Common Core State Standards, 2.NBT domain. https://www.thecorestandards.org/Math/Content/2/NBT/
  (403, could not access directly; abstract-level via secondary sources)
- England DfE, Year 3 mathematics guidance / National Curriculum programmes of study (formal
  columnar subtraction). https://assets.publishing.service.gov.uk/media/61409475e90e07043fea1c45/Maths_guidance_year_3.pdf
  ; https://www.ncetm.org.uk/classroom-resources/cp-year-3-unit-7-column-subtraction/
  (abstract-level, not directly fetched)
- NCERT Class 3 subtraction-with-regrouping placement — no primary ncert.nic.in source located in
  this pass; secondary sources only (Vedantu, CrestOlympiads) — **flagged as unverified against
  primary curriculum documents.**
- Virtual manipulatives meta-analyses (contradictory effect sizes, cited as evidence of unsettled
  literature, not as a single number to quote): ERIC EJ1154970; and a second meta-analysis found
  via search reporting d≈1.6 (exact citation not fully resolved in this pass — treat with caution).
