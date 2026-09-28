"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/motion";

/* A small cursor dot (difference-blended, so it works on any background) that
   grows over links and shows a label over [data-cursor="Label"] elements.
   Also drives the "magnetic" pull on [data-magnetic] elements.
   Mouse/trackpad only; touch devices and reduced motion keep the native cursor. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const el = dot.current;
    if (!fine || prefersReducedMotion() || !el) return;

    document.documentElement.classList.add("has-cursor");
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    let state = "";

    const setState = (next: string, text = "") => {
      if (next === state) return;
      state = next;
      el.dataset.state = next;
      if (label.current) label.current.textContent = text;
    };

    let last: { x: number; y: number } | null = null;

    const update = (target: Element | null) => {
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) return setState("label", labelled.dataset.cursor);
      if (target?.closest("input, textarea, select")) return setState("text");
      if (target?.closest("a, button, label, [role=button]")) return setState("link");
      setState("");
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = { x: e.clientX, y: e.clientY };
      xTo(e.clientX);
      yTo(e.clientY);
      el.style.opacity = "1";
      update(e.target as Element | null);
    };
    // Content moves under a still pointer while scrolling: re-check what's beneath it
    const onScroll = () => { if (last) update(document.elementFromPoint(last.x, last.y)); };
    const onLeave = () => { el.style.opacity = "0"; };
    const onDown = () => el.classList.add("is-down");
    const onUp = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    // Magnetic elements lean toward the pointer while hovered
    const magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const cleanups = magnets.map((m) => {
      const strength = Number(m.dataset.magnetic) || 0.3;
      const mx = gsap.quickTo(m, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const my = gsap.quickTo(m, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const move = (e: PointerEvent) => {
        const r = m.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * strength);
        my((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => { mx(0); my(0); };
      m.addEventListener("pointermove", move);
      m.addEventListener("pointerleave", leave);
      return () => { m.removeEventListener("pointermove", move); m.removeEventListener("pointerleave", leave); gsap.set(m, { x: 0, y: 0 }); };
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cleanups.forEach((c) => c());
      setState("");
      document.documentElement.classList.remove("has-cursor");
    };
  }, [pathname]);

  return (
    <div ref={dot} className="cursor" aria-hidden>
      <span ref={label} className="cursor-label" />
    </div>
  );
}
