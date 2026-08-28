import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "development-secret"
    ) as { userId: string };

    req.user = { userId: payload.userId };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
