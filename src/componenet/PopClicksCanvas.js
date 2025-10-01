"use client";
import React, { useEffect, useRef } from "react";

export default function BackgroundPopEffect() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({ pops: [] });

  const defaultPalettes = [
    ["#ffffff", "#a78bfa", "#7c3aed", "#60a5fa"],
    ["#fff7ed", "#ffb86b", "#ff6b6b", "#ffd166"],
    ["#ffffff", "#9be7ff", "#6bd3ff", "#b28cff"],
    ["#fff", "#ffd6f6", "#ff7ad9", "#c084fc"],
    ["#fffef0", "#e6f7d4", "#9be15d", "#7ee787"],
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pops = stateRef.current.pops;

    // device pixel ratio scaling for crisp lines
    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;

    const rand = (min, max) => Math.random() * (max - min) + min;
    const randInt = (min, max) => Math.floor(rand(min, max));

    function resize() {
      dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Set CSS size
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      // Set backing store size for high-DPI
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      // Scale drawing operations to CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      width = w;
      height = h;
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnPop(x, y) {
      const birth = performance.now();
      const duration = rand(600, 1000);
      const pal = defaultPalettes[randInt(0, defaultPalettes.length)];

      pops.push({
        x,
        y,
        birth,
        duration,
        shards: Array.from({ length: randInt(4, 12) }, () => {
          const angle = rand(0, Math.PI * 2);
          const speed = rand(2, 6);
          return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            len: rand(8, 20),
            hue: pal[randInt(0, pal.length)],
            birth,
            life: duration * rand(0.5, 1),
          };
        }),
        sparks: Array.from({ length: randInt(6, 16) }, () => {
          const angle = rand(0, Math.PI * 2);
          return {
            x,
            y,
            angle,
            speed: rand(1, 3),
            len: rand(4, 12),
            hue: pal[randInt(0, pal.length)],
            birth,
            life: duration * rand(0.5, 0.9),
          };
        }),
        flares: Array.from({ length: randInt(3, 6) }, () => {
          const type = Math.random() < 0.5 ? "small" : "large";
          const len = type === "small" ? rand(10, 20) : rand(30, 50);
          return {
            x,
            y,
            angle: rand(0, Math.PI * 2),
            len,
            width: type === "small" ? rand(0.8, 1.8) : rand(1.8, 3.5),
            hue: pal[randInt(0, pal.length)],
            birth,
            life: duration * rand(0.5, 0.9),
          };
        }),
      });
    }

    function drawPop(pop, t) {
      // same drawing logic but using ctx already scaled
      pop.shards.forEach((s) => {
        const sa = (t - s.birth) / s.life;
        if (sa > 1) return;
        s.x += s.vx;
        s.y += s.vy;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * s.len, s.y - s.vy * s.len);
        ctx.strokeStyle = s.hue;
        ctx.lineWidth = 0.8 * (1 - sa);
        ctx.stroke();
      });

      pop.sparks.forEach((sp) => {
        const sa = (t - sp.birth) / sp.life;
        if (sa > 1) return;
        sp.x += Math.cos(sp.angle) * sp.speed;
        sp.y += Math.sin(sp.angle) * sp.speed;
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);
        ctx.lineTo(sp.x - Math.cos(sp.angle) * sp.len, sp.y - Math.sin(sp.angle) * sp.len);
        ctx.strokeStyle = sp.hue;
        ctx.lineWidth = 0.6 * (1 - sa);
        ctx.stroke();
      });

      pop.flares.forEach((f) => {
        const fa = (t - f.birth) / f.life;
        if (fa > 1) return;
        const fx2 = f.x + Math.cos(f.angle) * f.len;
        const fy2 = f.y + Math.sin(f.angle) * f.len;
        const g = ctx.createLinearGradient(f.x, f.y, fx2, fy2);
        g.addColorStop(0, "rgba(255,255,255,0.9)");
        g.addColorStop(0.5, f.hue);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(fx2, fy2);
        ctx.strokeStyle = g;
        ctx.lineWidth = f.width * (1 - fa);
        ctx.lineCap = "round";
        ctx.stroke();
      });
    }

    function animate(t) {
      // clear full backing store size using CSS dims * dpr
      ctx.clearRect(0, 0, width, height);
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i];
        if (t - p.birth > p.duration) {
          pops.splice(i, 1);
          continue;
        }
        drawPop(p, t);
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    // <<-- IMPORTANT: listen on window so canvas can be pointer-events: none
    function handleWindowClick(e) {
      // e.clientX/Y are CSS pixels, ctx is scaled so drawing coordinates match
      spawnPop(e.clientX, e.clientY);
    }

    window.addEventListener("click", handleWindowClick);

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // make sure canvas doesn't block UI (navbar) — z-index lower than navbar
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-40" />;
}
