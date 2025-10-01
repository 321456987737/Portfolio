"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.6,
    },
  },
};

const item = {
  hidden: { y: 80, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const Firstcomponent = () => {
  const turbulenceRef = useRef(null);

  // Animate turbulence for buttons
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame += 0.005;
      if (turbulenceRef.current) {
        turbulenceRef.current.setAttribute(
          "baseFrequency",
          `0.02 ${0.03 + Math.sin(frame) * 0.01}`
        );
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <>
      {/* SVG filter for buttons */}
      <svg className="absolute w-0 h-0">
        <filter id="button-water-distort">
          <feTurbulence
            ref={turbulenceRef}
            type="turbulence"
            baseFrequency="0.02 0.03"
            numOctaves="3"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="15"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="w-full min-h-screen flex font-mono items-center justify-center px-4 sm:px-6 lg:px-8 text-white">
        <motion.div
          className="flex flex-col gap-7 items-center text-center max-w-3xl"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Name */}
          <div className="flex flex-wrap justify-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_4px_10px_rgba(168,85,247,0.6)]">
            <motion.div
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-5"
              variants={item}
            >
              Iftikhar
            </motion.div>
            <motion.div
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-5 ml-2"
              variants={item}
            >
              <pre>Ali</pre>
            </motion.div>
          </div>

          {/* Title */}
          <motion.div
            className="font-mono text-lg sm:text-xl  lg:text-xl leading-snug mt-2 text-center text-gray-300"
            variants={item}
          >
            Full-Stack Web Developer |
            <span className="text-purple-300"> Next.js & Node.js</span>{" "}
            Specialist
          </motion.div>

          {/* Buttons with water effect only on background */}
          <motion.div
            className="flex flex-wrap gap-3 sm:gap-4 mt-6 justify-center"
            variants={item}
          >
            {/* View Work Button */}
            <div className="relative group z-49">
              {/* Water distorted background only */}
              <div
                className="absolute inset-0 rounded-lg "
                style={{
                  backdropFilter: "url(#button-water-distort)",
                  WebkitBackdropFilter: "url(#button-water-distort)",
                }}
              />

              {/* Clean border and text */}
              <button className="relative cursor-pointer px-6 py-3 border-2 border-purple-400/50 text-white text-base md:text-lg rounded-lg font-bold shadow-lg shadow-purple-500/30 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 transition">
                View my work
              </button>
            </div>

            {/* Contact Button */}
            <div className="relative group z-49">
              {/* Water distorted background only */}
              <div
                className="absolute inset-0 rounded-lg "
                style={{
                  backdropFilter: "url(#button-water-distort)",
                  WebkitBackdropFilter: "url(#button-water-distort)",
                  // backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
              />

              {/* Clean border and text */}
              <button className="relative cursor-pointer px-6 py-3 border-2 border-purple-400/50 text-white text-base md:text-lg rounded-lg font-bold shadow-lg shadow-purple-500/30 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 transition">
                Contact me
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Firstcomponent;
