import React from "react";
import BackgroundVideo from "../assets/background.mp4"; // Ensure it's correctly placed in the public folder or accessible
import { Link } from "react-router-dom";
import Carousel from "./Carousel.jsx";
import img1 from "../assets/Shipping.jpg";
import img2 from "../assets/Track.jpeg";
import img3 from "../assets/picture1.avif";

const Home = () => {
  const slides = [
    { 
      src: img1, 
      label: "REQUEST SHIPPING", 
      to: "/shipments", 
      className: "oswald !text-4xl drop-shadow-[1px_0px_1px_rgba(0,0,0,1)]",
      info: "Learn more about our shipping services"
    },
    { 
      src: img2, 
      label: "TRACK PACKAGE", 
      to: "/track", 
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
      <video 
        className="absolute inset-0 w-full h-full object-cover -z-10"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={BackgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative flex flex-col pt-10 text-white px-6 text-center min-h-screen">
        <div className="absolute inset-0 bg-cyan-300 opacity-30"></div> 
        <Carousel slides={slides} autoSlide={true} autoSlideInterval={5000} />
        <h1 className="oswald drop-shadow-[2px_2px_2px_rgba(0,0,0,1)] relative pt-10 !text-5xl md:!text-6xl font-bold">
          CONNECTING COUNTRIES ONE MOVEMENT AT A TIME
        </h1>
        <p className="kanit-thin drop-shadow-[2px_2px_2px_rgba(0,0,0,1)] relative mt-4 !text-lg md:!text-2xl">
          Experience Seamless Freight and Logistics Services with FLS-OPC
        </p>
      </div>
    </div>
  );
};

export default Home;