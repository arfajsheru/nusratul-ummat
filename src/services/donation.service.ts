import prisma from "../config/database.js";
import type { DonationType } from "../generated/prisma/enums.js";
import { AppError } from "../utils/apperror.js";

interface createDonationPayload {
  userId: number;
  vendorId: number;
  amount: number;
  donationType: DonationType;
  createdBy?: number
}

export const createManualDonationService = async (
  data: createDonationPayload,
) => {
  const { userId, vendorId, amount, donationType, createdBy } = data;

  if (!userId) throw new AppError("UserId is required", 400);
  if (!amount || amount <= 0) throw new AppError("Valid amount required", 400);
  if (!vendorId) throw new AppError("VendorId is required", 400);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new AppError("User not found", 404);

  const donation = await prisma.donation.create({
    data: {
      userId,
      vendorId,
      amount,
      status: "SUCCESS",
      donationType,
      recordedBy: createdBy,
    },
  });

  return donation;
};
