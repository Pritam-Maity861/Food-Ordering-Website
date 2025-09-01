import { uploadToCloudinary } from "../lib/cloudinary.lib.js";
import foodItemModel from "../models/foodItem.model.js";
import restaurantModel from "../models/restaurant.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";

//add fooditems...
export const addFoodItems = asyncHandler(async (req, res) => {
  const { restuId } = req.params;
  if (!restuId) {
    throw new ApiError(400, "Restaurent id not found.");
  }

  const { name, description,offerPrice, price, category, isAvailable } = req.body;
  
  if (!name || !price || !category || !isAvailable) {
    throw new ApiError(400, "All fields are required.");
  }

  if (!req.file) {
    throw new ApiError(400, "Food image is required.");
  }

  let foodImgUrl;
  try {
    const imgUrl = await uploadToCloudinary(
      req.file.path,
      req.file.originalname
    );
    foodImgUrl = imgUrl;
    console.log(foodImgUrl);
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    if (!foodImgUrl) {
      throw new Error("Cloudinary did not return a valid image url");
    }
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw new ApiError(500, error.message || "Image upload failed");
  }

  const newFoodItem = await foodItemModel.create({
    restaurant: restuId,
    name,
    description,
    offerPrice,
    price,
    isAvailable,
    category,
    image: foodImgUrl,
  });

  if (!newFoodItem) {
    throw new ApiError(500, "Something went wrong while adding new FoodItem");
  }
  console.log(newFoodItem);
  res
    .status(201)
    .json(new ApiResponse(201, newFoodItem, "FoodItem added successfully."));
});

//get all food Items...
export const getAllFood = asyncHandler(async (req, res) => {
  const allFoods = await foodItemModel.find().populate({
    path: "restaurant",
    populate: {
      path: "ownerId",
      model: "User",
      select: "-password -role -__v -createdAt -updatedAt", 
    }
  });
  if (!allFoods) {
    throw new ApiError(400, "No food found.");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, allFoods, "allfood items fetched successfully.")
    );
});

//get food items by Food Id...
export const getFoodById = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  if (!foodId) {
    throw new ApiError(400, "food Id not found.");
  }

  const Food = await foodItemModel.findById(foodId).populate("restaurant", "name email phone city street country lat lng logo heroImage description");
  if (!Food) {
    throw new ApiError(400, "Food not found.");
  }


  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        Food,
        "Food item fetched successfully."
      )
    );
});

//get food items by resturent Id...
export const getFoodByRestu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Resturent Id not found.");
  }

  const resturent = await restaurantModel.findById(id);
  if (!resturent) {
    throw new ApiError(400, "Resturent not found.");
  }

  const allFoodsByRestu = await foodItemModel.find({restaurant:id});
  if (!allFoodsByRestu || allFoodsByRestu.length === 0) {
    res.status(200).json( new ApiResponse(200, {},"No food items found for this resturent."));
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        allFoodsByRestu,
        "allfood items fetched successfully."
      )
    );
});

//delete FoodItem...
export const deleteFoodItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Id not found.");
  }
  const deleteFoodItem = await foodItemModel.findByIdAndDelete(id);

  if (!deleteFoodItem) {
    throw new ApiError(404, "something went wrong while deleting resturent");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Food item deleted successfully."));
});

//update FoodItem ...
export const updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Food ID is required.");
  }

  const { name, description, price, category, isAvailable } = req.body;

  const imageFile = req.file;
  let imgUrl;

  if (imageFile) {
    const uploadedImage = await uploadToCloudinary(
      imageFile.path,
      imageFile.originalname
    );

    if (!uploadedImage || !uploadedImage.url) {
      throw new ApiError(500, "Cloudinary did not return a valid image URL.");
    }

    imgUrl = uploadedImage.url;

    if (fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }
  }

  const updatedData = {
    name,
    description,
    price,
    isAvailable,
    category,
  };

  if (imgUrl) {
    updatedData.image = imgUrl;
  }

  const updatedFoodItem = await foodItemModel.findByIdAndUpdate(
    id,
    updatedData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedFoodItem) {
    throw new ApiError(404, "Food not found.");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedFoodItem, "Food Item updated successfully.")
    );
});


