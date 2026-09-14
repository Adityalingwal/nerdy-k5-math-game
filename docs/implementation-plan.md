# Implementation Plan: Decimal Dock (working title)

Status: historical plan for the implemented Decimal Dock candidate (D-008).
Final concept selection was reopened by D-009; do not apply this plan to Mission
Forge unless a later decision explicitly restores it.
Last updated: 2026-09-08. Entry closes 2026-09-18 11:59 PM CT
(= 2026-09-19 10:29 AM IST). Target: submit by evening of 2026-09-18 IST.

## 1. What we are building (one paragraph)

A browser game for a learner aged 9-11 who compares decimals as whole numbers
(0.45 > 0.8 "because 45 > 8", or the reverse shorter-is-larger rule). The
learner drops decimal-labelled packages at their position on a 0-1 dock (a
number line) and can zoom the dock into tenths and hundredths. The deterministic
engine infers the learner's rule from placements, shows the zoom that exposes
the error, asks the learner why, then serves an erroneous example ("Robo's
delivery log") matched to the learner's own rule, which the learner must find,
fix, and explain. Transfer items defeat both length rules, then money and
measurement contexts. One bounded AI role: classify the learner's typed
explanation into closed labels with a confidence gate, write the matched
erroneous example, and phrase explanations. The model never decides magnitude.

## 2. Stack (all permissive licenses; record each in the evidence register)

- Vite + TypeScript (MIT).
- PixiJS v8 (MIT) for the game canvas: dock, packages, zoom lens, animations.
- Thin DOM overlay (plain HTML/CSS, no UI framework) for the explanation text
  box, prompts, profile picker, and the "model on/off" toggle. Real text input
  and accessibility are easier in DOM than in Pixi.
- Serverless function (Vercel `api/`) that proxies the LLM. The API key never
  ships to the browser. One endpoint, two operations: `classify` and
  `erroneous-example`.
- LLM access through OpenRouter (Aditya's existing key), using its
  OpenAI-compatible chat-completions endpoint (`https://openrouter.ai/api/v1`)
  via plain `fetch` (no vendor SDK needed). Model id is configuration
  (`OPENROUTER_MODEL` env var), so any Claude, OpenAI, or other model can be
  swapped without code changes. Default: a Claude Sonnet-class model id as
  listed by OpenRouter's `/models` endpoint at build time (verify the exact id;
  do not guess). The key lives only in `.env` (gitignored) locally and in
  Vercel environment variables; Aditya enters it himself. Disclose OpenRouter
  plus the underlying model in the evidence register and submission.
- Fonts: system font stack only (no Google Fonts; OFL has a reciprocal clause
  and the rules ban reciprocal components). Sounds: Web Audio synthesized
  bleeps or none. Graphics: procedural Pixi shapes and our own SVGs. No
  third-party art.
- Hosting: Vercel (static + function). Must stay up through 2026-09-23.
  Budget API credits for a week of judges; cache generated erroneous examples
  per rule so repeat viewers do not burn calls.
- Tests: Vitest for the deterministic engine and the classifier fallback.

## 3. Deterministic engine (source of truth)

### 3.1 Numbers
- Every decimal is stored as an integer count of thousandths plus a display
  string. Never compare floats. Display honours a `separator` config
  (`.` or `,`) and never affects the value.

### 3.2 Item bank (from Steinle and Stacey, PME27 2003, Table 1, full-text verified)
- Type 1 items (the longer decimal is SMALLER; L-thinkers fail, S-thinkers pass):
  4.8 vs 4.63; 0.5 vs 0.36; 0.8 vs 0.75; 0.37 vs 0.216; 3.92 vs 3.4813.
- Type 2 items (the longer decimal is LARGER; S-thinkers fail, L-thinkers pass):
  5.736 vs 5.62; 0.75 vs 0.5; 0.426 vs 0.3; 2.8325 vs 2.516; 7.942 vs 7.63.
- Our dock is 0-1 by default, so use the 0-1 pairs above verbatim and add
  structurally identical 0-1 pairs (for example 0.8 vs 0.63, 0.7 vs 0.485,
  0.6 vs 0.512 as Type 1; 0.736 vs 0.62, 0.825 vs 0.516 as Type 2). Tag every
  item with its type. Items above 1 can be used later with a 0-10 dock; not in
  the demo.
- Transfer items (not used for classification): 0.7 vs 0.65 and 0.099 vs 0.1
  (defeat both rules), 0.8 vs 0.80 (trailing zero), 7.942 vs 7.94 style
  (same tenths digit; separates true experts from tenths-only comparers, about
  12% of "A" codes per the paper), order five decimals, money (0.5 vs 0.45 in
  configured currency), measurement (1.05 m vs 1.5 m).

### 3.3 Rule classifier (coarse codes, per the paper's tolerant coding)
- Present at least 4 Type 1 and 4 Type 2 items (interleaved) before coding.
- L = at most 1 correct on Type 1 AND at least (n-1) correct on Type 2.
- S = at least (n-1) correct on Type 1 AND at most 1 correct on Type 2.
- A = at least (n-1) correct on both.
- U = anything else.
- The code is inferred per session and never stored as a trait. Re-infer after
  the erroneous-example phase; mastery is judged on transfer items only.
- With placement (not just "circle the larger"), also record signed position
  error, which gives a second signal: L-thinkers place 0.45 far right; guessers
  scatter.

### 3.4 Loop state machine
1. PROFILE: pick a synthetic profile (L-type "Maya", S-type "Sam", guesser,
   expert) or "play yourself". Profiles only pre-fill nothing; they are demo
   labels and scripted operator guidance.
2. PLACE: 8 items. Package arrives; learner drags it to the dock. Engine
   records position and correctness (larger-than / smaller-than the partner).
3. INFER: code L/S/A/U. If A, skip to TRANSFER. If U, go to WORKED (a correct
   worked example with zoom), then back to PLACE with 4 fresh items.
4. ZOOM: replay the most diagnostic wrong item. Lens zooms 0-1 to tenths to
   hundredths; the true positions appear; 0.8 becomes 0.80 in place.
5. WHY: "Why did you put 0.45 there?" Text box (optional; skip allowed). The
   text goes to `classify` (or the keyword fallback). Labels: L, S, MONEY,
   SLIP, GUESS, UNCLEAR, plus confidence. Below 0.6 -> UNCLEAR.
6. ERRONEOUS: "Robo sorted these. Find the mistake." The example was requested
   in the background the moment INFER produced L or S (latency hidden). The
   engine verifies the generated example before showing it (see 4.3). The
   learner drags the wrong package to the right spot and types one line.
   The correction text is classified: positional reason -> TRANSFER; answer
   flipped without reason or UNCLEAR -> one more erroneous example (max 2),
   then TRANSFER anyway. SLIP at WHY -> skip straight to TRANSFER.
   GUESS/UNCLEAR at WHY -> WORKED example first, then ERRONEOUS.
7. TRANSFER: 5 items (both-rule-defeating pair, trailing zero, tenths-tie,
   money, measurement). Mastery = 4 of 5 with no length-rule signature.
8. SUMMARY: what the learner did, in plain words; "play again" reshuffles
   items. No accounts, no persistence beyond the session (localStorage only
   for the settings toggle).

### 3.5 Feedback ladder (deterministic, inside PLACE/TRANSFER)
- Level 1: package bounces back with a shadow at its true spot.
- Level 2: lens zooms one level and shows the two packages' true spots.
- Level 3: both packages rewritten to the same number of places (0.8 -> 0.80)
  next to each other on the zoomed dock.

## 4. AI integration (one bounded responsibility)

### 4.1 `classify` call
- Input: item pair, ground-truth ordering, learner's placement, learner text.
- Output JSON: `{label: L|S|MONEY|SLIP|GUESS|UNCLEAR, confidence: 0-1}`.
- System prompt states the placement is already known wrong, forbids stating
  which decimal is larger, forbids any learner-facing text, and demands the
  closed label set. Temperature 0. Timeout 4 s. Request JSON output; parse
  defensively (extract the first JSON object; on parse failure use fallback)
  because `response_format` support varies by model on OpenRouter.
- Fallback: keyword and pattern table (digits-comparison phrases -> L,
  "smaller units/hundredths are smaller" -> S, currency words -> MONEY,
  "oops/wrong spot/clicked" -> SLIP, no digits -> GUESS/UNCLEAR).

### 4.2 `erroneous-example` call
- Input: rule (L or S), an item pair chosen by the engine (so numbers and the
  rule-wrong answer are fixed BEFORE the call), the learner's own explanation
  text if any, language, separator.
- Output JSON: `{peer_claim: string, peer_reason: string}` where the claim
  must name the engine-chosen wrong package as larger and the reason must
  mirror the rule (and the learner's wording if provided). Max 2 sentences,
  age-appropriate.
- Fallback: authored bank of 6 examples per rule.

### 4.3 Verification before display (engine-owned)
- Parse the numbers in `peer_claim`; both must match the engine's chosen pair
  and the claimed larger one must be the rule-wrong one. Reject otherwise and
  serve the bank. Reject any output containing a third number, a correct
  claim, or more than 40 words.

### 4.4 Explanations in language
- Learner-facing sentences in ZOOM and SUMMARY come from templates; the model
  may rephrase them into the configured language as a later polish only if
  time permits. Not on the critical path.

### 4.5 Model-off toggle and honesty
- A visible toggle switches to the fallbacks. The summary screen shows which
  path ran. The video shows the toggle once.

## 5. AI value test harness (evidence for "genuine AI")
- `scripts/ai-value-test.ts`: 30+ synthetic explanations (start from the 10 in
  `research/deep/decimal-longer-is-larger.md` section 4), each with an
  adult-assigned expected label. Runs the keyword table and the model, prints an
  agreement table and the disagreements. Output saved to `docs/evidence/` and
  quoted in the description and video (the side-by-side "keyword fails, model
  gets it" beat).
- Also runs 20 erroneous-example generations per rule through the 4.3 verifier
  and reports the rejection rate.

## 6. Game design and UI quality
- Theme: a harbour dock. Packages float in on a conveyor with a decimal label;
  the dock is the 0-1 line with pier posts at tenths; a brass magnifier lens is
  the zoom. Robo is a friendly sorting robot who "sometimes gets it wrong".
- Feel: eased drag, snap preview, soft bounce on wrong drop, lens zoom with
  parallax and label reflow, confetti-free success (a lamp lights on the pier).
  60 fps target; no layout shift when the text box appears.
- Layout: 16:9 canvas, min 1024 px wide, mobile not required. Keyboard
  alternative for drag (arrow keys move the package, Enter drops) so the demo
  can show accessibility in one line.
- Text: short, no jargon, no timers, no lives. Points do not exist; the pier
  lamps are the progress.
- Config panel (behind a gear): decimal separator, currency label, language
  (English only shipped; hook present), model on/off.

## 7. Milestones (hard MVP cut line at end of day 3)
- Day 1 (Sep 9): repo scaffold, engine (numbers, item bank, classifier, state
  machine) with Vitest; Pixi dock with drag and drop; PLACE and INFER working.
- Day 2 (Sep 10): ZOOM lens, WHY box, ERRONEOUS phase with authored bank,
  TRANSFER, SUMMARY. Ugly but complete loop end to end. Deploy to Vercel.
- Day 3 (Sep 11): Claude proxy, `classify` and `erroneous-example`, verifier,
  caching, model-off toggle, harness run 1. MVP done: loop plus AI plus
  fallback, live URL, signed-out check.
- Day 4 (Sep 12): game feel pass: animations, lens, Robo, sound, profiles.
- Day 5 (Sep 13): harness run 2 with tuned prompts; demo script from the spine
  in `research/deep/decimal-longer-is-larger.md` section 5; rehearse.
- Day 6 (Sep 14): record video (adult operator, synthetic profile, under 3:00),
  write description (what, how built, what next), disclosures, evidence register
  audit, license audit.
- Day 7 (Sep 15): buffer; decide judge access (live URL only vs repo public,
  D-004); freeze.
- Sep 16-18: fixes only; submit by evening Sep 18 IST; confirm accessibility
  through Sep 23.
- If day 3 slips, polish shrinks; the loop never does.

## 8. Compliance and evidence
- Add every dependency, model, API, and asset to `evidence-register.md` when
  it is added. No GPL/LGPL/AGPL/SSPL/OFL.
- No child data; learner text is not stored; the description states that
  production use would need consent handling because typed text reaches an
  external API.
- Demo shows synthetic profiles enacted by an adult and says so on screen.
- Verify before quoting: Common Core 4.NF.7 text from the primary site; NCERT
  class placement.
- Description must separate: verified research, our design inferences, and the
  untested hypothesis that this loop improves learning.

## 9. Out of scope
- Accounts, dashboards, parent or teacher reports, multiplayer, other
  misconceptions, other grades, voice input, mobile layout, non-English UI.
- Subtraction smaller-from-larger stays the documented backup; no parallel
  build.

## 10. Verification protocol for the build agent
- `npm test` passes: engine number handling, classifier on synthetic response
  patterns (all four codes and the tolerance rule), verifier rejects bad
  outputs, fallback classifier on the 10 seed explanations.
- Manual: complete the loop as Maya (L) and as Sam (S) with the model on and
  off; every phase reachable; no console errors; 3-minute run-through possible.
- Deployed URL loads in a signed-out browser; API key absent from the bundle.
- Report with paths, what passed, what did not. Do not commit if anything
  fails or is unclear; report instead of improvising.
