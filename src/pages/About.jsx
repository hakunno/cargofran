import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import aboutUsBg from "../assets/About.png";
import logo from "../assets/man.png";
import flc from "../assets/locationthing.png";
import trustedpartner from "../assets/trustedpartners.png";
import portrait from "../assets/box.png"; // <-- your big portrait image
import partner1 from "../assets/General_Transport.avif";
import partner2 from "../assets/IDI_Software.avif";
import partner3 from "../assets/Tri-Nex.avif";
import partner4 from "../assets/Imogen_Cars.avif";

const AboutUs = () => {
  useEffect(() => {
    // 🔥 Reset animations when scrolling up
    AOS.init({ duration: 1000, once: false });

    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* HERO / BACKGROUND SECTION */}
      <div
        className="w-full h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url(${aboutUsBg})` }}
      >
        {/* Optional overlay */}
        <div className="absolute inset-0"></div>

        {/* MAIN ROW: left card | center portrait | right spacer */}
        <div className="relative z-10 flex items-center h-full px-6 md:px-20">
          {/* Left - Info Card */}
          <div className="flex-1 flex items-start" data-aos="fade-right">
            <div className="bg-white rounded-2xl p-8 md:p-10 max-w-2xl text-left">
              <div className="flex justify-center mb-6">
                <img
                  src={logo}
                  alt="FLS-OPC Logo"
                  className="h-50 w-auto"
                />
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-800 lexend text-center">
                Why Choose <span className="text-blue-600">FLS-OPC</span>?
              </h3>

              <h4 className="text-lg md:text-xl font-medium mb-6 text-gray-700 lexend">
                A Commitment to Seamless Logistics
              </h4>

              <p className="text-base md:text-lg leading-relaxed text-gray-800 kanit-thin">
                At <span className="font-semibold text-blue-700">FLS-OPC</span>, we adopt
                innovative approaches to logistics, ensuring a smooth and reliable
                movement of goods. Our dedication to excellence and customer
                satisfaction sets us apart in the industry.
              </p>
            </div>
          </div>

          {/* Center - Portrait */}
          <div
            className="flex-none mx-auto hidden md:flex items-center justify-center px-6"
            data-aos="zoom-in"
          >
            <img
              src={portrait}
              alt="Portrait"
              className="h-[400px] md:h-[650px] object-cover rounded-xl "
            />
          </div>

          {/* Right spacer */}
          <div className="flex-1" />
        </div>
      </div>

            {/* OUR VISION SECTION */}
      <section className="w-full bg-cyan-900 py-6">
        <div className="max-w-3xl mx-auto text-center px-6" data-aos="fade-up">
          <img src={flc} alt="International Carriers" className="mx-auto h-40 mb-12" />
          <h3 className="text-xl font-semibold mb-4 text-white lexend">
            Our Vision
          </h3>
          <p className="text-white text-lg md:text-xl leading-relaxed kanit-thin">
            At Francess Logistics Services OPC, we are revolutionizing the movement of goods across the globe. 
            With a focus on efficiency and reliability, we aim to redefine the logistics industry.
          </p>
        </div>
      </section>

      {/* TRUSTED PARTNERS SECTION */}
      <section className="w-full bg-teal-700 py-6 text-white">
        <img src={trustedpartner} alt="International Carriers" className="mx-auto h-45 mb-12" data-aos="fade-up"/>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          {/* Left text */}
          <div data-aos="fade-up">
            <h2 className="text-2xl font-bold mb-4 lexend">Trusted Partners</h2>
            <p className="text-xl leading-relaxed kanit-thin">
              We are proud to collaborate with industry-leading partners who share 
              our commitment to excellence in logistics services. Together, we ensure 
              seamless and reliable global logistics solutions.
            </p>
          </div>

          {/* Right logos */}
          <div className="grid grid-cols-2 gap-10 text-center" data-aos="fade-left">
            <div>
              <img src={partner1} alt="International Carriers" className="mx-auto h-16 mb-2" />
              <p className="uppercase text-sm kanit-thin">International Carriers</p>
            </div>
            <div>
              <img src={partner2} alt="Customs Agencies" className="mx-auto h-16 mb-2" />
              <p className="uppercase text-sm kanit-thin">Customs Agencies</p>
            </div>
            <div>
              <img src={partner3} alt="Warehousing Experts" className="mx-auto h-16 mb-2" />
              <p className="uppercase text-sm kanit-thin">Warehousing Experts</p>
            </div>
            <div>
              <img src={partner4} alt="Technology Providers" className="mx-auto h-16 mb-2" />
              <p className="uppercase text-sm kanit-thin">Technology Providers</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
