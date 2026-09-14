import { describe, expect, it } from 'vitest';
import { bankExample } from '../src/ai/erroneous.ts';
import { predictedByL, predictedByS, type Item } from '../src/engine/items.ts';
import { MAX_ERRONEOUS_EXAMPLES, Session } from '../src/engine/state.ts';

type Responder = (item: Item) => boolean;

const asL: Responder = (item) => predictedByL(item);
const asS: Responder = (item) => predictedByS(item);
const asExpert: Responder = (item) => item.target.t > item.anchor.t;
/** A scatter-guesser: drops on a side without reading the numbers. */
const guessing = (): Responder => {
  let n = 0;
  return () => n++ % 3 === 0;
};

function dropSide(session: Session, treatTargetAsLarger: boolean): void {
  const item = session.currentItem();
  if (!item) throw new Error('no item');
  const placed = item.anchor.t + (treatTargetAsLarger ? 60 : -60);
  session.drop(Math.min(1000, Math.max(0, placed)));
}

/**
 * Play a whole placement round. The responder decides once per item; retries
 * repeat the same answer until the ladder auto-advances.
 */
function playRound(session: Session, responder: Responder): void {
  const guard = 60;
  let steps = 0;
  while (session.isPlacementPhase() && session.currentItem() && steps < guard) {
    const item = session.currentItem()!;
    const answer = responder(item);
    while (session.currentItem()?.id === item.id && steps < guard) {
      dropSide(session, answer);
      steps += 1;
    }
  }
}

function newSession(): Session {
  return new Session({ seed: 20260908 });
}

describe('state machine', () => {
  it('runs PROFILE -> PLACE -> INFER for an L learner', () => {
    const s = newSession();
    expect(s.phase).toBe('PROFILE');
    s.start('maya');
    expect(s.phase).toBe('PLACE');
    playRound(s, asL);
    expect(s.phase).toBe('INFER');
    expect(s.inference?.code).toBe('L');
  });

  it('A skips straight to TRANSFER', () => {
    const s = newSession();
    s.start('expert');
    playRound(s, asExpert);
    expect(s.inference?.code).toBe('A');
    s.leaveInfer();
    expect(s.phase).toBe('TRANSFER');
  });

  it('U goes to WORKED, then a second short PLACE round', () => {
    const s = newSession();
    s.start('guesser');
    playRound(s, guessing());
    expect(s.inference?.code).toBe('U');
    s.leaveInfer();
    expect(s.phase).toBe('WORKED');
    s.leaveWorked();
    expect(s.phase).toBe('PLACE');
    expect(s.queuePosition().total).toBe(4);
  });

  it('a second unclear round ends in TRANSFER rather than looping', () => {
    const s = newSession();
    s.start('guesser');
    playRound(s, guessing());
    s.leaveInfer();
    s.leaveWorked();
    playRound(s, guessing());
    expect(s.phase).toBe('INFER');
    s.leaveInfer();
    expect(s.phase).toBe('TRANSFER');
  });

  it('L goes ZOOM -> WHY -> ERRONEOUS -> TRANSFER on a valid correction', () => {
    const s = newSession();
    s.start('maya');
    playRound(s, asL);
    s.leaveInfer();
    expect(s.phase).toBe('ZOOM');
    expect(s.diagnosticPlacement()?.item.type).toBe('T1');
    s.leaveZoom();
    expect(s.phase).toBe('WHY');
    s.applyWhyLabel('L', '45 is bigger than 8', 'keyword');
    expect(s.phase).toBe('ERRONEOUS');
    expect(s.erroneousTask?.rule).toBe('L');
    s.applyCorrectionLabel('VALID', 'keyword');
    expect(s.phase).toBe('TRANSFER');
  });

  it('S learners get an S-rule erroneous example', () => {
    const s = newSession();
    s.start('sam');
    playRound(s, asS);
    expect(s.inference?.code).toBe('S');
    s.leaveInfer();
    s.leaveZoom();
    s.applyWhyLabel('S', 'more digits means tiny bits so it is smaller', 'keyword');
    expect(s.erroneousTask?.rule).toBe('S');
    expect(s.erroneousTask?.item.type).toBe('T2');
  });

  it('SLIP at WHY skips straight to TRANSFER', () => {
    const s = newSession();
    s.start('maya');
    playRound(s, asL);
    s.leaveInfer();
    s.leaveZoom();
    s.applyWhyLabel('SLIP', 'oops wrong spot', 'keyword');
    expect(s.phase).toBe('TRANSFER');
  });

  it('GUESS at WHY goes to WORKED, then ERRONEOUS', () => {
    const s = newSession();
    s.start('maya');
    playRound(s, asL);
    s.leaveInfer();
    s.leaveZoom();
    s.applyWhyLabel('GUESS', 'idk', 'keyword');
    expect(s.phase).toBe('WORKED');
    s.leaveWorked();
    expect(s.phase).toBe('ERRONEOUS');
  });

  it('UNCLEAR at WHY also goes to WORKED first', () => {
    const s = newSession();
    s.start('maya');
    playRound(s, asL);
    s.leaveInfer();
    s.leaveZoom();
    s.applyWhyLabel('UNCLEAR', '', 'empty');
    expect(s.phase).toBe('WORKED');
  });

  it('MONEY at WHY leads to an erroneous example built on the placement rule', () => {
    const s = newSession();
    s.start('maya');
    playRound(s, asL);
    s.leaveInfer();
    s.leaveZoom();
    s.applyWhyLabel('MONEY', '0.45 dollars is more', 'keyword');
    expect(s.phase).toBe('ERRONEOUS');
    expect(s.erroneousTask?.rule).toBe('L');
  });

  it('shows at most two erroneous examples, then moves on anyway', () => {
    const s = newSession();
    s.start('maya');
    playRound(s, asL);
    s.leaveInfer();
    s.leaveZoom();
    s.applyWhyLabel('L', '45 beats 8', 'keyword');
    const first = s.erroneousTask?.item.id;
    s.applyCorrectionLabel('UNCLEAR', 'keyword');
    expect(s.phase).toBe('ERRONEOUS');
    expect(s.erroneousShown).toBe(MAX_ERRONEOUS_EXAMPLES);
    expect(s.erroneousTask?.item.id).not.toBe(first);
    s.applyCorrectionLabel('UNCLEAR', 'keyword');
    expect(s.phase).toBe('TRANSFER');
  });

  it('ends at SUMMARY after the transfer round', () => {
    const s = newSession();
    s.start('expert');
    playRound(s, asExpert);
    s.leaveInfer();
    expect(s.phase).toBe('TRANSFER');
    const guard = 40;
    let steps = 0;
    while (s.phase === 'TRANSFER' && s.currentItem() && steps < guard) {
      const item = s.currentItem()!;
      const placed =
        item.target.t === item.anchor.t
          ? item.anchor.t
          : item.anchor.t + (item.target.t > item.anchor.t ? 60 : -60);
      s.drop(placed);
      steps += 1;
    }
    expect(s.phase).toBe('SUMMARY');
    expect(s.mastery().mastered).toBe(true);
  });
});

describe('feedback ladder', () => {
  it('climbs one level per wrong attempt and advances after three', () => {
    const s = newSession();
    s.start('maya');
    const item = s.currentItem()!;
    const wrongSide = item.target.t > item.anchor.t ? -60 : 60;
    const a = s.drop(item.anchor.t + wrongSide);
    expect(a).toMatchObject({ correct: false, feedbackLevel: 1, advanced: false });
    const b = s.drop(item.anchor.t + wrongSide);
    expect(b).toMatchObject({ correct: false, feedbackLevel: 2, advanced: false });
    const c = s.drop(item.anchor.t + wrongSide);
    expect(c).toMatchObject({ correct: false, feedbackLevel: 3, advanced: true });
    expect(s.currentItem()?.id).not.toBe(item.id);
  });

  it('a retry after a wrong first attempt does not change the rule code', () => {
    const s = newSession();
    s.start('maya');
    while (s.phase === 'PLACE' && s.currentItem()) {
      const item = s.currentItem()!;
      const lSide = predictedByL(item) ? 60 : -60;
      s.drop(item.anchor.t + lSide);
      if (s.currentItem()?.id === item.id) {
        // retry correctly
        const trueSide = item.target.t > item.anchor.t ? 60 : -60;
        s.drop(item.anchor.t + trueSide);
      }
    }
    expect(s.inference?.code).toBe('L');
  });
});

describe('erroneous example wiring', () => {
  it('every authored bank entry exists for the tasks the engine picks', () => {
    for (const rule of ['L', 'S'] as const) {
      for (let i = 0; i < 6; i += 1) {
        const s = newSession();
        const task = s.erroneousTaskFor(rule, i);
        expect(() => bankExample(task)).not.toThrow();
      }
    }
  });

  it('records the model or fallback path for the summary screen', () => {
    const s = newSession();
    s.start('maya');
    playRound(s, asL);
    s.leaveInfer();
    s.leaveZoom();
    s.applyWhyLabel('L', '45 beats 8', 'keyword');
    expect(s.modelUsed).toBe(false);
    s.setErroneousExample(bankExample(s.erroneousTask!), 'bank');
    expect(s.erroneousSource).toBe('bank');
    s.setErroneousExample({ peerClaim: 'x', peerReason: 'y' }, 'model');
    expect(s.modelUsed).toBe(true);
  });
});
