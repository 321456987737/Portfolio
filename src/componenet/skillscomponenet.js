"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Database,
  Server,
  Palette,
  Code2,
  Boxes,
  Globe,
} from "lucide-react";

const skills = [
  {
    name: "React.js",
    icon: <Code2 size={22} />,
    level: 90,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
  },
  {
    name: "Next.js",
    icon: <Globe size={22} />,
    level: 85,
    color: "from-gray-300 to-gray-600",
    bgColor: "bg-gray-300/8",
  },
  {
    name: "Node.js",
    icon: <Server size={22} />,
    level: 80,
    color: "from-green-500 to-emerald-600",
    bgColor: "bg-green-500/10",
  },
  {
    name: "MongoDB",
    icon: <Database size={22} />,
    level: 75,
    color: "from-emerald-500 to-green-700",
    bgColor: "bg-emerald-500/10",
  },
  {
    name: "Tailwind CSS",
    icon: <Palette size={22} />,
    level: 85,
    color: "from-sky-500 to-indigo-500",
    bgColor: "bg-sky-500/8",
  },
  {
    name: "Zustand",
    icon: <Boxes size={22} />,
    level: 70,
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-500/10",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: (i = 0) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut", delay: i * 0.06 } }),
};

export default function SkillsComponent() {
  return (
    <section
      className="relative mt-[200px] w-full min-h-[60vh] font-mono py-20 bg-[#000000]/50 shadow-[0_-300px_300px_rgba(0,0,0,0.6),0_300px_80px_rgba(0,0,0,0.35)]
 text-white flex items-center justify-center overflow-visible"
      aria-labelledby="skills-heading"
    >
      {/* OUTER GLOW / Y-AXIS SHADOW placed behind content */}
      <div className="pointer-events-none absolute inset-0 -z-20 flex items-stretch justify-center">
        {/* central element that carries the box-shadow so shadow appears outside */}
        <div
          className="absolute inset-0"
          style={{
            // stacked shadows: top colored, bottom colored + subtle black core to deepen contrast
            // using two shadows gives top & bottom glow (y-axis) with large offset and 80px blur
            boxShadow:
              "0 -280px 80px rgba(124, 58, 237, 0.12), 0 280px 80px rgba(236, 72, 153, 0.10), 0 0 120px rgba(0,0,0,0.65)",
            // subtle gradient overlay behind to blend with page bg
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.03), transparent 18%), radial-gradient(ellipse at 50% 60%, rgba(236,72,153,0.03), transparent 22%)",
            borderRadius: "24px",
          }}
        />
        {/* additional soft colored blobs for depth */}
        <div className="absolute top-8 left-1/4 w-80 h-80 -translate-x-1/2 rounded-full blur-[80px]" style={{ background: "rgba(124,58,237,0.08)" }} />
        <div className="absolute bottom-8 right-1/4 w-80 h-80 translate-x-1/2 rounded-full blur-[80px]" style={{ background: "rgba(236,72,153,0.06)" }} />
      </div>

      <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="skills-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_4px_10px_rgba(168,85,247,0.6)]">
            Technical Skills
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Proficiency across modern web technologies and frameworks — animated and responsive.</p>
        </motion.div>

        {/* Skills list
            - md+ : vertical cards with tall upward bars (bars use md:h-[50vh] inside)
            - <md : horizontal cards with full-width bars
        */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              custom={index}
              variants={itemVariants}
              className="group relative border-2 border-purple-400/50 shadow-sm rounded-2xl p-1 transition-transform duration-300 hover:-translate-y-2" 
              role="region"
              aria-label={`${skill.name} skill ${skill.level} percent`}
            >
              {/* MD+ (vertical) card */}
              <div className="hidden md:flex flex-col items-center h-[52vh] bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/30 p-6 ">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${skill.bgColor} mb-4 transition-transform duration-300 group-hover:scale-105`}>
                  <div className="text-gray-100">{skill.icon}</div>
                </div>

                {/* Name */}
                <h3 className="text-base font-semibold text-gray-100 mb-6 text-center">{skill.name}</h3>

                {/* Vertical Bar container (tall) */}
                <div className="relative flex-1 w-5 bg-gray-800 rounded-full overflow-hidden flex flex-col justify-end items-center">
                  {/* background overlay for subtle rails */}
                  <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-[#000000]/0 to-[#000000]/10" />

                  {/* Animated fill — grows upward */}
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${skill.level}%` }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: index * 0.06 }}
                    viewport={{ once: true }}
                    className={`w-full bg-gradient-to-t ${skill.color} rounded-full shadow-[0_18px_40px_rgba(0,0,0,0.35)]`}
                    aria-hidden="true"
                  />

                  {/* Percentage badge */}
                  <div className="absolute -top-8 text-sm font-bold text-gray-200 bg-[#000000]/60 px-3 py-1 rounded-full backdrop-blur-sm">
                    {skill.level}%
                  </div>
                </div>
              </div>

              {/* Mobile (horizontal) card */}
              <div className="md:hidden flex flex-col bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800/30 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${skill.bgColor}`}>
                      {skill.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-100">{skill.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Proficiency</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-200">{skill.level}%</div>
                </div>

                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: index * 0.04 }}
                    viewport={{ once: true }}
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.45)]`}
                  />
                </div>
              </div>

              {/* subtle hover glow behind card (keeps -z) */}
              <div className="absolute inset-0 rounded-2xl -z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                   aria-hidden="true"
                   style={{
                     background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                     boxShadow: "0 20px 80px rgba(124,58,237,0.06), 0 -20px 80px rgba(236,72,153,0.04)"
                   }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

