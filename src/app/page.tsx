import Image from "next/image";
import TLink from "@/components/TLink";
import WorkReel from "@/components/WorkReel";
import { PROJECTS } from "@/data/projects";
import { CATEGORIES, formatDate, getPostMetas } from "@/lib/journal";
import portrait from "../../public/pics/portrait.png";

export default function Home() {
  const featured = PROJECTS.filter((p) => p.featured);
  const latest = getPostMetas().slice(0, 3);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-top" data-reveal>
          <p>Builder &amp; creative technologist</p>
          <p>Chennai, India</p>
          <p className="hero-status"><span className="dot" aria-hidden />Open to internships &amp; collaborations</p>
        </div>

        <h1 className="hero-name" data-parallax="0.25">
          <span data-split>Vidit Dang</span>
        </h1>

        <div className="hero-bottom">
          <p className="hero-intro" data-split data-delay="0.15">
            I design and build products — fintech tools, AI agents and the odd piece of hardware.
            Studying computer science at SRM, handling partnerships at 4ZE Racing.
          </p>
          <span className="hero-scroll" data-reveal aria-hidden>Scroll ↓</span>
        </div>
      </section>

      <WorkReel projects={featured} />

      {/* ── About teaser ── */}
      <section className="section grid">
        <div className="col-portrait" data-reveal>
          <Image src={portrait} alt="ASCII portrait of Vidit Dang" className="portrait" placeholder="blur" sizes="(max-width: 900px) 60vw, 28vw" />
        </div>
        <div className="col-text">
          <p className="lede" data-split>
            I like the part of a project where engineering, product and design overlap — working out what
            should exist, then building it properly.
          </p>
          <p className="body" data-reveal>
            Most of what I make starts with a real problem someone has: a family business that needed to track
            payments, a racing team that needed sponsors, people using the wrong credit card. I care about how
            things feel to use as much as how they work.
          </p>
          <TLink href="/about" className="link" data-reveal>More about me</TLink>
        </div>
      </section>

      {/* ── Journal ── */}
      {latest.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="h-section" data-split>Journal</h2>
            <TLink href="/journal" className="link" data-reveal>All entries</TLink>
          </div>
          <ul className="rows">
            {latest.map((p) => (
              <li key={p.slug} data-reveal>
                <TLink href={`/journal/${p.slug}`} className="row">
                  <span className="row-date tabular">{formatDate(p.date, "short")}</span>
                  <span className="row-title">{p.title}</span>
                  <span className="row-meta">{CATEGORIES[p.category].label}</span>
                  <span className="row-arrow" aria-hidden>→</span>
                </TLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
