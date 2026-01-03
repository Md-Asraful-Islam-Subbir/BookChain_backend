import { NextFunction, Request, Response } from "express";
import { response } from "../utils/responseHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Extend Express Request to include user id
 */
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

export const authenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return response(res, 401, "User not authenticated, no token provided");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return response(res, 401, "Not authorized, user not found");
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    return response(res, 401, "Invalid or expired token");
  }
};

