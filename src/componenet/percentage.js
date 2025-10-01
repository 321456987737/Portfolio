"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const DonutChart = () => {
  const chartRef = useRef(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [pieKey, setPieKey] = useState("initial"); // used to remount Pie
  const [centerPercent, setCenterPercent] = useState(0);

  const actualData = [
    { name: "Developer", value: 80, color: "url(#developerGradient)" },
    { name: "Designer", value: 20, color: "url(#designerGradient)" },
  ];
  const developerPercent = actualData[0].value;

  // IntersectionObserver -> trigger animation once when the chart enters viewport
  useEffect(() => {
    if (!chartRef.current || hasPlayed) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasPlayed(true);
            setPieKey(Date.now().toString()); // change key to force Pie remount
            obs.disconnect();
          }
        });
      },
      { threshold: 0.35 } // ~35% visible
    );
    obs.observe(chartRef.current);
    return () => obs.disconnect();
  }, [hasPlayed]);

  // Count-up for the center percentage (syncs with animationDuration)
  useEffect(() => {
    if (!hasPlayed) return;
    let rafId = 0;
    const duration = 1200; // ms (match animationDuration below)
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = Math.max(0, now - startTime);
      const t = Math.min(elapsed / duration, 1);
      // easeOut cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(eased * developerPercent);
      setCenterPercent(value);
      if (t < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [hasPlayed, developerPercent]);

  const renderCustomizedLabel = ({ cx, cy }) => (
    <g>
      <text
        x={cx}
        y={cy - 6}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 20, fontWeight: 700 }}
      >
        {centerPercent}%
      </text>
      <text
        x={cx}
        y={cy + 16}
        fill="#d1d5db"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 12 }}
      >
        Developer
      </text>
    </g>
  );

  return (
    <section
      className="relative mt-[200px] w-full min-h-[60vh] font-mono py-20 bg-[#000000]/50 shadow-[0_-300px_80px_rgba(0,0,0,0.35),0_300px_300px_rgba(0,0,0,0.6)] text-[#ffffff] flex items-center justify-center overflow-visible"
      aria-labelledby="role-heading"
    >
      <div className="relative w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            id="role-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-[0_4px_10px_rgba(168,85,247,0.6)]"
          >
            My Role Breakdown
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            The balance between development and design in my work
          </p>
        </motion.div>

        {/* Chart + Details */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center justify-center gap-12"
        >
          {/* Donut Chart */}
          <motion.div
            ref={chartRef} // observe this element
            className="relative w-64 h-64"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient
                    id="developerGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient
                    id="designerGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>

                {/* 
                  key={pieKey} forces remount when pieKey changes.
                  isAnimationActive={hasPlayed} -> only animate after observer triggers.
                */}
                <Pie
                  key={pieKey}
                  data={actualData}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="90%"
                  paddingAngle={2}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  label={renderCustomizedLabel}
                  labelLine={false}
                  isAnimationActive={hasPlayed}
                  animationBegin={100}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {actualData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Legend + Summary (keeps your original markup & animations) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center transition-transform duration-300 hover:-translate-y-2 border-purple-400/50 gap-4 p-4 rounded-2xl bg-gray-900/40 backdrop-blur-sm border "
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-100">Developer</span>
                  <span className="font-bold text-cyan-400">80%</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Full-stack development, architecture, and technical implementation
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              viewport={{ once: true }}
              
              className="flex items-center gap-4 p-4 transition-transform duration-300 hover:-translate-y-2 rounded-2xl bg-gray-900/40 border-purple-400/50 backdrop-blur-sm border "
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-100">Designer</span>
                  <span className="font-bold text-pink-400">20%</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  UI/UX design, user experience, and visual aesthetics
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}

              viewport={{ once: true }}
              className="text-center p-4 rounded-2xl transition-transform duration-300 hover:-translate-y-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-400/50"
            >
              <p className="text-sm text-gray-300">
                <span className="text-cyan-400 font-semibold">Code-focused</span>{" "}
                with a strong eye for{" "}
                <span className="text-pink-400 font-semibold">design excellence</span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DonutChart;
