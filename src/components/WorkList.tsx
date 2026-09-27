"use client";
import { useCallback, useState } from "react";
import ProjectDrawer from "./ProjectDrawer";
import TiltCard from "./TiltCard";
import type { Project } from "@/data/projects";

export default function WorkList({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <>
      <section className="work-grid" aria-label="Projects">
        {projects.map((p, i) => (
          <TiltCard key={p.num} className="reveal" style={{ transitionDelay: `${(i % 2) * 60}ms` }} max={4}>
            <button
              type="button"
              className="work-card"
              onClick={() => setSelected(p)}
              aria-haspopup="dialog"
              aria-expanded={selected?.num === p.num}
            >
              <span className="work-card-top">
                <span className="work-card-num">{p.num}</span>
                <span className="work-card-year">{p.year}</span>
              </span>
              <span className="work-card-name">{p.name.toLowerCase()}</span>
              {p.role && <span className="work-card-role">{p.role}</span>}
              <span className="work-card-desc">{p.description}</span>
              <span className="chips">
                {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </span>
              <span className="work-card-cta">Case study <span aria-hidden>→</span></span>
            </button>
          </TiltCard>
        ))}
      </section>

      <ProjectDrawer project={selected} onClose={close} />
    </>
  );
}
