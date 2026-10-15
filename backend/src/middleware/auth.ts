import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types.js';

export interface AuthenticatedUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const roleHeader = req.headers['x-user-role'] as UserRole;
  const idHeader = req.headers['x-user-id'] as string;
  const nameHeader = req.headers['x-user-name'] as string;

  if (roleHeader && ['citizen', 'volunteer', 'responder', 'admin'].includes(roleHeader)) {
    req.user = {
      id: idHeader || `usr-${roleHeader}-default`,
      name: nameHeader ? decodeURIComponent(nameHeader) : `${roleHeader.toUpperCase()} Operator`,
      role: roleHeader
    };
  } else {
    // Default public/citizen access for unauthenticated calls
    req.user = {
      id: 'usr-citizen-guest',
      name: 'Citizen Guest',
      role: 'citizen'
    };
  }

  next();
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Authentication is required to perform this action.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: `Access denied. Role '${req.user.role}' is not authorized. Required: ${allowedRoles.join(', ')}` 
      });
    }

    next();
    return;
  };
};
