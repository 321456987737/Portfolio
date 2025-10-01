"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-featured online shopping experience",
    images: [
      { src: "/firstproject/checkout.png", size: "large", tilt: 1, position: "left-center" },
      { src: "/firstproject/productpage.png", size: "medium", tilt: 3, position: "top-right" },
      { src: "/firstproject/category.png", size: "small", tilt: -5, position: "bottom-left" },
      { src: "/firstproject/cards.png", size: "medium", tilt: 4, position: "bottom-right" },
      { src: "/firstproject/cart.png", size: "small", tilt: -3, position: "top-left" },
      { src: "/firstproject/landingpage.png", size: "large", tilt: -2, position: "center" },
    ]
  },
  {
    id: 2,
    title: "Barber Website",
    description: "full fledged barber website with booking system",
    images: [
      { src: "/secondproject/Screenshot 2025-09-30 204254.png", size: "medium", tilt: 5, position: "bottom-center" },
      { src: "/secondproject/Screenshot 2025-09-30 204303.png", size: "large", tilt: -2, position: "top-left" },
      { src: "/secondproject/Screenshot 2025-09-30 204338.png", size: "small", tilt: 4, position: "bottom-right" },
      { src: "/secondproject/Screenshot 2025-09-30 204419.png", size: "medium", tilt: -3, position: "right-center" },
      { src: "/secondproject/Screenshot 2025-09-30 204429.png", size: "small", tilt: 2, position: "bottom-left" },
      { src: "/secondproject/Screenshot 2025-09-30 204445.png", size: "large", tilt: -4, position: "top-right" },
      { src: "/secondproject/Screenshot 2025-09-30 204509.png", size: "medium", tilt: 1, position: "left-center" }
    ]
  },
  {
    id: 3,
    title: "Bloging Website ",
    description: "full fledged bloging website with authentication system and admin panel and youcan write your blog and share it with the world",
    images: [
      { src: "/thirdproject/Screenshot 2025-09-30 203934.png", size: "medium", tilt: -2, position: "bottom-center" },
      { src: "/thirdproject/Screenshot 2025-09-30 204127.png", size: "medium", tilt: 3, position: "right-center" },
      { src: "/thirdproject/Screenshot 2025-09-30 204025.png", size: "small", tilt: 4, position: "left-center" },
      { src: "/thirdproject/Screenshot 2025-09-30 204149.png", size: "large", tilt: -1, position: "top-left" },
      { src: "/thirdproject/Screenshot 2025-09-30 203959.png", size: "large", tilt: 6, position: "center" },
      { src: "/thirdproject/Screenshot 2025-09-30 204019.png", size: "large", tilt: -3, position: "top-right" },
    ]
  }
];

// Size mappings
const sizeConfig = {
  small: { width: "25%", height: "30%" },
  medium: { width: "40%", height: "50%" },
  large: { width: "60%", height: "70%" }
};

// Position mappings
const positionConfig = {
  "top-left": { top: "10%", left: "5%" },
  "top-right": { top: "10%", right: "5%" },
  "bottom-left": { bottom: "10%", left: "5%" },
  "bottom-right": { bottom: "10%", right: "5%" },
  "center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
  "left-center": { top: "50%", left: "10%", transform: "translateY(-50%)" },
  "right-center": { top: "50%", right: "10%", transform: "translateY(-50%)" },
  "top-center": { top: "15%", left: "50%", transform: "translateX(-50%)" },
  "bottom-center": { bottom: "15%", left: "50%", transform: "translateX(-50%)" }
};

export default function DynamicPortfolioScroller() {
  const wrapperRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(null);
  const geomRef = useRef({ start: 0, end: 0, total: 1, maxTranslate: 0 });
  const [hoveredImage, setHoveredImage] = useState(null);

  // Memoized scroll handler
  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const { start, total, maxTranslate } = geomRef.current;
      const scrollTop = window.scrollY || window.pageYOffset;
      const raw = (scrollTop - start) / total;
      const progress = Math.min(Math.max(raw, 0), 1);
      const translateX = -Math.round(progress * maxTranslate);
      innerRef.current.style.transform = `translate3d(${translateX}px,0,0)`;
      rafRef.current = null;
    });
  }, []);

  // Memoized geometry computation
  const computeGeometry = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    
    const rect = wrapper.getBoundingClientRect();
    const start = window.scrollY + rect.top;
    const end = start + wrapper.offsetHeight - window.innerHeight;
    const total = Math.max(end - start, 1);
    const maxTranslate = Math.max(innerRef.current?.scrollWidth - window.innerWidth, 0);
    geomRef.current = { start, end, total, maxTranslate };
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    // Set initial styles
    inner.style.willChange = "transform";
    inner.style.transform = "translate3d(0,0,0)";

    const ensureWrapperHeight = () => {
      wrapper.style.height = `${projects.length * 100}vh`;
    };

    const waitForImages = () => {
      const imgs = Array.from(inner.querySelectorAll("img"));
      if (!imgs.length) return Promise.resolve();
      
      const promises = imgs.map((img) => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
      });
      return Promise.all(promises);
    };

    const init = async () => {
      ensureWrapperHeight();
      await waitForImages();
      computeGeometry();
      onScroll();
    };

    init();

    const ro = new ResizeObserver(() => {
      ensureWrapperHeight();
      computeGeometry();
      onScroll();
    });
    ro.observe(inner);

    // Throttled event listeners
    window.addEventListener("resize", computeGeometry, { passive: true });
    window.addEventListener("load", computeGeometry, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", computeGeometry);
      window.removeEventListener("load", computeGeometry);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [computeGeometry, onScroll]);

  // Optimized image style calculation
  const getImageStyle = useCallback((image, imageIndex, projectIndex) => {
    const size = sizeConfig[image.size];
    const position = positionConfig[image.position];
    const isHovered = hoveredImage === `${projectIndex}-${imageIndex}`;
    
    const baseZIndex = image.size === 'large' ? 20 : image.size === 'medium' ? 15 : 10;
    const zIndex = isHovered ? 999 : baseZIndex;

    return {
      ...size,
      ...position,
      transform: `rotate(${image.tilt}deg) ${position.transform || ''}`,
      transformOrigin: 'center',
      zIndex,
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
  }, [hoveredImage]);

  // Debounced hover handlers
  const handleImageHover = useCallback((projectIndex, imageIndex) => {
    setHoveredImage(`${projectIndex}-${imageIndex}`);
  }, []);

  const handleImageLeave = useCallback(() => {
    setHoveredImage(null);
  }, []);

  return (
    <section ref={wrapperRef} className="relative w-full mt-36">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <div
          ref={innerRef}
          className="flex h-full w-max"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          {projects.map((project, projectIndex) => (
            <div 
              key={project.id} 
              className="w-screen h-screen relative flex-shrink-0"
            >
              {/* Dynamic Images Grid */}
              <div className="absolute inset-0">
                {project.images.map((image, imageIndex) => {
                  const isHovered = hoveredImage === `${projectIndex}-${imageIndex}`;
                  
                  return (
                    <div
                      key={imageIndex}
                      className={`absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-400 ${
                        isHovered 
                          ? 'scale-105 shadow-3xl' 
                          : 'hover:scale-102 hover:shadow-3xl'
                      }`}
                      style={getImageStyle(image, imageIndex, projectIndex)}
                      onMouseEnter={() => handleImageHover(projectIndex, imageIndex)}
                      onMouseLeave={handleImageLeave}
                    >
                      <img
                        src={image.src}
                        alt={`${project.title} - ${imageIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-400"
                        loading={projectIndex === 0 && imageIndex === 0 ? "eager" : "lazy"}
                      />
                      
                      {/* Hover Overlay - Only show text info, no color overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center transition-all duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className={`text-white text-center mb-4 transition-all duration-300 ${
                          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
                          <div className="text-sm font-semibold bg-black/70 px-3 py-1 rounded-full mb-2 backdrop-blur-sm">
                            {image.size === 'large' ? 'Main Feature' : image.size === 'medium' ? 'Key Screen' : 'Detail'}
                          </div>
                          <div className="text-xs opacity-90 bg-black/50 px-2 py-1 rounded">
                            {image.position.replace('-', ' ')}
                          </div>
                        </div>
                      </div>

                      {/* Size Badge */}
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-all duration-300 ${
                        image.size === 'large' 
                          ? 'bg-red-500/90 text-white' 
                          : image.size === 'medium' 
                          ? 'bg-blue-500/90 text-white' 
                          : 'bg-green-500/90 text-white'
                      } ${isHovered ? 'scale-110' : 'scale-100'}`}>
                        {image.size}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Project Info */}
              <div className="absolute left-8 bottom-8 max-w-md text-white z-50">
                <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                      Project {projectIndex + 1}
                    </span>
                  </div>
                  <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    {/* <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        {project.images.length} screens
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {project.images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`w-1 h-1 rounded-full ${
                            img.size === 'large' 
                              ? 'bg-red-400' 
                              : img.size === 'medium' 
                              ? 'bg-blue-400' 
                              : 'bg-green-400'
                          }`}
                        />
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Navigation Indicator */}
              {/* <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50">
                <div className="flex flex-col items-center gap-3">
                  {projects.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full border-2 border-white/50 transition-all duration-300 ${
                        index === projectIndex 
                          ? 'bg-white scale-125 border-white' 
                          : 'hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div> */}

              {/* Grid Overlay (for visual reference) */}
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/20"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



