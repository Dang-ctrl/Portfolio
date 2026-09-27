import type { Metadata } from "next";
import JournalList from "@/components/JournalList";
import { CATEGORIES, getPostMetas } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Achievements, events, milestones and notes — a running log of what I've been up to.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const posts = getPostMetas();
  const counts = Object.fromEntries(
    Object.keys(CATEGORIES).map((c) => [c, posts.filter((p) => p.category === c).length])
  );

  return (
    <main className="page container">
      <header className="page-hero reveal">
        <p className="eyebrow">Journal</p>
        <h1 className="h1">The <em>log</em> — wins, events &amp; everything in between.</h1>
        <p className="lead">
          Hackathons, competitions, talks I went to, things I shipped and the lessons that came with them.
          Written as it happens.
        </p>
      </header>

      <div className="stat-row reveal">
        <div className="stat"><span className="stat-val">{posts.length}</span><span className="stat-label">Entries</span></div>
        {Object.entries(CATEGORIES).map(([key, c]) => (
          <div className="stat" key={key}>
            <span className="stat-val">{counts[key]}</span>
            <span className="stat-label">{c.plural}</span>
          </div>
        ))}
      </div>

      <JournalList posts={posts} />
    </main>
  );
}
