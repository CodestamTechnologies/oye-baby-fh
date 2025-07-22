"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/cr1.jpg",
  "/cr2.jpg",
  "/cr3.jpg",
  "cr4.jpg",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] lg:h-[400px] mx-auto  overflow-hidden shadow-lg">
      <div className="relative w-full h-full">
        <AnimatePresence>
          <motion.img
            key={images[currentIndex]}
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="absolute w-full h-full object-fit"
          />
        </AnimatePresence>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10 z-10" />

        {/* Oye Baby Heading */}
        <div className="absolute top-15 md:top-20 left-1/2 transform -translate-x-1/2 z-20">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#1A2A44] mb-2 " style={{ textShadow: '-1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF' }}>
           OYE BABY
          </h1>
        </div>

        {/* Centered Button */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <a
            href="https://www.google.com/maps?q=sarala+birla+university+ranchi"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition"
          >
            Visit My Store
          </a>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
