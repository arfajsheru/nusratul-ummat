import { Prisma, PrismaClient } from "../generated/prisma/client.js";
import { AppError } from "./apperror.js";

/* ============================================================
   1️⃣ Prisma Error Mapper
============================================================ */

export const handlePrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        throw new AppError("Duplicate record found", 409);
      case "P2025":
        throw new AppError("Record not found", 404);
      case "P2003":
        throw new AppError("Invalid foreign key reference", 400);
      default:
        throw new AppError("Database error occurred", 400);
    }
  }

  throw error;
};

/* ============================================================
   2️⃣ Pagination Utility
============================================================ */

export const getPagination = (page?: unknown, limit?: unknown) => {
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.max(Number(limit) || 10, 1);

  const skip = (pageNumber - 1) * limitNumber;

  return {
    skip,
    take: limitNumber,
    page: pageNumber,
    limit: limitNumber,
  };
};

/* ============================================================
   3️⃣ Transaction Wrapper
============================================================ */

export const withTransaction = async <T>(
  prisma: PrismaClient,
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> => {
  return prisma.$transaction(async (tx) => {
    return callback(tx);
  });
};

/* ============================================================
   4️⃣ Assert Exists Helper
============================================================ */

export const assertExists = <T>(
  value: T | null,
  message = "Resource not found",
): T => {
  if (!value) {
    throw new AppError(message, 404);
  }
  return value;
};

/* ============================================================
   5️⃣ Safe Number Parser
============================================================ */

export const toNumber = (value: unknown, defaultValue = 0): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};
