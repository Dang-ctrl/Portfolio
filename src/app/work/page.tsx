"use client";
import { useRef, useState, useCallback } from "react";
import ProjectRow, { type Project } from "@/components/ProjectRow";
import ProjectDrawer from "@/components/ProjectDrawer";
import Marquee from "@/components/Marquee";
import { useReveal } from "@/hooks/useReveal";

const PROJECTS: Project[] = [
  {
    num: "01", name: "PAYMENT SYSTEM", year: "2024",
    tags: ["Next.js", "System Design", "Database", "Real Users"],
    role: "Full-Stack Engineer",
    description: "Built an internal payment coordination system for a real business — not a demo. Multi-stakeholder approval flows, execution tracking, and audit trails. The kind of software where a bug means someone doesn't get paid.",
    highlights: ["Multi-role approval pipeline", "Real-time status tracking", "Audit-grade transaction logs"],
    stack: ["Next.js", "PostgreSQL", "Prisma", "TypeScript"],
    interactive: {
      type: "flow",
      label: "Approval Pipeline",
      data: { stages: ["Request", "Review", "Approve", "Execute", "Settle"] },
    },
  },
  {
    num: "02", name: "ALLOY", year: "2024",
    tags: ["Fintech", "B2B", "Product"],
    role: "Product & Brand Lead",
    description: "A B2B credit line platform where I owned product identity end-to-end. Wrote the Apple-style launch video script, designed the landing page, and built the positioning around CAC reduction — not feature lists. Fintech thinking, not fintech theatre.",
    highlights: ["Full brand identity system", "Launch video script + storyboard", "CAC-first product positioning"],
    stack: ["Next.js", "FastAPI", "PostgreSQL", "Stripe"],
    interactive: {
      type: "metrics",
      label: "Product Metrics",
      data: {
        items: [
          { label: "Credit efficiency", value: 94, suffix: "%" },
          { label: "Processing time", value: 2, suffix: "s" },
          { label: "Cost reduction", value: 40, suffix: "%" },
        ],
      },
    },
  },
  {
    num: "03", name: "CREDMATCH", year: "2024",
    tags: ["AI", "Fintech", "Data", "Hackathon"],
    role: "AI Engineer",
    description: "Hackathon-born AI that reads your spending patterns and tells you which credit card you should actually be using. Not a comparison tool — a recommendation engine that calculates lost rewards and surfaces smarter alternatives.",
    highlights: ["Spending pattern analysis via AI", "Reward optimization engine", "Real-time card matching"],
    stack: ["Python", "FastAPI", "OpenAI", "React"],
    interactive: {
      type: "radar",
      label: "Analysis Dimensions",
      data: {
        axes: [
          { label: "Travel", value: 0.85 },
          { label: "Dining", value: 0.7 },
          { label: "Shopping", value: 0.6 },
          { label: "Gas", value: 0.45 },
          { label: "Groceries", value: 0.9 },
          { label: "Streaming", value: 0.55 },
        ],
      },
    },
  },
  {
    num: "04", name: "ASTROLOGY AI", year: "2024",
    tags: ["Python", "AI", "APIs", "Product"],
    role: "Backend & Product",
    description: "An AI astrology assistant that generates personalized birth-chart insights using planetary ephemeris data. Designed for subscription monetization — think Headspace for horoscopes, but with real computational astrology under the hood.",
    highlights: ["Planetary position calculations", "GPT-powered interpretation layer", "Subscription-ready architecture"],
    stack: ["Python", "FastAPI", "OpenAI", "Stripe"],
    interactive: {
      type: "orbit",
      label: "Planetary System",
      data: {
        center: "☉",
        items: ["☿", "♀", "☽", "♂", "♃", "♄"],
      },
    },
  },
  {
    num: "05", name: "REPOMIND", year: "2024",
    tags: ["AI Agent", "Dev Tools"],
    role: "AI Agent Developer",
    description: "Autonomous code review agent that lives inside your CI pipeline. It reads your PRs against codebase history, flags anti-patterns, suggests refactors, and learns your team's style over time. Code review on autopilot.",
    highlights: ["Codebase-aware context analysis", "PR diff interpretation", "Style-learning feedback loop"],
    stack: ["Next.js", "FastAPI", "OpenAI Codex", "GitHub API"],
    interactive: {
      type: "graph",
      label: "Agent Architecture",
      data: {
        nodes: [
          { id: "pr", label: "PR", x: 30, y: 70 },
          { id: "ctx", label: "Context", x: 100, y: 30 },
          { id: "ai", label: "AI", x: 100, y: 110 },
          { id: "review", label: "Review", x: 170, y: 70 },
        ],
        edges: [["pr", "ctx"], ["pr", "ai"], ["ctx", "ai"], ["ai", "review"], ["ctx", "review"]],
      },
    },
  },
  {
    num: "06", name: "FARMHUB", year: "2023",
    tags: ["Marketplace", "P2P"],
    role: "Full-Stack Developer",
    description: "A peer-to-peer crop marketplace that lets farmers set their own prices and connect directly with buyers. Real-time price discovery, location-based matching, zero middlemen. Built to collapse the supply chain.",
    highlights: ["Real-time bidding with WebSockets", "Geolocation-based matching", "Direct farmer-buyer connection"],
    stack: ["React", "Node.js", "MongoDB", "Socket.io"],
    interactive: {
      type: "metrics",
      label: "Platform Impact",
      data: {
        items: [
          { label: "Middlemen eliminated", value: 100, suffix: "%" },
          { label: "Price transparency", value: 3, suffix: "x" },
          { label: "Match radius", value: 50, suffix: "km" },
        ],
      },
    },
  },
  {
    num: "07", name: "IOT DETECTOR", year: "2023",
    tags: ["IoT", "Networking"],
    role: "Hardware + Firmware Engineer",
    description: "WiFi probe-sniffing system built on NodeMCU ESP-12E running in promiscuous mode. It passively detects nearby phones without any app or pairing — just by listening to the air. LED and buzzer alerts in real-time. Raw networking at the silicon level.",
    highlights: ["802.11 promiscuous mode", "Passive device detection", "Hardware alert system"],
    stack: ["C++", "Arduino", "NodeMCU", "WiFi 802.11"],
    interactive: {
      type: "signal",
      label: "Live Detection Feed",
      data: { signals: 5, label: "Scanning 802.11 probes..." },
    },
  },
  {
    num: "08", name: "4ZE RACING", year: "2023—",
    tags: ["Formula EV", "Strategy"],
    role: "Corporate Representative",
    description: "The business side of a Formula Student EV racing programme. I handled sponsorship acquisition, brand partnerships, and external communications — translating engineering capability into corporate language that opens doors and closes deals.",
    highlights: ["Sponsorship pipeline management", "Brand partnership strategy", "External communications"],
    stack: ["Strategy", "Partnerships", "Brand Direction"],
    interactive: {
      type: "radar",
      label: "Competency Map",
      data: {
        axes: [
          { label: "Strategy", value: 0.95 },
          { label: "Comms", value: 0.9 },
          { label: "Brand", value: 0.85 },
          { label: "Deals", value: 0.8 },
          { label: "Network", value: 0.75 },
        ],
      },
    },
  },
];

export default function WorkPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);
  const [selected, setSelected] = useState<Project | null>(null);

  const handleSelect = useCallback((p: Project) => {
    setSelected((prev) => (prev?.num === p.num ? null : p));
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <>
      <main ref={ref} className="page-wrap">
        {/* ── Hero ── */}
        <div className="work-hero reveal">
          <p className="page-eyebrow">Selected work</p>
          <h1 className="work-headline">
            Built, <span className="acc">shipped,</span><br />
            &amp; battle-tested.
          </h1>
          <p className="work-sub">
            Not mockups. Not side-projects left to rot. Every project here went from
            zero to production — with real users, real stakes, and real deadlines.
            Click any row to see the full story.
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
            <ProjectRow
              key={p.num}
              p={p}
              delay={50 + i * 30}
              isActive={selected?.num === p.num}
              onSelect={() => handleSelect(p)}
            />
          ))}
        </div>

        {/* ── Tech marquee ── */}
        <Marquee />

        <p className="work-footnote reveal" style={{ transitionDelay: "60ms" }}>
          More in pipeline —
        </p>
      </main>

      {/* ── Side Drawer (renders outside main, fixed position) ── */}
      <ProjectDrawer project={selected} onClose={handleClose} />
    </>
  );
}
