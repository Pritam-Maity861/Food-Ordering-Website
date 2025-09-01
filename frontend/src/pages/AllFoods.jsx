import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import axiosInstance from "../utils/axiosInstance";
import Footer from "../components/Footer";

const AllFoods = () => {
  const [foodData, setFoodData] = useState([]);
  const [filteredFood, setFilteredFood] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const { data } = await axiosInstance.get("/foodItems/getAllFood");
        setFoodData(data.data);
        setFilteredFood(data.data);

        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.data.map(food => food.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching food:", error);
        setFoodData([]);
        setFilteredFood([]);
      }
    };

    fetchFoodData();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredFood(foodData);
    } else {
      const filtered = foodData.filter(item => item.category === category);
      setFilteredFood(filtered);
    }
  };
console.log(foodData)
console.log(categories)
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen p-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
          * {
            font-family: 'Poppins', sans-serif;
          }
        `}</style>

        {/* Heading */}
        <h1 className="text-3xl font-semibold text-gray-800  text-center">
          🍔 Explore Our Foods
        </h1>
        <p className="text-lg text-slate-500 text-center mt-2 mb-4 max-w-2xl mx-auto">
          From cheesy pizzas to spicy curries — find something for every craving.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 my-8">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 text-sm rounded-full font-medium border ${
                activeCategory === cat
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFood.length > 0 ? (
            filteredFood.map((food, index) => (
              <div
                key={index}
                onClick={() => navigate(`/foodDetails/${food._id}`)}
                className="bg-white  border  border-gray-200 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                <img
                  src={food.image || "https://via.placeholder.com/300"}
                  alt={food.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                <p className="pb-3 text-gray-500">{food.category}</p>
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {food.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {food.description || "No description available."}
                  </p>
                  <p className="md:text-xl text-base mt-2 font-medium text-indigo-500">
                        ${food.offerPrice}{" "}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">
                          ${food.price}
                        </span>
                      </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No food items found.</p>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AllFoods;
