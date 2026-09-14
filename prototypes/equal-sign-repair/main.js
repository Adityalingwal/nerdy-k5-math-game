/* ==========================================================================
   Equalizer Lab — scripted Equal-Sign Repair concept slice (D-013)

   Isolated, deterministic, adult-operated. There is no model, no API, no
   network request, no storage and no dependency in this file. Every number,
   verdict and progression step is computed by the small local engine below.
   The four "interpretation" paths are adult-authored fixed scripts: the
   prototype never analyses free-form language.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- engine */

  /**
   * The only two equations authorised by D-013. `?` marks the single blank.
   * The engine owns totals, the correct missing value and equality; nothing
   * is ever inferred from prose.
   */
  const EQUATIONS = {
    repair: { text: '6 + 5 = 7 + ?', leftTerms: [6, 5], rightTerms: [7] },
    transfer: { text: '12 = 8 + ?', leftTerms: [12], rightTerms: [8] },
  };

  const MIN_MISSING = 0;
  /** Clamp so the rails stay readable at 390 px. Documented in README. */
  const MAX_MISSING = 12;

  const sum = (list) => list.reduce((a, b) => a + b, 0);

  function leftTotalOf(eq) {
    return sum(eq.leftTerms);
  }
  function rightTotalOf(eq, missing) {
    return sum(eq.rightTerms) + missing;
  }
  function correctMissingOf(eq) {
    // The blank sits on the right in both authorised equations.
    return leftTotalOf(eq) - sum(eq.rightTerms);
  }
  function isEqualWith(eq, missing) {
    return leftTotalOf(eq) === rightTotalOf(eq, missing);
  }

  /* ------------------------------------------------------ scripted paths */

  const PROBE_BY_LABEL = {
    OPERATIONAL_EQUAL: 'COMPARE_BOTH_SIDES',
    ARITHMETIC_SLIP: 'RECHECK_CALCULATION',
    RELATIONAL_VALID: 'FADE_TO_TRANSFER',
    UNCLEAR: 'ASK_WHAT_EACH_SIDE_MEANS',
  };

  const PATHS = {
    OPERATIONAL_EQUAL: {
      id: 'OPERATIONAL_EQUAL',
      short: 'Answer-next reading',
      placement: 11,
      note: '6 and 5 make 11, so 11 goes in the box.',
      trace: 'PLACE 11 → SUBMIT',
      remedial: true,
      /** Path A alone may state the operational misconception. */
      explainsMisconception: true,
      transferScaffold: 'FADING_RAILS',
      probeLine:
        'Look at what each complete side carries, not only at the part before the = core. ' +
        'The left rail is 6 cells and 5 cells together. The right rail is 7 cells and your group together.',
      repairLead:
        'Match cells across the two rails, then take off the extra right-rail cells until the core settles.',
      tools: ['match', 'cells'],
      submitVerb: 'Power the bridge',
      hints: [
        'The core is still unequal. The left rail is one whole side: 6 cells and 5 cells together. Match cells across the rails before you change the group again.',
        'Side totals are on now. Read the left side as one amount, then read the whole right side as one amount.',
        'Unit matching is on. Matched cells are greyed out. Count only the cells that are left unmatched on the right rail.',
      ],
      settledLine:
        'Both sides now name the same amount: 6 + 5 is 11, and 7 + 4 is 11. The = core means "same amount on both sides", not "the answer comes next".',
    },

    ARITHMETIC_SLIP: {
      id: 'ARITHMETIC_SLIP',
      short: 'Right method, miscount',
      placement: 5,
      note: 'Both sides should be 11; 7 plus 5 is 11.',
      trace: 'PLACE 5 → SUBMIT',
      remedial: true,
      explainsMisconception: false,
      transferScaffold: 'TOTALS_ONLY',
      probeLine:
        'Your goal is right: both sides should carry the same amount, 11. Only the right rail count needs checking. Step through the right rail one cell at a time.',
      repairLead: 'Recount the right rail cell by cell, then fix the group so the right rail carries 11.',
      tools: ['recount', 'cells'],
      submitVerb: 'Power the bridge',
      hints: [
        'The goal is still right: both sides should carry 11. Recount the right rail one cell at a time and see what it actually holds.',
        'Side totals are on now. Compare the right rail total with 11 and adjust the group by the difference.',
        'Unit matching is on. Count the unmatched cells on the right rail and take off exactly that many.',
      ],
      settledLine:
        'Recount done: the right rail now carries 11, same as the left. Your method was right the whole time; only the count needed fixing.',
    },

    RELATIONAL_VALID: {
      id: 'RELATIONAL_VALID',
      short: 'Already relational',
      placement: 4,
      note: 'Both sides make 11: 6 plus 5 and 7 plus 4.',
      trace: 'PLACE 4 → SUBMIT',
      remedial: false,
      explainsMisconception: false,
      transferScaffold: 'SYMBOLIC_ONLY',
      probeLine:
        'Nothing to repair here. The bridge is already balanced, so we skip straight to a new bridge with the cells removed — symbols only.',
      repairLead: '',
      tools: [],
      submitVerb: 'Power the bridge',
      hints: [],
      settledLine: '',
    },

    UNCLEAR: {
      id: 'UNCLEAR',
      short: 'Referent not stated',
      placement: 5,
      note: 'That is the answer.',
      trace: 'PLACE 5 → SUBMIT',
      remedial: true,
      explainsMisconception: false,
      transferScaffold: null, // resolved from the clarification choice
      probeLine:
        'I cannot tell what "that" points to, so I will not guess a reason. Which amount did you mean?',
      repairLead:
        'Compare the complete left side with the complete right side, then build the missing group.',
      tools: ['compare', 'cells'],
      submitVerb: 'Power the bridge',
      hints: [
        'The core is still unequal. Compare the complete left side with the complete right side before changing the group.',
        'Side totals are on now. Read both totals, then decide what the missing group has to carry.',
        'Unit matching is on. Matched cells are greyed out; look at what is still unmatched.',
      ],
      settledLine:
        'Both complete sides now carry the same amount: 11 on the left, 11 on the right. No reason was assigned to the first attempt.',
    },
  };

  const PATH_ORDER = ['OPERATIONAL_EQUAL', 'ARITHMETIC_SLIP', 'RELATIONAL_VALID', 'UNCLEAR'];

  /**
   * Path D clarification → transfer scaffold. The brief left this mapping
   * open; this prototype fixes it here and documents it in README.md and the
   * build report.
   */
  const CLARIFICATION_SCAFFOLD = {
    RIGHT_TOTAL: 'TOTALS_ONLY',
    LEFT_TOTAL: 'FADING_RAILS',
    MISSING_GROUP: 'FADING_RAILS',
  };

  const CLARIFICATIONS = [
    { id: 'LEFT_TOTAL', text: 'The amount the whole left side carries' },
    { id: 'RIGHT_TOTAL', text: 'The amount the whole right side carries' },
    { id: 'MISSING_GROUP', text: 'The number of cells in the missing group' },
  ];

  const CLARIFICATION_REPLY = {
    LEFT_TOTAL:
      'Good — you meant the whole left side. Keep that amount in mind and build the right side to match it.',
    RIGHT_TOTAL:
      'Good — you meant the whole right side. Now compare that amount with the whole left side.',
    MISSING_GROUP:
      'Good — you meant the missing group itself. Now compare both complete sides to decide what that group must carry.',
  };

  const TRANSFER_HINTS = [
    'Not yet. The 12 on the left is one complete side. The right side is 8 together with your group.',
    'Side totals are on now. Compare 12 with what the right side currently carries.',
    'Both sides must name the same amount. The left side is 12; the right side is 8 and your group together.',
  ];

  /* ----------------------------------------------------------------- state */

  const state = {
    pathId: 'OPERATIONAL_EQUAL',
    step: 'inspect',
    phase: 'repair',
    stepsSeen: [],
    missing: 11,
    attempts: 0,
    hintLevel: 0,
    toolMatch: false,
    toolCompare: false,
    recountIndex: 0,
    clarification: null,
    railsFaded: false,
    explainedMisconception: false,
    pathsOpen: false,
    pending: 0,
    focusPending: false,
    statusText: '',
    statusTone: 'neutral',
    statusKey: '',
    pulse: false,
  };

  let pulseTimer = null;

  const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  function motionOff() {
    return !!(reduceMotion && reduceMotion.matches);
  }

  /* -------------------------------------------------------------- elements */

  const el = {};
  [
    'app', 'objectiveText', 'banner', 'pathsToggle', 'pathsPanel', 'pathsGrid',
    'equation', 'bridge', 'core', 'coreState',
    'rail-left', 'rail-left-groups', 'rail-left-total', 'rail-left-name',
    'rail-right', 'rail-right-groups', 'rail-right-total', 'rail-right-name',
    'status', 'bot', 'botLine', 'explanation', 'expTag', 'expNote', 'expTrace',
    'expRead', 'expLabel', 'expProbe',
    'tools', 'toolsHead', 'toolsRow', 'pod', 'podLabel', 'podMinus', 'podValue', 'podPlus',
    'controls',
  ].forEach((id) => {
    el[id] = document.getElementById(id);
  });

  /* ------------------------------------------------------------- utilities */

  function currentPath() {
    return PATHS[state.pathId];
  }
  function currentEquation() {
    return EQUATIONS[state.phase];
  }
  function correctMissing() {
    return correctMissingOf(currentEquation());
  }
  function leftTotal() {
    return leftTotalOf(currentEquation());
  }
  function rightTotal() {
    return rightTotalOf(currentEquation(), state.missing);
  }
  function isEqual() {
    return isEqualWith(currentEquation(), state.missing);
  }

  function resolveScaffold() {
    const path = currentPath();
    if (path.transferScaffold) return path.transferScaffold;
    if (state.clarification && CLARIFICATION_SCAFFOLD[state.clarification]) {
      return CLARIFICATION_SCAFFOLD[state.clarification];
    }
    // Brief §6: default to faint rails while the referent is still uncertain.
    return 'FADING_RAILS';
  }

  /** Are individual unit cells currently drawn? */
  function cellsVisible() {
    if (state.phase === 'repair') return true;
    const scaffold = resolveScaffold();
    if (scaffold === 'SYMBOLIC_ONLY') return false;
    if (scaffold === 'TOTALS_ONLY') return false;
    // FADING_RAILS: faint cells at the start; they fade after the learner's
    // first construction action, and hint level 3 brings them back.
    if (state.hintLevel >= 3) return true;
    return !state.railsFaded;
  }

  function totalsVisible() {
    if (state.hintLevel >= 2) return true;
    // The TOTALS_ONLY transfer scaffold shows totals from the start by design.
    return state.phase === 'transfer' && resolveScaffold() === 'TOTALS_ONLY';
  }

  function matchingOn() {
    if (!cellsVisible()) return false;
    if (state.hintLevel >= 3) return true;
    return state.step === 'repair' && state.toolMatch;
  }

  function setStep(step) {
    state.step = step;
    if (state.stepsSeen[state.stepsSeen.length - 1] !== step) {
      state.stepsSeen.push(step);
    }
  }

  function setStatus(text, tone, key) {
    state.statusText = text;
    state.statusTone = tone || 'neutral';
    state.statusKey = key || '';
  }

  function pulseOnce() {
    if (pulseTimer) {
      clearTimeout(pulseTimer);
      pulseTimer = null;
      if (state.pending > 0) state.pending -= 1;
    }
    if (motionOff()) {
      state.pulse = false;
      return;
    }
    state.pulse = true;
    state.pending += 1;
    pulseTimer = setTimeout(() => {
      pulseTimer = null;
      state.pulse = false;
      state.pending -= 1;
      render();
    }, 450);
  }

  /* --------------------------------------------------------- step handlers */

  function resetForPath(pathId) {
    const path = PATHS[pathId];
    if (pulseTimer) {
      clearTimeout(pulseTimer);
      pulseTimer = null;
      state.pending = 0;
    }
    state.pathId = pathId;
    state.phase = 'repair';
    state.stepsSeen = [];
    state.missing = path.placement;
    state.attempts = 0;
    state.hintLevel = 0;
    state.toolMatch = false;
    state.toolCompare = false;
    state.recountIndex = 0;
    state.clarification = null;
    state.railsFaded = false;
    state.explainedMisconception = false;
    state.pulse = false;
    setStep('inspect');
    setStatus(
      'A synthetic attempt is loaded on the bridge. Inspect it, then power the bridge to see what happens.',
      'neutral',
      'Step 1',
    );
  }

  function enterConsequence() {
    setStep('consequence');
    if (isEqual()) {
      setStatus(
        'The core settles. Both rails carry ' + leftTotal() + '.',
        'good',
        'Balanced',
      );
      pulseOnce();
    } else {
      setStatus(
        'The core will not hold. The two rails do not carry the same amount, so the bridge stays down.',
        'bad',
        'Unequal',
      );
    }
  }

  function enterInterpret() {
    setStep('interpret');
    const path = currentPath();
    if (path.explainsMisconception) state.explainedMisconception = true;
    setStatus(
      'Scripted reading loaded: ' + path.id + ' → ' + PROBE_BY_LABEL[path.id] + '. ' +
        'This reading is fixed by the selected path, not produced by a model.',
      'neutral',
      'Reading',
    );
  }

  function enterClarify() {
    setStep('clarify');
    setStatus('Pick the amount you meant. No reason is assigned to the first attempt.', 'neutral', 'Clarify');
  }

  function enterRepair() {
    setStep('repair');
    state.attempts = 0;
    state.hintLevel = 0;
    state.recountIndex = 0;
    setStatus(currentPath().repairLead, 'neutral', 'Repair');
  }

  function enterSettled() {
    setStep('settled');
    setStatus('Both rails carry ' + leftTotal() + '. The core holds.', 'good', 'Balanced');
    pulseOnce();
  }

  function enterTransfer() {
    setStep('transfer');
    state.phase = 'transfer';
    state.missing = 0;
    state.attempts = 0;
    state.hintLevel = 0;
    state.toolMatch = false;
    state.toolCompare = false;
    state.recountIndex = 0;
    state.railsFaded = false;
    const scaffold = resolveScaffold();
    const lead = {
      FADING_RAILS:
        'New bridge: 12 = 8 + ?. The faint cells stay for now and fade once you start building.',
      TOTALS_ONLY: 'New bridge: 12 = 8 + ?. Side totals only — no individual cells this time.',
      SYMBOLIC_ONLY: 'New bridge: 12 = 8 + ?. Symbols only — the cells are gone.',
    }[scaffold];
    setStatus(lead, 'neutral', 'Transfer');
  }

  function enterSummary() {
    setStep('summary');
    setStatus(
      'Transfer built correctly: 12 on the left, 8 + 4 on the right. That is an immediate understanding check on one equation, not mastery.',
      'good',
      'Done',
    );
    pulseOnce();
  }

  /* -------------------------------------------------------------- actions */

  function changeMissing(delta) {
    const next = Math.min(MAX_MISSING, Math.max(MIN_MISSING, state.missing + delta));
    if (next === state.missing) return;
    state.missing = next;
    state.recountIndex = 0;
    if (state.phase === 'transfer' && resolveScaffold() === 'FADING_RAILS') {
      state.railsFaded = true;
    }
    setStatus(
      'Missing group is now ' + state.missing + ' cell' + (state.missing === 1 ? '' : 's') + '.',
      'neutral',
      'Building',
    );
    render();
  }

  function submitConstruction() {
    const eq = currentEquation();
    if (isEqualWith(eq, state.missing)) {
      if (state.phase === 'repair') enterSettled();
      else enterSummary();
      state.focusPending = true;
      render();
      return;
    }
    state.attempts += 1;
    state.hintLevel = Math.min(3, state.attempts);
    const hints = state.phase === 'repair' ? currentPath().hints : TRANSFER_HINTS;
    const hint = hints[Math.min(hints.length - 1, state.attempts - 1)] || hints[hints.length - 1];
    setStatus(hint, 'bad', 'Hint ' + state.hintLevel);
    render();
  }

  function recountStep() {
    const cells = rightTotal();
    if (state.recountIndex >= cells) {
      state.recountIndex = 0;
      setStatus('Recount reset. Step through the right rail again.', 'neutral', 'Recount');
    } else {
      state.recountIndex += 1;
      if (state.recountIndex === cells) {
        setStatus(
          'Recount finished: the right rail is holding ' + cells + ' cells in total.',
          'neutral',
          'Recount',
        );
      } else {
        setStatus('Counted ' + state.recountIndex + ' so far…', 'neutral', 'Recount');
      }
    }
    render();
  }

  function chooseClarification(id) {
    state.clarification = id;
    setStatus(CLARIFICATION_REPLY[id], 'neutral', 'Clarified');
    enterRepair();
    setStatus(CLARIFICATION_REPLY[id] + ' ' + currentPath().repairLead, 'neutral', 'Repair');
    state.focusPending = true;
    render();
  }

  function advanceFromInterpret() {
    const path = currentPath();
    if (path.id === 'UNCLEAR') enterClarify();
    else if (!path.remedial) enterTransfer();
    else enterRepair();
    state.focusPending = true;
    render();
  }

  /* --------------------------------------------------------------- render */

  function makeButton(spec) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = spec.className || 'btn';
    b.textContent = spec.text;
    if (spec.id) b.id = spec.id;
    if (spec.pressed !== undefined) b.setAttribute('aria-pressed', String(spec.pressed));
    if (spec.label) b.setAttribute('aria-label', spec.label);
    b.addEventListener('click', spec.onClick);
    return b;
  }

  function renderEquation() {
    const eq = currentEquation();
    const frag = document.createDocumentFragment();
    const push = (cls, text) => {
      const s = document.createElement('span');
      s.className = cls;
      s.textContent = text;
      frag.appendChild(s);
    };
    eq.leftTerms.forEach((t, i) => {
      if (i > 0) push('eq-op', '+');
      push('eq-num', String(t));
    });
    push('eq-eq', '=');
    eq.rightTerms.forEach((t, i) => {
      if (i > 0) push('eq-op', '+');
      push('eq-num', String(t));
    });
    push('eq-op', '+');
    const blank = document.createElement('span');
    blank.className = 'eq-blank';
    blank.id = 'eqBlank';
    blank.textContent = String(state.missing);
    frag.appendChild(blank);
    el.equation.replaceChildren(frag);
  }

  function renderGroup(count, label, role, startIndex, matchedCount, countedFrom) {
    const group = document.createElement('div');
    group.className = 'group';
    group.setAttribute('data-role', role);
    const cells = document.createElement('div');
    cells.className = 'group-cells';
    if (count === 0) {
      const empty = document.createElement('span');
      empty.className = 'group-empty';
      empty.textContent = 'empty';
      cells.appendChild(empty);
    }
    for (let i = 0; i < count; i += 1) {
      const c = document.createElement('span');
      c.className = 'cell';
      const globalIndex = startIndex + i;
      c.setAttribute(
        'data-match',
        globalIndex < matchedCount ? 'matched' : 'leftover',
      );
      if (countedFrom !== null) {
        const n = globalIndex + 1;
        if (n < countedFrom) c.setAttribute('data-counted', 'done');
        else if (n === countedFrom) c.setAttribute('data-counted', 'now');
      }
      cells.appendChild(c);
    }
    group.appendChild(cells);
    const cap = document.createElement('span');
    cap.className = 'group-label';
    cap.textContent = label;
    group.appendChild(cap);
    return group;
  }

  function renderRails() {
    const eq = currentEquation();
    const show = cellsVisible();
    const matched = Math.min(leftTotal(), rightTotal());
    const counted = state.recountIndex > 0 ? state.recountIndex : null;

    el['rail-left-groups'].replaceChildren();
    el['rail-right-groups'].replaceChildren();

    if (show) {
      let idx = 0;
      eq.leftTerms.forEach((t) => {
        el['rail-left-groups'].appendChild(
          renderGroup(t, 'group of ' + t, 'fixed', idx, matched, null),
        );
        idx += t;
      });
      idx = 0;
      eq.rightTerms.forEach((t) => {
        el['rail-right-groups'].appendChild(
          renderGroup(t, 'group of ' + t, 'fixed', idx, matched, counted),
        );
        idx += t;
      });
      el['rail-right-groups'].appendChild(
        renderGroup(state.missing, 'missing group: ' + state.missing, 'missing', idx, matched, counted),
      );
    }

    const showTotals = totalsVisible();
    el['rail-left-total'].hidden = !showTotals;
    el['rail-right-total'].hidden = !showTotals;
    el['rail-left-total'].textContent = 'Left side total: ' + leftTotal();
    el['rail-right-total'].textContent = 'Right side total: ' + rightTotal();

    el['rail-left-name'].textContent =
      state.phase === 'transfer' && !show ? 'Left side' : 'Left rail';
    el['rail-right-name'].textContent =
      state.phase === 'transfer' && !show ? 'Right side' : 'Right rail';

    const bal = state.step === 'inspect' ? 'unknown' : isEqual() ? 'equal' : 'unequal';
    el.bridge.setAttribute('data-balance', bal);
    el.coreState.textContent =
      bal === 'equal' ? 'same amount' : bal === 'unequal' ? 'not the same' : 'not tested';
    el.bridge.setAttribute('data-matching', matchingOn() ? 'on' : 'off');
    el.bridge.setAttribute('data-compare', state.toolCompare ? 'on' : 'off');
    el.bridge.setAttribute('data-pulse', state.pulse ? 'on' : 'off');
    el.bridge.setAttribute(
      'data-scaffold',
      state.phase === 'transfer' ? resolveScaffold() : 'NONE',
    );
    el.bridge.setAttribute(
      'data-faded',
      state.phase === 'transfer' && resolveScaffold() === 'FADING_RAILS' && show ? 'true' : 'false',
    );
  }

  function renderExplanation() {
    const path = currentPath();
    el.expTag.textContent = 'Synthetic attempt — ' + path.short;
    el.expNote.textContent = '“' + path.note + '”';
    // The engine verdict appears only AFTER the bridge has been powered, so it
    // does not pre-empt the "see the consequence" beat. It never shows the
    // correct value: the learner always constructs that.
    const tested = state.stepsSeen.indexOf('consequence') !== -1;
    const verdict =
      path.placement === correctMissingOf(EQUATIONS.repair)
        ? 'makes both sides equal'
        : 'does not make both sides equal';
    el.expTrace.textContent = tested
      ? 'Trace: ' + path.trace + '  ·  engine verdict: placed ' + path.placement + ' — ' + verdict
      : 'Trace: ' + path.trace + '  ·  not powered yet';
    const revealed = state.stepsSeen.indexOf('interpret') !== -1;
    el.expRead.hidden = !revealed;
    el.expLabel.textContent = path.id;
    el.expProbe.textContent = PROBE_BY_LABEL[path.id];
  }

  function renderBot() {
    const path = currentPath();
    let mood = 'calm';
    let line = '';
    switch (state.step) {
      case 'inspect':
        mood = 'calm';
        line = 'I am Volt. Something is already placed in the missing group. Power the bridge and watch the = core.';
        break;
      case 'consequence':
        mood = isEqual() ? 'happy' : 'worried';
        line = isEqual()
          ? 'The core holds. Both rails carry the same amount.'
          : 'The core cannot hold. One side carries more energy than the other.';
        break;
      case 'interpret':
        mood = 'thinking';
        line = path.probeLine;
        break;
      case 'clarify':
        mood = 'thinking';
        line = path.probeLine;
        break;
      case 'repair':
        mood = isEqual() ? 'happy' : 'worried';
        line = path.repairLead;
        break;
      case 'settled':
        mood = 'happy';
        line = path.settledLine;
        break;
      case 'transfer':
        mood = isEqual() ? 'happy' : 'thinking';
        line = 'Same idea, new bridge: 12 on the left, 8 and your group on the right.';
        break;
      case 'summary':
        mood = 'happy';
        line = 'Both bridges hold. That is one repair and one transfer — an understanding check, not mastery.';
        break;
      default:
        break;
    }
    el.bot.setAttribute('data-mood', mood);
    el.botLine.textContent = line;
  }

  function renderTools() {
    const constructing = state.step === 'repair' || state.step === 'transfer';
    el.tools.hidden = !constructing;
    el.toolsRow.replaceChildren();
    el.pod.hidden = !constructing;
    if (!constructing) return;

    const path = currentPath();
    // The repair is built with cells AND the number pod. The transfer is the
    // symbolic step, so it is built with the number pod only; its rails are
    // scaffold, not a control surface.
    const tools = state.phase === 'repair' ? path.tools : [];
    const scaffold = resolveScaffold();
    const cellsAvailable = state.phase === 'repair';

    el.toolsHead.textContent =
      state.phase === 'repair' ? 'Repair tools' : 'Transfer tools (' + scaffold + ')';

    if (tools.indexOf('match') !== -1) {
      el.toolsRow.appendChild(
        makeButton({
          id: 'toolMatch',
          className: 'tool-btn',
          text: state.toolMatch ? 'Matching cells: on' : 'Match cells across rails',
          pressed: state.toolMatch,
          onClick: () => {
            state.toolMatch = !state.toolMatch;
            setStatus(
              state.toolMatch
                ? 'Matching is on. Greyed cells have a partner on the other rail; ringed cells do not.'
                : 'Matching is off.',
              'neutral',
              'Matching',
            );
            render();
          },
        }),
      );
    }

    if (tools.indexOf('recount') !== -1) {
      el.toolsRow.appendChild(
        makeButton({
          id: 'toolRecount',
          className: 'tool-btn',
          text:
            state.recountIndex >= rightTotal() && state.recountIndex > 0
              ? 'Recount from the start'
              : 'Recount next cell (' + state.recountIndex + '/' + rightTotal() + ')',
          onClick: recountStep,
        }),
      );
    }

    if (tools.indexOf('compare') !== -1) {
      el.toolsRow.appendChild(
        makeButton({
          id: 'toolCompare',
          className: 'tool-btn',
          text: state.toolCompare ? 'Side outlines: on' : 'Outline both complete sides',
          pressed: state.toolCompare,
          onClick: () => {
            state.toolCompare = !state.toolCompare;
            setStatus(
              state.toolCompare
                ? 'Each complete side is outlined. Compare them as whole amounts.'
                : 'Side outlines are off.',
              'neutral',
              'Compare',
            );
            render();
          },
        }),
      );
    }

    if (cellsAvailable) {
      el.toolsRow.appendChild(
        makeButton({
          id: 'removeCell',
          className: 'tool-btn',
          text: '− Remove a cell',
          onClick: () => changeMissing(-1),
        }),
      );
      el.toolsRow.appendChild(
        makeButton({
          id: 'addCell',
          className: 'tool-btn',
          text: '+ Add a cell',
          onClick: () => changeMissing(1),
        }),
      );
    }

    el.podLabel.textContent = 'Number pod (same quantity, written as a numeral)';
    el.podValue.textContent = String(state.missing);
    el.podMinus.disabled = state.missing <= MIN_MISSING;
    el.podPlus.disabled = state.missing >= MAX_MISSING;
  }

  function renderControls() {
    const path = currentPath();
    const frag = document.createDocumentFragment();
    const add = (spec) => frag.appendChild(makeButton(spec));

    switch (state.step) {
      case 'inspect':
        add({
          className: 'btn primary',
          id: 'primaryBtn',
          text: 'Power the bridge',
          onClick: () => {
            enterConsequence();
            state.focusPending = true;
            render();
          },
        });
        break;
      case 'consequence':
        add({
          className: 'btn primary',
          id: 'primaryBtn',
          text: isEqual() ? 'Read the note' : 'Why did it fail?',
          onClick: () => {
            enterInterpret();
            state.focusPending = true;
            render();
          },
        });
        break;
      case 'interpret':
        add({
          className: 'btn primary',
          id: 'primaryBtn',
          text:
            path.id === 'UNCLEAR'
              ? 'Answer the question'
              : path.remedial
                ? 'Start the repair'
                : 'Go to the new bridge',
          onClick: advanceFromInterpret,
        });
        break;
      case 'clarify':
        CLARIFICATIONS.forEach((c) => {
          add({
            className: 'btn choice',
            id: 'clarify-' + c.id,
            text: c.text,
            onClick: () => chooseClarification(c.id),
          });
        });
        break;
      case 'repair':
      case 'transfer':
        add({
          className: 'btn primary',
          id: 'submitBtn',
          text: state.phase === 'repair' ? path.submitVerb : 'Power the new bridge',
          onClick: submitConstruction,
        });
        break;
      case 'settled':
        add({
          className: 'btn primary',
          id: 'primaryBtn',
          text: 'Go to the new bridge',
          onClick: () => {
            enterTransfer();
            state.focusPending = true;
            render();
          },
        });
        break;
      case 'summary':
        add({
          className: 'btn primary',
          id: 'replayBtn',
          text: 'Replay',
          onClick: () => {
            resetForPath(state.pathId);
            state.focusPending = true;
            render();
          },
        });
        break;
      default:
        break;
    }

    if (state.step !== 'summary' && state.step !== 'inspect') {
      add({
        className: 'btn',
        id: 'replayBtn',
        text: 'Replay',
        onClick: () => {
          resetForPath(state.pathId);
          state.focusPending = true;
          render();
        },
      });
    }

    el.controls.replaceChildren(frag);
  }

  function renderPaths() {
    el.pathsPanel.hidden = !state.pathsOpen;
    el.pathsToggle.setAttribute('aria-expanded', String(state.pathsOpen));
    el.pathsGrid.replaceChildren();
    PATH_ORDER.forEach((id) => {
      const p = PATHS[id];
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'path-btn';
      b.id = 'path-' + id;
      b.setAttribute('data-path', id);
      b.setAttribute('aria-pressed', String(state.pathId === id));
      const a = document.createElement('span');
      a.className = 'path-id';
      a.textContent = p.id;
      const s = document.createElement('span');
      s.className = 'path-sub';
      s.textContent = 'places ' + p.placement + ' · ' + p.short + ' · ' + PROBE_BY_LABEL[p.id];
      b.append(a, s);
      b.addEventListener('click', () => {
        resetForPath(id);
        state.focusPending = true;
        render();
      });
      el.pathsGrid.appendChild(b);
    });
  }

  function renderStatus() {
    el.status.setAttribute('data-tone', state.statusTone);
    el.status.replaceChildren();
    if (state.statusKey) {
      const k = document.createElement('span');
      k.className = 'status-key';
      k.textContent = state.statusKey + ':';
      el.status.appendChild(k);
    }
    el.status.appendChild(document.createTextNode(state.statusText));
  }

  function renderObjective() {
    el.objectiveText.textContent =
      state.phase === 'repair'
        ? 'Make both rails carry the same amount.'
        : 'Same idea, cells faded: make both sides name the same amount.';
  }

  function render() {
    // Controls are rebuilt on every render, so remember which one had focus
    // and give it back. Keyboard-only play must not lose its place.
    const previouslyFocused =
      document.activeElement && document.activeElement.id ? document.activeElement.id : null;

    renderObjective();
    renderEquation();
    renderRails();
    renderExplanation();
    renderBot();
    renderTools();
    renderControls();
    renderPaths();
    renderStatus();

    const disabled = state.pending > 0;
    el.app.querySelectorAll('button').forEach((b) => {
      if (b === el.pathsToggle) return;
      if (b.id === 'podMinus') {
        b.disabled = disabled || state.missing <= MIN_MISSING;
        return;
      }
      if (b.id === 'podPlus') {
        b.disabled = disabled || state.missing >= MAX_MISSING;
        return;
      }
      b.disabled = disabled;
    });

    if (state.focusPending && !disabled) {
      state.focusPending = false;
      const target = el.controls.querySelector('button:not(:disabled)');
      if (target) target.focus();
      return;
    }

    if (previouslyFocused && document.activeElement === document.body) {
      const again = document.getElementById(previouslyFocused);
      if (again && !again.disabled) again.focus();
    }
  }

  /* ------------------------------------------------------------- wiring */

  el.pathsToggle.addEventListener('click', () => {
    state.pathsOpen = !state.pathsOpen;
    render();
  });

  el.podMinus.addEventListener('click', () => changeMissing(-1));
  el.podPlus.addEventListener('click', () => changeMissing(1));

  // Arrow-key alternative to pointer placement, anywhere in the tool tray.
  el.tools.addEventListener('keydown', (e) => {
    if (state.pending > 0) return;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      changeMissing(1);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      changeMissing(-1);
    }
  });

  if (reduceMotion && reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', render);
  }

  /* ---------------------------------------------------------- test hook */

  // Read-only state hook for the verification script. It cannot change state.
  Object.defineProperty(window, '__equalizerLab', {
    value: Object.freeze({
      step: () => state.step,
      busy: () => state.pending > 0,
      path: () => state.pathId,
      phase: () => state.phase,
      equation: () => currentEquation().text,
      leftTotal: () => leftTotal(),
      rightTotal: () => rightTotal(),
      missingValue: () => state.missing,
      correctMissing: () => correctMissing(),
      isEqual: () => isEqual(),
      attempts: () => state.attempts,
      hintLevel: () => state.hintLevel,
      scaffold: () => (state.phase === 'transfer' ? resolveScaffold() : null),
      plannedScaffold: () => resolveScaffold(),
      label: () => (state.stepsSeen.indexOf('interpret') === -1 ? null : state.pathId),
      probeId: () =>
        state.stepsSeen.indexOf('interpret') === -1 ? null : PROBE_BY_LABEL[state.pathId],
      clarification: () => state.clarification,
      recountIndex: () => state.recountIndex,
      totalsVisible: () => totalsVisible(),
      matchOverlay: () => matchingOn(),
      railsVisible: () => cellsVisible(),
      explainedMisconception: () => state.explainedMisconception,
      stepsSeen: () => state.stepsSeen.slice(),
      status: () => (state.statusKey ? state.statusKey + ': ' : '') + state.statusText,
      botLine: () => el.botLine.textContent,
      banner: () => el.banner.textContent,
      pathsOpen: () => state.pathsOpen,
      reducedMotion: () => motionOff(),
      minMissing: () => MIN_MISSING,
      maxMissing: () => MAX_MISSING,
    }),
  });

  /* ----------------------------------------------------------- start up */

  resetForPath('OPERATIONAL_EQUAL');
  render();
})();
