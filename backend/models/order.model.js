import mongoose from 'mongoose';    

const orderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    resturentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resturent"
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fooditem",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Confirmed","Out for Delivery", "Delivered", "Cancelled"],
        default: "Pending"
    },
    deliveryAddress: {
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
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["Cash on delivery", "Stripe"],
        default: "Cash on delivery"
    },

}, {timestamps:true});

export default mongoose.model("Order",orderSchema);