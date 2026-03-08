import { Router } from "express";
import {
  registerController,
  loginController,
  createUserByAdminController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register", registerController);

router.post("/login", loginController);
router.post("/admin/create-user", createUserByAdminController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

export default router;
