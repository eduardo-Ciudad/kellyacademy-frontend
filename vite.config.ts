import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8080';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
    server: {
      proxy: Object.fromEntries(
        ['/auth', '/usuarios', '/temas', '/redacoes'].map((route) => [
          route,
          {
            target: apiTarget,
            changeOrigin: true,
            bypass: (req) =>
              req.headers.accept?.includes('text/html')
                ? '/index.html'
                : undefined,
          },
        ]),
      ),
    },
  };
});
