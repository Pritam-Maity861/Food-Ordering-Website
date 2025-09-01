import { uploadToCloudinary } from "../lib/cloudinary.lib.js";
import user from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import { ApiResponse } from "../utils/apiresponse.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import refreshTokenModel from "../models/refreshToken.model.js";
import jwt from "jsonwebtoken";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\d{10}$/.test(phone);

//register user ....
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role = "user" } = req.body;

  if (!name || !email || !password || !phone) {
    throw new ApiError(400, "All fields are required.");
  }

  if (!req.file) {
    throw new ApiError(400, "Profile picture is required.");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Invalid email format.");
  }

  if (!isValidPhone(phone)) {
    throw new ApiError(400, "Phone must be a 10-digit number.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await user.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email.");
  }

  let Cloudinary_img_url = null;

  try {
    const imgUrl = await uploadToCloudinary(
      req.file.path,
      req.file.originalname
    );
    Cloudinary_img_url = imgUrl;
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (!Cloudinary_img_url) {
      throw new Error("Cloudinary did not return a valid image URL");
    }
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    throw new ApiError(500, error.message || "Image upload failed");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await user.create({
    name,
    email: normalizedEmail,
    password: hashPassword,
    role,
    phone,
    profilePic: Cloudinary_img_url,
  });

  const createdUser = await user.findById(newUser._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }
  console.log(newUser);
  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "registration successful."));
});

//login user ...
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Please enter your credentials.");
  }
  if (!isValidEmail(email)) {
    throw new ApiError(400, "Invalid email format.");
  }
  const normalizedEmail = email.trim().toLowerCase();

  const isUser = await user.findOne({ email: normalizedEmail });

  if (!isUser) {
    throw new ApiError(400, "Invalid email or password, Please retry.");
  }
  // console.log(isUser);
  const comparePass = await bcrypt.compare(password, isUser.password);
  // console.log(comparePass);
  if (!comparePass) {
    throw new ApiError(400, "Invalid email or password, Please retry.");
  }

  const accessToken = generateAccessToken(isUser._id);
  const refreshToken = generateRefreshToken(isUser._id);

  await refreshTokenModel.deleteMany({ user: isUser._id });
  await refreshTokenModel.create({ token: refreshToken, user: isUser.id });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7day
  });

  const { password: _, ...userWithoutPassword } = isUser.toObject();
  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { accessToken, data: { userWithoutPassword } },
        "Logged in successful."
      )
    );
});

//generate new access_token using refresh_token...
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refresh_token;
  // console.log("Refresh token from cookie:", req.cookies.refresh_token);

  if (!token) {
    throw new ApiError(401, "No refresh token provided");
  }

  const storedToken = await refreshTokenModel.findOne({token});
  if (!storedToken) throw new ApiError(403, "Invalid refresh token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // console.log("Decoded refresh token:", decoded);


    if (!decoded?.userId) {
      throw new ApiError(403, "Invalid token payload");
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(decoded.userId);

    return res.status(200).json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken },
        "New access token generated successfully."
      )
    );
  } catch (err) {
    throw new ApiError(403, "Refresh token expired or invalid");
  }
}); 

//logout user .....
export const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  await refreshTokenModel.findOneAndDelete({ token });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully" });
});


//me
export const getme = asyncHandler((req, res) => {
  const data = req.user;
  res.status(200).json(new ApiResponse(200, data, "get me"))
})