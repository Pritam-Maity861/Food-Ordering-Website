import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/order/getSingleUserOrder");
        setOrders(data.data.reverse());
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  console.log(orders);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600 text-sm">
          Track your order history and status updates.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">You have not placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order._id || index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                {/* Order header */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order #{orders.length - index}
                    </p>
                    <p className="text-sm text-gray-500">
                      Placed on:{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Preparing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <ul className="space-y-1 mb-4">
                  {order.items.map((item, idx) => (
                    <li
                      key={item._id || idx}
                      className="flex justify-between text-gray-700"
                    >
                      <span>
                        {item.itemId?.name || "Unnamed item"} x {item.quantity}
                      </span>
                      
                      <div className="flex flex-col gap-5 "> 
                      <span>
                        {order.resturentId &&(
                          <div className=" text-gray-600 mb-2">
                            <p className="text-lg">From: {order.resturentId.name}</p>
                            <p className="text-gray-500">📞 {order.resturentId.phone}</p>
                          </div>
                        )}
                      </span>
                      <span>
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
                      </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ₹{item.itemId.offerPrice * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between border-t pt-2 text-gray-800 font-semibold">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
