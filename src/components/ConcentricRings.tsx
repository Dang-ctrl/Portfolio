"use client";
import { useEffect, useRef } from "react";

interface Ring {
  radius: number;
  alpha:  number;
  speed:  number;
}

const MAX_RADIUS   = 1400;   // px — rings grow until this size then reset
const NUM_RINGS    = 7;      // number of simultaneously travelling rings
const RING_SPACING = MAX_RADIUS / NUM_RINGS; // evenly stagger them at birth
const LINE_WIDTH   = 0.6;    // stroke weight
const BASE_SPEED   = 0.42;   // px per frame — subtle drift
const PEAK_ALPHA   = 0.13;   // max opacity of a ring at its brightest
const COLOR        = "111, 192, 122"; // RGB for --acc-hi green tint

export default function ConcentricRings() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── size canvas to viewport ────────────────────────────── */
    let W = 0, H = 0, cx = 0, cy = 0;
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cx = W * 0.5;
      cy = H * 0.5;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── init rings staggered so the screen isn't empty ──────── */
    const rings: Ring[] = Array.from({ length: NUM_RINGS }, (_, i) => ({
      radius: i * RING_SPACING,
      alpha:  0,
      speed:  BASE_SPEED + i * 0.04, // slight speed variation per ring
    }));

    /* ── render loop ─────────────────────────────────────────── */
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const ring of rings) {
        ring.radius += ring.speed;

        /* fade in near centre, fade out near max — bell shape */
        const progress = ring.radius / MAX_RADIUS;          // 0 → 1
        ring.alpha = PEAK_ALPHA * Math.sin(progress * Math.PI);

        if (ring.radius >= MAX_RADIUS) {
          ring.radius = 0;
          ring.alpha  = 0;
        }

        if (ring.alpha <= 0.001) continue;

        ctx.beginPath();
        ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${COLOR}, ${ring.alpha})`;
        ctx.lineWidth   = LINE_WIDTH;
        ctx.stroke();
      }

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
