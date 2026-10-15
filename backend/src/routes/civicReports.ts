import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { requireRole } from '../middleware/auth.js';
import { CivicCategory, CivicStatus } from '../types.js';

const router = Router();

// GET /api/civic - List civic reports
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, status } = req.query;
    const reports = store.getCivicReports({
      category: category as string,
      status: status as string
    });
    return res.json({ success: true, count: reports.length, data: reports });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/civic - Submit new CityZen civic issue
router.post('/', (req: Request, res: Response) => {
  try {
    const { category, description, location, imageUrl, userName } = req.body;

    if (!category || !description || !location || location.lat === undefined || location.lng === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: category, description, and valid location coordinates are required.'
      });
    }

    const validCategories: CivicCategory[] = [
      'BLOCKED_DRAIN', 'WATERLOGGING', 'DAMAGED_ROAD', 'FALLEN_TREE', 'SLOPE_CRACK', 'OTHER'
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    const report = store.createCivicReport({
      userId: req.user?.id || 'usr-citizen-anon',
      userName: userName || req.user?.name || 'Citizen Contributor',
      category,
      description,
      location: {
        lat: Number(location.lat),
        lng: Number(location.lng),
        address: location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        ward: location.ward
      },
      imageUrl
    });

    return res.status(201).json({
      success: true,
      message: 'CityZen civic issue submitted successfully. Queued for municipal review.',
      data: report
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/civic/:id/verify - Verify / Update civic report (Responder / Admin)
router.patch('/:id/verify', requireRole(['responder', 'admin']), (req: Request, res: Response) => {
  try {
    const { status, verificationNotes, assignedAgency } = req.body;
    const validStatuses: CivicStatus[] = ['REPORTED', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = store.updateCivicReportStatus(
      req.params.id as string,
      status,
      { name: req.user!.name, role: req.user!.role },
      verificationNotes,
      assignedAgency
    );

    return res.json({
      success: true,
      message: `Civic report ${req.params.id} marked as ${status}`,
      data: updated
    });
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
