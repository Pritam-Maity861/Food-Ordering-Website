import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import toast from 'react-hot-toast';

const AddResturentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    street: "",
    city: "",
    country: "",
    lat: "",
    lng: "",
    phone: "",
    email: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });
      if (logoFile) dataToSend.append("logo", logoFile);
      if (heroFile) dataToSend.append("heroImage", heroFile);

      await axiosInstance.post("/resturent/addResturent", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Restaurant added successfully!");
      navigate("/restaurentDashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding restaurant");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Add New Restaurant
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Restaurant Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
          ></textarea>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Logo Image *</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => handleFileChange(e, setLogoFile)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Hero Image *</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => handleFileChange(e, setHeroFile)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="street"
            placeholder="Street"
            value={formData.street}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            step="any"
            name="lat"
            placeholder="Latitude"
            value={formData.lat}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="number"
            step="any"
            name="lng"
            placeholder="Longitude"
            value={formData.lng}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="phone"
            placeholder="Phone (10 digits)"
            value={formData.phone}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Add Restaurant
        </button>
      </form>
    </div>
  );
};

export default AddResturentForm;
