// import prisma from "../config/database.js";
// import { CampaignStatus } from "../generated/prisma/enums.js";
// import { AppError } from "../utils/apperror.js";

// interface CreateCampaignInput {
//   vendorId: number;
//   title: string;
//   description: string;
//   coverImage?: string;
//   targetAmount: number;
//   startDate: Date;
//   endDate?: Date;
//   isFeatured?: boolean;
// }

// const validateCreateCampaign = (data: CreateCampaignInput) => {
//   if (!data.vendorId || typeof data.vendorId !== "number") {
//     throw new AppError("Valid vendorId is required", 400);
//   }

//   if (!data.title || data.title.trim().length < 5) {
//     throw new AppError("Title must be at least 5 characters", 400);
//   }

//   if (!data.description || data.description.trim().length < 10) {
//     throw new AppError("Description must be at least 10 characters", 400);
//   }

//   if (!data.targetAmount || data.targetAmount <= 0) {
//     throw new AppError("Target amount must be greater than 0", 400);
//   }

//   if (!data.startDate) {
//     throw new AppError("Start date is required", 400);
//   }
// };

// export const createCampaignService = async (data: CreateCampaignInput) => {
//   validateCreateCampaign(data);

//   const vendor = await prisma.vendor.findUnique({
//     where: { id: data.vendorId },
//   });

//   if (!vendor) {
//     throw new AppError("Vendor not found", 404);
//   }

//   const campaign = await prisma.campaign.create({
//     data: {
//       vendorId: data.vendorId,
//       title: data.title,
//       description: data.description,
//       coverImage: data.coverImage,
//       targetAmount: data.targetAmount,
//       startDate: new Date(data.startDate),
//       endDate: data.endDate ? new Date(data.endDate) : null,
//       isFeatured: data.isFeatured || false,
//       status: CampaignStatus.ACTIVE,
//     },
//   });

//   return campaign;
// };

// export const getAllCampaignsService = async (page = 1, limit = 10) => {
//   const skip = (page - 1) * limit;

//   const [campaigns, total] = await Promise.all([
//     prisma.campaign.findMany({
//       skip,
//       take: limit,
//       orderBy: { createdAt: "desc" },
//     }),
//     prisma.campaign.count(),
//   ]);

//   return {
//     total,
//     page,
//     limit,
//     campaigns,
//   };
// };

// export const getCampaignByIdService = async (id: number) => {
//   const campaign = await prisma.campaign.findUnique({
//     where: { id },
//     include: {
//       donations: true,
//     },
//   });

//   if (!campaign) {
//     throw new AppError("Campaign not found", 404);
//   }

//   return campaign;
// };
