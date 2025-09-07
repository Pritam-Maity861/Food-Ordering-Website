import React, {  useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import axiosInstance from "../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const RestaurentDetails = () => {
  const [restaurentData, setRestaurentData] = useState("");
  const [restaurentFood, setRestaurentFood] = useState([]);
  const [restaurantFoodOwner, setRestaurantFoodOwner] = useState(false);
  
  const navigate = useNavigate();
  // const restuId = restaurentData._id;
  // console.log(restuId);

  const { id } = useParams();
  useEffect(() => {
    const fetchRestaurent = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/resturent/findResById/${id}`
        );

        setRestaurentData(data.data);

        if(data.data.ownerId._id === JSON.parse(localStorage.getItem("user"))._id){
          setRestaurantFoodOwner(true);
        }
      } catch (error) {
        console.log("Error fetching food data:", error);
        setRestaurentData("No restaurent items found.");
      }
    };

    fetchRestaurent();
  }, [id]);
  // console.log(restaurentData);
  // console.log(restaurantFoodOwner)

  useEffect(() => {
    const fetchRestaurentFood = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/foodItems/getfoodByRestaurentId/${id}`
        );

        setRestaurentFood(data.data);
        console.log(data)
      } catch (error) {
        console.log("Error fetching food data:", error);
        setRestaurentFood([]);
      }
    };

    fetchRestaurentFood();
  }, [id]);

  console.log(restaurentFood);

  return (
    <div className="min-h-screen bg-gray-50">
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      * {
        font-family: 'Poppins', sans-serif;
      }
    `}</style>
  
    <Navbar />
  
    {/* Main Section */}
    <div className="flex flex-col items-center px-4 py-8">
      {/* Image */}
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl shadow-lg">
        <img
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover transition-transform duration-500 hover:scale-105"
          src={restaurentData?.heroImage || restaurentData.name}
          alt="Restaurant Dish"
        />
      </div>
  
      {/* Details */}
      <div className="w-full max-w-6xl bg-white mt-6 rounded-xl shadow p-4 sm:p-6">
        <p className="text-base sm:text-lg font-semibold text-gray-800">
          {restaurentData.city || "No city available"}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
          {restaurentData.name || "No name available"}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          {restaurentData.description || "No description available."}
        </p>
  
        {/* Add Item Button (Visible for Owner) */}
        {restaurantFoodOwner && (
          <div className="flex justify-end mt-4">
            <Link
              to={`/add-food/${restaurentData._id}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
            >
              Add New Item
            </Link>
          </div>
        )}
  
        {/* Top Dishes */}
        <div className="mt-6">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
              Restaurant Top Dishes
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Explore our best-selling and most loved dishes
            </p>
          </div>
  
          {/* Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurentFood?.length > 0 ? (
              restaurentFood.map((dish, idx) => (
                <div
                  onClick={() => navigate(`/foodDetails/${dish._id}`)}
                  key={idx}
                  className="bg-white border gap-2 cursor-pointer border-gray-200 rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
                >
                  <img
                    src={dish.image || "https://via.placeholder.com/300"}
                    alt={dish.name}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                  <p className="text-sm text-gray-500">{dish.category}</p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {dish.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {dish.description || "No description available."}
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-indigo-500 text-base md:text-lg font-medium">
                      ${dish.offerPrice}
                      <span className="text-gray-500 line-through ml-1 text-xs">
                        ${dish.price}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 mt-4 text-center col-span-full">
                No top dishes available.
              </p>
            )}
          </div>
        </div>
  
        {/* Owner & Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Owner Info */}
          <div className="flex flex-col sm:flex-row justify-between border rounded-lg p-4 border-gray-200">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">Owner:</h3>
              <p className="text-sm text-gray-700">
                {restaurentData.ownerId?.name || "No owner available"}
              </p>
              <p className="text-sm text-gray-700">
                {restaurentData.ownerId?.email || "No email available"}
              </p>
              <p className="text-sm text-gray-700">
                {restaurentData.ownerId?.phone || "No phone available"}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center justify-center">
              <img
                src={restaurentData.ownerId?.profilePic}
                alt="Owner"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          </div>
  
          {/* Restaurant Contact Info */}
          <div className="border rounded-lg p-4 border-gray-200">
            <h3 className="text-lg font-semibold mb-1">Restaurant Contacts:</h3>
            <p className="text-sm text-gray-700">
              {restaurentData.email || "No email available"}
            </p>
            <p className="text-sm text-gray-700">
              {restaurentData.phone || "No phone available"}
            </p>
            <p className="text-sm text-gray-700">
              {restaurentData.street || "No street available"}
            </p>
            <p className="text-sm text-gray-700">
              {restaurentData.country || "No country available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default RestaurentDetails;
