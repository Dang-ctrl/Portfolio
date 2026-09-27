import Link from "next/link";
import Stage from "@/components/three/Stage";
import TiltCard from "@/components/TiltCard";
import JournalCard from "@/components/JournalCard";
import { getPostMetas } from "@/lib/journal";
import { SITE } from "@/lib/site";

const CARDS = [
  { href: "/work",     label: "Work",     desc: "Projects that shipped — fintech, AI, IoT, creative dev." },
  { href: "/craft",    label: "Craft",    desc: "The skills, and the projects that grew them." },
  { href: "/thinking", label: "Thinking", desc: "Books, people and ideas that rewired how I build." },
  { href: "/journal",  label: "Journal",  desc: "Achievements, events and notes along the way." },
  { href: "/now",      label: "Now",      desc: "What I'm building, learning and obsessing over." },
  { href: "/about",    label: "About",    desc: "The full picture — and how to reach me." },
];

export default function Home() {
  const latest = getPostMetas().slice(0, 3);

  return (
    <main className="home">
      {/* ── Hero ── */}
      <section className="hero container">
        <div className="hero-copy">
          <p className="hero-kicker reveal">
            <span className="pulse-dot" /> Open to internships &amp; collabs · {SITE.location}
          </p>
          <h1 className="hero-title reveal">
            Vidit <em>Dang</em>
          </h1>
          <p className="hero-lead reveal">
            I build products and systems with intent — the kind that quietly work better.
            Engineering, product and design, from fintech platforms to AI tools.
          </p>
          <div className="hero-actions reveal">
            <Link href="/work" className="btn btn-primary">View work <span aria-hidden>→</span></Link>
            <Link href="/journal" className="btn btn-ghost">Read the journal</Link>
          </div>
          <dl className="hero-stats reveal">
            <div><dt>Projects shipped</dt><dd>8+</dd></div>
            <div><dt>Years building</dt><dd>2+</dd></div>
            <div><dt>Domains</dt><dd>Tech · Design · Racing · Finance</dd></div>
          </dl>
        </div>
        <Stage scene="hero" className="hero-stage" label="Interactive 3D sculpture that follows your cursor" />
      </section>

      {/* ── Explore ── */}
      <section className="section container">
        <div className="section-head reveal">
          <p className="eyebrow">Explore</p>
          <h2 className="h2">Where would you like to go?</h2>
        </div>
        <div className="explore-grid">
          {CARDS.map((c, i) => (
            <TiltCard key={c.href} className="reveal" style={{ transitionDelay: `${i * 50}ms` }}>
              <Link href={c.href} className="explore-card">
                <span className="explore-num">0{i + 1}</span>
                <span className="explore-label">{c.label}</span>
                <span className="explore-desc">{c.desc}</span>
                <span className="explore-arrow" aria-hidden>↗</span>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── Latest from the journal ── */}
      {latest.length > 0 && (
        <section className="section container">
          <div className="section-head section-head--row reveal">
            <div>
              <p className="eyebrow">Journal</p>
              <h2 className="h2">Latest <em>updates</em></h2>
            </div>
            <Link href="/journal" className="link-accent">All entries →</Link>
          </div>
          <div className="journal-grid">
            {latest.map((p, i) => <JournalCard key={p.slug} post={p} delay={i * 60} />)}
          </div>
        </section>
      )}
    </main>
  );
}
