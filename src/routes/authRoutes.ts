import express from "express";
import {
  login,
  register,
  curentAccount,
  logout,
} from "../controller/authController";
import { validateToken } from "../middleware/validateJwtHandler";
import { refreshToken } from "../middleware/refreshToken";

export const Router = express.Router();
Router.post("/register", register);
Router.post("/login", login);
Router.post("/refresh-token", refreshToken);
Router.get("/curent", validateToken, curentAccount);
Router.delete("/logout", logout);
