import {Router} from "express"
import { authMiddleware } from "../middlewares/protectedRoutes.middleware.js";
import { AddToCart, ClearCart, DeleteCartItems, GetCart } from "../controllers/cart.controller.js";
const cartRouter=Router();

cartRouter.post("/addtoCart",authMiddleware,AddToCart);
cartRouter.get("/getCart",authMiddleware,GetCart);
cartRouter.delete("/deleteItem",authMiddleware,DeleteCartItems);
cartRouter.delete("/deleteCart",authMiddleware,ClearCart);

export default cartRouter;