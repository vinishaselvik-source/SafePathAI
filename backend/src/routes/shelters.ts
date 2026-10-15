import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/shelters - List all shelters (Public)
router.get('/', (_req: Request, res: Response) => {
  try {
    const shelters = store.getShelters();
    return res.json({ success: true, count: shelters.length, data: shelters });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/shelters/:id/occupancy - Update occupancy & status (Responder / Admin)
router.patch('/:id/occupancy', requireRole(['responder', 'admin']), (req: Request, res: Response) => {
  try {
    const { occupancy, status } = req.body;
    if (occupancy === undefined) {
      return res.status(400).json({ success: false, error: 'Occupancy number is required' });
    }

    const updated = store.updateShelterOccupancy(req.params.id as string, Number(occupancy), status);
    return res.json({ success: true, message: 'Shelter updated successfully', data: updated });
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
