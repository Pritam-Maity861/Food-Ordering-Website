import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../config";

const Register = () => {
  const navigate=useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    profilePic: null, // Add profile image here
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    
      if(token){
        setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl); 
      setFormData((prevData) => ({
        ...prevData,
        profilePic: file, // Store the actual image file
      }));
    }
  };

  const submitHandler =async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("email", formData.email);
      formDataToSubmit.append("password", formData.password);
      formDataToSubmit.append("phone", formData.phone);
      formDataToSubmit.append("role", formData.role);
      if (formData.profilePic) {
        formDataToSubmit.append("profilePic", formData.profilePic);
      }

     
     const {data}=await axios.post(`${API_BASE_URL}/auth/register`, formDataToSubmit);
     console.log(data);
     navigate("/login")
     toast.success("Account created successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
      
    }
    setImagePreview(null);
    // setFormData({
    //   name: "",
    //   email: "",
    //   password: "",
    //   phone: "",
    //   role: "user",
    //   profileImage: null, 
    // });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    !isLoggedIn?(
      <div className="flex flex-col items-center min-h-screen bg-gray-200 px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-lg md:max-w-2xl lg:max-w-3xl">
        {/* Back Button */}
        <Link
          className="flex gap-1 items-center text-blue-700 font-bold mb-4"
          to="/"
        >
          <IoArrowBackOutline />
          Back
        </Link>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create Your Account
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Join us today! It's quick and easy
        </p>

        <form onSubmit={submitHandler}>
          {/* Profile Image */}
          <div className="flex flex-col items-center mb-6">
            <label htmlFor="profileImage" className="cursor-pointer relative">
              <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-400 hover:border-blue-400 transition">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm text-gray-600 text-center px-2">
                    Upload
                  </span>
                )}
              </div>
              <input
                id="profileImage"
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <p className="text-gray-600 text-sm mt-2">
              Click to upload profile photo
            </p>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block mb-1 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-1 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Your Email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-1 text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a Password"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block mb-1 text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="mt-6 mb-6">
            <span className="block mb-2 text-gray-700">Role</span>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === "user"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                User
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="restaurantOwner"
                  checked={formData.role === "restaurantOwner"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Restaurant Owner
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Signup
          </button>

          {/* Login Redirect */}
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
    ):navigate("/")
  );
};

export default Register;
