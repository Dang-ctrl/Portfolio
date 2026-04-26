"use client";

export interface ProjectInteractive {
  type: "flow" | "metrics" | "orbit" | "signal" | "graph" | "radar";
  label: string;
  data: Record<string, unknown>;
}

export interface Project {
  num: string; name: string; year: string;
  tags: string[]; description: string; stack: string[]; link?: string;
  role?: string;
  highlights?: string[];
  interactive?: ProjectInteractive;
}

interface Props {
  p: Project;
  delay?: number;
  isActive: boolean;
  onSelect: () => void;
}

export default function ProjectRow({ p, delay = 0, isActive, onSelect }: Props) {
  return (
    <div className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      <div className={`proj-card ${isActive ? "proj-active" : ""}`}>
        <button className="proj-header" onClick={onSelect} type="button">
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
            {/* Arrow indicator */}
            <span className="proj-arrow" aria-hidden>
              {isActive ? "×" : "↗"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
