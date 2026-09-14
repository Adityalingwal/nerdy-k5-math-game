# Nerdy K-5 Math Game — research and prototype archive

This public repository preserves the research, decisions, evidence and runnable
prototypes from an ongoing K-5 math-game exploration. **No final submission
concept is currently selected.** A working build or passing test is evidence
about an experiment, not a claim that the concept should ship or improves
learning.

Start with [`docs/00-index.md`](docs/00-index.md), then read
[`docs/decision-log.md`](docs/decision-log.md) for the exact selection history.
New collaborators should follow
[`docs/collaborator-handoff.md`](docs/collaborator-handoff.md) and use the
linked read-only onboarding prompt before proposing changes.

## Current concept status

| Direction | Status | What remains useful |
| --- | --- | --- |
| Decimal Dock | Preserved working candidate; not final | Deterministic decimal engine, browser game, tests and bounded AI fallback design |
| Mission Forge | Dropped by D-011 | Division-role world building, causal revision and review evidence |
| Equal-Sign Repair / Equalizer Lab | Dropped by D-014 | Four-path scripted UI, equality interaction findings and AI-value harness |
| Remainder Routing | Research only | Candidate research; no authorized build |

The dropped prototypes remain in `prototypes/` so another reviewer can run them
and understand why they were rejected. They are archive material, not active
product directions.

## Repository map

```text
docs/          canonical research, decisions, reports and evidence register
references/    dated source snapshots used by the research
src/           Decimal Dock reference implementation
tests/         deterministic Decimal Dock tests
scripts/       Decimal Dock evaluation and verification tools
prototypes/    runnable dropped concept prototypes
experiments/   bounded non-product AI-value harnesses
api/           optional server-side OpenRouter proxy for Decimal Dock
```

## Run the Decimal Dock reference app

```bash
npm install
npm run dev
npm test
npm run build
```

The root app runs without an API key. Without a key, its explanation classifier
and Robo examples use deterministic fallbacks. This does not establish that its
proposed runtime-AI contribution is valuable; that product question remains
open.

## Run the archived prototypes

Start `npm run dev`, then open:

- `http://localhost:5173/prototypes/mission-forge/`
- `http://localhost:5173/prototypes/equal-sign-repair/`

Both are isolated deterministic prototypes with no runtime AI or API key.
Their READMEs and build reports explain their limits and drop decisions.

## Environment variables

Only the optional Decimal Dock model path uses environment variables. Copy
`.env.example` to `.env`; never commit the real `.env` file.

| Variable | Required | Meaning |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | no | OpenRouter API key. Without it the app runs entirely on its deterministic fallbacks. |
| `OPENROUTER_MODEL` | no | OpenRouter model id. Defaults to `anthropic/claude-sonnet-5`. |

No real learner data is used in this repository. Do not test with anyone under
13 without the consent and data-safety process recorded in
[`docs/rules-and-compliance.md`](docs/rules-and-compliance.md).

## Evidence and generated files

Research text, reports, verification scripts and result logs are versioned.
Large generated prototype screenshot sets remain local and can be regenerated;
they are intentionally excluded to avoid adding about 50 MB of repetitive
binary history. A smaller Decimal Dock screenshot set is retained.

## Collaboration and rights

This is an individual hackathon project. Before any collaborator-authored code,
design, art or content is used in a submission, record who created it and obtain
any written rights assignment required by the official rules. Public visibility
does not grant an open-source license: no repository-wide license has been
added.
