// import type { Request, Response } from "express";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { sendSuccess } from "../utils/apiResponse.js";
// import {
//   createCampaignService,
//   getAllCampaignsService,
//   getCampaignByIdService,
// } from "../services/campaign.service.js";


// export const createCampaignController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const result = await createCampaignService(req.body);

//     return sendSuccess({
//       res,
//       statusCode: 201,
//       message: "Campaign created successfully",
//       data: result,
//     });
//   }
// );


// export const getAllCampaignsController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;

//     const result = await getAllCampaignsService(page, limit);

//     return sendSuccess({
//       res,
//       message: "Campaigns fetched successfully",
//       data: result,
//     });
//   }
// );


// export const getCampaignByIdController = asyncHandler(
//   async (req: Request, res: Response) => {
//     const id = Number(req.params.id);

//     const result = await getCampaignByIdService(id);

//     return sendSuccess({
//       res,
//       message: "Campaign details fetched successfully",
//       data: result,
//     });
//   }
// );