import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";

export const AdminDashboardContent = () => (
    <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Admin Dashboard Overview
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mb-6">
                Welcome to your admin control panel. Here's your platform overview.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium">Total Restaurants</p>
                            <p className="text-2xl font-bold text-blue-900">247</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Total Orders</p>
                            <p className="text-2xl font-bold text-green-900">12,847</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium">Platform Revenue</p>
                            <p className="text-2xl font-bold text-yellow-900">$528,470</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Active Users</p>
                            <p className="text-2xl font-bold text-purple-900">8,924</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


export const RestaurantsContent = () => {
    const [restaurents, setRestaurents] = useState([]);
    const [_status,setStatus]=useState(false);


    useEffect(() => {
        const fetchAllRestaurants=async () => {
          const {data}=await axios.get("http://localhost:8000/api/v1/resturent/getAllResturent");
          setRestaurents(data.data);    
        }
        fetchAllRestaurants();
    }, [])
    console.log(restaurents)

    const handleDeleteRes=async(restaurantId)=>{    
            if (
                !window.confirm(
                "Are you sure you want to delete this Restaurant? This action cannot be undone."
                )
            ) {
                return;
            }
    
            try {
                await axiosInstance.delete(`/resturent/deleteRes/${restaurantId}`);
                setRestaurents(prevRes => prevRes.filter(res => res._id !== restaurantId));
                toast.success("Restaurant deleted successfully");
            } catch (error) {
                console.error("Error deleting restaurant:", error);
                toast.error("Something went wrong while deleteing restaurant.");
            }
        }

        const handleUpdateStatus=async(restaurantId)=>{
            try {
                setStatus((prevStatus) => {
                    const newStatus = !prevStatus;
                    
                    axiosInstance.put(`/resturent/aproveRes/${restaurantId}`, {
                        isApproved: newStatus
                    })
                    .then(({ data }) => {
                        console.log(data);
                        setRestaurents(prevRes =>
                            prevRes.map(res =>
                                res._id === restaurantId ? { ...res, isApproved: newStatus } : res
                            )
                        );
                        toast.success("Restaurant status updated successfully");
                    })
                    .catch(error => {
                        console.error("Error updating restaurant status:", error);
                        toast.error("Something went wrong while updating restaurant status.");
                    });
        
                    return newStatus;
                });}
                 catch (error) {
                console.error("Error updating restaurant status:", error);
                toast.error("Something went wrong while updating restaurant status.");
            }
        }

    return(
        <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                    Restaurant Management
                </h1>
                
            </div>
         
            {/* Restaurants Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="pb-3 text-sm font-medium text-gray-900">Restaurant</th>
                            <th className="pb-3 text-sm font-medium text-gray-900">Owner</th>
                            <th className="pb-3 text-sm font-medium text-gray-900">Location</th>
                            <th className="pb-3 text-sm font-medium text-gray-900">Status</th>
                            <th className="pb-3 text-sm font-medium text-center text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurents.map((restaurant, index) => (
                            <tr key={index} className="border-b border-gray-100">
                                <td className="py-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{restaurant.name}</p>
                                        <p className="text-xs text-gray-500">ID: REST{index + 1001}</p>
                                    </div>
                                </td>
                                <td className="py-3 text-sm text-gray-600">{restaurant.ownerId.name}</td>
                                <td className="py-3 text-sm text-gray-600">{restaurant.city}</td>
                                <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        restaurant.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        restaurant.status === 'Pending' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {restaurant.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </td>
                               
                                <td className="py-3">
                                    <div className="flex justify-center gap-5">
                                       <button className="text-blue-600 hover:text-blue-800 text-sm"
                                       onClick={() => handleUpdateStatus(restaurant._id)}
                                       >Change status to {restaurant.isApproved ? 'Pending' : 'Approved'}</button>
                                       <button className="text-red-600 hover:text-red-800 text-sm"
                                       onClick={
                                        () =>handleDeleteRes(restaurant._id)
                                       }>Remove</button>
                                    </div>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    )
};


export const UsersContent = () => {
    const [allUSer, setAllUSer] = useState([]);

    useEffect(() => {
     const fetchAllUser=async () => {
       const {data}=await axiosInstance.get("/user/getallUsers");
       setAllUSer(data.data);
     }
     

     fetchAllUser();
    }, [])

    const handleDeleteUser=async(userId)=>{
       
          if (
            !window.confirm(
              "Are you sure you want to delete this User? This action cannot be undone."
            )
          ) {
            return;
          }

        try {
            await axiosInstance.delete(`/user/deleteUser/${userId}`);
            setAllUSer(prevUsers => prevUsers.filter(user => user._id !== userId));
            toast.success("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
            // toast.error("Something went wrong while deleteing user.");
        }
    }

    console.log(allUSer)
    

    return(
        <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                    User Management
                </h1>
                <div className="text-center  p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-900">{allUSer.length}</p>
                    <p className="text-sm text-blue-600">Total Users</p>
                </div>
                
            </div>
           
            {/* Users List */}
            <div className="space-y-4">
                {allUSer.map((user, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 font-medium text-sm">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                
                                <div className="text-sm text-gray-500">
                                    {user.role} • User Type   • Joined {user.createdAt}
                                </div>
                                
                                <div className="flex gap-4">
                                    
                                    <button
                                    onClick={() =>handleDeleteUser(user._id)}
                                    className="text-red-600 hover:text-red-800 cursor-pointer text-sm">Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
    )
};



