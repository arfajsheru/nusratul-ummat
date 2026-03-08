// import type { Request, Response } from "express";
// import { createDonationService } from "../services/donation.service.js";

// import { sendSuccess } from "../utils/apiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// export const createDonationController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const result = await createDonationService(req.body);

//     return sendSuccess({
//       res,
//       statusCode: 201,
//       message: "Donation created successfully (Pending Payment)",
//       data: result,
//     });
//   }
// );