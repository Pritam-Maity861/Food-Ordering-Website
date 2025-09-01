import mongoose from "mongoose";

const connectDB=async () => {
  try {
    const connectionInstance=await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`mongoDB connected successfully, DB Host: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("mongoDB connection failed!!",error);
    process.exit(1);
  }
}

export default connectDB;