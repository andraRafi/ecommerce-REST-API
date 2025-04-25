import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./validateJwtHandler";

export const authorizeRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (req.user?.role !== role) {
      res.status(403).json({
        message: "Access forbidden: insufficient permissions",
      });
    }
    next();
  };
};
