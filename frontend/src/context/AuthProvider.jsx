import { useState, useEffect } from "react";
import { AuthContext } from "./authContext.js";

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRestaurentOwner, setIsRestaurentOwner] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userdata = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    setUser(userdata ? JSON.parse(userdata) : "");
    setIsAdmin(userdata ? JSON.parse(userdata).role === "admin" : false);
    setIsRestaurentOwner(userdata ? JSON.parse(userdata).role === "restaurantOwner" : false);
  }, []);


  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn,user,setIsAdmin,setUser, isAdmin,isRestaurentOwner,setIsRestaurentOwner }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
