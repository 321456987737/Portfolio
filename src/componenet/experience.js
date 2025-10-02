"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";

/* ============================
   Projects & config
   ============================ */
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

// Responsive size mappings
const sizeConfig = {
  small: { 
    width: "25%", 
    height: "30%",
    md: { width: "20%", height: "25%" }
  },
  medium: { 
    width: "40%", 
    height: "50%",
    md: { width: "35%", height: "45%" }
  },
  large: { 
    width: "60%", 
    height: "70%",
    md: { width: "50%", height: "60%" }
  }
};

// Responsive position mappings
const positionConfig = {
  "top-left": { 
    top: "10%", 
    left: "5%",
    md: { top: "15%", left: "3%" }
  },
  "top-right": { 
    top: "10%", 
    right: "5%",
    md: { top: "15%", right: "3%" }
  },
  "bottom-left": { 
    bottom: "10%", 
    left: "5%",
    md: { bottom: "15%", left: "3%" }
  },
  "bottom-right": { 
    bottom: "10%", 
    right: "5%",
    md: { bottom: "15%", right: "3%" }
  },
  "center": { 
    top: "50%", 
    left: "50%", 
    transform: "translate(-50%, -50%)",
    md: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
  },
  "left-center": { 
    top: "50%", 
    left: "10%", 
    transform: "translateY(-50%)",
    md: { top: "50%", left: "5%", transform: "translateY(-50%)" }
  },
  "right-center": { 
    top: "50%", 
    right: "10%", 
    transform: "translateY(-50%)",
    md: { top: "50%", right: "5%", transform: "translateY(-50%)" }
  },
  "top-center": { 
    top: "15%", 
    left: "50%", 
    transform: "translateX(-50%)",
    md: { top: "20%", left: "50%", transform: "translateX(-50%)" }
  },
  "bottom-center": { 
    bottom: "15%", 
    left: "50%", 
    transform: "translateX(-50%)",
    md: { bottom: "20%", left: "50%", transform: "translateX(-50%)" }
  }
};

/* ================
   Component - FIXED MOBILE SCROLLING
   ================ */
export default function DynamicPortfolioScroller() {
  const wrapperRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(null);
  const geomRef = useRef({ start: 0, end: 0, total: 1, maxTranslate: 0 });
  const [hoveredImage, setHoveredImage] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fixed scroll handler
  const onScrollFrame = useCallback(() => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      const { start, total, maxTranslate } = geomRef.current;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const raw = (scrollTop - start) / total;
      const progress = Math.min(Math.max(raw, 0), 1);
      const translateX = -Math.round(progress * maxTranslate);
      
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${translateX}px,0,0)`;
      }
      rafRef.current = null;
    });
  }, []);

  // Main effect for scroll setup
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner) return;

    const setVhVar = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const ensureWrapperHeightPx = () => {
      const viewportHeight = window.innerHeight;
      const perProjectPx = isMobile ? Math.round(viewportHeight * 0.85) : Math.round(viewportHeight);
      wrapper.style.height = `${projects.length * perProjectPx}px`;
    };

    const ensureInnerWidthPx = () => {
      const viewportWidth = window.innerWidth;
      inner.style.width = `${projects.length * viewportWidth}px`;
      
      Array.from(inner.children).forEach((child) => {
        if (child && child.style) {
          child.style.width = `${viewportWidth}px`;
          child.style.height = `${isMobile ? window.innerHeight * 0.85 : window.innerHeight}px`;
        }
      });
    };

    const computeGeometryRobust = () => {
      if (!wrapper) return;
      
      const rect = wrapper.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const start = scrollTop + rect.top;
      const end = start + wrapper.offsetHeight - window.innerHeight;
      const total = Math.max(end - start, 1);
      const maxTranslate = Math.max(inner.scrollWidth - window.innerWidth, 0);
      
      geomRef.current = { start, end, total, maxTranslate };
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
      inner.style.willChange = 'transform';
      inner.style.transform = 'translate3d(0,0,0)';

      setVhVar();
      ensureWrapperHeightPx();
      ensureInnerWidthPx();

      await waitForImages();
      computeGeometryRobust();
      onScrollFrame();
    };

    init();

    const ro = new ResizeObserver(() => {
      ensureWrapperHeightPx();
      ensureInnerWidthPx();
      computeGeometryRobust();
      onScrollFrame();
    });
    ro.observe(inner);

    const passiveOptions = { passive: true };
    window.addEventListener('resize', computeGeometryRobust, passiveOptions);
    window.addEventListener('load', computeGeometryRobust, passiveOptions);
    window.addEventListener('scroll', onScrollFrame, passiveOptions);

    return () => {
      window.removeEventListener('resize', computeGeometryRobust);
      window.removeEventListener('load', computeGeometryRobust);
      window.removeEventListener('scroll', onScrollFrame);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, onScrollFrame]);

  // Add mobile-friendly CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .portfolio-scroller {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
      .portfolio-inner {
        -webkit-overflow-scrolling: touch;
      }
      @media (max-width: 767px) {
        .portfolio-mobile-fix {
          height: 85vh !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const getImageStyle = useCallback((image, imageIndex, projectIndex) => {
    const size = isMobile ? sizeConfig[image.size].md : sizeConfig[image.size];
    const position = isMobile ? positionConfig[image.position].md : positionConfig[image.position];
    const isHovered = hoveredImage === `${projectIndex}-${imageIndex}`;
    
    const baseZIndex = image.size === 'large' ? 20 : image.size === 'medium' ? 15 : 10;
    const zIndex = isHovered ? 999 : baseZIndex;

    const tilt = isMobile ? image.tilt * 0.5 : image.tilt;

    return {
      ...size,
      ...position,
      transform: `${position.transform ? position.transform + ' ' : ''} rotate(${tilt}deg)`,
      transformOrigin: 'center',
      zIndex,
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
  }, [hoveredImage, isMobile]);

  const handleImageHover = useCallback((projectIndex, imageIndex) => {
    if (!isMobile) {
      setHoveredImage(`${projectIndex}-${imageIndex}`);
    }
  }, [isMobile]);

  const handleImageLeave = useCallback(() => {
    if (!isMobile) {
      setHoveredImage(null);
    }
  }, [isMobile]);

  return (
    <section 
      ref={wrapperRef} 
      className="relative w-full mt-36 md:mt-48 portfolio-scroller"
      style={{ 
        height: isMobile ? `${projects.length * 85}vh` : `${projects.length * 100}vh`
      }}
    >
      <div 
        className="sticky top-0 w-full overflow-hidden portfolio-mobile-fix"
        style={{ 
          height: isMobile ? '85vh' : '100vh'
        }}
      >
        <div
          ref={innerRef}
          className="flex h-full w-max portfolio-inner"
          style={{ 
            transform: "translate3d(0,0,0)"
          }}
        >
          {projects.map((project, projectIndex) => (
            <div 
              key={project.id} 
              className="w-screen flex-shrink-0 relative portfolio-mobile-fix"
              style={{
                height: isMobile ? '85vh' : '100vh'
              }}
            >
              {/* Mobile Layout */}
              {isMobile ? (
                <div className="flex flex-col justify-center items-center h-full gap-6 px-6 pb-32">
                  {project.images.slice(0, 3).map((image, imageIndex) => {
                    const tilts = [-3, 2, -4];
                    const tilt = tilts[imageIndex] ?? image.tilt;
                    
                    return (
                      <div
                        key={imageIndex}
                        className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-400 hover:scale-105"
                        style={{
                          maxHeight: '160px',
                          height: '160px',
                          transform: `rotate(${tilt}deg)`,
                          zIndex: 10 + imageIndex
                        }}
                      >
                        <img
                          src={image.src}
                          alt={`${project.title} - ${imageIndex + 1}`}
                          className="w-full h-full object-cover"
                          loading={projectIndex === 0 && imageIndex === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Desktop Layout */
                <div className="absolute inset-0">
                  {project.images.map((image, imageIndex) => {
                    const isHovered = hoveredImage === `${projectIndex}-${imageIndex}`;
                    
                    return (
                      <div
                        key={imageIndex}
                        className={`absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-400 border border-white/10 ${
                          isHovered ? 'scale-105 shadow-3xl' : 'hover:scale-102 hover:shadow-3xl'
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
                        
                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center transition-all duration-300 ${
                          isHovered ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div className={`text-white text-center mb-4 transition-all duration-300 ${
                            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          }`}>
                            {/* Optional hover content */}
                          </div>
                        </div>

                        {/* Size Badge */}
                        <div className={`absolute top-3 right-3 px-2 py-1 text-xs backdrop-blur-sm rounded-full font-semibold transition-all duration-300 ${
                          image.size === 'large' ? 'bg-red-500/90 text-white' : 
                          image.size === 'medium' ? 'bg-blue-500/90 text-white' : 
                          'bg-green-500/90 text-white'
                        } ${isHovered ? 'scale-110' : 'scale-100'}`}>
                          {image.size}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Project Info */}
              <div className={`absolute text-white z-50 ${
                isMobile ? 'left-4 right-4 bottom-4 max-w-full' : 'left-8 bottom-8 max-w-md'
              }`}>
                <div className={`bg-black/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl ${
                  isMobile ? 'p-4' : 'p-6'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
                    <span className={`font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      Project {projectIndex + 1}
                    </span>
                  </div>
                  <h3 className={`font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent ${
                    isMobile ? 'text-2xl' : 'text-4xl'
                  }`}>
                    {project.title}
                  </h3>
                  <p className={`text-gray-300 mb-4 leading-relaxed ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    {project.description}
                  </p>
                  
                  {/* View Project Button */}
                  <button className={`w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    isMobile ? 'py-3 text-sm' : 'py-4'
                  }`}>
                    View Project Details
                  </button>
                </div>
              </div>

              {/* Grid Overlay - Hidden on mobile */}
              {!isMobile && (
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/20"></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Indicator */}
              <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-40 ${
                isMobile ? 'hidden' : 'block'
              }`}>
                <div className="flex flex-col items-center gap-2">
                  {projects.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === projectIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-white text-center ${
        isMobile ? 'block' : 'hidden'
      }`}>
        <div className="bg-black/60 backdrop-blur-lg rounded-full px-4 py-2 border border-white/20">
          <p className="text-sm font-medium">Scroll to navigate</p>
        </div>
      </div>
    </section>
  );
}



// "use client";
// import React, { useEffect, useRef, useState, useCallback } from "react";

// /* ============================
//    Projects & config (keep/update your image paths)
//    ============================ */
// const projects = [
//   {
//     id: 1,
//     title: "E-Commerce Platform",
//     description: "Full-featured online shopping experience",
//     images: [
//       { src: "/firstproject/checkout.png", size: "large", tilt: 1, position: "left-center" },
//       { src: "/firstproject/productpage.png", size: "medium", tilt: 3, position: "top-right" },
//       { src: "/firstproject/category.png", size: "small", tilt: -5, position: "bottom-left" },
//       { src: "/firstproject/cards.png", size: "medium", tilt: 4, position: "bottom-right" },
//       { src: "/firstproject/cart.png", size: "small", tilt: -3, position: "top-left" },
//       { src: "/firstproject/landingpage.png", size: "large", tilt: -2, position: "center" },
//     ]
//   },
//   {
//     id: 2,
//     title: "Barber Website",
//     description: "full fledged barber website with booking system",
//     images: [
//       { src: "/secondproject/Screenshot 2025-09-30 204254.png", size: "medium", tilt: 5, position: "bottom-center" },
//       { src: "/secondproject/Screenshot 2025-09-30 204303.png", size: "large", tilt: -2, position: "top-left" },
//       { src: "/secondproject/Screenshot 2025-09-30 204338.png", size: "small", tilt: 4, position: "bottom-right" },
//       { src: "/secondproject/Screenshot 2025-09-30 204419.png", size: "medium", tilt: -3, position: "right-center" },
//       { src: "/secondproject/Screenshot 2025-09-30 204429.png", size: "small", tilt: 2, position: "bottom-left" },
//       { src: "/secondproject/Screenshot 2025-09-30 204445.png", size: "large", tilt: -4, position: "top-right" },
//       { src: "/secondproject/Screenshot 2025-09-30 204509.png", size: "medium", tilt: 1, position: "left-center" }
//     ]
//   },
//   {
//     id: 3,
//     title: "Bloging Website ",
//     description: "full fledged bloging website with authentication system and admin panel and youcan write your blog and share it with the world",
//     images: [
//       { src: "/thirdproject/Screenshot 2025-09-30 203934.png", size: "medium", tilt: -2, position: "bottom-center" },
//       { src: "/thirdproject/Screenshot 2025-09-30 204127.png", size: "medium", tilt: 3, position: "right-center" },
//       { src: "/thirdproject/Screenshot 2025-09-30 204025.png", size: "small", tilt: 4, position: "left-center" },
//       { src: "/thirdproject/Screenshot 2025-09-30 204149.png", size: "large", tilt: -1, position: "top-left" },
//       { src: "/thirdproject/Screenshot 2025-09-30 203959.png", size: "large", tilt: 6, position: "center" },
//       { src: "/thirdproject/Screenshot 2025-09-30 204019.png", size: "large", tilt: -3, position: "top-right" },
//     ]
//   }
// ];

// // Responsive size mappings
// const sizeConfig = {
//   small: { 
//     width: "25%", 
//     height: "30%",
//     md: { width: "20%", height: "25%" }
//   },
//   medium: { 
//     width: "40%", 
//     height: "50%",
//     md: { width: "35%", height: "45%" }
//   },
//   large: { 
//     width: "60%", 
//     height: "70%",
//     md: { width: "50%", height: "60%" }
//   }
// };

// // Responsive position mappings
// const positionConfig = {
//   "top-left": { 
//     top: "10%", 
//     left: "5%",
//     md: { top: "15%", left: "3%" }
//   },
//   "top-right": { 
//     top: "10%", 
//     right: "5%",
//     md: { top: "15%", right: "3%" }
//   },
//   "bottom-left": { 
//     bottom: "10%", 
//     left: "5%",
//     md: { bottom: "15%", left: "3%" }
//   },
//   "bottom-right": { 
//     bottom: "10%", 
//     right: "5%",
//     md: { bottom: "15%", right: "3%" }
//   },
//   "center": { 
//     top: "50%", 
//     left: "50%", 
//     transform: "translate(-50%, -50%)",
//     md: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
//   },
//   "left-center": { 
//     top: "50%", 
//     left: "10%", 
//     transform: "translateY(-50%)",
//     md: { top: "50%", left: "5%", transform: "translateY(-50%)" }
//   },
//   "right-center": { 
//     top: "50%", 
//     right: "10%", 
//     transform: "translateY(-50%)",
//     md: { top: "50%", right: "5%", transform: "translateY(-50%)" }
//   },
//   "top-center": { 
//     top: "15%", 
//     left: "50%", 
//     transform: "translateX(-50%)",
//     md: { top: "20%", left: "50%", transform: "translateX(-50%)" }
//   },
//   "bottom-center": { 
//     bottom: "15%", 
//     left: "50%", 
//     transform: "translateX(-50%)",
//     md: { bottom: "20%", left: "50%", transform: "translateX(-50%)" }
//   }
// };

// /* ================
//    Component - FIXED VERSION
//    ================ */
// export default function DynamicPortfolioScroller() {
//   const wrapperRef = useRef(null);
//   const innerRef = useRef(null);
//   const rafRef = useRef(null);
//   const geomRef = useRef({ start: 0, end: 0, total: 1, maxTranslate: 0 });
//   const [hoveredImage, setHoveredImage] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // FIXED: Improved scroll handler with better mobile support
//   const onScrollFrame = useCallback(() => {
//     if (rafRef.current) return;
    
//     rafRef.current = requestAnimationFrame(() => {
//       const { start, total, maxTranslate } = geomRef.current;
      
//       // FIXED: Use consistent scroll detection for mobile
//       const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
//       const raw = (scrollTop - start) / total;
//       const progress = Math.min(Math.max(raw, 0), 1);
//       const translateX = -Math.round(progress * maxTranslate);
      
//       if (innerRef.current) {
//         innerRef.current.style.transform = `translate3d(${translateX}px,0,0)`;
//       }
//       rafRef.current = null;
//     });
//   }, []);

//   useEffect(() => {
//     const wrapper = wrapperRef.current;
//     const inner = innerRef.current;
//     if (!wrapper || !inner) return;

//     // FIXED: Better mobile viewport handling
//     const setVhVar = () => {
//       const vh = window.innerHeight * 0.01;
//       document.documentElement.style.setProperty('--vh', `${vh}px`);
//     };

//     const ensureWrapperHeightPx = () => {
//       // FIXED: Use innerHeight directly for mobile consistency
//       const viewportHeight = window.innerHeight;
//       const perProjectPx = isMobile ? Math.round(viewportHeight * 0.80) : Math.round(viewportHeight);
//       wrapper.style.height = `${projects.length * perProjectPx}px`;
//     };

//     const ensureInnerWidthPx = () => {
//       const viewportWidth = window.innerWidth;
//       inner.style.width = `${projects.length * viewportWidth}px`;
      
//       Array.from(inner.children).forEach((child) => {
//         if (child && child.style) {
//           child.style.width = `${viewportWidth}px`;
//           child.style.height = `${window.innerHeight}px`;
//         }
//       });
//     };

//     const computeGeometryRobust = () => {
//       const rect = wrapper.getBoundingClientRect();
//       const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//       const start = scrollTop + rect.top;
//       const end = start + wrapper.offsetHeight - window.innerHeight;
//       const total = Math.max(end - start, 1);
//       const maxTranslate = Math.max(inner.scrollWidth - window.innerWidth, 0);
      
//       geomRef.current = { start, end, total, maxTranslate };
//     };

//     const waitForImages = () => {
//       const imgs = Array.from(inner.querySelectorAll("img"));
//       if (!imgs.length) return Promise.resolve();
      
//       const promises = imgs.map((img) => {
//         if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
//         return new Promise((resolve) => {
//           img.addEventListener("load", resolve, { once: true });
//           img.addEventListener("error", resolve, { once: true });
//         });
//       });
//       return Promise.all(promises);
//     };

//     const init = async () => {
//       // FIXED: Add critical mobile touch-action styles
//       inner.style.touchAction = 'pan-y pinch-zoom';
//       inner.style.willChange = 'transform';
//       inner.style.transform = 'translate3d(0,0,0)';

//       setVhVar();
//       ensureWrapperHeightPx();
//       ensureInnerWidthPx();

//       await waitForImages();
//       computeGeometryRobust();
//       onScrollFrame();
//     };

//     init();

//     const ro = new ResizeObserver(() => {
//       ensureWrapperHeightPx();
//       ensureInnerWidthPx();
//       computeGeometryRobust();
//       onScrollFrame();
//     });
//     ro.observe(inner);

//     // FIXED: Simplified event listeners - remove visualViewport complexity
//     window.addEventListener('resize', computeGeometryRobust, { passive: true });
//     window.addEventListener('load', computeGeometryRobust, { passive: true });
//     window.addEventListener('scroll', onScrollFrame, { passive: true });

//     return () => {
//       window.removeEventListener('resize', computeGeometryRobust);
//       window.removeEventListener('load', computeGeometryRobust);
//       window.removeEventListener('scroll', onScrollFrame);
//       ro.disconnect();
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     };
//   }, [isMobile, onScrollFrame]);

//   // FIXED: Add CSS to prevent default touch behaviors
//   useEffect(() => {
//     // Add critical CSS for mobile scrolling
//     const style = document.createElement('style');
//     style.textContent = `
//       .mobile-scroll-fix {
//         -webkit-overflow-scrolling: touch;
//         scroll-behavior: smooth;
//       }
//       .no-scrollbar {
//         -ms-overflow-style: none;
//         scrollbar-width: none;
//       }
//       .no-scrollbar::-webkit-scrollbar {
//         display: none;
//       }
//       .touch-scroll-fix {
//         touch-action: pan-y pinch-zoom;
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   const getImageStyle = useCallback((image, imageIndex, projectIndex) => {
//     const size = isMobile ? sizeConfig[image.size].md : sizeConfig[image.size];
//     const position = isMobile ? positionConfig[image.position].md : positionConfig[image.position];
//     const isHovered = hoveredImage === `${projectIndex}-${imageIndex}`;
    
//     const baseZIndex = image.size === 'large' ? 20 : image.size === 'medium' ? 15 : 10;
//     const zIndex = isHovered ? 999 : baseZIndex;

//     const tilt = isMobile ? image.tilt * 0.5 : image.tilt;

//     return {
//       ...size,
//       ...position,
//       transform: `${position.transform ? position.transform + ' ' : ''} rotate(${tilt}deg)`,
//       transformOrigin: 'center',
//       zIndex,
//       transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
//     };
//   }, [hoveredImage, isMobile]);

//   const handleImageHover = useCallback((projectIndex, imageIndex) => {
//     setHoveredImage(`${projectIndex}-${imageIndex}`);
//   }, []);

//   const handleImageLeave = useCallback(() => {
//     setHoveredImage(null);
//   }, []);

//   return (
//     <section 
//       ref={wrapperRef} 
//       className="relative w-full mt-36 md:mt-48 mobile-scroll-fix touch-scroll-fix"
//     >
//       <div className="sticky top-0 w-full h-screen overflow-hidden touch-action-pan-y no-scrollbar">
//         <div
//           ref={innerRef}
//           className="flex h-full w-max no-scrollbar touch-scroll-fix"
//           style={{ 
//             transform: "translate3d(0,0,0)",
//             touchAction: 'pan-y pinch-zoom'
//           }}
//         >
//           {projects.map((project, projectIndex) => (
//             <div 
//               key={project.id} 
//               className="w-screen h-screen relative flex-shrink-0 no-scrollbar"
//               style={{
//                 height: isMobile ? '80vh' : '100vh'
//               }}
//             >
//               {/* Mobile Layout - Vertical Stack of 3 Images */}
//               {isMobile ? (
//                 <div className="flex flex-col justify-center items-center h-full gap-4 px-4 pb-32">
//                   {project.images.slice(0, 3).map((image, imageIndex) => {
//                     const tilts = [-3, 2, -4];
//                     const tilt = tilts[imageIndex] ?? image.tilt;
                    
//                     return (
//                       <div
//                         key={imageIndex}
//                         className="w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-400"
//                         style={{
//                           maxHeight: '150px',
//                           height: '150px',
//                           transform: `rotate(${tilt}deg)`,
//                           zIndex: 10 + imageIndex
//                         }}
//                       >
//                         <img
//                           src={image.src}
//                           alt={`${project.title} - ${imageIndex + 1}`}
//                           className="w-full h-full object-cover"
//                           loading={projectIndex === 0 && imageIndex === 0 ? "eager" : "lazy"}
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 /* Desktop Layout - Dynamic Grid */
//                 <div className="absolute inset-0">
//                   {project.images.map((image, imageIndex) => {
//                     const isHovered = hoveredImage === `${projectIndex}-${imageIndex}`;
                    
//                     return (
//                       <div
//                         key={imageIndex}
//                         className={`absolute rounded-2xl overflow-hidden shadow-2xl transition-all duration-400 ${isHovered ? 'scale-105 shadow-3xl' : 'hover:scale-102 hover:shadow-3xl'}`}
//                         style={getImageStyle(image, imageIndex, projectIndex)}
//                         onMouseEnter={() => handleImageHover(projectIndex, imageIndex)}
//                         onMouseLeave={handleImageLeave}
//                       >
//                         <img
//                           src={image.src}
//                           alt={`${project.title} - ${imageIndex + 1}`}
//                           className="w-full h-full object-cover transition-transform duration-400"
//                           loading={projectIndex === 0 && imageIndex === 0 ? "eager" : "lazy"}
//                         />
                        
//                         <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
//                           <div className={`text-white text-center mb-4 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
//                             {/* optional hover content */}
//                           </div>
//                         </div>

//                         <div className={`absolute top-3 right-3 px-2 py-1 text-xs backdrop-blur-sm rounded-full font-semibold transition-all duration-300 ${image.size === 'large' ? 'bg-red-500/90 text-white' : image.size === 'medium' ? 'bg-blue-500/90 text-white' : 'bg-green-500/90 text-white'} ${isHovered ? 'scale-110' : 'scale-100'}`}>
//                           {image.size}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {/* Project Info */}
//               <div className={`absolute text-white z-50 ${isMobile ? 'left-4 right-4 bottom-4 max-w-full' : 'left-8 bottom-8 max-w-md'}`}>
//                 <div className={`bg-black/60 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl ${isMobile ? 'p-4' : 'p-6'}`}>
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse"></div>
//                     <span className={`font-semibold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent ${isMobile ? 'text-xs' : 'text-sm'}`}>
//                       Project {projectIndex + 1}
//                     </span>
//                   </div>
//                   <h3 className={`font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
//                     {project.title}
//                   </h3>
//                   <p className={`text-gray-300 mb-4 leading-relaxed ${isMobile ? 'text-sm' : 'text-base'}`}>
//                     {project.description}
//                   </p>
//                 </div>
//               </div>

//               {/* Grid Overlay (for visual reference) - Hidden on mobile */}
//               {!isMobile && (
//                 <div className="absolute inset-0 pointer-events-none opacity-10">
//                   <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
//                     {Array.from({ length: 9 }).map((_, i) => (
//                       <div key={i} className="border border-white/20"></div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }