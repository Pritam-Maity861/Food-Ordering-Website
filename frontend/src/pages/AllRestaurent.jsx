import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const AllRestaurent = () => {
  const [restuData, setRestuData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/resturent/getAllResturent"
        );
        setRestuData(data.data);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setRestuData([]);
      }
    };

    fetchData();
  }, []);

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

        {/* Page Heading */}
        <h1 className="text-3xl font-semibold text-gray-800 mt-4 text-center">
          🍽️ Explore Our Restaurants
        </h1>
        <p className="text-lg text-slate-500 text-center mt-2 mb-4 max-w-2xl mx-auto">
          Discover a world of flavors, all in one place.
        </p>
        <p className="text-sm text-slate-500 text-center mb-8 max-w-4xl mx-auto">
          Browse through our diverse collection of restaurants — from cozy cafes
          to fine dining spots. Whether you're craving local favorites or
          international cuisine, we've got something delicious waiting for you.
        </p>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restuData.length > 0 ? (
            restuData.map((restaurant, index) => (
              restaurant.isApproved&&(
                <div
                key={index}
                onClick={() => navigate(`/resturent/${restaurant._id}`)}
                className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
              >
                <img
                  src={restaurant.heroImage || "https://via.placeholder.com/300"}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {restaurant.description || "No description available."}
                  </p>
                </div>
              </div>
              )
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No restaurants found.
            </p>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AllRestaurent;
