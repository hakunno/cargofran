import React, { useState } from "react";
import { FaBars, FaTimes, FaTruck, FaInbox, FaTachometerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex hidden md:block w-64">
      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-blue-300 p-5">
        <nav className="space-y-20 text-2xl">
          <Link to="/AdminDashboard" className="flex items-center p-3 text-black hover:bg-gray-700 hover:text-white rounded">
            <FaTachometerAlt className="mr-3" /> Dashboard
          </Link>
          <Link to="/Shipments" className="flex items-center p-3 text-black hover:bg-gray-700 hover:text-white rounded">
            <FaTruck className="mr-3" /> Shipments
          </Link>
          <Link to="/messages" className="flex items-center p-3 text-black hover:bg-gray-700 hover:text-white rounded">
            <FaInbox className="mr-3" /> Messages
          </Link>
        </nav>
      </div>

      {/* Mobile Sidebar (Hamburger Menu) */}
      <div className="md:hidden flex flex-col w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 bg-gray-900 text-white w-full flex justify-between"
        >
          <span>Menu</span>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {isOpen && (
          <div className="flex flex-col bg-gray-900 p-4">
            <Link to="/dashboard" className="flex items-center p-3 text-black bg-white hover:bg-gray-700 hover:text-white rounded">
              <FaTachometerAlt className="mr-3" /> Dashboard
            </Link>
            <Link to="/shipments" className="flex items-center p-3 text-black bg-white hover:bg-gray-700 hover:text-white rounded">
              <FaTruck className="mr-3" /> Shipments
            </Link>
            <Link to="/messages" className="flex items-center p-3 text-black bg-white hover:bg-gray-700 hover:text-white rounded">
              <FaInbox className="mr-3" /> Messages
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
