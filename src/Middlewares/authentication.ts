import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../Services";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await verifyAccessToken(token);

    req.user = {
      username: decodedToken.username,
      role: decodedToken.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
