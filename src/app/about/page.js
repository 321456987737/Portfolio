"use client";
import React from "react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="w-full min-h-screen  text-white py-16 px-6 font-mono">
      <div className="max-w-5xl mx-auto space-y-12 mt-32">
        {/* Page Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            About Me
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A deeper look into my journey, expertise, and vision as a{" "}
            <span className="text-purple-400 font-semibold">
              Full-Stack Web Developer
            </span>
            .
          </p>
        </div>

        {/* Intro with Image */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6 text-gray-300 text-lg leading-relaxed">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-400">
              Introduction
            </h2>
            <p>
              My name is{" "}
              <span className="text-purple-300 font-semibold">
                Iftikhar Ali
              </span>
              , and I am a passionate Full-Stack Web Developer dedicated to
              building modern, scalable, and user-friendly applications. From
              the moment I began exploring the world of web development, I have
              been fascinated by how technology can shape experiences, empower
              businesses, and connect people in ways that were unimaginable a
              few decades ago.
            </p>
            <p>
              Over time, my journey in coding has evolved from a curious learner
              experimenting with simple web pages to a determined developer
              working with advanced technologies like{" "}
              <span className="text-purple-300">
                React, Next.js, Node.js, Express.js, MongoDB, Tailwind CSS, and
                NextAuth
              </span>
              . This page is not only a reflection of my professional skills but
              also my journey, my mindset as a developer, and my vision for the
              future.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <Image
              src="/myimage.png"
              alt="Iftikhar Ali"
              width={350}
              height={350}
              className="rounded-full shadow-xl shadow-purple-500/40 border-4 border-purple-500/20"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12 text-gray-300 text-lg leading-relaxed">
          <Section title="My Journey into Web Development">
            <p>
              Every developer has a unique story of how they entered this field.
              For me, it all began with curiosity — the curiosity to know how
              websites worked. The first time I opened a browser’s developer
              tools and inspected the structure of a webpage, I was captivated
              by the combination of HTML, CSS, and JavaScript shaping something
              so interactive.
            </p>
            <p>
              At first, my projects were small: static pages, simple designs,
              and basic interactivity. But I quickly realized that web
              development was not just about making pages look nice — it was
              about logic, structure, and problem-solving. I found myself diving
              deeper into JavaScript, learning about DOM manipulation, events,
              and eventually moving toward frameworks and libraries that could
              streamline the process.
            </p>
          </Section>

          <Section title="Technical Expertise">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="text-purple-300 font-semibold">
                  Frontend:
                </span>{" "}
                React.js, Next.js, Tailwind CSS, Framer Motion
              </li>
              <li>
                <span className="text-purple-300 font-semibold">
                  Backend:
                </span>{" "}
                Node.js, Express.js, MongoDB, Mongoose
              </li>
              <li>
                <span className="text-purple-300 font-semibold">
                  Authentication:
                </span>{" "}
                NextAuth, JWT, Google OAuth, Custom Auth
              </li>
              <li>
                <span className="text-purple-300 font-semibold">
                  State Management:
                </span>{" "}
                Zustand
              </li>
              <li>
                <span className="text-purple-300 font-semibold">
                  Others:
                </span>{" "}
                REST APIs, Pagination, UI/UX Components, Deployment
              </li>
            </ul>
          </Section>

          <Section title="Philosophy of Development">
            <p>
              For me, web development is not just about writing code — it’s
              about creating experiences. My philosophy revolves around:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Simplicity and readability first.</li>
              <li>Performance optimization as a priority.</li>
              <li>Design with empathy for the end-user.</li>
              <li>Continuous learning to stay ahead.</li>
              <li>
                A balance between creativity (UI/UX) and logical functionality.
              </li>
            </ul>
          </Section>

          <Section title="Projects & Experience">
            <p>
              Some highlights of my professional journey include building an
              E-commerce website inspired by Shooz.pk, a full-featured Medium
              clone, and a professional blog platform. Each of these projects
              helped me master authentication, pagination, state management,
              infinite scroll, blog search with debouncing, and professional UI
              components.
            </p>
          </Section>

          <Section title="Personal Life & Interests">
            <p>
              Outside of coding, I am passionate about history, philosophy, and
              podcasts. These interests fuel my curiosity, creativity, and even
              the way I approach problem-solving in development. I also enjoy
              experimenting with unique UI design trends, such as fluid glass
              effects, preloaders, and interactive carousels.
            </p>
          </Section>

          <Section title="Vision for the Future">
            <p>
              My vision is to grow as a professional full-stack developer who
              contributes through projects, open-source collaboration, and
              mentorship. I aim to work on applications that impact thousands of
              users, while balancing creativity with logic in everything I
              create.
            </p>
          </Section>

          <Section title="Closing Statement">
            <p>
              Becoming a full-stack developer has been more than a career choice
              — it has been a journey of persistence, creativity, and growth. I
              am excited about the future, eager to keep learning, and
              determined to contribute to the ever-evolving world of technology.
            </p>
            <p className="text-purple-300 font-semibold">
              Thank you for taking the time to get to know me.
            </p>
          </Section>
        </div>
      </div>
    </section>
  );
}

/* 🔹 Helper Section Component */
function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-400 drop-shadow-md">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
