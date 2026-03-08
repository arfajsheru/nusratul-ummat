import type { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import {
  createUserByAdminService,
  createUserService,
  forgotPasswordService,
  loginUserService,
  resetPasswordService,
} from "../services/auth.service.js";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await createUserService(req.body);

    return sendSuccess({
      res,
      statusCode: 201,
      message: "User registered successfully",
      data: user,
    });
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await loginUserService(req.body);

    return sendSuccess({
      res,
      message: "Login successful",
      data: result,
    });
  },
);

export const createUserByAdminController = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminUserId, ...data } = req.body;

    const result = await createUserByAdminService(adminUserId, data);

    return sendSuccess({
      res,
      statusCode: 201,
      message: "User created successfully!",
      data: result,
    });
  },
);

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {

    const { identifier } = req.body;

    const result = await forgotPasswordService(identifier);

    return sendSuccess({
      res,
      message: "Reset token generated",
      data: result
    });

  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {

    const { token, password } = req.body;

    const result = await resetPasswordService(token, password);

    return sendSuccess({
      res,
      message: "Password reset successful",
      data: result
    });

  }
);