"use client";
import { useState } from "react";

export interface Project {
  num: string; name: string; year: string;
  tags: string[]; description: string; stack: string[]; link?: string;
}

export default function ProjectRow({ p, delay = 0 }: { p: Project; delay?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="proj-row reveal-left"
        style={{ transitionDelay: `${delay}ms` }}
        onClick={() => setOpen((o) => !o)}>
        <span className="proj-num">{p.num}</span>
        <span className="proj-name">{p.name}</span>
        <div className="proj-tags">{p.tags.map((t) => <span key={t} className="proj-tag">{t}</span>)}</div>
        <span className="proj-year">{p.year}</span>
      </div>
      <div className={`proj-detail${open ? " open" : ""}`}>
        <div className="proj-detail-inner">
          <p className="proj-desc">{p.description}</p>
          <div className="proj-stack">{p.stack.map((s) => <span key={s} className="proj-stack-tag">{s}</span>)}</div>
          {p.link && (
            <a href={p.link} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ display:"inline-block", marginTop:10, fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--acc-hi)", textDecoration:"none" }}>
              Visit ↗
            </a>
          )}
        </div>
      </div>
    </>
  );
}
