import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10}$/, "Please provide a valid phone number"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    address: {
      streetName: { type: String, trim: true },
      streetNumber: { type: String, trim: true },
      city: String,
      state: String,
      country: String,
      pincode: {
        type: String,
        trim: true,
        match: [/^\d{5,6}$/, "Please provide a valid pincode"],
      },
      phoneNo: {
        type: String,
        trim: true,
        match: [/^\d{10}$/, "Please provide a valid phone number"],
      },
    },
    role: {
      type: String,
      enum: ["user","restaurantOwner", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
