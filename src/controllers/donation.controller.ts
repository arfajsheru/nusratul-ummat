import { createManualDonationService } from "../services/donation.service.js"
import { sendSuccess } from "../utils/apiResponse.js"
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