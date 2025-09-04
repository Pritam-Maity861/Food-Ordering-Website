import {Router} from "express"
import { authMiddleware } from "../middlewares/protectedRoutes.middleware.js";
import { checkout, createOrder, getAllOrders, getSingleUserOrder, updateOrderStatus, verifyStripePayment } from "../controllers/order.controller.js";

const orderRouter=Router();

orderRouter.post("/placeOrder",authMiddleware,createOrder);
orderRouter.get("/getSingleUserOrder",authMiddleware,getSingleUserOrder);
orderRouter.get("/getAllOrders",authMiddleware,getAllOrders);
orderRouter.put("/updateOrderStatus/:orderId",authMiddleware,updateOrderStatus);
orderRouter.post("/stripe/create-checkout-session",authMiddleware,checkout);
orderRouter.post("/verify-stripe-payment",verifyStripePayment);

export default orderRouter;