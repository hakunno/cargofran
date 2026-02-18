import React, { useRef } from "react";
import { Link } from "react-router-dom";
import Carousel from "./Carousel.jsx";
import LoginModal from "../modals/Login";
import { useAuth } from "../utils/AuthContext";
import useSiteSettings from "../hooks/useSiteContent.js"; // 1. Import Hook

// Default Imports (Fallback if no DB data)
import DefaultBg from "../assets/BackgroundImage.png";
import img1 from "../assets/Requestshipping.jpg";
import img2 from "../assets/Tracking.jpg";
import img3 from "../assets/Forklift.jpg";

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const { settings } = useSiteSettings(); // 2. Get Data
  const loginRef = useRef(null);

  const slides = [
    { 
      src: img1, 
      label: "REQUEST SHIPPING", 
      to: user ? "/ShippingInquiry" : "#", 
      onClick: (e) => {
        if (!user && !authLoading) {
          e.preventDefault();
          loginRef.current.openModal("/shipments");
        }
      },
      className: "oswald !text-4xl drop-shadow-[1px_0px_1px_rgba(0,0,0,1)]",
      info: "Learn more about our shipping services"
    },
    { 
      src: img2, 
      label: "MONITOR SHIPMENT", 
      to: "/TrackPackage", 
      className: "oswald !text-4xl drop-shadow-[2px_2px_2px_rgba(0,0,0,1)]",
      info: "Track your package status"
    },
    { 
      src: img3, 
      label: "SERVICES", 
      to: "/Services", 
      className: "oswald !text-4xl drop-shadow-[2px_2px_2px_rgba(0,0,0,1)]",
      info: "Explore our range of services"
    },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* 3. Use DB Image or Fallback */}
      <img 
        src={settings?.homeBgUrl || DefaultBg}
        className="absolute inset-0 w-full h-full object-cover -z-10"
        alt="Background"
      />

      <div className="relative flex flex-col pt-30 text-white px-6 text-center min-h-screen">
        <div className="absolute inset-0 bg-black opacity-30"></div> 
        <Carousel slides={slides} autoSlide={true} autoSlideInterval={5000} />
        
        {/* 4. Use DB Text or Fallback */}
        <h1 className="oswald drop-shadow-[2px_2px_2px_rgba(0,0,0,1)] relative pt-10 !text-5xl md:!text-6xl font-bold uppercase">
          {settings?.heroHeadline || "CONNECTING COUNTRIES ONE MOVEMENT AT A TIME"}
        </h1>
        <p className="kanit-thin drop-shadow-[2px_2px_2px_rgba(0,0,0,1)] relative mt-4 pb-20 !text-lg md:!text-2xl">
          {settings?.heroSubheadline || "Experience Seamless Freight and Logistics Services with FLS-OPC"}
        </p>
      </div>
      <LoginModal ref={loginRef} setIsOpen={() => {}} hideTrigger={true} /> 
    </div>
  );
};

export default Home;