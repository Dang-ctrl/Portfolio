"use client";
import { useEffect, useRef } from "react";
import TLink from "./TLink";
import { gsap, ScrollTrigger, onPageEnter, prefersReducedMotion } from "@/lib/motion";
import type { Project } from "@/data/projects";

/* Selected work as a horizontal reel. On desktop the section pins and vertical
   scrolling drives the track sideways; cards turn in 3D as they pass centre.
   On touch / small screens it's a native swipeable row with snap points. */
export default function WorkReel({ projects }: { projects: Project[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const total = String(projects.length).padStart(2, "0");

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const setup = () => {
      ctx?.revert();
      if (prefersReducedMotion() || !section.current || !track.current) return;

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 900px) and (pointer: fine)", () => {
          const t = track.current!;
          section.current!.classList.add("is-pinned");
          const cards = gsap.utils.toArray<HTMLElement>(".reel-card", t);
          const distance = () => t.scrollWidth - window.innerWidth;

          const slide = gsap.to(t, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const i = Math.min(projects.length - 1, Math.round(self.progress * (cards.length - 1)));
                if (counter.current) counter.current.textContent = String(i + 1).padStart(2, "0");
                if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
              },
            },
          });

          // Each card swings through a shallow 3D arc as it crosses the viewport
          cards.forEach((card) => {
            const inner = card.querySelector(".reel-card-inner");
            gsap.set(inner, { rotateY: -22, z: -120 });
            gsap.to(inner, {
              keyframes: { rotateY: [-22, 0, 22], z: [-120, 0, -120] },
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: slide,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            });
          });

          return () => section.current?.classList.remove("is-pinned");
        });
      }, section);
      ScrollTrigger.refresh();
    };

    const off = onPageEnter(setup);
    return () => { off(); ctx?.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section ref={section} className="reel" aria-label="Selected work">
      <div className="reel-head">
        <h2 className="h-section" data-split>Selected work</h2>
        <div className="reel-meta" data-reveal>
          <span className="tabular"><span ref={counter}>01</span> / {total}</span>
          <TLink href="/work" className="link">All projects</TLink>
        </div>
      </div>

      <div className="reel-viewport">
        <div ref={track} className="reel-track">
          {projects.map((p, i) => (
            <TLink key={p.slug} href={`/work/${p.slug}`} curtainLabel={p.name} className="reel-card" data-tone={i % 5}>
              <div className="reel-card-inner">
                <div className="reel-card-art" aria-hidden>
                  <span className="reel-card-glyph">{p.name}</span>
                  <span className="reel-card-no">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="reel-card-info">
                  <h3 className="reel-card-name">{p.name}</h3>
                  <p className="reel-card-summary">{p.summary}</p>
                  <p className="reel-card-role">{p.role} · {p.year}</p>
                </div>
              </div>
            </TLink>
          ))}
          <TLink href="/work" className="reel-card reel-card--end">
            <div className="reel-card-inner">
              <span className="reel-end-text">See all projects →</span>
            </div>
          </TLink>
        </div>
      </div>

      <div className="reel-progress" aria-hidden><span ref={bar} /></div>
    </section>
  );
}
