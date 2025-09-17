import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import heroImg from "../assets/manpush.avif";
import freightImg from "../assets/truckthing.avif";
import roadImg from "../assets/boxthing.avif";
import servicesBg from "../assets/Services.png";

const ServicesPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false }); // 🔥 reset animations on scroll back
    const handleScroll = () => {
      AOS.refresh(); // keeps recalculating positions on scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="w-full bg-white text-gray-800 font-sans relative"
      style={{
        backgroundImage: `url(${servicesBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0  pointer-events-none"></div>

      {/* Content wrapper so overlay doesn’t block */}
      <div className="relative z-10">
        {/* Our Services Section */}
        <section className="bg-teal-700 text-white py-10">
          <div className="max-w-5xl mx-auto text-center" data-aos="fade-up">
            <h3 className="text-4xl md:text-5xl font-bold leading-snug lexend">
              Delivering Excellence in Logistics
            </h3>
            <p className="text-gray-200 max-w-2xl mx-auto kanit-thin mb-0 pb-0">
              We provide innovative solutions to move your business forward, 
              ensuring speed, reliability, and security at every stage of the journey.
            </p>
          </div>
        </section>

        {/* Air & Sea Freight */}
        <section className="grid md:grid-cols-2 gap-10 items-center max-w-[1600px] mx-auto">
          <div data-aos="fade-right">
            <h1 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2 lexend">
              AIR & SEA FREIGHT
            </h1>
            <p className="mb-6 pb-2 text-gray-600 text-xl">
              We specialize in providing seamless freight transportation solutions tailored
              to meet the unique needs of our clients. Our commitment to excellence ensures
              timely and secure delivery of goods worldwide.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 lexend">
              <li>Import Air/Sea Freight</li>
              <li>Export Air/Sea Freight</li>
              <li>Domestic Air/Sea Freight</li>
              <li>Full Container Load (FCL)</li>
              <li>Less than Container Load (LCL)</li>
            </ul>
          </div>
          <div data-aos="fade-left" className="flex justify-center items-center w-full">
            <img 
              src={heroImg} 
              alt="Hero" 
              className="w-full max-w-xl md:max-w-[1600px] rounded-lg object-contain" 
            />
          </div>
        </section>

        {/* Road Freight */}
        <section className="grid md:grid-cols-2 gap-12 items-center max-w-[1600px] mx-auto">
          <div data-aos="fade-right" className="flex justify-center items-center w-full">
            <img 
              src={freightImg} 
              alt="Road" 
              className="w-full max-w-xl md:max-w-[1600px] rounded-lg object-contain" 
            />
          </div>
          <div data-aos="fade-left">
            <h1 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2 lexend">
              ROAD FREIGHT
            </h1>
            <p className="mb-6 text-gray-600 text-xl pb-2">
              With our reliable and affordable shipping options, you can rest assured that
              your packages will arrive on time and in good condition. Whether you're shipping
              small items or large, we have the expertise and resources to get the job done right.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 lexend">
              <li>Pick-up and Delivery</li>
              <li>Full Truckload (FTL)</li>
              <li>Less than Truckload (LTL)</li>
            </ul>
          </div>
        </section>

        {/* Special Services */}
        <section className="grid md:grid-cols-2 gap-12 items-center max-w-[1600px] mx-auto">
          <div data-aos="fade-right">
            <h1 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2 lexend">
              SPECIAL SERVICES
            </h1>
            <p className="mb-6 text-gray-600 text-xl pb-2">
              Navigating the complexities of customs clearance is made effortless. We streamline
              the process to ensure efficient clearance of goods, minimizing delays and maximizing
              productivity.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 lexend">
              <li>Customs Clearance</li>
              <li>Documentation</li>
              <li>Consolidation</li>
            </ul>
          </div>
          <div data-aos="fade-left" className="flex justify-center items-center w-full">
            <img 
              src={roadImg} 
              alt="Special Services" 
              className="w-full max-w-xl md:max-w-[1600px] rounded-lg object-contain" 
            />
          </div>
        </section>

        {/* By the Numbers */}
        <section className="bg-teal-700 text-white py-15">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div data-aos="zoom-in">
              <h1 className="text-4xl font-bold oswald">100+</h1>
              <p className="text-gray-200 mt-2 lexend">Clients</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="100">
              <h1 className="text-4xl font-bold oswald">50+</h1>
              <p className="text-gray-200 mt-2 lexend">International Partners</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="200">
              <h1 className="text-4xl font-bold oswald">1B+</h1>
              <p className="text-gray-200 mt-2 lexend">Tons of Goods Transported</p>
            </div>
            <div data-aos="zoom-in" data-aos-delay="300">
              <h1 className="text-4xl font-bold oswald">24/7</h1>
              <p className="text-gray-200 mt-2 lexend">Support</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;
