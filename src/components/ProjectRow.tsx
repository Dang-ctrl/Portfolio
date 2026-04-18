"use client";
import { useState } from "react";

export interface Project {
  num: string; name: string; year: string;
  tags: string[]; description: string; stack: string[]; link?: string;
}

export default function ProjectRow({ p, delay = 0 }: { p: Project; delay?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      <div className={`proj-card ${open ? "proj-open" : ""}`}>
        {/* ── Clickable header row ── */}
        <button
          className="proj-header"
          onClick={() => setOpen((o) => !o)}
          type="button"
        >
          <div className="proj-header-left">
            <span className="proj-num">{p.num}</span>
            <div className="proj-header-info">
              <span className="proj-name">{p.name}</span>
              <div className="proj-tags">
                {p.tags.map((t) => (
                  <span key={t} className="proj-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="proj-header-right">
            <span className="proj-year">{p.year}</span>
            <span className="proj-toggle">{open ? "−" : "+"}</span>
          </div>
        </button>

        {/* ── Expandable detail panel (CSS grid animation) ── */}
        <div className="proj-panel">
          <div className="proj-panel-inner">
            <div className="proj-detail-content">
              <p className="proj-desc">{p.description}</p>
              <div className="proj-meta-row">
                <div className="proj-stack">
                  {p.stack.map((s) => (
                    <span key={s} className="proj-stack-chip">{s}</span>
                  ))}
                </div>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="proj-link"
                  >
                    Visit ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
