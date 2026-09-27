"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, onPageEnter, prefersReducedMotion } from "@/lib/motion";

/* Declarative scroll animations, set up each time a page enters:
   [data-split]           heading lines slide up out of a mask
   [data-reveal]          fade + rise
   [data-reveal="rule"]   hairline draws left → right
   [data-parallax="0.2"]  drifts up as its section scrolls away
   Pages stay server components; they only add attributes. */
export default function Reveals() {
  useEffect(() => {
    let ctx: gsap.Context | null = null;
    (window as unknown as { __motion?: boolean }).__motion = true;

    const setup = () => {
      ctx?.revert();
      const root = document.getElementById("main");
      if (!root) return;

      if (prefersReducedMotion()) {
        document.documentElement.classList.add("no-motion");
        return;
      }

      ctx = gsap.context(() => {
        root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { visibility: "visible" });
              return gsap.from(self.lines, {
                yPercent: 105,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.08,
                delay: Number(el.dataset.delay ?? 0),
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              });
            },
          });
        });

        const fades = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-reveal='rule'])", root);
        gsap.set(fades, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(fades, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.07, overwrite: true }),
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal='rule']", root).forEach((el) => {
          gsap.fromTo(el, { scaleX: 0 }, {
            scaleX: 1, duration: 1.2, ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]", root).forEach((el) => {
          const speed = Number(el.dataset.parallax) || 0.2;
          gsap.to(el, {
            yPercent: -speed * 100,
            ease: "none",
            scrollTrigger: { trigger: el.closest("section") ?? el, start: "top top", end: "bottom top", scrub: true },
          });
        });
      }, root);
    };

    const off = onPageEnter(() => {
      // Wait for web fonts so line splits are measured with the real typeface.
      document.fonts.ready.then(setup);
    });

    return () => { off(); ctx?.revert(); };
  }, []);

  return null;
}
