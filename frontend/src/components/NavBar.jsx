import React, { useContext, useEffect, useState } from "react";
import food_app_logo from "../assets/demo1.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/cartContext/CartContext";
import { HashLink as Link } from "react-router-hash-link";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, user, isAdmin, isRestaurentOwner } =
    useContext(AuthContext);
  const { totalCartItems, fetchCart } = useContext(CartContext);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const navigateConditionally = (path) => {
    setMobileMenuOpen(false);
    navigate(isLoggedIn ? path : "/login");
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen((prev) => !prev);
  };

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
      <nav className="relative h-[70px] flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-900 shadow bg-white/55">
        {/* Logo */}
        <img
          src={food_app_logo}
          alt="Food App Logo"
          onClick={() => navigate("/")}
          className="h-20 w-auto cursor-pointer"
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center font-bold space-x-6">
          <li className="hover:text-indigo-500">
            <Link smooth to="/#home">Home</Link>
          </li>
          <li className="hover:text-indigo-500">
            <button onClick={() => navigateConditionally("/allRestaurents")}>
              Restaurants
            </button>
          </li>
          <li className="hover:text-indigo-500">
            <button onClick={() => navigateConditionally("/allFoods")}>
              Our Foods
            </button>
          </li>
          <li className="hover:text-indigo-500">
            <Link smooth to="/#about">About Us</Link>
          </li>
          <li className="hover:text-indigo-500">
            <Link smooth to="/#contact">Contact</Link>
          </li>
        </ul>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-6">
          {/* Cart Icon */}
          {isLoggedIn && (
            <div
              className="relative cursor-pointer"
              onClick={() => navigate("/Cart")}
            >
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
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
          )}

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="py-3 px-6 bg-slate-700 text-white text-sm rounded-full hover:scale-95 transition"
            >
              Login / Signup
            </Link>
          ) : (
            <div className="relative">
              <img
                src={user?.profilePic || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer object-cover"
                onClick={toggleProfileDropdown}
              />
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/myOrders"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                    </li>
                    {(isAdmin || isRestaurentOwner) && (
                      <li>
                        <Link
                          to="/restaurentDashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Restaurent Dashboard
                        </Link>
                      </li>
                    )}
                    {isAdmin && (
                      <li>
                        <Link
                          to="/adminDashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
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

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          {/* Mobile Cart */}
          {isLoggedIn && (
            <div className="relative cursor-pointer" onClick={() => navigate("/Cart")}>
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
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
          )}

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg width="30" height="30" viewBox="0 0 30 30">
              <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-[70px] left-0 w-full bg-white shadow-md px-6 py-6 md:hidden z-50">
            <ul className="flex flex-col items-center gap-4 text-gray-800 text-base">
              <li>
                <Link smooth to="/#home" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              </li>
              <li>
                <button onClick={() => navigateConditionally("/allRestaurents")}>
                  Restaurants
                </button>
              </li>
              <li>
                <button onClick={() => navigateConditionally("/allFoods")}>
                  Our Foods
                </button>
              </li>
              <li>
                <Link smooth to="/#about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              </li>
              <li>
                <Link smooth to="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              </li>
            </ul>

            {/* Auth Section */}
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="block mt-4 py-3 text-center bg-slate-700 text-white rounded-md"
              >
                Login / Signup
              </Link>
            ) : (
              <div className="mt-4">
                <button
                  onClick={toggleProfileDropdown}
                  className="w-full py-3 bg-slate-700 text-white rounded-md"
                >
                  Profile
                </button>
                {profileDropdownOpen && (
                  <div className="mt-2 w-full bg-white rounded-md shadow-md">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <Link to="/myOrders" onClick={() => {
                          setProfileDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }} className="block px-4 py-2 hover:bg-gray-100">
                          My Orders
                        </Link>
                      </li>
                      {(isAdmin || isRestaurentOwner) && (
                        <li>
                          <Link to="/restaurentDashboard" onClick={() => {
                            setProfileDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }} className="block px-4 py-2 hover:bg-gray-100">
                            Restaurent Dashboard
                          </Link>
                        </li>
                      )}
                      {isAdmin && (
                        <li>
                          <Link to="/adminDashboard" onClick={() => {
                            setProfileDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }} className="block px-4 py-2 hover:bg-gray-100">
                            Admin Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
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
