"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import BackgroundPopEffect from "@/componenet/PopClicksCanvas";
import Link from "next/link";

export default function WaterNavbar() {
  const turbulenceRef = useRef(null);
  const [scrollDir, setScrollDir] = useState("up"); // "up" or "down"

  // Animate turbulence
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

  // Detect scroll direction
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY + 5) {
        setScrollDir("down");
      } else if (currentScrollY < lastScrollY - 5) {
        setScrollDir("up");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", updateScrollDir);
    return () => window.removeEventListener("scroll", updateScrollDir);
  }, []);

  return (
    <>
      <BackgroundPopEffect />
      {/* SVG filter */}
      <svg className="absolute w-0 h-0">
        <filter id="water-distort">
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
            scale="25"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`
          fixed left-1/2 -translate-x-1/2 z-50 
          w-[90%] max-w-5xl h-16
          font-mono text-lg
          transition-all duration-600 ease-in-out
          ${scrollDir === "down" ? "mt-5" : "mt-20"}
        `}
      >
        {/* Distorted background layer */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backdropFilter: "url(#water-distort)",
            WebkitBackdropFilter: "url(#water-distort)",
          }}
        />

        {/* Static border overlay */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white/10 pointer-events-none z-20" />

        {/* Content */}
        <div className="relative z-30 flex items-center justify-between px-6 h-full">
          <h1 className="font-bold text-white">Portfolio</h1>

          <ul className="flex gap-6 text-white/90 text-lg">
            <li className="hover:text-white transition">
              <Link href={"/"}>Home</Link>
            </li>
            <li className="hover:text-white transition">
              <Link href={"/projects"}>Projects</Link>
            </li>
            <li className="hover:text-white transition">
              <Link href={"/about"}>About</Link>
            </li>
            <li className="hover:text-white transition">
              <Link href={"/contact"}>Contact</Link>
            </li>
          </ul>
        </div>
      </motion.nav>
    </>
  );
}



// "use client";
// import React, { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import BackgroundPopEffect from "@/componenet/PopClicksCanvas";
// import Link from "next/link";
// export default function WaterNavbar() {
//   const turbulenceRef = useRef(null);

//   // Animate turbulence
//   useEffect(() => {
//     let frame = 0;
//     const animate = () => {
//       frame += 0.005;
//       if (turbulenceRef.current) {
//         turbulenceRef.current.setAttribute(
//           "baseFrequency",
//           `0.02 ${0.03 + Math.sin(frame) * 0.01}`
//         );
//       }
//       requestAnimationFrame(animate);
//     };
//     animate();
//   }, []);

//   return (
//     <>
//       <BackgroundPopEffect />
//       {/* SVG filter */}
//       <svg className="absolute w-0 h-0">
//         <filter id="water-distort">
//           <feTurbulence
//             ref={turbulenceRef}
//             type="turbulence"
//             baseFrequency="0.02 0.03"
//             numOctaves="3"
//             result="turb"
//           />
//           <feDisplacementMap
//             in="SourceGraphic"
//             in2="turb"
//             scale="25"
//             xChannelSelector="R"
//             yChannelSelector="G"
//           />
//         </filter>
//       </svg>
//       <div >

//       <motion.nav
//         initial={{ y: -80, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="
//           fixed
//            left-1/2 -translate-x-1/2 z-50 
//           w-[90%] max-w-5xl h-16 mt-20
//           font-mono text-lg"
//           >
//         {/* Distorted background layer (fills inside + border area) */}
//         <div
//           className="absolute inset-0"
//           style={{
//             backdropFilter: "url(#water-distort)",
//             WebkitBackdropFilter: "url(#water-distort)",
//           }}
//           />

//         {/* Static border overlay */}
//         <div className="absolute inset-0 rounded-2xl border-2 border-white/10 pointer-events-none z-20" />

//         {/* Content (inside border, unaffected) */}
//         <div className="relative z-30 flex items-center justify-between px-6 h-full">
//           <h1 className="font-bold text-white">Portfolio</h1>

//           <ul className="flex gap-6 text-white/90  text-lg">
//             <li className="hover:text-white transition ">
//               <Link href={"/"}>Home</Link>
//             </li>
//             <li className="hover:text-white transition">
//               <Link href={"/projects"}>Projects</Link>
//             </li>
//             <li className="hover:text-white transition">
//               <Link href={"/about"}>About</Link>
//             </li>
//             <li className="hover:text-white transition">
//               <Link href={"/contact"}>Contact</Link>
//             </li>
//           </ul>
//         </div>
//       </motion.nav>
//           </div>
//     </>
//   );
// }
