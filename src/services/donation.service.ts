import prisma from "../config/database.js";
import type { DonationType } from "../generated/prisma/enums.js";
import { AppError } from "../utils/apperror.js";

interface createDonationPayload {
  userId: number;
  vendorId: number;
  amount: number;
  donationType: DonationType;
  createdBy?: number;
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

export const getVendorMonthlyStatsService = async (
  vendorId: number,
  month: number,
  year: number
) => {
  if (!vendorId) {
    throw new AppError("VendorId is required", 400);
  }

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  // 1️⃣ total users
  const totalUsers = await prisma.user.count({
    where: { vendorId },
  });

  // 2️⃣ monthly donations
  const donations = await prisma.donation.findMany({
    where: {
      vendorId,
      status: "SUCCESS",
      donationDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      amount: true,
      donationType: true,
      userId: true,
    },
  });

  // 3️⃣ total donation
  const monthTotal = donations.reduce((sum, d) => sum + d.amount, 0);

  // 4️⃣ type wise calculation
  const monthZakaat = donations
    .filter((d) => d.donationType === "ZAKAAT")
    .reduce((sum, d) => sum + d.amount, 0);

  const monthLillah = donations
    .filter((d) => d.donationType === "LILLAH")
    .reduce((sum, d) => sum + d.amount, 0);

  const monthSadaqah = donations
    .filter((d) => d.donationType === "SADAQAH")
    .reduce((sum, d) => sum + d.amount, 0);

  const monthGeneral = donations
    .filter((d) => d.donationType === "GENERAL")
    .reduce((sum, d) => sum + d.amount, 0);

  // 5️⃣ unique paid users
  const paidUsersSet = new Set(donations.map((d) => d.userId));

  const totalPaidUsers = paidUsersSet.size;

  // 6️⃣ pending users
  const totalPendingUsers = totalUsers - totalPaidUsers;

  return {
    month,
    year,

    monthTotal,
    monthZakaat,
    monthLillah,
    monthSadaqah,
    monthGeneral,

    totalUsers,
    totalPaidUsers,
    totalPendingUsers,
  };
};
