// Mission Forge layout probe (dev tool, not runtime code). Walks both story
// paths at a list of viewports and checks that nothing in the bay (#pile,
// #groups, #chips) paints over the dock, and that there is no horizontal
// scroll. Reproduces and guards the narrow overlap seen in the 2026-09-12
// live review. Run with the dev server up; add --shot to save screenshots.
import { chromium } from '/Users/mac/Desktop/nerdy-k5-math-game/node_modules/playwright-core/index.mjs';

const URL = 'http://localhost:5173/prototypes/mission-forge/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const shot = process.argv.includes('--shot');
const OUT = '/Users/mac/Desktop/nerdy-k5-math-game/docs/evidence/prototypes/mission-forge/revision';
async function run(example, w, h, mobile) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, isMobile: mobile, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(URL);
  const btn=(n)=>p.getByRole('button',{name:n,exact:true});
  const waitStep=(s)=>p.waitForFunction((x)=>window.__missionForge.step()===x&&!window.__missionForge.busy(),s,{timeout:20000});
  const probe = async (label) => {
    const r = await p.evaluate(() => {
      const rect = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom) }; };
      return { pile: rect('#pile'), groups: rect('#groups'), chips: rect('#chips'), dock: rect('#dock'), sw: document.documentElement.scrollWidth, iw: window.innerWidth };
    });
    const bad = [];
    for (const k of ['pile','groups','chips']) if (r[k] && r[k].b > r.dock.t + 1) bad.push(`${k} ${r[k].b} > dock ${r.dock.t}`);
    if (r.sw > r.iw) bad.push(`h-scroll ${r.sw}>${r.iw}`);
    console.log(`  ${w}x${h} ${label}: ${bad.length ? 'OVERLAP ' + bad.join('; ') : 'ok'}`);
    if (shot) await p.screenshot({ path: `${OUT}/layout-${example.replace(/\W/g, '')}-${w}x${h}-${label}.png` });
  };
  await btn('Forge a mission').click(); await waitStep('forge');
  await btn(example).click(); await btn('Build my world').click(); await waitStep('verdict');
  await probe('robo-world');
  await btn('No, debug it').click(); await waitStep('identify');
  const correct = await p.evaluate(()=>window.__missionForge.roles().divisor);
  await p.locator(`.options .btn[data-value="${correct}"]`).click(); await waitStep('repair');
  await probe('repair-start');
  const n = await p.evaluate(()=>window.__missionForge.roles().divisor==='groupSize'?3:4);
  for(let i=0;i<n;i++){await btn('+ Load a crystal').click(); await p.waitForFunction(()=>!window.__missionForge.busy());}
  await p.locator('.dock .btn.primary').click(); await waitStep('repaired');
  await probe('repaired');
  await btn('Launch mission').click(); await waitStep('teach');
  const roles = await p.evaluate(()=>window.__missionForge.roles());
  await p.locator(`input[name="slot-divisor"][value="${roles.divisor}"]`).check();
  await p.locator(`input[name="slot-quotient"][value="${roles.quotient}"]`).check();
  await btn('Teach Robo').click(); await waitStep('taught');
  await btn('Next mission →').click(); await waitStep('transfer');
  await probe('transfer-start');
  const t = await p.evaluate(()=>window.__missionForge.roles().divisor==='groupSize'?5:4);
  for(let i=0;i<t;i++){await btn('+ Load a battery').click(); await p.waitForFunction(()=>!window.__missionForge.busy());}
  await p.locator('.dock .btn.primary').click(); await waitStep('transfer-pass');
  await probe('transfer-pass');
  await ctx.close();
}
const VIEWPORTS = [
  [320, 568, true],
  [360, 640, true],
  [390, 720, true],
  [390, 780, true],
  [390, 781, true],
  [390, 800, true],
  [390, 844, true],
  [1024, 700, false],
  [1280, 640, false],
  [1280, 720, false],
];
for (const [w, h, mobile] of VIEWPORTS) {
  for (const ex of ['3 in each ship', '3 ships share']) {
    console.log(`== ${w}x${h} — ${ex} ==`);
    await run(ex, w, h, mobile);
  }
}
await b.close();
