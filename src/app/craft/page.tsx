import type { Metadata } from "next";
import TiltCard from "@/components/TiltCard";

export const metadata: Metadata = {
  title: "Craft",
  description: "Skills shown through the projects that grew them — frontend motion, systems thinking, product framing, AI and creative direction.",
  alternates: { canonical: "/craft" },
};

const CRAFTS = [
  { num: "01", domain: "Frontend", title: "Scroll cinematics", from: "Paridhan",
    body: "Building Paridhan taught me how to design motion with intent — when to orchestrate timelines and when to let stillness carry the experience." },
  { num: "02", domain: "Systems", title: "Systems thinking", from: "Payment System",
    body: "Designing real-world systems like payment workflows and AI tools shaped how I think — structure first, edge cases next, interfaces last." },
  { num: "03", domain: "Product", title: "Product framing", from: "Alloy",
    body: "Working on fintech products pushed me to think beyond features — focusing on user behaviour, conversion, and how value is actually delivered." },
  { num: "04", domain: "AI", title: "Intelligent systems", from: "CredMatch · Astrology AI",
    body: "Building AI-driven systems taught me to design around uncertainty — balancing logic, data and user trust in every interaction." },
  { num: "05", domain: "Creative", title: "Concept direction", from: "All projects",
    body: "Every project starts as a concept — I define the feel, the narrative and the intent before a single line of code is written." },
];

const TOOLS = [
  { name: "Node / Python",   level: 82 },
  { name: "TypeScript",      level: 76 },
  { name: "React / Next.js", level: 75 },
  { name: "System design",   level: 72 },
  { name: "GSAP / Motion",   level: 68 },
  { name: "AI / APIs",       level: 68 },
  { name: "Figma",           level: 67 },
];

const EDU = [
  { label: "Studying",       val: "B.Tech CSE — Networking",                  sub: "SRM University · 2022–2026" },
  { label: "Active in",      val: "Competitive programming",                  sub: "Hackathons, algorithm contests" },
  { label: "Track record",   val: "Hackathon builder — AI & fintech systems", sub: "Built and shipped under real-world constraints" },
];

export default function CraftPage() {
  return (
    <main className="page container">
      <header className="page-hero reveal">
        <p className="eyebrow">What I&apos;ve built into</p>
        <h1 className="h1">Craft <em>&amp;</em> growth.</h1>
        <p className="lead">
          Skills shown through the work that grew them. Every capability here was forged by shipping real products.
        </p>
      </header>

      <div className="stat-row reveal">
        <div className="stat"><span className="stat-val">8+</span><span className="stat-label">Projects shipped</span></div>
        <div className="stat"><span className="stat-val">5</span><span className="stat-label">Domains of work</span></div>
        <div className="stat"><span className="stat-val">2+</span><span className="stat-label">Years building</span></div>
      </div>

      <section className="section">
        <div className="section-head reveal"><p className="eyebrow">Disciplines</p></div>
        <div className="craft-grid">
          {CRAFTS.map((c, i) => (
            <TiltCard key={c.num} className="reveal" style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
              <article className="card craft-card">
                <div className="craft-card-top">
                  <span className="mono-num">{c.num}</span>
                  <span className="chip">{c.domain}</span>
                </div>
                <h2 className="h3">{c.title}</h2>
                <p className="body-2">{c.body}</p>
                <p className="craft-card-from">From → {c.from}</p>
              </article>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="section split">
        <div className="reveal">
          <p className="eyebrow">Proficiency</p>
          <h2 className="h2">Depth, <em>honestly</em> measured.</h2>
          <p className="body-2">
            Not vanity metrics — each bar reflects how deeply I&apos;ve used the tool across shipped projects,
            from prototype to production. The gaps are intentional: they&apos;re where the next project takes me.
          </p>
        </div>
        <ul className="bars reveal" aria-label="Skill proficiency">
          {TOOLS.map((t) => (
            <li key={t.name} className="bar" style={{ "--w": `${t.level}%` } as React.CSSProperties}>
              <span className="bar-head"><span>{t.name}</span><span className="mono-num">{t.level}%</span></span>
              <span className="bar-track"><span className="bar-fill" /></span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="section-head reveal"><p className="eyebrow">Background</p></div>
        <div className="info-grid">
          {EDU.map((e, i) => (
            <div key={e.label} className="card info-card reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="eyebrow">{e.label}</span>
              <span className="info-val">{e.val}</span>
              <span className="body-3">{e.sub}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
