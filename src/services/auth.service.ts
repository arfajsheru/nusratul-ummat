import bcrypt from "bcrypt";
import { AppError } from "../utils/apperror.js";
import prisma from "../config/database.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utils.js";
import { generateTempPassword } from "../utils/passwordgenerator.js";

interface CreateUserInput {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  userTypeId: number;
  vendorId: number;
}

interface LoginInput {
  identifier: string; // email OR phone
  password: string;
}

interface CreateUserByAdminInput {
  fullname: string;
  email: string;
  phone: string;
  userTypeId: number;
}

const validateCreateUserInput = async (data: CreateUserInput) => {
  if (!data.fullname || data.fullname.trim().length < 3) {
    throw new AppError("Full name must be at least 3 characters", 400);
  }
  if (!data.email || !data.email.includes("@")) {
    throw new AppError("Valid email is required", 400);
  }
  if (!data.phone || data.phone.length < 8) {
    throw new AppError("Valid phone number is required", 400);
  }

  if (!data.password || data.password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  if (!data.userTypeId || typeof data.userTypeId !== "number") {
    throw new AppError("Valid userTypeId is required", 400);
  }

  if (!data.vendorId) {
    throw new AppError("VendorId is required", 400);
  }

  const vendor = await prisma.vendor.findUnique({
    where: { id: data.vendorId },
  });

  if (!vendor) {
    throw new AppError("Vendor not found", 404);
  }
};

export const createUserService = async (data: CreateUserInput) => {
  // step 1 validate input
  await validateCreateUserInput(data);

  // step 2 dublicate email and phonenumber
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: data.phone }],
    },
  });

  if (existingUser) {
    throw new AppError("User with this email or phone already exists", 409);
  }

  //   step 3 has password
  const hashpassword = await bcrypt.hash(data.password, 12);

  //   step 4 create user
  const user = await prisma.user.create({
    data: {
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
      passwordHash: hashpassword,
      userTypeId: data.userTypeId,
      vendorId: data.vendorId,
    },
    select: {
      id: true,
      fullname: true,
      phone: true,
      userTypeId: true,
      email: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUserService = async (data: LoginInput) => {
  const { identifier, password } = data;

  //   step 1 basic validation
  if (!identifier || identifier.trim().length === 0) {
    throw new AppError("Email or phone is required", 400);
  }

  if (!password || password.length < 6) {
    throw new AppError("Password is required", 400);
  }

  //   step 2 detect email or phone
  const isEmail = identifier.includes("@");
  const user = await prisma.user.findFirst({
    where: isEmail ? { email: identifier } : { phone: identifier },
    include: { userType: true, vendor: true },
  });

  //   step 3 check passowrd right or wrong

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  //   step 4 check account status
  if (!user.isActive) {
    throw new AppError("Account is disabled", 403);
  }

  if (!user.isVerified) {
    throw new AppError("Account is not verified", 403);
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.userType.name,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // match ENV

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashedRefreshToken,
      expiresAt: expiryDate,
    },
  });

  const activeTokens = await prisma.refreshToken.count({
    where: { userId: user.id },
  });

  if (activeTokens >= 5) {
    // delete oldest token
    const oldestToken = await prisma.refreshToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    if (oldestToken) {
      await prisma.refreshToken.delete({
        where: { id: oldestToken.id },
      });
    }
  }

  return {
    user: {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      userTypeId: user.userTypeId,
      role: user.userType?.name,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },

    vendor: user.vendor
      ? {
          id: user.vendor.id,
          organizationName: user.vendor.organizationName,
          email: user.vendor.email,
          phone: user.vendor.phone,
          isActive: user.vendor.isActive,
          isVerified: user.vendor.isVerified,
          razorpayAccountId: user.vendor.razorpayAccountId,
        }
      : null,
    accessToken,
    refreshToken,
  };
};

export const createUserByAdminService = async (
  adminUserId: number,
  data: CreateUserByAdminInput,
) => {
  const admin = await prisma.user.findUnique({
    where: { id: adminUserId },
    include: { userType: true },
  });

  if (!admin) {
    throw new AppError("Admin not found", 404);
  }

  if (admin.userTypeId !== 1) {
    throw new AppError("Only admin can create users", 403);
  }
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { phone: data.phone }],
    },
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const tempPassword = generateTempPassword();
  const hashpassword = await bcrypt.hash(tempPassword, 12);

  const user = await prisma.user.create({
    data: {
      fullname: data.fullname,
      phone: data.phone,
      email: data.email,
      passwordHash: hashpassword,
      userTypeId: data.userTypeId,
      vendorId: admin.vendorId,
      createdBy: adminUserId,
    },
    select: {
      id: true,
      fullname: true,
      phone: true,
      email: true,
      createdAt: true,
    },
  });
  return {
    user,
    tempPassword,
  };
};

export const forgotPasswordService = async (identifier: string) => {
  if (!identifier) {
    throw new AppError("Email or phone required", 400);
  }

  const isEmail = identifier.includes("@");

  const user = await prisma.user.findFirst({
    where: isEmail ? { email: identifier } : { phone: identifier },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const resetToken = generateTempPassword(10);
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: expiry,
    },
  });

  return {
    resetToken,
  };
};

export const resetPasswordService = async (token: string, password: string) => {
  if (!token) {
    throw new AppError("Reset token required", 400);
  }

  if (!password || password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: {
        gte: new Date(),
      },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired token", 400);
  }

  const hashpassword = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashpassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });
  return {
    message: "Password reset successful",
  };
};
