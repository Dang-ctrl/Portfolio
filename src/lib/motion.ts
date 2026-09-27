"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type Lenis from "lenis";

/* Shared motion plumbing: GSAP plugins, the Lenis instance, and the
   hand-off between the curtain transition and page animations. */

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── Lenis ─────────────────────────────── */
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenis = l; };
export const getLenis = () => lenis;

export function scrollToTarget(target: string | number, immediate = false) {
  if (typeof target === "string") {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -80, immediate });
    else el.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
    return;
  }
  if (lenis) lenis.scrollTo(target, { immediate, force: true });
  else window.scrollTo(0, target);
}

/* ── Curtain ↔ page hand-off ───────────── */
type Navigate = (href: string, label?: string) => void;
let navigateImpl: Navigate | null = null;
export const registerNavigate = (fn: Navigate | null) => { navigateImpl = fn; };
export function navigate(href: string, label?: string) {
  if (navigateImpl) navigateImpl(href, label);
  else window.location.assign(href);
}

/* Fired when a page becomes visible: on first load, and as the curtain lifts. */
const enterListeners = new Set<() => void>();
export function onPageEnter(fn: () => void) {
  enterListeners.add(fn);
  return () => { enterListeners.delete(fn); };
}
export function emitPageEnter() {
  enterListeners.forEach((fn) => fn());
}
