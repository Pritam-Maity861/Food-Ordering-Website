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
        <div className="w-[90%] overflow-hidden rounded-2xl shadow-lg">
          <img
            className="w-full h-[350px] object-cover transition-transform duration-500 hover:scale-105"
            src={restaurentData?.heroImage || restaurentData.name}
            alt="Restaurant Dish"
          />
        </div>

        {/* Details */}
        <div className="w-[90%] bg-white mt-6 rounded-xl shadow p-6">
          <p className="text-lg font-semibold text-gray-800">
            {restaurentData.city || "No city available"}
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            {restaurentData.name || "No name available"}
          </h2>
          <p className="text-gray-600 mt-2">
            {restaurentData.description || "No description available."}
          </p>

          {/* Top Dishes Section */}
          <div className="w-[100%] bg-white mt-8 rounded-xl shadow p-6">
            {(restaurantFoodOwner) && (
              <div className="relative left-0 flex justify-end mb-4">
              <div className=" flex gap-2">
                <Link 
                to={`/add-food/${restaurentData._id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base">
                  Add New Item
                </Link>
              </div>
            </div>
             )}
            <div className="text-center ">
              <h1 className="text-3xl font-bold text-gray-900">
                Restaurant Top Dishes
              </h1>
              <p className="text-gray-600 mt-2 mb-3">
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
                    <p>{dish.category}</p>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {dish.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {dish.description || "No description available."}
                    </p>
                    <div className="mt-auto flex justify-between items-center">
                      <p className="md:text-xl text-base font-medium text-indigo-500">
                        ${dish.offerPrice}{" "}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">
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

          <div className="grid grid-cols-2 gap-20  mt-6">
            <div className="flex justify-around  border-2 rounded p-2 border-gray-200">
              <div className="">
                <h3 className="text-xl">Owner:</h3>
                <span className="font-medium text-gray-700">
                  {restaurentData.ownerId?.name || "No owner available"}
                </span>
                <br />
                <span className=" text-gray-700">
                  {restaurentData.ownerId?.email || "No owner available"}
                </span>
                <br />
                <span className=" text-gray-700">
                  {restaurentData.ownerId?.phone || "No owner available"}
                </span>
              </div>

              <div className="flex justify-center items-center">
                <img
                  src={restaurentData.ownerId?.profilePic}
                  alt=""
                  className="w-20 h-20 rounded-full cursor-pointer"
                />
              </div>
            </div>
            <div className="flex flex-col  border-2 rounded p-4 border-gray-200">
              <h3 className="text-xl">Restaurent Contacts:</h3>
              <span className="font-medium text-gray-700">
                {restaurentData.email || "No email available"}
              </span>
              <span className=" text-gray-700">
                {restaurentData.phone || "No phone available"}
              </span>
              <span className=" text-gray-700">
                {restaurentData.street || "No street available"}
              </span>
              <span className=" text-gray-700">
                {restaurentData.country || "No country available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurentDetails;
