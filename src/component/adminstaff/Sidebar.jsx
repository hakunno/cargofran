import React, { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo2.png";
import { useAuth } from "../../utils/AuthContext";
import ManageUsers from "../../modals/ManageUsers";
import StaffActivityModal from "../../modals/StaffActivity";
import { auth } from "../../jsfile/firebase";
import { db } from "../../jsfile/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { logActivity } from "../../modals/StaffActivity";
import { useAdminNotifications } from "../../hooks/useAdminNotifications";

// Icons
import {
  FaSignOutAlt,
  FaTimes,
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaEnvelope,
  FaChartBar,
  FaUsers,
  FaHistory,
  FaCommentDots,
  FaBell,
  FaTruck
} from "react-icons/fa";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { user, role, loading } = useAuth();

  const [manageUsersShow, setManageUsersShow] = useState(false);
  const [showStaffActivityModal, setShowStaffActivityModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Live notification counts from Firestore
  const { shipmentRequests, messageRequests, liveChats, shipmentChats } = useAdminNotifications();
  const totalNotifications = shipmentRequests + messageRequests + liveChats + shipmentChats;

  // Local state fallback
  const [localOpen, setLocalOpen] = useState(false);
  const isSidebarOpen = mobileOpen !== undefined ? mobileOpen : localOpen;

  const toggleSidebar = (state) => {
    if (setMobileOpen) setMobileOpen(state);
    else setLocalOpen(state);
  };

  const navRef = useRef(null);

  const handleLogout = async () => {
    try {
      // Fetch the user's name to log the activity before signing out
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
          const { firstName, lastName } = userDoc.data();
          const fullName = `${firstName || ""} ${lastName || ""}`.trim() || user.email;
          await logActivity(fullName, "Logged out");
        }
      }
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Scroll Persistence Logic
  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = parseInt(localStorage.getItem('sidebarScroll') || '0', 10);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        localStorage.setItem('sidebarScroll', navRef.current.scrollTop);
      }
    };
    const navElement = navRef.current;
    navElement?.addEventListener('scroll', handleScroll);
    return () => navElement?.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return null;
  if (!user || (role !== "admin" && role !== "staff")) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        onClick={() => toggleSidebar(false)}
        className={`fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      {/* Sidebar Container - KEPT w-64 TO MATCH YOUR ORIGINAL LAYOUT */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-slate-200 flex flex-col shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center justify-center py-5 border-b border-slate-100 relative">
          <button
            onClick={() => toggleSidebar(false)}
            className="md:hidden absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>

          <div className="w-full px-6 flex justify-center mb-2">
            <img
              src={Logo}
              className="h-14 w-auto object-contain drop-shadow-sm"
              alt="Company Logo"
            />
          </div>

          {/* Notification bell showing total unread */}
          <div className="relative flex items-center justify-center mt-1">
            <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative p-1 rounded-full hover:bg-slate-100 transition">
              <FaBell className="text-teal-600 text-lg" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {totalNotifications > 99 ? "99+" : totalNotifications}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 left-1/2 -translate-x-1/2 z-50 overflow-hidden text-left">
                <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-800 text-center">Notifications</h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {totalNotifications === 0 ? (
                    <div className="px-4 py-4 text-center text-xs text-slate-500">
                      No new notifications.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {shipmentRequests > 0 && (
                        <Link to="/ShipmentRequest" className="block px-4 py-3 hover:bg-slate-50 transition" onClick={() => setShowNotifDropdown(false)}>
                          <div className="text-xs font-medium text-slate-800">📦 {shipmentRequests} New Shipment Requests</div>
                        </Link>
                      )}
                      {messageRequests > 0 && (
                        <Link to="/MessageRequest" className="block px-4 py-3 hover:bg-slate-50 transition" onClick={() => setShowNotifDropdown(false)}>
                          <div className="text-xs font-medium text-slate-800">💬 {messageRequests} New Message Requests</div>
                        </Link>
                      )}
                      {shipmentChats > 0 && (
                        <Link to="/AdminShipmentMessages" className="block px-4 py-3 hover:bg-slate-50 transition" onClick={() => setShowNotifDropdown(false)}>
                          <div className="text-xs font-medium text-slate-800">🚚 {shipmentChats} New Shipment Messages</div>
                        </Link>
                      )}
                      {liveChats > 0 && (
                        <Link to="/AdminMessages" className="block px-4 py-3 hover:bg-slate-50 transition" onClick={() => setShowNotifDropdown(false)}>
                          <div className="text-xs font-medium text-slate-800">🟢 {liveChats} New Support Chats</div>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="px-3 py-0.5 bg-teal-50 text-teal-700 rounded-full text-[10px] font-bold tracking-widest uppercase border border-teal-100">
            {role === 'admin' ? 'Administrator' : 'Staff Portal'}
          </div>
        </div>

        {/* --- NAVIGATION --- */}
        <nav
          ref={navRef}
          className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        >
          {/* Group 1: Overview */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Overview
            </p>
            <div className="space-y-1">
              <NavItem to="/AdminDashboard" icon={<FaTachometerAlt />} label="Dashboard" location={location} />
              <NavItem to="/Reports" icon={<FaChartBar />} label="Reports" location={location} />
            </div>
          </div>

          {/* Group 2: Operations */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Operations
            </p>
            <div className="space-y-1">
              <NavItem to="/Shipments" icon={<FaBoxOpen />} label="Shipments" location={location} />
              <NavItem to="/ShipmentRequest" icon={<FaClipboardList />} label="Requests" location={location} badge={shipmentRequests} />
            </div>
          </div>

          {/* Group 3: Communication */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Communication
            </p>
            <div className="space-y-1">
              <NavItem to="/MessageRequest" icon={<FaEnvelope />} label="Inbox" location={location} badge={messageRequests} />
              <NavItem to="/AdminShipmentMessages" icon={<FaTruck />} label="Contact User" location={location} badge={shipmentChats} />
              <NavItem to="/AdminMessages" icon={<FaCommentDots />} label="Support Chat" location={location} badge={liveChats} />
            </div>
          </div>

          {/* Group 4: Admin Tools (Conditional) */}
          {role === "admin" && (
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Admin
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setManageUsersShow(true)}
                  className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700 group"
                >
                  <FaUsers className="w-4 h-4 mr-3 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  Manage Users
                </button>

                <button
                  onClick={() => setShowStaffActivityModal(true)}
                  className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700 group"
                >
                  <FaHistory className="w-4 h-4 mr-3 text-slate-400 group-hover:text-teal-600 transition-colors" />
                  Staff Activity
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* --- FOOTER --- */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md ring-2 ring-teal-100">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">{user.email}</p>
              <p className="text-[10px] text-slate-500 capitalize">{role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full group flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-200 shadow-sm"
          >
            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Modals */}
      <ManageUsers show={manageUsersShow} onHide={() => setManageUsersShow(false)} />
      <StaffActivityModal show={showStaffActivityModal} onHide={() => setShowStaffActivityModal(false)} />
    </>
  );
};

// --- Nav Item Component ---
const NavItem = ({ to, icon, label, location, badge = 0 }) => {
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      className={`relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive
        ? "bg-teal-600 text-white shadow-md shadow-teal-200/50"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
    >
      <span className={`flex items-center justify-center w-4 h-4 mr-3 transition-colors ${isActive ? "text-teal-100" : "text-slate-400 group-hover:text-slate-600"
        }`}>
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge > 0 && (
        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
};

export default Sidebar;