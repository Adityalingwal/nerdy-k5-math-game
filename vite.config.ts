import { defineConfig, loadEnv, type Plugin } from 'vite';

/**
 * Local dev middleware that mirrors `api/llm.ts` (the Vercel serverless
 * function) so `npm run dev` exposes the same POST /api/llm endpoint.
 *
 * The API key is read from the environment on the server side only. It is
 * never injected into `define`, never bundled, and never sent to the browser.
 */
function llmDevApi(env: Record<string, string>): Plugin {
  return {
    name: 'decimal-dock-llm-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/llm', async (req, res) => {
        // Imported lazily so the plugin does not pull the AI core into the
        // client bundle graph.
        const { handleLlmRequest, readLlmConfigFromEnv } = await import(
          './src/ai/core.ts'
        );

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ ok: false, reason: 'method_not_allowed' }));
          return;
        }

        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', async () => {
          let body: unknown;
          try {
            body = JSON.parse(raw || '{}');
          } catch {
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ ok: false, reason: 'bad_json' }));
            return;
          }
          const config = readLlmConfigFromEnv({
            ...process.env,
            ...env,
          } as Record<string, string | undefined>);
          const result = await handleLlmRequest(body, config);
          res.statusCode = 200;
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify(result));
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Loaded with an empty prefix so plain (non VITE_) names are visible to the
  // dev middleware. This value is used on the server side only.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [llmDevApi(env)],
    build: {
      target: 'es2022',
      sourcemap: false,
    },
  };
});
