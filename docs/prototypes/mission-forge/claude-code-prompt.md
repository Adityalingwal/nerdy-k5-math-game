# Claude Code Build Prompt — Mission Forge Scripted Slice

Copy everything below into a fresh Claude Code session.

---

Work in the authoritative repository:

`/Users/mac/Desktop/nerdy-k5-math-game`

Do not use the deleted old workspace under `/Users/mac/Documents/Codex/...`.

Your task is to implement one isolated, scripted, playable Mission Forge
vertical slice for product evaluation. This is not a production rebuild and
does not select Mission Forge as the final hackathon concept.

Before changing anything, completely read these files in order:

1. `AGENTS.md`
2. `docs/00-index.md`
3. `docs/rules-and-compliance.md`
4. `docs/decision-log.md`, especially D-008 and D-009
5. `docs/prototypes/mission-forge/build-brief.md`
6. `docs/prototypes/mission-forge/acceptance-and-review.md`

Then inspect `git status`, the current file tree, and only the minimum existing
Vite configuration needed to confirm that a nested HTML page can be served.
Preserve all existing uncommitted work.

Implement the complete experience specified in the build brief. The required
runtime location is:

```text
prototypes/mission-forge/
  index.html
  styles.css
  main.js
  README.md
```

Hard boundaries:

- Add no dependency and make no network/model/API call.
- Do not run Fusion, spawn an agent swarm, or start another broad ideation
  pass. The product and visual direction for this slice are already bounded.
- Do not pretend the scripted interpreter is AI. Display the exact disclosure:
  `Scripted concept prototype — no runtime AI`.
- Do not edit the existing root `index.html`, `src/`, `api/`, `scripts/`,
  `package.json`, lockfile, Vite config, TypeScript config, or existing tests.
- Do not commit, push, deploy, change repository visibility, or request an API
  key.
- Do not use third-party or copied fonts, images, icons, characters, audio, or
  code. Use original CSS/inline SVG/procedural visuals only.
- Do not use real student data or test with a child. Use synthetic inputs with
  an adult operator.
- Keep the target to one division misconception and exactly the two scripted
  missions in the brief. No remainder content or extra curriculum.
- Keep semantic mission state separate from DOM rendering/animation logic.
- Math and mission-role truth must be deterministic.
- Keep the playfield visually dominant; avoid dashboard UI and a permanent chat
  panel.
- Support pointer and keyboard completion, mobile-like layout, visible focus,
  and reduced motion.

Execution expectations:

1. Start by giving Aditya a concise Hinglish checkpoint: what you verified,
   what you will create, and what you will not touch. Do not ask for design
   decisions already specified in the brief.
2. Implement the entire loop before optional polish.
3. Run `npm test` and `npm run build` to prove the existing app still passes.
4. Start the existing Vite dev server and open both Decimal Dock and
   `/prototypes/mission-forge/` in a real browser.
5. Complete Mission Forge twice, including one narrow/mobile-like viewport.
   Check console errors, keyboard path, replay reset, and reduced-motion
   behavior.
6. Capture the required screenshots listed in
   `docs/prototypes/mission-forge/acceptance-and-review.md`.
7. Create `docs/prototypes/mission-forge/build-report.md` with exact evidence,
   failures, limitations, and the strongest reason to reject the concept.
8. Update `docs/progress.md` and `docs/evidence-register.md` only with verified
   implementation/test/asset facts. Do not lock the concept or change D-009.

Quality bar:

- The first meaningful action appears within 10 seconds.
- The equation-to-world compile reveal is the strongest delight moment.
- Robo's wrong `3 ships with 4 crystals each` interpretation is plausible and
  visually understandable.
- Repair requires constructing `4 ships with 3 crystals each`, not entering an
  answer alone.
- The `20 / 5 = 4` transfer mission reverses the role of the known quantity.
- The full unfamiliar-adult run is understandable in 2-3 minutes.

If a requirement conflicts with the repository or cannot be completed safely,
stop that part and report the exact blocker. Do not improvise by modifying the
existing Decimal implementation or expanding scope.

At completion, respond in concise Hinglish with:

- local URL;
- files created/modified;
- exact test/build/browser results;
- screenshot and build-report paths;
- incomplete acceptance items;
- your strongest evidence-based concern about the concept.

---
