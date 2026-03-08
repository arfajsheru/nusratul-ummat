import type { Request, Response } from "express";
import { sendSuccess } from "../utils/apiResponse.js";
import { createUserTypeService, getAllUserTypesService } from "../services/apptypes.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* ============================================================
   CREATE
============================================================ */

export const createUserTypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await createUserTypeService(req.body);

    return sendSuccess({
      res,
      statusCode: 201,
      message: "User type created successfully",
      data: result,
    });
  }
);

export const getAllUserTypesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await getAllUserTypesService();

    return sendSuccess({
      res,
      message: "User types fetched successfully",
      data: result,
    });
  }
);