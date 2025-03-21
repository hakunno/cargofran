import React from "react";
import BackgroundVideo from "../assets/background.mp4"; // Ensure it's correctly placed in the public folder or accessible
import { Link } from "react-router-dom";

const Home = () => {
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

    <div className="relative flex flex-col pt-35 text-white px-6 text-center min-h-screen">
      <div className="absolute inset-0 bg-cyan-300 opacity-30"></div> 
      <h1 className="oswald drop-shadow-[2px_2px_2px_rgba(0,0,0,1)] relative !text-5xl md:!text-6xl font-bold">
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
