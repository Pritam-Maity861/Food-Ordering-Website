import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { CartContext } from "../context/cartContext/CartContext";
import toast from "react-hot-toast";

const FoodDetails = () => {
  const [count, setCount] = useState(0);
  const [foodData, setFoodData] = useState(null);
  const [cartData, setCartData] = useState(null);
  const {fetchCart}=useContext(CartContext)

  const { id } = useParams();

  // Fetch food details
  useEffect(() => {
    const fetchedFood = async () => {
      try {
        const { data } = await axiosInstance.get(`/foodItems/getfoodById/${id}`);
        setFoodData(data.data);
      } catch (error) {
        console.log("Error fetching food data:", error);
        setFoodData(null);
      }
    };

    fetchedFood();
  }, [id]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axiosInstance.get("/cart/getCart");
        setCartData(data.data);
  
        const item = data.data?.items?.find(
          (i) => i.foodItemId === id || i.foodItemId?._id === id
        );
  
        if (item) {
          setCount(item.quantity); 
        } else {
          setCount(0); 
        }
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    };
  
    fetchCart();
  }, [id]);
  

  const handleAddToCart = async () => {
    try {
      const payload = {
        restaurantId: foodData?.restaurant?._id,
        foodItemId: foodData?._id,
        quantity: count, 
      };

      const { data } = await axiosInstance.post("/cart/addtoCart", payload);

      console.log("Item added/updated in cart:", data);
      await fetchCart();
      setCartData(data.data);
      toast.success("Item added to cart successfully!");
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to add item to cart");
    }
  };

  return (
    <div className="h-screen w-screen">
      <Navbar />
      <div className="flex h-auto w-full items-center p-10 gap-20">
        <div>
          <img
            className="w-full max-w-sm h-60 object-cover rounded-xl"
            src={foodData?.image}
            alt={foodData?.name}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-slate-800">
              {foodData?.name}
            </h3>
            <span className="px-3 py-1 bg-red-500 text-white rounded text-sm">
              SALE
            </span>
          </div>

          <p className="max-w-xs text-sm mt-2 text-slate-500">
            {foodData?.description}
          </p>

          <div className="flex items-end justify-between mt-3">
            <p className="md:text-xl text-base font-medium text-indigo-500">
              ${foodData?.offerPrice}{" "}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                ${foodData?.price}
              </span>
            </p>
          </div>

          {/* Counter */}
          <div className="flex items-center justify-center gap-2 w-24 h-[34px] bg-indigo-500/25 rounded select-none">
            <button
              onClick={() => setCount((prev) => Math.max(prev - 1, 0))}
              className="cursor-pointer text-lg px-2 h-full"
            >
              -
            </button>
            <span className="w-6 text-center">{count}</span>
            <button
              onClick={() => setCount((prev) => prev + 1)}
              className="cursor-pointer text-lg px-2 h-full"
            >
              +
            </button>
          </div>

          {/* Add/Update Cart */}
          {count > 0 && (
            <button
              onClick={handleAddToCart}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {cartData?.items?.some((i) => i.foodItemId === id)
                ? "Update Cart"
                : `Add ${count} to Cart`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
