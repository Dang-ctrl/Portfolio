"use client";
import { Component, ReactNode, useEffect, useState } from "react";

/* Shared helpers for the WebGL pieces: feature detection, reduced-motion,
   and an error boundary so a GPU/driver failure never takes the page down. */

export function useCanRender3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setOk(false);
    }
  }, []);
  return ok;
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

/* Only mount/animate a canvas while it's near the viewport. */
export function useInView<T extends Element>(ref: React.RefObject<T>, rootMargin = "200px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

export class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) { console.warn("3D scene disabled:", err); }
  render() { return this.state.failed ? null : this.props.children; }
}

/* Theme-aware palette for three.js (CSS vars can't reach the GPU directly). */
export function palette(theme: "light" | "dark") {
  return theme === "dark"
    ? { accent: "#7ee08a", accentDeep: "#2f6b3e", ink: "#e9e7e1", dim: "#3b4a40", additive: true }
    : { accent: "#2f7a45", accentDeep: "#1f5530", ink: "#16201a", dim: "#9aa89d", additive: false };
}
