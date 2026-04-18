"use client";
import { useRef, useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

interface CraftItem {
  domain: string;
  title: string;
  body: string;
  from: string;
  num: string;
}

const CRAFTS: CraftItem[] = [
  {
    domain: "Frontend",
    num: "01",
    title: "Scroll Cinematics",
    body: "Building Paridhan's hero taught me how to orchestrate GSAP timelines with canvas — when to use requestAnimationFrame vs ScrollTrigger, and when to let silence do the work.",
    from: "Paridhan",
  },
  {
    domain: "Systems",
    num: "02",
    title: "Network Thinking",
    body: "Designing IoT probe sniffing in promiscuous mode reframes how I architect any system — always at the protocol level first, then the application layer.",
    from: "IoT Detector",
  },
  {
    domain: "Product",
    num: "03",
    title: "B2B Framing",
    body: "ALLOY pushed me to think in customer acquisition cost, not features. The Apple-style silent video came from understanding that restraint sells harder than noise.",
    from: "ALLOY",
  },
  {
    domain: "Creative",
    num: "04",
    title: "Concept Direction",
    body: "Every project gets a visual identity before it gets a codebase. I design the emotional experience first — then reverse-engineer the stack to deliver it precisely.",
    from: "All projects",
  },
];

interface StatItem {
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: "8+", label: "Projects shipped" },
  { value: "4",  label: "Domains of work" },
  { value: "2+", label: "Years building" },
];

const TOOLS = [
  { name: "React / Next.js", level: 95 },
  { name: "TypeScript",      level: 90 },
  { name: "Design Systems",  level: 85 },
  { name: "GSAP / Motion",   level: 80 },
  { name: "Node / Python",   level: 75 },
  { name: "Figma",           level: 85 },
];

const EDU = [
  { label: "Currently studying", val: "B.Tech CSE — Networking", sub: "SRM University · 2022–2026" },
  { label: "Active in",          val: "Competitive Programming",   sub: "Hackathons, algorithm contests" },
  { label: "Certifications",     val: "NPTEL — 8-week course",     sub: "Ongoing" },
];

/* ═══════════════════════════════════════════════
   ANIMATED BAR
   ═══════════════════════════════════════════════ */
function SkillBar({ name, level }: { name: string; level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(level);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [level]);

  return (
    <div className="skill-bar-wrap" ref={ref}>
      <div className="skill-bar-header">
        <span className="skill-bar-name">{name}</span>
        <span className="skill-bar-pct">{level}%</span>
      </div>
      <div className="skill-bar-track">
        <div 
          className="skill-bar-fill" 
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CRAFT CARD (hover animations)
   ═══════════════════════════════════════════════ */
function CraftCard({ item, index }: { item: CraftItem; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="reveal"
      style={{ transitionDelay: `${100 + index * 60}ms` }}
    >
      <article
        className={`craft-card-v2 ${hovered ? "craft-hovered" : ""}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="craft-card-top">
          <span className="craft-card-num">{item.num}</span>
          <span className="craft-card-domain">{item.domain}</span>
        </div>

        <h3 className="craft-card-title">{item.title}</h3>
        <p className="craft-card-body">{item.body}</p>

        <div className="craft-card-footer">
          <span className="craft-card-from">From → {item.from}</span>
          <span className="craft-card-arrow">↗</span>
        </div>
      </article>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════ */
export default function CraftPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  return (
    <main ref={ref} className="page-wrap">
      {/* ── Hero header ── */}
      <div className="craft-hero reveal">
        <p className="page-eyebrow">What I&apos;ve built into</p>
        <h1 className="craft-headline">
          Craft <span className="craft-amp">&amp;</span> <span className="acc">Growth</span>
        </h1>
        <p className="craft-sub">
          Skills shown through the work that grew them — not bars or percentages.
          Every capability here was forged by shipping real products.
        </p>
      </div>

      {/* ── Stat strip ── */}
      <div className="craft-stats reveal" style={{ transitionDelay: "80ms" }}>
        {STATS.map((s) => (
          <div key={s.label} className="craft-stat">
            <span className="craft-stat-val">{s.value}</span>
            <span className="craft-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Craft cards ── */}
      <section className="craft-cards-section">
        <span className="craft-section-label reveal" style={{ transitionDelay: "90ms" }}>
          Disciplines
        </span>
        <div className="craft-cards-grid">
          {CRAFTS.map((c, i) => (
            <CraftCard key={c.domain} item={c} index={i} />
          ))}
        </div>
      </section>

      {/* ── Proficiency ── */}
      <section className="craft-prof reveal" style={{ transitionDelay: "300ms" }}>
        <span className="craft-section-label">Proficiency</span>
        <div className="craft-prof-grid">
          <div className="craft-prof-bars">
            {TOOLS.map((t) => (
              <SkillBar key={t.name} name={t.name} level={t.level} />
            ))}
          </div>
          <div className="craft-prof-note">
            <p className="craft-prof-note-text">
              These aren&apos;t self-assessed vanity metrics. Each percentage reflects
              depth of usage across shipped projects — from prototyping to production.
            </p>
            <p className="craft-prof-note-text">
              The gaps are intentional. They&apos;re where the next project takes me.
            </p>
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="craft-edu reveal" style={{ transitionDelay: "380ms" }}>
        <span className="craft-section-label">Background</span>
        <div className="craft-edu-grid">
          {EDU.map((item) => (
            <div key={item.label} className="craft-edu-item">
              <span className="craft-edu-tag">{item.label}</span>
              <span className="craft-edu-val">{item.val}</span>
              <span className="craft-edu-sub">{item.sub}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
