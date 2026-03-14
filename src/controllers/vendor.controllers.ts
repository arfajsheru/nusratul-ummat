import type { Request, Response } from "express";
import {
  createVendorService,
  getAllVendorUsersService,
  getPendingVendorMembersService,
  getVendorByIdService,
} from "../services/vendor.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/apperror.js";

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
    const { month, year, status, search } = req.query;

    const users = await getAllVendorUsersService(
      Number(vendorId),
      Number(month),
      Number(year),
      status as "pending" | "paid" | "all",
      search as string
    );

    return sendSuccess({
      res,
      message: "Vendor users fetched successfully",
      data: users,
    });
  }
);


export const getPendingVendorMembersController = asyncHandler(
  async (req: Request, res: Response) => {
    const vendorId = Number(req.params.vendorId);
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    const search = (req.query.search as string) || "";

    if (!month || !year) {
      throw new AppError("Month and Year are required", 400);
    }

    const result = await getPendingVendorMembersService(
      vendorId,
      month,
      year,
      search
    );

    return sendSuccess({
      res,
      message: "Pending members fetched successfully",
      data: result,
    });
  }
);
