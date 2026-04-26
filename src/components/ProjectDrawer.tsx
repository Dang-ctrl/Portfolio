"use client";
import { useEffect } from "react";
import { type Project } from "./ProjectRow";
import ProjectInteractive from "./ProjectInteractive";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDrawer({ project, onClose }: Props) {
  const isOpen = project !== null;

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? "drawer-backdrop-open" : ""}`}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer panel */}
      <aside className={`proj-drawer ${isOpen ? "proj-drawer-open" : ""}`} aria-label="Project detail">
        {project && (
          <>
            {/* Header */}
            <div className="drawer-header">
              <div className="drawer-header-left">
                <span className="drawer-num">{project.num}</span>
                <span className="drawer-year">{project.year}</span>
              </div>
              <button className="drawer-close" onClick={onClose} aria-label="Close panel" type="button">
                ×
              </button>
            </div>

            {/* Title */}
            <h2 className="drawer-title">{project.name}</h2>

            {/* Role badge */}
            {project.role && (
              <div className="drawer-role">
                <span className="drawer-role-dot" />
                {project.role}
              </div>
            )}

            {/* Tags */}
            <div className="drawer-tags">
              {project.tags.map((t) => (
                <span key={t} className="proj-tag">{t}</span>
              ))}
            </div>

            <div className="drawer-divider" />

            {/* Description */}
            <p className="drawer-desc">{project.description}</p>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <>
                <div className="drawer-divider" />
                <p className="drawer-section-label">Key Highlights</p>
                <ul className="drawer-highlights">
                  {project.highlights.map((h) => (
                    <li key={h} className="drawer-highlight-item">{h}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="drawer-divider" />

            {/* Interactive element */}
            {project.interactive && (
              <>
                <ProjectInteractive config={project.interactive} />
                <div className="drawer-divider" />
              </>
            )}

            {/* Stack */}
            <p className="drawer-section-label">Tech Stack</p>
            <div className="drawer-stack">
              {project.stack.map((s) => (
                <span key={s} className="proj-stack-chip">{s}</span>
              ))}
            </div>

            {/* Link */}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-link"
              >
                View Project ↗
              </a>
            )}
          </>
        )}
      </aside>
    </>
  );
}
