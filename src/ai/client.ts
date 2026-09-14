/**
 * Browser-side AI client.
 *
 * Talks to the local proxy at POST /api/llm. The API key lives only on the
 * server; this file never sees it. Every call has a deterministic fallback, so
 * the game is complete with the model switched off, missing, or failing.
 */

import {
  bankExample,
  describeTask,
  verifyErroneousExample,
  withSeparator,
  type ErroneousExample,
  type ErroneousTask,
} from './erroneous.ts';
import { classifyByKeyword } from './keyword.ts';
import { gate, type Classification, type Label } from './labels.ts';
import { type Separator, format } from '../engine/decimal.ts';

export interface ClassifyInput {
  readonly anchor: string;
  readonly target: string;
  readonly trueLarger: string;
  readonly learnerTreatedTargetAsLarger: boolean;
  readonly step: 'why' | 'correction';
  readonly text: string;
}

export interface ErroneousResult {
  readonly example: ErroneousExample;
  readonly source: 'model' | 'bank';
  /** Set when a model answer was produced but the verifier rejected it. */
  readonly rejectedReason?: string;
}

async function postJson(body: unknown, timeoutMs = 6000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return { ok: false, reason: 'upstream_error' };
    return await res.json();
  } catch {
    return { ok: false, reason: 'timeout' };
  } finally {
    clearTimeout(timer);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export class AiClient {
  /** Mirrors the gear-panel toggle. */
  enabled: boolean;

  private readonly cache = new Map<string, ErroneousResult>();
  private readonly pending = new Map<string, Promise<ErroneousResult>>();

  /** Set once a model answer has been accepted; shown on the summary screen. */
  modelAnswersUsed = 0;
  modelRejections = 0;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Classify a learner explanation. Falls back to the keyword table whenever
   * the model is off, unreachable, slow or unparseable.
   */
  async classify(input: ClassifyInput): Promise<Classification> {
    const fallback = classifyByKeyword(input.text, {
      allowValid: input.step === 'correction',
    });
    if (!this.enabled) return fallback;
    if (input.text.trim().length === 0) return fallback;

    const reply = await postJson({ op: 'classify', ...input });
    if (!isRecord(reply) || reply.ok !== true || reply.op !== 'classify') {
      return fallback;
    }
    const label = reply.label as Label;
    const confidence = Number(reply.confidence);
    if (!Number.isFinite(confidence)) return fallback;
    this.modelAnswersUsed += 1;
    return gate({ label, confidence, source: 'model', note: 'model' });
  }

  private cacheKey(task: ErroneousTask): string {
    return `${task.rule}:${task.item.id}`;
  }

  /**
   * Ask for the erroneous example. The engine verifies any model output before
   * it is returned; a rejected output serves the authored bank instead.
   */
  async erroneousExample(
    task: ErroneousTask,
    learnerText: string,
    separator: Separator,
  ): Promise<ErroneousResult> {
    const key = this.cacheKey(task);
    const cached = this.cache.get(key);
    if (cached) return cached;
    const inFlight = this.pending.get(key);
    if (inFlight) return inFlight;

    const promise = this.fetchErroneous(task, learnerText, separator).then((result) => {
      this.cache.set(key, result);
      this.pending.delete(key);
      return result;
    });
    this.pending.set(key, promise);
    return promise;
  }

  /**
   * Start the request in the background as soon as INFER produces L or S, so
   * the learner never waits for it.
   */
  prefetchErroneousExample(
    task: ErroneousTask,
    learnerText: string,
    separator: Separator,
  ): void {
    void this.erroneousExample(task, learnerText, separator).catch(() => undefined);
  }

  private async fetchErroneous(
    task: ErroneousTask,
    learnerText: string,
    separator: Separator,
  ): Promise<ErroneousResult> {
    const authored = withSeparator(bankExample(task), task, separator);
    if (!this.enabled) return { example: authored, source: 'bank' };

    const reply = await postJson({
      op: 'erroneous-example',
      rule: task.rule,
      anchor: format(task.item.anchor, { separator }),
      target: format(task.item.target, { separator }),
      wrongLarger: format(task.wrongLarger, { separator }),
      separator,
      learnerText,
    });
    if (!isRecord(reply) || reply.ok !== true || reply.op !== 'erroneous-example') {
      return { example: authored, source: 'bank' };
    }
    const candidate: ErroneousExample = {
      peerClaim: String(reply.peerClaim ?? ''),
      peerReason: String(reply.peerReason ?? ''),
    };
    const verdict = verifyErroneousExample(candidate, task, separator);
    if (!verdict.ok) {
      this.modelRejections += 1;
      return {
        example: authored,
        source: 'bank',
        rejectedReason: verdict.reason ?? 'rejected',
      };
    }
    this.modelAnswersUsed += 1;
    return { example: candidate, source: 'model' };
  }

  clearCache(): void {
    this.cache.clear();
    this.pending.clear();
  }

  /** Used by the summary screen. */
  describe(task: ErroneousTask | undefined, separator: Separator): string {
    return task ? describeTask(task, separator) : '';
  }
}
