/**
 * Vercel serverless function: the only path to the language model.
 *
 * The OpenRouter API key is read from the server environment and never leaves
 * it. The browser bundle contains no key and no reference to it.
 *
 * The same logic runs locally through the Vite dev middleware in
 * `vite.config.ts`, so `npm run dev` behaves like production.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleLlmRequest, readLlmConfigFromEnv } from '../src/ai/core.ts';

interface VercelLikeRequest extends IncomingMessage {
  body?: unknown;
}

async function readBody(req: VercelLikeRequest): Promise<unknown> {
  // Vercel usually parses JSON bodies for us; the dev middleware does not.
  if (req.body !== undefined && req.body !== null && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return undefined;
    }
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk as Buffer));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw.length === 0) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function send(res: ServerResponse, status: number, payload: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(payload));
}

export default async function handler(
  req: VercelLikeRequest,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    send(res, 405, { ok: false, reason: 'method_not_allowed' });
    return;
  }
  const body = await readBody(req);
  if (body === undefined) {
    send(res, 400, { ok: false, reason: 'bad_json' });
    return;
  }
  const config = readLlmConfigFromEnv(process.env as Record<string, string | undefined>);
  const result = await handleLlmRequest(body, config);
  // Always 200: the client treats every failure the same way (use fallbacks).
  send(res, 200, result);
}
