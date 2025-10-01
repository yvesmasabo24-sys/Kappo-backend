// src/middleware/authMiddleware.ts
import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, IUser } from "../models/userModels";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export interface AuthRequest extends Request {
  user?: IUser;
}

// ✅ Middleware to require authentication
export const requireSignin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication is required" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // 🔍 Debug log
    console.log("Decoded JWT:", decoded);

    // Support either '_id' or 'id'
    const userId = decoded._id || decoded.id;

    const rootUser = await User.findOne({
      _id: userId,
      accessToken: token, // must match the DB
    });

    if (!rootUser) {
      return res.status(401).json({ message: "User not found or token invalid" });
    }

    req.user = rootUser; // attach user to request
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Authorization required" });
  }
};

// ✅ Middleware to check if user is admin
export const checkAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.userRole !== "admin") {
    return res.status(401).json({ message: "User not authorized" });
  }
  next();
};
