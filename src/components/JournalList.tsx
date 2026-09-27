"use client";
import { useMemo, useState } from "react";
import JournalCard from "./JournalCard";
import { CATEGORIES, type Category, type PostMeta } from "@/lib/journal-shared";

type Filter = Category | "all";

export default function JournalList({ posts }: { posts: PostMeta[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const available = (Object.keys(CATEGORIES) as Category[]).filter((c) => posts.some((p) => p.category === c));
  const visible = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  const byYear = useMemo(() => {
    const map = new Map<string, PostMeta[]>();
    for (const p of visible) {
      const y = p.date.slice(0, 4);
      map.set(y, [...(map.get(y) ?? []), p]);
    }
    return Array.from(map.entries());
  }, [visible]);

  if (posts.length === 0) {
    return <p className="empty-state">Nothing here yet — first entry coming soon.</p>;
  }

  return (
    <section className="journal-list">
      <div className="filters" role="group" aria-label="Filter entries">
        {(["all", ...available] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            className="chip chip-btn"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : CATEGORIES[f].plural}
          </button>
        ))}
      </div>

      {byYear.map(([year, items]) => (
        <div key={`${filter}-${year}`} className="journal-year">
          <h2 className="journal-year-label">{year}</h2>
          <div className="journal-grid">
            {items.map((p, i) => <JournalCard key={p.slug} post={p} delay={i * 50} />)}
          </div>
        </div>
      ))}
    </section>
  );
}
