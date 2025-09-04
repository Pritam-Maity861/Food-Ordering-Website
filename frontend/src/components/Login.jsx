import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoggedIn, setIsLoggedIn,setUser ,setIsAdmin,setIsRestaurentOwner} = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("Login data submitted:", formData);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/signin`,
        formData,
        { withCredentials: true }
      );

      // console.log(data);

      localStorage.setItem(
        "user",
        JSON.stringify(data.data.data.userWithoutPassword)
      );
      localStorage.setItem("accessToken", data.data.accessToken);

      setIsLoggedIn(true);
      setUser(data.data.data.userWithoutPassword);
      (data.data.data.userWithoutPassword.role === "admin")?setIsAdmin(true):setIsAdmin(false);
      (data.data.data.userWithoutPassword.role === "restaurantOwner")?setIsRestaurentOwner(true):setIsRestaurentOwner(false);
      // setIsAdmin(data.data.data.userWithoutPassword.role === "admin");
      navigate("/");
      toast.success("Login successful!");
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };


  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="bg-gray-50 shadow-lg rounded-lg p-10 flex flex-col max-w-md w-full">
        <Link
          className="flex gap-1 items-center text-blue-700 font-bold"
          to={"/"}
        >
          <IoArrowBackOutline />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>
        <br />
        <p className="text-center text-gray-600 mb-8">
          Please login to your Account
        </p>

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="m-2">Email Address :</label>
            <br />
            <input
              placeholder="Enter Your Email"
              onChange={handleChange}
              type="email"
              name="email"
              className="p-2 mt-2 w-full border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-4">
            <label className="m-2">Password :</label>
            <input
              placeholder="Enter Your Password"
              onChange={handleChange}
              type="password"
              name="password"
              className="p-2 mt-2 w-full border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 p-2 rounded text-white font-semibold hover:bg-blue-600"
          >
            Login
          </button>

          {/* divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <p className="text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
