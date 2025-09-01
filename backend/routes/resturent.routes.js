import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/protectedRoutes.middleware.js";
import {
    addRestaurant,
  aproveResturent,
  deleteResturent,
  findOwnerRes,
  findResByID,
  getAllResturent,
  updateRestaurant,
} from "../controllers/resturent.controller.js";

const resturentRouter = Router();

resturentRouter.post(
  "/addResturent",
  authMiddleware,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
  ]),
  addRestaurant
);
resturentRouter.get("/getAllResturent", getAllResturent);
resturentRouter.get("/myResturents", authMiddleware, findOwnerRes);
resturentRouter.get("/findResById/:id", authMiddleware, findResByID);
resturentRouter.delete("/deleteRes/:id", authMiddleware, deleteResturent);
resturentRouter.put(
  "/updateRes/:id",
  authMiddleware,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
  ]),
  updateRestaurant
);
resturentRouter.put("/aproveRes/:id", authMiddleware, aproveResturent);

export default resturentRouter;
