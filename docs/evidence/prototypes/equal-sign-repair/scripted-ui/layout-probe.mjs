/**
 * Equalizer Lab (D-013) — layout probe.
 *
 * Development tool only. Checks, at every listed viewport and at the WORST
 * CASE states of every scripted path:
 *
 *   1. no horizontal scrolling (scrollWidth <= innerWidth);
 *   2. no pairwise overlap between the equation, bridge, both rails, the bot,
 *      the explanation drawer, the tool tray, the controls, the status line
 *      and the top-bar chips (ancestor/descendant pairs are skipped);
 *   3. every unit cell stays inside its own rail;
 *   4. every visible control is at least 44 x 44 CSS pixels.
 *
 * Uses the repository's existing dev-only playwright-core (E-030) with the
 * installed Google Chrome. Downloads nothing.
 */

import { chromium } from '/Users/mac/Desktop/nerdy-k5-math-game/node_modules/playwright-core/index.mjs';

const URL =
  process.env.ESR_URL || 'http://localhost:5173/prototypes/equal-sign-repair/';
const OUT =
  '/Users/mac/Desktop/nerdy-k5-math-game/docs/evidence/prototypes/equal-sign-repair/scripted-ui';
const SHOT = process.argv.includes('--shot');

const VIEWPORTS = [
  [320, 568],
  [360, 640],
  [390, 720],
  [390, 844],
  [1024, 700],
  [1280, 720],
];

const PATHS = ['OPERATIONAL_EQUAL', 'ARITHMETIC_SLIP', 'RELATIONAL_VALID', 'UNCLEAR'];

let checks = 0;
const problems = [];

function record(label, bad) {
  checks += 1;
  if (bad.length) {
    problems.push(`${label}: ${bad.join('; ')}`);
    console.log(`  FAIL ${label}: ${bad.join('; ')}`);
  }
}

const PROBE_IDS = [
  'objective', 'banner', 'pathsToggle', 'pathsPanel',
  'equation', 'bridge', 'rail-left', 'rail-right',
  'bot', 'explanation', 'tools', 'controls', 'status',
];

async function probe(page, label) {
  const result = await page.evaluate((ids) => {
    const OVERLAP_TOLERANCE = 1; // sub-pixel rounding
    const nodes = ids
      .map((id) => ({ id, el: document.getElementById(id) }))
      .filter((n) => n.el)
      .map((n) => ({ id: n.id, el: n.el, r: n.el.getBoundingClientRect() }))
      .filter((n) => n.r.width > 0 && n.r.height > 0);

    const overlaps = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const dx = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
        const dy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (dx > OVERLAP_TOLERANCE && dy > OVERLAP_TOLERANCE) {
          overlaps.push(
            `${a.id} x ${b.id} (${Math.round(dx)}x${Math.round(dy)}px)`,
          );
        }
      }
    }

    const strays = [];
    for (const railId of ['rail-left', 'rail-right']) {
      const rail = document.getElementById(railId);
      if (!rail) continue;
      const rr = rail.getBoundingClientRect();
      rail.querySelectorAll('.cell').forEach((c, i) => {
        const cr = c.getBoundingClientRect();
        if (
          cr.left < rr.left - 1 || cr.right > rr.right + 1 ||
          cr.top < rr.top - 1 || cr.bottom > rr.bottom + 1
        ) {
          strays.push(`${railId} cell ${i} escapes its rail`);
        }
      });
    }

    const small = [];
    document.querySelectorAll('button').forEach((b) => {
      const r = b.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return; // hidden
      if (r.width < 44 || r.height < 44) {
        small.push(
          `${b.id || b.className} ${Math.round(r.width)}x${Math.round(r.height)}`,
        );
      }
    });

    return {
      overlaps,
      strays,
      small,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      cellCount: document.querySelectorAll('.cell').length,
    };
  }, PROBE_IDS);

  const bad = [];
  if (result.overlaps.length) bad.push('OVERLAP ' + result.overlaps.join(' | '));
  if (result.strays.length) bad.push('STRAY ' + result.strays.join(' | '));
  if (result.small.length) bad.push('SMALL CONTROL ' + result.small.join(' | '));
  if (result.scrollWidth > result.innerWidth) {
    bad.push(`H-SCROLL ${result.scrollWidth} > ${result.innerWidth}`);
  }
  record(label, bad);
  if (!bad.length) console.log(`  ok   ${label} (cells: ${result.cellCount})`);
  return result;
}

const idle = (p) =>
  p.waitForFunction(() => !window.__equalizerLab.busy(), null, { timeout: 15000 });
const read = (p) => p.evaluate(() => {
  const h = window.__equalizerLab;
  return { step: h.step(), missing: h.missingValue(), hint: h.hintLevel() };
});
async function click(p, sel) {
  await p.click(sel);
  await idle(p);
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });

console.log('== Equalizer Lab layout probe ==');
console.log('url:', URL);
console.log('started:', new Date().toISOString());

for (const [w, h] of VIEWPORTS) {
  for (const pathId of PATHS) {
    console.log(`\n== ${w}x${h} — ${pathId} ==`);
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      isMobile: w < 768,
      hasTouch: w < 768,
    });
    const page = await ctx.newPage();
    await page.goto(URL);
    await idle(page);

    const tag = `probe-${w}x${h}-${pathId}`;
    const at = async (name) => {
      await probe(page, `${w}x${h} ${pathId} ${name}`);
      if (SHOT) await page.screenshot({ path: `${OUT}/${tag}-${name}.png` });
    };

    // Test-paths drawer open — the widest transient panel.
    await click(page, '#pathsToggle');
    await at('paths-drawer-open');
    await click(page, '#path-' + pathId);
    await click(page, '#pathsToggle');

    await at('inspect'); // Path A here carries the worst case: 29 unit cells
    await click(page, '#primaryBtn');
    await at('consequence');
    await click(page, '#primaryBtn');
    await at('interpret');
    await click(page, '#primaryBtn');

    if ((await read(page)).step === 'clarify') {
      await at('clarify');
      await click(page, '#clarify-MISSING_GROUP');
    }

    if ((await read(page)).step === 'repair') {
      await at('repair-start');
      // Drive to hint level 3: totals + unit matching + full tool tray.
      await click(page, '#submitBtn');
      await click(page, '#submitBtn');
      await click(page, '#submitBtn');
      await at('repair-hint3');
      let guard = 0;
      while ((await read(page)).missing > 4 && guard < 30) {
        await click(page, '#removeCell');
        guard += 1;
      }
      await click(page, '#submitBtn');
      await at('settled');
      await click(page, '#primaryBtn');
    }

    await at('transfer');
    await click(page, '#submitBtn');
    await at('transfer-hint1');
    let guard2 = 0;
    while ((await read(page)).missing < 4 && guard2 < 20) {
      await click(page, '#podPlus');
      guard2 += 1;
    }
    await click(page, '#submitBtn');
    await at('summary');

    await ctx.close();
  }
}

await browser.close();

console.log('\n== result ==');
console.log('states probed:', checks);
console.log('states with a problem:', problems.length);
for (const p of problems) console.log('  -', p);
console.log('finished:', new Date().toISOString());
process.exit(problems.length === 0 ? 0 : 1);
