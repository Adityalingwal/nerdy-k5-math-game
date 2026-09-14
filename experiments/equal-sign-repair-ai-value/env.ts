/**
 * Minimal `.env` reader for this experiment.
 *
 * Same shape as the reader in `scripts/ai-value-test.ts`, duplicated on purpose
 * so the experiment imports nothing that runs at module load. It fails silently
 * when no `.env` exists, and it never prints or returns a key value.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = join(HERE, '..', '..');

export function loadDotEnv(): void {
  try {
    const raw = readFileSync(join(REPO_ROOT, '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // No .env file: the experiment runs baseline-only.
  }
}
