# Superseded Claude Code prompt

This Decimal continuation prompt was superseded by D-009 on 2026-09-09. Do not
use it for the next build. Use instead:

`docs/prototypes/mission-forge/claude-code-prompt.md`

The historical prompt is retained below as a record of the earlier Decimal Dock
plan.

## Historical prompt

Continue the Nerdy K-5 hackathon project "Decimal Dock" in
/Users/mac/Desktop/nerdy-k5-math-game. Respond in Hinglish, one step at a time,
short messages, ask before implementing, and ask which model a background agent
should use.

Where we are:
- Concept is locked (docs/decision-log.md D-008): decimal comparison
  "longer is larger", age 9-11, zoomable 0-1 dock, Robo erroneous examples, one
  bounded AI role via OpenRouter. Do not reopen the concept choice.
- MVP is built and verified on the fallback path (81 tests pass, full loop
  plays). Report: docs/build-notes/2026-09-08-mvp-build-report.md, especially
  sections 5 (open issues) and 6 (next steps). Nothing is committed yet.
- Plan and timeline: docs/implementation-plan.md (Day 4-7). Deadline
  2026-09-18 evening IST.

Read first, in order: docs/00-index.md, docs/implementation-plan.md,
docs/build-notes/2026-09-08-mvp-build-report.md. Then run `npm test` to
confirm the tree is healthy.

Then guide me through, one step at a time:
1. I will create `.env` myself with OPENROUTER_API_KEY and OPENROUTER_MODEL
   (never ask me to paste the key in chat).
2. Test the AI path once with the helper ON, run `npm run ai-value-test`, and
   show me the disagreement table in simple words.
3. Deploy to Vercel (I will log in myself) and check the signed-out URL.
4. Day 4 game-feel polish via a background agent (ask me for the model).
5. Day 5-6: demo script (spine in docs/research/deep/decimal-longer-is-larger.md
   section 5), video under 3 minutes, English description, disclosures,
   evidence-register audit.
6. Decide judge access (D-004) and freeze.

Rules that still apply: no real student data, no copyleft components, record
every dependency/model/asset in docs/evidence-register.md, update
docs/progress.md after material work, keep docs/ local (gitignored), and do not
commit or push unless I say so.
