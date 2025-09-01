import {Router} from "express"
import { authMiddleware } from "../middlewares/protectedRoutes.middleware.js";
import { createOrder, getAllOrders, getSingleUserOrder, updateOrderStatus } from "../controllers/order.controller.js";

const orderRouter=Router();

orderRouter.post("/placeOrder",authMiddleware,createOrder);
orderRouter.get("/getSingleUserOrder",authMiddleware,getSingleUserOrder);
orderRouter.get("/getAllOrders",authMiddleware,getAllOrders);
orderRouter.put("/updateOrderStatus/:orderId",authMiddleware,updateOrderStatus);

export default orderRouter;