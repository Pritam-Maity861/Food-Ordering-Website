import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken=(userId) => {
  return jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"15m"});
}

export const generateRefreshToken=(userId) => {
  return jwt.sign({userId},process.env.JWT_REFRESH_SECRET ,{expiresIn:"7d"});
}