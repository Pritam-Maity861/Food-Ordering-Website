import { useState, useEffect, useCallback } from "react";
import { CartContext } from "./CartContext.js";
// import axiosInstance from "../../utils/axiosInstance.js";
import axios from "axios";
import { API_BASE_URL } from "../../config.js";

const CartProvider = ({ children }) => {
  const [totalCartItems, setTotalCartItems] = useState([]);

  // fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/cart/getCart`
        , { 
          headers: {
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true 
        }
      );
      setTotalCartItems(data.data||[]);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ totalCartItems, setTotalCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
