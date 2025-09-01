import { useState } from "react";

const AddressForm = ({ onSave }) => {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState({
    streetName: "",
    streetNumber: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phoneNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(address); // pass data to parent (e.g. order form)
    setShowForm(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Add Address
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 mt-4 rounded-lg shadow-lg space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="streetName"
              placeholder="Street Name"
              value={address.streetName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="streetNumber"
              placeholder="Street Number"
              value={address.streetNumber}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={address.state}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={address.country}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <input
            type="text"
            name="phoneNo"
            placeholder="Phone Number"
            value={address.phoneNo}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Address
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressForm;
