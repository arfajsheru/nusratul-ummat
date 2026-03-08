import prisma from "../config/database.js";
import type {
  CharityPurpose,
  DonationType,
} from "../generated/prisma/enums.js";
import { AppError } from "../utils/apperror.js";

interface CreateCharityDistributionInput {
  vendorId: number;
  name: string;
  amount: number;
  notes: string;
  charityType: DonationType;
  purpose: CharityPurpose;
  createdBy: number;
}

interface UpdateCharityDistributionInput {
  id: number;
  name?: string;
  amount?: number;
  notes?: string;
  charityType?: DonationType;
  purpose?: CharityPurpose;
}

export const createCharityDistributionService = async (
  data: CreateCharityDistributionInput,
) => {
  const { name, charityType, purpose, vendorId, amount, notes, createdBy } =
    data;
  if (!name) {
    throw new AppError("Name is required", 400);
  }

  if (!amount || amount <= 0) {
    throw new AppError("Valid amount is required", 400);
  }
  if (!vendorId) {
    throw new AppError("VendorId is required", 400);
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }

  const charityDistribution = await prisma.charityDistribution.create({
    data: {
      name,
      charityType,
      purpose,
      amount,
      vendorId,
      notes,
      createdBy,
    },
  });

  return charityDistribution;
};

export const getAllVendorCharityServices = async (vendorId: number) => {
  if (!vendorId) {
    throw new AppError("VendorId is required", 400);
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }

  const charities = await prisma.charityDistribution.findMany({
    where: {
      vendorId: vendorId,
    },
    orderBy: {
      distributionDate: "desc",
    },
  });

  return charities;
};

export const updateCharityDistributionService = async (
  data: UpdateCharityDistributionInput,
) => {
  const { id, name, amount, notes, charityType, purpose } = data;

  if (!id) {
    throw new AppError("charity distribution id is required", 400);
  }

  const existingCharity = await prisma.charityDistribution.findUnique({
    where: { id: id },
  });

  if (!existingCharity) {
    throw new AppError("Charity distribution not found", 404);
  }

  const updateCharity = await prisma.charityDistribution.update({
    where: { id: id },
    data: {
      name,
      amount,
      charityType,
      purpose,
      notes,
    },
  });
  return updateCharity;
};

export const getVendorCharitySummaryService = async (vendorId: number) => {
  if (!vendorId) {
    throw new AppError("VendorId is required", 400);
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }

  const donationAggregate = await prisma.donation.aggregate({
    where: { vendorId: vendorId, status: "SUCCESS" },
    _sum: {
      amount: true,
    },
  });

  const distributionAggregate = await prisma.charityDistribution.aggregate({
    where: { vendorId: vendorId },
    _sum: {
      amount: true,
    },
  });


  const totalFamilies = await prisma.charityDistribution.count({
    where: {vendorId: vendorId}
  })
  const totalDonations = donationAggregate._sum.amount || 0;
  const totalDistributed = distributionAggregate._sum.amount || 0;


  const remainingBalance = totalDonations - totalDistributed;

  return {
    totalDonations,
    totalDistributed,
    remainingBalance,
    totalFamilies
  };
};
