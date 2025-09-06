import cartModel from "../models/cart.model.js";
import foodItemModel from "../models/foodItem.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";


//add to cart ...
export const AddToCart = asyncHandler(async (req, res) => {
  const userId = req.user;
  if (!userId) {
    throw new ApiError(401, "User not authenticated. Please login to continue.");
  }

  const { restaurantId, foodItemId, quantity } = req.body;

  if (!restaurantId || !foodItemId || !quantity) {
    throw new ApiError(400, "Restaurant ID, foodItemId, and quantity are required.");
  }

  // Validate food item exists
  const foodItem = await foodItemModel.findById(foodItemId);
  if (!foodItem) {
    throw new ApiError(404, "Food item not found.");
  }

  // check food item belongs to given restaurant
  if (String(foodItem.restaurant) !== String(restaurantId)) {
    throw new ApiError(400, "Food item does not belong to this restaurant.");
  }

  // Find user's cart
  let cart = await cartModel.findOne({ userId }).populate("items.foodItemId");

  if (cart) {
    // Ensure cart belongs to same restaurant
    if (String(cart.restaurantId) !== String(restaurantId)) {
      throw new ApiError(
        400,
        "You can only add items from one restaurant at a time."
      );
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => String(item.foodItemId._id) === String(foodItemId)
    );

    if (existingItem) {
      existingItem.quantity = quantity; 
    } else {
      cart.items.push({ foodItemId, quantity });
    }

    await cart.save();
    cart = await cart.populate("items.foodItemId");

    return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart updated successfully."));
  } else {
    // Create new cart
    const newCart = await cartModel.create({
      userId,
      restaurantId,
      items: [{ foodItemId, quantity }],
    });

    const populatedCart = await cartModel
      .findById(newCart._id)
      .populate("items.foodItemId");

    return res
      .status(201)
      .json(new ApiResponse(201, populatedCart, "Item added to cart successfully."));
  }
});


//get card items ...
export const GetCart = asyncHandler(async (req, res) => {
  const userId = req.user;
  if (!userId) {
    throw new ApiError(401, "User not authenticated. Please login to continue.");
  }

  const cart = await cartModel.findOne({ userId }).populate("items.foodItemId");

  if (!cart || cart.items.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, "Cart is empty."));
  }

  res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart retrieved successfully."));
});


//update cart items ...
export const UpdateCart = asyncHandler(async (req, res) => {
  const userId = req.user;
  if (!userId) {
    throw new ApiError(401, "User not authenticated. Please login to continue.");
  }
  const { foodItemId, quantity } = req.body;
  if (!foodItemId || !quantity) {
    throw new ApiError(400, "Food item ID and quantity are required.");
  }
  const cart = await cartModel.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(404, "Cart is empty.");
  }
  const itemIndex = cart.items.findIndex(
    (item) => String(item.foodItemId) === String(foodItemId)
  );
  console.log(itemIndex);
  if (itemIndex === -1) {
    throw new ApiError(404, "Food item not found in cart.");
  }
  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  if (cart.items.length === 0) {
    cart.restaurantId = null;
  }
  await cart.save();
  res.status(200).json(new ApiResponse(200, cart, "Cart updated successfully."));
});

// Delete a food item from the user's cart
export const DeleteCartItems = asyncHandler(async (req, res) => {
  const userId = req.user;
  if (!userId) {
    throw new ApiError(401, "User not authenticated. Please login to continue.");
  }

  const { foodItemId } = req.body;
  if (!foodItemId) {
    throw new ApiError(400, "Food item ID is required.");
  }

  const cart = await cartModel.findOne({ userId });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new ApiError(404, "Cart is empty or does not exist.");
  }

  const itemIndex = cart.items.findIndex(
    (item) => String(item.foodItemId) === String(foodItemId)
  );

  if (itemIndex === -1) {
    throw new ApiError(404, "Food item not found in cart.");
  }

  cart.items.splice(itemIndex, 1);

  if (cart.items.length === 0) {
    await cartModel.deleteOne({ userId });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Cart item deleted and cart is now empty. Cart deleted."));
  }

  await cart.save();
  const populatedCart = await cartModel
    .findOne({ userId })
    .populate("items.foodItemId");

  res
    .status(200)
    .json(new ApiResponse(200, populatedCart, "Cart item deleted successfully."));
});


//delete cart ...
export const ClearCart = asyncHandler(async (req, res) => {
  const userId = req.user;

  if (!userId) {
    throw new ApiError(401, "User not authenticated. Please login to continue.");
  }

  // const cart = await cartModel.findOne({ userId });

 

  await cartModel.deleteOne({ userId });

  res.status(200).json(new ApiResponse(200, null, "Cart deleted successfully."));
});
