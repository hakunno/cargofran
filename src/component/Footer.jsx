import React from "react";
import Logo from "../assets/logo.png";
import { FaPhone } from "react-icons/fa6";
import { FaMobileScreenButton } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";


const Footer = () => {
  return (
    <footer className="bg-white text-black py-10 border-t">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center md:flex-row md:justify-between text-center md:text-left">
        
        {/* Company Info */}
        <div className="flex flex-col items-center md:items-start">
        <div className="flex justify-center md:justify-start w-full">
            <img src={Logo} className="h-18 w-auto mb-2" alt="FCL" />
        </div>
        <p className="lexend mt-2 font-semibold text-center md:text-left">
            Connecting countries one movement at a time.
        </p>
        </div>


        {/* Contact Info */}
        <div className="lexend border-t md:border-t-0 flex flex-col items-center md:items-start mt-6 pt-5 md:!pt-0 md:mt-0">
          <h2 className="text-xl font-bold">Contact Us</h2>

          <p className="flex items-center space-x-2 ">
            <FaPhone className="text-lg h-4" />
            <span className="ml-1">+46 230 2842</span>
          </p>

          <p className="flex items-center space-x-2">
            <FaMobileScreenButton className="text-lg" />
            <span className="ml-1">+63 908 881 3881</span>
          </p>

          <p className="flex items-center space-x-2">
            <IoIosMail className="text-lg" />
            <span className="ml-2">info.sales@francesslogistics.com</span>
          </p>

          <p className="flex items-left md:!items-start space-x-2">
            <FaLocationDot className="text-lg" />
            <span className="ml-2 text-center md:!text-left">FAJC Building 2/F Unit-4 Buhay na Tubig, Imus, Cavite, Philippines</span>
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        © {new Date().getFullYear()} Francess Logistic Services OPC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
