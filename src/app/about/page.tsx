import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { LiveClock } from "@/components/NowWidgets";
import Stage from "@/components/three/Stage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Who I am, how I approach every project, experience, and how to get in touch.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  { num: "01", title: "Understand first.", tags: ["Research", "User needs", "Problem framing"],
    desc: "Before writing code, I map the problem space. Users, constraints, edge cases — the system only works when the thinking is right." },
  { num: "02", title: "Design with intent.", tags: ["UI/UX", "Systems thinking", "Visual clarity"],
    desc: "Every decision — type, spacing, flow — is deliberate. Premium isn't decoration. It's the absence of anything unnecessary." },
  { num: "03", title: "Build to last.", tags: ["Engineering", "Scale", "Quality"],
    desc: "Clean architecture, real performance, zero shortcuts. If it ships, it should hold up under real traffic and real scrutiny." },
];

const EXPERIENCE = [
  { role: "Product Engineer",   org: "Alloy (Fintech)",     period: "2024 – Present" },
  { role: "AI Agent Builder",   org: "Repomind",            period: "2024 – Present" },
  { role: "Partnerships Lead",  org: "4ZE Racing",          period: "2023 – Present" },
  { role: "Hackathon Finalist", org: "CredMatch (Fintech)", period: "2024" },
];

export default function AboutPage() {
  return (
    <main className="page container">
      <header className="page-hero reveal">
        <p className="eyebrow">About</p>
        <h1 className="h1">I build things that <em>matter.</em></h1>
        <p className="lead">
          Systems meant to be used — not just seen. Most of my work sits at the intersection of product,
          engineering and design.
        </p>
      </header>

      <div className="about-cards">
        <div className="card about-card reveal">
          <span className="eyebrow">Who I am</span>
          <p className="body-1">
            I care about how things perform, scale and feel in real use — where small decisions compound.
            From fintech platforms to AI tools to cinematic interfaces, the goal stays the same: make it work,
            make it clear, make it inevitable.
          </p>
          <Link href="/work" className="link-accent">View work →</Link>
        </div>
        <div className="card about-card reveal">
          <span className="eyebrow">Currently</span>
          <ul className="plain-list body-1">
            <li>B.Tech CSE (Networking) at SRM University.</li>
            <li>Working across fintech, AI and product systems.</li>
            <li>At 4ZE Racing — partnerships &amp; external strategy.</li>
            <li>Open to building things that matter.</li>
          </ul>
          <Link href="/now" className="link-accent">What I&apos;m doing now →</Link>
        </div>
      </div>

      <section className="section">
        <div className="section-head reveal"><p className="eyebrow">How I approach every project</p></div>
        <div className="principles">
          {PRINCIPLES.map((p) => (
            <article key={p.num} className="principle reveal">
              <span className="mono-num">{p.num}</span>
              <div>
                <h2 className="h3">{p.title}</h2>
                <p className="body-2">{p.desc}</p>
                <div className="chips">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head section-head--row reveal">
          <p className="eyebrow">Experience</p>
          <Link href="/journal" className="link-accent">Achievements &amp; events →</Link>
        </div>
        <ul className="exp">
          {EXPERIENCE.map((e) => (
            <li key={e.role} className="exp-row reveal">
              <span className="exp-role">{e.role}</span>
              <span className="exp-org">{e.org}</span>
              <span className="mono-num">{e.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="section contact">
        <div className="contact-form reveal">
          <p className="eyebrow">Contact</p>
          <h2 className="h2">Start a <em>conversation.</em></h2>
          <p className="body-2">Work inquiries, collaborations, or just something worth saying.</p>
          <ContactForm />
        </div>

        <aside className="contact-side reveal">
          <Stage scene="globe" className="globe-stage" label="Rotating dotted globe with Chennai highlighted — drag to spin" />
          <dl className="contact-facts">
            <div><dt>Local time</dt><dd><LiveClock className="mono-num" /></dd></div>
            <div><dt>Based in</dt><dd>{SITE.location}</dd></div>
            <div><dt>Response</dt><dd>Usually within 24h</dd></div>
            <div><dt>Open to</dt><dd>Freelance · Full-time · Collabs · Internships</dd></div>
          </dl>
          <div className="contact-links">
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">GitHub ↗</a>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">LinkedIn ↗</a>
            <a href={`mailto:${SITE.email}`} className="btn btn-ghost">Email ↗</a>
          </div>
        </aside>
      </section>
    </main>
  );
}
