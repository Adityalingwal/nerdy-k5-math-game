import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MODEL,
  extractJsonObject,
  handleLlmRequest,
  parseRequest,
  readLlmConfigFromEnv,
} from '../src/ai/core.ts';

describe('llm core', () => {
  it('reads config from the environment and defaults the model', () => {
    expect(readLlmConfigFromEnv({})).toEqual({ apiKey: undefined, model: DEFAULT_MODEL });
    expect(readLlmConfigFromEnv({ OPENROUTER_API_KEY: '  ' }).apiKey).toBeUndefined();
    expect(
      readLlmConfigFromEnv({ OPENROUTER_API_KEY: 'k', OPENROUTER_MODEL: 'x/y' }),
    ).toEqual({ apiKey: 'k', model: 'x/y' });
  });

  it('extracts the first JSON object from a chatty reply', () => {
    expect(
      extractJsonObject('Sure! ```json\n{"label":"L","confidence":0.9}\n``` done'),
    ).toEqual({ label: 'L', confidence: 0.9 });
    expect(extractJsonObject('{"a":{"b":1}} trailing')).toEqual({ a: { b: 1 } });
    expect(extractJsonObject('{"a":"}"}')).toEqual({ a: '}' });
    expect(extractJsonObject('no json here')).toBeUndefined();
    expect(extractJsonObject('{broken')).toBeUndefined();
  });

  it('rejects malformed requests', () => {
    expect(parseRequest(undefined)).toBeUndefined();
    expect(parseRequest({ op: 'nope' })).toBeUndefined();
    expect(parseRequest({ op: 'classify', anchor: '0.8' })).toBeUndefined();
    expect(
      parseRequest({
        op: 'erroneous-example',
        rule: 'X',
        anchor: '0.8',
        target: '0.75',
        wrongLarger: '0.75',
        separator: '.',
      }),
    ).toBeUndefined();
  });

  it('accepts a well formed request and clips long learner text', () => {
    const parsed = parseRequest({
      op: 'classify',
      anchor: '0.8',
      target: '0.45',
      trueLarger: '0.8',
      step: 'why',
      text: 'x'.repeat(900),
      learnerTreatedTargetAsLarger: true,
    });
    expect(parsed?.op).toBe('classify');
    expect(parsed && 'text' in parsed ? parsed.text.length : 0).toBe(600);
  });

  it('reports not_configured when no key is present', async () => {
    const result = await handleLlmRequest(
      {
        op: 'classify',
        anchor: '0.8',
        target: '0.45',
        trueLarger: '0.8',
        step: 'why',
        text: 'because 45 is bigger',
      },
      { model: DEFAULT_MODEL },
    );
    expect(result).toEqual({ ok: false, reason: 'not_configured' });
  });

  it('reports bad_request before touching the network', async () => {
    const result = await handleLlmRequest({ op: 'nope' }, { apiKey: 'k', model: 'm' });
    expect(result).toEqual({ ok: false, reason: 'bad_request' });
  });
});
