import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'smriticare-secure-jwt-secret-key-2026';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email?: string;
  role: 'patient' | 'caregiver' | 'clinician' | 'asha';
  fullName: string;
  preferredLanguage: 'en' | 'hi';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token provided, allow demo patient fallback or return 401
    // For smooth user experience with local development, check if demo-user header is present
    const demoUserHeader = req.headers['x-demo-user-id'] as string;
    if (demoUserHeader) {
      req.user = {
        id: demoUserHeader,
        username: 'demo.user',
        role: 'patient',
        fullName: 'Bipin Gogoi',
        preferredLanguage: 'en',
      };
      next();
      return;
    }

    res.status(401).json({ error: 'Authentication required. Please sign in.' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired authentication token.' });
      return;
    }
    req.user = decoded as AuthenticatedUser;
    next();
  });
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const demoUserHeader = (req.headers['x-demo-user-id'] as string) || 'user_patient_demo';
    req.user = {
      id: demoUserHeader,
      username: 'bipin.elder',
      role: 'patient',
      fullName: 'Bipin Gogoi',
      preferredLanguage: 'en',
    };
    next();
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = decoded as AuthenticatedUser;
    } else {
      req.user = {
        id: 'user_patient_demo',
        username: 'bipin.elder',
        role: 'patient',
        fullName: 'Bipin Gogoi',
        preferredLanguage: 'en',
      };
    }
    next();
  });
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: `Forbidden: role '${req.user.role}' lacks permission.` });
      return;
    }
    next();
  };
}
