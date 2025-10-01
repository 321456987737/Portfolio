// "use client";
// import React, { useEffect, useRef, useState, useCallback } from 'react';

// const StarBackground = () => {
//   const canvasRef = useRef(null);
//   const animationRef = useRef(null);
//   const mousePosRef = useRef({ x: 0, y: 0, strength: 0 });
//   const [isMounted, setIsMounted] = useState(false);

//   // Star particle class
//   class StarParticle {
//     constructor(canvasWidth, canvasHeight) {
//       this.canvasWidth = canvasWidth;
//       this.canvasHeight = canvasHeight;
      
//       // Random starting position
//       this.x = Math.random() * canvasWidth;
//       this.y = Math.random() * canvasHeight;
      
//       // Initial velocity
//       this.vx = (Math.random() - 0.5) * 2;
//       this.vy = (Math.random() - 0.5) * 2;
      
//       // Particle properties
//       this.size = Math.random() * 2 + 0.5;
//       this.baseSize = this.size;
//       this.tailLength = Math.floor(Math.random() * 50) + 150; // 150-200px tails
//       this.tailWidth = Math.random() * 3 + 1; // 1-4px width
//       this.trail = [];
//       this.shineIntensity = 0;
//       this.shinePhase = Math.random() * Math.PI * 2;
//       this.color = this.getRandomStarColor();
//       this.speed = Math.random() * 0.5 + 0.2;
//       this.breaking = Math.random() > 0.7; // 30% chance to be a breaking star
//       this.breakPhase = 0;
//     }

//     getRandomStarColor() {
//       const colors = [
//         { r: 255, g: 255, b: 255 }, // White
//         { r: 255, g: 220, b: 100 }, // Warm yellow
//         { r: 200, g: 220, b: 255 }, // Cool blue
//         { r: 255, g: 200, b: 255 }, // Pinkish
//       ];
//       return colors[Math.floor(Math.random() * colors.length)];
//     }

//     update(mouseX, mouseY, mouseStrength) {
//       // Store current position in trail
//       this.trail.push({ x: this.x, y: this.y });
//       if (this.trail.length > this.tailLength) {
//         this.trail.shift();
//       }

//       // Mouse interaction - repulsion
//       const dx = this.x - mouseX;
//       const dy = this.y - mouseY;
//       const distance = Math.sqrt(dx * dx + dy * dy);
      
//       if (distance < 200 && mouseStrength > 0) {
//         const force = (1 - distance / 200) * mouseStrength * 0.1;
//         this.vx += (dx / distance) * force;
//         this.vy += (dy / distance) * force;
//       }

//       // Apply velocity with damping
//       this.vx *= 0.99;
//       this.vy *= 0.99;
      
//       // Add some organic movement
//       this.vx += (Math.random() - 0.5) * 0.02;
//       this.vy += (Math.random() - 0.5) * 0.02;

//       // Update position
//       this.x += this.vx * this.speed;
//       this.y += this.vy * this.speed;

//       // Boundary wrapping
//       if (this.x < -50) this.x = this.canvasWidth + 50;
//       if (this.x > this.canvasWidth + 50) this.x = -50;
//       if (this.y < -50) this.y = this.canvasHeight + 50;
//       if (this.y > this.canvasHeight + 50) this.y = -50;

//       // Shine animation
//       this.shinePhase += 0.05;
//       this.shineIntensity = Math.sin(this.shinePhase) * 0.5 + 0.5;

//       // Breaking star effect
//       if (this.breaking) {
//         this.breakPhase += 0.02;
//         if (this.breakPhase > 1) this.breakPhase = 0;
        
//         // Pulsing size for breaking stars
//         this.size = this.baseSize * (1 + Math.sin(this.breakPhase * Math.PI * 4) * 0.3);
//       }
//     }

//     draw(ctx) {
//       if (this.trail.length < 2) return;

//       // Draw tail with gradient
//       const gradient = ctx.createLinearGradient(
//         this.trail[0].x, this.trail[0].y, this.x, this.y
//       );
      
//       gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
//       gradient.addColorStop(0.3, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.3)`);
//       gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`);

//       ctx.strokeStyle = gradient;
//       ctx.lineWidth = this.tailWidth;
//       ctx.lineCap = 'round';
//       ctx.lineJoin = 'round';

//       ctx.beginPath();
//       ctx.moveTo(this.trail[0].x, this.trail[0].y);
      
//       for (let i = 1; i < this.trail.length; i++) {
//         ctx.lineTo(this.trail[i].x, this.trail[i].y);
//       }
      
//       ctx.stroke();

//       // Draw star head with shine
//       const shineSize = this.size * (1 + this.shineIntensity * 0.5);
//       const radialGradient = ctx.createRadialGradient(
//         this.x, this.y, 0, this.x, this.y, shineSize * 2
//       );
      
//       radialGradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 + this.shineIntensity * 0.4})`);
//       radialGradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.3)`);
//       radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

//       ctx.fillStyle = radialGradient;
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, shineSize * 2, 0, Math.PI * 2);
//       ctx.fill();

//       // Core of the star
//       ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
//       ctx.fill();

//       // Shine sparkle for breaking stars
//       if (this.breaking && this.shineIntensity > 0.8) {
//         ctx.fillStyle = `rgba(255, 255, 255, ${this.shineIntensity})`;
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
//         ctx.fill();
//       }
//     }
//   }

//   // Initialize particles
//   const initParticles = useCallback((width, height) => {
//     const particles = [];
//     const particleCount = Math.min(80, Math.floor((width * height) / 20000));
    
//     for (let i = 0; i < particleCount; i++) {
//       particles.push(new StarParticle(width, height));
//     }
    
//     return particles;
//   }, []);

//   // Animation loop
//   const animate = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     const width = canvas.width;
//     const height = canvas.height;

//     // Clear canvas with slight fade effect for trails
//     ctx.fillStyle = 'rgba(11, 6, 26, 0.1)';
//     ctx.fillRect(0, 0, width, height);

//     // Update and draw particles
//     particlesRef.current.forEach(particle => {
//       particle.update(
//         mousePosRef.current.x,
//         mousePosRef.current.y,
//         mousePosRef.current.strength
//       );
//       particle.draw(ctx);
//     });

//     // Gradually reduce mouse strength
//     mousePosRef.current.strength *= 0.95;

//     animationRef.current = requestAnimationFrame(animate);
//   }, []);

//   const particlesRef = useRef([]);

//   // Mouse/touch handlers
//   const handleMouseMove = useCallback((e) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     mousePosRef.current = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//       strength: 1
//     };
//   }, []);

//   const handleTouchMove = useCallback((e) => {
//     e.preventDefault();
//     if (e.touches.length > 0) {
//       handleMouseMove(e.touches[0]);
//     }
//   }, [handleMouseMove]);

//   const handleMouseLeave = useCallback(() => {
//     mousePosRef.current.strength = 0;
//   }, []);

//   // Setup and cleanup
//   useEffect(() => {
//     setIsMounted(true);

//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const resizeCanvas = () => {
//       const container = canvas.parentElement;
//       if (container) {
//         canvas.width = container.clientWidth;
//         canvas.height = container.clientHeight;
//         particlesRef.current = initParticles(canvas.width, canvas.height);
//       }
//     };

//     // Initial setup
//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     // Start animation
//     animate();

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [animate, initParticles]);

//   if (!isMounted) {
//     return (
//       <div className="absolute inset-0 bg-gradient-to-br from-black via-[#10061a] to-[#1b0f2a]" />
//     );
//   }

//   return (
//     <div className="absolute inset-0 overflow-hidden">
//       {/* Background Gradient */}
//       <div 
//         className="absolute inset-0"
//         style={{
//           background: 'linear-gradient(135deg, #000000 0%, #10061a 50%, #1b0f2a 100%)',
//         }}
//       />
      
//       {/* Subtle Cosmic Dust */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute inset-0" style={{
//           backgroundImage: `
//             radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
//             radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.08) 0%, transparent 50%),
//             radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.05) 0%, transparent 50%)
//           `,
//         }} />
//       </div>

//       {/* Canvas for Interactive Stars */}
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 cursor-pointer"
//         onMouseMove={handleMouseMove}
//         onTouchMove={handleTouchMove}
//         onMouseLeave={handleMouseLeave}
//         style={{ 
//           touchAction: 'none',
//           background: 'transparent'
//         }}
//       />

//       {/* Additional Shimmer Effects */}
//       <div className="absolute inset-0 pointer-events-none">
//         {/* Large distant stars */}
//         {Array.from({ length: 20 }).map((_, i) => (
//           <div
//             key={i}
//             className="absolute rounded-full animate-pulse"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               width: `${Math.random() * 3 + 1}px`,
//               height: `${Math.random() * 3 + 1}px`,
//               background: 'rgba(255, 255, 255, 0.8)',
//               animationDelay: `${Math.random() * 5}s`,
//               animationDuration: `${3 + Math.random() * 4}s`,
//               boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
//             }}
//           />
//         ))}
//       </div>

//       {/* CSS for additional effects */}
//       <style jsx>{`
//         @keyframes twinkle {
//           0%, 100% { opacity: 0.3; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.2); }
//         }
        
//         .animate-pulse {
//           animation: twinkle 3s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default StarBackground;