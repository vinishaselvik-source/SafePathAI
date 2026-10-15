import { Router, Request, Response } from 'express';
import { store } from '../services/store.js';
import { requireRole } from '../middleware/auth.js';
import { UserRole } from '../types.js';

const router = Router();

// GET /api/auth/users - List users (Admin only)
router.get('/users', requireRole(['admin']), (_req: Request, res: Response) => {
  try {
    const users = store.getUsers();
    return res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/auth/users/:id/role - Update user role (Admin only)
router.patch('/users/:id/role', requireRole(['admin']), (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const validRoles: UserRole[] = ['citizen', 'volunteer', 'responder', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid role. Allowed: ${validRoles.join(', ')}` 
      });
    }

    const updatedUser = store.updateUserRole(
      req.params.id as string, 
      role, 
      req.user?.name || 'Administrator'
    );

    return res.json({
      success: true,
      message: `User ${updatedUser.name} role changed to ${role}`,
      data: updatedUser
    });
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
