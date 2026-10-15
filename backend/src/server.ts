import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticate } from './middleware/auth.js';
import incidentsRouter from './routes/incidents.js';
import civicRouter from './routes/civicReports.js';
import sheltersRouter from './routes/shelters.js';
import resourcesRouter from './routes/resources.js';
import plansRouter from './routes/plans.js';
import analyticsRouter from './routes/analytics.js';
import authRouter from './routes/auth.js';
import logsRouter from './routes/logs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authenticate);

// API Routes
app.use('/api/incidents', incidentsRouter);
app.use('/api/civic', civicRouter);
app.use('/api/shelters', sheltersRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/plans', plansRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/auth', authRouter);
app.use('/api/logs', logsRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'SAROS Search and Rescue Operating System',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[SAROS SERVER ERROR]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[SAROS SERVER] Emergency Response Backend listening on http://localhost:${PORT}`);
  });
}

export default app;
