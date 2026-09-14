import { describe, expect, it } from 'vitest';
import {
  AUTHORED_BANK,
  bankExample,
  buildTask,
  L_TASK_ITEMS,
  pickTask,
  S_TASK_ITEMS,
  verifyErroneousExample,
  withSeparator,
} from '../src/ai/erroneous.ts';
import { TYPE_1_ITEMS } from '../src/engine/items.ts';

const task = buildTask('L', TYPE_1_ITEMS.find((i) => i.id === 't1-08-075')!);
// task pair: 0.8 (anchor, really larger) vs 0.75 (target, Robo's wrong pick)

describe('erroneous-example verifier', () => {
  it('accepts a faithful wrong example', () => {
    expect(
      verifyErroneousExample(
        {
          peerClaim: '0.75 is bigger than 0.8.',
          peerReason: 'It has more digits after the point, so it must be more.',
        },
        task,
      ),
    ).toEqual({ ok: true });
  });

  it('accepts the bare digit comparison an L thinker would give', () => {
    expect(
      verifyErroneousExample(
        { peerClaim: '0.75 is bigger than 0.8.', peerReason: 'Because 75 beats 8.' },
        task,
      ).ok,
    ).toBe(true);
  });

  it('rejects a third number', () => {
    expect(
      verifyErroneousExample(
        {
          peerClaim: '0.75 is bigger than 0.8.',
          peerReason: 'It is nearly 0.9, so it wins.',
        },
        task,
      ),
    ).toEqual({ ok: false, reason: 'third-number' });
  });

  it('rejects a claim that names the wrong pair', () => {
    expect(
      verifyErroneousExample(
        { peerClaim: '0.36 is bigger than 0.5.', peerReason: 'More digits.' },
        task,
      ).ok,
    ).toBe(false);
  });

  it('rejects a correct claim', () => {
    expect(
      verifyErroneousExample(
        { peerClaim: '0.8 is bigger than 0.75.', peerReason: 'More digits.' },
        task,
      ),
    ).toEqual({ ok: false, reason: 'claim-is-correct' });
  });

  it('reads a smaller-word claim the same way', () => {
    expect(
      verifyErroneousExample(
        { peerClaim: '0.8 is smaller than 0.75.', peerReason: 'More digits win.' },
        task,
      ).ok,
    ).toBe(true);
  });

  it('rejects a claim with no comparison at all', () => {
    expect(
      verifyErroneousExample(
        { peerClaim: 'Robo sorted 0.75 and 0.8 into the shed.', peerReason: 'Done.' },
        task,
      ),
    ).toEqual({ ok: false, reason: 'no-comparison' });
  });

  it('rejects more than forty words', () => {
    const long = Array.from({ length: 45 }, () => 'word').join(' ');
    expect(
      verifyErroneousExample(
        { peerClaim: '0.75 is bigger than 0.8.', peerReason: long },
        task,
      ),
    ).toEqual({ ok: false, reason: 'too-many-words' });
  });

  it('rejects empty text', () => {
    expect(
      verifyErroneousExample({ peerClaim: '', peerReason: 'because' }, task),
    ).toEqual({ ok: false, reason: 'empty' });
  });

  it('accepts a trailing-zero rewrite of the same pair', () => {
    expect(
      verifyErroneousExample(
        { peerClaim: '0.75 is bigger than 0.80.', peerReason: 'More digits win.' },
        task,
      ).ok,
    ).toBe(true);
  });

  it('works with a comma separator', () => {
    expect(
      verifyErroneousExample(
        { peerClaim: '0,75 is bigger than 0,8.', peerReason: 'More digits win.' },
        task,
        ',',
      ).ok,
    ).toBe(true);
  });

  it('checks the S rule the other way round', () => {
    const sTask = pickTask('S', 0);
    // Robo must call the SHORTER decimal larger.
    const claim = `${sTask.wrongLarger.t / 1000} is bigger than ${
      sTask.trueLarger.t / 1000
    }.`;
    expect(
      verifyErroneousExample({ peerClaim: claim, peerReason: 'Short wins.' }, sTask).ok,
    ).toBe(true);
  });
});

describe('authored fallback bank', () => {
  it('has six examples per rule', () => {
    expect(AUTHORED_BANK.filter((b) => b.rule === 'L')).toHaveLength(6);
    expect(AUTHORED_BANK.filter((b) => b.rule === 'S')).toHaveLength(6);
  });

  it('covers every pair the engine can pick', () => {
    expect(L_TASK_ITEMS).toHaveLength(6);
    expect(S_TASK_ITEMS).toHaveLength(6);
    for (const rule of ['L', 'S'] as const) {
      for (let i = 0; i < 6; i += 1) {
        expect(() => bankExample(pickTask(rule, i))).not.toThrow();
      }
    }
  });

  it('every authored example passes the verifier', () => {
    for (const rule of ['L', 'S'] as const) {
      for (let i = 0; i < 6; i += 1) {
        const t = pickTask(rule, i);
        const verdict = verifyErroneousExample(bankExample(t), t);
        expect({ id: t.item.id, ...verdict }).toEqual({ id: t.item.id, ok: true });
      }
    }
  });

  it('every authored example still passes with a comma separator', () => {
    for (const rule of ['L', 'S'] as const) {
      for (let i = 0; i < 6; i += 1) {
        const t = pickTask(rule, i);
        const example = withSeparator(bankExample(t), t, ',');
        expect(verifyErroneousExample(example, t, ',').ok).toBe(true);
      }
    }
  });
});
