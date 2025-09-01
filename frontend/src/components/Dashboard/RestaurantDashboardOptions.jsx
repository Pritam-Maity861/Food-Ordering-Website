import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export const RestaurantDashboardContent = () => {
  const [allOrders, setAllOrders] = useState([]);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)._id : null;

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const { data } = await axiosInstance.get("/order/getAllOrders");
        setAllOrders(data.data.reverse());
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchOrderData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/order/updateOrderStatus/${orderId}`, {
        status: newStatus,
      });
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-blue-100 text-blue-800";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = allOrders.filter((order) => {
    const ownerId =
      order?.resturentId?.ownerId?._id || order?.resturentId?.ownerId;
    return String(ownerId).trim() === String(userId).trim();
  });

  // console.log(filteredOrders);
  // console.log("userId:", userId);
  // allOrders.forEach((order, idx) => {
  //   console.log(`Order ${idx}:`, order.resturentId?.ownerId);
  // });
  console.log(allOrders)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Restaurant Dashboard Overview
        </h1>
        <p className="text-gray-600 text-sm">
          Manage today’s orders, track revenue, and update statuses.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-xl font-medium mb-4">All Orders</p>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, orderIndex) => (
              <div
                key={order._id || orderIndex}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold text-gray-800">
                    Order #{filteredOrders.length - orderIndex}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <ul className="space-y-1 mb-4">
                  {order.items.map((item, idx) => (
                    <li
                      key={item._id || idx}
                      className="flex justify-between text-gray-700"
                    >
                      <span>{item.itemId?.name || "Unnamed item"}</span>
                      {order.deliveryAddress && (
                        <div className="text-sm text-gray-600 mb-2">
                          <p>
                            Delivery to: {order.deliveryAddress.streetNumber},{" "}
                            {order.deliveryAddress.streetName},{" "}
                            {order.deliveryAddress.city},{" "}
                            {order.deliveryAddress.state},{" "}
                            {order.deliveryAddress.country} -{" "}
                            {order.deliveryAddress.pincode}
                          </p>
                          <p>📞 {order.deliveryAddress.phoneNo}</p>
                        </div>
                      )}
                      <span className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Confirmed")}
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  )}

                  {order.status === "Confirmed" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order._id, "Out for Delivery")
                      }
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-purple-600 hover:bg-purple-700"
                    >
                      Mark Out for Delivery
                    </button>
                  )}

                  {order.status === "Out for Delivery" && (
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-green-600 hover:bg-green-700"
                    >
                      Mark Delivered
                    </button>
                  )}

                  {order.status !== "Delivered" &&
                    order.status !== "Cancelled" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "Cancelled")
                        }
                        className="px-4 py-2 rounded-lg text-white text-sm font-medium bg-red-600 hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const RestaurantManagementContent = () => {
  const [restuData, setRestuData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (restuId) => {
    alert(
      "Are you sure you want to delete this restaurant? This action cannot be undone."
    );
    if (
      !window.confirm(
        "Are you sure you want to delete this restaurant? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await axiosInstance.delete(`/resturent/deleteRes/${restuId}`);
      setRestuData((prevData) =>
        prevData.filter((item) => item._id !== restuId)
      );
      toast.success("restaurant deleted successfully");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error("Error while deleting restaurant");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get("/resturent/myResturents");
        setRestuData(data.data || []);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setRestuData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(restuData);

  if (loading) {
    return <p className="text-center text-gray-600">Loading restaurants...</p>;
  }

  if (restuData.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600">No restaurant found.</p>
        <Link
          to={"/addrestaurant"}
          className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
        >
          Add Restaurant
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center">
        <Link
          to={"/addrestaurant"}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm sm:text-base"
        >
          Add Restaurant
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Restaurant Profiles
          </h1>
        </div>

        {restuData.map((restaurant, index) => (
          <div
            className="grid grid-cols-1  lg:grid-cols-2 gap-6 border-b-3 border-gray-200 pb-6 mb-6"
            key={restaurant._id || index}
          >
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <p className="text-lg text-gray-900">{restaurant.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <p className="text-gray-900">
                  {restaurant.street}, {restaurant.city}, {restaurant.country}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{restaurant.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{restaurant.email}</p>
              </div>
              <div className="flex items-center gap-15">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      restaurant.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {restaurant.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {"★".repeat(Math.floor(restaurant.rating || 0))}
                      {"☆".repeat(5 - Math.floor(restaurant.rating || 0))}
                    </div>
                    <span className="text-gray-600">
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col">
              <div className=" w-full h-full rounded-lg overflow-hidden mb-4">
                <img src={restaurant.heroImage} alt="" />
              </div>
              <div className="flex gap-10 justify-center">
                <Link
                  to={`/resturent/${restaurant._id}`}
                  className="w-full sm:w-auto px-6  py-2 rounded-lg bg-green-600 text-white font-medium shadow-md 
                     hover:bg-green-700 active:bg-green-800 transition-colors duration-200"
                >
                  view
                </Link>
                <button
                  className="w-full sm:w-auto px-6  py-2 rounded-lg bg-blue-600 text-white font-medium shadow-md 
                     hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-md 
                     hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
                  onClick={() => handleDelete(restaurant._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MenuManagementContent = () => {
  const [foodData, setFoodData] = useState([]);
  const [filteredFood, setFilteredFood] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser)._id : null;

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/foodItems/getAllFood"
        );
        setFoodData(data.data);
        setFilteredFood(data.data);
        console.log("data is :", data);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set(data.data.map((food) => food.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching food:", error);
        setFoodData([]);
        setFilteredFood([]);
      }
    };

    fetchFoodData();
  }, []);
  // console.log(foodData)

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredFood(foodData);
    } else {
      const filtered = foodData.filter((item) => item.category === category);
      setFilteredFood(filtered);
    }
  };

  // filteredFood.forEach((item, index) => {
  //   const ownerId = item.restaurant?.ownerId._id.toString().trim();
  //   const userIdTrimmed = userId.trim();

  //   console.log(`Item[${index}] ownerId._id: "${ownerId}"`);
  //   console.log(`UserId: "${userIdTrimmed}"`);
  //   console.log(`Is match? ${ownerId === userIdTrimmed}`);
  // });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
            Menu Management
          </h1>
        </div>

        {/* Menu Categories */}
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

        {/* Menu Items */}
        <div className="space-y-4">
          {filteredFood
            .filter(
              (item) =>
                item.restaurant?.ownerId._id.toString().trim() === userId.trim()
            )
            .map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <p className="md:text-xl text-base font-medium text-indigo-500">
                        ${item.offerPrice}{" "}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">
                          ${item.price}
                        </span>
                      </p>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm px-3 py-1 rounded border border-indigo-200 hover:bg-indigo-50">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded border border-red-200 hover:bg-red-50">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
