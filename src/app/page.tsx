"use client";
import { useRef } from "react";
import { useReveal }  from "@/hooks/useReveal";
import NavCards       from "@/components/NavCards";

export default function Home() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  return (
    <main ref={ref} style={{ paddingTop: 52 }}>
      {/* ── Centered Hero ─────────────────────── */}
      <section className="hero-center">
        <p className="hero-greeting reveal">Hello, this is</p>

        <h1 className="hero-title reveal" style={{ transitionDelay: "60ms" }}>
          Vidit Dang
        </h1>

        <p className="hero-subtitle reveal" style={{ transitionDelay: "120ms" }}>
          Products and systems, built with intent.
          <br />
          The kind that quietly work better.
        </p>

        <span className="hero-dot reveal" style={{ transitionDelay: "180ms" }} aria-hidden />
      </section>

      {/* ── Navigation Cards ──────────────────── */}
      <p className="landing-section-label reveal" style={{ transitionDelay: "240ms" }}>
        Where would you like to go?
      </p>
      <NavCards />

      {/* ── Footer Bar ────────────────────────── */}
      <footer className="landing-footer-bar">
        <div className="landing-footer-left">
          <a href="mailto:vidit@email.com" className="landing-footer-link">
            Contact ↗
          </a>
          <span className="landing-footer-sep">·</span>
          <span className="landing-footer-link" style={{ cursor: "default", color: "var(--dim)" }}>
            This Portfolio
          </span>
        </div>
        <div className="landing-footer-right">
          <a
            href="https://github.com/Dang-ctrl"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-footer-social"
          >
            GitHub ↗
          </a>
          <a
            href="https://linkedin.com/in/vidit"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-footer-social"
          >
            LinkedIn ↗
          </a>
        </div>
      </footer>
    </main>
  );
}
