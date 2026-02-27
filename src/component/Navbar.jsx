import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../jsfile/firebase"; // Import Firestore
import Logo from "../assets/logo.png";
import Loginmodal from "../modals/Login";
import ManageUsers from "../modals/ManageUsers";
import StaffActivityModal from "../modals/StaffActivity";
import { signOut } from "firebase/auth"; // Import the Firebase signOut method
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { FaUserCircle, FaBell } from "react-icons/fa";
import { useUserNotifications } from "../hooks/useUserNotifications";
import "../assets/css/Navbartesting.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [iconIsOpen, setIconIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState(""); // State for first name
  const [role, setRole] = useState(undefined); // Initial state is undefined
  const [manageUsersShow, setManageUsersShow] = useState(false);
  const [showStaffActivityModal, setShowStaffActivityModal] = React.useState(false);
  const [isActive, setIsActive] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useUserNotifications();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            setFirstName(userDoc.data().firstName);
            setRole(userDoc.data().role); // Set role after fetching
          } else {
            setRole(null); // Ensure it's null while waiting
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setRole(null); // Keep it null on error
        }
      } else {
        setRole(null); // Ensure no menu is displayed on logout
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIconIsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleOpenOffCanvas = () => {
      setIsOpen(true);
    };

    window.addEventListener("openOffCanvas", handleOpenOffCanvas);
    return () => {
      window.removeEventListener("openOffCanvas", handleOpenOffCanvas);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIconIsOpen(false);
      setIsOpen(false);
      await signOut(auth);
      navigate('/')  // Sign the user out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      await markAsRead(notif.id);
    }
    setNotifOpen(false);
    navigate('/MyShipments');
  };

  if (role === undefined) {
    return (
      <nav className="border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 font-semibold z-40">
      </nav>
    );
  }

  return (
    <>
      {role !== undefined && (
        <nav className={`font-semibold z-40 
        ${role === "admin" || role === "staff" ? "md:hidden bg-blue-300 border-b-2" : "bg-white"} 
        `}>
          <div className="max-w-screen-xl flex items-center justify-between mx-auto p-3">
            {/* Logo with conditional navigation based on user role */}
            {(role === "user" || role === undefined) ? (

              <NavLink
                to="/"
                className={`flex items-center space-x-3 transition-transform duration-300 
              hover:scale-110
            }`}
              >
                <img src={Logo} className="h-12 w-auto" alt="FCL" />
              </NavLink>
            ) : (
              <>
                <NavLink
                  to={role === "admin" ? "/AdminDashboard" : role === "staff" ? "/AdminDashboard" : "/"}
                  className={`flex items-center space-x-3 transition-transform duration-300 
                hover:scale-110 
                ${(role === "admin" || role === "staff") ? "md:hidden" : ""}
              `}
                >
                  <img src={Logo} className="h-12 w-auto" alt="FCL" />
                </NavLink>
              </>
            )}

            <div className="hidden md:flex items-center gap-1 ml-auto">
              {/* Conditional Rendering Based on Role */}
              {role === "admin" ? (<>
              </>
                /* STAFF ROLES */
              ) : role === "staff" ? (
                <>
                  <NavLink
                    to="/About"
                    className={({ isActive }) =>
                      `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-0 scale-110" : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    Manage Something
                  </NavLink>
                  <NavLink
                    to="/Services"
                    className={({ isActive }) =>
                      `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-0 scale-110" : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    Messages
                  </NavLink>
                  <NavLink
                    to="/OurCommitment"
                    className={({ isActive }) =>
                      `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-0 scale-110" : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    Idunno
                  </NavLink>
                </>
                /* USER ROLES */
              ) : role === "user" ? (
                <>
                  <NavLink
                    to="/About"
                    className={({ isActive }) =>
                      `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 
                    hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    About Us
                  </NavLink>
                  <NavLink
                    to="/Services"
                    className={({ isActive }) =>
                      `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 
                    hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    Services
                  </NavLink>
                </>
                /* NO ROLES */
              ) : (
                <>
                  <NavLink
                    to="/About"
                    className={({ isActive }) =>
                      `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 
                    hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    About Us
                  </NavLink>
                  <NavLink
                    to="/Services"
                    className={({ isActive }) =>
                      `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 
                    hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    Services
                  </NavLink>
                </>
              )}
              {(role === "admin" || role === "staff") && (
                <div className="relative z-40" ref={dropdownRef}>
                  {/* User Icon */}
                  <button
                    onClick={() => setIconIsOpen(!iconIsOpen)}
                    className="text-black text-3xl p-2 transition-transform duration-300 ease-in-out scale-150
                          hover:scale-120 active:scale-150"
                  >
                    <FaUserCircle
                      className={`transition-all duration-300 ${iconIsOpen ? "text-black scale-110" : "text-gray-700"
                        }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md 
                            transition-all duration-300 ease-in-out ${iconIsOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                  >
                    <ul className="border rounded !pl-0 !mb-0 w-full text-gray-800">
                      <li className="px-4 py-3 hover:bg-gray-300 transition duration-200 cursor-pointer">Authentication</li>
                      <li onClick={handleLogout} className="px-4 py-3 hover:bg-gray-300 transition duration-200 cursor-pointer">Log Out</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {(role === "admin" || role === "staff") ? (
              <div className="md:hidden flex items-center space-x-2 md:space-x-3">
                {/* Hamburger Button */}
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-2 text-black rounded-lg hover:bg-gray-100 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3 md:space-x-4">
                  {/* Notification Bell (Users Only) */}
                  {role === "user" && !isOpen && (
                    <div className="relative z-50 flex items-center" ref={notifRef}>
                      <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none transition-colors"
                      >
                        <FaBell className="text-xl" />
                        {unreadCount > 0 && (
                          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Notif Dropdown */}
                      <div
                        className={`absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right ${notifOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                          }`}
                      >
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                          <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={() => markAllAsRead()}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center text-gray-500 text-sm">
                              No notifications yet
                            </div>
                          ) : (
                            <ul className="divide-y divide-gray-100 !pl-0 !mb-0">
                              {notifications.map((notif) => (
                                <li
                                  key={notif.id}
                                  onClick={() => handleNotificationClick(notif)}
                                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                                >
                                  <div className="flex flex-col gap-1">
                                    <span className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                      {notif.title || "Shipment Update"}
                                    </span>
                                    <span className="text-xs text-gray-500 line-clamp-2">
                                      {notif.message}
                                    </span>
                                    <span className="text-[10px] text-gray-400 mt-1">
                                      {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : 'Just now'}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hamburger Button */}
                  <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-black rounded-lg hover:bg-gray-100 focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Overlay (Blurred Background) */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-md z-40"
              onClick={() => setIsOpen(false)}
            ></div>
          )}

          {/* Offcanvas Menu (Right Side) */}
          <div
            className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-white text-black shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"
              } transition-transform duration-300 ease-in-out z-50 flex flex-col h-full`}
          >
            {/* Header */}
            <div className="p-5 flex justify-between items-center border-b border-gray-500 bg-[rgba(0,127,130,255)]">
              <span className="text-md font-semibold">
                <a>
                  {user ? (
                    <>
                      <div className="lexend drop-shadow-[2px_2px_2px_rgba(0,0,0,0.8)] text-white text-xl mb-3">
                        {/* Display role-specific greeting */}
                        Welcome, {role === "admin" ? "Admin" : firstName || "User"}!
                      </div>
                      <button

                        onClick={handleLogout}
                        className="lexend drop-shadow-[2px_2px_2px_rgba(0,0,0,0.8)] font-bold relative block py-2 px-0 no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                      after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-black/100 after:transition-all after:duration-300 
                      hover:after:w-full text-white/100 hover:text-blue-300 cursor-pointer text-sm"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <Loginmodal setIsOpen={setIsOpen} />
                  )}
                </a>
              </span>
              <button onClick={() => setIsOpen(false)} className="text-black hover:text-black">
                ✕
              </button>
            </div>

            <ul className="p-0 space-y-0 flex flex-col items-center text-center flex-grow w-full text-xl">
              {/* Conditional Rendering of Menu Items  -- ADMIN*/}
              {role === "admin" ? (
                <>
                  <li className="w-full">
                    <NavLink
                      to='/AdminDashboard'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/Shipments'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Shipments
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/ShipmentRequest'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Shipment Request
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/MessageRequest'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Message Requests
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/AdminMessages'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Messages
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/Reports'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Reports
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <div className="kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 hover:bg-blue-200 active:bg-blue-300 
                              hover:scale-105 cursor-pointer"
                      onClick={() => setManageUsersShow(true)}>
                      Manage Users
                    </div>
                  </li>
                  <li className="w-full">
                    <div className="kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 hover:bg-blue-200 active:bg-blue-300 
                              hover:scale-105 cursor-pointer"
                      onClick={() => setShowStaffActivityModal(true)}>
                      Staff Activity
                    </div>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/"
                      onClick={handleLogout}
                      className={({ isActive }) =>
                        `kanit-regular border-b-2 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Log Out
                    </NavLink>
                  </li>
                </>

                /* STAFF NAVIGATION BAR */
              ) : role === "staff" ? (
                <>
                  <li className="w-full">
                    <NavLink
                      to='/AdminDashboard'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/Shipments'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Shipments
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/ShipmentRequest'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Shipment Request
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/MessageRequest'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Message Requests
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/AdminMessages'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Messages
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to='/Reports'
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Reports
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/"
                      onClick={handleLogout}
                      className={({ isActive }) =>
                        `kanit-regular border-b-2 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Log Out
                    </NavLink>
                  </li>
                </>

                /* USERS NAVIGATION BAR */
              ) : role === "user" ? (
                <>
                  <li className="w-full">
                    <NavLink
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/About"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      About Us
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/Services"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Services
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/TrackPackage"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Track Package
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/Messages"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Need help?
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/ShippingInquiry"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Request Shipment
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/MyShipments"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      My Shipments
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/ShipmentMessages"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-1 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Shipment Chats
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/Contact"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-2 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Contact Us!
                    </NavLink>
                  </li>
                </>

                /* NOT LOGGED IN / NO ROLES NAVIGATION BAR */
              ) : (
                <>
                  <li className="w-full">
                    <NavLink
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/About"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      About Us
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/Services"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Services
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/TrackPackage"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Track Package
                    </NavLink>
                  </li>
                  <li className="w-full">
                    <NavLink
                      to="/Contact"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `kanit-regular border-b-2 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                      }
                    >
                      Contact Us!
                    </NavLink>
                  </li>
                </>
              )}

              {/* Offcanvas Footer */}
              <li className="bg-white mt-auto pt-4 border-t w-full text-center text-gray-500 text-sm">
                © 2022 Frances Logistics. All rights reserved.
                <img src={Logo} className="mx-auto h-15 w-auto mt-2" alt="FCL" />
              </li>

            </ul>
            <ManageUsers show={manageUsersShow} onHide={() => setManageUsersShow(false)} />

            <StaffActivityModal show={showStaffActivityModal} onHide={() => setShowStaffActivityModal(false)} />
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
