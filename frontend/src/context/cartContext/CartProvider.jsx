import { useState, useEffect, useCallback, useContext } from "react";
import { CartContext } from "./CartContext.js";
// import axios from "axios";
import { API_BASE_URL } from "../../config.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { AuthContext } from "../AuthContext.js";

const CartProvider = ({ children }) => {
  const [totalCartItems, setTotalCartItems] = useState([]);
  const { isLoggedIn } = useContext(AuthContext); 

  const fetchCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const { data } = await axiosInstance.get(`/cart/getCart`);
        setTotalCartItems(data.data || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
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
