import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { auth, db } from "../jsfile/firebase"; // Import Firestore
import Logo from "../assets/logo2.png";
import Loginmodal from "../modals/Login";
import ManageUsers from "../modals/ManageUsers";
import { signOut } from "firebase/auth"; // Import the Firebase signOut method
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import "../assets/css/Navbartesting.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState(""); // State for first name
  const [role, setRole] = useState(undefined); // Initial state is undefined
  const [manageUsersShow, setManageUsersShow] = useState(false);

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

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      {role !== undefined && (
      <nav className="border-b border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 font-semibold">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          {/* Logo with conditional navigation based on user role */}
          <NavLink to={role === "admin" ? "/adminDashboard" : "/"} className="flex items-center space-x-3">
            <img src={Logo} className="h-12 w-auto" alt="FCL" />
          </NavLink>

          {/* Navbar Links (Desktop Only) */}
          <div className="hidden md:flex items-center gap-4 ml-auto">
            {/* Conditional Rendering Based on Role */}
            {role === "admin" ? (
                <div className="mr-3 block py-2 px-3 text-black no-underline hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-105 active:scale-95" onClick={() => setManageUsersShow(true)}>
                  Manage Users
                </div>
            ) : (
              <>
                <NavLink
                  to="/About"
                  className="block py-2 px-3 text-black no-underline hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/Services"
                  className="block py-2 px-3 text-black no-underline hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Services
                </NavLink>
                <NavLink
                  to="/OurCommitment"
                  className="block py-2 px-3 mr-3 text-black no-underline hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Our Commitment
                </NavLink>
              </>
            )}
          </div>

          {/* Right Section (Hamburger Menu + Text) */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
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
        </div>

        {/* Overlay (Blurred Background) */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          ></div>
        )}

        {/* Offcanvas Menu (Right Side) */}
        <div
          className={`fixed inset-y-0 right-0 w-full sm:w-95 bg-white text-black shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out z-50 flex flex-col h-full`}
        >
          {/* Header */}
          <div className="p-5 flex justify-between items-center border-b border-gray-300">
            <span className="text-lg font-semibold">
              <a>
                {user ? (
                  <>
                    <div className="text-2xl mb-3">
                      {/* Display role-specific greeting */}
                      Welcome, {role === "admin" ? "Admin" : firstName || "User"}!
                    </div>
                    <button
                      onClick={handleLogout}
                      className="py-1 px-1 text-black hover:bg-red-200 rounded"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Loginmodal />
                )}
              </a>
            </span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
              ✕
            </button>
          </div>

          <ul className="p-4 space-y-3 flex flex-col items-center text-center flex-grow w-full text-xl">
            {/* Conditional Rendering of Menu Items */}
            {role === "admin" ? (
              <>
              <li className="w-full">
                <div className="md:hidden block py-2 px-3 text-black no-underline hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-105 active:scale-95" onClick={() => setManageUsersShow(true)}>
                  Manage Users
                </div>
              </li>
              <li className="w-full">
                <NavLink
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
                >
                  Messages
                </NavLink>
              </li>
              </>
              
            ) : (
              <>
                <li className="w-full m:hidden">
                  <NavLink
                    to="/About"
                    onClick={() => setIsOpen(false)}
                    className="md:hidden block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
                  >
                    About Us
                  </NavLink>
                </li>
                <li className="w-full m:hidden">
                  <NavLink
                    to="/Services"
                    onClick={() => setIsOpen(false)}
                    className="md:hidden block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
                  >
                    Services
                  </NavLink>
                </li>
                <li className="w-full m:hidden">
                  <NavLink
                    to="/OurCommitment"
                    onClick={() => setIsOpen(false)}
                    className="md:hidden block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
                  >
                    Our Commitment
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/TrackPackage"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-orange-100 active:bg-orange-200"
                  >
                    Track Package
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/Contact"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-orange-100 active:bg-orange-200"
                  >
                    Contact Us!
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/ChatHelp"
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-orange-100 active:bg-orange-200"
                  >
                    Need Help?
                  </NavLink>
                </li>
              </>
            )}

            {/* Offcanvas Footer */}
            <li className="mt-auto pt-4 border-t w-full text-center text-gray-500 text-sm">
              © 2025 Frances Logistics. All rights reserved.
            </li>
          </ul>
          <ManageUsers show={manageUsersShow} onHide={() => setManageUsersShow(false)} />
        </div>
      </nav>
      )}
    </>
  );
};

export default Navbar;
