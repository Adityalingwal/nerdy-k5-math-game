// Mission Forge verification + evidence capture (scratchpad tool, not part of the repo).
// Drives the real UI with pointer and keyboard in headless Chrome.
import { mkdirSync } from 'node:fs';
import { chromium } from '/Users/mac/Desktop/nerdy-k5-math-game/node_modules/playwright-core/index.mjs';

const URL = 'http://localhost:5173/prototypes/mission-forge/';
const OUT = '/Users/mac/Desktop/nerdy-k5-math-game/docs/evidence/prototypes/mission-forge';
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

async function shot(page, name) {
  if (!CAPTURE) return;
  // Playwright's locator clicks can scroll the window; users do not see that.
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(name.includes('launch') ? 0 : 650); // let pop/materialise animations settle
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`      saved ${name}.png`);
}

async function step(page) {
  return page.evaluate(() => window.__missionForge.step());
}

async function waitStep(page, name, timeout = 20000) {
  await page.waitForFunction(
    (s) => window.__missionForge.step() === s && !window.__missionForge.busy(),
    name,
    { timeout },
  );
}

async function world(page) {
  return page.evaluate(() => window.__missionForge.world());
}

function watch(page, label) {
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${label}] console.${m.type()}: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[${label}] pageerror: ${e}`));
  page.on('request', (r) => requests.add(new globalThis.URL(r.url()).origin));
}

const btn = (page, name) => page.getByRole('button', { name, exact: true });

async function noHorizontalScroll(page, label) {
  const { sw, iw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
  }));
  log(sw <= iw, `${label}: no horizontal scroll (scrollWidth ${sw} <= ${iw})`);
}

/* Pointer run: demo wording, Yes branch, tap + drag repair, wrong tries. */
async function pointerRun(page, prefix, { capture = false, mobile = false } = {}) {
  const t0 = Date.now();
  await page.goto(URL);
  await btn(page, 'Forge a mission').waitFor({ state: 'visible' });
  const firstAction = Date.now() - t0;
  log(firstAction < 10000, `${prefix}: first action visible in ${firstAction} ms`);
  const badge = await page.locator('#disclosure').textContent();
  log(badge === 'Scripted concept prototype — no runtime AI', `${prefix}: disclosure badge text exact`);
  if (capture) await shot(page, mobile ? '08-mobile-01-opening' : '01-opening');

  const tap = (loc) => (mobile ? loc.tap() : loc.click());
  await tap(btn(page, 'Forge a mission'));
  await waitStep(page, 'forge');
  const box = page.locator('#story');
  log((await box.isEditable()) && (await box.inputValue()).includes('3 crystals in each ship'), `${prefix}: story textarea editable and prefilled`);

  // Unsupported text gets an honest refusal, not a fabricated world.
  await box.fill('My dog ate 7 cookies.');
  await tap(btn(page, 'Build my world'));
  await wait(200);
  log((await step(page)) === 'forge' && /only knows/.test(await page.locator('.hint').textContent()), `${prefix}: unsupported story refused honestly`);
  await tap(btn(page, 'Use demo idea'));
  if (capture) {
    await box.click();
    await shot(page, mobile ? '08-mobile-02-forge' : '02-story-forge');
  }
  await tap(btn(page, 'Build my world'));

  // Mid-compile: role tags + crystals materialising.
  await page.waitForFunction(() => document.querySelectorAll('.eq-card .role-tag').length === 3 && window.__missionForge.world().pile >= 12, null, { timeout: 15000 });
  const matchNote = await page.locator('.match-note').count();
  const tags = await page.locator('.eq-card .role-tag').allTextContents();
  log(
    JSON.stringify(tags) === JSON.stringify(['total crystals', 'crystals per ship', 'number of ships']),
    `${prefix}: compile maps 12/3/4 to ${JSON.stringify(tags)}`,
  );
  if (capture) await shot(page, mobile ? '08-mobile-03-compile' : '03-compile-reveal');
  if (!prefix.includes('reduced')) log(matchNote === 1, `${prefix}: compile shows "Local script matched ... No AI is running." note`);

  await waitStep(page, 'verdict');
  let w = await world(page);
  log(
    w.groups.length === 3 && w.groups.every((g) => g.count === 4) && w.pile === 0,
    `${prefix}: Robo builds ${w.groups.length} ships x ${w.groups.map((g) => g.count).join('/')} with ${w.pile} left`,
  );
  const chips = await page.locator('#chips .chip').allTextContents();
  log(chips.includes('3 ships') && chips.includes('4 in each ship'), `${prefix}: world chips ${JSON.stringify(chips)}`);
  const mood = await page.locator('#robo').getAttribute('data-mood');
  log(mood === 'wrong', `${prefix}: Robo mood is confidently wrong (${mood})`);
  if (capture) await shot(page, mobile ? '08-mobile-04-robo-wrong' : '04-robo-wrong-world');

  // Yes branch: one ship stalls, scanner compares story with world.
  await tap(btn(page, 'Yes, launch'));
  await waitStep(page, 'scan');
  const scan = await page.locator('#scan').textContent();
  log(/Story: 3 in each ship/.test(scan) && /World: 4 in each ship/.test(scan), `${prefix}: scanner shows "${scan}"`);
  const mism = await page.locator('#chips .chip.mismatch').count();
  log(mism === 1, `${prefix}: mismatch chip uses ≠ + dashed text cue (${mism})`);
  if (capture) await shot(page, mobile ? '08-mobile-04b-scanner' : '04b-scanner-mismatch');
  await tap(btn(page, 'Debug it'));
  await waitStep(page, 'identify');

  // Wrong identification first.
  await tap(btn(page, 'number of ships'));
  log(/thought too/.test(await page.locator('.hint').textContent()), `${prefix}: wrong identify gets a story-pointing hint`);
  await tap(btn(page, 'crystals per ship'));
  await waitStep(page, 'repair');
  w = await world(page);
  log(w.groups.length === 1 && w.groups[0].count === 0 && w.pile === 12, `${prefix}: repair starts with 1 empty ship and 12 crystals`);

  // Wrong group size first (4): repeat reproduces Robo's world.
  for (let i = 0; i < 4; i += 1) {
    await tap(page.locator('#pile .item').first());
    await wait(450);
  }
  await page.waitForFunction(() => !window.__missionForge.busy());
  await tap(btn(page, 'Repeat this group'));
  await waitStep(page, 'repair-fail');
  log(/my world again/.test(await page.locator('.hint').textContent()), `${prefix}: repeating 4 reproduces Robo's world and is rejected`);
  await tap(btn(page, 'Try again'));
  await waitStep(page, 'repair');

  // Correct: tap two crystals, drag the third.
  for (let i = 0; i < 2; i += 1) {
    await tap(page.locator('#pile .item').first());
    await wait(450);
  }
  if (!mobile) {
    const src = await page.locator('#pile .item').last().boundingBox();
    const dst = await page.locator('.group.loading .cargo').boundingBox();
    await page.mouse.move(src.x + src.width / 2, src.y + src.height / 2);
    await page.mouse.down();
    await page.mouse.move(src.x + 40, src.y - 30, { steps: 5 });
    await page.mouse.move(dst.x + dst.width / 2, dst.y + dst.height / 2, { steps: 10 });
    await page.mouse.up();
  } else {
    await tap(page.locator('#pile .item').first());
  }
  await page.waitForFunction(() => !window.__missionForge.busy());
  w = await world(page);
  log(w.groups[0].count === 3 && w.pile === 9, `${prefix}: ${mobile ? 'tap' : 'tap + drag'} loads 3 crystals (ship ${w.groups[0].count}, pile ${w.pile})`);
  await tap(btn(page, 'Repeat this group'));
  await waitStep(page, 'repaired');
  w = await world(page);
  log(w.groups.length === 4 && w.groups.every((g) => g.count === 3) && w.pile === 0, `${prefix}: repaired world = 4 ships x 3, 0 left`);
  if (capture) await shot(page, mobile ? '08-mobile-05-repaired' : '05a-repaired-world');
  await tap(btn(page, 'Launch mission'));
  if (capture && !mobile) {
    await page.waitForFunction(() => document.querySelectorAll('.group.launch').length >= 3);
    await wait(250);
    await shot(page, '05-corrected-launch');
  }
  await waitStep(page, 'teach');
  if (capture && !mobile) await shot(page, '05b-teach-robo');

  // Teach: wrong then right.
  const slot = (term) => page.locator(`fieldset.slot:has(input[name="slot-${term}"])`);
  await tap(slot('divisor').getByRole('radio', { name: 'number of ships' }));
  await tap(slot('quotient').getByRole('radio', { name: 'crystals in each ship' }));
  await tap(btn(page, 'Teach Robo'));
  log((await page.locator('fieldset.slot.wrong').count()) === 2, `${prefix}: swapped teach answers are flagged`);
  await tap(slot('divisor').getByRole('radio', { name: 'crystals in each ship' }));
  await tap(slot('quotient').getByRole('radio', { name: 'number of ships' }));
  await tap(btn(page, 'Teach Robo'));
  await waitStep(page, 'taught');
  const said = await page.locator('#bubble').textContent();
  log(/3 was crystals in each ship, and 4 was the number of ships/.test(said), `${prefix}: Robo restates "${said}"`);
  log((await page.locator('#robo').getAttribute('data-mood')) === 'understood', `${prefix}: Robo mood understood`);
  if (capture && !mobile) await shot(page, '05c-robo-restates');

  // Transfer.
  await tap(btn(page, 'Next mission →'));
  await waitStep(page, 'transfer');
  w = await world(page);
  const eq = (await page.locator('.eq-card .eq-num').allTextContents()).join(',');
  log(eq === '20,5,4', `${prefix}: transfer equation numbers ${eq}`);
  log(w.groups.length === 5 && w.groups.every((g) => g.count === 0) && w.pile === 20, `${prefix}: 5 fixed rovers before acting, 20 batteries`);
  if (capture) await shot(page, mobile ? '08-mobile-06-transfer' : '06-transfer-mission');

  // Misconception path: 5 per rover (divisor treated as group size).
  for (let i = 0; i < 5; i += 1) await tap(btn(page, '+ Load a battery'));
  await page.waitForFunction(() => !window.__missionForge.busy());
  await tap(btn(page, 'Fill every rover the same'));
  await waitStep(page, 'transfer-fail');
  w = await world(page);
  log(
    JSON.stringify(w.groups.map((g) => g.count)) === '[5,5,5,5,0]' && /Rover 5 got less/.test(await page.locator('.hint').textContent()),
    `${prefix}: 5-per-rover leaves rover 5 empty and is rejected`,
  );
  if (capture && !mobile) await shot(page, '06b-transfer-divisor-as-size');
  await tap(btn(page, 'Try again'));
  await waitStep(page, 'transfer');
  for (let i = 0; i < 4; i += 1) await tap(btn(page, '+ Load a battery'));
  await page.waitForFunction(() => !window.__missionForge.busy());
  await tap(btn(page, 'Fill every rover the same'));
  await waitStep(page, 'transfer-pass');
  w = await world(page);
  log(JSON.stringify(w.groups.map((g) => g.count)) === '[4,4,4,4,4]' && w.pile === 0, `${prefix}: 4 per rover passes (5 x 4, 0 left)`);
  await tap(btn(page, 'number of rovers'));
  log(/Count the rovers/.test(await page.locator('.hint').textContent()), `${prefix}: wrong unit answer gets a hint`);
  await tap(btn(page, 'batteries in each rover'));
  await waitStep(page, 'transfer-done');
  if (capture && !mobile) await shot(page, '06c-transfer-understood');
  await tap(btn(page, 'Finish'));
  await waitStep(page, 'summary');
  const title = await page.locator('#summary-title').textContent();
  log(title === 'You taught Robo: division can ask for group size or number of groups.', `${prefix}: summary "${title}"`);
  if (capture) await shot(page, mobile ? '08-mobile-07-summary' : '07-final-summary');
  if (mobile) await noHorizontalScroll(page, prefix);
  return Date.now() - t0;
}

/* Keyboard-only run: alternate wording, No branch. Starts from Replay. */
async function keyboardRun(page, prefix) {
  const k = (key) => page.keyboard.press(key);
  const focusedText = () => page.evaluate(() => document.activeElement?.textContent?.trim() || document.activeElement?.id);
  const tabTo = async (label, max = 15) => {
    for (let i = 0; i < max; i += 1) {
      if ((await focusedText()) === label) return true;
      await k('Tab');
    }
    return (await focusedText()) === label;
  };

  log((await focusedText()) === 'Forge a mission', `${prefix}: after Replay, focus is on "Forge a mission"`);
  const w0 = await world(page);
  log(w0.groups.length === 0 && w0.pile === 0 && (await step(page)) === 'arrive', `${prefix}: Replay reset every state without reload`);
  const eq0 = (await page.locator('.eq-card .eq-row').textContent()).replace(/\s+/g, '');
  log(eq0.startsWith('12÷3=4') && (await page.locator('.eq-card .role-tag').count()) === 0, `${prefix}: Replay reset equation card to 12 ÷ 3 = 4 with no tags`);

  await k('Enter');
  await waitStep(page, 'forge');
  log((await page.evaluate(() => document.activeElement.id)) === 'story', `${prefix}: focus moves into the story box`);
  await k('Meta+a');
  await page.keyboard.type('Each ship holds 3 crystals. There are 12 crystals. How many ships?');
  await k('Enter');
  await waitStep(page, 'verdict');
  log(true, `${prefix}: alternate wording built the world via keyboard`);
  // Focus lands on "Yes, launch"; Tab to "No, debug it".
  log(await tabTo('No, debug it'), `${prefix}: Tab reaches "No, debug it"`);
  await k('Enter');
  await waitStep(page, 'identify');
  log(await tabTo('crystals per ship'), `${prefix}: Tab reaches "crystals per ship"`);
  await k('Enter');
  await waitStep(page, 'repair');
  log((await focusedText()) === '+ Load a crystal', `${prefix}: focus on "+ Load a crystal"`);
  for (let i = 0; i < 3; i += 1) {
    await k('Enter');
    await page.waitForFunction(() => !window.__missionForge.busy());
  }
  const w = await world(page);
  log(w.groups[0].count === 3, `${prefix}: keyboard loaded 3 crystals`);
  log(await tabTo('Repeat this group'), `${prefix}: Tab reaches "Repeat this group"`);
  await k('Enter');
  await waitStep(page, 'repaired');
  await k('Enter'); // Launch mission (autofocused)
  await waitStep(page, 'teach');
  // First radio of the "3 was" group is focused: "crystals in each ship".
  await k('Space');
  await k('Tab'); // into the "4 was" radio group
  await k('ArrowRight'); // -> "number of ships"
  const picked = await page.evaluate(() => ({
    d: document.querySelector('input[name="slot-divisor"]:checked')?.value,
    q: document.querySelector('input[name="slot-quotient"]:checked')?.value,
  }));
  log(picked.d === 'groupSize' && picked.q === 'groupCount', `${prefix}: radios chosen by keyboard ${JSON.stringify(picked)}`);
  log(await tabTo('Teach Robo'), `${prefix}: Tab reaches "Teach Robo"`);
  await k('Enter');
  await waitStep(page, 'taught');
  await k('Enter');
  await waitStep(page, 'transfer');
  for (let i = 0; i < 4; i += 1) {
    await k('Enter');
    await page.waitForFunction(() => !window.__missionForge.busy());
  }
  log(await tabTo('Fill every rover the same'), `${prefix}: Tab reaches "Fill every rover the same"`);
  await k('Enter');
  await waitStep(page, 'transfer-pass');
  log(await tabTo('batteries in each rover'), `${prefix}: Tab reaches "batteries in each rover"`);
  await k('Enter');
  await waitStep(page, 'transfer-done');
  await k('Enter');
  await waitStep(page, 'summary');
  log((await focusedText()) === 'Replay', `${prefix}: keyboard run reached summary; focus on Replay`);
  // Visible focus: the focused element has an outline.
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  log(outline === 'solid', `${prefix}: focused button shows a solid outline (${outline})`);
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // Run 1 (pointer, desktop 1280x720) + Run 2 (keyboard, same page after Replay).
  const desk = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const p1 = await desk.newPage();
  watch(p1, 'desktop');
  const ms = await pointerRun(p1, 'run1-desktop-pointer', { capture: true });
  console.log(`      run 1 wall time ${Math.round(ms / 1000)} s (scripted, no reading pauses)`);
  if (CAPTURE) {
    // Review section below the fold.
    await p1.getByRole('button', { name: 'Back to concept review', exact: true }).click();
    await wait(800);
    const reviewTop = await p1.evaluate(() => document.getElementById('review').getBoundingClientRect().top);
    log(reviewTop < 200 && (await step(p1)) === 'arrive', `review: "Back to concept review" resets and scrolls to review (${Math.round(reviewTop)})`);
    await p1.evaluate(() => window.scrollTo(0, 0));
    await p1.getByRole('button', { name: 'Forge a mission', exact: true }).focus();
  }
  // Replay path: finish again to summary quickly, then press Replay with keyboard.
  if (!CAPTURE) {
    await p1.getByRole('button', { name: 'Replay', exact: true }).click();
  }
  await keyboardRun(p1, 'run2-desktop-keyboard');
  await p1.keyboard.press('Enter'); // Replay
  await waitStep(p1, 'arrive');
  log(true, 'run2: Replay pressed with keyboard returns to opening');
  await desk.close();

  // Run 3: mobile-like 390x844 with touch.
  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const p3 = await mob.newPage();
  watch(p3, 'mobile');
  await pointerRun(p3, 'run3-mobile-390', { capture: true, mobile: true });
  await mob.close();

  // Run 4: reduced motion, desktop, pointer.
  const red = await browser.newContext({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  const p4 = await red.newPage();
  watch(p4, 'reduced');
  let flyers = 0;
  await p4.exposeFunction('__noteFlyer', () => (flyers += 1));
  await p4.addInitScript(() => {
    new MutationObserver((list) => {
      for (const m of list) for (const n of m.addedNodes) if (n.classList && (n.classList.contains('flyer') || n.classList.contains('beam'))) window.__noteFlyer();
    }).observe(document, { childList: true, subtree: true });
  });
  const rms = await pointerRun(p4, 'run4-reduced-motion');
  const anim = await p4.evaluate(() => getComputedStyle(document.querySelector('.btn')).transitionDuration);
  log(flyers === 0, `run4: reduced motion spawns no flying/beam elements (${flyers})`);
  log(anim === '0.001s', `run4: CSS transitions collapse under reduced motion (${anim})`);
  console.log(`      run 4 wall time ${Math.round(rms / 1000)} s`);
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
