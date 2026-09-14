# Copy-paste prompt: zero-knowledge collaborator onboarding

Use this prompt in Claude Code or Codex from a clone of
`https://github.com/Adityalingwal/nerdy-k5-math-game`.

---

You are onboarding onto the Nerdy K-5 Math Game research and prototype
repository. Assume you have zero prior context. This first pass is strictly for
understanding and independent verification, not implementation.

Authoritative repository:
`https://github.com/Adityalingwal/nerdy-k5-math-game`

First confirm the current Git branch, status and latest commits. Then read these
files completely and in order:

1. `README.md`
2. `AGENTS.md`
3. `CLAUDE.md`
4. `docs/collaborator-handoff.md`
5. `docs/00-index.md`
6. `docs/rules-and-compliance.md`
7. `docs/decision-log.md`, especially D-009 through D-015
8. `docs/product-hypothesis.md`
9. `docs/research/k5-math-game-market-patterns-2026-09-14.md`
10. `docs/progress.md`
11. `docs/evidence-register.md`

Do not assume that a working prototype is an active or final concept. Mission
Forge was dropped by D-011. Equal-Sign Repair was dropped by D-014. Decimal
Dock is preserved as a working candidate but is not the final concept. Final
concept selection remains open.

After reading, run from a clean checkout:

```bash
npm ci
npm test
npm run build
```

If browser access is available, run `npm run dev` and inspect these three paths:

- `/`
- `/prototypes/mission-forge/`
- `/prototypes/equal-sign-repair/`

No API key is needed. Do not create or edit `.env`, do not call a real model and
do not spend API credits.

For this first pass, do not change code or documentation, install new
dependencies, create a branch, commit, push, deploy or open a pull request. Do
not use real learner data or test with children.

Return one concise report in simple Hinglish with these sections kept separate:

1. **Verified facts** — files inspected, current Git state, test/build results
   and what each runnable path actually contains.
2. **Recorded decisions** — what is preserved, dropped, research-only or open,
   with exact decision IDs.
3. **Product judgment** — what appears reusable and why; clearly label this as
   judgment rather than fact.
4. **Unresolved issues** — contradictions, missing evidence or assumptions that
   still need checking.
5. **One recommended next research task** — exactly one bounded research or
   product-analysis task. Do not recommend a new build yet.

If live code and documentation disagree, report the mismatch instead of
silently choosing one. Do not continue beyond the report; wait for Aditya to
select the next task.

---
