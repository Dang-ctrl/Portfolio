"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Adds `.visible` to every `.reveal` element as it scrolls into view.
   Lives once in the layout so pages can stay server components. */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = new WeakSet<Element>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    const scan = () => {
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (reduce) el.classList.add("visible");
        else io.observe(el);
      });
    };

    scan();
    // Pick up elements that mount later (drawers, filtered lists, client islands).
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);

  return null;
}
