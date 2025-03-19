import { useState } from "react";   
import "../assets/css/Navbartesting.css"
import Logo from "../assets/logo2.png"
import Loginmodal from "../modals/Login"
import { NavLink } from "react-router-dom"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  

  return (
    <nav className="border-b border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 font-semibold">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-3">
          <img
            src={Logo}
            className="h-12 w-auto"
            alt="FCL"
          />
        </NavLink>

        {/* Navbar Links (Desktop Only) */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
            <NavLink 
            to="/About" className="block py-2 px-3 text-black no-underline hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              About Us
            </NavLink>
            <NavLink 
            to="/Services" className="block py-2 px-3 text-black no-underline hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Services
            </NavLink>
            <NavLink 
            to="/OurCommitment" className="block py-2 px-3 text-black no-underline hover:bg-gray-100 rounded transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Our Commitment
            </NavLink>
        </div>

        {/* Right Section (Hamburger Menu + Text) */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Text label beside hamburger (Desktop Only) */}

          {/* Hamburger Button */}
          <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
            >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        className={`fixed inset-y-0 right-0 w-full sm:w-95 bg-white text-black shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 flex flex-col h-full`} // Ensure full height
      >
        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-gray-300">
          <span className="text-lg font-semibold">
            <a
              onClick={() => setIsOpen(false)}
            >
              <Loginmodal />
            </a>
          </span>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        <ul className="p-4 space-y-3 flex flex-col items-center text-center flex-grow w-full">
        {/* These will only show inside the hamburger menu on mobile */}
        <li className="md:hidden w-full">
          <NavLink
            to="/About"
            onClick={() => setIsOpen(false)}
            className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
          >
            About Us
          </NavLink>
        </li>
        <li className="md:hidden w-full">
        <NavLink
            to="/Services"
            onClick={() => setIsOpen(false)}
            className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
          >
            Services
          </NavLink>
        </li>
        <li className="md:hidden w-full">
        <NavLink
            to="/OurCommitment"
            onClick={() => setIsOpen(false)}
            className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
          >
            Our Commitment
          </NavLink>
        </li>

        {/* Always inside the hamburger menu */}
        <li className="w-full">
          <NavLink
            to="/TrackPackage"
            onClick={() => setIsOpen(false)}
            className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
          >
            Track Package
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/Contact"
            onClick={() => setIsOpen(false)}
            className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
          >
            Contact Us!
          </NavLink>
        </li>
        <li className="w-full">
          <NavLink
            to="/ChatHelp"
            onClick={() => setIsOpen(false)}
            className="block w-full py-3 px-3 text-black no-underline rounded transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
          >
            Need Help?
          </NavLink>
        </li>

        {/* Offcanvas Footer */}
        <li className="mt-auto pt-4 border-t w-full text-center text-gray-500 text-sm">
          © 2025 Frances Logistics. All rights reserved.
        </li>
      </ul>

      </div>
    </nav>
  );
};

export default Navbar;
