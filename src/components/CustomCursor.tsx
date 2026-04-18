"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const lag = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);
    let raf: number;
    const tick = () => {
      if (dot.current) { dot.current.style.left = pos.current.x + "px"; dot.current.style.top = pos.current.y + "px"; }
      lag.current.x += (pos.current.x - lag.current.x) * 0.1;
      lag.current.y += (pos.current.y - lag.current.y) * 0.1;
      if (ring.current) { ring.current.style.left = lag.current.x + "px"; ring.current.style.top = lag.current.y + "px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dot}  className="cursor-dot"  aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  );
}
