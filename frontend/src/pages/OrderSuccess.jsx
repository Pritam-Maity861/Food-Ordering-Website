import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { CartContext } from "../context/cartContext/CartContext";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const { fetchCart, setTotalCartItems } = useContext(CartContext);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          setMessage("Invalid session.");
          return;
        }

        // Verify payment
        await axios.post(
          "http://localhost:8000/api/v1/order/verify-stripe-payment",
          { sessionId },
          { withCredentials: true }
        );

        setMessage("🎉 Payment successful! Order placed.");
        toast.success("Order placed successfully!");

        // Clear cart in backend
        await axiosInstance.delete("/cart/deleteCart", { withCredentials: true });

        // Clear cart in frontend
        setTotalCartItems([]);
        await fetchCart();
      } catch (error) {
        console.error(error);
        setMessage("❌ Payment verification failed.");
        toast.error("Payment verification failed!");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, fetchCart, setTotalCartItems]);

  if (loading) return <p>Verifying payment...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default OrderSuccess;
