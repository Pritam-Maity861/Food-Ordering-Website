import React, { useContext, useEffect, useState } from "react";
import food_app_logo from "../assets/demo1.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/cartContext/CartContext";
import { HashLink as Link } from "react-router-hash-link";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const nevigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, user, isAdmin,isRestaurentOwner } = useContext(AuthContext);
  const { totalCartItems,fetchCart } = useContext(CartContext);

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchdata=async() => {
      await fetchCart();
    }
    fetchdata();
  }, [])
  

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    nevigate("/login");
  };
  // console.log(isAdmin)

  // console.log("These are the cart items :", totalCartItems);

  return (
    <div className="sticky top-0 left-0 w-full z-50">
      {/* Banner */}
      <div className="text-center font-medium py-2 bg-gradient-to-r from-violet-500 via-[#9938CA] to-[#E0724A]">
        <p>
          Exclusive Price Drop! Hurry,{" "}
          <span className="underline underline-offset-2">Offer Ends Soon!</span>
        </p>
      </div>

      {/* Navbar */}
      <nav className="relative h-[70px] flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-900 shadow transition-all bg-white/55">
        {/* Logo */}
        <img
          src={food_app_logo}
          alt="Food App Logo"
          onClick={() => nevigate("/")}
          className="h-20 w-auto cursor-pointer"
        />

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center font-bold space-x-6 md:pl-28">
          <li className="text-gray-600 hover:text-indigo-500 hover:border-b-2 border-indigo-500 transition">
          <Link smooth to="/#home">Home</Link>
          </li>
          <li className="text-gray-600 hover:text-indigo-500 hover:border-b-2 border-indigo-500 transition">
            <button 
            onClick={isLoggedIn?()=>nevigate("/allRestaurents"):()=>nevigate("/login")}
            >Restaurants</button>
          </li>
          <li className="text-gray-600 hover:text-indigo-500 hover:border-b-2 border-indigo-500 transition">
            <button 
            onClick={isLoggedIn?()=>nevigate("/allFoods"):()=>nevigate("/login")}
            >Our Foods</button>
          </li>
          <li className="text-gray-600 hover:text-indigo-500 hover:border-b-2 border-indigo-500 transition">
          <Link smooth to="/#about">About Us</Link>

          </li>
          <li className="text-gray-600 hover:text-indigo-500 hover:border-b-2 border-indigo-500 transition">
          <Link smooth to="/#contact">Contact</Link>
          </li>
        </ul>

        <div className="hidden md:flex justify-center items-center gap-10 relative">
          {/* Cart Icon */}
          {isLoggedIn?(
            <div
            className="relative cursor-pointer"
            onClick={() => nevigate("/Cart")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#615fff"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {totalCartItems?.items?.length > 0 && (
              <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {totalCartItems.items.length}
              </span>
            )}
          </div>
          ):""}

          {!isLoggedIn ? (
            <Link
              type="button"
              className="py-3 bg-slate-700 text-white text-center text-sm cursor-pointer hover:shadow-sm shadow-gray-700 rounded-full hover:scale-97 w-40 active:scale-95 transition"
              to={"/login"}
            >
              Login / Signup
            </Link>
          ) : (
            <div className="relative">
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleProfileDropdown}
              />
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-50 bg-white rounded-md shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to={"/myOrders"}
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                      >
                        My Orders
                      </Link>
                    </li>
                    {isAdmin && (
                      <>
                      <li>
                        <Link
                        to={"/adminDashboard"}
                          className="block px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                        to={"/restaurentDashboard"}
                          className="block px-4 w-full py-2 hover:bg-gray-100 transition"
                        >
                          Restaurent Dashboard
                        </Link>
                      </li>
                    </>
                    )}
                    {isRestaurentOwner && (
                      <>
                      <li>
                        <Link
                        to={"/restaurentDashboard"}
                          className="block px-4 w-full py-2 hover:bg-gray-100 transition"
                        >
                          Restaurent Dashboard
                        </Link>
                      </li>
                    </>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>




        

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-6 md:hidden">
        <div className="sm:hidden ">
        {isLoggedIn?(
            <div
            className="relative cursor-pointer"
            onClick={() => nevigate("/Cart")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#615fff"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {totalCartItems?.items?.length > 0 && (
              <span className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {totalCartItems.items.length}
              </span>
            )}
          </div>
          ):""}
        </div>
        <button
          aria-label="menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-block md:hidden active:scale-90 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
          >
            <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z" />
          </svg>
        </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-[70px] left-0 w-full bg-white flex flex-col items-center shadow-md px-6 py-6 md:hidden z-50 gap-4">
            <ul className="flex flex-col w-full text-center space-y-4 text-gray-800 text-base">
              <li>
                <Link
                 smooth to="/#home"
                  className="block hover:bg-slate-200 py-2 rounded transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={isLoggedIn?()=>nevigate("/allRestaurents"):()=>nevigate("/login")}
                  className="block hover:bg-slate-200 py-2 rounded transition"
                >
                  Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to={isLoggedIn?()=>nevigate("/allFoods"):()=>nevigate("/login")}
                  className="block hover:bg-slate-200 py-2 rounded transition"
                >
                  Our Foods
                </Link>
              </li>
              <li>
                <Link
                  smooth to="/#about"
                  className="block hover:bg-slate-200 py-2 rounded transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  smooth to="/#contact"
                  className="block hover:bg-slate-200 py-2 rounded transition"
                >
                  Contact
                </Link>
              </li>
            </ul>

            {!isLoggedIn ? (
              <Link
                type="button"
                className="w-[80%] py-3 text-center bg-slate-700 text-white text-sm rounded-lg active:scale-95 transition"
                to={"/login"}
              >
                Login / Signup
              </Link>
            ) : (
              <div className="w-[80%] relative">
                <button
                  className="w-full py-3 bg-slate-700 text-white text-sm rounded-lg"
                  onClick={toggleProfileDropdown}
                >
                  Profile
                </button>
                {profileDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-full bg-white rounded-md shadow-lg z-50">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <Link
                          to={"/myOrders"}
                          className="block px-4 py-2 hover:bg-gray-100 transition"
                        >
                          My Orders
                        </Link>
                      </li>
                      {isAdmin && (
                        <>
                        <li>
                          <Link
                            to={"/adminDashboard"}
                            className="block px-4 py-2 hover:bg-gray-100 transition"
                          >
                            Admin Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link 
                          to={"/restaurentDashboard"}
                            className="block px-4 py-2 hover:bg-gray-100 transition"
                          >
                            Restaurent Dashboard
                          </Link>
                        </li>
                        </>
                      )}
                      {isRestaurentOwner && (
                        <>
                        <li>
                          <Link
                            to={"/restaurentDashboard"}
                            className="block px-4 py-2 hover:bg-gray-100 transition"
                          >
                            Restaurent Dashboard
                          </Link>
                        </li>
                        </>
                      )}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
