"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger, emitPageEnter, getLenis, prefersReducedMotion, registerNavigate, scrollToTarget } from "@/lib/motion";
import { routeLabel } from "@/lib/site";

/* Full-screen curtain between routes:
   click → curtain rises and covers → route changes underneath → curtain lifts away. */
export default function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pending = useRef<{ path: string; hash: string } | null>(null);
  const busy = useRef(false);
  const fallback = useRef<ReturnType<typeof setTimeout>>();

  const lift = (hash: string) => {
    const el = root.current;
    if (!el) return;
    clearTimeout(fallback.current);
    // New page is in the DOM: reset scroll under the cover, then reveal it.
    getLenis()?.start();
    scrollToTarget(0, true);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      if (hash) scrollToTarget(hash, true);
      emitPageEnter();
      gsap.timeline({
        onComplete: () => {
          gsap.set(el, { yPercent: 100, visibility: "hidden" });
          busy.current = false;
        },
      })
        .to(label.current, { yPercent: -110, duration: 0.45, ease: "power3.in" })
        .to(el, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.15");
    });
  };

  // Expose navigate() to links
  useEffect(() => {
    gsap.set(root.current, { yPercent: 100 });
    registerNavigate((href, customLabel) => {
      const url = new URL(href, window.location.href);
      const path = url.pathname;
      const hash = url.hash;

      if (path === window.location.pathname) {
        if (hash) scrollToTarget(hash);
        else scrollToTarget(0);
        return;
      }
      if (busy.current) return;
      if (prefersReducedMotion() || !root.current) {
        router.push(path + url.search + hash);
        return;
      }

      busy.current = true;
      pending.current = { path, hash };
      getLenis()?.stop();
      if (label.current) label.current.textContent = customLabel ?? routeLabel(path);

      gsap.timeline({
        onComplete: () => {
          router.push(path + url.search, { scroll: false });
          // Safety net: never leave the site covered if the route is slow or fails.
          fallback.current = setTimeout(() => { pending.current = null; lift(hash); }, 4000);
        },
      })
        .set(root.current, { visibility: "visible", yPercent: 100 })
        .set(label.current, { yPercent: 110 })
        .to(root.current, { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
        .to(label.current, { yPercent: 0, duration: 0.5, ease: "power3.out" }, "-=0.25");
    });
    return () => registerNavigate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Route committed → lift the curtain. Other route changes (back/forward) skip the
  // curtain but still need fresh triggers and page-enter animations.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      requestAnimationFrame(() => emitPageEnter());
      return;
    }
    const p = pending.current;
    if (p) {
      // (paths can differ when a redirect lands elsewhere — lift regardless)
      pending.current = null;
      lift(p.hash);
    } else if (!busy.current) {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        emitPageEnter();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div ref={root} className="curtain" aria-hidden>
      <span className="curtain-label-wrap">
        <span ref={label} className="curtain-label" />
      </span>
    </div>
  );
}
