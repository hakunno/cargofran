import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import imgAbout    from "../assets/Forklift.jpg";
import imgServices from "../assets/Requestshipping.jpg";
import imgLogin    from "../assets/Shipping.jpg";
import imgTrack    from "../assets/Tracking.jpg";
import imgContact  from "../assets/Truckbehind.jpg";

const cards = [
  {
    img: imgAbout,
    route: "/About",
    isLogin: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "ABOUT US",
    desc: "Francess Logistics Services OPC — founded with a mission to deliver efficient, reliable, and customer-focused logistics solutions since 2016.",
    cta: "Learn More",
  },
  {
    img: imgServices,
    route: "/Services",
    isLogin: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "SERVICES",
    desc: "Air & Sea Freight, Road Freight, Customs Clearance, Cargo Consolidation — seamless end-to-end logistics solutions for every shipment.",
    cta: "Explore",
  },
  {
    img: imgLogin,
    route: null,
    isLogin: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
    title: "LOG IN",
    desc: "Access your account to request shipments, track packages, and manage your logistics profile with FLS-OPC.",
    cta: "Sign In",
  },
  {
    img: imgTrack,
    route: "/TrackPackage",
    isLogin: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    title: "TRACK PACKAGE",
    desc: "Monitor your shipment status in real time. Get live updates on your cargo from pickup to final destination.",
    cta: "Track Now",
  },
  {
    img: imgContact,
    route: "/Contact",
    isLogin: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6A16 16 0 0 0 15.4 16.09l.96-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: "CONTACT US",
    desc: "Reach out to our team for inquiries, support, or partnership opportunities. We're here to help 24/7.",
    cta: "Get in Touch",
  },
];

const WhyChooseUs = ({ loginRef }) => {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    if (card.isLogin) {
      // Open the login modal via the ref passed from VideoBackground
      if (loginRef?.current?.openModal) {
        loginRef.current.openModal();
      }
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
      navigate(card.route);
    }
  };

  return (
    <section className="w-full bg-[#0a0f1e]">
      <div className="flex flex-col md:flex-row w-full" style={{ minHeight: "480px" }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handleCardClick(card)}
            className="relative overflow-hidden cursor-pointer group"
            style={{
              flexGrow: hovered === idx ? 1.5 : 1,
              flexShrink: 1,
              flexBasis: "0%",
              minHeight: "420px",
              transition: "flex-grow 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {/* Background Image */}
            <img
              src={card.img}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Permanent dark gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, rgba(5,10,30,0.25) 0%, rgba(5,10,30,0.65) 45%, rgba(5,10,30,0.96) 100%)",
              }}
            />

            {/* Blue hover tint */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background: "linear-gradient(to bottom, rgba(10,60,180,0.08), rgba(10,60,180,0.30))",
                opacity: hovered === idx ? 1 : 0,
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end h-full px-5 pb-8 pt-6 min-w-[220px]">
              {/* Icon Circle */}
              <div className="mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                  style={{
                    background: hovered === idx ? "white" : "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: hovered === idx ? "#1d4ed8" : "white",
                    transform: hovered === idx ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {card.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-white font-black text-sm md:text-base uppercase tracking-widest leading-tight mb-2 drop-shadow-lg">
                {card.title}
              </h3>

              {/* Description */}
              <p
                className="text-gray-200 text-xs leading-relaxed transition-all duration-500"
                style={{
                  opacity: hovered === idx ? 1 : 0.7,
                  transform: hovered === idx ? "translateY(0)" : "translateY(5px)",
                }}
              >
                {card.desc}
              </p>

              {/* CTA */}
              <div
                className="mt-4 flex items-center gap-1.5 text-blue-400 text-[11px] font-bold uppercase tracking-widest transition-all duration-500"
                style={{
                  opacity: hovered === idx ? 1 : 0,
                  transform: hovered === idx ? "translateY(0)" : "translateY(8px)",
                }}
              >
                {card.cta}
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              {/* Accent line */}
              <div
                className="mt-3 h-0.5 bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: hovered === idx ? "36px" : "0px" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
