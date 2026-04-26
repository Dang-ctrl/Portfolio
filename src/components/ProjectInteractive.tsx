"use client";
import { useRef, useEffect, useState } from "react";
import type { ProjectInteractive as InteractiveConfig } from "./ProjectRow";

/* ─────────────────────────────────────────────
   Per-project interactive widget rendered inside
   the project drawer. Each type maps to a unique
   micro-visualization.
   ───────────────────────────────────────────── */

interface Props {
  config: InteractiveConfig;
}

/* ── Flow: animated pipeline stages ── */
function FlowViz({ data }: { data: Record<string, unknown> }) {
  const stages = (data.stages as string[]) || [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % stages.length), 1800);
    return () => clearInterval(id);
  }, [stages.length]);

  return (
    <div className="ix-flow">
      {stages.map((s, i) => (
        <div key={s} className="ix-flow-stage-wrap">
          <div className={`ix-flow-stage ${i === active ? "ix-flow-active" : ""} ${i < active ? "ix-flow-done" : ""}`}>
            <span className="ix-flow-dot" />
            <span className="ix-flow-label">{s}</span>
          </div>
          {i < stages.length - 1 && (
            <div className={`ix-flow-connector ${i < active ? "ix-flow-connector-done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Metrics: animated counting numbers ── */
function MetricsViz({ data }: { data: Record<string, unknown> }) {
  const items = (data.items as { label: string; value: number; suffix?: string }[]) || [];

  return (
    <div className="ix-metrics">
      {items.map((m) => (
        <MetricCounter key={m.label} label={m.label} target={m.value} suffix={m.suffix || ""} />
      ))}
    </div>
  );
}

function MetricCounter({ label, target, suffix }: { label: string; target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return (
    <div className="ix-metric-item" ref={ref}>
      <span className="ix-metric-val">{val}{suffix}</span>
      <span className="ix-metric-label">{label}</span>
    </div>
  );
}

/* ── Orbit: rotating tech constellation ── */
function OrbitViz({ data }: { data: Record<string, unknown> }) {
  const items = (data.items as string[]) || [];
  const center = (data.center as string) || "Core";

  return (
    <div className="ix-orbit">
      <div className="ix-orbit-center">{center}</div>
      <div className="ix-orbit-ring ix-orbit-ring-1" />
      <div className="ix-orbit-ring ix-orbit-ring-2" />
      {items.map((item, i) => {
        const angle = (360 / items.length) * i;
        return (
          <div
            key={item}
            className="ix-orbit-node"
            style={{
              "--orbit-angle": `${angle}deg`,
              "--orbit-delay": `${i * 0.3}s`,
            } as React.CSSProperties}
          >
            <span>{item}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Signal: pulsing detection waves ── */
function SignalViz({ data }: { data: Record<string, unknown> }) {
  const signals = (data.signals as number) || 5;
  const label = (data.label as string) || "Detecting";

  return (
    <div className="ix-signal">
      <div className="ix-signal-source">
        <div className="ix-signal-core" />
        {Array.from({ length: signals }).map((_, i) => (
          <div
            key={i}
            className="ix-signal-wave"
            style={{ "--wave-delay": `${i * 0.4}s` } as React.CSSProperties}
          />
        ))}
      </div>
      <span className="ix-signal-label">{label}</span>
      <div className="ix-signal-log">
        <SignalLog />
      </div>
    </div>
  );
}

function SignalLog() {
  const [logs, setLogs] = useState<string[]>([]);
  const macs = ["4A:3B:2C", "8F:1E:7D", "C2:5A:9B", "3D:6E:F0", "A1:B2:C3"];

  useEffect(() => {
    const id = setInterval(() => {
      const mac = macs[Math.floor(Math.random() * macs.length)];
      const rssi = -Math.floor(Math.random() * 40 + 30);
      setLogs((prev) => [`Device ${mac} · ${rssi}dBm`, ...prev].slice(0, 4));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {logs.map((l, i) => (
        <div key={`${l}-${i}`} className="ix-signal-log-line" style={{ opacity: 1 - i * 0.2 }}>
          {l}
        </div>
      ))}
    </>
  );
}

/* ── Graph: interactive node network ── */
function GraphViz({ data }: { data: Record<string, unknown> }) {
  const nodes = (data.nodes as { id: string; label: string; x: number; y: number }[]) || [];
  const edges = (data.edges as [string, string][]) || [];
  const [hovered, setHovered] = useState<string | null>(null);

  const getNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="ix-graph">
      <svg viewBox="0 0 200 140" className="ix-graph-svg">
        {edges.map(([a, b], i) => {
          const na = getNode(a);
          const nb = getNode(b);
          if (!na || !nb) return null;
          const isLit = hovered === a || hovered === b;
          return (
            <line
              key={i}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              className={`ix-graph-edge ${isLit ? "ix-graph-edge-lit" : ""}`}
            />
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            className="ix-graph-node-g"
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={hovered === n.id ? 7 : 5}
              className={`ix-graph-node ${hovered === n.id ? "ix-graph-node-hover" : ""}`}
            />
            <text
              x={n.x}
              y={n.y + 16}
              className="ix-graph-label"
              textAnchor="middle"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Radar: skill/attribute spider chart ── */
function RadarViz({ data }: { data: Record<string, unknown> }) {
  const axes = (data.axes as { label: string; value: number }[]) || [];
  const n = axes.length;
  const cx = 100, cy = 100, r = 70;

  const getPoint = (i: number, val: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + r * val * Math.cos(angle),
      y: cy + r * val * Math.sin(angle),
    };
  };

  const polygonPoints = axes.map((a, i) => {
    const p = getPoint(i, a.value);
    return `${p.x},${p.y}`;
  }).join(" ");

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="ix-radar">
      <svg viewBox="0 0 200 200" className="ix-radar-svg">
        {/* Grid */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={axes.map((_, i) => {
              const p = getPoint(i, level);
              return `${p.x},${p.y}`;
            }).join(" ")}
            className="ix-radar-grid"
          />
        ))}
        {/* Axes */}
        {axes.map((_, i) => {
          const p = getPoint(i, 1);
          return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} className="ix-radar-axis" />;
        })}
        {/* Data polygon */}
        <polygon points={polygonPoints} className="ix-radar-fill" />
        <polygon points={polygonPoints} className="ix-radar-stroke" />
        {/* Data points */}
        {axes.map((a, i) => {
          const p = getPoint(i, a.value);
          return <circle key={i} cx={p.x} cy={p.y} r="3" className="ix-radar-dot" />;
        })}
        {/* Labels */}
        {axes.map((a, i) => {
          const p = getPoint(i, 1.22);
          return (
            <text key={i} x={p.x} y={p.y} className="ix-radar-label" textAnchor="middle" dominantBaseline="middle">
              {a.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Main switch ── */
export default function ProjectInteractive({ config }: Props) {
  return (
    <div className="ix-wrapper">
      <span className="ix-title">{config.label}</span>
      {config.type === "flow" && <FlowViz data={config.data} />}
      {config.type === "metrics" && <MetricsViz data={config.data} />}
      {config.type === "orbit" && <OrbitViz data={config.data} />}
      {config.type === "signal" && <SignalViz data={config.data} />}
      {config.type === "graph" && <GraphViz data={config.data} />}
      {config.type === "radar" && <RadarViz data={config.data} />}
    </div>
  );
}
