import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  userId?: string;
}

const userMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error("Server configuration error: Secret key not provided.");
    }

    const token = req.cookies?.jwt;

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    if (!decoded.userId) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    req.userId = decoded.userId; // Assign userId to the request
    next();
  } catch (err) {
    console.error("Token verification failed:", err); // Error logging
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default userMiddleware;
