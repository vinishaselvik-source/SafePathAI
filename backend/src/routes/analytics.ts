import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';

const router = Router();

// GET /api/analytics/dashboard - Real aggregated metrics
router.get('/dashboard', (_req: Request, res: Response) => {
  try {
    const summary = store.getAnalyticsSummary();
    return res.json({ success: true, data: summary });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
