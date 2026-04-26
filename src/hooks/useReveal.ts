"use client";
import { useEffect, RefObject } from "react";

export function useReveal(ref: RefObject<HTMLElement>, delay = 0) {
  useEffect(() => {
    const els = Array.from(
      ref.current?.querySelectorAll<HTMLElement>(".reveal, .reveal-left") ?? []
    );
    if (!els.length) return;

    // Fire immediately on mount — no waiting for IO.
    // Elements are already in the viewport; a tight stagger is all we need.
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), delay + i * 35);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
