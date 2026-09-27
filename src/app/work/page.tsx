import type { Metadata } from "next";
import WorkList from "@/components/WorkList";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects — fintech platforms, AI agents, IoT hardware and Formula Student strategy. Built, shipped and battle-tested.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const disciplines = new Set(PROJECTS.flatMap((p) => p.tags)).size;

  return (
    <main className="page container">
      <header className="page-hero reveal">
        <p className="eyebrow">Selected work</p>
        <h1 className="h1">Built, <em>shipped</em> &amp; battle-tested.</h1>
        <p className="lead">
          Not mockups. Every project here went from zero to something real — with real users,
          real stakes and real deadlines. Open any project for the full story.
        </p>
      </header>

      <div className="stat-row reveal">
        <div className="stat"><span className="stat-val">{PROJECTS.length}</span><span className="stat-label">Projects</span></div>
        <div className="stat"><span className="stat-val">{disciplines}+</span><span className="stat-label">Disciplines</span></div>
        <div className="stat"><span className="stat-val">2+</span><span className="stat-label">Years</span></div>
      </div>

      <WorkList projects={PROJECTS} />

      <p className="footnote reveal">More in the pipeline —</p>
    </main>
  );
}
