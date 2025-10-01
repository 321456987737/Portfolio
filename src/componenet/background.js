
"use client";
import React, { useEffect, useRef } from "react";

/**
 * BackgroundStarsInteractiveV2
 * - Movers spawn inside page, tails 50-250px, tail width capped at 4px.
 * - When mover breaks: spawns fragments (tail 5-30px). Only up to 3 fragments will further "pop".
 * - When mover pops: brief explosion flare with max line width 30px.
 * - Hover rotates mover path by 20..180 degrees; sometimes hover causes pop (configurable chance).
 * - Click near mover forces pop.
 */

export default function BackgroundStarsInteractiveV2() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: null, y: null, active: false });
  const stateRef = useRef({
    stars: [],
    movers: [],
    fragments: [], // fragments & micro-sparks live here
    explosions: [], // short-lived flare lines (max width 30px)
    width: 0,
    height: 0,
    dpr: 1,
    lastSpawn: 0,
    time: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const CFG = {
      baseStarCount: 110,
      moversMax: 10,
      spawnIntervalMin: 900,
      spawnIntervalMax: 2600,
      fragmentCount: 10, // base fragment count when mover breaks
      tailMin: 50,
      tailMax: 250, // mover tail length
      tailWidthMax: 4, // mover tail line width max
      shinyChance: 0.2,
      twinkleSpeed: 0.9,
      influenceRadius: 250,
      maxSpeed: 320, // px/s cap (you had this)
      hoverPopChance: 0.18, // chance hover causes pop
      clickForcePopRadius: 80,
      // Secondary pop settings:
      maxSecondaryPops: 3, // <= 3 fragments will pop further
      microParticleCount: [6, 12], // micro-sparks per popped fragment
      microLenRange: [5, 30], // micro-spark tail lengths (5-30 px)
      explosionLife: 220, // ms life of the big flare (line width up to 30px)
      explosionMaxLineWidth: 30, // user's requested 30px max width for pop flare
    };

    const rand = (a, b) => a + Math.random() * (b - a);
    const randInt = (a, b) => Math.floor(rand(a, b));
    const now = () => performance.now();

    // DPR & resize
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      stateRef.current.dpr = dpr;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      stateRef.current.width = w;
      stateRef.current.height = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // background twinkle stars
    const initStars = () => {
      const W = stateRef.current.width;
      const H = stateRef.current.height;
      const arr = [];
      for (let i = 0; i < CFG.baseStarCount; i++) {
        arr.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: Math.random() * 1.8 + 0.5,
          shiny: Math.random() < CFG.shinyChance,
          phase: Math.random() * Math.PI * 2,
          hue: rand(220, 1200),
        });
      }
      stateRef.current.stars = arr;
    };

    // spawn mover inside canvas; velocities in px/sec
    const spawnMover = (targetX = null, targetY = null) => {
      if (stateRef.current.movers.length >= CFG.moversMax) return;
      const W = stateRef.current.width;
      const H = stateRef.current.height;

      const x = rand(0.05 * W, 0.95 * W);
      const y = rand(0.05 * H, 0.95 * H);

      let aimX = targetX ?? rand(0.2 * W, 0.8 * W);
      let aimY = targetY ?? rand(0.2 * H, 0.8 * H);

      let dx = aimX - x + rand(-W * 0.05, W * 0.05);
      let dy = aimY - y + rand(-H * 0.05, H * 0.05);
      const dist = Math.hypot(dx, dy) || 1;

      const tailLen = rand(CFG.tailMin, CFG.tailMax);
      let desiredSpeed = tailLen / rand(0.8, 1.6) * 1.15;
      desiredSpeed = Math.min(desiredSpeed, CFG.maxSpeed);
      desiredSpeed = Math.max(40, desiredSpeed);

      const vx = (dx / dist) * desiredSpeed;
      const vy = (dy / dist) * desiredSpeed;

      const size = rand(1.2, 3.0);
      const hue = rand(250, 310);
      const width = Math.min(CFG.tailWidthMax, Math.max(0.6, Math.abs(desiredSpeed) * 0.008 * (tailLen / 100)));

      stateRef.current.movers.push({
        x,
        y,
        vx,
        vy,
        size,
        hue,
        tailLen,
        width,
        birth: now(),
        life: rand(900, 1800),
        broken: false,
      });
    };

    // spawn micro-sparks (called when a fragment pops)
    const spawnMicroFromFragment = (frag) => {
      const [minCount, maxCount] = CFG.microParticleCount;
      const count = randInt(minCount, maxCount);
      const baseSpeed = Math.hypot(frag.vx || 0, frag.vy || 0) || 1;
      for (let i = 0; i < count; i++) {
        if (stateRef.current.fragments.length > 1200) break;
        const ang = Math.atan2(rand(-1, 1), rand(-1, 1)) + rand(-Math.PI, Math.PI) * 0.25;
        const speed = baseSpeed * rand(0.2, 1.6);
        const len = rand(CFG.microLenRange[0], CFG.microLenRange[1]); // 5-30 px
        stateRef.current.fragments.push({
          x: frag.x,
          y: frag.y,
          vx: Math.cos(ang) * speed * rand(0.5, 1.8),
          vy: Math.sin(ang) * speed * rand(0.5, 1.8),
          life: rand(200, 700),
          birth: now(),
          len,
          width: Math.min(3.6, rand(0.4, 2.2)),
          hue: frag.hue + rand(-20, 20),
        });
      }
    };

    // break mover -> spawn fragments (5..30 px tails). Only up to maxSecondaryPops fragments will later pop
    const breakMover = (m) => {
      const baseSpeed = Math.hypot(m.vx, m.vy) || 1;
      const count = randInt(Math.max(3, CFG.fragmentCount * 0.6), Math.max(4, CFG.fragmentCount * 1.1));
      const created = [];
      for (let i = 0; i < count; i++) {
        if (stateRef.current.fragments.length > 1200) break;
        const angle = Math.atan2(m.vy, m.vx) + rand(-Math.PI, Math.PI);
        const speed = baseSpeed * rand(0.2, 1.6);
        // fragment tail length 5..30 px as requested
        const fragLen = rand(5, 30);
        const frag = {
          x: m.x,
          y: m.y,
          vx: Math.cos(angle) * speed * rand(0.5, 1.6),
          vy: Math.sin(angle) * speed * rand(0.5, 1.6),
          life: rand(220, 900),
          birth: now(),
          len: fragLen,
          width: Math.min(3.2, rand(0.4, 2.2)),
          hue: m.hue + rand(-20, 20),
        };
        stateRef.current.fragments.push(frag);
        created.push(frag);
      }

      // explosion flare (big line) with max width 30px
      stateRef.current.explosions.push({
        x: m.x,
        y: m.y,
        life: CFG.explosionLife,
        birth: now(),
        maxLine: CFG.explosionMaxLineWidth,
        hue: m.hue,
      });

      // choose up to maxSecondaryPops from created to pop further (so not all fragments pop)
      const popCount = Math.min(CFG.maxSecondaryPops, created.length);
      const picks = [];
      while (picks.length < popCount) {
        const idx = randInt(0, created.length);
        if (!picks.includes(idx)) picks.push(idx);
      }
      // schedule small delayed micro-pops (staggered 30-180ms) for selected fragments
      for (let idx of picks) {
        const frag = created[idx];
        const delay = rand(30, 180);
        setTimeout(() => {
          // fragile: frag still exists? we'll just spawn micro from frag position
          spawnMicroFromFragment(frag);
        }, delay);
      }
    };

    // rotate mover path by random angle between 20..180 degrees; sometimes pop
    const rotateMoverPathToPointer = (m, px, py) => {
      const deg = rand(20, 180);
      const rad = (deg * Math.PI) / 180;
      const sign = Math.random() < 0.5 ? -1 : 1;
      const desired = Math.atan2(py - m.y, px - m.x);
      const newAngle = desired + sign * rad;
      const speed = Math.hypot(m.vx, m.vy) || 1;
      let nvx = Math.cos(newAngle) * speed;
      let nvy = Math.sin(newAngle) * speed;
      const nSpeed = Math.hypot(nvx, nvy);
      if (nSpeed > CFG.maxSpeed) {
        nvx = (nvx / nSpeed) * CFG.maxSpeed;
        nvy = (nvy / nSpeed) * CFG.maxSpeed;
      }
      m.vx = nvx;
      m.vy = nvy;
      m.width = Math.min(CFG.tailWidthMax, m.width * 1.12 + 0.25);

      // small probability to also pop on hover (so sometimes it won't)
      if (Math.random() < CFG.hoverPopChance) {
        breakMover(m);
        return true;
      }
      return false;
    };

    // draw helpers
    const drawGradientBg = () => {
      const W = stateRef.current.width;
      const H = stateRef.current.height;
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#000000");
      g.addColorStop(0.5, "#10061a");
      g.addColorStop(1, "#1b0f2a");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    };

    const drawShiny = (x, y, size, hue, t) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, size * 6);
      const alpha = 0.25 + 0.75 * Math.abs(Math.sin(t * CFG.twinkleSpeed + size));
      g.addColorStop(0, `rgba(255,255,255,${0.9 * alpha})`);
      g.addColorStop(0.4, `hsla(${hue},80%,65%,${0.45 * alpha})`);
      g.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.8 + 0.2 * Math.sin(t * 6)})`;
      ctx.arc(x, y, Math.max(0.6, size * 0.6), 0, Math.PI * 2);
      ctx.fill();
    };

    const drawTiny = (x, y, size, t) => {
      ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.5 * (0.5 + 0.5 * Math.sin(t * CFG.twinkleSpeed + x))})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    // pointer handlers
    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointerRef.current.x = px;
      pointerRef.current.y = py;
      pointerRef.current.active = true;

      // influence movers within radius
      for (let i = stateRef.current.movers.length - 1; i >= 0; i--) {
        const m = stateRef.current.movers[i];
        const dist = Math.hypot(m.x - px, m.y - py);
        if (dist <= CFG.influenceRadius) {
          const popped = rotateMoverPathToPointer(m, px, py);
          if (popped) {
            // remove mover if it popped
            stateRef.current.movers.splice(i, 1);
          }
        }
      }
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = null;
      pointerRef.current.y = null;
    };

    // click behavior: spawn movers and force-pop movers close to click
    const handlePointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      for (let i = 0; i < 3; i++) spawnMover(px + rand(-60, 60), py + rand(-60, 60));

      // force-pop movers near click (within clickForcePopRadius)
      for (let i = stateRef.current.movers.length - 1; i >= 0; i--) {
        const m = stateRef.current.movers[i];
        const dist = Math.hypot(m.x - px, m.y - py);
        if (dist <= CFG.clickForcePopRadius) {
          breakMover(m);
          stateRef.current.movers.splice(i, 1);
        }
      }
    };

    // main animation loop
    let last = now();
    function frame() {
      const cur = now();
      const dtMs = cur - last;
      last = cur;
      stateRef.current.time += dtMs;
      const dt = Math.min(0.05, dtMs / 1000);

      const W = stateRef.current.width;
      const H = stateRef.current.height;
      drawGradientBg();

      const t = stateRef.current.time / 1000;
      // draw background stars
      for (let s of stateRef.current.stars) {
        if (s.shiny) drawShiny(s.x, s.y, s.size, s.hue, t + s.phase);
        else drawTiny(s.x, s.y, s.size, t + s.phase);
        s.x += Math.sin((t + s.phase) * 0.12) * 0.01;
        s.y += Math.cos((t + s.phase) * 0.08) * 0.01;
        if (s.x < -10) s.x = W + 10;
        if (s.x > W + 10) s.x = -10;
        if (s.y < -10) s.y = H + 10;
        if (s.y > H + 10) s.y = -10;
      }

      // spawn movers periodically (bias to pointer if active)
      const spawnInterval = rand(CFG.spawnIntervalMin, CFG.spawnIntervalMax);
      if (cur - stateRef.current.lastSpawn > spawnInterval) {
        if (pointerRef.current.active) spawnMover(pointerRef.current.x, pointerRef.current.y);
        else spawnMover();
        stateRef.current.lastSpawn = cur;
      }

      // update movers
      for (let i = stateRef.current.movers.length - 1; i >= 0; i--) {
        const m = stateRef.current.movers[i];
        m.x += m.vx * dt;
        m.y += m.vy * dt;

        // draw mover tail
        const headX = m.x;
        const headY = m.y;
        const speed = Math.max(1, Math.hypot(m.vx, m.vy));
        const tailX = m.x - (m.vx / speed) * m.tailLen;
        const tailY = m.y - (m.vy / speed) * m.tailLen;

        const grd = ctx.createLinearGradient(headX, headY, tailX, tailY);
        grd.addColorStop(0, `rgba(255,255,255,0.95)`);
        grd.addColorStop(0.5, `hsla(${m.hue},85%,65%,0.45)`);
        grd.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grd;
        ctx.lineWidth = Math.min(CFG.tailWidthMax, Math.max(0.6, m.width));
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // head
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,0.95)`;
        ctx.arc(headX, headY, m.size, 0, Math.PI * 2);
        ctx.fill();

        // life / off-screen -> break into fragments & remove
        const lifeT = (now() - m.birth) / m.life;
        if (lifeT > 0.95 || headX < -200 || headX > W + 200 || headY < -200 || headY > H + 200) {
          breakMover(m);
          stateRef.current.movers.splice(i, 1);
          continue;
        }
      }

      // update fragments (including micro-sparks)
      for (let i = stateRef.current.fragments.length - 1; i >= 0; i--) {
        const p = stateRef.current.fragments[i];
        const age = now() - p.birth;
        if (age > p.life) {
          stateRef.current.fragments.splice(i, 1);
          continue;
        }
        const lifeRatio = 1 - age / p.life;
        p.vx *= 0.997;
        p.vy *= 0.997;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const tailX = p.x - (p.vx / Math.max(1, Math.hypot(p.vx, p.vy))) * p.len;
        const tailY = p.y - (p.vy / Math.max(1, Math.hypot(p.vx, p.vy))) * p.len;
        const g = ctx.createLinearGradient(p.x, p.y, tailX, tailY);
        g.addColorStop(0, `hsla(${p.hue},85%,65%,${0.95 * lifeRatio})`);
        g.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = Math.max(0.3, p.width * lifeRatio);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${0.6 * lifeRatio})`;
        ctx.arc(p.x, p.y, Math.max(0.35, p.width * 0.7), 0, Math.PI * 2);
        ctx.fill();
      }

      // draw and update explosions (big flare with max line width 30px)
      for (let i = stateRef.current.explosions.length - 1; i >= 0; i--) {
        const ex = stateRef.current.explosions[i];
        const age = now() - ex.birth;
        if (age > ex.life) {
          stateRef.current.explosions.splice(i, 1);
          continue;
        }
        const lifeRatio = 1 - age / ex.life;
        const lw = ex.maxLine * lifeRatio; // interpolate line width down from max
        // draw a few burst lines radiating
        const parts = 10;
        for (let j = 0; j < parts; j++) {
          const a = (j / parts) * Math.PI * 2 + (age % 360) * 0.0005;
          const x2 = ex.x + Math.cos(a) * (20 + (1 - lifeRatio) * 120);
          const y2 = ex.y + Math.sin(a) * (20 + (1 - lifeRatio) * 120);
          ctx.beginPath();
          const gg = ctx.createLinearGradient(ex.x, ex.y, x2, y2);
          gg.addColorStop(0, `hsla(${ex.hue}, 90%, 70%, ${0.95 * lifeRatio})`);
          gg.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.strokeStyle = gg;
          ctx.lineWidth = Math.max(1, lw * (0.6 + Math.random() * 0.8));
          ctx.lineCap = "round";
          ctx.moveTo(ex.x, ex.y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    // boot
    resize();
    initStars();
    for (let i = 0; i < 3; i++) spawnMover();

    // listeners
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", resize);

    let lastFrame = now();
    rafRef.current = requestAnimationFrame(frame);

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wrapper: pointerEvents "auto" so hover/click works. If it blocks your UI,
  // I can add an overlay that forwards pointer coords while keeping canvas pointer-events none.
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "auto",
        background: "linear-gradient(135deg, black 0%, #10061a 45%, #1b0f2a 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100vh",
          display: "block",
        }}
      />
    </div>
  );
}
