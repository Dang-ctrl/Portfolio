"use client";
import { useState } from "react";
import TLink from "./TLink";
import { CATEGORIES, formatDate, type Category, type PostMeta } from "@/lib/journal-shared";
import { ScrollTrigger } from "@/lib/motion";

type Filter = Category | "all";

export default function JournalIndex({ posts }: { posts: PostMeta[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const available = (Object.keys(CATEGORIES) as Category[]).filter((c) => posts.some((p) => p.category === c));
  const visible = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  const years = Array.from(new Set(visible.map((p) => p.date.slice(0, 4))));

  const choose = (f: Filter) => {
    setFilter(f);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  if (!posts.length) return <p className="body">Nothing here yet.</p>;

  return (
    <>
      {available.length > 1 && (
        <div className="filters" role="group" aria-label="Filter entries" data-reveal>
          {(["all", ...available] as Filter[]).map((f) => (
            <button key={f} type="button" className="filter" aria-pressed={filter === f} onClick={() => choose(f)}>
              {f === "all" ? "Everything" : CATEGORIES[f].plural}
              <sup className="tabular">{f === "all" ? posts.length : posts.filter((p) => p.category === f).length}</sup>
            </button>
          ))}
        </div>
      )}

      {years.map((year) => (
        <section key={year} className="year">
          <h2 className="year-label tabular">{year}</h2>
          <ul className="rows">
            {visible.filter((p) => p.date.startsWith(year)).map((p) => (
              <li key={p.slug}>
                <TLink href={`/journal/${p.slug}`} className="row row--journal">
                  <span className="row-date tabular">{formatDate(p.date, "short")}</span>
                  <span className="row-main">
                    <span className="row-title">{p.title}</span>
                    {p.summary && <span className="row-summary">{p.summary}</span>}
                  </span>
                  <span className="row-meta">{CATEGORIES[p.category].label}</span>
                  <span className="row-arrow" aria-hidden>→</span>
                </TLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
