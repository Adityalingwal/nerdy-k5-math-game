/**
 * Decimal Dock - entry point.
 *
 * Wires three parts together and nothing more:
 *   engine  - all magnitude truth and all progression (src/engine)
 *   dock    - the PixiJS number line (src/game)
 *   overlay - the DOM panels and text box (src/ui)
 *
 * The AI helper is asked for two things only: a label for what the learner
 * typed, and the wording of Robo's wrong answer. Both are checked or replaced
 * by the engine before they change anything.
 */

import './style.css';
import { AiClient } from './ai/client.ts';
import { buildTask, type ErroneousExample } from './ai/erroneous.ts';
import type { Label } from './ai/labels.ts';
import {
  type Dec,
  type DisplayConfig,
  format,
  formatAtPlaces,
  significantPlaces,
} from './engine/decimal.ts';
import { largerOf, type Item } from './engine/items.ts';
import { Session, type ProfileId } from './engine/state.ts';
import { DockView, type ZoomLevel } from './game/dock.ts';
import { Overlay } from './ui/overlay.ts';
import { loadSettings, saveModelToggle, type Settings } from './ui/settings.ts';

const settings: Settings = loadSettings();
let display: DisplayConfig = { separator: settings.separator };

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app');

const stageHost = document.createElement('div');
stageHost.className = 'stage';
app.append(stageHost);

/**
 * Keep the 16:9 board whole on smaller windows by scaling it down. The layout
 * itself never changes, so nothing shifts when a panel appears.
 */
function fitToWindow(): void {
  const scale = Math.min(
    1,
    window.innerWidth / 1280,
    window.innerHeight / 720,
  );
  app!.style.transform = `scale(${scale})`;
  app!.style.marginLeft = `${Math.max(0, (window.innerWidth - 1280 * scale) / 2)}px`;
}
window.addEventListener('resize', fitToWindow);
fitToWindow();

const dock = new DockView();
const ai = new AiClient(settings.modelEnabled);
let session = new Session();

/* ------------------------------- wording -------------------------------- */

function label(value: Dec, places?: number): string {
  return places === undefined
    ? format(value, display)
    : formatAtPlaces(value, places, display);
}

function contextWord(item: Item): string {
  if (item.context === 'money') return ` ${settings.currencyLabel}`;
  if (item.context === 'measurement') return ' m';
  return '';
}

function placePrompt(item: Item): string {
  return `Where does ${label(item.target)}${contextWord(item)} go?`;
}

function placeHint(item: Item): string {
  return `${label(item.anchor)}${contextWord(item)} is already on the dock. Drag the box, or use the arrow keys and press Enter.`;
}

const INFER_TEXT: Record<string, string[]> = {
  L: [
    'You put the long numbers too far along the dock.',
    'A longer decimal is not always a bigger number.',
  ],
  S: [
    'You put the long numbers too far back along the dock.',
    'A longer decimal is not always a smaller number.',
  ],
  A: ['You placed nearly all of them right.', 'Here come some tricky ones.'],
  U: [
    'Some boxes landed right and some landed wrong.',
    'Let us do one together first.',
  ],
};

/* ------------------------------ dock helpers ---------------------------- */

/**
 * Zoom as deep as the pair allows: to thousandths when both sit inside one
 * hundredth, otherwise to hundredths. When the partner falls outside the
 * window the dock shows it as an edge chip rather than pretending it is there.
 */
function zoomLevelFor(a: Dec, b: Dec): ZoomLevel {
  if (Math.floor(a.t / 10) === Math.floor(b.t / 10)) return 2;
  return 1;
}

function showItem(item: Item): void {
  dock.resetZoom(false);
  dock.clearComparison();
  dock.setGhosts([]);
  dock.showAnchor(item.anchor);
  dock.showTarget(item.target, item.anchor.t);
}

function lampsFor(): void {
  const { index, total } = session.queuePosition();
  dock.setLamps(total, index);
}

/* --------------------------------- flow --------------------------------- */

let awaitingCorrectionDrop = false;

const overlay = new Overlay(
  {
    onProfile(id: ProfileId) {
      session = new Session();
      ai.clearCache();
      session.start(id);
      overlay.hideAll();
      render();
    },
    onContinue() {
      handleContinue();
    },
    onWhySubmit(text: string) {
      void submitWhy(text);
    },
    onWhySkip() {
      void submitWhy('');
    },
    onCorrectionSubmit(text: string) {
      void submitCorrection(text);
    },
    onPlayAgain() {
      overlay.showProfilePicker();
      dock.clear();
      dock.setLamps(0, 0);
    },
    onSettingsChange(patch: Partial<Settings>) {
      Object.assign(settings, patch);
      if (patch.separator) {
        display = { separator: patch.separator };
        dock.setDisplay(display);
      }
      if (patch.modelEnabled !== undefined) {
        ai.enabled = patch.modelEnabled;
        ai.clearCache();
        saveModelToggle(patch.modelEnabled);
      }
      render();
    },
  },
  settings,
);
app.append(overlay.root);

/** Zoom and step controls, usable at any time during placement. */
const controls = document.createElement('div');
controls.className = 'controls';
const zoomIn = document.createElement('button');
zoomIn.className = 'btn small';
zoomIn.textContent = 'Zoom in';
const zoomOut = document.createElement('button');
zoomOut.className = 'btn small';
zoomOut.textContent = 'Zoom out';
controls.append(zoomIn, zoomOut);
overlay.root.append(controls);

zoomIn.addEventListener('click', () => {
  const focus = dock.targetPosition() ?? 500;
  const next = Math.min(2, dock.currentLevel() + 1) as ZoomLevel;
  dock.setZoom(next, focus);
});
zoomOut.addEventListener('click', () => {
  const focus = dock.targetPosition() ?? 500;
  const next = Math.max(0, dock.currentLevel() - 1) as ZoomLevel;
  dock.setZoom(next, focus);
});

dock.setCallbacks({
  onDrop(thousandths: number) {
    if (awaitingCorrectionDrop) {
      handleCorrectionDrop(thousandths);
      return;
    }
    if (!session.isPlacementPhase()) return;
    handlePlacementDrop(thousandths);
  },
});

window.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLTextAreaElement) return;
  if (event.target instanceof HTMLInputElement) return;
  if (dock.handleKey(event)) event.preventDefault();
});

function handlePlacementDrop(thousandths: number): void {
  const item = session.currentItem();
  if (!item) return;
  const result = session.drop(thousandths);
  if (result.correct) {
    overlay.showToast('That is the spot.', 'good');
    lampsFor();
    setTimeout(() => {
      overlay.hideToast();
      render();
    }, 700);
    return;
  }
  dock.playBounce();
  applyFeedback(item, result.feedbackLevel);
  if (result.advanced) {
    setTimeout(() => {
      overlay.hideToast();
      render();
    }, 2600);
  }
}

function applyFeedback(item: Item, level: number): void {
  const truthLabel = label(item.target);
  if (level >= 1) {
    dock.setGhosts([{ at: item.target.t, label: truthLabel }]);
    overlay.showToast(`Not quite. ${truthLabel} really goes here.`, 'try');
  }
  if (level >= 2) {
    dock.setZoom(zoomLevelFor(item.anchor, item.target), item.target.t);
    dock.setGhosts([
      { at: item.target.t, label: truthLabel },
      { at: item.anchor.t, label: label(item.anchor) },
    ]);
    overlay.showToast('Let us zoom in and look again.', 'try');
  }
  if (level >= 3) {
    const places = Math.max(
      significantPlaces(item.anchor),
      significantPlaces(item.target),
    );
    dock.setComparison(item.anchor, item.target, places);
    overlay.showToast(
      `Written the same way: ${label(item.anchor, places)} and ${label(item.target, places)}.`,
      'try',
    );
  }
}

/* ------------------------------ phase render ---------------------------- */

function render(): void {
  overlay.hideCard();
  overlay.hideWhy();
  controls.classList.toggle(
    'shown',
    session.phase === 'PLACE' || session.phase === 'TRANSFER' || awaitingCorrectionDrop,
  );

  switch (session.phase) {
    case 'PROFILE':
      overlay.showProfilePicker();
      return;

    case 'PLACE':
    case 'TRANSFER': {
      const item = session.currentItem();
      if (!item) return;
      showItem(item);
      lampsFor();
      overlay.showPrompt(placePrompt(item), placeHint(item));
      return;
    }

    case 'INFER': {
      const code = session.inference?.code ?? 'U';
      overlay.showPrompt('Let us look at what happened.');
      overlay.showCard(
        'Dock report',
        [
          ...(INFER_TEXT[code] ?? INFER_TEXT.U!),
          `Right on the first try: ${session.inference?.type1Correct ?? 0} of ${
            session.inference?.type1Total ?? 0
          } short-wins boxes and ${session.inference?.type2Correct ?? 0} of ${
            session.inference?.type2Total ?? 0
          } long-wins boxes.`,
        ],
        'Next',
      );
      return;
    }

    case 'ZOOM': {
      const diagnostic = session.diagnosticPlacement();
      const item = diagnostic?.item ?? session.scored[0]?.item;
      if (!item) return;
      runZoomReplay(item);
      return;
    }

    case 'WHY': {
      const diagnostic = session.diagnosticPlacement();
      const item = diagnostic?.item;
      const target = item ? label(item.target) : 'that box';
      overlay.showPrompt('Your turn to explain.');
      overlay.showWhy(`Why did you put ${target} there?`, 'why', true);
      return;
    }

    case 'WORKED': {
      runWorkedExample();
      return;
    }

    case 'ERRONEOUS': {
      void runErroneous();
      return;
    }

    case 'SUMMARY': {
      showSummary();
      return;
    }

    default:
      return;
  }
}

function runZoomReplay(item: Item): void {
  const truth = largerOf(item);
  dock.clearComparison();
  dock.showAnchor(item.anchor);
  dock.hideTarget();
  dock.setGhosts([
    { at: item.anchor.t, label: label(item.anchor) },
    { at: item.target.t, label: label(item.target) },
  ]);
  dock.setZoom(0, item.target.t, false);
  window.setTimeout(() => dock.setZoom(1, item.target.t), 500);
  window.setTimeout(
    () => dock.setZoom(zoomLevelFor(item.anchor, item.target), item.target.t),
    1400,
  );
  const places = Math.max(significantPlaces(item.anchor), significantPlaces(item.target));
  dock.setComparison(item.anchor, item.target, places);
  overlay.showPrompt('Zooming in on your box.');
  overlay.showCard(
    'Look closer',
    [
      `Written the same way they are ${label(item.anchor, places)} and ${label(
        item.target,
        places,
      )}.`,
      `So ${label(truth)} is the bigger one.`,
      'Zooming in does not change a number. It only shows more of the dock.',
    ],
    'I see',
    undefined,
    'low',
  );
}

function runWorkedExample(): void {
  const item = session.diagnosticPlacement()?.item ?? session.scored[0]?.item;
  if (!item) {
    handleContinue();
    return;
  }
  const places = Math.max(significantPlaces(item.anchor), significantPlaces(item.target));
  const truth = largerOf(item);
  dock.showAnchor(item.anchor);
  dock.hideTarget();
  dock.setGhosts([
    { at: item.anchor.t, label: label(item.anchor) },
    { at: item.target.t, label: label(item.target) },
  ]);
  dock.setZoom(1, item.target.t);
  dock.setComparison(item.anchor, item.target, places);
  overlay.showPrompt('One worked out together.');
  overlay.showCard(
    'How the dock does it',
    [
      `Write both boxes with the same number of digits: ${label(
        item.anchor,
        places,
      )} and ${label(item.target, places)}.`,
      'Now compare them digit by digit, starting right after the point.',
      `${label(truth)} sits further along the dock, so it is the bigger one.`,
    ],
    'Got it',
    undefined,
    'low',
  );
}

let currentExample: ErroneousExample | undefined;

async function runErroneous(): Promise<void> {
  const task = session.erroneousTask;
  if (!task) return;
  overlay.showPrompt('Robo sorted these.');
  overlay.showCard('Robo’s delivery log', ['Reading Robo’s note...'], 'Wait');

  const result = await ai.erroneousExample(task, session.whyText, settings.separator);
  session.setErroneousExample(result.example, result.source);
  currentExample = result.example;

  dock.resetZoom(false);
  dock.clearComparison();
  dock.setGhosts([]);
  dock.showAnchor(task.item.anchor);
  // Robo's package starts on the side Robo wrongly chose.
  const roboSide =
    task.wrongLarger.t === task.item.target.t
      ? task.item.anchor.t + 180
      : task.item.anchor.t - 180;
  dock.showTarget(task.item.target, Math.min(1000, Math.max(0, roboSide)), 'robo', false);
  dock.setTargetDraggable(false);
  dock.setLamps(0, 0);

  overlay.showCard(
    'Robo’s delivery log',
    ['Robo sorted these two. Find the mistake.'],
    'Fix it',
    overlay.roboPanel(result.example.peerClaim, result.example.peerReason, result.source),
    'low',
  );
}

function beginCorrectionDrag(): void {
  const task = session.erroneousTask;
  if (!task) return;
  awaitingCorrectionDrop = true;
  dock.setTargetDraggable(true);
  controls.classList.add('shown');
  overlay.hideCard();
  overlay.showPrompt(
    `Move ${label(task.item.target)} to the right spot.`,
    'Drag it, or use the arrow keys and press Enter.',
  );
}

function handleCorrectionDrop(thousandths: number): void {
  const task = session.erroneousTask;
  if (!task) return;
  awaitingCorrectionDrop = false;
  const correct = session.applyCorrectionDrop(thousandths);
  if (!correct) {
    dock.playBounce();
    dock.setGhosts([{ at: task.item.target.t, label: label(task.item.target) }]);
    overlay.showToast(
      `${label(task.item.target)} really goes here. Robo was wrong.`,
      'try',
    );
  } else {
    overlay.showToast('You found it.', 'good');
  }
  controls.classList.remove('shown');
  dock.setTargetDraggable(false);
  window.setTimeout(() => {
    overlay.hideToast();
    overlay.showPrompt('Tell Robo what went wrong.');
    overlay.showWhy('Say in one line why Robo is wrong.', 'correction', false);
  }, 1400);
}

async function submitWhy(text: string): Promise<void> {
  const item = session.diagnosticPlacement()?.item;
  overlay.hideWhy();
  overlay.showPrompt('Thinking...');
  const classification = await ai.classify({
    anchor: item ? label(item.anchor) : '',
    target: item ? label(item.target) : '',
    trueLarger: item ? label(largerOf(item)) : '',
    learnerTreatedTargetAsLarger:
      session.diagnosticPlacement()?.placement.treatedTargetAsLarger ?? false,
    step: 'why',
    text,
  });
  session.applyWhyLabel(
    classification.label as Label,
    text,
    classification.source === 'model' ? 'model' : classification.source,
  );
  // The erroneous example is fetched in the background the moment a rule is
  // known, so the learner never waits for the model.
  if (session.rule) {
    ai.prefetchErroneousExample(
      buildTask(session.rule, session.erroneousTaskFor(session.rule, 0).item),
      text,
      settings.separator,
    );
  }
  render();
}

async function submitCorrection(text: string): Promise<void> {
  const task = session.erroneousTask;
  overlay.hideWhy();
  overlay.showPrompt('Thinking...');
  const classification = await ai.classify({
    anchor: task ? label(task.item.anchor) : '',
    target: task ? label(task.item.target) : '',
    trueLarger: task ? label(task.trueLarger) : '',
    learnerTreatedTargetAsLarger: false,
    step: 'correction',
    text,
  });
  session.applyCorrectionLabel(
    classification.label as Label,
    classification.source === 'model' ? 'model' : classification.source,
  );
  render();
}

function handleContinue(): void {
  switch (session.phase) {
    case 'INFER':
      session.leaveInfer();
      if (session.rule) {
        // Pre-request Robo's example as soon as a rule is known.
        ai.prefetchErroneousExample(
          session.erroneousTaskFor(session.rule, 0),
          '',
          settings.separator,
        );
      }
      render();
      return;
    case 'ZOOM':
      session.leaveZoom();
      render();
      return;
    case 'WORKED':
      session.leaveWorked();
      render();
      return;
    case 'ERRONEOUS':
      if (currentExample) beginCorrectionDrag();
      return;
    default:
      render();
  }
}

function showSummary(): void {
  const mastery = session.mastery();
  const code = session.inference?.code ?? 'U';
  const lines: string[] = [];
  lines.push(
    `You placed ${session.scored.filter((s) => s.placement.attempt === 1).length} boxes on the dock.`,
  );
  if (code === 'L') {
    lines.push('At the start, long decimals went too far along the dock.');
  } else if (code === 'S') {
    lines.push('At the start, long decimals went too far back along the dock.');
  } else if (code === 'A') {
    lines.push('You started off placing them right.');
  } else {
    lines.push('Your first boxes were a mix of right and wrong.');
  }
  if (session.erroneousShown > 0) {
    lines.push(`You found ${session.erroneousShown} of Robo's mistakes.`);
  }
  lines.push(
    `On the tricky boxes at the end you got ${mastery.correct} of ${mastery.total} right on the first try.`,
  );
  lines.push(
    mastery.mastered
      ? 'No length rule left. Nice sorting.'
      : 'Keep going: zoom in whenever two boxes look close.',
  );
  let modelLine: string;
  if (!settings.modelEnabled) {
    modelLine =
      'AI helper: off. This run used the built-in word list and the built-in Robo notes only.';
  } else if (ai.modelAnswersUsed === 0) {
    modelLine =
      'AI helper: switched on, but no answer came back, so the built-in word list and Robo notes ran instead. The dock decided every right and wrong answer either way.';
  } else {
    modelLine = `AI helper: on. It read what you typed and Robo's note ${
      session.erroneousSource === 'model'
        ? 'was written by it'
        : 'came from the built-in list because the check rejected its wording'
    }. The dock decided every right and wrong answer.`;
  }
  dock.setLamps(0, 0);
  dock.clear();
  overlay.showPrompt('All done.');
  overlay.showSummary(lines, modelLine);
}

/* ------------------------------ dev harness ------------------------------ */

/**
 * Development-only hook used by `scripts/capture-screens.ts` to walk the loop
 * for evidence screenshots. It is stripped from production builds and it never
 * decides anything: it reads the phase and forwards a drop to the same engine
 * call the pointer and keyboard paths use.
 */
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__decimalDock = {
    phase: () => session.phase,
    item: () => {
      const item = session.currentItem();
      if (!item) return undefined;
      return {
        id: item.id,
        type: item.type,
        anchorT: item.anchor.t,
        targetT: item.target.t,
        anchorPlaces: item.anchor.places,
        targetPlaces: item.target.places,
      };
    },
    awaitingCorrection: () => awaitingCorrectionDrop,
    correctionTruth: () => session.erroneousTask?.item.target.t,
    dropAt: (thousandths: number) => {
      if (awaitingCorrectionDrop) handleCorrectionDrop(thousandths);
      else handlePlacementDrop(thousandths);
    },
    inference: () => session.inference?.code,
    erroneousSource: () => session.erroneousSource,
  };
}

/* -------------------------------- start --------------------------------- */

await dock.init(stageHost);
dock.setDisplay(display);
overlay.showProfilePicker();
