/*
 * Mission Forge — scripted concept prototype. No runtime AI, no network.
 *
 * Layers, top to bottom:
 *   1. MISSIONS     Deterministic mission schemas: numbers, what each number
 *                   counts, labels, build mode, object limits. The same
 *                   equation appears twice, once per valid story meaning.
 *   2. Engine       Pure functions that own all math and role truth: role
 *                   lookup, Robo's role swap, group building, pass/fail.
 *   3. Interpreter  A transparent local script that reads a story and selects
 *                   one of the two closed schemas, or refuses. It is not AI
 *                   and never decides math truth.
 *   4. Flow         A small finite-state game flow (state + actions + timed
 *                   sequences). It asks the engine for every count.
 *   5. View         DOM rendering and animation. It reads state and never
 *                   changes mission data.
 */
(() => {
  'use strict';

  /* ================================================================== */
  /* 1. Mission schemas                                                  */
  /* ================================================================== */

  const ROLE = Object.freeze({ TOTAL: 'total', SIZE: 'groupSize', COUNT: 'groupCount' });
  const TERMS = ['dividend', 'divisor', 'quotient'];

  const CRYSTAL = Object.freeze({ one: 'crystal', many: 'crystals', icon: 'i-crystal', viewBox: '0 0 24 30' });
  const BATTERY = Object.freeze({ one: 'battery', many: 'batteries', icon: 'i-battery', viewBox: '0 0 20 30' });
  const SHIP = Object.freeze({ one: 'ship', many: 'ships', icon: 'i-ship', viewBox: '0 0 80 46', kind: 'ship' });
  const ROVER = Object.freeze({ one: 'rover', many: 'rovers', icon: 'i-rover', viewBox: '0 0 80 40', kind: 'rover' });

  /** Group size and number of groups are the two swappable roles. */
  const opposite = (role) => (role === ROLE.SIZE ? ROLE.COUNT : ROLE.SIZE);

  /**
   * One schema per story meaning. `divisorRole` is the whole difference: it
   * says what the story pins down, and everything else follows from it —
   * the quotient's role, the intended world, Robo's opposite world, the
   * labels and how the world is rebuilt.
   */
  function schema(spec) {
    const { item, group, divisorRole } = spec;
    return Object.freeze({
      ...spec,
      roles: Object.freeze({ dividend: ROLE.TOTAL, divisor: divisorRole, quotient: opposite(divisorRole) }),
      // A known group size is repeated until the items run out; a known
      // number of groups is filled equally.
      mode: divisorRole === ROLE.SIZE ? 'repeat' : 'fill',
      tags: Object.freeze({
        [ROLE.TOTAL]: `total ${item.many}`,
        [ROLE.SIZE]: `${item.many} per ${group.one}`,
        [ROLE.COUNT]: `number of ${group.many}`,
      }),
      phrases: Object.freeze({
        [ROLE.TOTAL]: `total ${item.many}`,
        [ROLE.SIZE]: `${item.many} in each ${group.one}`,
        [ROLE.COUNT]: `number of ${group.many}`,
      }),
    });
  }

  const MISSIONS = Object.freeze({
    // Mission 1, meaning A: the story fixes the group size.
    'ships-size': schema({
      id: 'ships-size',
      equation: { dividend: 12, divisor: 3, quotient: 4 },
      item: CRYSTAL,
      group: SHIP,
      divisorRole: ROLE.SIZE,
      maxPerGroup: 6,
      example: '12 crystals. Put 3 crystals in each ship. How many ships can launch?',
      exampleLabel: '3 in each ship',
      spanRules: [
        [ROLE.TOTAL, [/\b(12|twelve)\s+crystals?\b/i, /\b(12|twelve)\b/i]],
        [
          ROLE.SIZE,
          [
            /\b(3|three)\s+(crystals?\s+)?(in|into|per|for|on|inside)\s+(each|every)\s+ship\b/i,
            /\b(3|three)\s+(crystals?\s+)?per\s+ship\b/i,
            /\b(each|every)\s+ship\s+[a-z]+(\s+[a-z]+)?\s+(3|three)(\s+crystals?)?/i,
          ],
        ],
        [ROLE.COUNT, [/\bhow\s+many\s+ships\b[^.?!]*\??/i]],
      ],
    }),
    // Mission 1, meaning B: the story fixes the number of groups.
    'ships-count': schema({
      id: 'ships-count',
      equation: { dividend: 12, divisor: 3, quotient: 4 },
      item: CRYSTAL,
      group: SHIP,
      divisorRole: ROLE.COUNT,
      maxPerGroup: 6,
      example: '3 ships are sharing 12 crystals equally. How many crystals does each ship get?',
      exampleLabel: '3 ships share',
      spanRules: [
        [ROLE.COUNT, [/\b(3|three)\s+ships?\b/i]],
        [ROLE.TOTAL, [/\b(12|twelve)\s+crystals?\b/i, /\b(12|twelve)\b/i]],
        [ROLE.SIZE, [/\bhow\s+many\s+crystals?\b[^.?!]*\??/i]],
      ],
    }),
    // Mission 2 after meaning A: the roles reverse, so this one shares.
    'rovers-count': schema({
      id: 'rovers-count',
      equation: { dividend: 20, divisor: 5, quotient: 4 },
      item: BATTERY,
      group: ROVER,
      divisorRole: ROLE.COUNT,
      maxPerGroup: 8,
      story: '20 batteries are shared equally across 5 rovers. How many batteries does each rover get?',
      spanRules: [
        [ROLE.TOTAL, [/\b20\s+batteries\b/i]],
        [ROLE.COUNT, [/\b5\s+rovers\b/i]],
        [ROLE.SIZE, [/\bhow\s+many\s+batteries\b[^.?!]*\??/i]],
      ],
    }),
    // Mission 2 after meaning B: the roles reverse the other way.
    'rovers-size': schema({
      id: 'rovers-size',
      equation: { dividend: 20, divisor: 5, quotient: 4 },
      item: BATTERY,
      group: ROVER,
      divisorRole: ROLE.SIZE,
      maxPerGroup: 8,
      story: '20 batteries. Put 5 batteries in each rover. How many rovers can roll out?',
      spanRules: [
        [ROLE.TOTAL, [/\b20\s+batteries\b/i]],
        [ROLE.SIZE, [/\b5\s+batteries\s+in\s+each\s+rover\b/i]],
        [ROLE.COUNT, [/\bhow\s+many\s+rovers\b[^.?!]*\??/i]],
      ],
    }),
  });

  /** Mission 2 must ask the opposite question to mission 1. */
  const TRANSFER_OF = Object.freeze({ 'ships-size': 'rovers-count', 'ships-count': 'rovers-size' });
  const FIRST_IDS = Object.freeze(Object.keys(TRANSFER_OF));
  const PREVIEW_ID = FIRST_IDS[0]; // only used for the equation numbers before a story is read

  /* ================================================================== */
  /* 2. Engine (pure, deterministic)                                     */
  /* ================================================================== */

  function termFor(m, role) {
    return TERMS.find((k) => m.roles[k] === role);
  }

  function valueFor(m, role) {
    return m.equation[termFor(m, role)];
  }

  function intendedWorld(m) {
    return {
      total: valueFor(m, ROLE.TOTAL),
      groupSize: valueFor(m, ROLE.SIZE),
      groupCount: valueFor(m, ROLE.COUNT),
    };
  }

  /** Robo calculates correctly but swaps what the divisor and quotient count. */
  function roboWorld(m) {
    const w = intendedWorld(m);
    return { total: w.total, groupSize: w.groupCount, groupCount: w.groupSize };
  }

  /** Measurement model: make groups of `size` until the items run out. */
  function repeatGroup(total, size) {
    const count = Math.floor(total / size);
    return { groups: Array.from({ length: count }, () => size), leftover: total - count * size };
  }

  /** Sharing model with fixed groups: give each group up to `size`, in order. */
  function fillFixedGroups(total, groupCount, size) {
    let left = total;
    const groups = [];
    for (let i = 0; i < groupCount; i += 1) {
      const n = Math.min(size, left);
      groups.push(n);
      left -= n;
    }
    return { groups, leftover: left };
  }

  /** The learner's one group decides the build; the mode comes from the story. */
  function buildPlan(m, size) {
    const w = intendedWorld(m);
    return m.mode === 'repeat' ? repeatGroup(w.total, size) : fillFixedGroups(w.total, w.groupCount, size);
  }

  /** What is on the floor before the learner loads anything. */
  function startingGroups(m, prefix) {
    const n = m.mode === 'repeat' ? 1 : intendedWorld(m).groupCount;
    return Array.from({ length: n }, (_, i) => ({ id: `${prefix}${i}`, count: 0, status: i === 0 ? 'loading' : '' }));
  }

  function checkWorld(m, groups, leftover) {
    const want = intendedWorld(m);
    const used = groups.reduce((a, b) => a + b, 0);
    if (used + leftover !== want.total) {
      throw new Error(`Item count drifted: ${used} + ${leftover} != ${want.total}`);
    }
    const equal = groups.length > 0 && groups.every((g) => g === groups[0]);
    const size = equal ? groups[0] : null;
    const sizeMatches = size === want.groupSize;
    const countMatches = groups.length === want.groupCount;
    return {
      pass: equal && sizeMatches && countMatches && leftover === 0,
      want,
      used,
      leftover,
      equal,
      size,
      count: groups.length,
      sizeMatches,
      countMatches,
    };
  }

  /** Reads naturally in a sentence: "4 was the number of ships". */
  function saidAs(m, role) {
    return role === ROLE.SIZE ? m.phrases[role] : `the ${m.phrases[role]}`;
  }

  /** Short phrase for "what this number counts in this world". */
  function countsAs(m, n, role) {
    if (role === ROLE.COUNT) return `${n} ${n === 1 ? m.group.one : m.group.many}`;
    if (role === ROLE.SIZE) return `${n} in each ${m.group.one}`;
    return `${n} ${m.item.many} in all`;
  }

  function verifyMissions() {
    for (const m of Object.values(MISSIONS)) {
      const { dividend, divisor, quotient } = m.equation;
      if (divisor * quotient !== dividend) throw new Error(`${m.id}: equation is false`);
      const roles = TERMS.map((k) => m.roles[k]).sort().join(',');
      if (roles !== 'groupCount,groupSize,total') throw new Error(`${m.id}: roles incomplete`);
      if (valueFor(m, ROLE.SIZE) > m.maxPerGroup) throw new Error(`${m.id}: group size above the load limit`);
    }
    // The two readings of the same equation must genuinely differ.
    const [a, b] = FIRST_IDS.map((id) => MISSIONS[id]);
    if (a.roles.divisor === b.roles.divisor) throw new Error('Both story meanings select the same roles');
    if (a.mode === b.mode) throw new Error('Both story meanings build the same way');

    for (const [firstId, secondId] of Object.entries(TRANSFER_OF)) {
      const first = MISSIONS[firstId];
      const second = MISSIONS[secondId];
      const robo = roboWorld(first);
      const roboCheck = checkWorld(first, Array(robo.groupCount).fill(robo.groupSize), 0);
      // Robo's world must use every item yet still fail the story.
      if (roboCheck.used !== robo.total || roboCheck.pass) throw new Error(`${firstId}: Robo world is not a tidy mistake`);
      if (first.roles.divisor === second.roles.divisor) throw new Error(`${firstId}: transfer does not reverse roles`);
      if (first.mode === second.mode) throw new Error(`${firstId}: transfer repeats the same build`);
    }
  }

  /* ================================================================== */
  /* 3. Scripted interpreter (local script — not AI)                     */
  /* ================================================================== */

  const NUMBER_WORDS = { twelve: '12', three: '3', four: '4' };

  function normalise(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\b(twelve|three|four)\b/g, (w) => NUMBER_WORDS[w])
      .trim();
  }

  const SHARE_VERB = /\b(share|shares|shared|sharing|split|splits|splitting|divide|divides|divided|dividing|spread|deal|deals|dealt|give|gives|given)\b/;

  /**
   * Reads one story and selects one of the two closed schemas for 12 ÷ 3 = 4.
   *
   * It looks for two independent signals — what the 3 is attached to, and what
   * the question asks for — and only commits when they agree. Anything else is
   * refused honestly. It never invents a schema and never does arithmetic.
   */
  function interpretStory(text) {
    const n = normalise(text);
    if (!n) return { status: 'empty', message: 'Write a mission story first, or tap one of the two examples.' };

    const nums = n.match(/\b\d+\b/g) || [];
    const knownNumbers = nums.every((v) => v === '12' || v === '3' || v === '4');
    if (!nums.includes('12') || !nums.includes('3') || !/\bcrystals?\b/.test(n) || !/\bships?\b/.test(n) || !knownNumbers) {
      return {
        status: 'unsupported',
        message: 'This scripted prototype only knows stories about 12 crystals, 3 and ships. Tap one of the two examples.',
      };
    }

    // Signal 1: is the 3 attached to each ship, or to the ships themselves?
    const sizeCue =
      /\b3 (crystals? )?(in|into|per|for|on|inside) (each|every) ship\b/.test(n) ||
      /\b3 (crystals? )?per ship\b/.test(n) ||
      /\b(each|every) ship (holds|gets|takes|carries|has|needs|fits|can hold|can carry|can take|is given) 3\b/.test(n);
    const countCue =
      /\b(between|among|amongst|across|into|over) 3 ships?\b/.test(n) ||
      (/\b3 ships?\b/.test(n) && SHARE_VERB.test(n)) ||
      /\b3 ships? (each )?(get|gets|got|need|needs|take|takes)\b/.test(n);

    // Signal 2: does the question ask for ships, or for crystals in each ship?
    const asksCount = /\bhow many ships\b/.test(n);
    const asksSize = /\bhow many crystals?\b/.test(n) && /\b(each|every|per) ship\b/.test(n);

    const forSize = (sizeCue ? 2 : 0) + (asksCount ? 1 : 0);
    const forCount = (countCue ? 2 : 0) + (asksSize ? 1 : 0);
    if (forSize >= 2 && forCount === 0) return picked('ships-size', text);
    if (forCount >= 2 && forSize === 0) return picked('ships-count', text);
    return {
      status: 'ambiguous',
      message: 'I can’t tell what the 3 counts: 3 crystals in each ship, or 3 ships sharing them? Tap an example to see both.',
    };
  }

  function picked(id, text) {
    const m = MISSIONS[id];
    return {
      status: 'ok',
      missionId: id,
      reading: `${m.equation.divisor} = ${m.tags[m.roles.divisor]}`,
      spans: findSpans(text, m.spanRules),
    };
  }

  function findSpans(text, rules) {
    const spans = [];
    for (const [role, patterns] of rules) {
      for (const re of patterns) {
        const m = re.exec(text);
        if (m) {
          spans.push({ role, start: m.index, end: m.index + m[0].length });
          break;
        }
      }
    }
    spans.sort((a, b) => a.start - b.start);
    return spans.filter((s, i) => i === 0 || s.start >= spans[i - 1].end);
  }

  function verifyInterpreter() {
    const cases = [
      [MISSIONS['ships-size'].example, 'ships-size'],
      ['Each ship holds 3 crystals. There are 12 crystals. How many ships?', 'ships-size'],
      ['12 crystals, 3 in each ship. How many ships launch?', 'ships-size'],
      [MISSIONS['ships-count'].example, 'ships-count'],
      ['Share 12 crystals equally across 3 ships. How many crystals does each ship get?', 'ships-count'],
      ['12 crystals are shared across 3 ships. How many crystals in each ship?', 'ships-count'],
      ['12 crystals and 3 ships.', 'ambiguous'],
      ['12 crystals, 3 in each ship. How many crystals does each ship get?', 'ambiguous'],
      ['My dog ate 7 cookies.', 'unsupported'],
      ['   ', 'empty'],
    ];
    for (const [text, want] of cases) {
      const r = interpretStory(text);
      const got = r.status === 'ok' ? r.missionId : r.status;
      if (got !== want) throw new Error(`Interpreter: "${text}" -> ${got}, expected ${want}`);
    }
    // The two example stories must not land on the same schema.
    const a = interpretStory(MISSIONS['ships-size'].example);
    const b = interpretStory(MISSIONS['ships-count'].example);
    if (a.missionId === b.missionId) throw new Error('Both examples select the same schema');
  }

  verifyMissions();
  verifyInterpreter();

  /* ================================================================== */
  /* 4. Flow: state, actions, timed sequences                            */
  /* ================================================================== */

  const BUSY = new Set([
    'compile',
    'robo-build',
    'scanning',
    'unbuild',
    'repeating',
    'launching',
    'transfer-intro',
    'filling',
    'finishing',
  ]);

  const SAY = {
    arrive: 'I can calculate 4, but what does the 4 count? Forge me a mission.',
    forge: 'Write a story where 12 ÷ 3 = 4. I’ll build it!',
    compile: 'Compiling your story…',
    verdict: 'I used all 12. Did I build your mission?',
    scanning: 'Launching ship 1!',
    scan: 'Uh-oh. The mission scanner says my world doesn’t match your story.',
    debug: 'Hmm! What did I get wrong?',
    repaired: 'All 12 used, and it matches your story!',
    retry: 'Let’s try that group again.',
    launch: 'Launch!',
    teach: 'So what did 3 count, and what did 4 count?',
    transferIntro: 'New mission! Same 4, new story.',
    transferPass: 'That matches the new story, and none are left!',
    done: 'Now I always check what the answer counts!',
  };

  /** Robo's confident wrong reading of the learner's story. */
  function sayRoboBuild(m) {
    const e = m.equation;
    const wrongDivisor = opposite(m.roles.divisor);
    return `${e.dividend} ${m.item.many}… and ${e.divisor}… so ${countsAs(m, e.divisor, wrongDivisor)}! ${e.dividend} ÷ ${
      e.divisor
    } = ${countsAs(m, e.quotient, opposite(wrongDivisor))}!`;
  }

  function sayIdentified(m) {
    return `Oh! ${m.equation.divisor} is ${m.tags[m.roles.divisor]}, not ${m.tags[opposite(m.roles.divisor)]}!`;
  }

  function sayRepair(m) {
    return m.mode === 'repeat'
      ? `Show me. Load one ${m.group.one} the way your story says.`
      : `Show me. Your story parks ${intendedWorld(m).groupCount} ${m.group.many} — load ${m.group.one} 1.`;
  }

  function sayTransfer(m) {
    return m.mode === 'repeat'
      ? `Load one ${m.group.one} the way this story says, then I’ll repeat it.`
      : `${intendedWorld(m).groupCount} ${m.group.many} are parked. You load ${m.group.one} 1, then I’ll copy it.`;
  }

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrowQuery = window.matchMedia('(max-width: 720px)');
  const reduced = () => reducedMotionQuery.matches;

  class Cancelled extends Error {}
  let epoch = 0;
  let state = initialState();

  function initialState() {
    return {
      step: 'arrive',
      // Null until the learner's story selects a schema. Nothing downstream
      // is decided before that.
      missionId: null,
      firstMissionId: null,
      story: MISSIONS[PREVIEW_ID].example,
      interp: null,
      note: null,
      mood: 'curious',
      bubble: SAY.arrive,
      eq: { missionId: PREVIEW_ID, tags: {}, compiling: false },
      marks: [],
      glow: null,
      world: freshWorld(),
      load: 0,
      pending: 0,
      teach: { divisor: null, quotient: null },
      wrongSlots: [],
      triedYes: false,
    };
  }

  function freshWorld() {
    return { groups: [], pile: 0, pileLabel: '', chips: [], scan: null };
  }

  /** The selected mission, or the preview schema for the untouched equation. */
  function mission() {
    return MISSIONS[state.missionId || PREVIEW_ID];
  }

  function firstMission() {
    return MISSIONS[state.firstMissionId || PREVIEW_ID];
  }

  function onTransfer() {
    return !!state.missionId && state.missionId !== state.firstMissionId;
  }

  function commit(patch) {
    state = { ...state, ...patch };
    render();
  }

  function patchWorld(fn) {
    const world = { ...state.world, groups: state.world.groups.map((g) => ({ ...g })) };
    fn(world);
    state = { ...state, world };
    render();
  }

  function group(world, id) {
    return world.groups.find((g) => g.id === id);
  }

  /** Waits for reading beats; these pauses stay even with reduced motion. */
  function beat(ms, t) {
    return new Promise((resolve, reject) => {
      setTimeout(() => (t === epoch ? resolve() : reject(new Cancelled())), ms);
    });
  }

  /** Waits inside motion loops; collapses to zero with reduced motion. */
  function tick(ms, t) {
    return beat(reduced() ? 0 : ms, t);
  }

  function sequence(fn) {
    const t = epoch;
    fn(t).catch((err) => {
      if (!(err instanceof Cancelled)) throw err;
    });
  }

  function reset() {
    epoch += 1;
    document.querySelectorAll('.flyer, .ghost, .beam, .scan-sweep').forEach((el) => el.remove());
    endDrag();
    aperture.classList.remove('flash', 'warn');
    state = initialState();
    render();
  }

  /* ---------- Actions (one entry point for pointer and keyboard) ---------- */

  function act(action, value) {
    if (BUSY.has(state.step) && action !== 'replay') return;
    switch (action) {
      case 'forge':
        return commit({ step: 'forge', bubble: SAY.forge, note: null });
      case 'example':
        return commit({ story: MISSIONS[value].example, note: null });
      case 'build':
        return buildWorld();
      case 'yes':
        return sequence(runScan);
      case 'no':
        return commit({ step: 'identify', mood: 'puzzled', bubble: SAY.debug, note: null, glow: mission().roles.divisor });
      case 'debug':
        return commit({ step: 'identify', bubble: SAY.debug, note: null, glow: mission().roles.divisor });
      case 'identify':
        return identify(value);
      case 'load':
        return playerLoad(null);
      case 'unload':
        return playerUnload();
      case 'construct':
        return sequence(runConstruct);
      case 'retry':
        return retryBuild();
      case 'launch':
        return sequence(runLaunch);
      case 'teach':
        return teach();
      case 'next':
        return sequence(runTransferIntro);
      case 'ask':
        return answerTransfer(value);
      case 'finish':
        return sequence(runFinish);
      case 'replay':
        return reset();
      case 'review':
        reset();
        document.getElementById('review').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
        document.getElementById('review-title').focus({ preventScroll: true });
        return undefined;
      default:
        return undefined;
    }
  }

  function buildWorld() {
    const interp = interpretStory(state.story);
    if (interp.status !== 'ok') {
      commit({ interp, mood: 'puzzled', note: { tone: 'warn', text: interp.message } });
      return;
    }
    // This is the one decision the story makes. Everything after it — labels,
    // world, Robo's mistake, repair mode and transfer — reads this schema.
    commit({ interp, missionId: interp.missionId, firstMissionId: interp.missionId, note: null });
    sequence(runCompile);
  }

  async function runCompile(t) {
    const m = mission();
    commit({
      step: 'compile',
      mood: 'curious',
      bubble: SAY.compile,
      marks: [],
      eq: { missionId: m.id, tags: {}, compiling: true },
      world: freshWorld(),
    });
    await tick(500, t);

    // Each story phrase lights up, flies into its number and names its role.
    for (const term of TERMS) {
      const role = m.roles[term];
      commit({ marks: [...state.marks, role] });
      await flyToken(storySpan(role), eqNumber(term));
      if (t !== epoch) throw new Cancelled();
      flash(eqNumber(term), 'lit');
      commit({ eq: { ...state.eq, tags: { ...state.eq.tags, [term]: 'shown' } } });
      await tick(420, t);
    }

    // The total becomes matter: a beam prints the crystals onto the bay floor.
    fireBeam();
    await tick(260, t);
    for (let i = 1; i <= m.equation.dividend; i += 1) {
      patchWorld((w) => {
        w.pile = i;
        w.pileLabel = `${i} ${i === 1 ? m.item.one : m.item.many}`;
      });
      await tick(55, t);
    }
    patchWorld((w) => {
      w.groups = [{ id: 'blueprint', count: 0, status: 'blueprint', label: `${m.group.one} blueprint` }];
    });
    await tick(700, t);
    commit({ eq: { ...state.eq, compiling: false } });
    await runRoboBuild(t);
  }

  async function runRoboBuild(t) {
    const m = mission();
    const w = roboWorld(m);
    commit({ step: 'robo-build', mood: 'wrong', bubble: sayRoboBuild(m) });
    await beat(1300, t);

    patchWorld((world) => {
      world.groups = Array.from({ length: w.groupCount }, (_, i) => ({ id: `robo${i}`, count: 0, status: '' }));
    });
    await tick(450, t);
    const moves = [];
    for (let i = 0; i < w.groupCount; i += 1) {
      for (let j = 0; j < w.groupSize; j += 1) {
        moves.push(moveFromPile(`robo${i}`, t));
        await tick(90, t);
      }
    }
    await Promise.all(moves);
    const check = checkWorld(m, state.world.groups.map((g) => g.count), state.world.pile);
    patchWorld((world) => {
      world.chips = worldChips(m, check);
      world.pileLabel = check.leftover === 0 ? `All ${m.equation.dividend} used` : '';
    });
    commit({ step: 'verdict', bubble: SAY.verdict });
  }

  async function runScan(t) {
    const m = mission();
    commit({ step: 'scanning', bubble: `Launching ${m.group.one} 1!`, triedYes: true });
    const first = state.world.groups[0];
    if (first) patchWorld((w) => (group(w, first.id).status = 'stall'));
    await tick(600, t);
    aperture.classList.add('warn');
    await tick(900, t);
    aperture.classList.remove('warn');
    if (first) patchWorld((w) => (group(w, first.id).status = ''));
    sweep();
    await tick(700, t);

    const check = checkWorld(m, state.world.groups.map((g) => g.count), state.world.pile);
    patchWorld((w) => {
      w.scan = scannerFor(m, check);
      w.chips = worldChips(m, check, { flag: true });
    });
    commit({ step: 'scan', mood: 'puzzled', bubble: SAY.scan });
  }

  function identify(value) {
    const m = mission();
    if (value === m.roles.divisor) {
      const check = checkWorld(m, state.world.groups.map((g) => g.count), state.world.pile);
      patchWorld((w) => {
        w.chips = worldChips(m, check, { flag: true });
      });
      commit({
        bubble: sayIdentified(m),
        note: { tone: 'good', text: `Yes: ${m.equation.divisor} is ${m.tags[m.roles.divisor]}.` },
      });
      sequence(runUnbuild);
      return;
    }
    const text =
      value === opposite(m.roles.divisor)
        ? `That’s what I thought too! Read your story again: which words sit next to the ${m.equation.divisor}?`
        : `${m.equation.dividend} is the total. Look at the words next to the ${m.equation.divisor}.`;
    commit({ note: { tone: 'warn', text }, glow: m.roles.divisor });
  }

  async function runUnbuild(t) {
    const m = mission();
    commit({ step: 'unbuild', mood: 'curious' });
    await beat(1100, t);

    // Items fly back to the bay floor; Robo's groups dissolve into the shape
    // the learner's story actually asks for.
    const moves = [];
    for (const g of state.world.groups) {
      for (let j = 0; j < g.count; j += 1) {
        moves.push(moveToPile(g.id, t));
        await tick(40, t);
      }
    }
    await Promise.all(moves);
    patchWorld((w) => {
      w.chips = [];
      w.scan = null;
      w.groups.forEach((g) => (g.status = 'leaving'));
    });
    await tick(420, t);
    patchWorld((w) => {
      w.groups = startingGroups(m, 'fix');
      w.pileLabel = `${w.pile} ${m.item.many} in the bay`;
    });
    commit({ step: 'repair', bubble: sayRepair(m), load: 0, pending: 0, note: null, glow: null });
  }

  /* ---------- Player loading (pointer tap, drag, or dock buttons) ---------- */

  function canLoad() {
    const m = mission();
    return (
      (state.step === 'repair' || state.step === 'transfer') &&
      state.world.pile > 0 &&
      state.load + state.pending < m.maxPerGroup
    );
  }

  function loadingGroupId() {
    const g = state.world.groups.find((x) => x.status === 'loading');
    return g ? g.id : null;
  }

  function playerLoad(sourceEl, { fly = true } = {}) {
    if (!canLoad()) {
      if ((state.step === 'repair' || state.step === 'transfer') && state.world.pile > 0) {
        commit({ note: { tone: 'warn', text: `That ${mission().group.one} is full.` } });
      }
      return;
    }
    const m = mission();
    const id = loadingGroupId();
    const from = sourceEl || pileEl.lastElementChild;
    const fromRect = from ? from.getBoundingClientRect() : null;
    if (sourceEl) sourceEl.remove(); // the tapped item itself leaves the pile
    const t = epoch;
    state = { ...state, pending: state.pending + 1, note: null };
    patchWorld((w) => {
      w.pile -= 1;
      w.pileLabel = `${w.pile} ${m.item.many} in the bay`;
    });
    const arrive = () => {
      if (t !== epoch) return;
      state = { ...state, pending: state.pending - 1, load: state.load + 1 };
      patchWorld((w) => (group(w, id).count += 1));
    };
    const cargo = groupCargo(id);
    if (fly && fromRect && cargo) flyItem(fromRect, cargo, m.item).then(arrive);
    else arrive();
  }

  function playerUnload() {
    if (!(state.step === 'repair' || state.step === 'transfer') || state.load < 1) return;
    const m = mission();
    const id = loadingGroupId();
    state = { ...state, load: state.load - 1, note: null };
    patchWorld((w) => {
      group(w, id).count -= 1;
      w.pile += 1;
      w.pileLabel = `${w.pile} ${m.item.many} in the bay`;
    });
  }

  /**
   * One construction step for both missions. The learner loads a single group
   * and the story's mode decides what happens next: repeat that group while
   * items last, or share across the groups the story already fixed.
   */
  async function runConstruct(t) {
    const m = mission();
    const repair = state.step === 'repair';
    if (state.load < 1 || state.pending > 0) return;
    const size = state.load;
    const plan = buildPlan(m, size);
    const prefix = repair ? 'fix' : 'g2';
    commit({ step: repair ? 'repeating' : 'filling', note: null });
    patchWorld((w) => (w.groups[0].status = ''));
    await tick(250, t);

    const moves = [];
    for (let k = 1; k < plan.groups.length; k += 1) {
      let id;
      if (m.mode === 'repeat') {
        id = `${prefix}${k}`;
        patchWorld((w) => w.groups.push({ id, count: 0, status: '' }));
        await tick(120, t);
      } else {
        id = state.world.groups[k].id;
      }
      for (let j = 0; j < plan.groups[k]; j += 1) {
        moves.push(moveFromPile(id, t));
        await tick(m.mode === 'repeat' ? 70 : 60, t);
      }
    }
    await Promise.all(moves);

    const counts = state.world.groups.map((g) => g.count);
    const check = checkWorld(m, counts, state.world.pile);
    patchWorld((w) => {
      w.chips = worldChips(m, check, { flag: !check.pass });
      w.groups.forEach((g) => {
        g.status = check.pass ? 'ok' : m.mode === 'repeat' || g.count !== size ? 'alert' : '';
      });
      w.pileLabel = w.pile === 0 ? `All ${m.equation.dividend} used` : `${w.pile} left in the bay`;
    });

    if (check.pass) {
      commit({
        step: repair ? 'repaired' : 'transfer-pass',
        mood: 'understood',
        bubble: repair ? SAY.repaired : SAY.transferPass,
        note: {
          tone: 'good',
          text: `${check.count} ${m.group.many}, ${check.size} in each, 0 left. That matches the story.`,
        },
      });
    } else {
      const robo = roboWorld(m);
      const again = repair && check.size === robo.groupSize && check.count === robo.groupCount;
      commit({
        step: repair ? 'repair-fail' : 'transfer-fail',
        mood: 'puzzled',
        bubble: again
          ? 'Hey, that’s the world I built!'
          : check.equal && check.leftover > 0
          ? `${cap(m.item.many)} are left in the bay!`
          : check.equal
          ? 'Hmm, that doesn’t match the story.'
          : `Uh-oh, the ${m.group.many} didn’t get the same!`,
        note: { tone: 'warn', text: constructFailText(m, counts, check, repair) },
      });
    }
  }

  function constructFailText(m, counts, check, repair) {
    const want = check.want;
    const robo = roboWorld(m);
    if (repair && check.equal && check.size === robo.groupSize && check.count === robo.groupCount) {
      return `${check.count} ${m.group.many} with ${check.size} in each: that’s my world again! The story says ${want.groupSize} in each ${m.group.one}.`;
    }
    if (!check.equal) {
      const short = counts.map((c, i) => (c < counts[0] ? i + 1 : 0)).filter(Boolean);
      const names = short.map((n) => `${m.group.one} ${n}`).join(', ');
      return `${cap(names)} got less. The ${want.groupCount} ${m.group.many} must share equally.`;
    }
    if (m.mode === 'fill' && check.leftover > 0) {
      return `${check.leftover} ${m.item.many} are still in the bay. Share all ${want.total} across the ${want.groupCount} ${m.group.many}.`;
    }
    const left = check.leftover > 0 ? ` ${check.leftover} ${m.item.many} are left over.` : '';
    return `The story says ${want.groupSize} ${m.item.many} in each ${m.group.one}. These have ${check.size} in each.${left}`;
  }

  function retryBuild() {
    const m = mission();
    const repair = state.step === 'repair-fail';
    if (!repair && state.step !== 'transfer-fail') return;
    patchWorld((w) => {
      w.groups = startingGroups(m, repair ? 'fix' : 'g2');
      w.pile = m.equation.dividend;
      w.pileLabel = `${w.pile} ${m.item.many} in the bay`;
      w.chips = [];
    });
    commit({
      step: repair ? 'repair' : 'transfer',
      load: 0,
      pending: 0,
      mood: 'curious',
      bubble: SAY.retry,
      note: null,
    });
  }

  async function runLaunch(t) {
    const m = mission();
    commit({ step: 'launching', mood: 'understood', bubble: SAY.launch, note: null });
    const ap = aperture.getBoundingClientRect();
    for (const g of state.world.groups) {
      const el = groupsEl.querySelector(`[data-id="${g.id}"]`);
      const r = el ? el.getBoundingClientRect() : ap;
      const dx = ap.left + ap.width / 2 - (r.left + r.width / 2);
      const dy = ap.top + ap.height / 2 - (r.top + r.height / 2);
      patchWorld((w) => Object.assign(group(w, g.id), { status: 'launch', dx, dy }));
      await tick(200, t);
    }
    await tick(900, t);
    aperture.classList.add('flash');
    await beat(700, t);
    aperture.classList.remove('flash');
    const launched = state.world.groups.length;
    const size = state.world.groups[0] ? state.world.groups[0].count : 0;
    patchWorld((w) => {
      w.groups = [];
      w.pileLabel = '';
      w.chips = [
        { text: `${launched} ${m.group.many} launched`, role: ROLE.COUNT, ok: true },
        { text: `${size} in each ${m.group.one}`, role: ROLE.SIZE, ok: true },
        { text: '0 left', role: 'leftover', ok: true },
      ];
    });
    commit({ step: 'teach', mood: 'curious', bubble: SAY.teach, teach: { divisor: null, quotient: null }, wrongSlots: [] });
  }

  function teach() {
    const m = mission();
    const wrong = ['divisor', 'quotient'].filter((k) => state.teach[k] !== m.roles[k]);
    if (wrong.length) {
      const missing = wrong.some((k) => state.teach[k] === null);
      commit({
        wrongSlots: wrong,
        note: {
          tone: 'warn',
          text: missing
            ? 'Fill both blanks for Robo.'
            : `Not quite. Check the mission log: how many ${m.group.many}, and how many in each?`,
        },
      });
      return;
    }
    const d = m.equation.divisor;
    const q = m.equation.quotient;
    commit({
      step: 'taught',
      mood: 'understood',
      wrongSlots: [],
      note: null,
      bubble: `Got it! ${d} was ${saidAs(m, m.roles.divisor)}, and ${q} was ${saidAs(m, m.roles.quotient)}.`,
    });
  }

  async function runTransferIntro(t) {
    // The second mission asks the opposite question to the story the learner
    // wrote, so which one runs depends on that story.
    const m = MISSIONS[TRANSFER_OF[state.firstMissionId]];
    commit({
      step: 'transfer-intro',
      missionId: m.id,
      mood: 'curious',
      bubble: SAY.transferIntro,
      note: null,
      marks: [],
      glow: null,
      load: 0,
      pending: 0,
      eq: { missionId: m.id, tags: {}, compiling: true, morph: true },
      world: freshWorld(),
    });
    await tick(700, t);
    // The known numbers get roles; the quotient's role stays a question.
    for (const term of ['dividend', 'divisor']) {
      commit({ marks: [...state.marks, m.roles[term]] });
      flash(eqNumber(term), 'lit');
      commit({ eq: { ...state.eq, morph: false, tags: { ...state.eq.tags, [term]: 'shown' } } });
      await tick(450, t);
    }
    commit({ eq: { ...state.eq, compiling: false, tags: { ...state.eq.tags, quotient: 'pending' } } });

    const w = intendedWorld(m);
    patchWorld((world) => {
      world.groups = startingGroups(m, 'g2');
    });
    await tick(500, t);
    fireBeam();
    await tick(200, t);
    for (let i = 1; i <= w.total; i += 1) {
      patchWorld((world) => {
        world.pile = i;
        world.pileLabel = `${i} ${m.item.many} in the bay`;
      });
      await tick(32, t);
    }
    commit({ step: 'transfer', bubble: sayTransfer(m) });
  }

  function answerTransfer(value) {
    const m = mission();
    const first = firstMission();
    if (value === m.roles.quotient) {
      commit({
        step: 'transfer-done',
        mood: 'understood',
        marks: [...state.marks, m.roles.quotient],
        eq: { ...state.eq, tags: { ...state.eq.tags, quotient: 'shown' } },
        bubble: `In the ${first.group.one} mission, ${first.equation.quotient} counted ${saidAs(
          first,
          first.roles.quotient,
        )}. Here, ${m.equation.quotient} counts ${saidAs(m, m.roles.quotient)}!`,
        note: null,
      });
      return;
    }
    const w = intendedWorld(m);
    commit({
      note: {
        tone: 'warn',
        text:
          m.roles.quotient === ROLE.SIZE
            ? `Count the ${m.group.many}: there are ${w.groupCount}. Now look inside one ${m.group.one}.`
            : `Look inside one ${m.group.one}: it holds ${w.groupSize}. Now count the ${m.group.many}.`,
      },
    });
  }

  async function runFinish(t) {
    // The rovers roll out so the summary sits on a clear bay.
    commit({ step: 'finishing', note: null });
    patchWorld((w) => {
      w.chips = [];
      w.pileLabel = '';
      w.groups.forEach((g) => (g.status = 'drive'));
    });
    await tick(900, t);
    commit({ step: 'summary', mood: 'understood', bubble: SAY.done, world: freshWorld() });
  }

  /* ---------- World helpers ---------- */

  function worldChips(m, check, { flag = false } = {}) {
    const chips = [
      { text: `${check.count} ${check.count === 1 ? m.group.one : m.group.many}`, role: ROLE.COUNT },
      check.equal
        ? { text: `${check.size} in each ${m.group.one}`, role: ROLE.SIZE }
        : { text: 'not equal', role: ROLE.SIZE, mismatch: `each ${m.group.one} must get the same` },
      { text: `${check.leftover} left`, role: 'leftover' },
    ];
    if (check.pass) chips.forEach((c) => (c.ok = true));
    // Flag the role the story pinned down — that is the one Robo swapped.
    if (flag && check.equal) {
      const told = m.roles.divisor;
      if (told === ROLE.SIZE && !check.sizeMatches) chips[1].mismatch = `story: ${check.want.groupSize} in each`;
      if (told === ROLE.COUNT && !check.countMatches) {
        chips[0].mismatch = `story: ${check.want.groupCount} ${m.group.many}`;
      }
    }
    return chips;
  }

  /** The scanner compares the one thing the story fixed. */
  function scannerFor(m, check) {
    const told = m.roles.divisor;
    return told === ROLE.SIZE
      ? { story: `${check.want.groupSize} in each ${m.group.one}`, world: `${check.size} in each ${m.group.one}` }
      : { story: `${check.want.groupCount} ${m.group.many}`, world: `${check.count} ${m.group.many}` };
  }

  async function moveFromPile(groupId, t) {
    const m = mission();
    const from = pileEl.lastElementChild;
    const fromRect = from ? from.getBoundingClientRect() : null;
    patchWorld((w) => (w.pile -= 1));
    const cargo = groupCargo(groupId);
    if (fromRect && cargo) await flyItem(fromRect, cargo, m.item);
    if (t !== epoch) return;
    patchWorld((w) => {
      const g = group(w, groupId);
      if (g) g.count += 1;
    });
  }

  async function moveToPile(groupId, t) {
    const m = mission();
    const cargo = groupCargo(groupId);
    const fromRect = cargo && cargo.lastElementChild ? cargo.lastElementChild.getBoundingClientRect() : null;
    patchWorld((w) => (group(w, groupId).count -= 1));
    if (fromRect) await flyItem(fromRect, pileEl, m.item);
    if (t !== epoch) return;
    patchWorld((w) => (w.pile += 1));
  }

  /* ================================================================== */
  /* 5. View: rendering and animation                                    */
  /* ================================================================== */

  const $ = (id) => document.getElementById(id);
  const eqCard = $('eq-card');
  const bubbleEl = $('bubble');
  const roboEl = $('robo');
  const worldEl = $('world');
  const worldDesc = $('world-desc');
  const scanEl = $('scan');
  const chipsEl = $('chips');
  const groupsEl = $('groups');
  const pileEl = $('pile');
  const pileLabelEl = $('pile-label');
  const dockEl = $('dock');
  const summaryEl = $('summary');
  const liveEl = $('live');
  const aperture = $('aperture');
  const missionCountEl = $('mission-count');

  const last = { step: null, eq: '', chips: '', scan: '', dock: '', summary: '', bubble: '', live: '' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function icon(item, cls) {
    return `<svg class="${cls}" viewBox="${item.viewBox}" aria-hidden="true" focusable="false"><use href="#${item.icon}"/></svg>`;
  }

  function render() {
    const stepChanged = state.step !== last.step;
    renderEquation();
    renderBubble();
    roboEl.dataset.mood = state.mood;
    renderWorld();
    renderSummary();
    renderDock(stepChanged);
    renderLive(stepChanged);
    missionCountEl.textContent =
      state.step === 'summary' ? 'Review' : onTransfer() ? 'Mission 2 of 2' : 'Mission 1 of 2';
    last.step = state.step;
  }

  function renderEquation() {
    const m = MISSIONS[state.eq.missionId];
    const { tags } = state.eq;
    if (last.eq !== m.id) {
      const term = (k) => `<span class="eq-term" data-term="${k}"><span class="eq-num">${m.equation[k]}</span></span>`;
      eqCard.innerHTML = `<div class="eq-row">${term('dividend')}<span class="eq-op" aria-hidden="true">÷</span>${term(
        'divisor',
      )}<span class="eq-op" aria-hidden="true">=</span>${term('quotient')}</div>`;
      last.eq = m.id;
    }
    // Update each role tag on its own so earlier tags do not re-animate.
    for (const k of TERMS) {
      const termEl = eqCard.querySelector(`[data-term="${k}"]`);
      const want = tags[k] || '';
      if (termEl.dataset.tag === want) continue;
      termEl.dataset.tag = want;
      const old = termEl.querySelector('.role-tag');
      if (old) old.remove();
      const role = m.roles[k];
      if (want === 'shown') {
        termEl.insertAdjacentHTML('beforeend', `<span class="role-tag r-${role}">${esc(m.tags[role])}</span>`);
      } else if (want === 'pending') {
        termEl.insertAdjacentHTML('beforeend', '<span class="role-tag pending">counts ?</span>');
      }
    }
    const e = m.equation;
    const roles = TERMS.filter((k) => tags[k] === 'shown').map((k) => `${e[k]} is ${m.tags[m.roles[k]]}`);
    eqCard.setAttribute(
      'aria-label',
      `Equation: ${e.dividend} divided by ${e.divisor} equals ${e.quotient}.${roles.length ? ` ${roles.join('; ')}.` : ''}`,
    );
    eqCard.classList.toggle('compiling', !!state.eq.compiling);
    if (state.eq.morph && !eqCard.classList.contains('morph')) {
      eqCard.classList.add('morph');
      setTimeout(() => eqCard.classList.remove('morph'), 800);
    }
  }

  function renderBubble() {
    if (state.bubble === last.bubble) return;
    bubbleEl.textContent = state.bubble;
    bubbleEl.classList.remove('pop');
    void bubbleEl.offsetWidth; // restart the pop animation
    bubbleEl.classList.add('pop');
    roboEl.classList.remove('bounce');
    void roboEl.offsetWidth;
    roboEl.classList.add('bounce');
    last.bubble = state.bubble;
  }

  function renderWorld() {
    const m = mission();
    const w = state.world;

    // Scanner comparison: text + ≠ symbol, never colour alone.
    const scanHtml = w.scan
      ? `<span class="scan-title">MISSION SCAN</span><span>Story: <b>${esc(w.scan.story)}</b></span><span class="scan-neq" aria-label="does not match">≠</span><span>World: <b>${esc(
          w.scan.world,
        )}</b></span>`
      : '';
    if (scanHtml !== last.scan) {
      scanEl.innerHTML = scanHtml;
      scanEl.hidden = !scanHtml;
      last.scan = scanHtml;
    }

    const chipsHtml = w.chips
      .map((c) => {
        const cls = c.mismatch ? 'mismatch' : c.ok ? 'ok' : c.role === 'leftover' ? 'r-leftover' : `r-${c.role}`;
        const mark = c.mismatch ? '<span class="mark" aria-hidden="true">≠</span>' : c.ok ? '<span class="mark" aria-hidden="true">✓</span>' : '';
        const note = c.mismatch ? `<span class="note">(${esc(c.mismatch)})</span>` : '';
        return `<span class="chip ${cls}">${mark}${esc(c.text)}${note}</span>`;
      })
      .join('');
    if (chipsHtml !== last.chips) {
      chipsEl.innerHTML = chipsHtml;
      last.chips = chipsHtml;
    }

    // Groups (ships or rovers): keyed reconcile so existing ones keep state.
    const n = w.groups.length;
    const cols = Math.max(1, narrowQuery.matches ? (n <= 5 ? n : 4) : Math.min(n, 6));
    groupsEl.style.setProperty('--cols', String(cols));
    const seen = new Set();
    for (const g of w.groups) {
      seen.add(g.id);
      let el = groupsEl.querySelector(`[data-id="${g.id}"]`);
      if (!el) {
        el = document.createElement('div');
        el.dataset.id = g.id;
        el.innerHTML = `<div class="cargo"></div><svg class="hull" viewBox="${m.group.viewBox}" aria-hidden="true" focusable="false"><use href="#${m.group.icon}"/></svg><span class="group-count"></span>`;
        el.addEventListener('animationend', (e) => {
          if (e.animationName === 'materialize') el.dataset.settled = '1';
        });
        groupsEl.appendChild(el);
      }
      const enter = el.dataset.settled || reduced() ? '' : ' enter';
      el.className = `group ${m.group.kind}${enter}${g.status ? ` ${g.status}` : ''}`;
      if (g.dx !== undefined) {
        el.style.setProperty('--dx', `${g.dx}px`);
        el.style.setProperty('--dy', `${g.dy}px`);
      }
      const cargo = el.firstElementChild;
      while (cargo.children.length > g.count) cargo.lastElementChild.remove();
      while (cargo.children.length < g.count) {
        cargo.insertAdjacentHTML('beforeend', icon(m.item, 'mini snap'));
      }
      const label = g.label || `${g.count}`;
      const countEl = el.lastElementChild;
      if (countEl.textContent !== label) countEl.textContent = label;
    }
    for (const el of [...groupsEl.children]) {
      if (!seen.has(el.dataset.id)) el.remove();
    }

    // Loose items on the bay floor. Pointer targets only; the dock buttons
    // are the keyboard and screen-reader path for the same actions.
    const kind = m.item.one === 'crystal' ? 'crystal' : 'battery';
    while (pileEl.children.length > w.pile) pileEl.lastElementChild.remove();
    while (pileEl.children.length < w.pile) {
      pileEl.insertAdjacentHTML(
        'beforeend',
        `<button type="button" class="item ${kind}" tabindex="-1" aria-hidden="true">${icon(m.item, '')}</button>`,
      );
    }
    for (const el of pileEl.children) {
      if (!el.classList.contains(kind)) el.className = `item ${kind}`;
    }
    pileEl.classList.toggle('active', canLoad());
    if (pileLabelEl.textContent !== w.pileLabel) pileLabelEl.textContent = w.pileLabel;

    worldDesc.textContent = describeWorld(m, w);
  }

  function describeWorld(m, w) {
    const parts = [];
    const real = w.groups.filter((g) => g.status !== 'blueprint');
    if (real.length) {
      const counts = real.map((g) => g.count);
      const same = counts.every((c) => c === counts[0]);
      parts.push(
        same
          ? `${real.length} ${m.group.many} with ${counts[0]} ${m.item.many} in each.`
          : `${real.length} ${m.group.many} holding ${counts.join(', ')} ${m.item.many}.`,
      );
    }
    if (w.pile) parts.push(`${w.pile} ${m.item.many} on the bay floor.`);
    if (w.scan) parts.push(`Scanner: story says ${w.scan.story}; world has ${w.scan.world}.`);
    return parts.join(' ') || 'The bay is empty.';
  }

  function storyHTML(text, spans, marks, glow) {
    let out = '';
    let i = 0;
    for (const s of spans) {
      out += esc(text.slice(i, s.start));
      const on = marks.includes(s.role) ? ' on' : '';
      const g = glow === s.role ? ' glow' : '';
      out += `<mark class="r-${s.role}${on}${g}" data-role="${s.role}">${esc(text.slice(s.start, s.end))}</mark>`;
      i = s.end;
    }
    return out + esc(text.slice(i));
  }

  function storyQuote() {
    if (onTransfer()) {
      const m = mission();
      return `<p class="story-quote"><span class="who">Mission 2 story</span>${storyHTML(
        m.story,
        findSpans(m.story, m.spanRules),
        state.marks,
        null,
      )}</p>`;
    }
    const spans = state.interp && state.interp.status === 'ok' ? state.interp.spans : [];
    return `<p class="story-quote"><span class="who">Your story</span>${storyHTML(state.story, spans, state.marks, state.glow)}</p>`;
  }

  function noteHTML() {
    const n = state.note;
    return `<p class="hint${n ? ` ${n.tone}` : ''}" role="${n && n.tone === 'warn' ? 'alert' : 'status'}">${n ? esc(n.text) : ''}</p>`;
  }

  function btn(action, label, { cls = '', value = '', key = action, autofocus = false, disabled = false, pressed = null } = {}) {
    return `<button type="button" class="btn ${cls}${pressed ? ' on' : ''}" data-action="${action}"${
      value ? ` data-value="${value}"` : ''
    } data-key="${key}"${pressed === null ? '' : ` aria-pressed="${pressed}"`}${autofocus ? ' data-autofocus' : ''}${
      disabled ? ' disabled' : ''
    }>${label}</button>`;
  }

  function dockHTML() {
    const m = mission();
    const s = state;
    const status = (text) => `<p class="status" role="status">${esc(text)}</p>`;
    switch (s.step) {
      case 'arrive':
        return btn('forge', 'Forge a mission', { cls: 'primary big', autofocus: true });
      case 'forge':
        return `<div class="forge">
            <label for="story">Your mission story for 12 ÷ 3 = 4</label>
            <div class="forge-examples" role="group" aria-label="Example stories">
              <span class="forge-examples-label">Try a meaning:</span>
              ${FIRST_IDS.map((id) =>
                btn('example', esc(MISSIONS[id].exampleLabel), {
                  cls: 'quiet small',
                  value: id,
                  key: `ex-${id}`,
                  pressed: s.story === MISSIONS[id].example,
                }),
              ).join('')}
            </div>
            <textarea id="story" data-key="story" rows="2" spellcheck="false" data-autofocus>${esc(s.story)}</textarea>
            <div class="forge-actions">
              ${btn('build', 'Build my world', { cls: 'primary' })}
            </div>
          </div>${noteHTML()}`;
      case 'compile':
      case 'robo-build':
        return `${storyQuote()}${status(s.step === 'compile' ? 'Compiling your story into a world' : 'Robo is building')}${
          s.interp && s.interp.status === 'ok'
            ? `<p class="match-note">Local script read this as: ${esc(s.interp.reading)}. No AI is running.</p>`
            : ''
        }`;
      case 'verdict':
        // Both answers look the same so the styling does not give the answer away.
        return `${storyQuote()}${btn('yes', 'Yes, launch', { autofocus: true })}${btn('no', 'No, debug it')}`;
      case 'scanning':
        return status(`Launching ${m.group.one} 1`);
      case 'scan':
        return `${storyQuote()}${btn('debug', 'Debug it', { cls: 'primary', autofocus: true })}`;
      case 'identify': {
        const opts = [ROLE.COUNT, ROLE.SIZE, ROLE.TOTAL]
          .map((r, i) => btn('identify', esc(m.tags[r]), { value: r, key: `id-${r}`, autofocus: i === 0 }))
          .join('');
        return `${storyQuote()}<p class="prompt" id="dock-prompt">In your story, what does the ${
          m.equation.divisor
        } count?</p><div class="options" role="group" aria-labelledby="dock-prompt">${opts}</div>${noteHTML()}`;
      }
      case 'unbuild':
        return `${noteHTML()}${status('Robo is taking the world apart')}`;
      case 'repair':
      case 'transfer': {
        const whose = s.step === 'repair' ? 'your story' : 'the story';
        // The story's meaning decides both the prompt and the build action.
        const prompt =
          m.mode === 'repeat'
            ? `Load one ${m.group.one} the way ${whose} says. Then repeat it.`
            : `Load ${m.group.one} 1 the way ${whose} says, then fill every ${m.group.one} the same.`;
        const loadLabel = `+ Load a ${m.item.one}`;
        const finish = btn(
          'construct',
          m.mode === 'repeat' ? 'Repeat this group' : `Fill every ${m.group.one} the same`,
          { cls: 'primary', key: 'construct', disabled: s.load < 1 || s.pending > 0 },
        );
        return `${storyQuote()}<p class="prompt">${esc(prompt)}</p>
          ${btn('unload', '− Take one out', { disabled: s.load < 1 })}
          ${btn('load', esc(loadLabel), { autofocus: true, disabled: !canLoad() })}
          ${finish}
          <p class="hint${s.note ? ` ${s.note.tone}` : ''}" role="status">${esc(
            s.note ? s.note.text : `Tip: tap or drag ${m.item.many} into the glowing ${m.group.one}.`,
          )}</p>`;
      }
      case 'repeating':
      case 'filling':
        return status(m.mode === 'repeat' ? 'Repeating your group' : `Filling every ${m.group.one}`);
      case 'finishing':
        return status('Mission complete');
      case 'repair-fail':
      case 'transfer-fail':
        return `${noteHTML()}${btn('retry', 'Try again', { cls: 'primary', autofocus: true })}`;
      case 'repaired':
        return `${noteHTML()}${btn('launch', 'Launch mission', { cls: 'primary big', autofocus: true })}`;
      case 'launching':
        return status('Launching');
      case 'teach': {
        const choices = [ROLE.SIZE, ROLE.COUNT, ROLE.TOTAL];
        const slot = (term) => {
          const n = m.equation[term];
          const wrong = s.wrongSlots.includes(term) ? ' wrong' : '';
          const radios = choices
            .map(
              (r) =>
                `<label class="choice"><input type="radio" name="slot-${term}" value="${r}" data-key="slot-${term}-${r}"${
                  s.teach[term] === r ? ' checked' : ''
                }${term === 'divisor' && r === choices[0] ? ' data-autofocus' : ''}><span>${esc(m.phrases[r])}</span></label>`,
            )
            .join('');
          return `<fieldset class="slot${wrong}"><legend>${n} was</legend>${radios}</fieldset>`;
        };
        return `<div class="sentence">${slot('divisor')}${slot('quotient')}</div>
          ${noteHTML()}
          ${btn('teach', 'Teach Robo', { cls: 'primary' })}
          <details class="dev-note"><summary>Review note: where real AI would go</summary>
            <p>This step uses fixed choices. A real version would let the learner explain in their own words, interpret that explanation, and ask one grounded clarifying question. None of that runs here.</p>
          </details>`;
      }
      case 'taught':
        return btn('next', 'Next mission →', { cls: 'primary big', autofocus: true });
      case 'transfer-intro':
        return `${storyQuote()}${status('New mission incoming')}`;
      case 'transfer-pass': {
        const opts = [ROLE.COUNT, ROLE.SIZE]
          .map((r, i) => btn('ask', esc(m.phrases[r]), { value: r, key: `ask-${r}`, autofocus: i === 0 }))
          .join('');
        return `${storyQuote()}<p class="prompt" id="dock-prompt">This time, what did the 4 count?</p><div class="options" role="group" aria-labelledby="dock-prompt">${opts}</div>${noteHTML()}`;
      }
      case 'transfer-done':
        return `${storyQuote()}${btn('finish', 'Finish', { cls: 'primary big', autofocus: true })}`;
      case 'summary':
        return '';
      default:
        return '';
    }
  }

  function renderDock(stepChanged) {
    const html = `<div class="dock-inner">${dockHTML()}</div>`;
    if (html === last.dock) return;
    const focusedKey =
      document.activeElement && dockEl.contains(document.activeElement)
        ? document.activeElement.getAttribute('data-key')
        : null;
    dockEl.innerHTML = html;
    last.dock = html;
    let target = null;
    if (focusedKey && !stepChanged) target = dockEl.querySelector(`[data-key="${focusedKey}"]`);
    if (!target && stepChanged && last.step !== null) {
      target = dockEl.querySelector('[data-autofocus]') || summaryEl.querySelector('[data-autofocus]');
    }
    if (target && !target.disabled) {
      target.focus({ preventScroll: true });
    } else if (focusedKey && !stepChanged) {
      // The focused control became disabled (e.g. pile empty): keep keyboard
      // users inside the dock on the next useful control.
      const fallback = dockEl.querySelector('button:not(:disabled)');
      if (fallback) fallback.focus({ preventScroll: true });
    }
  }

  function renderSummary() {
    let html = '';
    if (state.step === 'summary') {
      const row = (m) => {
        const role = m.roles.quotient;
        const kind = role === ROLE.COUNT ? 'number of groups' : 'group size';
        return `<li><span class="eq">${m.equation.dividend} ÷ ${m.equation.divisor} = ${m.equation.quotient}</span><span>${
          m.equation.quotient
        } → <b class="r-${role}">${esc(m.phrases[role])}</b> <span class="kind">(${kind})</span></span></li>`;
      };
      html = `<h2 id="summary-title">You taught Robo: division can ask for group size or number of groups.</h2>
        <ul class="summary-rows">${row(firstMission())}${row(MISSIONS[TRANSFER_OF[state.firstMissionId]])}</ul>
        <div class="dock-inner">
          ${btn('replay', 'Replay', { cls: 'primary', autofocus: true })}
          ${btn('review', 'Back to concept review')}
        </div>
        <p class="summary-badge">Scripted concept prototype — no runtime AI</p>`;
    }
    if (html === last.summary) return;
    summaryEl.innerHTML = html;
    summaryEl.hidden = !html;
    last.summary = html;
  }

  function renderLive(stepChanged) {
    let msg = '';
    if (stepChanged && !BUSY.has(state.step)) {
      const prompt = dockEl.querySelector('.prompt');
      msg = `Robo: ${state.bubble}${prompt ? ` ${prompt.textContent}` : ''}`;
    } else if (state.note && !stepChanged) {
      msg = state.note.text;
    }
    if (msg && msg !== last.live) {
      liveEl.textContent = msg;
      last.live = msg;
    }
  }

  /* ---------- Element lookups for animation ---------- */

  function eqNumber(term) {
    return eqCard.querySelector(`[data-term="${term}"] .eq-num`);
  }

  function storySpan(role) {
    return dockEl.querySelector(`.story-quote mark[data-role="${role}"]`);
  }

  function groupCargo(id) {
    const el = groupsEl.querySelector(`[data-id="${id}"]`);
    return el ? el.querySelector('.cargo') : null;
  }

  /* ---------- Animation helpers (visual only; never touch mission data) ---------- */

  /** Resolves when a Web Animation ends, or after a timeout if the tab is hidden. */
  function settle(anim, el, ms) {
    const done = () => el.remove();
    return Promise.race([anim.finished.catch(() => {}), new Promise((r) => setTimeout(r, ms + 250))]).then(done);
  }

  function flash(el, cls) {
    if (!el || reduced()) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function flyItem(fromRect, toEl, item, duration = 360) {
    if (reduced() || !fromRect || !toEl) return Promise.resolve();
    const to = toEl.getBoundingClientRect();
    const wrap = document.createElement('div');
    wrap.className = 'flyer';
    wrap.innerHTML = icon(item, '');
    const w = 24;
    const h = 30;
    Object.assign(wrap.style, {
      left: `${fromRect.left + fromRect.width / 2 - w / 2}px`,
      top: `${fromRect.top + fromRect.height / 2 - h / 2}px`,
      width: `${w}px`,
      height: `${h}px`,
    });
    wrap.firstElementChild.setAttribute('width', w);
    wrap.firstElementChild.setAttribute('height', h);
    document.body.appendChild(wrap);
    const dx = to.left + to.width / 2 - (fromRect.left + fromRect.width / 2);
    const dy = to.top + to.height / 2 - (fromRect.top + fromRect.height / 2);
    const anim = wrap.animate(
      [
        { transform: 'translate(0, 0) scale(1)' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 36}px) scale(1.2)`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.8)` },
      ],
      { duration, easing: 'ease-in-out' },
    );
    return settle(anim, wrap, duration);
  }

  function flyToken(fromEl, toEl) {
    if (reduced() || !fromEl || !toEl) return Promise.resolve();
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();
    const token = document.createElement('div');
    token.className = 'flyer';
    token.textContent = fromEl.textContent;
    Object.assign(token.style, {
      left: `${a.left}px`,
      top: `${a.top}px`,
      padding: '2px 8px',
      borderRadius: '8px',
      background: 'rgba(79, 227, 255, 0.25)',
      border: '1px solid rgba(79, 227, 255, 0.8)',
      color: '#ffffff',
      fontWeight: '800',
      whiteSpace: 'nowrap',
    });
    document.body.appendChild(token);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const anim = token.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0.2 },
      ],
      { duration: 620, easing: 'cubic-bezier(0.5, 0, 0.3, 1)' },
    );
    return settle(anim, token, 620);
  }

  function fireBeam() {
    if (reduced()) return;
    const a = eqCard.getBoundingClientRect();
    const b = pileEl.getBoundingClientRect();
    const beam = document.createElement('div');
    beam.className = 'beam';
    const cx = b.left + b.width / 2;
    Object.assign(beam.style, {
      left: `${cx - 130}px`,
      top: `${a.bottom}px`,
      width: '260px',
      height: `${Math.max(40, b.bottom - a.bottom)}px`,
    });
    document.body.appendChild(beam);
    setTimeout(() => beam.remove(), 1300);
  }

  function sweep() {
    if (reduced()) return;
    const r = worldEl.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = 'scan-sweep';
    Object.assign(el.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  function paintStars() {
    const stars = document.querySelector('.stars');
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    let html = '';
    for (let i = 0; i < 70; i += 1) {
      const size = rand() < 0.85 ? 1.5 : 2.5;
      html += `<span class="star" style="left:${(rand() * 100).toFixed(2)}%;top:${(rand() * 70).toFixed(2)}%;width:${size}px;height:${size}px;opacity:${(
        0.25 + rand() * 0.6
      ).toFixed(2)}"></span>`;
    }
    stars.innerHTML = html;
  }

  /* ---------- Input wiring ---------- */

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-action]');
    if (!b || b.disabled) return;
    act(b.dataset.action, b.dataset.value);
  });

  dockEl.addEventListener('input', (e) => {
    if (e.target.id === 'story') state = { ...state, story: e.target.value };
  });

  dockEl.addEventListener('keydown', (e) => {
    if (e.target.id === 'story' && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      act('build');
    }
  });

  dockEl.addEventListener('change', (e) => {
    const input = e.target;
    if (input.type !== 'radio') return;
    const term = input.name.replace('slot-', '');
    commit({
      teach: { ...state.teach, [term]: input.value },
      wrongSlots: state.wrongSlots.filter((k) => k !== term),
      note: null,
    });
  });

  // Tap or drag pile items into the glowing group.
  let drag = null;
  let suppressClick = false;

  pileEl.addEventListener('pointerdown', (e) => {
    const item = e.target.closest('.item');
    if (!item || !canLoad()) return;
    drag = { item, id: e.pointerId, x: e.clientX, y: e.clientY, active: false, ghost: null, over: null };
    item.setPointerCapture(e.pointerId);
  });

  pileEl.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.active && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) {
      drag.active = true;
      drag.ghost = document.createElement('div');
      drag.ghost.className = 'ghost';
      drag.ghost.innerHTML = icon(mission().item, '');
      document.body.appendChild(drag.ghost);
      drag.item.style.visibility = 'hidden';
    }
    if (!drag.active) return;
    drag.ghost.style.left = `${e.clientX}px`;
    drag.ghost.style.top = `${e.clientY}px`;
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const target = under ? under.closest('.group.loading') : null;
    if (drag.over && drag.over !== target) drag.over.classList.remove('drop-hover');
    if (target) target.classList.add('drop-hover');
    drag.over = target;
  });

  function endDrag() {
    if (!drag) return;
    if (drag.ghost) drag.ghost.remove();
    if (drag.over) drag.over.classList.remove('drop-hover');
    if (drag.item) drag.item.style.visibility = '';
    drag = null;
  }

  pileEl.addEventListener('pointerup', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { active, over, item } = drag;
    endDrag();
    if (active) {
      suppressClick = true;
      if (over) playerLoad(item, { fly: false });
    }
  });

  pileEl.addEventListener('pointercancel', endDrag);

  pileEl.addEventListener('click', (e) => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    const item = e.target.closest('.item');
    if (item) playerLoad(item);
  });

  narrowQuery.addEventListener('change', render);

  // Read-only hook for the evidence-capture script; it cannot change state.
  Object.defineProperty(window, '__missionForge', {
    value: Object.freeze({
      step: () => state.step,
      busy: () => BUSY.has(state.step) || state.pending > 0,
      world: () => JSON.parse(JSON.stringify(state.world)),
      missionId: () => state.missionId,
      firstMissionId: () => state.firstMissionId,
      mode: () => (state.missionId ? MISSIONS[state.missionId].mode : null),
      roles: () => (state.missionId ? { ...MISSIONS[state.missionId].roles } : null),
      read: (text) => {
        const r = interpretStory(text);
        return r.status === 'ok' ? { status: 'ok', missionId: r.missionId, reading: r.reading } : { status: r.status };
      },
    }),
  });

  paintStars();
  render();
})();
