import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first (if present), then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON request body parser
  app.use(express.json());

  // API Routes
  app.use('/api', apiRouter);
  app.use('/mock', apiRouter);

  // System Health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      product: 'VoiceLend',
      tagline: 'From Voice to Working Capital',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      time: new Date().toISOString(),
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VoiceLend full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
