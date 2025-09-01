import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import toast from "react-hot-toast";

const AddItemForm = () => {
  const { restuId } = useParams();
  const navigate = useNavigate();

  const foodCategories = {
    NorthIndian: "North Indian",
    SouthIndian: "South Indian",
    Chinese: "Chinese",
    Italian: "Italian",
    Continental: "Continental",
    American: "American",
    FastFood: "Fast Food",
    Biryani: "Biryani",
    Pizza: "Pizza",
    Burger: "Burger",
    Sandwich: "Sandwich",
    RollsAndWraps: "Rolls and Wraps",
    Desserts: "Desserts",
    IceCreams: "Ice Creams",
    Beverages: "Beverages",
    JuicesAndSmoothies: "Juices & Smoothies",
    Breakfast: "Breakfast",
    Lunch: "Lunch",
    Dinner: "Dinner",
    Snacks: "Snacks",
    StreetFood: "Street Food",
    HealthyFood: "Healthy Food",
    Vegan: "Vegan",
    PureVeg: "Pure Veg",
    NonVeg: "Non-Veg",
    Seafood: "Seafood",
    Bakery: "Bakery",
    Salads: "Salads",
    Combos: "Combos",
    Thali: "Thali",
    Tandoori: "Tandoori",
    Soups: "Soups",
    Momos: "Momos",
    SweetsAndMithai: "Sweets & Mithai",
  };
  

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    category: "",
    isAvailable: "true", 
  });

  const [image, setImage] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!restuId) {
      toast.error("Restaurant ID not found.");
      return;
    }

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });
      if (image) {
        dataToSend.append("image", image);
      }

      const response = await axiosInstance.post(
        `/foodItems/addFood/${restuId}`,
        dataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Food item added successfully!");
      navigate("/restaurentDashboard");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to add food item."
      );
    }
  };
  console.log(formData);


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Add New Food Item
        </h2>

        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

       
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description *</label>
          <textarea
            name="description"
            rows="3"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Price *</label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Offer Price</label>
            <input
              type="number"
              name="offerPrice"
              value={formData.offerPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">-- Select a Category --</option>
            {Object.entries(foodCategories).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Availability *</label>
          <select
            name="isAvailable"
            value={formData.isAvailable}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Image *</label>
          <input
            type="file"
            accept="image/*"
            required
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Add Food Item
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;
