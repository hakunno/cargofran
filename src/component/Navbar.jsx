import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../jsfile/firebase"; // Import Firestore
import Logo from "../assets/logo.png";
import Loginmodal from "../modals/Login";
import ManageUsers from "../modals/ManageUsers";
import { signOut } from "firebase/auth"; // Import the Firebase signOut method
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { FaUserCircle } from "react-icons/fa";
import "../assets/css/Navbartesting.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [iconIsOpen, setIconIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState(""); // State for first name
  const [role, setRole] = useState(undefined); // Initial state is undefined
  const [manageUsersShow, setManageUsersShow] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
        ${role === "admin" || role === "staff" ? "bg-blue-300 border-b-2 md:hidden" : "bg-white"} 
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
              <div
              className="lexend mr-3 cursor-pointer relative block py-2 px-3 text-black no-underline rounded transition-all duration-200 transform hover:scale-105 active:scale-95 
                          after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 
                          hover:after:w-full"
              onClick={() => setManageUsersShow(true)}
            >
              Manage Users
            </div>
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
                    `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-0 scale-110" : "after:w-0 hover:after:w-full"}`
                  }
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/Services"
                  className={({ isActive }) =>
                    `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-0 scale-110" : "after:w-0 hover:after:w-full"}`
                  }
                >
                  Services
                </NavLink>
                <NavLink
                  to="/OurCommitment"
                  className={({ isActive }) =>
                    `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-0 scale-110" : "after:w-0 hover:after:w-full"}`
                  }
                >
                  Our Commitment
                </NavLink>
              </>
              /* NO ROLES */
            ) : (
              <>
                <NavLink
                  to="/About"
                  className={({ isActive }) =>
                    `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-0 scale-110" : "after:w-0 hover:after:w-full"}`
                  }
                >
                  About Us
                </NavLink>
                <NavLink
                  to="/Services"
                  className={({ isActive }) =>
                    `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-0 scale-110" : "after:w-0 hover:after:w-full"}`
                  }
                >
                  Services
                </NavLink>
                <NavLink
                  to="/OurCommitment"
                  className={({ isActive }) =>
                    `lexend relative block py-2 px-3 text-black no-underline transition-all duration-200 transform hover:scale-105 active:scale-95 
                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300
                    ${isActive ? "after:w-0 scale-110" : "after:w-0 hover:after:w-full"}`
                  }
                >
                  Our Commitment
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
                  className={`transition-all duration-300 ${
                    iconIsOpen ? "text-black scale-110" : "text-gray-700"
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md 
                            transition-all duration-300 ease-in-out ${
                              iconIsOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
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
          <div className="flex items-center space-x-2 md:space-x-3">
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
                  <Loginmodal setIsOpen={setIsOpen}/>
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
                <div className="kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 hover:bg-blue-200 active:bg-blue-300 
                              hover:scale-105 cursor-pointer"
                 onClick={() => setManageUsersShow(true)}>
                  Manage Users
                </div>
              </li>
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
                  to="/AdminDashboard"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `kanit-regular border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                  }
                >
                  Dashboard
                </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/ChatHelp"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `kanit-regular border-b-2 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                    }
                  >
                    Messages
                  </NavLink>
                </li>
              </>

              /* USERS NAVIGATION BAR */
            ) : role === "user" ? (
            <>
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
                    to="/OurCommitment"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                    }
                  >
                    Our Commitment
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
                    `kanit-regular border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                    ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                  }
                >
                   Chat with Admin
                </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/Contact"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `kanit-regular border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                    }
                  >
                    Contact Us!
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/ChatHelp"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `kanit-regular border-b-2 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                    }
                  >
                    Need Help?
                  </NavLink>
                </li>
              </>

              /* NOT LOGGED IN / NO ROLES NAVIGATION BAR */
          ) : (
            <>
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
                    to="/OurCommitment"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `kanit-regular md:hidden border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                    }
                  >
                    Our Commitment
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
                      `kanit-regular border-b border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                    }
                  >
                    Contact Us!
                  </NavLink>
                </li>
                <li className="w-full">
                  <NavLink
                    to="/ChatHelp"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `kanit-regular border-b-2 border-t block w-full py-3 px-3 text-black no-underline transition-all duration-200 
                      ${isOpen && isActive ? "bg-blue-200 scale-105" : "hover:bg-blue-200 hover:scale-105 active:bg-blue-300"}`
                    }
                  >
                    Need Help?
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
        </div>
      </nav>
      )}
    </>
  );
};

export default Navbar;
