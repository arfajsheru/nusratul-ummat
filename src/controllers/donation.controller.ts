import { createManualDonationService, getVendorMonthlyStatsService } from "../services/donation.service.js"
import { sendSuccess } from "../utils/apiResponse.js"
import { AppError } from "../utils/apperror.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import type { Request, Response } from "express"


export const createManualDonationController = asyncHandler(
  async (req: Request, res: Response) => {

    const result = await createManualDonationService(req.body)

    return sendSuccess({
      res,
      message: "Donation added successfully",
      data: result
    })
  }
)

export const getVendorMonthlyStatsController = asyncHandler(
  async (req: Request, res: Response) => {

    const { vendorId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      throw new AppError("Month and Year are required", 400);
    }

    const result = await getVendorMonthlyStatsService(
      Number(vendorId),
      Number(month),
      Number(year)
    );

    return sendSuccess({
      res,
      message: "Vendor monthly stats fetched successfully",
      data: result,
    });
  }
);