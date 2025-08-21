// Sidebar.jsx
import React from "react";
import { FaTruck, FaInbox, FaTachometerAlt, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo2.png";
import { useAuth } from "../../utils/AuthContext";  // ← import your hook
import ManageUsers from "../../modals/ManageUsers";
import { auth } from "../../jsfile/firebase";
import { signOut } from "firebase/auth";

const Sidebar = () => {
  const location = useLocation();
  const { user, role, loading } = useAuth();
  const [manageUsersShow, setManageUsersShow] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // While we’re checking auth state, don’t render anything:
  if (loading) return null;

  // Only show sidebar to authenticated staff/admin:
  if (!user || (role !== "admin" && role !== "staff")) return null;

  return (
    <div className="hidden md:flex flex-col w-64 min-w-[250px] h-screen bg-blue-200 border-r-2 p-5 relative">
      <div className="relative mb-10">
        <img
          src={Logo}
          className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-220 max-w-[220px] h-30 object-contain z-10"
          alt="FCL"
        />
      </div>

      <nav className="flex flex-col m-auto space-y-6 text-2xl">
        <Link to="/AdminDashboard" className={navLink(location, "/AdminDashboard")}>
          <FaTachometerAlt className="mr-3" /> Dashboard
        </Link>
        <Link to="/Shipments" className={navLink(location, "/Shipments")}>
          <FaTruck className="mr-3" /> Shipments
        </Link>
        <Link to="/ShipmentRequest" className={navLink(location, "/ShipmentRequest")}>
          <FaTruck className="mr-3" /> Shipment Request
        </Link>
        <Link to="/MessageRequest" className={navLink(location, "/MessageRequest")}>
          <FaInbox className="mr-3" /> Messages Request
        </Link>
        <Link to="/AdminMessages" className={navLink(location, "/AdminMessages")}>
          <FaInbox className="mr-3" /> Messages
        </Link>
      </nav>

      <div className="absolute bottom-5 left-5 flex flex-col space-y-3">
        {role === "admin" && (
          <button
            onClick={() => setManageUsersShow(true)}
            className="lexend flex items-center bg-green-400 border-2 mb-2 text-black px-3 py-2 rounded hover:bg-green-600"
          >
            Manage Users
          </button>
        )}
        <button
          onClick={handleLogout}
          className="lexend flex items-center bg-red-500 text-white border-2 border-black px-3 py-2 rounded transition-colors duration-300 hover:bg-red-900"
        >
          <FaSignOutAlt className="mr-2" /> Log Out
        </button>
      </div>

      <ManageUsers show={manageUsersShow} onHide={() => setManageUsersShow(false)} />
    </div>
  );
};

// helper to apply the active classes
const navLink = (location, path) => {
  const isActive = location.pathname === path;
  return `flex items-center p-3 rounded transition-all duration-300 transform ${
    isActive
      ? "bg-gray-800 text-white scale-105 shadow-lg"
      : "text-black hover:bg-gray-700 hover:text-white hover:scale-105"
  }`;
};

export default Sidebar;
