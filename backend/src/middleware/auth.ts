import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/types';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email?: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const mockUserId = req.headers['x-mock-user-id'];
  const mockRole = req.headers['x-mock-role'];

  // 1. Check if we're using mock header bypass
  if (mockUserId && mockRole) {
    req.user = {
      id: mockUserId as string,
      role: mockRole as UserRole,
      email: `${mockRole}@unisync.mock`
    };
    return next();
  }

  // 2. Otherwise verify JWT (Supabase Auth headers if available)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no JWT and no mock header, fail authentication
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // In actual Supabase deployment, we verify token using supabase client or JWT validation.
    // For local flexibility, we extract payload metadata or verify.
    // Let's decode or simulate verification.
    // If the token is one of our seed mock tokens, bypass and assign.
    if (token.startsWith('mock-token-')) {
      const role = token.replace('mock-token-', '') as UserRole;
      const id = role === 'student' ? '11111111-1111-1111-1111-111111111111' :
                 role === 'staff' ? '22222222-2222-2222-2222-222222222222' : '33333333-3333-3333-3333-333333333333';
      req.user = {
        id,
        role,
        email: `${role}@university.edu`
      };
      return next();
    }

    // Default fallback mock parse:
    const base64Url = token.split('.')[1];
    if (base64Url) {
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(Buffer.from(base64, 'base64').toString());
      req.user = {
        id: payload.sub || payload.id,
        role: (payload.role || payload.user_metadata?.role || 'student') as UserRole,
        email: payload.email
      };
      return next();
    }

    return res.status(401).json({ error: 'Invalid authentication token format.' });
  } catch (error) {
    return res.status(401).json({ error: 'Session expired or invalid token.' });
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User must be authenticated' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }
    
    next();
  };
};
