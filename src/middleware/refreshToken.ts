import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401);
      throw new Error("Refresh token not found");
    }
    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!,
      (err: any, decoded: any) => {
        if (err) {
          res.status(403);
          throw new Error("Invalid or expired refresh token");
        }

        const newAccessToken = jwt.sign(
          { username: decoded.username, _id: decoded._id },
          process.env.JWT_SECRET!,
          { expiresIn: "1m" }
        );
        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    next(error);
  }
};
