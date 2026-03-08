import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/apperror.js";

interface ErrorResponse {
  success: false;
  message: string;
  stack?: string;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
): Response => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let stack: string | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
  }

  console.error({
    path: req.originalUrl,
    method: req.method,
    message,
  });

  const responseBody: ErrorResponse = {
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && stack ? { stack } : {}),
  };

  return res.status(statusCode).json(responseBody);
};
