/**
 * Equalizer Lab (D-013 Equal-Sign Repair scripted UI) — automated verification.
 *
 * Development tool only; it is not part of the prototype and ships in no
 * build output. It drives the installed Google Chrome through the repository's
 * existing dev-only playwright-core (E-030) and downloads nothing.
 *
 * Every check asserts a SPECIFIC expected value read from the read-only
 * `window.__equalizerLab` hook (step, totals, missing value, hint level,
 * scaffold, recount index, steps seen), not merely "some text appeared".
 *
 * Usage (dev server already running):
 *   ESR_URL=http://localhost:5174/prototypes/equal-sign-repair/ node esr-verify.mjs
 */

import { chromium } from '/Users/mac/Desktop/nerdy-k5-math-game/node_modules/playwright-core/index.mjs';

const URL =
  process.env.ESR_URL || 'http://localhost:5173/prototypes/equal-sign-repair/';
const OUT =
  '/Users/mac/Desktop/nerdy-k5-math-game/docs/evidence/prototypes/equal-sign-repair/scripted-ui';

const PATHS = ['OPERATIONAL_EQUAL', 'ARITHMETIC_SLIP', 'RELATIONAL_VALID', 'UNCLEAR'];

const EXPECTED = {
  OPERATIONAL_EQUAL: {
    probe: 'COMPARE_BOTH_SIDES',
    placement: 11,
    rightTotalAtStart: 18,
    scaffold: 'FADING_RAILS',
    remedial: true,
    tool: 'toolMatch',
    explainsMisconception: true,
    steps: ['inspect', 'consequence', 'interpret', 'repair', 'settled', 'transfer', 'summary'],
  },
  ARITHMETIC_SLIP: {
    probe: 'RECHECK_CALCULATION',
    placement: 5,
    rightTotalAtStart: 12,
    scaffold: 'TOTALS_ONLY',
    remedial: true,
    tool: 'toolRecount',
    explainsMisconception: false,
    steps: ['inspect', 'consequence', 'interpret', 'repair', 'settled', 'transfer', 'summary'],
  },
  RELATIONAL_VALID: {
    probe: 'FADE_TO_TRANSFER',
    placement: 4,
    rightTotalAtStart: 11,
    scaffold: 'SYMBOLIC_ONLY',
    remedial: false,
    tool: null,
    explainsMisconception: false,
    steps: ['inspect', 'consequence', 'interpret', 'transfer', 'summary'],
  },
  UNCLEAR: {
    probe: 'ASK_WHAT_EACH_SIDE_MEANS',
    placement: 5,
    rightTotalAtStart: 12,
    scaffold: 'FADING_RAILS', // via the MISSING_GROUP clarification
    remedial: true,
    tool: 'toolCompare',
    explainsMisconception: false,
    steps: [
      'inspect', 'consequence', 'interpret', 'clarify', 'repair', 'settled', 'transfer', 'summary',
    ],
  },
};

/* ------------------------------------------------------------- accounting */

let pass = 0;
const failures = [];
const consoleProblems = [];
const requestOrigins = new Set();

function ok(label, condition, detail) {
  if (condition) {
    pass += 1;
  } else {
    failures.push(`${label} — ${detail === undefined ? 'failed' : detail}`);
    console.log(`  FAIL  ${label} :: ${detail}`);
  }
}

function eq(label, actual, expected) {
  ok(label, JSON.stringify(actual) === JSON.stringify(expected), `got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`);
}

/* ---------------------------------------------------------------- driving */

const read = (p) =>
  p.evaluate(() => {
    const h = window.__equalizerLab;
    return {
      step: h.step(),
      path: h.path(),
      phase: h.phase(),
      equation: h.equation(),
      left: h.leftTotal(),
      right: h.rightTotal(),
      missing: h.missingValue(),
      correct: h.correctMissing(),
      isEqual: h.isEqual(),
      attempts: h.attempts(),
      hintLevel: h.hintLevel(),
      scaffold: h.scaffold(),
      label: h.label(),
      probeId: h.probeId(),
      clarification: h.clarification(),
      recountIndex: h.recountIndex(),
      totalsVisible: h.totalsVisible(),
      matchOverlay: h.matchOverlay(),
      railsVisible: h.railsVisible(),
      explainedMisconception: h.explainedMisconception(),
      stepsSeen: h.stepsSeen(),
      status: h.status(),
      botLine: h.botLine(),
      banner: h.banner(),
      reducedMotion: h.reducedMotion(),
    };
  });

const idle = (p) =>
  p.waitForFunction(() => !window.__equalizerLab.busy(), null, { timeout: 15000 });

async function click(p, selector) {
  await p.click(selector);
  await idle(p);
}

async function newPage(browser, width, height, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    isMobile: width < 768,
    hasTouch: width < 768,
    ...(opts.reducedMotion ? { reducedMotion: 'reduce' } : {}),
  });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    const t = m.type();
    if (t === 'error' || t === 'warning') consoleProblems.push(`${t}: ${m.text()}`);
  });
  page.on('pageerror', (e) => consoleProblems.push(`pageerror: ${e.message}`));
  page.on('request', (r) => {
    try {
      requestOrigins.add(new global.URL(r.url()).origin);
    } catch {
      requestOrigins.add(r.url());
    }
  });
  await page.goto(URL);
  await idle(page);
  return { ctx, page };
}

async function selectPath(page, id) {
  await click(page, '#pathsToggle');
  await click(page, '#path-' + id);
  await click(page, '#pathsToggle');
}

/* ------------------------------------------------------- one complete run */

/**
 * Plays one scripted path from `inspect` to `summary` and asserts specific
 * engine state at every stage.
 *
 * @param {object} opts
 *   tag              - screenshot/label prefix
 *   pathId           - which scripted path
 *   clarifyChoice    - Path D clarification id
 *   wrongRepairs     - how many wrong repair submits to make first
 *   shots            - capture screenshots
 */
async function playPath(page, opts) {
  const { tag, pathId, shots = true } = opts;
  const want = EXPECTED[pathId];
  const wrongRepairs = opts.wrongRepairs === undefined ? 3 : opts.wrongRepairs;
  const clarifyChoice = opts.clarifyChoice || 'MISSING_GROUP';
  const label = (n) => `${tag}/${pathId}: ${n}`;
  const shot = async (n) => {
    if (shots) await page.screenshot({ path: `${OUT}/${tag}-${pathId}-${n}.png` });
  };

  if (pathId !== (await read(page)).path) await selectPath(page, pathId);

  /* -- 1. inspect ------------------------------------------------------- */
  let s = await read(page);
  eq(label('starts at inspect'), s.step, 'inspect');
  eq(label('equation is the repair equation'), s.equation, '6 + 5 = 7 + ?');
  eq(label('synthetic placement'), s.missing, want.placement);
  eq(label('left total 11'), s.left, 11);
  eq(label('right total at start'), s.right, want.rightTotalAtStart);
  eq(label('engine correct value is 4'), s.correct, 4);
  eq(label('no totals before hint 2'), s.totalsVisible, false);
  eq(label('no matching before hint 3'), s.matchOverlay, false);
  eq(label('no reading revealed yet'), s.label, null);
  eq(label('no-runtime-AI banner'), s.banner, 'Scripted concept prototype — no runtime AI');
  await shot('01-inspect');

  /* -- 2. consequence --------------------------------------------------- */
  await click(page, '#primaryBtn');
  s = await read(page);
  eq(label('consequence step'), s.step, 'consequence');
  eq(label('consequence equality matches engine'), s.isEqual, want.placement === 4);
  await shot('02-consequence');

  /* -- 3. interpret ----------------------------------------------------- */
  await click(page, '#primaryBtn');
  s = await read(page);
  eq(label('interpret step'), s.step, 'interpret');
  eq(label('scripted label'), s.label, pathId);
  eq(label('mapped probe id'), s.probeId, want.probe);
  eq(label('misconception explained only on path A'), s.explainedMisconception, want.explainsMisconception);
  await shot('03-interpret');

  /* -- 4. clarify (Path D only) ----------------------------------------- */
  await click(page, '#primaryBtn');
  s = await read(page);
  if (pathId === 'UNCLEAR') {
    eq(label('clarify step'), s.step, 'clarify');
    eq(label('no misconception assigned at clarify'), s.explainedMisconception, false);
    await shot('04-clarify');
    await click(page, '#clarify-' + clarifyChoice);
    s = await read(page);
    eq(label('clarification recorded'), s.clarification, clarifyChoice);
  }

  /* -- 5. repair or straight to transfer -------------------------------- */
  if (want.remedial) {
    eq(label('repair step'), s.step, 'repair');
    eq(label('repair starts at hint 0'), s.hintLevel, 0);
    eq(label('repair starts with no totals'), s.totalsVisible, false);
    eq(label('repair starts with no matching'), s.matchOverlay, false);

    // Path-specific repair verb.
    if (want.tool === 'toolMatch') {
      await click(page, '#toolMatch');
      s = await read(page);
      eq(label('match tool turns unit matching on'), s.matchOverlay, true);
      eq(label('match tool does not expose totals'), s.totalsVisible, false);
      await shot('05-tool-match');
      await click(page, '#toolMatch');
      s = await read(page);
      eq(label('match tool toggles back off'), s.matchOverlay, false);
    } else if (want.tool === 'toolRecount') {
      const cells = s.right;
      for (let i = 0; i < cells; i += 1) await click(page, '#toolRecount');
      s = await read(page);
      eq(label('recount walks every right-rail cell'), s.recountIndex, cells);
      eq(label('recount does not expose totals'), s.totalsVisible, false);
      eq(label('recount never explains the misconception'), s.explainedMisconception, false);
      await shot('05-tool-recount');
    } else if (want.tool === 'toolCompare') {
      await click(page, '#toolCompare');
      s = await read(page);
      eq(label('compare tool does not print totals'), s.totalsVisible, false);
      eq(label('compare tool assigns no misconception'), s.explainedMisconception, false);
      await shot('05-tool-compare');
    }

    /* -- 6. wrong repairs and the hint ladder --------------------------- */
    for (let i = 1; i <= wrongRepairs; i += 1) {
      const before = (await read(page)).missing;
      await click(page, '#submitBtn');
      s = await read(page);
      eq(label(`wrong repair ${i} keeps the step`), s.step, 'repair');
      eq(label(`wrong repair ${i} counts an attempt`), s.attempts, i);
      eq(label(`wrong repair ${i} sets hint level`), s.hintLevel, Math.min(3, i));
      eq(label(`wrong repair ${i} never auto-fills the answer`), s.missing, before);
      eq(label(`wrong repair ${i} keeps the rails unequal`), s.isEqual, false);
      if (i === 1) eq(label('hint 1 shows no totals'), s.totalsVisible, false);
      if (i === 2) eq(label('hint 2 exposes side totals'), s.totalsVisible, true);
      if (i === 3) eq(label('hint 3 turns unit matching on'), s.matchOverlay, true);
      await shot(`06-wrong-repair-${i}`);
    }

    /* -- 7. construct the repair ---------------------------------------- */
    let guard = 0;
    while ((await read(page)).missing > 4 && guard < 30) {
      await click(page, '#removeCell');
      guard += 1;
    }
    while ((await read(page)).missing < 4 && guard < 30) {
      await click(page, '#addCell');
      guard += 1;
    }
    s = await read(page);
    eq(label('constructed missing value'), s.missing, 4);
    eq(label('both rails now carry 11'), [s.left, s.right], [11, 11]);
    eq(label('engine reports equality'), s.isEqual, true);
    await shot('07-constructed');

    await click(page, '#submitBtn');
    s = await read(page);
    eq(label('correct repair settles the bridge'), s.step, 'settled');
    eq(label('settled keeps misconception policy'), s.explainedMisconception, want.explainsMisconception);
    await shot('08-settled');

    await click(page, '#primaryBtn');
  }

  /* -- 8. transfer ------------------------------------------------------ */
  s = await read(page);
  eq(label('transfer step'), s.step, 'transfer');
  eq(label('transfer equation'), s.equation, '12 = 8 + ?');
  eq(label('transfer scaffold'), s.scaffold, want.scaffold);
  eq(label('transfer starts empty'), s.missing, 0);
  eq(label('transfer totals 12 vs 8'), [s.left, s.right], [12, 8]);
  eq(label('transfer correct value is 4'), s.correct, 4);
  if (want.scaffold === 'FADING_RAILS') {
    eq(label('faint rails present at transfer start'), s.railsVisible, true);
  } else {
    eq(label('no unit cells for this scaffold'), s.railsVisible, false);
  }
  if (want.scaffold === 'TOTALS_ONLY') {
    eq(label('totals-only scaffold shows side totals'), s.totalsVisible, true);
  }
  if (want.scaffold === 'SYMBOLIC_ONLY') {
    eq(label('symbolic scaffold shows no totals and no cells'), [s.totalsVisible, s.railsVisible], [false, false]);
  }
  await shot('09-transfer');

  /* -- 9. one wrong transfer before success ----------------------------- */
  const beforeT = (await read(page)).missing;
  await click(page, '#submitBtn');
  s = await read(page);
  eq(label('wrong transfer keeps the step'), s.step, 'transfer');
  eq(label('wrong transfer counts an attempt'), s.attempts, 1);
  eq(label('wrong transfer sets hint 1'), s.hintLevel, 1);
  eq(label('wrong transfer never auto-fills'), s.missing, beforeT);
  await shot('10-wrong-transfer');

  let guard2 = 0;
  while ((await read(page)).missing < 4 && guard2 < 20) {
    await click(page, '#podPlus');
    guard2 += 1;
  }
  s = await read(page);
  eq(label('transfer constructed with the number pod'), s.missing, 4);
  if (want.scaffold === 'FADING_RAILS') {
    eq(label('faint rails fade once construction starts'), s.railsVisible, false);
  }

  await click(page, '#submitBtn');
  s = await read(page);
  eq(label('correct transfer reaches the summary'), s.step, 'summary');
  eq(label('summary totals are equal'), [s.left, s.right], [12, 12]);
  eq(label('steps walked'), s.stepsSeen, want.steps);
  await shot('11-summary');

  return s;
}

/* -------------------------------------------------------------- the suite */

const browser = await chromium.launch({ channel: 'chrome', headless: true });

console.log('== Equalizer Lab verification ==');
console.log('url:', URL);
console.log('started:', new Date().toISOString());

/* --- 3. all four paths end to end on desktop 1280x720 ------------------- */
console.log('\n[1] desktop 1280x720 — four paths end to end, pointer');
{
  const { ctx, page } = await newPage(browser, 1280, 720);
  const lengths = {};
  for (const id of PATHS) {
    const final = await playPath(page, { tag: 'desk-1280x720', pathId: id });
    lengths[id] = final.stepsSeen.length;
  }
  ok(
    'RELATIONAL_VALID is visibly shorter than A and B',
    lengths.RELATIONAL_VALID < lengths.OPERATIONAL_EQUAL &&
      lengths.RELATIONAL_VALID < lengths.ARITHMETIC_SLIP,
    JSON.stringify(lengths),
  );
  eq('RELATIONAL_VALID skips every remedial step',
    EXPECTED.RELATIONAL_VALID.steps.filter((x) => x === 'repair' || x === 'clarify' || x === 'settled'),
    []);
  await ctx.close();
}

/* --- 4. all four paths at 390x844, default path at 390x720 -------------- */
console.log('\n[2] narrow 390x844 — four paths end to end, touch');
{
  const { ctx, page } = await newPage(browser, 390, 844);
  for (const id of PATHS) await playPath(page, { tag: 'nar-390x844', pathId: id });
  await ctx.close();
}

console.log('\n[3] narrow 390x720 — default path end to end');
{
  const { ctx, page } = await newPage(browser, 390, 720);
  await playPath(page, { tag: 'nar-390x720', pathId: 'OPERATIONAL_EQUAL' });
  await ctx.close();
}

/* --- Path D: the full clarification -> scaffold mapping ---------------- */
console.log('\n[4] desktop — Path D clarification to transfer-scaffold mapping');
{
  const mapping = { LEFT_TOTAL: 'FADING_RAILS', RIGHT_TOTAL: 'TOTALS_ONLY', MISSING_GROUP: 'FADING_RAILS' };
  for (const choice of Object.keys(mapping)) {
    const { ctx, page } = await newPage(browser, 1280, 720);
    await selectPath(page, 'UNCLEAR');
    await click(page, '#primaryBtn');
    await click(page, '#primaryBtn');
    await click(page, '#primaryBtn');
    let s = await read(page);
    eq(`clarify/${choice}: at clarify step`, s.step, 'clarify');
    await click(page, '#clarify-' + choice);
    s = await read(page);
    eq(`clarify/${choice}: recorded`, s.clarification, choice);
    let guard = 0;
    while ((await read(page)).missing > 4 && guard < 20) { await click(page, '#removeCell'); guard += 1; }
    await click(page, '#submitBtn');
    await click(page, '#primaryBtn');
    s = await read(page);
    eq(`clarify/${choice}: mapped transfer scaffold`, s.scaffold, mapping[choice]);
    await page.screenshot({ path: `${OUT}/clarify-${choice}-transfer.png` });
    await ctx.close();
  }
}

/* --- 8. Replay and path switching on ONE page, no reload --------------- */
console.log('\n[5] desktop — Replay and A→B→C→D switching on one page, no reload');
{
  const { ctx, page } = await newPage(browser, 1280, 720);
  await page.evaluate(() => {
    window.__reloadStamp = 'alive';
  });

  await click(page, '#primaryBtn');
  await click(page, '#primaryBtn');
  await click(page, '#primaryBtn');
  await click(page, '#submitBtn');
  let s = await read(page);
  eq('pre-Replay state is mid-repair', [s.step, s.attempts, s.hintLevel], ['repair', 1, 1]);
  await page.screenshot({ path: `${OUT}/switch-01-before-replay.png` });

  await click(page, '#replayBtn');
  s = await read(page);
  eq('Replay returns to inspect', s.step, 'inspect');
  eq('Replay clears attempts and hints', [s.attempts, s.hintLevel], [0, 0]);
  eq('Replay restores the synthetic placement', s.missing, 11);
  eq('Replay clears the walked-step list', s.stepsSeen, ['inspect']);
  ok(
    'Replay did not reload the page',
    (await page.evaluate(() => window.__reloadStamp)) === 'alive',
    'window stamp lost',
  );
  await page.screenshot({ path: `${OUT}/switch-02-after-replay.png` });

  for (const id of ['ARITHMETIC_SLIP', 'RELATIONAL_VALID', 'UNCLEAR', 'OPERATIONAL_EQUAL']) {
    await selectPath(page, id);
    s = await read(page);
    eq(`switch to ${id}: path loaded`, s.path, id);
    eq(`switch to ${id}: back at inspect`, s.step, 'inspect');
    eq(`switch to ${id}: synthetic placement`, s.missing, EXPECTED[id].placement);
    ok(
      `switch to ${id}: still the same page`,
      (await page.evaluate(() => window.__reloadStamp)) === 'alive',
      'window stamp lost',
    );
  }
  await page.screenshot({ path: `${OUT}/switch-03-after-cycle.png` });
  await ctx.close();
}

/* --- 9. keyboard-only completion --------------------------------------- */
console.log('\n[6] desktop — keyboard-only completion of OPERATIONAL_EQUAL');
{
  const { ctx, page } = await newPage(browser, 1280, 720);
  const active = () => page.evaluate(() => (document.activeElement ? document.activeElement.id : ''));

  async function tabTo(id, max = 40) {
    for (let i = 0; i < max; i += 1) {
      if ((await active()) === id) return true;
      await page.keyboard.press('Tab');
    }
    return false;
  }
  async function press(id) {
    const found = await tabTo(id);
    ok(`keyboard: reached #${id} by Tab`, found, 'never focused');
    await page.keyboard.press('Enter');
    await idle(page);
  }

  await page.keyboard.press('Tab');
  await press('primaryBtn'); // inspect -> consequence
  let s = await read(page);
  eq('keyboard: consequence reached', s.step, 'consequence');
  ok('keyboard: focus moved into the new step controls',
    (await active()) === 'primaryBtn', `focus is #${await active()}`);

  await page.keyboard.press('Enter'); await idle(page); // -> interpret
  await page.keyboard.press('Enter'); await idle(page); // -> repair
  s = await read(page);
  eq('keyboard: repair reached', s.step, 'repair');
  await page.screenshot({ path: `${OUT}/kbd-01-repair.png` });

  await press('submitBtn');
  s = await read(page);
  eq('keyboard: wrong repair registered', [s.attempts, s.hintLevel], [1, 1]);

  // Arrow keys are the non-pointer alternative to placing cells.
  await tabTo('podMinus');
  for (let i = 0; i < 7; i += 1) {
    await page.keyboard.press('ArrowDown');
    await idle(page);
  }
  s = await read(page);
  eq('keyboard: arrow keys built the missing value', s.missing, 4);
  await page.screenshot({ path: `${OUT}/kbd-02-built.png` });

  await press('submitBtn');
  s = await read(page);
  eq('keyboard: repair settled', s.step, 'settled');

  await press('primaryBtn');
  s = await read(page);
  eq('keyboard: transfer reached', s.step, 'transfer');

  await press('submitBtn');
  s = await read(page);
  eq('keyboard: wrong transfer registered', s.attempts, 1);

  await tabTo('podPlus');
  for (let i = 0; i < 4; i += 1) {
    await page.keyboard.press('Enter');
    await idle(page);
  }
  s = await read(page);
  eq('keyboard: transfer built with the pod', s.missing, 4);

  await press('submitBtn');
  s = await read(page);
  eq('keyboard: summary reached without a pointer', s.step, 'summary');
  eq('keyboard: full path walked', s.stepsSeen, EXPECTED.OPERATIONAL_EQUAL.steps);
  await page.screenshot({ path: `${OUT}/kbd-03-summary.png` });
  await ctx.close();
}

/* --- 10. reduced motion ------------------------------------------------ */
console.log('\n[7] desktop + narrow — prefers-reduced-motion: reduce');
{
  for (const [w, h] of [[1280, 720], [390, 844]]) {
    const { ctx, page } = await newPage(browser, w, h, { reducedMotion: true });
    let s = await read(page);
    eq(`reduced motion ${w}x${h}: page sees the preference`, s.reducedMotion, true);
    const durations = await page.evaluate(() => {
      const g = (sel) => getComputedStyle(document.querySelector(sel));
      return {
        rail: g('#rail-left').transitionDuration,
        core: g('#core').transitionDuration,
      };
    });
    eq(`reduced motion ${w}x${h}: rail transition disabled`, durations.rail, '0s');
    eq(`reduced motion ${w}x${h}: core transition disabled`, durations.core, '0s');

    await click(page, '#primaryBtn');
    await click(page, '#primaryBtn');
    await click(page, '#primaryBtn');
    let guard = 0;
    while ((await read(page)).missing > 4 && guard < 20) { await click(page, '#removeCell'); guard += 1; }
    await page.click('#submitBtn');
    const busyRightAfter = await page.evaluate(() => window.__equalizerLab.busy());
    ok(`reduced motion ${w}x${h}: no success-pulse lock after a correct repair`,
      busyRightAfter === false, `busy() was ${busyRightAfter}`);
    s = await read(page);
    eq(`reduced motion ${w}x${h}: repair still settles`, s.step, 'settled');
    await page.screenshot({ path: `${OUT}/reduced-motion-${w}x${h}.png` });
    await ctx.close();
  }
}

/* --- 12. console and network ------------------------------------------ */
console.log('\n[8] console and network');
eq('zero console errors or warnings across every run', consoleProblems, []);
const origins = [...requestOrigins].sort();
const base = new global.URL(URL).origin;
ok('every network request is localhost only', origins.every((o) => o === base), origins.join(', '));
console.log('  request origins:', origins.join(', '));

await browser.close();

console.log('\n== result ==');
console.log('checks passed:', pass);
console.log('checks failed:', failures.length);
for (const f of failures) console.log('  -', f);
console.log('finished:', new Date().toISOString());
process.exit(failures.length === 0 ? 0 : 1);
