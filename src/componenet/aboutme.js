"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Variants for animation
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { y: 40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function AboutPreview() {
  return (
    <motion.section
      className="w-full text-white py-20 px-6 font-mono"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.45 }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">
        {/* Text Section */}
        <motion.div
          className="space-y-6 text-center md:text-left"
          variants={item}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_4px_10px_rgba(168,85,247,0.6)]"
            variants={item}
          >
            About Me
          </motion.h2>

          <motion.p
            className="text-lg text-gray-300 leading-relaxed"
            variants={item}
          >
            Hi, I’m{" "}
            <span className="text-purple-300 font-semibold">Iftikhar Ali</span>,
            a{" "}
            <span className="text-purple-300">Full-Stack Web Developer</span>{" "}
            passionate about building modern, scalable, and user-friendly
            applications with{" "}
            <span className="text-purple-300">
              React, Next.js, Node.js, MongoDB
            </span>{" "}
            and more.
          </motion.p>

          {/* Button with water distortion */}
          <motion.div
            className="relative group w-fit mx-auto md:mx-0"
            variants={item}
          >
            {/* Distortion background */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                backdropFilter: "url(#button-water-distort)",
                WebkitBackdropFilter: "url(#button-water-distort)",
              }}
            />

            <Link
              href="/about"
              className="relative cursor-pointer px-6 py-3 border-2 border-purple-400/50 text-white text-base md:text-lg rounded-lg font-bold shadow-lg shadow-purple-500/30 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 transition"
            >
              Read More
            </Link>
          </motion.div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          className="flex justify-center md:justify-end"
          variants={item}
        >
          <Image
            src="/myimage.png"
            alt="Iftikhar Ali"
            width={320}
            height={320}
            className="rounded-full shadow-lg shadow-purple-500/40 border-4 border-purple-400/20"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
