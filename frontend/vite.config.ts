import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/freepik-api': {
          target: 'https://api.freepik.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/freepik-api/, ''),
          headers: {
            'Origin': 'https://api.freepik.com'
          }
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      'process.env.FREEPIK_API_KEY': JSON.stringify(env.VITE_FREEPIK_API_KEY),
      'process.env.PERPLEXITY_API_KEY': JSON.stringify(env.VITE_PERPLEXITY_API_KEY),
      // Fallback for the current code using process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
