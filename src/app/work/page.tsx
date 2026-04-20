"use client";
import { useRef } from "react";
import ProjectRow, { type Project } from "@/components/ProjectRow";
import Marquee from "@/components/Marquee";
import { useReveal } from "@/hooks/useReveal";

const PROJECTS: Project[] = [
  {
    num: "01", name: "PAYMENT SYSTEM", year: "2024",
    tags: ["Next.js", "System Design", "Database", "Real Users"],
    description: "Internal payment coordination system designed for a real business. Handles request creation, approval flow, and execution tracking across stakeholders.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "TypeScript"],
  },
  {
    num: "02", name: "ALLOY", year: "2024",
    tags: ["Fintech", "B2B", "Product"],
    description: "B2B fintech platform for business credit line efficiency. Apple-style silent video script, full product identity and landing page. Thinking in CAC, not features.",
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Stripe"],
  },
  {
    num: "03", name: "CREDMATCH", year: "2024",
    tags: ["AI", "Fintech", "Data", "Hackathon"],
    description: "AI system that analyzes spending patterns to recommend the most optimal credit card. Built to maximize rewards and reduce inefficiencies in everyday spending.",
    stack: ["Python", "FastAPI", "OpenAI", "React"],
  },
  {
    num: "04", name: "ASTROLOGY AI", year: "2024",
    tags: ["Python", "AI", "APIs", "Product"],
    description: "AI-powered astrology assistant generating personalized insights using birth data and planetary calculations. Designed as a scalable subscription product.",
    stack: ["Python", "FastAPI", "OpenAI", "Stripe"],
  },
  {
    num: "05", name: "REPOMIND", year: "2024",
    tags: ["AI Agent", "Dev Tools"],
    description: "Autonomous code review agent on Codex. Analyses pull requests, flags issues, suggests refactors from codebase history. Next.js + FastAPI stack.",
    stack: ["Next.js", "FastAPI", "OpenAI Codex", "GitHub API"],
  },
  {
    num: "06", name: "FARMHUB", year: "2023",
    tags: ["Marketplace", "P2P"],
    description: "Peer-to-peer crop price marketplace connecting farmers directly with buyers. Real-time price discovery, location-based matching, zero middlemen.",
    stack: ["React", "Node.js", "MongoDB", "Socket.io"],
  },
  {
    num: "07", name: "IOT DETECTOR", year: "2023",
    tags: ["IoT", "Networking"],
    description: "WiFi probe sniffing system on NodeMCU ESP-12E in promiscuous mode. Detects nearby phones without any app. LED and buzzer real-time alerts.",
    stack: ["C++", "Arduino", "NodeMCU", "WiFi 802.11"],
  },
  {
    num: "08", name: "4ZE RACING", year: "2023—",
    tags: ["Formula EV", "Strategy"],
    description: "Corporate Representative for SRM's Formula Student EV team. Sponsorship acquisition, brand partnerships, external communications for the racing programme.",
    stack: ["Strategy", "Partnerships", "Brand Direction"],
  },
];


export default function WorkPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  return (
    <main ref={ref} className="page-wrap">
      {/* ── Hero ── */}
      <div className="work-hero reveal">
        <p className="page-eyebrow">Selected work</p>
        <h1 className="work-headline">
          Projects that <span className="acc">shipped.</span>
        </h1>
        <p className="work-sub">
          Real products, real users, real constraints. Every project here was taken
          from concept to production — click any row to dig deeper.
        </p>
      </div>

      {/* ── Project count strip ── */}
      <div className="work-count reveal" style={{ transitionDelay: "60ms" }}>
        <div className="work-count-item">
          <span className="work-count-val">{PROJECTS.length}</span>
          <span className="work-count-label">Projects</span>
        </div>
        <div className="work-count-item">
          <span className="work-count-val">{new Set(PROJECTS.flatMap(p => p.tags)).size}+</span>
          <span className="work-count-label">Disciplines</span>
        </div>
        <div className="work-count-item">
          <span className="work-count-val">2+</span>
          <span className="work-count-label">Years</span>
        </div>
      </div>

      {/* ── Projects ── */}
      <div className="work-projects">
        <span className="work-section-label reveal" style={{ transitionDelay: "70ms" }}>
          All projects
        </span>
        {PROJECTS.map((p, i) => (
          <ProjectRow key={p.num} p={p} delay={90 + i * 55} />
        ))}
      </div>

      {/* ── Tech marquee ── */}
      <Marquee />

      <p className="work-footnote reveal" style={{ transitionDelay: "500ms" }}>
        More in pipeline —
      </p>
    </main>
  );
}
