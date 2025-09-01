import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

const TopResturents = () => {
  const scrollRef = useRef(null);
  const scrollAmount = 370;
  const [restuData, setRestuData] = useState("");
  
 const navigate=useNavigate();
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
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/resturent/getAllResturent"
        );
        // console.log(data);
        setRestuData(data.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setRestuData("No restaurant found.");
      }
    };

    fetchData();
  }, []);

  // console.log(restuData)

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
        🍴 Top Restaurants for Ordering
      </h1>
      <p className="text-sm text-slate-500 text-center mt-2 mb-6 max-w-lg mx-auto">
        Your favorite meals, delivered from the best in town.
      </p>

      {restuData.length > 0 ? (
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
              {restuData.map((restaurant, index) => (
                <div key={index}>
                  <div
                  onClick={() => isLoggedIn?navigate(`/resturent/${restaurant._id}`):navigate("/login")}
                  className="group min-w-[350px] max-w-[350px] min-h-[400px] rounded-xl shadow-lg bg-slate-100 cursor-pointer transition-all duration-200 ease-out hover:bg-gray-400">
                    <div className="overflow-hidden rounded-t-xl">
                      <img
                        src={
                          restaurant.heroImage ||
                          "https://via.placeholder.com/400x300"
                        }
                        alt={restaurant.name}
                        className="w-full h-60 object-cover transition duration-300 ease-in-out group-hover:opacity-80 group-hover:scale-105 rounded-t-xl"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white">
                        {restaurant.name||"no restaurents found"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-200">
                        {restaurant.description || "No description available."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No restaurants available.</p>
      )}
    </div>
  );
};

export default TopResturents;
