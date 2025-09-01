import { uploadToCloudinary } from "../lib/cloudinary.lib.js";
import restaurantModel from "../models/restaurant.model.js";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import fs from "fs";

//create resturent ...
export const addRestaurant = asyncHandler(async (req, res) => {
  const { name, description, street, city, country, lat, lng, phone, email } =
    req.body;

  if (!name || !city || !country || !street || !phone || !email) {
    throw new ApiError(400, "All fields are required.");
  }

  const ownerId = req.user;
  if (!ownerId) {
    throw new ApiError(400, "Owner ID not found. Something went wrong.");
  }

  const user = await userModel.findById(ownerId);
  if (!user) {
    throw new ApiError(400, "User not found.");
  }

  const existingRestaurant = await restaurantModel.findOne({ name });
  if (existingRestaurant) {
    throw new ApiError(
      400,
      `A restaurant with the name '${name}' already exists.`
    );
  }

  if (!req.files || !req.files.logo || !req.files.heroImage) {
    throw new ApiError(400, "Both logo and hero image are required.");
  }

  let logoUrl = null;
  let heroImageUrl = null;

  try {
    const logoPath = req.files.logo[0].path;
    logoUrl = await uploadToCloudinary(
      logoPath,
      req.files.logo[0].originalname
    );
    if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);

    const heroPath = req.files.heroImage[0].path;
    heroImageUrl = await uploadToCloudinary(
      heroPath,
      req.files.heroImage[0].originalname
    );
    if (fs.existsSync(heroPath)) fs.unlinkSync(heroPath);

    if (!logoUrl || !heroImageUrl) {
      throw new Error("Cloudinary did not return valid image URLs.");
    }
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    if (req.files.logo && fs.existsSync(req.files.logo[0].path)) {
      fs.unlinkSync(req.files.logo[0].path);
    }
    if (req.files.heroImage && fs.existsSync(req.files.heroImage[0].path)) {
      fs.unlinkSync(req.files.heroImage[0].path);
    }
    throw new ApiError(500, error.message || "Image upload failed");
  }

  const newRestaurant = await restaurantModel.create({
    ownerId,
    name,
    email,
    phone,
    city,
    street,
    country,
    lat,
    lng,
    logo: logoUrl,
    heroImage: heroImageUrl,
    description,
  });

  if (!newRestaurant) {
    throw new ApiError(
      500,
      "Something went wrong while registering restaurant."
    );
  }

  res
    .status(201)
    .json(
      new ApiResponse(201, newRestaurant, "Restaurant created successfully.")
    );
});

//get all resturents ...
export const getAllResturent = asyncHandler(async (req, res) => {
  const getAllRes = await restaurantModel.find();
  if (!getAllRes) {
    throw new ApiError(400, "no resturent found.");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, getAllRes, "All resturents fetched successfully.")
    );
});

//find resturent of resturent owner..
export const findOwnerRes = asyncHandler(async (req, res) => {
  const ownerId = req.user;
  if (!ownerId) {
    throw new ApiError(400, "ownerId not found.");
  }
  const resturents = await restaurantModel
    .find({ ownerId })
    .select("-password");
  console.log(resturents);
  if (!resturents || resturents.length === 0) {
    throw new ApiError(404, "No restaurants found for this owner.");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        resturents,
        "owner all resturent fetched successfully."
      )
    );
});

//find resturent by ID...
export const findResByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Id not found.");
  }
  const resturent = await restaurantModel.findById(id).populate("ownerId", "-password");
  console.log(resturent);
  if (!resturent) {
    throw new ApiError(404, "restaurant found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, resturent, "resturent fetched successfully."));
});

//Delete resturents...
export const deleteResturent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Id not found.");
  }
  const resturent = await restaurantModel.findByIdAndDelete(id);

  if (!resturent) {
    throw new ApiError(404, "something went wrong while deleting resturent");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "resturent deleted successfully."));
});

// update restaurant by owner...
export const updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Restaurant ID is required.");
  }

  const { name, description, street, city, country, lat, lng, phone, email } =
    req.body;

  let logoImageUrl;
  let heroImageUrl;

  if (req.files?.logoImage && req.files.logoImage[0]) {
    const uploadedLogo = await uploadToCloudinary(
      req.files.logoImage[0].path,
      req.files.logoImage[0].originalname
    );

    if (!uploadedLogo?.url) {
      throw new ApiError(
        500,
        "Cloudinary did not return a valid logo image URL."
      );
    }
    logoImageUrl = uploadedLogo.url;
    fs.existsSync(req.files.logoImage[0].path) &&
      fs.unlinkSync(req.files.logoImage[0].path);
  }

  if (req.files?.heroImage && req.files.heroImage[0]) {
    const uploadedHero = await uploadToCloudinary(
      req.files.heroImage[0].path,
      req.files.heroImage[0].originalname
    );

    if (!uploadedHero?.url) {
      throw new ApiError(
        500,
        "Cloudinary did not return a valid hero image URL."
      );
    }
    heroImageUrl = uploadedHero.url;
    fs.existsSync(req.files.heroImage[0].path) &&
      fs.unlinkSync(req.files.heroImage[0].path);
  }

  const updatedData = {
    name,
    description,
    street,
    city,
    country,
    lat,
    lng,
    phone,
    email,
  };

  if (logoImageUrl) {
    updatedData.logoImage = logoImageUrl;
  }
  if (heroImageUrl) {
    updatedData.heroImage = heroImageUrl;
  }

  const updatedRestaurant = await restaurantModel.findByIdAndUpdate(
    id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedRestaurant) {
    throw new ApiError(404, "Restaurant not found.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedRestaurant,
        "Restaurant updated successfully."
      )
    );
});

//resturent approval by the admin...
export const aproveResturent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Restaurant ID is required.");
  }

  const { isApproved } = req.body;

  const updatedData = {
    isApproved,
  };

  const updatedRestaurant = await restaurantModel.findByIdAndUpdate(
    id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedRestaurant) {
    throw new ApiError(404, "Restaurant not found.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedRestaurant, "Restaurant aproved by admin.")
    );
});
