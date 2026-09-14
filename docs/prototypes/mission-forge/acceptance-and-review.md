# Mission Forge Prototype — Acceptance and Review

Use this after implementation. Passing this checklist means the prototype is
ready for a product decision; it does **not** mean the concept is validated or
selected for submission.

## A. Scope and repository safety

- [ ] All new runtime files are under `prototypes/mission-forge/`.
- [ ] Existing Decimal Dock implementation files are unchanged.
- [ ] No dependency, package script, API, model, key, network call, persistence,
      deployment, commit, or push was added.
- [ ] The runtime visibly says `Scripted concept prototype — no runtime AI`.
- [ ] Only adult-operated synthetic text was used.

## B. Complete playable loop

- [ ] Opening reaches a meaningful action within 10 seconds.
- [ ] `12 / 3 = 4` story input is editable and can build the intended mission.
- [ ] The compile reveal visibly maps 12, 3, and 4 to mission roles.
- [ ] Robo builds the plausible wrong world: 3 ships, 4 crystals each.
- [ ] The player can reject and debug that interpretation.
- [ ] Repair is spatial/constructive, not only answer entry.
- [ ] Four ships with three crystals each launch successfully.
- [ ] `20 / 5 = 4` transfer reverses which quantity is fixed/unknown.
- [ ] Replay resets every state without refreshing the browser.

## C. Game feel and interface

- [ ] The initial view reads as a game scene, not a dashboard or form.
- [ ] Robo has curious, confidently-wrong, and understood expressions.
- [ ] The story-to-world transformation is the strongest motion beat.
- [ ] World consequences communicate the mismatch beyond a red/green marker.
- [ ] Text remains short and does not obscure the playfield.
- [ ] Desktop 1280 x 720 and mobile-like 390 x 844 are both usable.
- [ ] Keyboard completion, visible focus, reduced motion, and non-colour cues
      work.
- [ ] No console errors occur through two complete replays.

## D. Regression checks

Run from the repository root:

```bash
npm test
npm run build
```

- [ ] Existing test suite passes.
- [ ] Existing production build passes.
- [ ] Decimal Dock still opens and plays as before.
- [ ] Mission Forge opens at `/prototypes/mission-forge/` through `npm run dev`.

If an existing check fails, report the failure. Do not rewrite unrelated code to
make the prototype pass.

## E. Required review evidence

Capture these screenshots under:

```text
docs/evidence/prototypes/mission-forge/
```

1. Opening equation and Robo prompt.
2. Editable story forge.
3. Story-to-world compile reveal/result.
4. Robo's 3-ships/4-each wrong interpretation.
5. Corrected 4-ships/3-each launch.
6. Contrasting transfer mission.
7. Final learning summary.
8. One narrow/mobile-like viewport.

Also create:

```text
docs/prototypes/mission-forge/build-report.md
```

The report must state:

- exact files created and modified;
- exact local URL and run command;
- what is genuinely interactive versus scripted;
- tests/build/manual checks run, with exact results;
- any acceptance items that failed or remain partial;
- screenshots captured;
- dependencies/assets/network calls added (expected: none);
- known limitations and the best reason to reject the concept.

## F. Aditya's decision scorecard

After Aditya plays it, record 1-5 ratings. These are product judgments, not
scientific learner-study results.

| Question | Rating | Notes |
| --- | ---: | --- |
| I understood the goal without explanation |  |  |
| The first meaningful action came quickly |  |  |
| Story becoming a world felt surprising or satisfying |  |  |
| Robo's mistake made sense |  |  |
| Debugging felt like play rather than a worksheet |  |  |
| I understood what `3` and `4` counted |  |  |
| I wanted to try another story |  |  |
| Real AI would clearly improve this core loop |  |  |
| This is stronger than Decimal Dock |  |  |
| This appears viable for a three-minute demo |  |  |

## G. Decision gate

Choose exactly one after review:

- **Advance:** game promise is clear; next test is real AI story parsing against
  a deterministic schema.
- **Revise once:** one specific interaction blocks an otherwise promising loop;
  authorize one bounded correction.
- **Drop:** it reads as a writing exercise/worksheet, the semantic distinction
  is unclear, or the AI promise is not worth the complexity.

Do not silently expand the prototype after review. Any next step needs a recorded
decision.
