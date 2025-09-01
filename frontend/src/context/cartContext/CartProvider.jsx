import { useState, useEffect, useCallback } from "react";
import { CartContext } from "./CartContext.js";
import axios from "axios";

const CartProvider = ({ children }) => {
  const [totalCartItems, setTotalCartItems] = useState(null);

  // fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/cart/getCart",
        {headers: { authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      setTotalCartItems(data.data);
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
