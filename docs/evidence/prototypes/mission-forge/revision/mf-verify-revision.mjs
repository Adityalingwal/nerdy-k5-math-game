// Mission Forge revision verification + evidence capture (dev tool, not runtime code).
// Drives the real UI with pointer, touch and keyboard in headless Chrome and
// checks the D-010 acceptance fact: the learner's story controls the world,
// Robo's opposite world, the repair action, the explanation and the transfer.
import { mkdirSync } from 'node:fs';
import { chromium } from '/Users/mac/Desktop/nerdy-k5-math-game/node_modules/playwright-core/index.mjs';

const URL = 'http://localhost:5173/prototypes/mission-forge/';
const OUT = '/Users/mac/Desktop/nerdy-k5-math-game/docs/evidence/prototypes/mission-forge/revision';
const CAPTURE = process.argv.includes('--capture');
mkdirSync(OUT, { recursive: true });

const results = [];
const errors = [];
const requests = new Set();
const log = (ok, msg) => {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* Each path is one valid reading of 12 ÷ 3 = 4. Everything else follows. */
const PATHS = {
  A: {
    key: 'A',
    example: '3 in each ship',
    missionId: 'ships-size',
    story: '12 crystals. Put 3 crystals in each ship. How many ships can launch?',
    reading: '3 = crystals per ship',
    tags: ['total crystals', 'crystals per ship', 'number of ships'],
    intended: { count: 4, size: 3 },
    robo: { count: 3, size: 4 },
    scan: { story: '3 in each ship', world: '4 in each ship' },
    divisorRole: 'groupSize',
    startGroups: 1,
    action: 'Repeat this group',
    wrongLoad: 4,
    rightLoad: 3,
    transfer: {
      missionId: 'rovers-count',
      startGroups: 5,
      action: 'Fill every rover the same',
      wrongLoad: 5,
      wrongWorld: [5, 5, 5, 5, 0],
      rightLoad: 4,
      rightWorld: [4, 4, 4, 4, 4],
      quotientRole: 'groupSize',
      quotientLabel: 'batteries in each rover',
      wrongAnswer: 'number of rovers',
    },
  },
  B: {
    key: 'B',
    example: '3 ships share',
    missionId: 'ships-count',
    story: '3 ships are sharing 12 crystals equally. How many crystals does each ship get?',
    reading: '3 = number of ships',
    tags: ['total crystals', 'number of ships', 'crystals per ship'],
    intended: { count: 3, size: 4 },
    robo: { count: 4, size: 3 },
    scan: { story: '3 ships', world: '4 ships' },
    divisorRole: 'groupCount',
    startGroups: 3,
    action: 'Fill every ship the same',
    wrongLoad: 3,
    rightLoad: 4,
    transfer: {
      missionId: 'rovers-size',
      startGroups: 1,
      action: 'Repeat this group',
      wrongLoad: 4,
      wrongWorld: [4, 4, 4, 4, 4],
      rightLoad: 5,
      rightWorld: [5, 5, 5, 5],
      quotientRole: 'groupCount',
      quotientLabel: 'number of rovers',
      wrongAnswer: 'batteries in each rover',
    },
  },
};

async function shot(page, name) {
  if (!CAPTURE) return;
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(name.includes('launch') ? 0 : 650);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`      saved ${name}.png`);
}

const step = (page) => page.evaluate(() => window.__missionForge.step());
const probe = (page) =>
  page.evaluate(() => ({
    step: window.__missionForge.step(),
    missionId: window.__missionForge.missionId(),
    firstMissionId: window.__missionForge.firstMissionId(),
    mode: window.__missionForge.mode(),
    roles: window.__missionForge.roles(),
    world: window.__missionForge.world(),
  }));
const world = (page) => page.evaluate(() => window.__missionForge.world());
const idle = (page) => page.waitForFunction(() => !window.__missionForge.busy());

async function waitStep(page, name, timeout = 25000) {
  await page.waitForFunction((s) => window.__missionForge.step() === s && !window.__missionForge.busy(), name, { timeout });
}

function watch(page, label) {
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${label}] console.${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[${label}] pageerror: ${e}`));
  page.on('request', (r) => requests.add(new globalThis.URL(r.url()).origin));
}

const btn = (page, name) => page.getByRole('button', { name, exact: true });
const counts = (w) => w.groups.map((g) => g.count);

/** Nothing in the bay may paint over the dock, at any step. */
async function checkLayout(page, prefix, label) {
  const r = await page.evaluate(() => {
    const rect = (s) => {
      const e = document.querySelector(s);
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return { bottom: Math.round(b.bottom) };
    };
    return {
      pile: rect('#pile'),
      groups: rect('#groups'),
      chips: rect('#chips'),
      dockTop: Math.round(document.querySelector('#dock').getBoundingClientRect().top),
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
    };
  });
  const bad = ['pile', 'groups', 'chips'].filter((k) => r[k] && r[k].bottom > r.dockTop + 1);
  log(bad.length === 0, `${prefix}: ${label} — bay does not overlap the dock (${bad.join(', ') || 'clear'})`);
  log(r.sw <= r.iw, `${prefix}: ${label} — no horizontal scroll (${r.sw} <= ${r.iw})`);
}

/**
 * One complete play of one story path. Pointer or touch; the keyboard run is
 * separate. Every assertion is derived from the path table above, so a build
 * that ignored the story would fail on the other path.
 */
async function playRun(page, p, prefix, { capture = false, mobile = false, typed = null } = {}) {
  const t0 = Date.now();
  const tap = (loc) => (mobile ? loc.tap() : loc.click());
  const cap = (name) => (capture ? shot(page, `${mobile ? 'mob' : 'desk'}-${p.key}-${name}`) : Promise.resolve());

  await btn(page, 'Forge a mission').waitFor({ state: 'visible' });
  const firstAction = Date.now() - t0;
  log(firstAction < 10000, `${prefix}: first action visible in ${firstAction} ms`);
  const badge = await page.locator('#disclosure').textContent();
  log(badge === 'Scripted concept prototype — no runtime AI', `${prefix}: disclosure badge exact`);
  await cap('01-opening');

  await tap(btn(page, 'Forge a mission'));
  await waitStep(page, 'forge');
  const box = page.locator('#story');
  log(await box.isEditable(), `${prefix}: one editable story field`);
  const exampleButtons = await page.locator('.forge-examples .btn').allTextContents();
  log(
    exampleButtons.length === 2 && exampleButtons.join('|') === '3 in each ship|3 ships share',
    `${prefix}: two example controls ${JSON.stringify(exampleButtons)}`,
  );

  if (typed) {
    await box.fill(typed);
    log(true, `${prefix}: typed wording "${typed}"`);
  } else {
    await tap(btn(page, p.example));
    log((await box.inputValue()) === p.story, `${prefix}: example "${p.example}" fills the story field`);
  }
  await cap('02-story-forge');
  await tap(btn(page, 'Build my world'));

  // The story chooses the schema. This is the revision's whole claim.
  await page.waitForSelector('.match-note');
  const note = (await page.locator('.match-note').textContent()).trim();
  log(note === `Local script read this as: ${p.reading}. No AI is running.`, `${prefix}: interpreter discloses "${note}"`);
  await page.waitForFunction(
    () => document.querySelectorAll('.eq-card .role-tag').length === 3 && window.__missionForge.world().pile >= 12,
    null,
    { timeout: 20000 },
  );
  const tags = await page.locator('.eq-card .role-tag').allTextContents();
  log(JSON.stringify(tags) === JSON.stringify(p.tags), `${prefix}: equation labels ${JSON.stringify(tags)}`);
  await cap('03-compile-reveal');

  await waitStep(page, 'verdict');
  let s = await probe(page);
  log(s.missionId === p.missionId, `${prefix}: story selected schema ${s.missionId}`);
  log(s.roles.divisor === p.divisorRole, `${prefix}: 3 is the ${s.roles.divisor}`);
  log(
    s.world.groups.length === p.robo.count && counts(s.world).every((c) => c === p.robo.size) && s.world.pile === 0,
    `${prefix}: Robo builds the opposite world ${s.world.groups.length} × ${counts(s.world)[0]}, 0 left`,
  );
  log((await page.locator('#robo').getAttribute('data-mood')) === 'wrong', `${prefix}: Robo looks confidently wrong`);
  await checkLayout(page, prefix, 'robo world');
  await cap('04-robo-wrong-world');

  // "Yes, launch" → stall + mission scanner comparing what the story fixed.
  await tap(btn(page, 'Yes, launch'));
  await waitStep(page, 'scan');
  const scan = await page.locator('#scan').textContent();
  log(
    scan.includes(`Story: ${p.scan.story}`) && scan.includes(`World: ${p.scan.world}`),
    `${prefix}: scanner compares "${p.scan.story}" with "${p.scan.world}"`,
  );
  log((await page.locator('#chips .chip.mismatch').count()) === 1, `${prefix}: mismatch marked with ≠ and dashed text, not colour alone`);
  await cap('04b-scanner-mismatch');
  await tap(btn(page, 'Debug it'));
  await waitStep(page, 'identify');

  // Wrong identification first: Robo's own reading.
  const roboRole = p.divisorRole === 'groupSize' ? 'groupCount' : 'groupSize';
  await tap(page.locator(`.options .btn[data-value="${roboRole}"]`));
  log(/thought too/.test(await page.locator('.hint').textContent()), `${prefix}: Robo's reading is rejected with a story hint`);
  await tap(page.locator(`.options .btn[data-value="${p.divisorRole}"]`));
  await waitStep(page, 'repair');
  s = await probe(page);
  log(
    s.world.groups.length === p.startGroups && counts(s.world).every((c) => c === 0) && s.world.pile === 12,
    `${prefix}: repair starts with ${s.world.groups.length} empty ship(s) and 12 crystals (mode ${s.mode})`,
  );
  const actionLabel = (await page.locator('.dock .btn.primary').textContent()).trim();
  log(actionLabel === p.action, `${prefix}: repair action is "${actionLabel}"`);
  await checkLayout(page, prefix, 'repair start');
  await cap('05-repair-start');

  // A wrong construction, played out for real.
  for (let i = 0; i < p.wrongLoad; i += 1) {
    await tap(page.locator('#pile .item').first());
    await idle(page);
  }
  await tap(page.locator('.dock .btn.primary'));
  await waitStep(page, 'repair-fail');
  const failText = (await page.locator('.hint').textContent()).trim();
  log(failText.length > 0 && !/undefined/.test(failText), `${prefix}: wrong repair (${p.wrongLoad} each) → "${failText}"`);
  await cap('05b-repair-wrong');
  await tap(btn(page, 'Try again'));
  await waitStep(page, 'repair');

  // Correct construction: taps, plus one mouse drag on desktop.
  for (let i = 0; i < p.rightLoad - (mobile ? 0 : 1); i += 1) {
    await tap(page.locator('#pile .item').first());
    await idle(page);
  }
  if (!mobile) {
    const src = await page.locator('#pile .item').last().boundingBox();
    const dst = await page.locator('.group.loading .cargo').boundingBox();
    await page.mouse.move(src.x + src.width / 2, src.y + src.height / 2);
    await page.mouse.down();
    await page.mouse.move(src.x + 40, src.y - 30, { steps: 5 });
    await page.mouse.move(dst.x + dst.width / 2, dst.y + dst.height / 2, { steps: 10 });
    await page.mouse.up();
    await idle(page);
  }
  s = await probe(page);
  log(counts(s.world)[0] === p.rightLoad, `${prefix}: ${mobile ? 'taps' : 'taps + drag'} loaded ${counts(s.world)[0]}`);
  await tap(page.locator('.dock .btn.primary'));
  await waitStep(page, 'repaired');
  s = await probe(page);
  log(
    s.world.groups.length === p.intended.count && counts(s.world).every((c) => c === p.intended.size) && s.world.pile === 0,
    `${prefix}: repaired world = ${s.world.groups.length} ships × ${counts(s.world)[0]}, 0 left`,
  );
  await cap('06-repaired-world');
  await tap(btn(page, 'Launch mission'));
  await waitStep(page, 'teach');

  // Teach Robo: swapped answers are rejected, the story's roles are accepted.
  const slot = (term) => page.locator(`fieldset.slot:has(input[name="slot-${term}"])`);
  await tap(slot('divisor').locator(`input[value="${roboRole}"]`));
  await tap(slot('quotient').locator(`input[value="${p.divisorRole}"]`));
  await tap(btn(page, 'Teach Robo'));
  log((await page.locator('fieldset.slot.wrong').count()) === 2, `${prefix}: swapped teach answers flagged`);
  await tap(slot('divisor').locator(`input[value="${p.divisorRole}"]`));
  await tap(slot('quotient').locator(`input[value="${roboRole}"]`));
  await tap(btn(page, 'Teach Robo'));
  await waitStep(page, 'taught');
  const said = await page.locator('#bubble').textContent();
  log(said.startsWith('Got it!') && said.includes(p.tags[1].split(' ')[0]), `${prefix}: Robo restates "${said}"`);
  await cap('07-robo-restates');

  // Transfer: the opposite orientation to the story just played.
  await tap(btn(page, 'Next mission →'));
  await waitStep(page, 'transfer');
  s = await probe(page);
  log(s.missionId === p.transfer.missionId, `${prefix}: transfer mission is ${s.missionId}`);
  log(s.mode !== (p.divisorRole === 'groupSize' ? 'repeat' : 'fill'), `${prefix}: transfer reverses the build (mode ${s.mode})`);
  log(
    s.world.groups.length === p.transfer.startGroups && s.world.pile === 20,
    `${prefix}: transfer starts with ${s.world.groups.length} rover(s) and 20 batteries`,
  );
  const eqNums = (await page.locator('.eq-card .eq-num').allTextContents()).join(',');
  log(eqNums === '20,5,4', `${prefix}: transfer equation ${eqNums}`);
  await checkLayout(page, prefix, 'transfer start');
  await cap('08-transfer-mission');

  for (let i = 0; i < p.transfer.wrongLoad; i += 1) {
    await tap(btn(page, '+ Load a battery'));
    await idle(page);
  }
  await tap(page.locator('.dock .btn.primary'));
  await waitStep(page, 'transfer-fail');
  s = await probe(page);
  log(
    JSON.stringify(counts(s.world)) === JSON.stringify(p.transfer.wrongWorld),
    `${prefix}: transfer misconception (${p.transfer.wrongLoad} each) → [${counts(s.world)}] and is rejected`,
  );
  await cap('08b-transfer-wrong');
  await tap(btn(page, 'Try again'));
  await waitStep(page, 'transfer');
  for (let i = 0; i < p.transfer.rightLoad; i += 1) {
    await tap(btn(page, '+ Load a battery'));
    await idle(page);
  }
  await tap(page.locator('.dock .btn.primary'));
  await waitStep(page, 'transfer-pass');
  s = await probe(page);
  log(
    JSON.stringify(counts(s.world)) === JSON.stringify(p.transfer.rightWorld) && s.world.pile === 0,
    `${prefix}: transfer solved [${counts(s.world)}], 0 left`,
  );
  await tap(btn(page, p.transfer.wrongAnswer));
  log((await page.locator('.hint').textContent()).trim().length > 0, `${prefix}: wrong transfer unit gets a hint`);
  await tap(btn(page, p.transfer.quotientLabel));
  await waitStep(page, 'transfer-done');
  const contrast = await page.locator('#bubble').textContent();
  log(contrast.includes('Here, 4 counts'), `${prefix}: contrast line "${contrast}"`);
  await cap('09-transfer-understood');
  await tap(btn(page, 'Finish'));
  await waitStep(page, 'summary');
  const rows = (await page.locator('.summary-rows').textContent()).replace(/\s+/g, ' ').trim();
  log(
    rows.includes(p.tags[2] === 'number of ships' ? 'number of ships' : 'crystals in each ship'),
    `${prefix}: summary "${rows}"`,
  );
  await cap('10-final-summary');
  return Date.now() - t0;
}

/* Keyboard-only completion of one path, starting from the opening. */
async function keyboardRun(page, p, prefix) {
  const k = (key) => page.keyboard.press(key);
  const focusedText = () => page.evaluate(() => document.activeElement?.textContent?.trim() || document.activeElement?.id);
  const tabTo = async (label, max = 18) => {
    for (let i = 0; i < max; i += 1) {
      if ((await focusedText()) === label) return true;
      await k('Tab');
    }
    return (await focusedText()) === label;
  };

  log((await focusedText()) === 'Forge a mission', `${prefix}: focus starts on "Forge a mission"`);
  await k('Enter');
  await waitStep(page, 'forge');
  log((await page.evaluate(() => document.activeElement.id)) === 'story', `${prefix}: focus moves into the story box`);
  await k('Meta+a');
  await page.keyboard.type(p.typed);
  await k('Enter');
  await waitStep(page, 'verdict');
  const s0 = await probe(page);
  log(s0.missionId === p.missionId, `${prefix}: typed wording selected ${s0.missionId}`);
  log(await tabTo('No, debug it'), `${prefix}: Tab reaches "No, debug it"`);
  await k('Enter');
  await waitStep(page, 'identify');
  const label = p.divisorRole === 'groupSize' ? 'crystals per ship' : 'number of ships';
  log(await tabTo(label), `${prefix}: Tab reaches "${label}"`);
  await k('Enter');
  await waitStep(page, 'repair');
  log((await focusedText()) === '+ Load a crystal', `${prefix}: focus on "+ Load a crystal"`);
  for (let i = 0; i < p.rightLoad; i += 1) {
    await k('Enter');
    await idle(page);
  }
  log(await tabTo(p.action), `${prefix}: Tab reaches "${p.action}"`);
  await k('Enter');
  await waitStep(page, 'repaired');
  await k('Enter'); // Launch mission (autofocused)
  await waitStep(page, 'teach');
  // Radios: first is "crystals in each ship"; ArrowRight walks the group.
  const want = { divisor: p.divisorRole, quotient: p.divisorRole === 'groupSize' ? 'groupCount' : 'groupSize' };
  for (const term of ['divisor', 'quotient']) {
    if (term === 'quotient') await k('Tab');
    await k('Space');
    let value = await page.evaluate((t) => document.querySelector(`input[name="slot-${t}"]:checked`)?.value, term);
    let guard = 0;
    while (value !== want[term] && guard < 3) {
      await k('ArrowRight');
      value = await page.evaluate((t) => document.querySelector(`input[name="slot-${t}"]:checked`)?.value, term);
      guard += 1;
    }
  }
  const picked = await page.evaluate(() => ({
    d: document.querySelector('input[name="slot-divisor"]:checked')?.value,
    q: document.querySelector('input[name="slot-quotient"]:checked')?.value,
  }));
  log(picked.d === want.divisor && picked.q === want.quotient, `${prefix}: radios chosen by keyboard ${JSON.stringify(picked)}`);
  log(await tabTo('Teach Robo'), `${prefix}: Tab reaches "Teach Robo"`);
  await k('Enter');
  await waitStep(page, 'taught');
  await k('Enter');
  await waitStep(page, 'transfer');
  for (let i = 0; i < p.transfer.rightLoad; i += 1) {
    await k('Enter');
    await idle(page);
  }
  log(await tabTo(p.transfer.action), `${prefix}: Tab reaches "${p.transfer.action}"`);
  await k('Enter');
  await waitStep(page, 'transfer-pass');
  log(await tabTo(p.transfer.quotientLabel), `${prefix}: Tab reaches "${p.transfer.quotientLabel}"`);
  await k('Enter');
  await waitStep(page, 'transfer-done');
  await k('Enter');
  await waitStep(page, 'summary');
  log((await focusedText()) === 'Replay', `${prefix}: keyboard run reached the summary`);
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  log(outline === 'solid', `${prefix}: focused control shows a solid outline (${outline})`);
}

/* Honest refusals: the interpreter never invents a schema. */
async function refusalChecks(page, prefix) {
  await btn(page, 'Forge a mission').click();
  await waitStep(page, 'forge');
  const box = page.locator('#story');
  const cases = [
    ['My dog ate 7 cookies.', /only knows/, 'unrelated text'],
    ['12 crystals and 3 ships.', /can’t tell what the 3 counts/, 'ambiguous text'],
    ['', /Write a mission story/, 'empty text'],
  ];
  for (const [text, pattern, label] of cases) {
    await box.fill(text);
    await btn(page, 'Build my world').click();
    await wait(250);
    const hint = (await page.locator('.hint').textContent()).trim();
    log((await step(page)) === 'forge' && pattern.test(hint), `${prefix}: ${label} refused honestly — "${hint}"`);
  }
  await shot(page, 'desk-refusal-ambiguous');
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  /* Runs 1-2: both paths, desktop pointer, on ONE page with Replay between. */
  const desk = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const p1 = await desk.newPage();
  watch(p1, 'desktop');
  await p1.goto(URL);
  await refusalChecks(p1, 'run0-refusals');
  await p1.reload();
  const msA = await playRun(p1, PATHS.A, 'run1-desktop-A', { capture: true });
  console.log(`      run 1 wall time ${Math.round(msA / 1000)} s (scripted, no reading pauses)`);
  await btn(p1, 'Replay').click();
  await waitStep(p1, 'arrive');
  const afterReplay = await probe(p1);
  log(
    afterReplay.missionId === null && afterReplay.world.groups.length === 0 && afterReplay.world.pile === 0,
    'run1: Replay clears the selected schema and the world without a reload',
  );
  log(
    (await p1.locator('.eq-card .role-tag').count()) === 0,
    'run1: Replay clears the equation role labels',
  );
  const msB = await playRun(p1, PATHS.B, 'run2-desktop-B', { capture: true });
  console.log(`      run 2 wall time ${Math.round(msB / 1000)} s`);
  const finalB = await probe(p1);
  log(finalB.firstMissionId === 'ships-count', 'run2: the second story selected the other schema on the same page');
  await desk.close();

  /* Run 3: keyboard only, typed wording (not the example buttons), path B. */
  const kb = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const p3 = await kb.newPage();
  watch(p3, 'keyboard');
  await p3.goto(URL);
  await p3.getByRole('button', { name: 'Forge a mission', exact: true }).focus();
  await keyboardRun(p3, { ...PATHS.B, typed: 'Share 12 crystals equally across 3 ships. How many crystals does each ship get?' }, 'run3-keyboard-B');
  await kb.close();

  /* Run 4: keyboard only, typed alternate wording, path A. */
  const kb2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const p4 = await kb2.newPage();
  watch(p4, 'keyboard-A');
  await p4.goto(URL);
  await p4.getByRole('button', { name: 'Forge a mission', exact: true }).focus();
  await keyboardRun(p4, { ...PATHS.A, typed: 'Each ship holds 3 crystals. There are 12 crystals. How many ships?' }, 'run4-keyboard-A');
  await kb2.close();

  /* Runs 5-6: both paths at 390 x 844 with touch. */
  for (const key of ['A', 'B']) {
    const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const pm = await mob.newPage();
    watch(pm, `mobile-${key}`);
    await pm.goto(URL);
    await playRun(pm, PATHS[key], `run${key === 'A' ? 5 : 6}-mobile-${key}`, { capture: true, mobile: true });
    await mob.close();
  }

  /* Run 7: the short narrow window from the live review (390 x 720). */
  const short = await browser.newContext({ viewport: { width: 390, height: 720 }, hasTouch: true, isMobile: true });
  const p7 = await short.newPage();
  watch(p7, 'mobile-short');
  await p7.goto(URL);
  await playRun(p7, PATHS.B, 'run7-mobile-390x720-B', { mobile: true });
  await short.close();

  /* Run 8: reduced motion, path A. */
  const red = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  const p8 = await red.newPage();
  watch(p8, 'reduced');
  let flyers = 0;
  await p8.exposeFunction('__noteFlyer', () => (flyers += 1));
  await p8.addInitScript(() => {
    new MutationObserver((list) => {
      for (const m of list)
        for (const n of m.addedNodes)
          if (n.classList && (n.classList.contains('flyer') || n.classList.contains('beam'))) window.__noteFlyer();
    }).observe(document, { childList: true, subtree: true });
  });
  await p8.goto(URL);
  const msR = await playRun(p8, PATHS.A, 'run8-reduced-motion-A');
  const anim = await p8.evaluate(() => getComputedStyle(document.querySelector('.btn')).transitionDuration);
  log(flyers === 0, `run8: reduced motion spawns no flying/beam elements (${flyers})`);
  log(anim === '0.001s', `run8: CSS transitions collapse under reduced motion (${anim})`);
  console.log(`      run 8 wall time ${Math.round(msR / 1000)} s`);
  await red.close();

  await browser.close();

  const foreign = [...requests].filter((o) => o !== 'http://localhost:5173');
  log(foreign.length === 0, `network: only localhost requests (${[...requests].join(', ')})`);
  log(errors.length === 0, `console: ${errors.length} errors/warnings${errors.length ? `\n${errors.join('\n')}` : ''}`);
  const fails = results.filter((r) => r.startsWith('FAIL')).length;
  console.log(`\n${results.length - fails}/${results.length} checks passed`);
  process.exitCode = fails ? 1 : 0;
}

await main();
