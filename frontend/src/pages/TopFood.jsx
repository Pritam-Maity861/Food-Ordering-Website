import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TopFood = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const scrollAmount = 370;
  const [foodItemData, setFoodItemData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  
    // Check if user is logged in by checking localStorage
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  
  

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/foodItems/getAllFood"
        );
        // const {data}=await axiosInstance.get("/foodItems/getAllFood");
        console.log(data);
        setFoodItemData(data.data);
      } catch (error) {
        console.log("Error fetching food data:", error);
        setFoodItemData([]);
      }
    };

    fetchFoodData();
  }, []);

  console.log(foodItemData);

   

  return (
    <div className="bg-gray-50 mt-30">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
                * {
                    font-family: 'Poppins', sans-serif;
                }
                .scroll-container::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

      <h1 className="text-3xl  font-semibold text-gray-700 mt-10 text-center">
        🌟 Top-Dishes to Try
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 mb-6 max-w-lg mx-auto">
        Discover the highest-rated meals everyone’s raving about—deliciousness
        guaranteed.
      </p>

      {foodItemData.length > 0 ? (
        <div className="relative max-w-[1150px] mx-auto px-4">
          {/* Top-right buttons */}
          <div className="flex justify-end mb-3 gap-2 pr-2">
            <button
              onClick={() => scroll("left")}
              className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow"
              title="Previous"
            >
              ◀
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow"
              title="Next"
            >
              ▶
            </button>
          </div>

          {/* Card Scroll Container */}
          <div className="overflow-hidden ">
            <div
              ref={scrollRef}
              className="scroll-container flex gap-8 overflow-x-auto scroll-smooth"
            >
              {foodItemData.map((food, index) => (
                <div
                  key={index}
                  onClick={() => isLoggedIn?navigate(`/foodDetails/${food._id}`):navigate("/login")}
                  
                  className="group min-w-[200px] max-w-[200px] rounded-xl shadow-lg bg-gray-50 cursor-pointer transition-all duration-200 ease-out hover:bg-gray-400 "
                >
                  <div className="group cursor-pointer flex items-center justify-center px-2">
                    <img
                      className="w-full h-35 object-cover transition duration-300 ease-in-out group-hover:opacity-80 group-hover:scale-105 rounded-t-xl "
                      src={food.image}
                      alt={food.name}
                    />
                  </div>
                  <div className="text-gray-500/60 p-3 text-sm">
                    <p>{food.category}</p>
                    <p className="text-gray-700 font-medium text-wrap text-lg truncate w-full">
                      {food.name}
                    </p>

                    <div className="flex items-end justify-between mt-3">
                      <p className="md:text-xl text-base font-medium text-indigo-500">
                        ${food.offerPrice}{" "}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">
                          ${food.price}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No Food available.</p>
      )}
    </div>
  );
};

export default TopFood;
