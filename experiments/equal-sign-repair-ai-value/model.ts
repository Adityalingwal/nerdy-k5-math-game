/**
 * Constrained real-model route.
 *
 * Written fresh for this experiment rather than reusing `callOpenRouter` in
 * `src/ai/core.ts`, because that helper is private, hard-codes the product's
 * 4000 ms budget and discards both latency and provider usage metadata - all
 * three of which this experiment has to record.
 *
 * Only two pure helpers are borrowed from the product core, read-only:
 * `extractJsonObject`, `readLlmConfigFromEnv`, plus the `DEFAULT_MODEL` and
 * `OPENROUTER_URL` constants.
 *
 * The key is never printed, written, returned or included in any artifact.
 */

import {
  DEFAULT_MODEL,
  OPENROUTER_URL,
  extractJsonObject,
  readLlmConfigFromEnv,
} from '../../src/ai/core.ts';
import type { RouteInput, ValidatedReply } from './contract.ts';
import { SYSTEM_CONTRACT, validateModelReply } from './contract.ts';

/**
 * Deliberately NOT the product's 4000 ms. A CLI experiment can wait; a short
 * budget would turn ordinary provider latency into fake timeout evidence.
 */
export const EXPERIMENT_TIMEOUT_MS = 18_000;
export const MAX_TOKENS = 120;
export const TEMPERATURE = 0;

export interface ModelConfig {
  readonly apiKey: string;
  readonly requestedModel: string;
  readonly url: string;
}

export interface ModelEnvStatus {
  readonly configured: boolean;
  readonly requestedModel: string;
  readonly config?: ModelConfig;
}

/** Read the key and model from the environment. Returns no key material. */
export function readModelEnv(): ModelEnvStatus {
  const config = readLlmConfigFromEnv(process.env as Record<string, string | undefined>);
  if (!config.apiKey) {
    return { configured: false, requestedModel: config.model || DEFAULT_MODEL };
  }
  return {
    configured: true,
    requestedModel: config.model,
    config: { apiKey: config.apiKey, requestedModel: config.model, url: OPENROUTER_URL },
  };
}

export interface TransportFailure {
  /** HTTP status when the provider answered, null for network/abort failures. */
  readonly status: number | null;
  readonly kind: 'http_error' | 'network_error' | 'timeout' | 'empty_content';
  /** Truncated body or error message. Never a header and never the key. */
  readonly detail: string;
}

export type ModelCallResult =
  | {
      readonly ok: true;
      readonly reply: ValidatedReply;
      readonly latencyMs: number;
      readonly servedModel: string | null;
      readonly usage: unknown;
      readonly rawContentLength: number;
    }
  | { readonly ok: false; readonly failure: TransportFailure; readonly latencyMs: number };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** The only payload ever sent: the fixed contract plus one synthetic case. */
export function buildUserMessage(input: RouteInput): string {
  return JSON.stringify(
    {
      caseId: input.caseId,
      equation: input.equation,
      facts: input.facts,
      trace: input.trace,
      explanation: input.explanation,
    },
    null,
    2,
  );
}

/**
 * One model call for one fixture.
 *
 * A malformed, inconsistent or low-confidence reply is NOT a transport failure:
 * it comes back as `ok: true` with a `fallbackReason` on the validated reply,
 * routed to UNCLEAR with no retry. Only HTTP, network and timeout problems are
 * transport failures, and the caller retries those exactly once before aborting.
 */
export async function callModel(
  input: RouteInput,
  config: ModelConfig,
): Promise<ModelCallResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EXPERIMENT_TIMEOUT_MS);
  const startedAt = performance.now();
  try {
    const response = await fetch(config.url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        'content-type': 'application/json',
        'x-title': 'Equal-Sign Repair AI value test',
      },
      body: JSON.stringify({
        model: config.requestedModel,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: SYSTEM_CONTRACT },
          { role: 'user', content: buildUserMessage(input) },
        ],
      }),
    });
    const latencyMs = performance.now() - startedAt;

    if (!response.ok) {
      const body = (await response.text()).slice(0, 300);
      return {
        ok: false,
        latencyMs,
        failure: { status: response.status, kind: 'http_error', detail: body },
      };
    }

    const data: unknown = await response.json();
    const choice =
      isRecord(data) && Array.isArray(data.choices) && isRecord(data.choices[0])
        ? data.choices[0]
        : undefined;
    const message = choice && isRecord(choice.message) ? choice.message : undefined;
    const content = message && typeof message.content === 'string' ? message.content : '';
    const servedModel = isRecord(data) && typeof data.model === 'string' ? data.model : null;
    const usage = isRecord(data) ? (data.usage ?? null) : null;

    if (content.trim().length === 0) {
      return {
        ok: false,
        latencyMs,
        failure: { status: response.status, kind: 'empty_content', detail: 'no message content' },
      };
    }

    return {
      ok: true,
      reply: validateModelReply(extractJsonObject(content)),
      latencyMs,
      servedModel,
      usage,
      rawContentLength: content.length,
    };
  } catch (error) {
    const latencyMs = performance.now() - startedAt;
    const name = (error as { name?: string }).name;
    const aborted = name === 'AbortError' || name === 'TimeoutError';
    return {
      ok: false,
      latencyMs,
      failure: {
        status: null,
        kind: aborted ? 'timeout' : 'network_error',
        detail: String((error as Error).message ?? error).slice(0, 300),
      },
    };
  } finally {
    clearTimeout(timer);
  }
}
