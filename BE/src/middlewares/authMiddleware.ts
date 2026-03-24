import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../config/jwt.js';
import type { JwtUserPayload } from '../config/jwt.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Thiếu token xác thực' });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({ message: 'Token không hợp lệ' });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch (_error: unknown) {
    res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ' });
  }
};

export const requireRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const currentUser = (req as AuthenticatedRequest).user;
    if (!currentUser) {
      res.status(401).json({ message: 'Chưa xác thực người dùng' });
      return;
    }

    const currentRole = currentUser.vaiTro?.toLowerCase() ?? '';
    const allowedRoles = roles.map((role) => role.toLowerCase());

    if (!allowedRoles.includes(currentRole)) {
      res.status(403).json({ message: 'Bạn không có quyền truy cập' });
      return;
    }

    next();
  };
};
