import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { getModelHealth } from './src/api/ai/health'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'evolution-health-endpoint',
      configureServer(server) {
        server.middlewares.use('/api/ai/health', async (_req, res) => {
          const apiKey = process.env.VITE_GEMINI_KEY || process.env.VITE_GEMINI_API_KEY;
          const payload = await getModelHealth(apiKey || '');
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        });
      },
    },
  ],
})
