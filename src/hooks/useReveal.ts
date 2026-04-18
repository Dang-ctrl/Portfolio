"use client";
import { useEffect, RefObject } from "react";

export function useReveal(ref: RefObject<HTMLElement>, delay = 0) {
  useEffect(() => {
    const els = Array.from(
      ref.current?.querySelectorAll<HTMLElement>(".reveal, .reveal-left") ?? []
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const i  = els.indexOf(el);
          setTimeout(() => el.classList.add("visible"), delay + i * 55);
          io.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref, delay]);
}
