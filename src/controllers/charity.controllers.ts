import { createCharityDistributionService, getAllVendorCharityServices, getVendorCharitySummaryService, updateCharityDistributionService } from "../services/charity.service.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";

export const createCharityDistributionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { createdBy, ...data } = req.body;

    const result = await createCharityDistributionService({
      createdBy,
      ...data,
    });

    return sendSuccess({
      res,
      statusCode: 201,
      message: "Charity distribution created successfully!",
      data: result,
    });
  },
);

export const getAllVendorCharityController = asyncHandler(
  async (req: Request, res: Response) => {
    const vendorId = Number(req.params.vendorId);

    const result = await getAllVendorCharityServices(vendorId);


    return sendSuccess({
      res,
      statusCode: 200,
      message: "Vendor charity distributions fetched successfully!",
      data: result,
    });
  },
);

export const updateCharityDistributionController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, ...data } = req.body;

    const result = await updateCharityDistributionService({
      id,
      ...data,
    });

    return sendSuccess({
      res,
      statusCode: 200,
      message: "Charity distribution updated successfully!",
      data: result,
    });
  },
);

export const getVendorCharitySummaryController = asyncHandler(
  async (req: Request, res: Response) => {
    const vendorId = Number(req.params.vendorId);

    const result = await getVendorCharitySummaryService(vendorId);

    return sendSuccess({
      res,
      statusCode: 200,
      message: "Vendor charity summary fetched successfully!",
      data: result,
    });
  },
);