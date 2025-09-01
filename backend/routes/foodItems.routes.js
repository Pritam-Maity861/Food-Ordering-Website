import {Router} from "express";
import { addFoodItems, getAllFood, getFoodById, getFoodByRestu } from "../controllers/items.controller.js";
import { authMiddleware } from "../middlewares/protectedRoutes.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const foodItemRouter=Router();
foodItemRouter.get("/getAllFood",getAllFood);
foodItemRouter.get("/getfoodById/:foodId",authMiddleware,getFoodById);
foodItemRouter.get("/getfoodByRestaurentId/:id",authMiddleware,getFoodByRestu);
foodItemRouter.post("/addFood/:restuId",authMiddleware,upload.single("image"),addFoodItems);

export default foodItemRouter;