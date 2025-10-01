"use client"
import { useState } from "react";
import Firstcomponent from "@/componenet/firstcomponent";
import AboutMe from "@/componenet/aboutme";
import SkillsComponent from "@/componenet/skillscomponenet"
import DonutChart from "@/componenet/percentage";
import HorizontalScroller from "@/componenet/experience"
export default function Home() {
  return (
   <div className="">
    <div className="h-[100vh]">
      <Firstcomponent/>
    </div>
    <div>
      <AboutMe />
    </div>
    <div>
      <SkillsComponent/>
    </div>
    <div>
      <DonutChart />
    </div>
    <div>
      <HorizontalScroller />
    </div>
    <div className="h-screen flex justify-center items-center bg-black shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.6)] mt-[1000px]">
      <h1 className="text-5xl font-bold text-center mt-20 text-white">Welcome to My Portfolio</h1>

    </div>
    <div className="h-screen flex justify-center items-center bg-black shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.6)] mt-[1000px]">
      <h1 className="text-5xl font-bold text-center mt-20 text-white">Welcome to My Portfolio</h1>

    </div>
    <div className="h-screen flex justify-center items-center bg-black shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.6)] mt-[1000px]">
      <h1 className="text-5xl font-bold text-center mt-20 text-white">Welcome to My Portfolio</h1>

    </div>
    <div className="h-screen flex justify-center items-center bg-black shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.6)] mt-[1000px]">
      <h1 className="text-5xl font-bold text-center mt-20 text-white">Welcome to My Portfolio</h1>

    </div>
    <div className="h-screen flex justify-center items-center bg-black shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.6)] mt-[1000px]">
      <h1 className="text-5xl font-bold text-center mt-20 text-white">Welcome to My Portfolio</h1>

    </div>
   </div>
  );
}
