import jwt, { type SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env.js";

interface AccessTokenPayload {
  userId: number;
  email: string;
  role: string;
}

interface RefreshTokenPayload {
  userId: number;
}

// ✅ create strongly typed options FIRST
const accessTokenOptions: SignOptions = {
  expiresIn: ENV.ACCESS_TOKEN_EXPIRES,
};

const refreshTokenOptions: SignOptions = {
  expiresIn: ENV.REFRESH_TOKEN_EXPIRES,
};

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, accessTokenOptions);
};

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, refreshTokenOptions);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET);
};