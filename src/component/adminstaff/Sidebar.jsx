import React from "react";
import { FaTruck, FaInbox, FaTachometerAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo2.png";

const Sidebar = () => {
  const location = useLocation(); // Get current route

  return (
    <div className="flex hidden md:block w-64">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col w-64 min-w-[250px] h-screen bg-blue-200 border-r-2 p-5">
      <div className="relative">
        <img 
          src={Logo} 
          className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 
                    w-220 max-w-[220px] h-30 object-contain z-10"
          alt="FCL" 
        />
      </div>
        <nav className="m-auto space-y-6 text-2xl">
          <Link
            to="/AdminDashboard"
            className={`flex items-center p-3 rounded transition-all duration-300 transform 
              ${
                location.pathname === "/AdminDashboard"
                  ? "bg-gray-800 text-white scale-105 shadow-lg"
                  : "text-black hover:bg-gray-700 hover:text-white hover:scale-105"
              }`}
          >
            <FaTachometerAlt className="mr-3" /> Dashboard
          </Link>
          <Link
            to="/Shipments"
            className={`flex items-center p-3 rounded transition-all duration-300 transform 
              ${
                location.pathname === "/Shipments"
                  ? "bg-gray-800 text-white scale-105 shadow-lg"
                  : "text-black hover:bg-gray-700 hover:text-white hover:scale-105"
              }`}
          >
            <FaTruck className="mr-3" /> Shipments
          </Link>
          <Link
            to="/AdminMessages"
            className={`flex items-center p-3 rounded transition-all duration-300 transform 
              ${
                location.pathname === "/AdminMessages"
                  ? "bg-gray-800 text-white scale-105 shadow-lg"
                  : "text-black hover:bg-gray-700 hover:text-white hover:scale-105"
              }`}
          >
            <FaInbox className="mr-3" /> Messages
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
