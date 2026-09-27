"use client";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

export function LiveClock({ className }: { className?: string }) {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: SITE.timezone,
    });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <time className={className ?? "clock"} suppressHydrationWarning>{time}</time>;
}

export function FocusRing({ data }: { data: { label: string; pct: number; weight: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const radius = 70;
  const stroke = 12;
  const circ = 2 * Math.PI * radius;

  let cumulative = 0;
  const arcs = data.map((d, i) => {
    const len = (d.pct / 100) * circ;
    const offset = -((cumulative / 100) * circ) + circ * 0.25;
    cumulative += d.pct;
    return { ...d, len, offset, i };
  });

  const active = hovered !== null ? data[hovered] : null;

  return (
    <div className="focus">
      <svg viewBox="0 0 180 180" className="focus-svg" role="img" aria-label="Focus allocation chart">
        <circle cx="90" cy="90" r={radius} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        {arcs.map((a) => (
          <circle
            key={a.label}
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="var(--acc)"
            strokeOpacity={hovered !== null && hovered !== a.i ? 0.12 : a.weight}
            strokeWidth={hovered === a.i ? stroke + 4 : stroke}
            strokeDasharray={`${Math.max(a.len - 2, 0)} ${circ - a.len + 2}`}
            strokeDashoffset={a.offset}
            className="focus-arc"
            onMouseEnter={() => setHovered(a.i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        <text x="90" y="88" textAnchor="middle" className="focus-center">{active ? `${active.pct}%` : "Focus"}</text>
        <text x="90" y="106" textAnchor="middle" className="focus-sub">{active ? active.label : "allocation"}</text>
      </svg>
      <ul className="focus-legend">
        {data.map((d, i) => (
          <li
            key={d.label}
            className={hovered === i ? "is-active" : ""}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="focus-swatch" style={{ opacity: d.weight }} />
            <span>{d.label}</span>
            <span className="mono-num">{d.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Computed on the client so the page never shows a stale day count from build time. */
export function SemesterProgress({ start, end }: { start: string; end: string }) {
  const [state, setState] = useState<{ day: number; total: number } | null>(null);

  useEffect(() => {
    const s = new Date(`${start}T00:00:00+05:30`).getTime();
    const e = new Date(`${end}T00:00:00+05:30`).getTime();
    const now = Date.now();
    if (now < s || now > e) return setState(null);
    const DAY = 86_400_000;
    setState({ day: Math.floor((now - s) / DAY) + 1, total: Math.round((e - s) / DAY) });
  }, [start, end]);

  if (!state) return null;
  const pct = Math.min(100, Math.round((state.day / state.total) * 100));

  return (
    <section className="card sem">
      <div className="sem-head">
        <span className="eyebrow">Semester progress</span>
        <span className="mono-num">Day {state.day} / {state.total}</span>
      </div>
      <div className="sem-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="sem-fill" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}
