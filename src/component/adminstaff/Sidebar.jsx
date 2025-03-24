import React, { useState, useEffect } from "react";
import { FaTruck, FaInbox, FaTachometerAlt, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo2.png";
import { auth } from "../../jsfile/firebase";

const Sidebar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Listen for authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex hidden md:block w-64">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col w-64 min-w-[250px] h-screen bg-blue-200 border-r-2 p-5 relative">
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
            to="/MessageRequest"
            className={`flex items-center p-3 rounded transition-all duration-300 transform 
              ${
                location.pathname === "/MessageRequest"
                  ? "bg-gray-800 text-white scale-105 shadow-lg"
                  : "text-black hover:bg-gray-700 hover:text-white hover:scale-105"
              }`}
          >
            <FaInbox className="mr-3" /> Messages Request
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
        {/* Authentication Button at Bottom Left */}
        <div className="absolute bottom-5 left-5">
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 text-white px-3 py-2 rounded transition-colors duration-300 hover:bg-red-600"
            >
              <FaSignOutAlt className="mr-2" /> Log Out
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center bg-green-500 text-white px-3 py-2 rounded transition-colors duration-300 hover:bg-green-600"
            >
              <FaSignInAlt className="mr-2" /> Log In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
