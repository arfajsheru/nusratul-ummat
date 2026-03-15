import prisma from "../config/database.js";
import type { DonationType } from "../generated/prisma/enums.js";
import { AppError } from "../utils/apperror.js";

interface CreateVendorInput {
  organizationName: string;
  registrationNumber?: string;
  panNumber?: string;
  gstNumber?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  pincode: string;
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  razorpayAccountId?: string;
}

const validateCreateVendor = (data: CreateVendorInput) => {
  if (!data.organizationName || data.organizationName.trim().length < 3) {
    throw new AppError("Organization name must be at least 3 characters", 400);
  }

  if (!data.email || !data.email.includes("@")) {
    throw new AppError("Valid email is required", 400);
  }

  if (!data.phone || data.phone.length < 8) {
    throw new AppError("Valid phone number is required", 400);
  }

  if (!data.addressLine1) {
    throw new AppError("Address Line 1 is required", 400);
  }

  if (!data.city) {
    throw new AppError("City is required", 400);
  }

  if (!data.state) {
    throw new AppError("State is required", 400);
  }

  if (!data.pincode || data.pincode.length < 5) {
    throw new AppError("Valid pincode is required", 400);
  }
};

export const createVendorService = async (data: CreateVendorInput) => {
  validateCreateVendor(data);

  // Check duplicate email
  const existingEmail = await prisma.vendor.findUnique({
    where: { email: data.email },
  });

  if (existingEmail) {
    throw new AppError("Vendor with this email already exists", 409);
  }

  // Check optional unique fields
  if (data.registrationNumber) {
    const exists = await prisma.vendor.findUnique({
      where: { registrationNumber: data.registrationNumber },
    });
    if (exists) {
      throw new AppError("Registration number already exists", 409);
    }
  }

  if (data.panNumber) {
    const exists = await prisma.vendor.findUnique({
      where: { panNumber: data.panNumber },
    });
    if (exists) {
      throw new AppError("PAN number already exists", 409);
    }
  }

  if (data.gstNumber) {
    const exists = await prisma.vendor.findUnique({
      where: { gstNumber: data.gstNumber },
    });
    if (exists) {
      throw new AppError("GST number already exists", 409);
    }
  }

  const vendor = await prisma.vendor.create({
    data: {
      ...data,
      country: data.country || "India",
    },
  });

  return vendor;
};

export const getVendorByIdService = async (id: number) => {
  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: {
      users: true,
      donations: true,
    },
  });

  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }

  return vendor;
};

export const getAllVendorUsersService = async (
  vendorId: number,
  month: number,
  year: number,
  status?: "pending" | "paid" | "all",
  search?: string,
) => {
  if (!vendorId) {
    throw new AppError("VendorId is required", 400);
  }

  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  const users = await prisma.user.findMany({
    where: {
      vendorId,

      ...(search && {
        OR: [
          {
            fullname: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: search,
            },
          },
        ],
      }),
    },

    select: {
      id: true,
      fullname: true,
      email: true,
      phone: true,
      userType: {
        select: {
          name: true,
        },
      },
      isActive: true,
      createdAt: true,

      donations: {
        where: {
          donationDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        select: {
          status: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (users.length === 0) {
    throw new AppError("No users found for this vendor", 404);
  }

  const usersWithPaymentStatus = users.map((user) => {
    const paymentStatus =
      user.donations.length > 0 &&
      user.donations.some((d) => d.status === "SUCCESS")
        ? "SUCCESS"
        : "PENDING";

    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      userType: user.userType.name,
      isActive: user.isActive,
      createdAt: user.createdAt,
      paymentStatus,
    };
  });

  let filteredUsers = usersWithPaymentStatus;

  if (status === "pending") {
    filteredUsers = usersWithPaymentStatus.filter(
      (u) => u.paymentStatus === "PENDING",
    );
  }

  if (status === "paid") {
    filteredUsers = usersWithPaymentStatus.filter(
      (u) => u.paymentStatus === "SUCCESS",
    );
  }

  return filteredUsers;
};

export const getPendingVendorMembersService = async (
  vendorId: number,
  month: number,
  year: number,
  search: string,
) => {
  if (!vendorId) {
    throw new AppError("VendorId is required", 400);
  }

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);

  const users = await prisma.user.findMany({
    where: {
      vendorId,

      ...(search && {
        OR: [
          {
            fullname: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: search,
            },
          },
        ],
      }),
    },

    select: {
      id: true,
      fullname: true,
      phone: true,

      donations: {
        where: {
          donationDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        select: {
          status: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingUsers = users
    .filter(
      (user) =>
        !user.donations.some((donation) => donation.status === "SUCCESS"),
    )
    .map((user) => ({
      id: user.id,
      fullname: user.fullname,
      phoneNumber: user.phone,
    }));

  return pendingUsers;
};

export const getMonthlySummaryService = async (
  vendorId: number,
  month: number,
  year: number,
) => {
  // Validation
  if (!vendorId) {
    throw new AppError("VendorId is required", 400);
  }

  if (!month) {
    throw new AppError("Month is required", 400);
  }

  if (!year) {
    throw new AppError("Year is required", 400);
  }

  if (month < 1 || month > 12) {
    throw new AppError("Month must be between 1 and 12", 400);
  }

  // Date range
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  // Get users
  const users = await prisma.user.findMany({
    where: { vendorId },
    select: {
      id: true,
      fullname: true,
    },
  });

  // Get donations
  const donations = await prisma.donation.findMany({
    where: {
      vendorId,
      donationDate: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      userId: true,
      amount: true,
      donationType: true,
      status: true,
    },
  });

  // Map payments
  const donationMap = new Map<number, (typeof donations)[number]>();

  console.log("Donations Map:", donationMap);
  donations.forEach((d) => {
    if (d.status === "SUCCESS") {
      donationMap.set(d.userId, d);
    }
  });

  console.log("donantions", donations);

  // Members list
  const members = users.map((user) => {
    const donation = donationMap.get(user.id);

    return {
      id: user.id,
      fullname: user.fullname,
      donationType: donation?.donationType || null,
      amount: donation?.amount || 0,
      status: donation ? "PAID" : "PENDING",
    };
  });


  console.log("Members with payment status:", members);

  // Counts
  const paidMembers = members.filter((m) => m.status === "PAID").length;
  const pendingMembers = members.length - paidMembers;

  // Category totals
  const categoryTotals: Record<DonationType, number> = {
    ZAKAAT: 0,
    SADAQAH: 0,
    LILLAH: 0,
    GENERAL: 0,
  };

  donations.forEach((d) => {
    if (d.status === "SUCCESS") {
      categoryTotals[d.donationType] += d.amount;
    }
  });

  // Total amount
  const totalAmount = donations
    .filter((d) => d.status === "SUCCESS")
    .reduce((sum, d) => sum + d.amount, 0);

  return {
    totalAmount,
    paidMembers,
    pendingMembers,
    categoryTotals,
    members,
  };
};
