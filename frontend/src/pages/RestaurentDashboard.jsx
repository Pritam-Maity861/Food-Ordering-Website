import React, { useContext, useState } from 'react'
import food_app_logo from "../assets/demo1.png";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MenuManagementContent,  RestaurantDashboardContent,  RestaurantManagementContent } from '../components/Dashboard/RestaurantDashboardOptions';


const RestaurantDashboard = () => {
    const navigate = useNavigate(); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    const sidebarLinks = [
        { name: "Dashboard", path: "dashboard", component: RestaurantDashboardContent },
        { name: "Your Restaurant", path: "restaurant", component: RestaurantManagementContent },
        { name: "Menu", path: "menu", component: MenuManagementContent },
    ];
    
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/login");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleSectionClick = (sectionPath) => {
        setActiveSection(sectionPath);
        setIsMobileMenuOpen(false);
    };

    // Get current component to render
    const currentSection = sidebarLinks.find(link => link.path === activeSection);
    const CurrentComponent = currentSection ? currentSection.component : RestaurantDashboardContent;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-300 py-3 bg-white shadow-sm">
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                    
                    <img
                        src={food_app_logo}
                        alt="Food App Logo"
                        onClick={() => navigate("/")}
                        className="h-12 sm:h-16 lg:h-20 w-auto cursor-pointer"
                    />
                </div>
                
                <div className="flex items-center gap-3 sm:gap-5">
                    <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                        Hi! Restaurant Owner
                    </p>
                    <p className="text-xs text-gray-600 sm:hidden">
                        Hi! Owner
                    </p>
                    <button 
                        className="border border-gray-300 rounded-full text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex">
                {/* Mobile overlay */}
                {isMobileMenuOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                        onClick={toggleMobileMenu}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed lg:relative lg:translate-x-0 z-30 lg:z-0
                    w-64 lg:w-64 h-screen lg:h-auto bg-white border-r border-gray-300 pt-4
                    transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    {/* Mobile close button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="lg:hidden absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100"
                        aria-label="Close menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <nav className="flex flex-col mt-8 lg:mt-0">
                        {sidebarLinks.map((item, index) => (
                            <button 
                                key={index}
                                onClick={() => handleSectionClick(item.path)}
                                className={`flex items-center py-4 px-6 text-base transition-all duration-200 text-left w-full
                                    ${activeSection === item.path
                                        ? "border-r-4 bg-indigo-50 border-indigo-500 text-indigo-600 font-medium" 
                                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900 hover:border-r-2 hover:border-gray-200"
                                    }`
                                }
                            >
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main content area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen">
                    <CurrentComponent />
                </main>
            </div>
        </div>
    );
}


export default RestaurantDashboard;