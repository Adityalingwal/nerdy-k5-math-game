# Equal-Sign Repair — bounded AI-value test build report

Run date: 2026-09-13. Authorized by D-012 only.

This is a local CLI experiment. It is not a game prototype, a final concept
selection, a learner study, a UI build, a deployment, or a learning-efficacy
test. Nothing here authorizes a learner-facing Equal-Sign Repair build.

**These synthetic software checks are not evidence of child learning, classroom
effectiveness, grade suitability, or mastery.** Every case is adult-authored
synthetic text. No real child wrote any of it and no personal data is present.

**This is not a blind benchmark.** Claude Code (Opus 5), acting as a coding
agent under Aditya's direction, authored **both** the harness and the entire
initial fixture set. Codex has not yet inspected the code or contributed
holdout cases.

---

## (a) Verified implementation facts

### Files added

All experiment code lives in one directory, `experiments/equal-sign-repair-ai-value/`:

| file | role |
| --- | --- |
| `contract.ts` | closed four-label schema, deterministic label→probe map, `CONFIDENCE_THRESHOLD = 0.70`, the system contract text, the shared `RouteInput` shape, and `validateModelReply` |
| `equation.ts` | deterministic equation engine: parses `+`/`-` equations with one `=` and one `?` in any position, solves the blank exactly, and derives the placement facts |
| `fixtures.ts` | the 45 adult-authored synthetic cases |
| `fixture-loader.ts` | loads authored cases plus an optional holdout file, validates shape, builds the shared route input |
| `baseline.ts` | the compact deterministic rules baseline (13 rules) |
| `model.ts` | the constrained real-model route (own fetch, own timeout, latency and usage capture) |
| `score.ts` | agreement, confusion matrix, per-group results, high-risk errors, latency percentiles |
| `self-check.ts` | 14 deterministic self-checks; the runner aborts if any fails |
| `run.ts` | the runner; writes the JSON and Markdown evidence artifacts |
| `tsconfig.json` | experiment-local, `extends` the root config, includes only this directory |

### Interpretation contract (implemented exactly as specified)

- Labels: `OPERATIONAL_EQUAL`, `ARITHMETIC_SLIP`, `RELATIONAL_VALID`, `UNCLEAR`.
- Probe map, deterministic and applied after validation:
  `OPERATIONAL_EQUAL`→`COMPARE_BOTH_SIDES`, `ARITHMETIC_SLIP`→`RECHECK_CALCULATION`,
  `RELATIONAL_VALID`→`FADE_TO_TRANSFER`, `UNCLEAR`→`ASK_WHAT_EACH_SIDE_MEANS`.
- The model may return only `label`, `confidence`, `probeId`. Unknown label,
  non-numeric or out-of-range confidence, a probeId inconsistent with the label,
  or confidence below `0.70` all route to `UNCLEAR` / `ASK_WHAT_EACH_SIDE_MEANS`.
- `0.70` is a single named constant, fixed before the run and never tuned.
- Nothing the model writes passes through: only a label from the closed set and
  the mapped probe can leave the validator. The model never generates
  learner-facing prose, never decides arithmetic correctness (the engine tells
  it the correct value and the verdict), and never controls progression.

### Baseline fairness and leakage control

- **Same input to both routes.** `toRouteInput()` builds one object — equation,
  engine facts, raw edit trace, explanation text — and hands the identical
  object to the rules and to the model. It deliberately carries no group name,
  no expected label and no annotation; a self-check asserts that.
- **The baseline uses the trace, not only the text.** Rule `R02` fires on a
  *diagnostic operational placement*: the placed value equals one of the
  engine's reference sums (the side total, the sum of all printed numerals, or
  the sum of numerals before the blank). That is the classic "write the result
  of what you just read" response, and it is a general signal, not a fixture
  lookup.
- **No fixture leakage, enforced structurally.** `baseline.ts` imports nothing
  from any fixture module, and a self-check greps its own source to prove it:
  one check fails on any import specifier containing `fixture`, another fails if
  any 20-character run of any fixture explanation appears verbatim in the
  baseline source. Both pass.
- **Baseline rule count: 13.** Rules are tried in order; the first match wins;
  the last rule is an explicit `UNCLEAR` default.

### Authoring order — stated exactly, because it limits the score

The fixtures were drafted from the four label definitions and the D-012
difficult-language group list. **They were not frozen before the rules were
written.** The rules and the cases were **co-developed in one pass before the
first execution**: every case was traced through the draft rules by hand, and
during that trace three things were changed to make the rules behave as the
label definitions require —

- the operational-marker vocabulary was narrowed (the bare word *total* was
  dropped, because it made a legitimate code-mixed relational case read as
  self-contradictory);
- the bare-referent cue was redefined to key on the absence of a numeral rather
  than the absence of any task word;
- the trace-diagnostic rule was moved ahead of the empty/off-topic rules, so the
  stated placement policy would actually apply.

One case, `ESR-V11`, was **deliberately written to fall outside the rule
vocabulary**, to keep the set from being trivially solvable.

**After the first execution, nothing was changed** — no rule, no marker, no
threshold, no label. The `0.70` threshold was fixed before any code ran.

The honest reading: **95.6 % is an upper bound on rules co-designed with their
own test set**, produced by a single author who also wrote the cases. It is not
a measurement of how a compact rule set performs on unseen learner language.
This is the central reason independent holdout cases are required.

### Adult interpretation policy for the awkward case

One policy decision was needed and is applied consistently to every fixture and
stated verbatim inside the model's system contract, so both routes are judged
against the same standard:

> A diagnostic operational placement alone is sufficient evidence for
> `OPERATIONAL_EQUAL` even with an uninformative explanation, because
> `COMPARE_BOTH_SIDES` is the safe next probe for that placement; `UNCLEAR` is
> reserved for a non-diagnostic placement whose explanation cannot support a
> diagnosis.

A correct missing numeral on its own is explicitly **not** treated as evidence
of relational understanding (C09's own requirement). `ESR-O05` and `ESR-U01`
are the paired cases that pin this down.

### Fixtures

45 adult-authored synthetic cases: `OPERATIONAL_EQUAL` 12, `ARITHMETIC_SLIP` 11,
`RELATIONAL_VALID` 11, `UNCLEAR` 11 (requirement: ≥32 total, ≥8 per label).

Each carries a stable id, a group, the equation, an edit/action trace, the
adult-stated correct missing value, the learner explanation, the expected label,
the expected probe id, and a one-line justification annotation.

Equations, all small exact integers, centred on `6 + 5 = 7 + ?` with bounded
transfer and both-sides forms: `6 + 5 = 7 + ?`, `8 + 4 = ? + 5`, `? = 8 + 4`,
`12 = ? + 4`, `9 - 3 = ? + 2`, `5 + 5 = 10 + ?`, `3 + 4 + 2 = 3 + ?`,
`7 + 6 = ? + 8`.

Required difficult-language groups, all present: `ordinary` (11),
`negation-self-correction` (4), `correct-sounding-slip` (4),
`ambiguous-referent` (4), `compensation` (3), `hinglish` (5),
`empty-offtopic` (5), `injection` (1), `transfer` (5),
`both-sides-operations` (3).

The one synthetic prompt-injection case (`ESR-U09`) expects
`UNCLEAR` / `ASK_WHAT_EACH_SIDE_MEANS`. Schema safety does not depend on the
model resisting it: the validator structurally guarantees that a reply carrying
prose, extra fields and an invented label such as `PRAISE_LEARNER` is discarded
and replaced by the safe routing. A self-check asserts exactly that.

### Extensible fixtures for independent review

An independent reviewer can add undisclosed holdout cases without touching the
authored set:

```
./node_modules/.bin/tsx experiments/equal-sign-repair-ai-value/run.ts \
  --extra-fixtures /absolute/path/to/holdout.json
```

The file is a JSON array of objects with `id`, `group`, `equation`, `trace`,
`explanation`, `expectedLabel`, `statedCorrectMissing`, `annotation`.
`expectedProbeId` is always derived from the label and never read from the file,
so a holdout file cannot break the deterministic map. Holdout cases go through
the same engine consistency check as the authored ones and are tagged
`source: "holdout"` in the JSON artifact.

### Real-model path

Implemented fully and correctly, and it will work the moment a key exists.
It was **not executed** — see (b).

- Key source: process environment, or a repository `.env` read by a small local
  loader that fails silently when no `.env` exists. No filesystem search for a
  key was performed and no `.env` was created.
- Own fetch, written for this experiment. `src/ai/core.ts`'s `callOpenRouter` is
  not exported and discards latency and provider `usage`, both of which this
  experiment must record. Only four read-only helpers are borrowed from that
  file: `extractJsonObject`, `readLlmConfigFromEnv`, `DEFAULT_MODEL`,
  `OPENROUTER_URL`. `src/ai/core.ts` was not modified.
- `EXPERIMENT_TIMEOUT_MS = 18000`, deliberately **not** the product's 4000 ms;
  a short budget would turn ordinary provider latency into fake timeout evidence.
- `temperature: 0`, `max_tokens: 120` — enough for the closed JSON, no more.
- Payload: the fixed system contract plus **one synthetic fixture per call**.
  No repository contents are ever sent.
- Two attempts = two full passes over all fixtures. Within a pass, a malformed,
  inconsistent or low-confidence reply routes to the `UNCLEAR` fallback with no
  retry and is counted. A transport failure (HTTP error, network error, timeout,
  empty content) gets exactly **one** controlled retry; if it fails again the run
  aborts and records the kind, the status and the body truncated to 300
  characters. No provider switch, no workaround.
- Both the **requested** model id (`OPENROUTER_MODEL` or `anthropic/claude-sonnet-5`)
  and the **served** model id from the provider's `model` field are recorded;
  they can differ. Per-call latency, malformed counts, fallback counts and any
  provider `usage` metadata are recorded.
- The key is never printed, written, returned or included in any artifact.
  Verified by the secret scan in (b).

### Verification commands and results

| # | command | result |
| --- | --- | --- |
| 1 | `./node_modules/.bin/tsx experiments/equal-sign-repair-ai-value/self-check.ts` | **14/14 self-checks passed** |
| 2 | `./node_modules/.bin/tsx experiments/equal-sign-repair-ai-value/run.ts` | baseline-only evaluation completed over 45 fixtures |
| 3 | real-model evaluation ×2 | **not run — `real model path untested`** |
| 4 | `npm test` | **81/81 passed**, 7 files, unchanged |
| 5 | `npm run build` | **passed** (`tsc --noEmit` + `vite build`) |
| 6 | `./node_modules/.bin/tsc --noEmit -p experiments/equal-sign-repair-ai-value/tsconfig.json` | **passed, no errors** |
| 7 | secret scan over every new experiment, report and evidence file | **clean** |
| 8 | `git diff --check` and `git status --short --branch` | **clean; only new entry is `?? experiments/`** |

The 14 self-checks are: label→probe map totality and injectivity; equation
engine correctness on all eight authored forms; every fixture's stated correct
value matches the engine; every fixture's expected probe follows the map; ≥32
fixtures; ≥8 per label; every required group present; at least one injection
case; the shared route input leaks no label/probe/group/annotation; the
validator's behaviour across 10 malformed, inconsistent, low-confidence and
hostile replies; the threshold is exactly `0.70`; the baseline imports no
fixture module; the baseline contains no verbatim 20-character fixture run; the
baseline is total and names a rule for every case.

Secret scan detail: `grep` for `sk-`, `OPENROUTER_API_KEY=<value>`,
`Bearer <token>` and 40+ character base64-ish runs found no credential. The only
`Bearer` occurrence is the template literal `` `Bearer ${config.apiKey}` `` in
`model.ts`, which contains no key material.

### What was not touched

`src/`, `api/`, `scripts/`, `tests/`, root `index.html`, `prototypes/mission-forge/`
and its evidence, `package.json`, the lockfile, root `tsconfig.json`,
`vite.config.ts`, `vitest.config.ts`, `.env.example`, `.gitignore`, `README.md`,
`docs/decision-log.md`, `vercel.json`, and every existing evidence file. No
dependency, image, font, audio, dataset, backend, storage, analytics, account
system or child data was added. No npm script was added. Nothing was committed,
pushed, deployed or branched, and repository visibility was not changed.

---

## (b) Measured results

### Pre-registered gate (stated before the scores, threshold `0.70`)

- `possible advance`: the real model beats the deterministic baseline by at
  least 15 percentage points on exact labels, has no high-risk error on either
  attempt, and produces valid/fallback-safe output on every case.
- `drop AI claim`: improvement is below 15 percentage points, the rules cover
  all meaningful differences, or the model has any repeatable high-risk error.
- `unresolved`: the real model did not run, results are unstable across the two
  attempts, or the small authored fixture set cannot discriminate the routes.

Operationalisation of "unstable", recorded here **before** any model result
exists: the two attempts' exact-label agreement differs by **more than 5
percentage points**. This is the threshold `run.ts` applies mechanically.

### Real model route

**`real model path untested`.**

There is no `.env` file in the repository and `OPENROUTER_API_KEY` was not in
the process environment. Aditya explicitly chose to run baseline-only. No model
call was made. Nothing was simulated, mocked or inferred.

Every model-dependent metric is **not measured**, which is not the same as zero:

| metric | value |
| --- | --- |
| exact-label agreement | not measured |
| exact probe-ID agreement | not measured |
| confusion matrix | not measured |
| results by case group | not measured |
| malformed replies | not measured |
| low-confidence fallbacks | not measured |
| timeouts | not measured |
| cases where AI is right and rules are wrong | not measured |
| cases where rules are right and AI is wrong | not measured |
| high-risk errors | not measured |
| latency p50 / p95 | not measured |
| served model id | not measured |

Requested model id, had it run: `anthropic/claude-sonnet-5` (the
`OPENROUTER_MODEL` default in `src/ai/core.ts`).

### Deterministic rules baseline — 45 cases, 13 rules

- Exact-label agreement: **43/45 = 95.6 %**
- Exact probe-ID agreement: **43/45 = 95.6 %** — identical to label agreement
  **by construction**, because the probe is assigned by the deterministic map
  after validation. It is not independent evidence.
- High-risk errors: **1**
- Fallback routings: 0 (the baseline has no fallback path; every case is decided
  by a rule)
- Latency p50 / p95: not measured (no model call in this route)

Confusion matrix (rows = adult label, columns = baseline prediction):

| expected \ predicted | OPERATIONAL_EQUAL | ARITHMETIC_SLIP | RELATIONAL_VALID | UNCLEAR |
| --- | --- | --- | --- | --- |
| OPERATIONAL_EQUAL | 12 | 0 | 0 | 0 |
| ARITHMETIC_SLIP | 0 | 10 | 0 | 1 |
| RELATIONAL_VALID | 1 | 0 | 10 | 0 |
| UNCLEAR | 0 | 0 | 0 | 11 |

By case group:

| group | correct | total |
| --- | --- | --- |
| ambiguous-referent | 4 | 4 |
| both-sides-operations | 3 | 3 |
| compensation | 3 | 3 |
| correct-sounding-slip | 4 | 4 |
| empty-offtopic | 5 | 5 |
| hinglish | 5 | 5 |
| injection | 1 | 1 |
| negation-self-correction | 3 | 4 |
| ordinary | 10 | 11 |
| transfer | 5 | 5 |

The two disagreements:

- `ESR-S11` (`ordinary`) — expected `ARITHMETIC_SLIP`, the rules said `UNCLEAR`
  via the default rule `R13`. The explanation, *"8 and 4 land on 12, and from 5
  I counted up to 12 and got 6"*, is a relationally valid counting-up method
  that uses none of the baseline's equality vocabulary. Safe failure: the
  learner gets the "what does each side mean" probe instead of the recheck probe.
- `ESR-V11` (`negation-self-correction`) — expected `RELATIONAL_VALID`, the
  rules said `OPERATIONAL_EQUAL` via `R11`. The explanation opens *"Putting the
  answer there is the wrong idea…"*; the baseline sees the token "answer" and
  cannot process the negation. **This is the one high-risk error**: valid
  relational reasoning diagnosed as the misconception, which would push a
  learner who already understands equality back into a remedial probe.

Per-case outputs for all 45 cases, with the deciding rule id, are in the
evidence Markdown file and in the machine-readable JSON.

### Discrimination headroom — the important number

The rules baseline already reaches **95.6 %** on this fixture set, so the
largest improvement any route could possibly show here is **4.4 percentage
points**. That is below the pre-registered 15-point advance margin. **On this
fixture set alone the `possible advance` branch is arithmetically unreachable,
whatever the model would have scored.**

### Provisional gate result

**`unresolved`.**

Two independent reasons, either of which alone is sufficient:

1. The real model did not run (`real model path untested`).
2. The small authored fixture set cannot discriminate the routes — the baseline
   ceiling leaves 4.4 points of headroom against a 15-point gate.

---

## (c) Product interpretation

Read narrowly. Nothing below selects a final concept or claims that AI improves
learning.

1. **A compact rule set covers most of this authored space.** Thirteen general
   rules, given the same input as the model, agreed with the adult labels on
   95.6 % of 45 cases, including every Hinglish case, every ambiguous-referent
   case, every compensation case and every transfer case. The D-012 contract
   says plainly that if a small rule set matches all meaningful responses, the
   AI claim should be rejected. This run points that way, but does not settle
   it, because the rules and the cases share one author.

2. **The engine plus the trace carries much of the load.** Rule `R02` — the
   placement matches an engine reference sum — resolves the operational cases
   almost on its own. That is consistent with C09's own caution: *recognizing
   the wrong numeral 11 alone requires no AI*. The AI claim never rested on
   detecting the wrong numeral; it rested on interpreting unexpected language.

3. **The two failures are exactly where the AI claim would live.** Both misses
   are language the rules cannot reach: a valid method stated without any
   equality vocabulary (`ESR-S11`), and an explicit rejection of the operational
   rule that the rules read as an endorsement of it (`ESR-V11`). A real
   interpreter that handled negation and paraphrase would beat the rules on
   precisely these two cases — worth 4.4 points here, which is the whole
   problem: the current fixture set is too easy to make that difference
   measurable against the pre-registered gate.

4. **The high-risk failure mode is real and it belongs to the rules.** The one
   high-risk error in this run is the baseline's, not the model's. That
   strengthens the case for testing a real interpreter, and it also shows what
   a learner-facing version would have to guarantee: a valid relational
   explanation must never be pushed into a remedial probe.

5. **Safety is structural, not model-dependent.** The validator, not the model's
   good behaviour, guarantees that only a closed-set label and its mapped probe
   ever reach the learner. That property holds whether or not a model is
   configured, and it held against a hostile reply in the self-checks.

---

## (d) Unresolved issues and limitations

1. **`real model path untested`.** No key was configured and none was sought.
   The entire model half of this experiment is unexecuted. Any statement about
   model accuracy, latency, malformed rate, fallback rate or high-risk behaviour
   would be fabrication.
2. **Not a blind benchmark, and the rules were co-designed with the cases.**
   Claude authored the harness, the rules and every fixture, and the rules were
   tuned against the draft cases before the first run (see "Authoring order").
   The 95.6 % baseline is an upper bound on rules co-designed with their own
   test set — not a measurement of general capability on unseen learner language.
3. **The fixture set cannot discriminate the routes.** 4.4 points of headroom
   against a 15-point gate. Independent holdout cases — harder paraphrase,
   negation, code-mixing and ambiguity, and cases whose correct label is not
   recoverable from the placement — are required before the gate can mean
   anything. The `--extra-fixtures` path exists for exactly this.
4. **Two adult judgements are genuinely borderline** and should be re-examined
   by an independent reviewer:
   - `ESR-U11` (*"same number."*) is labelled `UNCLEAR` as too thin to establish
     a same-quantity claim; a reviewer could defend `RELATIONAL_VALID`.
   - `ESR-O11` and `ESR-O12` (diagnostic placement, off-topic and empty text)
     are labelled `OPERATIONAL_EQUAL` under the stated policy; a reviewer who
     prefers UNCLEAR-on-no-text would relabel them and change both routes' scores.
5. **Timeout classification.** A timeout is treated as a transport failure
   (one controlled retry, then abort), not as a per-case fallback. A reviewer
   could argue a timeout should instead route that single case to `UNCLEAR` and
   continue. Flagged rather than decided.
6. **Probe agreement is not independent evidence.** It equals label agreement by
   construction. Reporting both is a contract requirement, not a second signal.
7. **Sample size.** 45 synthetic cases. No confidence intervals are computed and
   none should be inferred; a one-case difference moves the percentage by 2.2
   points.
8. **No learner evidence of any kind.** No child used this, nothing was tested
   with a human, and nothing here speaks to learning, engagement, grade
   suitability or classroom use.

---

## For Codex's independent review

1. Re-run the self-checks and the baseline; confirm 14/14 and 43/45.
2. Read `baseline.ts` and judge whether the 13 rules are genuinely general or
   over-fitted. The "Authoring order" section above records that they were
   shaped against the draft cases; the structural leakage checks prove only that
   no fixture text is copied. Three specific tuning decisions are named there —
   check whether each is a general improvement or a fit to one case.
3. Add undisclosed holdout cases via `--extra-fixtures` and re-run. Aim
   specifically at the gap the two misses expose: valid methods stated without
   equality vocabulary, and negations of the operational rule.
4. Re-examine the four borderline labels named in (d)(4).
5. Configure `OPENROUTER_API_KEY` and run the real-model path twice. Record the
   served model id, which may differ from the requested one.
6. Only then decide `advance` / `drop` / `unresolved`.

---

## Artifacts

- Machine-readable results:
  `docs/evidence/experiments/equal-sign-repair/ai-value-test-2026-09-13.json`
- Readable run report:
  `docs/evidence/experiments/equal-sign-repair/ai-value-test-2026-09-13.md`
- Experiment code: `experiments/equal-sign-repair-ai-value/`
- This build report:
  `docs/prototypes/equal-sign-repair/ai-value-test-build-report.md`
