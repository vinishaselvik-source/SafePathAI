import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/plans - List disaster management plans (Public)
router.get('/', (_req: Request, res: Response) => {
  try {
    const plans = store.getDisasterPlans();
    return res.json({ success: true, count: plans.length, data: plans });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/plans/:id - Update disaster plan (Admin only)
router.put('/:id', requireRole(['admin']), (req: Request, res: Response) => {
  try {
    const updated = store.updateDisasterPlan(req.params.id as string, req.body);
    return res.json({ success: true, message: 'Disaster management plan updated', data: updated });
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
