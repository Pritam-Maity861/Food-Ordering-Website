//user curd operation...

import userModel from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

//get all users...
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find().select("-password");
  if (!users) {
    throw new ApiError(400, "no users found.");
  }
  res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully."));
});
//delete  users...
export const deleteUser = asyncHandler(async (req, res) => {
    const {userId}=req.params;
  const deleteAUSer = await userModel.findByIdAndDelete(userId);
  if (!deleteAUSer) {
    throw new ApiError(400, "Something went wrong while deleteing user.");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully."));
});