# Collaborator onboarding and handoff

Last updated: 2026-09-14

## Purpose

This repository is a public research and prototype archive for an individual
K-5 math-game hackathon entry. A new collaborator should first understand the
research, run the existing work and produce an independent assessment. They
should not begin by modifying a dropped prototype or inventing a new platform.

No final product concept is currently selected.

## Current state in one minute

- **Decimal Dock:** working reference candidate, preserved but not final.
- **Mission Forge:** dropped by D-011 after one bounded revision.
- **Equal-Sign Repair / Equalizer Lab:** dropped by D-014 after scripted UI
  review.
- **Remainder Routing:** research only; no build is authorized.
- **Runtime AI:** no current real-model experiment is authorized.

The dropped code stays in the repository because it is useful runnable evidence
of what was tried and why the product gate failed. It is not active scope.

## First-session reading order

Do not read every deep-research file on the first pass. Read these completely,
in this order:

1. `README.md`
2. `AGENTS.md`
3. `CLAUDE.md`
4. `docs/00-index.md`
5. `docs/rules-and-compliance.md`
6. `docs/decision-log.md`, especially D-009 through D-015
7. `docs/product-hypothesis.md`
8. `docs/research/k5-math-game-market-patterns-2026-09-14.md`
9. `docs/progress.md`
10. `docs/evidence-register.md`

After that map is clear, use `docs/00-index.md` to choose only the deep research
or prototype report relevant to the question being investigated.

## First-session technical check

From a fresh clone:

```bash
npm ci
npm test
npm run build
npm run dev
```

Open and inspect:

- `/` — Decimal Dock reference candidate
- `/prototypes/mission-forge/` — dropped division-story experiment
- `/prototypes/equal-sign-repair/` — dropped equality experiment

No API key is required. Do not add `OPENROUTER_API_KEY` during onboarding.

## Required first deliverable

Before proposing or changing code, return a short independent onboarding report
with these sections:

1. **Verified facts:** what exists and what checks actually passed.
2. **Recorded product decisions:** what is preserved, dropped or still open.
3. **Product judgment:** the strongest reusable lesson from each experiment.
4. **Open questions:** facts or product assumptions that still need evidence.
5. **One recommended next research task:** one bounded task only, not a build.

Keep verified facts separate from interpretation. Cite exact repository files
and state which commands were run.

## Contribution workflow after onboarding

- Do not push directly to `main`. The simplest public workflow is fork, branch,
  then open a pull request back to this repository.
- Keep one purpose per branch and one logical concern per commit.
- Do not start a new prototype until Aditya accepts a recorded decision that
  authorizes it.
- Every pull request must state scope, tests run, dependencies/assets added, AI
  assistance used and unresolved questions.
- Never commit `.env`, keys, build output, private notes or real learner data.
- Do not test with anyone under 13 without the documented consent process.
- Do not copy third-party product art, characters, layouts or code. Record every
  new dependency, source, model, API and generative-AI contribution.

## Collaboration and submission-rights boundary

The hackathon entry is individual. If collaborator-authored code, research,
design, art or content may be used in the submission, record who created it and
obtain any written rights assignment required by the official rules before it
is incorporated into the submitted entry. A public repository does not remove
this requirement and does not grant an open-source license.

## Ready-to-use AI prompt

The copy-paste onboarding prompt is in
`docs/prompts/brother-onboarding-prompt.md`. Give that prompt to Claude Code or
Codex from the repository checkout. Its first pass is intentionally read-only.
