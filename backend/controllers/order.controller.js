import foodItemModel from "../models/foodItem.model.js";
import orderModel from "../models/order.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

//create Order...
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { resturentId, items, deliveryAddress, paymentMethod } = req.body;

  if (!resturentId || !items || !deliveryAddress) {
    throw new ApiError(400, "All fields are required.");
  }
  if (!items || items.length === 0) {
    throw new ApiError(400, "No items in order.");
  }

  let subtotal = 0;

  for (const item of items) {
    const food = await foodItemModel.findById(item.foodItemId);
    if (!food) {
      throw new ApiError(404, "Food item not found.");
    }

    const priceToUse = food.offerPrice ?? food.price; 
    subtotal += priceToUse * (item.quantity || 1);
  }

  const tax = +(subtotal * 0.02).toFixed(2); 
  const shipping = subtotal >= 300 ? 0 : 10; 
  const totalAmount = +(subtotal + tax + shipping).toFixed(2);

  const newOrder = await orderModel.create({
    userId,
    resturentId,
    items: items.map(item => ({
      itemId: item.foodItemId,
      quantity: item.quantity || 1,
    })),
    totalAmount,
    deliveryAddress,
    paymentMethod,
    paymentStatus: "Pending",
    status: "Pending",
  });

  res
    .status(201)
    .json(new ApiResponse(201, newOrder, "Order created successfully."));
});


//get all orders of all user...
export const getAllOrders = asyncHandler(async (req, res) => {
   
    const orders = (await orderModel.find().populate("items.itemId").populate({
      path: "resturentId",
      populate: {
        path: "ownerId",
        model: "User",
        select: "-password -role -__v -createdAt -updatedAt", 
      }
    }))
    if(!orders){
      res.status(200).json(new ApiResponse(200,{},"No orders found."))
    }

    res.status(200).json(new ApiResponse(200, orders, " All Orders fetched successfully."));
});


//get all orders of a single user ...
export const getSingleUserOrder = asyncHandler(async (req, res) => {
  const userId = req.user;
  if (!userId) {
      return res.status(401).json({ message: "User not authenticated. Please login to continue." });
  }

  const orders = await orderModel.find({ userId }).populate("items.itemId").populate("resturentId");

  res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully."));
});


//update order status....
export const updateOrderStatus=asyncHandler(async (req,res) => {
  const {orderId}=req.params;
  const {status}=req.body;

  if(!orderId){
    res.status(400).json(new ApiError(400,"oredrId not found."));
  }

  if(!status){
    return res.status(400).json(new ApiError(400, "Status is required."));
  }

  const validStatuses = ["Pending", "Confirmed", "Out for Delivery", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json(new ApiError(400, "Invalid status value."));
  }

  const updatedOrder = await orderModel.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  )
  .populate("items.itemId")
  .populate("resturentId");

  if (!updatedOrder) {
    return res.status(404).json(new ApiError(404, "Order not found."));
  }
  console.log(updatedOrder);

  return res
  .status(200)
  .json(new ApiResponse(200, updatedOrder, "Order status updated successfully."));

}
)

