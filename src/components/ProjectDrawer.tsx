"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/data/projects";
import ProjectInteractive from "./ProjectInteractive";

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDrawer({ project, onClose }: Props) {
  const isOpen = project !== null;
  const panel = useRef<HTMLElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const [portalReady, setPortalReady] = useState(false);
  useEffect(() => setPortalReady(true), []);

  // ESC to close + keep Tab focus inside the panel while open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Closed drawer stays in the DOM for the slide animation — keep it out of tab order
  useEffect(() => {
    panel.current?.toggleAttribute("inert", !isOpen);
  }, [isOpen, portalReady]);

  // Lock scroll, move focus in, and restore it to the opener on close
  useEffect(() => {
    if (isOpen) {
      opener.current = document.activeElement;
      document.body.style.overflow = "hidden";
      closeBtn.current?.focus({ preventScroll: true });
      panel.current?.scrollTo({ top: 0 });
    } else {
      document.body.style.overflow = "";
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, project]);

  if (!portalReady) return null;

  // Portalled to <body> so it layers above the fixed nav instead of inside the page's stacking context.
  return createPortal(
    <>
      <div className={`drawer-backdrop ${isOpen ? "is-open" : ""}`} onClick={onClose} aria-hidden />

      <aside
        ref={panel}
        className={`drawer ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-hidden={!isOpen}
      >
        {project && (
          <>
            <div className="drawer-header">
              <span className="drawer-num">{project.num} · {project.year}</span>
              <button ref={closeBtn} className="icon-btn" onClick={onClose} aria-label="Close project" type="button">✕</button>
            </div>

            <h2 id="drawer-title" className="drawer-title">{project.name.toLowerCase()}</h2>

            {project.role && (
              <p className="drawer-role"><span className="pulse-dot" />{project.role}</p>
            )}

            <div className="chips">
              {project.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>

            <p className="drawer-desc">{project.description}</p>

            {project.highlights && project.highlights.length > 0 && (
              <section className="drawer-section">
                <p className="eyebrow">Key highlights</p>
                <ul className="drawer-highlights">
                  {project.highlights.map((h) => <li key={h}>{h}</li>)}
                </ul>
              </section>
            )}

            {project.interactive && (
              <section className="drawer-section">
                <ProjectInteractive config={project.interactive} />
              </section>
            )}

            <section className="drawer-section">
              <p className="eyebrow">Tech stack</p>
              <div className="chips">
                {project.stack.map((s) => <span key={s} className="chip chip-solid">{s}</span>)}
              </div>
            </section>

            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                View project ↗
              </a>
            )}
          </>
        )}
      </aside>
    </>,
    document.body
  );
}
