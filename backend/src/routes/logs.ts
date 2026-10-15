import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/logs - List system activity logs (Responder / Admin only)
router.get('/', requireRole(['responder', 'admin']), (_req: Request, res: Response) => {
  try {
    const logs = store.getActivityLogs();
    return res.json({ success: true, count: logs.length, data: logs });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
