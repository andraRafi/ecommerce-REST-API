import bcryptjs from "bcryptjs";
import { IUser, User } from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../middleware/validateJwtHandler";
import Joi from "joi";

type LoginRequestBody = {
  username: string;
  password: string;
};

export const register = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, address, role } = req.body;

    const registerSchema = Joi.object({
      username: Joi.string().required().min(3).max(30),
      address: Joi.string().required(),
      password: Joi.string().required().min(8),
      email: Joi.string().required().email(),
      role: Joi.string().required().valid("seller", "user"),
    });
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
      res.status(400);
      throw new Error("email already registered");
    }

    const hashPassword: string = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      address,
      role,
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    const loginSchema = Joi.object({
      username: Joi.string().required().min(3).max(30),
      password: Joi.string().required().min(8),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.status(401);
      throw new Error("username or password invalid!");
    }

    const matchPassword = await bcryptjs.compare(password, user.password);
    if (!matchPassword) {
      res.status(401);
      throw new Error("username or password invalid!");
    }

    const accessToken = jwt.sign(
      {
        role: user.role,
        _id: user._id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
      },
    });

    console.log("sukses");
  } catch (error) {
    next(error);
  }
};

export const curentAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?._id) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json({
      status: "success",
      message: "Current account details",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
