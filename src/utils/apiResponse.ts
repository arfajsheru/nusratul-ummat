import type { Response } from "express";


interface BaseResponse {
  success: boolean;
  message?: string;
}

interface SuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface ErrorResponse extends BaseResponse {
  success: false;
  error?: unknown;
}


export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message,
  data,
  meta,
}: {
  res: Response;
  statusCode?: number;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
}): Response<SuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};



export const sendError = ({
  res,
  statusCode = 500,
  message = "Internal Server Error",
  error,
}: {
  res: Response;
  statusCode?: number;
  message?: string;
  error?: unknown;
}): Response<ErrorResponse> => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};