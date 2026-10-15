import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { requireRole } from '../middleware/auth.js';
import { IncidentCategory, IncidentPriority, IncidentStatus } from '../types.js';

const router = Router();

// GET /api/incidents - List incidents with filtering
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, status, priority, search } = req.query;
    const incidents = store.getIncidents({
      category: category as string,
      status: status as string,
      priority: priority as string,
      search: search as string
    });
    return res.json({ success: true, count: incidents.length, data: incidents });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/incidents/:id - Get specific incident
router.get('/:id', (req: Request, res: Response) => {
  const incident = store.getIncidentById(req.params.id as string);
  if (!incident) {
    return res.status(404).json({ success: false, error: `Incident ${req.params.id} not found` });
  }
  return res.json({ success: true, data: incident });
});

// POST /api/incidents - Submit new SOS incident (Idempotent)
router.post('/', (req: Request, res: Response) => {
  try {
    const { 
      clientIncidentId, 
      category, 
      description, 
      location, 
      peopleCount, 
      priority, 
      submissionMethod,
      meshHops,
      userName
    } = req.body;

    // Required fields validation
    if (!category || !description || !location || location.lat === undefined || location.lng === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed: category, description, and valid location coordinates (lat, lng) are required.' 
      });
    }

    const validCategories: IncidentCategory[] = ['FLOOD', 'MEDICAL', 'FOOD_WATER', 'FIRE', 'TRAPPED', 'OTHER'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}` 
      });
    }

    const { incident, isDuplicate } = store.createIncident({
      clientIncidentId: clientIncidentId || `cid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: req.user?.id || 'usr-citizen-anon',
      userName: userName || req.user?.name || 'Anonymous Citizen',
      category,
      description,
      location: {
        lat: Number(location.lat),
        lng: Number(location.lng),
        address: location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        ward: location.ward
      },
      peopleCount: Number(peopleCount) || 1,
      priority: (priority as IncidentPriority) || 'HIGH',
      status: 'SUBMITTED',
      submissionMethod: submissionMethod || 'ONLINE_DIRECT',
      meshHops: meshHops !== undefined ? Number(meshHops) : 0
    });

    return res.status(isDuplicate ? 200 : 201).json({
      success: true,
      isDuplicate,
      message: isDuplicate 
        ? 'Duplicate SOS submission detected. Returned existing incident record.' 
        : 'Emergency SOS incident registered successfully.',
      data: incident
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/incidents/:id/status - Update incident status (Responder / Admin)
router.patch('/:id/status', requireRole(['responder', 'admin']), (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;
    const validStatuses: IncidentStatus[] = [
      'SUBMITTED', 'ACKNOWLEDGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'FAILED'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = store.updateIncidentStatus(
      req.params.id as string,
      status,
      { name: req.user!.name, role: req.user!.role },
      note
    );

    return res.json({
      success: true,
      message: `Incident ${req.params.id} status updated to ${status}`,
      data: updated
    });
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message });
  }
});

// POST /api/incidents/:id/assign - Assign incident (Responder / Admin)
router.post('/:id/assign', requireRole(['responder', 'admin']), (req: Request, res: Response) => {
  try {
    const { assignedToId, assignedToName, assignedToRole } = req.body;
    if (!assignedToName) {
      return res.status(400).json({ success: false, error: 'Assignee name is required' });
    }

    const updated = store.assignIncident(
      req.params.id as string,
      {
        id: assignedToId || `usr-${Date.now()}`,
        name: assignedToName,
        role: assignedToRole || 'volunteer'
      },
      { name: req.user!.name, role: req.user!.role }
    );

    return res.json({
      success: true,
      message: `Incident ${req.params.id} successfully assigned to ${assignedToName}`,
      data: updated
    });
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
