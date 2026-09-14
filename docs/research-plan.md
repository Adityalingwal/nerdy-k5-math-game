# Bounded Research Plan

Status: research phase closed on 2026-09-08 by D-008 (decimal comparison
locked). Decisions 1-4 below were answered for the locked concept in
`research/deep/decimal-longer-is-larger.md`; the Grade 2/3 wording in
Decision 1 is historical. Remaining research is verification of any figure
before it appears in the submission.

The research exists to choose product behavior. It is not a general survey of
child psychology, neuroscience, or gamification.

## Geography and transferability

- Define the target through prerequisite knowledge and observable mathematical
  behavior rather than nationality alone.
- Treat base-ten relationships as the candidate common core, then test whether
  language, curriculum sequence, notation, instructional conventions, or
  cultural context change the interaction or interpretation.
- Triangulate official curriculum bodies from multiple regions with
  peer-reviewed cross-cultural and learner-error research. Do not generalize a
  finding from one country beyond the population and task actually studied.
- Keep `geography-neutral` as a design goal, not a claim of universal
  effectiveness. The first prototype remains one learner, one misconception,
  and one repeatable loop; localization is a boundary around the core, not a
  requirement to build every language or curriculum.

## Decision 1: learner and concept

Questions:

- Which Grade 2/3 place-value or addition misconception is common, consequential,
  and visible through a learner's actions?
- What prior knowledge does the learner need?
- What does mastery look like beyond answering one problem correctly?

Output: one learner profile, one misconception, prerequisite boundary, and a
measurable mastery definition.

## Decision 2: representation and feedback

Questions:

- Which concrete or visual representation best connects quantities, tens/ones,
  and written notation?
- How much information can this age group process in one step?
- What feedback helps the learner self-correct without revealing the answer?

Output: one primary interaction model and a three-level hint ladder.

## Decision 3: game mechanic and motivation

Questions:

- Which mechanic makes mathematical reasoning part of play?
- How should challenge, autonomy, progress, and rewards support mastery?
- Which common reward patterns distract, pressure, or encourage guessing?

Output: a core mechanic, progression rule, reward rule, and anti-pattern list.

## Decision 4: AI role

Questions:

- Which observable action patterns can support a defensible misconception
  diagnosis?
- Which decisions should be deterministic and which benefit from a model?
- How will uncertain AI output fall back safely?

Output: an event schema, misconception rules, model responsibility, fallback,
and one demo-visible adaptive moment.

## Evidence standard

Prefer primary and authoritative sources: peer-reviewed research, systematic
reviews, recognized education bodies, curriculum standards, and original tool
documentation. Record the exact claim each source supports in the evidence
register. Do not use a neuroscience claim unless it changes a concrete design
choice and is supported by credible evidence.

For consequential product choices, actively look for disconfirming evidence and
country or language limitations. Separate curriculum expectations, observed
learner behavior, intervention effects, and product-design inference; none of
these categories proves the others by itself.

## Validation sequence

1. Research the four decisions above.
2. Compare two or three narrow concept/mechanic candidates.
3. Lock one scope in the decision log.
4. Build a low-fidelity interaction prototype.
5. Test first with adults acting from scripted learner profiles.
6. If testing with children, obtain verifiable parental consent, collect no real
   student data, and retain no identifying media or personal information.
7. Convert findings into product changes and demo evidence.
