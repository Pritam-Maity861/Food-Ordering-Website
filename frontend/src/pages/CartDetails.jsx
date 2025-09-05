import { useState, useEffect, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { CartContext } from "../context/cartContext/CartContext";
import AddressForm from "../components/AddressForm";
import axios from "axios";
import { toast } from "react-hot-toast";
import {loadStripe} from '@stripe/stripe-js';
import { API_BASE_URL } from "../config";

const CartDetails = () => {
  const [showAddress, setShowAddress] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Cash on delivery");
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [orderMessage, setOrderMessage] = useState("");
  // const strigifyCartdata = JSON.stringify(cartData);

  const { fetchCart } = useContext(CartContext);

  // Fetch cart data
  useEffect(() => {
    const fetchCartdata = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/cart/getCart`,
        {headers: { authorization: `Bearer ${localStorage.getItem("accessToken")}` }}
        );
        setCartData(data.data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartdata();
  }, []);


  
  // Update quantity
  const handleQuantityChange = async (foodItemId, newQuantity) => {
    try {
      const { data } = await axiosInstance.post("/cart/addtoCart", {
        foodItemId,
        quantity: newQuantity,
        restaurantId: cartData.restaurantId,
      });
      await fetchCart();
      setCartData(data.data);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  console.log(cartData)

  // Remove item
  const handleRemoveItem = async (foodItemId) => {
    try {
      const { data } = await axiosInstance.delete("/cart/deleteItem", {
        data: { foodItemId },
      });
      await fetchCart();
      setCartData(data.data);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress) {
      return setOrderMessage(" Please select or add a delivery address.");
    }
  
    try {
      if (paymentMethod === "Stripe") {
        const _stripe = await loadStripe(
          "pk_test_51S1L8I7ZOHQPYIcxeTUVrMHoxVmMfBWvF9qai0DcgjkIdpUs98B0jtNN1M97ObkNldukpUPuhNi0PTXX3r4QzIXK00NqsjJdFb"
        );
  
        const response = await axiosInstance.post(
          "/order/stripe/create-checkout-session",
          {
            products: cartData.items.map((item) => ({
              foodItemId: item.foodItemId, 
              quantity: item.quantity,
            })),
            resturentId: cartData.restaurantId,
            address: deliveryAddress, 
          },
          {
            headers: {
              "authorization": `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        const sessionUrl = response.data.data.url;
  
        // Redirect to Stripe checkout
        window.location.href = sessionUrl;
        return;
      }
  
      // COD fallback
      const { data } = await axiosInstance.post("/order/placeOrder", {
        resturentId: cartData.restaurantId,
        items: cartData.items.map((item) => ({
          foodItemId: item.foodItemId._id,
          quantity: item.quantity,
        })),
        deliveryAddress,
        paymentMethod,
      });
  
      setOrderMessage(data.message);
      toast.success("Order placed successfully!");
  
      // Clear cart after placing order
      await axios.delete(`${API_BASE_URL}/cart/deleteCart`,{
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      });

      setCartData({ items: [] });
      await fetchCart();

    } catch (error) {
      console.error("Error placing order:", error);
      setOrderMessage(
        error.response?.data?.data?.message || " Failed to place order"
      );
    }
  };


  if (loading) return <p className="text-center py-10">Loading your cart...</p>;
  if (!cartData || cartData.items.length === 0)
    return <p className="text-center py-10">Your cart is empty.</p>;

  // Totals
  const subtotal = cartData.items.reduce(
    (acc, item) =>
      acc +
      (item.foodItemId?.offerPrice ?? item.foodItemId?.price ?? 0) *
        item.quantity,
    0
  );
  
  const tax = +(subtotal * 0.02).toFixed(2);
  const shipping = subtotal >= 300 ? 0 : 10;
  const total = +(subtotal + tax + shipping).toFixed(2);

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-indigo-500">
            {cartData.items.length} Items
          </span>
        </h1>

        {/* Items list */}
        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartData.items.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            {/* Product details */}
            <div className="flex items-center md:gap-6 gap-3">
              <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                <img
                  className="max-w-full h-full object-cover"
                  src={item.foodItemId?.image}
                  alt={item.foodItemId?.name}
                />
              </div>
              <div>
                <p className="hidden md:block font-semibold">
                  {item.foodItemId?.name}
                </p>
                <div className="font-normal text-gray-500/70">
                  <div className="flex items-center">
                    <p>Qty:</p>
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.foodItemId?._id, +e.target.value)
                      }
                      className="outline-none ml-2 border px-1"
                    >
                      {Array(10)
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtotal */}
            <p className="text-center">
              ${(item.foodItemId?.offerPrice * item.quantity).toFixed(2)}
            </p>

            {/* Remove button */}
            <button
              onClick={() => handleRemoveItem(item.foodItemId?._id)}
              className="cursor-pointer mx-auto"
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        {/* Delivery Address */}
        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          {!deliveryAddress && !showAddress && (
            <button
              onClick={() => setShowAddress(true)}
              className="text-indigo-500 hover:underline mt-2"
            >
              Add Address
            </button>
          )}

          {showAddress && (
            <AddressForm
              onSave={(address) => {
                setDeliveryAddress(address);
                setShowAddress(false);
              }}
              onCancel={() => setShowAddress(false)}
            />
          )}

          {deliveryAddress && !showAddress && (
            <div className="mt-3 bg-white p-3 rounded-md shadow-sm">
              <p>
                {deliveryAddress.streetNumber}, {deliveryAddress.streetName}
              </p>
              <p>
                {deliveryAddress.city}, {deliveryAddress.state}
              </p>
              <p>
                {deliveryAddress.country} - {deliveryAddress.pincode}
              </p>
              <p>📞 {deliveryAddress.phoneNo}</p>
              <button
                onClick={() => setShowAddress(true)}
                className="text-sm text-indigo-500 hover:underline mt-2"
              >
                Change
              </button>
            </div>
          )}

          {/* Payment Method */}
          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="Cash on delivery">Cash On Delivery</option>
            <option value="Stripe">Stripe</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        {/* Totals */}
        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">
              {shipping === 0 ? "Free" : `$${shipping}`}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>${tax}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>${total}</span>
          </p>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
        >
          Place Order
        </button>

        {orderMessage && (
          <p className="text-center mt-4 text-sm font-medium text-green-600">
            {orderMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default CartDetails;
