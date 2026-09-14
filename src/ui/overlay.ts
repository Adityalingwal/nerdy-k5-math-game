/**
 * DOM overlay.
 *
 * Real text input, buttons and screen-reader text are far easier in DOM than
 * on the canvas, so the overlay sits above the Pixi stage in the same fixed
 * 1280x720 box and scales with it. Every panel is absolutely positioned, so
 * showing the explanation box never shifts the game layout.
 *
 * All learner-facing wording is short, plain English for ages 9 to 11.
 */

import { PROFILES, type ProfileId } from '../engine/state.ts';
import type { Settings } from './settings.ts';
import type { Separator } from '../engine/decimal.ts';

export interface OverlayHandlers {
  onProfile(id: ProfileId): void;
  onContinue(): void;
  onWhySubmit(text: string): void;
  onWhySkip(): void;
  onCorrectionSubmit(text: string): void;
  onPlayAgain(): void;
  onSettingsChange(patch: Partial<Settings>): void;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export class Overlay {
  readonly root = el('div', 'overlay');

  private readonly banner = el('div', 'banner');
  private readonly prompt = el('p', 'prompt');
  private readonly hint = el('p', 'hint');
  private readonly toast = el('div', 'toast');

  private readonly card = el('section', 'card');
  private readonly cardTitle = el('h2', 'card-title');
  private readonly cardBody = el('div', 'card-body');
  private readonly cardActions = el('div', 'card-actions');

  private readonly profilePanel = el('section', 'panel profile-panel');
  private readonly whyPanel = el('section', 'panel why-panel');
  private readonly whyQuestion = el('p', 'why-question');
  private readonly whyInput = el('textarea', 'why-input');
  private readonly whySend = el('button', 'btn primary', 'Send');
  private readonly whySkip = el('button', 'btn ghost', 'Skip');

  private readonly gearButton = el('button', 'gear', 'Settings');
  private readonly gearPanel = el('section', 'panel gear-panel');

  private handlers: OverlayHandlers;
  private whyMode: 'why' | 'correction' = 'why';

  constructor(handlers: OverlayHandlers, settings: Settings) {
    this.handlers = handlers;
    this.buildBanner();
    this.buildCard();
    this.buildProfilePanel();
    this.buildWhyPanel();
    this.buildGear(settings);
    this.root.append(
      this.banner,
      this.toast,
      this.card,
      this.profilePanel,
      this.whyPanel,
      this.gearButton,
      this.gearPanel,
    );
    this.hideAll();
  }

  /* ------------------------------- build ------------------------------- */

  private buildBanner(): void {
    this.banner.append(this.prompt, this.hint);
    this.prompt.setAttribute('aria-live', 'polite');
  }

  private buildCard(): void {
    this.card.append(this.cardTitle, this.cardBody, this.cardActions);
    this.card.setAttribute('role', 'dialog');
  }

  private buildProfilePanel(): void {
    this.profilePanel.append(
      el('h1', 'title', 'Decimal Dock'),
      el(
        'p',
        'lead',
        'Sort the packages onto the dock. Zoom in when you are not sure.',
      ),
      el('p', 'note', 'Pick who is playing. These are pretend players for a demo.'),
    );
    const list = el('div', 'profile-list');
    for (const profile of PROFILES) {
      const button = el('button', 'profile-button');
      button.append(
        el('span', 'profile-name', profile.name),
        el('span', 'profile-blurb', profile.blurb),
      );
      button.addEventListener('click', () => this.handlers.onProfile(profile.id));
      button.dataset.profile = profile.id;
      list.append(button);
    }
    this.profilePanel.append(list);
    this.profilePanel.append(
      el(
        'p',
        'small-print',
        'Nothing you type is saved. There are no accounts, no timers and no points.',
      ),
    );
  }

  private buildWhyPanel(): void {
    this.whyInput.setAttribute('rows', '2');
    this.whyInput.setAttribute('maxlength', '300');
    this.whyInput.setAttribute('aria-label', 'Type your reason');
    this.whyInput.placeholder = 'Type here (you can skip this)';
    const actions = el('div', 'why-actions');
    actions.append(this.whySend, this.whySkip);
    this.whyPanel.append(this.whyQuestion, this.whyInput, actions);
    this.whySend.addEventListener('click', () => this.submitWhy());
    this.whySkip.addEventListener('click', () => this.handlers.onWhySkip());
    this.whyInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.submitWhy();
      }
      event.stopPropagation();
    });
  }

  private submitWhy(): void {
    const text = this.whyInput.value.trim();
    if (this.whyMode === 'why') this.handlers.onWhySubmit(text);
    else this.handlers.onCorrectionSubmit(text);
  }

  private buildGear(settings: Settings): void {
    this.gearButton.setAttribute('aria-label', 'Open settings');
    this.gearButton.addEventListener('click', () => {
      this.gearPanel.classList.toggle('shown');
    });

    const separatorRow = el('label', 'gear-row');
    separatorRow.append(el('span', undefined, 'Decimal separator'));
    const separatorSelect = el('select');
    for (const option of ['.', ','] as Separator[]) {
      const opt = el('option', undefined, option === '.' ? 'point  0.45' : 'comma  0,45');
      opt.value = option;
      separatorSelect.append(opt);
    }
    separatorSelect.value = settings.separator;
    separatorSelect.addEventListener('change', () => {
      this.handlers.onSettingsChange({
        separator: separatorSelect.value as Separator,
      });
    });
    separatorRow.append(separatorSelect);

    const currencyRow = el('label', 'gear-row');
    currencyRow.append(el('span', undefined, 'Money word'));
    const currencyInput = el('input');
    currencyInput.type = 'text';
    currencyInput.maxLength = 12;
    currencyInput.value = settings.currencyLabel;
    currencyInput.addEventListener('change', () => {
      this.handlers.onSettingsChange({ currencyLabel: currencyInput.value.trim() });
    });
    currencyRow.append(currencyInput);

    const modelRow = el('label', 'gear-row');
    modelRow.append(el('span', undefined, 'Use the AI helper'));
    const modelToggle = el('input');
    modelToggle.type = 'checkbox';
    modelToggle.checked = settings.modelEnabled;
    modelToggle.id = 'model-toggle';
    modelToggle.addEventListener('change', () => {
      this.handlers.onSettingsChange({ modelEnabled: modelToggle.checked });
    });
    modelRow.append(modelToggle);

    const languageRow = el('label', 'gear-row');
    languageRow.append(el('span', undefined, 'Language'));
    const languageSelect = el('select');
    const englishOption = el('option', undefined, 'English');
    englishOption.value = 'en';
    languageSelect.append(englishOption);
    languageSelect.disabled = true;
    languageRow.append(languageSelect);

    this.gearPanel.append(
      el('h3', undefined, 'Settings'),
      separatorRow,
      currencyRow,
      modelRow,
      languageRow,
      el(
        'p',
        'small-print',
        'The AI helper only reads what you type and writes Robo’s wrong answer. The game decides which number is bigger.',
      ),
    );
  }

  /* ------------------------------ showing ------------------------------ */

  hideAll(): void {
    this.card.classList.remove('shown');
    this.profilePanel.classList.remove('shown');
    this.whyPanel.classList.remove('shown');
    this.banner.classList.remove('shown');
    this.toast.classList.remove('shown');
  }

  showProfilePicker(): void {
    this.hideAll();
    this.profilePanel.classList.add('shown');
  }

  showPrompt(prompt: string, hint = ''): void {
    this.prompt.textContent = prompt;
    this.hint.textContent = hint;
    this.banner.classList.add('shown');
  }

  showToast(message: string, tone: 'good' | 'try' | 'info' = 'info'): void {
    this.toast.textContent = message;
    this.toast.dataset.tone = tone;
    this.toast.classList.add('shown');
  }

  hideToast(): void {
    this.toast.classList.remove('shown');
  }

  showCard(
    title: string,
    lines: string[],
    actionLabel: string,
    extra?: HTMLElement,
    position: 'centre' | 'low' = 'centre',
  ): void {
    this.card.classList.toggle('low', position === 'low');
    this.cardTitle.textContent = title;
    this.cardBody.replaceChildren(...lines.map((line) => el('p', undefined, line)));
    if (extra) this.cardBody.append(extra);
    const button = el('button', 'btn primary', actionLabel);
    button.addEventListener('click', () => this.handlers.onContinue());
    this.cardActions.replaceChildren(button);
    this.card.classList.add('shown');
    button.focus();
  }

  showSummary(lines: string[], modelLine: string): void {
    this.card.classList.remove('low');
    this.cardTitle.textContent = 'What you did';
    this.cardBody.replaceChildren(
      ...lines.map((line) => el('p', undefined, line)),
      el('p', 'small-print', modelLine),
    );
    const again = el('button', 'btn primary', 'Play again');
    again.addEventListener('click', () => this.handlers.onPlayAgain());
    this.cardActions.replaceChildren(again);
    this.card.classList.add('shown');
    again.focus();
  }

  hideCard(): void {
    this.card.classList.remove('shown');
  }

  showWhy(question: string, mode: 'why' | 'correction', skippable: boolean): void {
    this.whyMode = mode;
    this.whyQuestion.textContent = question;
    this.whyInput.value = '';
    this.whyInput.placeholder = skippable
      ? 'Type here (you can skip this)'
      : 'Type one line';
    this.whySkip.style.display = skippable ? '' : 'none';
    this.whyPanel.classList.add('shown');
    this.whyInput.focus();
  }

  hideWhy(): void {
    this.whyPanel.classList.remove('shown');
  }

  /** Robo's wrong delivery note, shown above the dock. */
  roboPanel(claim: string, reason: string, source: 'model' | 'bank'): HTMLElement {
    const box = el('div', 'robo');
    box.append(el('span', 'robo-face', 'Robo'));
    box.append(el('p', 'robo-claim', claim));
    box.append(el('p', 'robo-reason', reason));
    box.append(
      el(
        'span',
        'robo-source',
        source === 'model' ? 'written by the AI helper' : 'from the built-in list',
      ),
    );
    return box;
  }
}
