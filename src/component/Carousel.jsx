import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

export default function Carousel({
  slides = [],
  autoSlide = false,
  autoSlideInterval = 3000,
  containerClass = "w-full max-w-md md:max-w-2xl lg:max-w-4xl aspect-[3/4] md:aspect-[4/3] lg:aspect-[16/9]"
}) {
  const [curr, setCurr] = useState(0);

  const prev = () => setCurr((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurr((c) => (c === slides.length - 1 ? 0 : c + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const id = setInterval(next, autoSlideInterval);
    return () => clearInterval(id);
  }, [autoSlide, autoSlideInterval]);

  return (
    <div className={`relative ${containerClass} mx-auto overflow-hidden border-4 border-white rounded-2xl shadow-2xl`}>
      <div
        className="flex transition-transform ease-out duration-500 h-full"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map(({ src, label, to, className, info }, i) => (
          <Link
            key={i}
            to={to}
            className="relative w-full h-full flex-shrink-0 shadow-lg overflow-hidden rounded-lg"
          >
            <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent bg-opacity-30 text-white text-xs md:text-sm text-center py-4 z-10 ${className || ''}`}>
              {label}
            </div>
            <img
              src={src}
              className="w-full h-full object-cover"
              alt={label || `slide ${i + 1}`}
            />
          </Link>
        ))}
      </div>

      {/* Prev/Next Buttons and Indicators remain unchanged */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-full bg-transparent hover:bg-white/30 z-10"
      >
        <FaChevronCircleLeft className="text-white opacity-50 hover:opacity-80 text-2xl md:text-4xl" />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-transparent hover:bg-white/30 z-10"
      >
        <FaChevronCircleRight className="text-white opacity-50 hover:opacity-80 text-2xl md:text-4xl" />
      </button>
      <div className="absolute bottom-4 left-0 right-0 z-10 flex flex-col items-center gap-2">
        <div className="bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
          {slides[curr].info || `Slide ${curr + 1} of ${slides.length}`}
        </div>
        <div className="flex justify-center gap-1">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`transition-all w-2 h-2 md:w-3 md:h-3 rounded-full bg-white shadow-md ${
                curr === i ? "scale-150 shadow-lg" : "bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}