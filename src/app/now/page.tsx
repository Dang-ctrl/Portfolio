"use client";
import { useRef, useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";

/* ═══════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════ */

interface NowSection {
  heading: string;
  body: string[];
  tag: string;
  icon: string;
}

const NOW: NowSection[] = [
  {
    tag: "01 / Building",
    heading: "Building.",
    icon: "⚡",
    body: [
      "Two projects running in parallel — which is always one too many, but here we are. Alloy, a B2B fintech platform for business credit lines, is deep in the product identity phase. Thinking in CAC curves and silent explainer scripts, not features.",
      "Repomind is an autonomous code-review agent that reads pull requests the way a senior engineer would — from codebase history, not just the diff. It shouldn't exist yet, but it does.",
    ],
  },
  {
    tag: "02 / Learning",
    heading: "Learning.",
    icon: "📚",
    body: [
      "Systems — networking, backend flows, and how things behave under load.",
      "Product — why things work, where they fail, and what actually delivers value.",
      "AI — not just models, but how they fit into real workflows.",
      "Design — type, spacing, and the small decisions that change how something feels.",
      "Trying to understand how all of it connects — not as separate skills, but as one system.",
    ],
  },
  {
    tag: "03 / Thinking about",
    heading: "Thinking about.",
    icon: "💭",
    body: [
      "Why most 'premium' products rely on pricing, not design.",
      "How much of a product is just communication — the system works, but the user never feels it.",
      "Where complexity hides, and why simple interfaces often mask complicated decisions underneath.",
      "What makes something feel obvious — and why most things don't.",
    ],
  },
  {
    tag: "04 / Reading",
    heading: "Reading.",
    icon: "📖",
    body: [
      "The Design of Everyday Things — still relevant, still mostly ignored.",
      "Zero to One — either obvious or uncomfortable, depending on the page.",
    ],
  },
  {
    tag: "05 / Outside the code",
    heading: "Outside the code.",
    icon: "🌍",
    body: [
      "Some work with 4ZE Racing — conversations, partnerships, and seeing how things move outside code.",
      "Trying to spend less time on screens late at night. Not going well.",
      "Thinking more about what to build next than what to consume.",
    ],
  },
];

const UPDATED = "April 2025";
const LOCATION = "Chennai";

const FOCUS_DATA = [
  { label: "Building", pct: 40, color: "#6FC07A" },
  { label: "Learning", pct: 25, color: "#4E7C58" },
  { label: "Thinking", pct: 15, color: "#3A6648" },
  { label: "Reading", pct: 10, color: "#2D5239" },
  { label: "Other", pct: 10, color: "#1F3F2C" },
];

const STACK: string[] = [
  "Next.js", "TypeScript", "Python", "Figma",
  "Vercel", "Supabase", "Framer Motion", "Tailwind",
];

const MILESTONES = [
  { date: "Apr '25", text: "Shipped Alloy MVP — first B2B pilot", active: true },
  { date: "Mar '25", text: "Repomind hit 1K autonomous reviews", active: false },
  { date: "Feb '25", text: "Won CredMatch hackathon (fintech track)", active: false },
  { date: "Jan '25", text: "Started semester 4 — systems + product focus", active: false },
];

const HABITS = [
  { label: "Code daily", streak: 23, unit: "day streak" },
  { label: "Read 30 min", streak: 12, unit: "day streak" },
  { label: "Ship weekly", streak: 6, unit: "weeks" },
];

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════ */
function AnimatedCounter({ target, duration = 1600 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

/* ═══════════════════════════════════════════════
   LIVE CLOCK
   ═══════════════════════════════════════════════ */
function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit", minute: "2-digit", second: "2-digit",
          hour12: false, timeZone: "Asia/Kolkata",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="now-clock-time">{time}</span>;
}

/* ═══════════════════════════════════════════════
   FOCUS RING (interactive SVG)
   ═══════════════════════════════════════════════ */
function FocusRing() {
  const [hovered, setHovered] = useState<number | null>(null);
  const radius = 70;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const arcs = FOCUS_DATA.map((d, i) => {
    const dashLen = (d.pct / 100) * circumference;
    const gap = circumference - dashLen;
    const offset = -((cumulative / 100) * circumference) + circumference * 0.25;
    cumulative += d.pct;
    return { ...d, dashLen, gap, offset, index: i };
  });

  return (
    <div className="now-focus-wrap">
      <svg viewBox="0 0 180 180" className="now-focus-svg">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--bdr)" strokeWidth={stroke} opacity="0.3" />
        {arcs.map((a) => (
          <circle
            key={a.label}
            cx="90" cy="90" r={radius}
            fill="none" stroke={a.color}
            strokeWidth={hovered === a.index ? stroke + 4 : stroke}
            strokeDasharray={`${a.dashLen} ${a.gap}`}
            strokeDashoffset={a.offset}
            strokeLinecap="butt"
            style={{
              transition: "stroke-width 0.25s, opacity 0.25s",
              opacity: hovered !== null && hovered !== a.index ? 0.3 : 1,
              cursor: "pointer",
            }}
            onMouseEnter={() => setHovered(a.index)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        <text x="90" y="84" textAnchor="middle" className="now-focus-center-pct">
          {hovered !== null ? `${FOCUS_DATA[hovered].pct}%` : "Focus"}
        </text>
        <text x="90" y="102" textAnchor="middle" className="now-focus-center-label">
          {hovered !== null ? FOCUS_DATA[hovered].label : "Allocation"}
        </text>
      </svg>

      <div className="now-focus-legend">
        {FOCUS_DATA.map((d, i) => (
          <div
            key={d.label}
            className={`now-legend-item ${hovered === i ? "active" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="now-legend-dot" style={{ background: d.color }} />
            <span className="now-legend-label">{d.label}</span>
            <span className="now-legend-pct">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SEMESTER PROGRESS BAR
   ═══════════════════════════════════════════════ */
function SemProgress() {
  const [width, setWidth] = useState(0);
  const pct = 56; // 84 / 150 days ≈ 56%

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="now-sem-progress">
      <div className="now-sem-track">
        <div className="now-sem-fill" style={{ width: `${width}%` }} />
        <span className="now-sem-marker" style={{ left: `${width}%` }} />
      </div>
      <div className="now-sem-labels">
        <span>Sem start</span>
        <span>Day 84 / 150</span>
        <span>Finals</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ACCORDION (with CSS grid animation)
   ═══════════════════════════════════════════════ */
function AccordionSection({ section, index }: { section: NowSection; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="reveal" style={{ transitionDelay: `${40 + index * 30}ms` }}>
      <div className={`now-acc-section ${open ? "now-acc-open" : ""}`}>
        <button className="now-acc-header" onClick={() => setOpen(!open)} type="button">
          <div className="now-acc-header-left">
            <span className="now-acc-icon">{section.icon}</span>
            <div className="now-acc-header-text">
              <span className="now-acc-tag">{section.tag}</span>
              <h2 className="now-acc-heading">{section.heading}</h2>
            </div>
          </div>
          <span className="now-acc-toggle">{open ? "−" : "+"}</span>
        </button>

        {/* CSS grid row animation: 0fr → 1fr */}
        <div className="now-acc-panel">
          <div className="now-acc-panel-inner">
            <div className="now-acc-body-inner">
              {section.body.map((p, j) => (
                <p key={j} className="now-para">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════ */
export default function NowPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  return (
    <main ref={ref} className="page-wrap">
      {/* ── Hero ── */}
      <div className="now-hero reveal">
        <p className="page-eyebrow">Now</p>
        <h1 className="now-headline">Right now,<br /><span className="acc">this is everything.</span></h1>
        <p className="now-sub">
          A living snapshot of what I&apos;m building, learning, and obsessing over.
          Updated monthly — not a résumé, but a pulse.
        </p>
        <div className="now-meta-row">
          <span className="now-meta-chip">
            <span className="now-status-dot" />
            Online · Building
          </span>
          <span className="now-meta-chip now-meta-location">
            📍 {LOCATION}
          </span>
          <span className="now-meta-chip now-meta-updated">
            Updated {UPDATED}
          </span>
        </div>
      </div>

      {/* ── Layout: main + sidebar ── */}
      <div className="now-layout">
        {/* ═══ MAIN CONTENT ═══ */}
        <div className="now-main">
          {/* Dashboard */}
          <div className="now-dash reveal" style={{ transitionDelay: "40ms" }}>
            <div className="now-dash-item">
              <span className="now-dash-val"><AnimatedCounter target={2} /></span>
              <span className="now-dash-label">Active Projects</span>
            </div>
            <div className="now-dash-item">
              <span className="now-dash-val"><AnimatedCounter target={7} /></span>
              <span className="now-dash-label">Books This Year</span>
            </div>
            <div className="now-dash-item">
              <span className="now-dash-val"><AnimatedCounter target={84} /></span>
              <span className="now-dash-label">Days Into Sem</span>
            </div>
            <div className="now-dash-item">
              <span className="now-dash-val"><AnimatedCounter target={32} /><small> avg</small></span>
              <span className="now-dash-label">Commits / Week</span>
            </div>
          </div>

          {/* Semester progress */}
          <div className="now-sem-wrap reveal" style={{ transitionDelay: "50ms" }}>
            <span className="now-section-label">Semester progress</span>
            <SemProgress />
          </div>

          {/* Accordion */}
          <div className="now-accordion-wrap">
            {NOW.map((s, i) => (
              <AccordionSection key={s.tag} section={s} index={i} />
            ))}
          </div>

          {/* Timeline */}
          <div className="now-timeline-section reveal" style={{ transitionDelay: "80ms" }}>
            <span className="now-section-label">Recent milestones</span>
            <div className="now-timeline">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`now-tl-item ${m.active ? "now-tl-active" : ""}`}>
                  <div className="now-tl-dot-col">
                    <span className={`now-tl-dot ${m.active ? "now-tl-dot-pulse" : ""}`} />
                    {i < MILESTONES.length - 1 && <span className="now-tl-line" />}
                  </div>
                  <div className="now-tl-content">
                    <span className="now-tl-date">{m.date}</span>
                    <p className="now-tl-text">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="now-footer reveal" style={{ transitionDelay: "100ms" }}>
            A /now page is a snapshot, not a statement. Things change fast. —
          </p>
        </div>

        {/* ═══ RIGHT SIDEBAR ═══ */}
        <aside className="now-sidebar">
          {/* Live clock */}
          <div className="now-sb-card reveal" style={{ transitionDelay: "40ms" }}>
            <span className="now-sb-label">Local Time — {LOCATION}</span>
            <LiveClock />
          </div>

          {/* Focus ring */}
          <div className="now-sb-card now-sb-card-focus reveal" style={{ transitionDelay: "80ms" }}>
            <span className="now-sb-label">Focus allocation</span>
            <FocusRing />
          </div>

          {/* Habits */}
          <div className="now-sb-card reveal" style={{ transitionDelay: "120ms" }}>
            <span className="now-sb-label">Active streaks</span>
            <div className="now-habits">
              {HABITS.map((h) => (
                <div key={h.label} className="now-habit-row">
                  <span className="now-habit-label">{h.label}</span>
                  <div className="now-habit-right">
                    <span className="now-habit-val">{h.streak}</span>
                    <span className="now-habit-unit">{h.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="now-sb-card reveal" style={{ transitionDelay: "160ms" }}>
            <span className="now-sb-label">Current stack</span>
            <div className="now-stack">
              {STACK.map((s) => (
                <span key={s} className="now-stack-chip">{s}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
