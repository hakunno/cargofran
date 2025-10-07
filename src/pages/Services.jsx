import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import heroImg from "../assets/manpush.png";
import freightImg from "../assets/truckthing.png";
import roadImg from "../assets/boxthing.png";
import servicesBg from "../assets/Services.png";

const ServicesPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    const handleScroll = () => AOS.refresh();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header Section */}
        <section className="bg-teal-700 text-white py-10 px-6 text-center">
          <div className="max-w-5xl mx-auto" data-aos="fade-up">
            <h3 className="text-3xl md:text-5xl font-bold leading-snug lexend">
              Delivering Excellence in Logistics
            </h3>
            <p className="text-gray-200 max-w-2xl mx-auto mt-3 kanit-thin">
              We provide innovative solutions to move your business forward —
              ensuring speed, reliability, and security at every stage of the journey.
            </p>
          </div>
        </section>

        {/* AIR & SEA FREIGHT */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto px-6 py-10">
          {/* Text first */}
          <div data-aos="fade-right" className="order-1">
            <h1 className="text-2xl text-center font-bold text-blue-600 mb-3 lexend">
              AIR & SEA FREIGHT
            </h1>
            <p className="mb-6 text-gray-600 text-lg">
              We specialize in providing seamless freight transportation
              solutions tailored to meet the unique needs of our clients.
              Our commitment to excellence ensures timely and secure delivery
              of goods worldwide.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 lexend">
              <li>Import / Export (Air & Sea)</li>
              <li>Domestic Freight</li>
              <li>Full Container Load (FCL)</li>
              <li>Less than Container Load (LCL)</li>
            </ul>
          </div>

          {/* Image second */}
          <div data-aos="fade-left" className="order-2 flex justify-center">
            <img
              src={heroImg}
              alt="Air & Sea Freight"
              className="w-full max-w-md rounded-lg object-contain"
            />
          </div>
        </section>

        {/* ROAD FREIGHT */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto px-6 py-10">
          {/* Image first on desktop, second on mobile */}
          <div data-aos="fade-left" className="order-2 md:order-1 flex justify-center">
            <img
              src={freightImg}
              alt="Road Freight"
              className="w-full max-w-md rounded-lg object-contain"
            />
          </div>

          {/* Text second on desktop, first on mobile */}
          <div data-aos="fade-right" className="order-1 md:order-2">
            <h1 className="text-2xl text-center font-bold text-blue-600 mb-3 lexend">
              ROAD FREIGHT
            </h1>
            <p className="mb-6 text-gray-600 text-lg">
              With our reliable and affordable shipping options, you can rest
              assured that your packages will arrive on time and in perfect
              condition. Whether small parcels or large shipments, we handle
              each delivery with care and precision.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 lexend">
              <li>Pick-up and Delivery</li>
              <li>Full Truckload (FTL)</li>
              <li>Less than Truckload (LTL)</li>
            </ul>
          </div>
        </section>

        {/* SPECIAL SERVICES */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto px-6 py-10">
          {/* Text first */}
          <div data-aos="fade-right" className="order-1">
            <h1 className="text-2xl text-center font-bold text-blue-600 mb-3 lexend">
              SPECIAL SERVICES
            </h1>
            <p className="mb-6 text-gray-600 text-lg">
              Navigating the complexities of customs clearance is made effortless
              with our expert team. We streamline the process to ensure smooth,
              fast, and compliant shipment handling.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 lexend">
              <li>Customs Clearance</li>
              <li>Documentation Assistance</li>
              <li>Cargo Consolidation</li>
            </ul>
          </div>

          {/* Image second */}
          <div data-aos="fade-left" className="order-2 flex justify-center">
            <img
              src={roadImg}
              alt="Special Services"
              className="w-full max-w-md rounded-lg object-contain"
            />
          </div>
        </section>

        {/* BY THE NUMBERS */}
        <section className="bg-teal-700 text-white py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
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
              <p className="text-gray-200 mt-2 lexend">Tons Transported</p>
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
