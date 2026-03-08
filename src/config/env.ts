import type { SignOptions } from "jsonwebtoken";

const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
};

// 👇 tell TS these strings are valid JWT time formats
const asExpires = (value: string): SignOptions["expiresIn"] => {
  return value as SignOptions["expiresIn"];
};

export const ENV = {
  JWT_ACCESS_SECRET: requiredEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: requiredEnv("JWT_REFRESH_SECRET"),
  ACCESS_TOKEN_EXPIRES: asExpires(requiredEnv("ACCESS_TOKEN_EXPIRES")),
  REFRESH_TOKEN_EXPIRES: asExpires(requiredEnv("REFRESH_TOKEN_EXPIRES")),
};