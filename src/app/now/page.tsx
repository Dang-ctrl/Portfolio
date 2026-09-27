import type { Metadata } from "next";
import Link from "next/link";
import { FocusRing, LiveClock, SemesterProgress } from "@/components/NowWidgets";
import { FOCUS_DATA, HABITS, LOCATION, NOW, SEMESTER, STACK, UPDATED } from "@/data/now";
import { CATEGORIES, formatDate, getPostMetas } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Now",
  description: "A living snapshot of what I'm building, learning and obsessing over right now.",
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  const posts = getPostMetas();
  const recent = posts.slice(0, 5);

  return (
    <main className="page container">
      <header className="page-hero reveal">
        <p className="eyebrow">Now</p>
        <h1 className="h1">Right now, <em>this is everything.</em></h1>
        <p className="lead">
          A living snapshot of what I&apos;m building, learning and obsessing over.
          Not a résumé — a pulse.
        </p>
        <div className="chips">
          <span className="chip chip-live"><span className="pulse-dot" />Online · Building</span>
          <span className="chip">{LOCATION}</span>
          <span className="chip">Updated {UPDATED}</span>
        </div>
      </header>

      <div className="now-layout">
        <div className="now-main">
          <div className="stat-row reveal">
            <div className="stat"><span className="stat-val">2</span><span className="stat-label">Active projects</span></div>
            <div className="stat"><span className="stat-val">7</span><span className="stat-label">Books this year</span></div>
            <div className="stat"><span className="stat-val">~12</span><span className="stat-label">Commits / week</span></div>
            <div className="stat"><span className="stat-val">{posts.length}</span><span className="stat-label">Journal entries</span></div>
          </div>

          <SemesterProgress start={SEMESTER.start} end={SEMESTER.end} />

          <div className="now-list">
            {NOW.map((s, i) => (
              <details key={s.tag} className="now-item reveal" open={i === 0}>
                <summary>
                  <span className="mono-num">{s.tag}</span>
                  <span className="now-item-title">{s.heading}</span>
                  <span className="plus" aria-hidden />
                </summary>
                <div className="now-item-body">
                  {s.body.map((p, j) => <p key={j}>{p}</p>)}
                </div>
              </details>
            ))}
          </div>

          {recent.length > 0 && (
            <section className="section-sm reveal">
              <div className="section-head section-head--row">
                <p className="eyebrow">Recent milestones</p>
                <Link href="/journal" className="link-accent">Journal →</Link>
              </div>
              <ol className="timeline">
                {recent.map((p, i) => (
                  <li key={p.slug} className={i === 0 ? "is-latest" : ""}>
                    <span className="timeline-dot" aria-hidden />
                    <span className="timeline-date">{formatDate(p.date, "short")} · {CATEGORIES[p.category].label}</span>
                    <Link href={`/journal/${p.slug}`} className="timeline-text">{p.title}</Link>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="now-side">
          <div className="card side-card reveal">
            <span className="eyebrow">Local time — {LOCATION}</span>
            <LiveClock />
          </div>
          <div className="card side-card reveal">
            <span className="eyebrow">Focus allocation</span>
            <FocusRing data={FOCUS_DATA} />
          </div>
          <div className="card side-card reveal">
            <span className="eyebrow">Active streaks</span>
            <ul className="habits">
              {HABITS.map((h) => (
                <li key={h.label}>
                  <span>{h.label}</span>
                  <span><strong>{h.streak}</strong> <span className="body-3">{h.unit}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card side-card reveal">
            <span className="eyebrow">Current stack</span>
            <div className="chips">{STACK.map((s) => <span key={s} className="chip">{s}</span>)}</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
