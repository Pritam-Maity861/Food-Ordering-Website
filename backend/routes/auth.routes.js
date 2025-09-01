import {Router} from "express"
import { getme, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/Auth.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/protectedRoutes.middleware.js";

const authRouter=Router();

authRouter.post("/register",upload.single("profilePic"),registerUser);
authRouter.post("/signin",loginUser);
authRouter.post("/refreshAccessToken",refreshAccessToken);
authRouter.post("/logout",logoutUser);
authRouter.post("/me",authMiddleware,getme);

export default authRouter;