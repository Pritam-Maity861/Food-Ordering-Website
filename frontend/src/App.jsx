import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import Signup from "./components/Register";
import Login from "./components/Login";
import { Toaster } from "react-hot-toast";
import FoodDetails from "./pages/FoodDetails";
import RestaurentDetails from "./pages/RestaurentDetails";
import { AuthContext } from "./context/authContext";
import CartDetails from "./pages/CartDetails";
import AllRestaurent from "./pages/AllRestaurent";
import AllFoods from "./pages/AllFoods";
import AdminDashboard from "./pages/AdminDashboard";
import RestaurentDashboard from "./pages/RestaurentDashboard";
import AddResturentForm from "./components/Dashboard/components/AddResturentForm";
import MyOrder from "./pages/MyOrder";
import AddItemForm from "./components/Dashboard/components/AddItemForm";


const App = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {isLoggedIn,isAdmin,isRestaurentOwner}=useContext(AuthContext);

  // Check if user is logged in by checking localStorage
  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   if (token) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  

  return (
    <div className="scroll-smooth">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFound />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {isLoggedIn && (
          <>
          <Route path="/foodDetails/:id" element={<FoodDetails />} />
          <Route path="/resturent/:id" element={<RestaurentDetails />} />
          <Route path="/Cart" element={<CartDetails />} />
          <Route path="/allRestaurents" element={<AllRestaurent />} />
          <Route path="/allFoods" element={<AllFoods />} />
          <Route path="/myOrders" element={<MyOrder />} />
          <Route path="/add-food/:restuId" element={<AddItemForm />} />
          

          {isAdmin&&(
            <>
            <Route path="/adminDashboard" element={<AdminDashboard/>}/>
            <Route path="/restaurentDashboard" element={<RestaurentDashboard/>}/>
            <Route path="/addrestaurant" element={<AddResturentForm/>}/>
            </>
          )}
          {isRestaurentOwner&&(
            <>
            <Route path="/restaurentDashboard" element={<RestaurentDashboard/>}/>
            <Route path="/addrestaurant" element={<AddResturentForm/>}/>
            </>
          )}
          </>

        )}

        
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
