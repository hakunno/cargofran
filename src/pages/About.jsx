import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import aboutUsBg from "../assets/About.png";
import logo from "../assets/man.png";
import flc from "../assets/locationthing.png";
import trustedpartner from "../assets/trustedpartners.png";
import portrait from "../assets/box.png";
import partner1 from "../assets/General_Transport.avif";
import partner2 from "../assets/IDI_Software.avif";
import partner3 from "../assets/Tri-Nex.avif";
import partner4 from "../assets/Imogen_Cars.avif";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    const handleScroll = () => AOS.refresh();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* HERO / BACKGROUND SECTION */}
      <div
        className="w-full min-h-screen bg-cover bg-center relative flex flex-col justify-center"
        style={{ backgroundImage: `url(${aboutUsBg})` }}
      >
        {/* Overlay (optional) */}
        <div className="absolute inset-0 bg-black/10 md:bg-transparent"></div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full px-6 md:px-20 py-10 md:py-0 space-y-10 md:space-y-0">
          {/* Left - Info Card */}
          <div
            className="bg-white rounded-2xl p-1 md:bg-transparent md:rounded-none rounded-2xl p-6 md:p-10 max-w-xl w-full"
            data-aos="fade-right"
          >
            <div className="flex justify-center mb-6">
              <img src={logo} alt="FLS-OPC Logo" className="h-50 md:h-34 w-auto" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 text-center text-gray-800 lexend">
              Why Choose <span className="text-blue-600">FLS-OPC</span>?
            </h3>

            <h4 className="text-base md:text-lg font-medium mb-4 text-center text-gray-700 lexend">
              A Commitment to Seamless Logistics
            </h4>
            
            <p className="text-sm md:text-base leading-relaxed text-gray-700 text-justify kanit-thin">
              At <span className="font-semibold text-blue-700">FLS-OPC</span>, we adopt
              innovative approaches to logistics, ensuring smooth and reliable
              movement of goods. Our dedication to excellence and customer satisfaction
              sets us apart in the industry.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 text-justify kanit-thin">
              <span className="font-semibold text-blue-700">Francess Logistics Services OPC</span> was founded in 2023 with a mission to deliver efficient, reliable, and customer-focused logistics solutions. Backed by years of industry experience since 2016, we specialize in freight forwarding, cargo handling, warehousing, and supply chain management.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-gray-700 text-justify kanit-thin">
              From inquiry to delivery, our team ensures every shipment is handled with care, transparency, and professionalism. As a growing <span className="font-semibold text-blue-700">One-Person Corporation</span>, we are dedicated to simplifying logistics for businesses and individuals—providing innovative services that move your cargo with confidence and precision.
              </p>
          </div>


          {/* Center - Portrait (visible on all sizes now) */}
          <div
            className="flex justify-center md:flex-none md:mx-auto"
            data-aos="zoom-in"
          >
            <img
              src={portrait}
              alt="Portrait"
              className="hidden md:block h-90 md:h-[700px] object-cover rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* OUR VISION SECTION */}
      <section className="w-full bg-cyan-900 py-10 px-6 text-center">
        <div className="max-w-3xl mx-auto" data-aos="fade-up">
          <img
            src={flc}
            alt="International Carriers"
            className="mx-auto h-28 md:h-40 mb-6 md:mb-10"
          />
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-white lexend">
            Our Vision
          </h3>
          <p className="text-white text-sm md:text-lg leading-relaxed kanit-thin">
            At Francess Logistics Services OPC, we are revolutionizing the movement
            of goods across the globe. With a focus on efficiency and reliability,
            we aim to redefine the logistics industry.
          </p>
        </div>
      </section>

      {/* TRUSTED PARTNERS SECTION */}
      <section className="w-full bg-teal-700 py-12 px-6 text-white">
        <div className="text-center mb-10">
          <img
            src={trustedpartner}
            alt="Trusted Partners"
            className="mx-auto h-28 md:h-40 mb-4"
            data-aos="fade-up"
          />
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left text */}
          <div data-aos="fade-up" className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold mb-4 lexend">
              Trusted Partners
            </h2>
            <p className="text-base text-left md:text-lg leading-relaxed kanit-thin">
              We are proud to collaborate with industry-leading partners who share
              our commitment to excellence in logistics. Together, we deliver
              seamless and reliable global logistics solutions.
            </p>
          </div>

          {/* Right logos — 2 columns on mobile (2x2), 2 columns on md as well */}
          <div className="grid grid-cols-2 gap-6 md:gap-10 text-center">
            <div>
              <img
                src={partner1}
                alt="International Carriers"
                className="mx-auto h-20 md:h-16 mb-2"
                data-aos="fade-right"
              />
              <p className="uppercase text-xs md:text-sm kanit-thin">
                International Carriers
              </p>
            </div>
            <div>
              <img
                src={partner2}
                alt="Customs Agencies"
                className="mx-auto h-20 md:h-16 mb-2"
                data-aos="fade-left"
              />
              <p className="uppercase text-xs md:text-sm kanit-thin">
                Customs Agencies
              </p>
            </div>
            <div>
              <img
                src={partner3}
                alt="Warehousing Experts"
                className="mx-auto h-20 md:h-16 mb-2"
                data-aos="fade-right"
              />
              <p className="uppercase text-xs md:text-sm kanit-thin">
                Warehousing Experts
              </p>
            </div>
            <div>
              <img
                src={partner4}
                alt="Technology Providers"
                className="mx-auto h-20 md:h-16 mb-2"
                data-aos="fade-left"
              />
              <p className="uppercase text-xs md:text-sm kanit-thin">
                Technology Providers
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default AboutUs;