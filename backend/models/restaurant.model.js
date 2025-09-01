import mongoose from "mongoose";

const resturentSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
    },
    logo: {  
        type: String,
        required: true
    },
    heroImage: { 
        type: String,
        required: true
    },
    street: String,
    city: String,
    country: String,
    lat: Number,
    lng: Number,
    isApproved: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\d{10}$/, "Please provide a valid phone number"],
    },
    email: {
        type: String
    }

}, { timestamps: true })

export default mongoose.model("Resturent", resturentSchema);