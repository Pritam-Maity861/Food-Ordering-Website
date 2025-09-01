import {Router} from "express";
import { deleteUser, getAllUsers } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/protectedRoutes.middleware.js";
const userRouter=Router();


userRouter.get("/getallUsers",authMiddleware,getAllUsers);
userRouter.delete("/deleteUser/:userId",authMiddleware,deleteUser);


export default userRouter;