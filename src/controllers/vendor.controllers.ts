import type { Request, Response } from "express";
import {
  createVendorService,
  getAllVendorUsersService,
  getVendorByIdService,
} from "../services/vendor.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createVendorController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await createVendorService(req.body);

    return sendSuccess({
      res,
      statusCode: 201,
      message: "Vendor created successfully",
      data: result,
    });
  },
);

export const getVendorByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const result = await getVendorByIdService(id);

    return sendSuccess({
      res,
      message: "Vendor details fetched successfully",
      data: result,
    });
  },
);

export const getAllVendorUsersController = asyncHandler(
  async (req: Request, res: Response) => {

    const { vendorId } = req.params;
    const { month, year } = req.query;

    const users = await getAllVendorUsersService(
      Number(vendorId),
      Number(month),
      Number(year)
    );

    return sendSuccess({
      res,
      message: "Vendor users fetched successfully",
      data: users,
    });
  }
);


