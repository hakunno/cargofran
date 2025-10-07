import React, { useRef, useState } from "react";
import BackgroundImage from "../assets/BackgroundImage.png"; // Ensure it's correctly placed in the public folder or accessible
import { Link } from "react-router-dom";
import Carousel from "./Carousel.jsx";
import img1 from "../assets/Shipping.jpg";
import img2 from "../assets/Track.jpeg";
import img3 from "../assets/picture1.avif";
import LoginModal from "../modals/Login"; // Adjust path as needed
import { useAuth } from "../utils/AuthContext"; // Adjust path as needed (assuming AuthContext is in a separate file)

const Home = () => {
  const { user, loading } = useAuth();
  const loginRef = useRef(null);

  const slides = [
    { 
      src: img1, 
      label: "REQUEST SHIPPING", 
      to: user ? "/ShippingInquiry" : "#", 
      onClick: (e) => {
        if (!user && !loading) {
          e.preventDefault();
          loginRef.current.openModal("/shipments");
        }
      },
      className: "oswald !text-4xl drop-shadow-[1px_0px_1px_rgba(0,0,0,1)]",
      info: "Learn more about our shipping services"
    },
    { 
      src: img2, 
      label: "TRACK PACKAGE", 
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
      <img 
        src={BackgroundImage}
        className="absolute inset-0 w-full h-full object-cover -z-10"
        alt="Background"
      />

      <div className="relative flex flex-col pt-30 text-white px-6 text-center min-h-screen">
        <div className="absolute inset-0 bg-black opacity-30"></div> 
        <Carousel slides={slides} autoSlide={true} autoSlideInterval={5000} />
        <h1 className="oswald drop-shadow-[2px_2px_2px_rgba(0,0,0,1)] relative pt-10 !text-5xl md:!text-6xl font-bold">
          CONNECTING COUNTRIES ONE MOVEMENT AT A TIME
        </h1>
        <p className="kanit-thin drop-shadow-[2px_2px_2px_rgba(0,0,0,1)] relative mt-4 pb-20 !text-lg md:!text-2xl">
          Experience Seamless Freight and Logistics Services with FLS-OPC
        </p>
      </div>
      <LoginModal ref={loginRef} setIsOpen={() => {}} hideTrigger={true} />  {/* Pass hideTrigger=true */}
    </div>
  );
};

export default Home;