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
}

const NOW: NowSection[] = [
  {
    tag: "01 / Building",
    heading: "Building.",
    body: [
      "Two projects running in parallel — which is always one too many, but here we are. Alloy, a B2B fintech platform for business credit lines, is deep in the product identity phase. Thinking in CAC curves and silent explainer scripts, not features.",
      "Repomind is an autonomous code-review agent that reads pull requests the way a senior engineer would — from codebase history, not just the diff. It shouldn't exist yet, but it does.",
    ],
  },
  {
    tag: "02 / Learning",
    heading: "Learning.",
    body: [
      "Computer networking — properly. Not the conceptual layer-by-layer overview, but the part where packets actually move and why latency behaves the way it does. Doing this alongside my B.Tech CSE at SRM.",
      "Also deep in typesetting. The more you read about type, the more you can't un-see bad kerning in the wild. It's a curse with good side effects.",
    ],
  },
  {
    tag: "03 / Thinking about",
    heading: "Thinking about.",
    body: [
      "Whether premium software has to be expensive to feel premium, or whether that's just a habit of the industry. The answer is probably no, but nobody acts like it.",
      "The gap between what an interface communicates and what a user experiences. Most UI problems are communication problems. The pixel work is the last 10%.",
    ],
  },
  {
    tag: "04 / Reading",
    heading: "Reading.",
    body: [
      "The Design of Everyday Things — for the third time, and still finding new edges. Also halfway through Zero to One, which is either deeply obvious or quietly radical depending on the day.",
    ],
  },
  {
    tag: "05 / Outside all of this",
    heading: "Outside all of this.",
    body: [
      "Running the corporate relations arm of 4ZE Racing, SRM's Formula Student EV team. Mostly emails, some strategy, occasional calls with people who take motorsport very seriously.",
      "Trying to spend more time away from screens before midnight. Failing consistently. Getting better at failing gracefully.",
    ],
  },
];

const UPDATED = "April 2025 — Chennai";

const FOCUS_DATA = [
  { label: "Building", pct: 40, color: "#6FC07A" },
  { label: "Learning", pct: 25, color: "#4E7C58" },
  { label: "Thinking", pct: 15, color: "#3A6648" },
  { label: "Reading", pct: 10, color: "#2D5239" },
  { label: "Other",    pct: 10, color: "#1F3F2C" },
];

const STACK: string[] = [
  "Next.js", "TypeScript", "Python", "Figma",
  "Vercel", "Supabase", "Framer Motion", "Tailwind",
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

  return <span className="sidebar-clock-time">{time}</span>;
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
    <div className="focus-ring-wrap">
      <svg viewBox="0 0 180 180" className="focus-ring-svg">
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
        <text x="90" y="84" textAnchor="middle" className="focus-ring-center-pct">
          {hovered !== null ? `${FOCUS_DATA[hovered].pct}%` : "Focus"}
        </text>
        <text x="90" y="102" textAnchor="middle" className="focus-ring-center-label">
          {hovered !== null ? FOCUS_DATA[hovered].label : "Allocation"}
        </text>
      </svg>

      <div className="focus-ring-legend">
        {FOCUS_DATA.map((d, i) => (
          <div
            key={d.label}
            className={`focus-legend-item ${hovered === i ? "active" : ""}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="focus-legend-dot" style={{ background: d.color }} />
            <span className="focus-legend-label">{d.label}</span>
            <span className="focus-legend-pct">{d.pct}%</span>
          </div>
        ))}
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
    <div className="reveal" style={{ transitionDelay: `${60 + index * 50}ms` }}>
      <div className={`acc-section ${open ? "acc-open" : ""}`}>
        <button className="acc-header" onClick={() => setOpen(!open)} type="button">
          <div className="acc-header-left">
            <span className="acc-tag">{section.tag}</span>
            <h2 className="acc-heading">{section.heading}</h2>
          </div>
          <span className="acc-toggle">{open ? "−" : "+"}</span>
        </button>

        {/* CSS grid row animation: 0fr → 1fr */}
        <div className="acc-panel">
          <div className="acc-panel-inner">
            <div className="acc-body-inner">
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
      <div className="now-layout">
        {/* ════ MAIN CONTENT ════ */}
        <div className="now-main">
          {/* Header */}
          <div className="now-header reveal">
            <p className="page-eyebrow">Now</p>
            <h1 className="now-headline">What I&apos;m focused on.</h1>
            <p className="now-updated">{UPDATED}</p>
          </div>

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

          {/* Accordion */}
          <div className="now-acc">
            {NOW.map((s, i) => (
              <AccordionSection key={s.tag} section={s} index={i} />
            ))}
          </div>

          {/* Footer */}
          <p className="now-footer reveal" style={{ transitionDelay: "400ms" }}>
            A /now page is a snapshot, not a statement. Things change fast.
          </p>
        </div>

        {/* ════ RIGHT SIDEBAR (pinned to right edge) ════ */}
        <aside className="now-sidebar">
          <div className="sidebar-card reveal" style={{ transitionDelay: "100ms" }}>
            <div className="sidebar-status-row">
              <span className="sidebar-status-dot" />
              <span className="sidebar-status-text">Online · Building</span>
            </div>
          </div>

          <div className="sidebar-card reveal" style={{ transitionDelay: "160ms" }}>
            <span className="sidebar-card-label">Local Time — Chennai</span>
            <LiveClock />
          </div>

          <div className="sidebar-card sidebar-card-focus reveal" style={{ transitionDelay: "220ms" }}>
            <span className="sidebar-card-label">Focus Allocation</span>
            <FocusRing />
          </div>

          <div className="sidebar-card reveal" style={{ transitionDelay: "280ms" }}>
            <span className="sidebar-card-label">Current Stack</span>
            <div className="sidebar-stack">
              {STACK.map((s) => (
                <span key={s} className="sidebar-stack-chip">{s}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
