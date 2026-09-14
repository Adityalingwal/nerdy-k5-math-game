/**
 * Shared model-call core.
 *
 * Used by both server adapters (`api/llm.ts` for Vercel and the Vite dev
 * middleware) and by the offline harness. It never touches the DOM and never
 * reads `process.env` itself: the API key is passed in by the adapter, so it
 * cannot leak into the browser bundle.
 *
 * Provider: OpenRouter's OpenAI-compatible chat-completions endpoint.
 */

import { isCorrectionLabel, type Label } from './labels.ts';
import {
  CLASSIFY_SYSTEM,
  classifyUserPrompt,
  ERRONEOUS_SYSTEM,
  erroneousUserPrompt,
  type ClassifyPromptInput,
  type ErroneousPromptInput,
} from './prompts.ts';

export const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Default model id, verified against https://openrouter.ai/api/v1/models
 * on 2026-09-08. Override with OPENROUTER_MODEL.
 */
export const DEFAULT_MODEL = 'anthropic/claude-sonnet-5';

export const REQUEST_TIMEOUT_MS = 4000;

export interface LlmConfig {
  /** Undefined means "no key configured": every call reports not_configured. */
  readonly apiKey?: string | undefined;
  readonly model: string;
  readonly url?: string;
  readonly timeoutMs?: number;
}

export function readLlmConfigFromEnv(
  env: Record<string, string | undefined>,
): LlmConfig {
  const key = env.OPENROUTER_API_KEY?.trim();
  return {
    apiKey: key && key.length > 0 ? key : undefined,
    model: env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL,
  };
}

export type ClassifyRequest = { op: 'classify' } & ClassifyPromptInput;
export type ErroneousRequest = { op: 'erroneous-example' } & ErroneousPromptInput;
export type LlmRequest = ClassifyRequest | ErroneousRequest;

export type LlmFailure =
  | 'not_configured'
  | 'bad_request'
  | 'timeout'
  | 'upstream_error'
  | 'unparseable';

export type LlmResponse =
  | { ok: true; op: 'classify'; label: Label; confidence: number; model: string }
  | {
      ok: true;
      op: 'erroneous-example';
      peerClaim: string;
      peerReason: string;
      model: string;
    }
  | { ok: false; reason: LlmFailure; detail?: string };

/** Extract the first balanced JSON object from a model reply. */
export function extractJsonObject(text: string): unknown {
  if (!text) return undefined;
  const start = text.indexOf('{');
  if (start === -1) return undefined;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i] as string;
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1));
        } catch {
          return undefined;
        }
      }
    }
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Validate a request body arriving from the browser. */
export function parseRequest(body: unknown): LlmRequest | undefined {
  if (!isRecord(body)) return undefined;
  if (body.op === 'classify') {
    const { anchor, target, trueLarger, step, text } = body;
    if (
      typeof anchor !== 'string' ||
      typeof target !== 'string' ||
      typeof trueLarger !== 'string' ||
      (step !== 'why' && step !== 'correction') ||
      typeof text !== 'string'
    ) {
      return undefined;
    }
    return {
      op: 'classify',
      anchor,
      target,
      trueLarger,
      step,
      text: text.slice(0, 600),
      learnerTreatedTargetAsLarger: body.learnerTreatedTargetAsLarger === true,
    };
  }
  if (body.op === 'erroneous-example') {
    const { rule, anchor, target, wrongLarger, separator } = body;
    if (
      (rule !== 'L' && rule !== 'S') ||
      typeof anchor !== 'string' ||
      typeof target !== 'string' ||
      typeof wrongLarger !== 'string' ||
      (separator !== '.' && separator !== ',')
    ) {
      return undefined;
    }
    const learnerText =
      typeof body.learnerText === 'string' ? body.learnerText.slice(0, 400) : undefined;
    return {
      op: 'erroneous-example',
      rule,
      anchor,
      target,
      wrongLarger,
      separator,
      ...(learnerText ? { learnerText } : {}),
    };
  }
  return undefined;
}

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

async function callOpenRouter(
  messages: ChatMessage[],
  config: LlmConfig,
): Promise<{ ok: true; content: string } | { ok: false; reason: LlmFailure; detail?: string }> {
  if (!config.apiKey) return { ok: false, reason: 'not_configured' };
  const timeoutMs = config.timeoutMs ?? REQUEST_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(config.url ?? OPENROUTER_URL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        'content-type': 'application/json',
        'x-title': 'Decimal Dock',
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0,
        max_tokens: 200,
        messages,
      }),
    });
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 300);
      return { ok: false, reason: 'upstream_error', detail: `${res.status} ${detail}` };
    }
    const data: unknown = await res.json();
    const content =
      isRecord(data) && Array.isArray(data.choices) && isRecord(data.choices[0])
        ? (data.choices[0].message as Record<string, unknown> | undefined)?.content
        : undefined;
    if (typeof content !== 'string' || content.trim().length === 0) {
      return { ok: false, reason: 'unparseable' };
    }
    return { ok: true, content };
  } catch (error) {
    const name = (error as { name?: string }).name;
    if (name === 'AbortError' || name === 'TimeoutError') {
      return { ok: false, reason: 'timeout' };
    }
    return {
      ok: false,
      reason: 'upstream_error',
      detail: String((error as Error).message ?? error).slice(0, 200),
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Run one operation. Never throws; failures come back as `ok: false`. */
export async function handleLlmRequest(
  body: unknown,
  config: LlmConfig,
): Promise<LlmResponse> {
  const request = parseRequest(body);
  if (!request) return { ok: false, reason: 'bad_request' };
  if (!config.apiKey) return { ok: false, reason: 'not_configured' };

  if (request.op === 'classify') {
    const result = await callOpenRouter(
      [
        { role: 'system', content: CLASSIFY_SYSTEM },
        { role: 'user', content: classifyUserPrompt(request) },
      ],
      config,
    );
    if (!result.ok) return result;
    const parsed = extractJsonObject(result.content);
    if (!isRecord(parsed)) return { ok: false, reason: 'unparseable' };
    const label = parsed.label;
    const confidence = Number(parsed.confidence);
    if (!isCorrectionLabel(label) || !Number.isFinite(confidence)) {
      return { ok: false, reason: 'unparseable' };
    }
    if (label === 'VALID' && request.step !== 'correction') {
      return { ok: false, reason: 'unparseable' };
    }
    return {
      ok: true,
      op: 'classify',
      label,
      confidence: Math.min(1, Math.max(0, confidence)),
      model: config.model,
    };
  }

  const result = await callOpenRouter(
    [
      { role: 'system', content: ERRONEOUS_SYSTEM },
      { role: 'user', content: erroneousUserPrompt(request) },
    ],
    config,
  );
  if (!result.ok) return result;
  const parsed = extractJsonObject(result.content);
  if (!isRecord(parsed)) return { ok: false, reason: 'unparseable' };
  const peerClaim = parsed.peer_claim ?? parsed.peerClaim;
  const peerReason = parsed.peer_reason ?? parsed.peerReason;
  if (typeof peerClaim !== 'string' || typeof peerReason !== 'string') {
    return { ok: false, reason: 'unparseable' };
  }
  return {
    ok: true,
    op: 'erroneous-example',
    peerClaim,
    peerReason,
    model: config.model,
  };
}
