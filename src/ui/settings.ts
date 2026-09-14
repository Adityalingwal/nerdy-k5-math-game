/**
 * Settings for the gear panel.
 *
 * Only the model on/off toggle is persisted, and only in this browser's
 * localStorage. Nothing about the learner is stored anywhere, ever.
 */

import type { Separator } from '../engine/decimal.ts';

const TOGGLE_KEY = 'decimal-dock.model-enabled';

export interface Settings {
  separator: Separator;
  currencyLabel: string;
  modelEnabled: boolean;
}

export function loadSettings(): Settings {
  let modelEnabled = true;
  try {
    const stored = localStorage.getItem(TOGGLE_KEY);
    if (stored !== null) modelEnabled = stored === 'true';
  } catch {
    // Private mode or blocked storage: fall back to the default.
  }
  return { separator: '.', currencyLabel: 'coins', modelEnabled };
}

export function saveModelToggle(enabled: boolean): void {
  try {
    localStorage.setItem(TOGGLE_KEY, String(enabled));
  } catch {
    // Nothing to do; the toggle simply will not be remembered.
  }
}
