import Image from "next/image";
import TLink from "@/components/TLink";
import WorkReel from "@/components/WorkReel";
import PixelShape from "@/components/PixelShape";
import RoundBadge from "@/components/RoundBadge";
import CategoryMark from "@/components/CategoryMark";
import { PROJECTS } from "@/data/projects";
import { CATEGORIES, formatDate, getPostMetas } from "@/lib/journal";
import portrait from "../../../public/pics/portrait.png";

export default function Home() {
  const featured = PROJECTS.filter((p) => p.featured);
  const latest = getPostMetas().slice(0, 3);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero">
        <span className="crop crop--tl" aria-hidden />
        <span className="crop crop--tr" aria-hidden />
        <span className="crop crop--bl" aria-hidden />
        <span className="crop crop--br" aria-hidden />
        <div className="hero-top" data-reveal>
          <p>Builder &amp; creative technologist</p>
          <p>Chennai, India</p>
          <p className="hero-status"><span className="dot" aria-hidden />Open to internships &amp; collaborations</p>
        </div>

        <h1 className="hero-name" data-parallax="0.25">
          <span data-split>Vidit Dang</span>
          <PixelShape name="sparkle" className="hero-spark" data-spin="2" />
        </h1>

        <div className="hero-bottom">
          <p className="hero-intro" data-reveal>
            I design and build products — fintech tools, AI agents and{" "}
            <span data-annotate="underline">the odd piece of hardware</span>.
            Studying computer science at SRM, handling partnerships at 4ZE Racing.
          </p>
          <span className="hero-scroll" data-reveal>
            <RoundBadge text="OPEN TO WORK · SCROLL · 2026 · " />
          </span>
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
            payments, a racing team that needed sponsors, people using the wrong credit card. I care about{" "}
            <span data-annotate="highlight">how things feel to use</span> as much as how they work.
          </p>
          <TLink href="/about" className="link" data-reveal data-magnetic="0.3">More about me</TLink>
        </div>
      </section>

      {/* ── Journal ── */}
      {latest.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="h-section head-with-mark"><PixelShape name="asterisk" className="head-mark" data-spin="1" /><span data-split>Journal</span></h2>
            <TLink href="/journal" className="link" data-reveal>All entries</TLink>
          </div>
          <ul className="rows">
            {latest.map((p) => (
              <li key={p.slug} data-reveal>
                <TLink href={`/journal/${p.slug}`} className="row">
                  <span className="row-date tabular">{formatDate(p.date, "short")}</span>
                  <span className="row-title">{p.title}</span>
                  <span className="row-meta"><CategoryMark category={p.category} />{CATEGORIES[p.category].label}</span>
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
