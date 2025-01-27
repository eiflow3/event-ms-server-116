import { Request, Response, NextFunction } from "express";

type Roles = string[];

export const authorize = (...allowedRoles: Roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      res.status(401).json({
        message: "Unauthorized - User not authenticated",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: `Forbidden - User not authorized to access this route`,
      });
      return;
    }

    next();
  };
};
