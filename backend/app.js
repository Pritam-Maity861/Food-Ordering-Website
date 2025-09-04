import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {notFound,errorHandler} from "./middlewares/errorHandler.js"
import authRouter from "./routes/auth.routes.js";
import resturentRouter from "./routes/resturent.routes.js";
import foodItemRouter from "./routes/foodItems.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import userRouter from "./routes/user.routes.js";

const app=express();
dotenv.config();

//middlewares...
app.use(cors({
  origin: [
    "https://food-ordering-website-frontend-ru03.onrender.com", 
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


//routes..
// app.get("/",(req,res) => {
//     res.json({"Message":"we are creating online food ordering app."})
//   })

  app.use("/api/v1/auth/",authRouter);
  app.use("/api/v1/resturent/",resturentRouter);
  app.use("/api/v1/foodItems/",foodItemRouter);
  app.use("/api/v1/cart/",cartRouter);
  app.use("/api/v1/order/",orderRouter);
  app.use("/api/v1/user/",userRouter);


  //error handlers...
app.use(notFound); 
app.use(errorHandler);


export default app;
