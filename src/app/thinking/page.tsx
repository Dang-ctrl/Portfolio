import type { Metadata } from "next";
import ConvictionRotator from "@/components/ConvictionRotator";
import { BOOKS, EXPLORING, IDEAS, INFLUENCES } from "@/data/thinking";

export const metadata: Metadata = {
  title: "Thinking",
  description: "Books, people and ideas that rewired how I think about building — a map of mental models that actually stuck.",
  alternates: { canonical: "/thinking" },
};

export default function ThinkingPage() {
  return (
    <main className="page container">
      <header className="page-hero reveal">
        <p className="eyebrow">What shapes the mind</p>
        <h1 className="h1">Inputs that <em>compound.</em></h1>
        <p className="lead">
          Books, people and ideas that rewired how I think about building.
          Not a reading list — a map of mental models that actually stuck.
        </p>
      </header>

      <div className="stat-row reveal">
        <div className="stat"><span className="stat-val">{BOOKS.length}</span><span className="stat-label">Books</span></div>
        <div className="stat"><span className="stat-val">{INFLUENCES.length}</span><span className="stat-label">Influences</span></div>
        <div className="stat"><span className="stat-val">{IDEAS.length}</span><span className="stat-label">Convictions</span></div>
        <div className="stat"><span className="stat-val">{EXPLORING.length}</span><span className="stat-label">Exploring</span></div>
      </div>

      <ConvictionRotator ideas={IDEAS} />

      <section className="section">
        <div className="section-head reveal">
          <p className="eyebrow">Books that planted something</p>
          <p className="body-3">Tap a book for the idea that stuck.</p>
        </div>
        <div className="book-grid">
          {BOOKS.map((b, i) => (
            <details key={b.title} className="card book reveal" style={{ transitionDelay: `${(i % 3) * 50}ms` }}>
              <summary>
                <span className="book-top">
                  <span className="book-emoji" aria-hidden>{b.emoji}</span>
                  <span className="chip">{b.tag}</span>
                </span>
                <span className="book-title">{b.title}</span>
                <span className="body-3">{b.author}</span>
                <span className="plus" aria-hidden />
              </summary>
              <p className="book-note">{b.note}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal"><p className="eyebrow">People I study</p></div>
        <div className="people">
          {INFLUENCES.map((p) => (
            <details key={p.name} className="person reveal">
              <summary>
                <span className="person-left">
                  <span className="person-name">{p.name}</span>
                  <span className="body-3">{p.field}</span>
                </span>
                <span className="person-motto">&ldquo;{p.note}&rdquo;</span>
                <span className="plus" aria-hidden />
              </summary>
              <p className="person-take">{p.takeaway}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head reveal"><p className="eyebrow">Currently exploring</p></div>
        <div className="chips chips-lg reveal">
          {EXPLORING.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
      </section>

      <p className="footnote reveal">Updated as the library grows —</p>
    </main>
  );
}
