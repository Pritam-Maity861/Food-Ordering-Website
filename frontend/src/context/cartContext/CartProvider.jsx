import { useState, useEffect, useCallback, useContext } from "react";
import { CartContext } from "./CartContext.js";
import { API_BASE_URL } from "../../config.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { AuthContext } from "../AuthContext.js";

const CartProvider = ({ children }) => {
  const [totalCartItems, setTotalCartItems] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  // fetch cart data
  const fetchCart = useCallback(async () => {
    if (isLoggedIn) {
      try {
        const { data } = await axiosInstance.get(`${API_BASE_URL}/cart/getCart`);
        setTotalCartItems(data.data || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  }, [isLoggedIn]); // Add isLoggedIn as a dependency to the useCallback

  // Fetch cart data only if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [fetchCart, isLoggedIn]); // Runs when isLoggedIn changes

  return (
    <CartContext.Provider value={{ totalCartItems, setTotalCartItems, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
