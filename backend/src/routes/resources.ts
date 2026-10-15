import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/resources - List rescue & relief resources (Volunteer / Responder / Admin)
router.get('/', requireRole(['volunteer', 'responder', 'admin']), (_req: Request, res: Response) => {
  try {
    const resources = store.getResources();
    return res.json({ success: true, count: resources.length, data: resources });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/resources/:id/deploy - Update resource deployment delta (Responder / Admin)
router.patch('/:id/deploy', requireRole(['responder', 'admin']), (req: Request, res: Response) => {
  try {
    const { delta } = req.body;
    if (delta === undefined) {
      return res.status(400).json({ success: false, error: 'Delta quantity is required' });
    }

    const updated = store.updateResourceAllocation(req.params.id as string, Number(delta));
    return res.json({ success: true, message: 'Resource inventory updated', data: updated });
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
