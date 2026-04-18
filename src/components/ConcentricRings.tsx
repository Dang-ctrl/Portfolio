"use client";
import { useEffect, useRef } from "react";

/* ══════════════════════════════════════════════
   RING CONFIG
   ══════════════════════════════════════════════ */
interface Ring {
  radius: number;
  alpha:  number;
  speed:  number;
}

const MAX_RADIUS   = 1200;
const NUM_RINGS    = 8;
const RING_SPACING = MAX_RADIUS / NUM_RINGS;
const LINE_WIDTH   = 0.8;
const BASE_SPEED   = 0.35;
const PEAK_ALPHA   = 0.22;          // ← bumped from 0.13
const RING_COLOR   = "111, 192, 122";

/* ══════════════════════════════════════════════
   PARTICLE CONFIG
   ══════════════════════════════════════════════ */
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  fadeDir: number;
}

const NUM_PARTICLES = 80;            // ← more particles
const P_MAX_ALPHA   = 0.45;          // ← brighter
const P_MIN_R       = 0.6;
const P_MAX_R       = 2.2;
const P_MAX_SPEED   = 0.12;
const P_FADE_SPEED  = 0.004;
const P_COLOR       = "111, 192, 122";

function spawnParticle(W: number, H: number): Particle {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * P_MAX_SPEED * 2,
    vy: (Math.random() - 0.5) * P_MAX_SPEED * 2,
    radius: P_MIN_R + Math.random() * (P_MAX_R - P_MIN_R),
    alpha: 0,
    maxAlpha: 0.08 + Math.random() * (P_MAX_ALPHA - 0.08),
    fadeDir: 1,
  };
}

/* ══════════════════════════════════════════════
   GRADIENT ORB CONFIG  (floating blobs)
   ══════════════════════════════════════════════ */
interface Orb {
  x: number; y: number;
  targetX: number; targetY: number;
  radius: number;
  color: string;
  speed: number;
}

const ORB_DEFS: { color: string; radius: number }[] = [
  { color: "78, 124, 88",    radius: 350 },   // deep green
  { color: "111, 192, 122",  radius: 280 },   // accent green
  { color: "60, 100, 70",    radius: 320 },   // forest
];
const ORB_ALPHA  = 0.045;                       // soft glow
const ORB_SPEED  = 0.3;

function spawnOrb(def: typeof ORB_DEFS[0], W: number, H: number): Orb {
  return {
    x: Math.random() * W,
    y: Math.random() * H,
    targetX: Math.random() * W,
    targetY: Math.random() * H,
    radius: def.radius,
    color: def.color,
    speed: ORB_SPEED + Math.random() * 0.15,
  };
}

/* ══════════════════════════════════════════════
   DOT GRID CONFIG
   ══════════════════════════════════════════════ */
const GRID_GAP   = 48;
const GRID_DOT_R = 0.6;
const GRID_ALPHA = 0.08;

/* ══════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════ */
export default function ConcentricRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, cx = 0, cy = 0;
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cx = W * 0.5;
      cy = H * 0.5;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── init rings ──────────────────── */
    const rings: Ring[] = Array.from({ length: NUM_RINGS }, (_, i) => ({
      radius: i * RING_SPACING,
      alpha:  0,
      speed:  BASE_SPEED + i * 0.04,
    }));

    /* ── init particles ──────────────── */
    const particles: Particle[] = Array.from(
      { length: NUM_PARTICLES },
      () => spawnParticle(W, H)
    );

    /* ── init orbs ───────────────────── */
    const orbs: Orb[] = ORB_DEFS.map(d => spawnOrb(d, W, H));

    /* ── frame counter for grid shimmer */
    let frame = 0;

    /* ══ RENDER LOOP ═══════════════════ */
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      /* ── 1. Dot grid ─────────────────── */
      for (let gx = GRID_GAP; gx < W; gx += GRID_GAP) {
        for (let gy = GRID_GAP; gy < H; gy += GRID_GAP) {
          // shimmer: dots near center are slightly brighter
          const dx = gx - cx;
          const dy = gy - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.sqrt(cx * cx + cy * cy);
          const proximity = 1 - dist / maxDist;
          const shimmer = GRID_ALPHA + proximity * 0.06;

          ctx.beginPath();
          ctx.arc(gx, gy, GRID_DOT_R, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${shimmer})`;
          ctx.fill();
        }
      }

      /* ── 2. Gradient orbs ────────────── */
      for (const orb of orbs) {
        // drift toward target
        const odx = orb.targetX - orb.x;
        const ody = orb.targetY - orb.y;
        const oDist = Math.sqrt(odx * odx + ody * ody);

        if (oDist < 2) {
          orb.targetX = Math.random() * W;
          orb.targetY = Math.random() * H;
        } else {
          orb.x += (odx / oDist) * orb.speed;
          orb.y += (ody / oDist) * orb.speed;
        }

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0,   `rgba(${orb.color}, ${ORB_ALPHA})`);
        grad.addColorStop(0.6, `rgba(${orb.color}, ${ORB_ALPHA * 0.4})`);
        grad.addColorStop(1,   `rgba(${orb.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2);
      }

      /* ── 3. Concentric rings ─────────── */
      for (const ring of rings) {
        ring.radius += ring.speed;
        const progress = ring.radius / MAX_RADIUS;
        ring.alpha = PEAK_ALPHA * Math.sin(progress * Math.PI);

        if (ring.radius >= MAX_RADIUS) {
          ring.radius = 0;
          ring.alpha  = 0;
        }
        if (ring.alpha <= 0.001) continue;

        ctx.beginPath();
        ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RING_COLOR}, ${ring.alpha})`;
        ctx.lineWidth   = LINE_WIDTH;
        ctx.stroke();
      }

      /* ── 4. Floating particles ─────── */
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        p.alpha += P_FADE_SPEED * p.fadeDir;
        if (p.alpha >= p.maxAlpha) { p.alpha = p.maxAlpha; p.fadeDir = -1; }
        if (p.alpha <= 0) {
          p.alpha = 0;
          p.fadeDir = 1;
          p.x = Math.random() * W;
          p.y = Math.random() * H;
        }
        if (p.alpha <= 0.001) continue;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${P_COLOR}, ${p.alpha})`;
        ctx.fill();
      }

      /* ── 5. Center radial glow ────── */
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.5);
      glow.addColorStop(0,   "rgba(111, 192, 122, 0.04)");
      glow.addColorStop(0.4, "rgba(111, 192, 122, 0.015)");
      glow.addColorStop(1,   "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
