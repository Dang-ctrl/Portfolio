import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TLink from "@/components/TLink";
import { PROJECTS, getProject } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getProject(params.slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.name, description: p.summary },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const idx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  return (
    <main className="page">
      <TLink href="/work" className="back link" data-reveal>← All work</TLink>

      <header className="case-head">
        <h1 className="h-page" data-split>{project.name}</h1>
        <p className="case-summary" data-split data-delay="0.1">{project.summary}</p>
      </header>

      <span className="rule" data-reveal="rule" />

      <div className="case-body">
        <dl className="case-facts" data-reveal>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Year</dt><dd className="tabular">{project.year}</dd></div>
          <div><dt>Stack</dt><dd>{project.stack.join(", ")}</dd></div>
          {project.link && (
            <div><dt>Link</dt><dd><a href={project.link} target="_blank" rel="noopener noreferrer" className="link">Visit ↗</a></dd></div>
          )}
        </dl>

        <div className="case-text">
          {project.description.map((para, i) => (
            <p key={i} className={i === 0 ? "lede" : "body"} data-reveal>{para}</p>
          ))}

          <h2 className="case-sub" data-reveal>What went into it</h2>
          <ul className="case-list">
            {project.highlights.map((h) => <li key={h} data-reveal>{h}</li>)}
          </ul>
        </div>
      </div>

      <TLink href={`/work/${next.slug}`} curtainLabel={next.name} className="next-project">
        <span className="next-label" data-reveal>Next project</span>
        <span className="next-name" data-split>{next.name}</span>
      </TLink>
    </main>
  );
}
