/**
 * Evidence capture: walks the whole loop twice (as an L-rule player and as an
 * S-rule player) against a running dev server and saves a screenshot of every
 * phase to docs/evidence/screenshots/.
 *
 * This is a development tool. It uses the same engine calls the pointer and
 * keyboard paths use; it never decides anything itself. The first placement of
 * each run is done with the real keyboard path (arrow key, then Enter) so the
 * accessibility alternative is exercised too.
 *
 *   npm run dev            # in one terminal
 *   npm run capture        # in another
 */

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Page } from 'playwright-core';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT = join(ROOT, 'docs', 'evidence', 'screenshots');
const URL = process.env.CAPTURE_URL ?? 'http://localhost:5173/';

type Persona = 'maya' | 'sam' | 'guesser';

interface DockItem {
  id: string;
  type: 'T1' | 'T2' | 'TRANSFER';
  anchorT: number;
  targetT: number;
  anchorPlaces: number;
  targetPlaces: number;
}

declare global {
  interface Window {
    __decimalDock: {
      phase(): string;
      item(): DockItem | undefined;
      awaitingCorrection(): boolean;
      correctionTruth(): number | undefined;
      dropAt(thousandths: number): void;
      inference(): string | undefined;
      erroneousSource(): string;
    };
  }
}

const consoleErrors: string[] = [];

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function phase(page: Page): Promise<string> {
  return page.evaluate(() => window.__decimalDock.phase());
}

async function item(page: Page): Promise<DockItem | undefined> {
  return page.evaluate(() => window.__decimalDock.item());
}

async function shot(page: Page, name: string): Promise<string> {
  const file = join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  console.log(`  saved ${file}`);
  return file;
}

/**
 * Which side does this persona put the dragged package on?
 * L: "the longer decimal is bigger". S: "the shorter decimal is bigger".
 * In every classification item the dragged package is the longer one.
 */
let scatter = 0;
function personaSaysTargetIsLarger(persona: Persona, it: DockItem): boolean {
  const targetIsLonger = it.targetPlaces > it.anchorPlaces;
  if (persona === 'guesser') return scatter++ % 3 === 0;
  return persona === 'maya' ? targetIsLonger : !targetIsLonger;
}

function correctSaysTargetIsLarger(it: DockItem): boolean {
  return it.targetT > it.anchorT;
}

async function dropSide(page: Page, it: DockItem, targetLarger: boolean): Promise<void> {
  const equalPair = it.targetT === it.anchorT;
  const offset = equalPair ? 10 : targetLarger ? 60 : -60;
  const placed = Math.min(1000, Math.max(0, it.anchorT + offset));
  await page.evaluate((t) => window.__decimalDock.dropAt(t), placed);
}

/** The real keyboard path: one arrow step, then Enter. */
async function dropWithKeyboard(page: Page, targetLarger: boolean): Promise<void> {
  await page.keyboard.press(targetLarger ? 'ArrowRight' : 'ArrowLeft');
  await wait(150);
  await page.keyboard.press('Enter');
}

async function playPlacementRound(
  page: Page,
  persona: Persona,
  correct: boolean,
  useKeyboardFirst: boolean,
  shots: (name: string) => Promise<void>,
  prefix: string,
): Promise<void> {
  let guard = 0;
  let first = true;
  while (guard < 60) {
    guard += 1;
    const current = await phase(page);
    if (current !== 'PLACE' && current !== 'TRANSFER') return;
    const it = await item(page);
    if (!it) return;
    const answer = correct
      ? correctSaysTargetIsLarger(it)
      : personaSaysTargetIsLarger(persona, it);
    if (first) {
      await shots(`${prefix}-${current.toLowerCase()}`);
      if (useKeyboardFirst) {
        await dropWithKeyboard(page, answer);
        await wait(1200);
        first = false;
        continue;
      }
    }
    await dropSide(page, it, answer);
    await wait(first ? 900 : 500);
    if (first) {
      await shots(`${prefix}-feedback`);
      first = false;
    }
    // Wrong answers keep the same item for up to three tries.
    let retries = 0;
    while (retries < 4) {
      const stillSame = await page.evaluate(
        (id) => window.__decimalDock.item()?.id === id,
        it.id,
      );
      if (!stillSame) break;
      retries += 1;
      await dropSide(page, it, answer);
      await wait(600);
    }
    await wait(2600);
  }
}

async function runLoop(page: Page, persona: Persona): Promise<void> {
  console.log(`\n=== run as ${persona} ===`);
  const prefix = persona;
  const shots = async (name: string) => {
    await shot(page, name);
  };

  await page.goto(URL, { waitUntil: 'networkidle' });
  await wait(800);
  await shot(page, `${prefix}-01-profile`);

  await page.click(`button[data-profile="${persona}"]`);
  await wait(700);

  await playPlacementRound(page, persona, false, true, shots, `${prefix}-02`);

  // INFER
  await wait(500);
  if ((await phase(page)) === 'INFER') {
    await shot(page, `${prefix}-03-infer`);
    console.log(`  inferred code: ${await page.evaluate(() => window.__decimalDock.inference())}`);
    await page.click('.card-actions .btn');
    await wait(1800);
  }

  // An unclear round shows a correct worked example, then a shorter round.
  if ((await phase(page)) === 'WORKED') {
    await shot(page, `${prefix}-03b-worked`);
    await page.click('.card-actions .btn');
    await wait(1200);
    await playPlacementRound(page, persona, false, false, shots, `${prefix}-03c`);
    await wait(600);
    if ((await phase(page)) === 'INFER') {
      await page.click('.card-actions .btn');
      await wait(1800);
    }
  }

  // ZOOM
  if ((await phase(page)) === 'ZOOM') {
    await shot(page, `${prefix}-04-zoom`);
    await page.click('.card-actions .btn');
    await wait(600);
  }

  // WHY
  if ((await phase(page)) === 'WHY') {
    await shot(page, `${prefix}-05-why`);
    const answer =
      persona === 'maya'
        ? '0.45 is bigger because 45 is bigger than 8'
        : persona === 'sam'
          ? 'more digits after the point means tiny bits so it is smaller'
          : 'idk I just picked one';
    await page.fill('.why-input', answer);
    await page.click('.why-panel .btn.primary');
    await wait(1600);
  }

  // WORKED (only on the GUESS/UNCLEAR branch)
  if ((await phase(page)) === 'WORKED') {
    await shot(page, `${prefix}-06-worked`);
    await page.click('.card-actions .btn');
    await wait(1200);
  }

  // ERRONEOUS
  if ((await phase(page)) === 'ERRONEOUS') {
    await wait(900);
    await shot(page, `${prefix}-07-erroneous`);
    console.log(
      `  robo note source: ${await page.evaluate(() => window.__decimalDock.erroneousSource())}`,
    );
    await page.click('.card-actions .btn');
    await wait(600);
    await shot(page, `${prefix}-08-erroneous-fix`);
    const truth = await page.evaluate(() => window.__decimalDock.correctionTruth());
    if (typeof truth === 'number') {
      await page.evaluate((t) => window.__decimalDock.dropAt(t), truth);
    }
    await wait(1800);
    await shot(page, `${prefix}-09-correction`);
    await page.fill('.why-input', '8 tenths is bigger than 75 hundredths, I saw it when we zoomed in');
    await page.click('.why-panel .btn.primary');
    await wait(1600);
  }

  // TRANSFER
  if ((await phase(page)) === 'TRANSFER') {
    await playPlacementRound(page, persona, true, false, shots, `${prefix}-10`);
  }

  await wait(1200);
  if ((await phase(page)) === 'SUMMARY') {
    await shot(page, `${prefix}-11-summary`);
  } else {
    console.log(`  WARNING: ended in phase ${await phase(page)}, not SUMMARY`);
  }
}

async function main(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(String(error)));

  try {
    await runLoop(page, 'maya');
    await runLoop(page, 'sam');
    await runLoop(page, 'guesser');
  } finally {
    console.log(
      consoleErrors.length === 0
        ? '\nNo console errors.'
        : `\nConsole errors (${consoleErrors.length}):\n${consoleErrors.join('\n')}`,
    );
    await browser.close();
  }
}

await main();
