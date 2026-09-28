import type { Metadata } from "next";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import portrait from "../../../../public/pics/portrait.png";

export const metadata: Metadata = {
  title: "About",
  description: "Computer science student at SRM University in Chennai, working across product, engineering and design. How to get in touch.",
  alternates: { canonical: "/about" },
};

const NOW = [
  "Studying B.Tech CSE (Networking) at SRM University.",
  "Building Alloy, a B2B credit-line platform, and Repomind, a code-review agent.",
  "Partnerships and sponsorship at 4ZE Racing.",
];

const EXPERIENCE = [
  { role: "Product engineer",   org: "Alloy",      period: "2024 — now" },
  { role: "AI agent developer", org: "Repomind",   period: "2024 — now" },
  { role: "Partnerships lead",  org: "4ZE Racing", period: "2023 — now" },
  { role: "Hackathon finalist", org: "CredMatch",  period: "2024" },
];

const SHELF = [
  { title: "The Design of Everyday Things", author: "Don Norman", note: "Affordances before aesthetics." },
  { title: "Zero to One", author: "Peter Thiel", note: "What do you believe that few people agree with?" },
  { title: "Computer Networks", author: "Andrew Tanenbaum", note: "Every layer is a promise to the one above it." },
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson", note: "Code and media are leverage." },
];

export default function AboutPage() {
  return (
    <main className="page">
      <header className="about-head grid">
        <div className="col-text">
          <h1 className="h-page" data-split>About</h1>
          <p className="lede" data-split data-delay="0.1">
            I&apos;m Vidit — a computer science student in Chennai who likes turning messy, real-world problems
            into products people actually use.
          </p>
          <p className="body" data-reveal>
            I work across the whole thing: figuring out what to build, designing how it should feel, and writing
            the code. Outside of software I do partnerships for 4ZE Racing, our Formula Student electric team,
            which has taught me as much about building as any codebase.
          </p>
        </div>
        <div className="col-portrait" data-reveal>
          <Image src={portrait} alt="ASCII portrait of Vidit Dang" className="portrait" placeholder="blur" priority sizes="(max-width: 900px) 80vw, 32vw" />
        </div>
      </header>

      <section className="section split-list">
        <h2 className="h-section" data-split>Now</h2>
        <ul className="plain">
          {NOW.map((n) => <li key={n} data-reveal>{n}</li>)}
        </ul>
      </section>

      <section className="section split-list">
        <h2 className="h-section" data-split>Experience</h2>
        <ul className="rows">
          {EXPERIENCE.map((e) => (
            <li key={e.role} data-reveal>
              <div className="row row--static">
                <span className="row-title">{e.role}</span>
                <span className="row-meta">{e.org}</span>
                <span className="row-date tabular">{e.period}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="section split-list">
        <h2 className="h-section" data-split>On the shelf</h2>
        <ul className="rows">
          {SHELF.map((b) => (
            <li key={b.title} data-reveal>
              <div className="row row--static row--book">
                <span className="row-title">{b.title}</span>
                <span className="row-meta">{b.author}</span>
                <span className="row-note">{b.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="section contact grid">
        <div className="col-text">
          <h2 className="h-section" data-split>Get in touch</h2>
          <p className="body" data-reveal>
            Internships, freelance work, collaborations — or just something worth saying. I usually reply within a day.
          </p>
          <ul className="contact-links" data-reveal>
            <li><a href={`mailto:${SITE.email}`} className="link">{SITE.email}</a></li>
            <li><a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="link">LinkedIn ↗</a></li>
            <li><a href={SITE.github} target="_blank" rel="noopener noreferrer" className="link">GitHub ↗</a></li>
          </ul>
        </div>
        <div className="col-form" data-reveal>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
