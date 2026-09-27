import type { Metadata } from "next";
import TLink from "@/components/TLink";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects across fintech, AI agents, hardware and Formula Student — what they are and what I did on each.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main className="page">
      <header className="page-head">
        <h1 className="h-page" data-split>Work</h1>
        <p className="page-intro" data-reveal>
          Things I&apos;ve built or helped ship since 2023 — software, a bit of hardware, and the business side
          of a racing team.
        </p>
      </header>

      <ul className="work-list">
        <li className="work-list-head" aria-hidden data-reveal>
          <span>Project</span><span>Role</span><span>Year</span>
        </li>
        {PROJECTS.map((p, i) => (
          <li key={p.slug} data-reveal>
            <TLink href={`/work/${p.slug}`} curtainLabel={p.name} className="work-row">
              <span className="work-row-index tabular">{String(i + 1).padStart(2, "0")}</span>
              <span className="work-row-name">{p.name}</span>
              <span className="work-row-summary">{p.summary}</span>
              <span className="work-row-role">{p.role}</span>
              <span className="work-row-year tabular">{p.year}</span>
            </TLink>
          </li>
        ))}
      </ul>
    </main>
  );
}
