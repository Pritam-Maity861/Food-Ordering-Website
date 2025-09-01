import mongoose from "mongoose";

const FoodMenuCategory = {
    NorthIndian: "NorthIndian",
    SouthIndian: "SouthIndian",
    Chinese: "Chinese",
    Italian: "Italian",
    Continental: "Continental",
    American: "American",
    FastFood: "FastFood",
    Biryani: "Biryani",
    Pizza: "Pizza",
    Burger: "Burger",
    Sandwich: "Sandwich",
    RollsAndWraps: "RollsAndWraps",
    Desserts: "Desserts",
    IceCreams: "IceCreams",
    Beverages: "Beverages",
    JuicesAndSmoothies: "JuicesAndSmoothies",
    Breakfast: "Breakfast",
    Lunch: "Lunch",
    Dinner: "Dinner",
    Snacks: "Snacks",
    StreetFood: "StreetFood",
    HealthyFood: "HealthyFood",
    Vegan: "Vegan",
    PureVeg: "PureVeg",
    NonVeg: "NonVeg",
    Seafood: "Seafood",
    Bakery: "Bakery",
    Salads: "Salads",
    Combos: "Combos",
    Thali: "Thali",
    Tandoori: "Tandoori",
    Soups: "Soups",
    Momos: "Momos",
    SweetsAndMithai: "SweetsAndMithai"
};

const foodSchema = new mongoose.Schema({
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resturent",
        required:true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        enum: Object.values(FoodMenuCategory), 
        required: true
    },
    image: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

export default mongoose.model("Fooditem",foodSchema);

