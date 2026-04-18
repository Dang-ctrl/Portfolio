"use client";
import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";
import { fireWipeOut } from "@/components/PageWipe";
import { useRouter } from "next/navigation";
import Marquee from "@/components/Marquee";

function HeroLink({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const go = async () => { await fireWipeOut(); router.push(href); };
  return (
    <button onClick={go} className="hero-cta">{label} ↗</button>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  return (
    <section ref={ref} className="hero-section">

      {/* ── STATS TICKER ─────────────────── */}
      <div className="hero-stats-bar reveal">
        <span className="hero-stat">8+ <span className="hero-stat-lbl">Projects shipped</span></span>
        <span className="hero-stat-sep">—</span>
        <span className="hero-stat">2+ <span className="hero-stat-lbl">Years building</span></span>
        <span className="hero-stat-sep">—</span>
        <span className="hero-stat">4 <span className="hero-stat-lbl">Domains</span></span>
        <span className="hero-stat-sep">→</span>
        <span className="hero-stat-tags">Tech&nbsp;·&nbsp;Design&nbsp;·&nbsp;Racing&nbsp;·&nbsp;Finance</span>
      </div>

      {/* ── MASSIVE HEADLINE ─────────────── */}
      <div className="hero-headline-wrap">
        <p className="hero-headline-line reveal">
          <span className="hl-filled">I BUILD</span>
        </p>
        <p className="hero-headline-line reveal" style={{ transitionDelay: "60ms" }}>
          <span className="hl-outline">THINGS</span>
          <span className="hl-filled"> THAT</span>
        </p>
        <p className="hero-headline-line reveal" style={{ transitionDelay: "120ms" }}>
          <span className="hl-accent">MATTER</span>
        </p>
      </div>

      {/* ── TWO CARDS ROW ────────────────── */}
      <div className="hero-cards reveal" style={{ transitionDelay: "200ms" }}>
        {/* LEFT — About */}
        <div className="hero-card">
          <div className="hero-card-inner">
            <p className="hero-card-label">About</p>
            <p className="hero-card-body">
              Builder and creative technologist. I care not just about how a site looks, but how it
              performs, scales, and feels — from fintech to formula EV to cinematic web.
            </p>
            <HeroLink href="/work" label="View work" />
          </div>
        </div>

        {/* RIGHT — Currently */}
        <div className="hero-card">
          <div className="hero-card-inner">
            <p className="hero-card-label">Currently</p>
            <p className="hero-card-body">
              B.Tech CSE — Computer Networking at SRM University.
              Corporate Rep at 4ZE Racing Formula Student EV team.
              Open to collaborations.
            </p>
            <HeroLink href="/thinking" label="How I think" />
          </div>
        </div>
      </div>

      {/* ── SKILLS MARQUEE ───────────────── */}
      <Marquee />

      {/* ── APPROACH TEASER ─────────────── */}
      <div className="hero-approach reveal" style={{ transitionDelay: "300ms" }}>
        <div>
          <p className="hero-approach-eyebrow">Strategy</p>
          <p className="hero-approach-heading">How I approach every project?</p>
        </div>
        <HeroLink href="/craft" label="View craft" />
      </div>

    </section>
  );
}
