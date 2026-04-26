"use client";
import { useRef, useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */

const BOOKS = [
  {
    title: "Zero to One",
    author: "Peter Thiel",
    tag: "Monopoly thinking",
    note: "The question that reframes everything: what important truth do very few people agree with you on? Build from that.",
    emoji: "🔮",
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    tag: "UX intuition",
    note: "Good design is invisible. Bad design is a door you push when you should pull. I think about affordances before aesthetics now.",
    emoji: "🚪",
  },
  {
    title: "Computer Networks",
    author: "Tanenbaum",
    tag: "Protocol depth",
    note: "Understanding layers changed how I think about software architecture. Every abstraction is a promise made to the layer above it.",
    emoji: "🌐",
  },
  {
    title: "Steve Jobs",
    author: "Isaacson",
    tag: "Premium obsession",
    note: "The packaging matters as much as the product. People feel quality before they can articulate it.",
    emoji: "🍎",
  },
  {
    title: "The Almanack of Naval",
    author: "Naval Ravikant",
    tag: "Leverage",
    note: "Code and media have zero marginal cost of replication. Build things that scale while you sleep.",
    emoji: "⚡",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    tag: "Systems over goals",
    note: "You don't rise to the level of your goals, you fall to the level of your systems.",
    emoji: "⚙️",
  },
  {
    title: "How to Start a Cult",
    author: "Kristian Wilson",
    tag: "Belief systems",
    note: "The best products don't just have users — they have believers. Understanding how loyalty is engineered changes how you build anything.",
    emoji: "🔥",
  },
];

const INFLUENCES = [
  {
    name: "Dieter Rams",
    field: "Industrial design",
    note: "Less but better",
    takeaway: "Taught me that restraint is the hardest skill. Every element on screen should earn its pixel.",
  },
  {
    name: "Virgil Abloh",
    field: "Creative direction",
    note: "The 3% rule — tweak just enough",
    takeaway: "You don't need to reinvent from scratch. A 3% shift on something familiar creates something entirely new.",
  },
  {
    name: "Andrej Karpathy",
    field: "AI / Engineering",
    note: "Deep technical clarity",
    takeaway: "The ability to explain complex systems simply is the ultimate proof of understanding.",
  },
  {
    name: "Paul Graham",
    field: "Startups",
    note: "Make something people want",
    takeaway: "Startups die from building the wrong thing, not from building it wrong.",
  },
  {
    name: "Jony Ive",
    field: "Product design",
    note: "Form follows feeling",
    takeaway: "Design isn't how it looks. Design is how it makes you feel. The invisible decisions matter most.",
  },
  {
    name: "Nikhil Kamath",
    field: "Business / Finance",
    note: "First principles thinking in markets",
    takeaway: "Strip away the noise, find the asymmetry, then bet decisively. Applies to products, not just stocks.",
  },
  {
    name: "Brian Chesky",
    field: "Product / Experience",
    note: "Design-led company building",
    takeaway: "The best companies are designed, not just managed. Every touchpoint is a design decision.",
  },
];

const IDEAS = [
  "Premium is a feeling, not a price point.",
  "The best interface is the one that disappears.",
  "Build for yourself first — taste is a competitive advantage.",
  "A pitch is a story. The numbers are just proof.",
  "Every constraint is a creative direction waiting to be found.",
  "The problem is rarely what it first appears to be.",
  "If it needs explanation, it needs redesign.",
];

const EXPLORING = [
  "Agent systems",
  "Edge computing",
  "Design systems",
  "Prompt engineering",
  "Rust",
  "System design",
  "TypeScript patterns",
  "Product strategy",
  "Networking protocols",
  "Creative direction",
  "LLM fine-tuning",
  "Distribution",
];

/* ─────────────────────────────────────────────
   COMPONENTS
   ───────────────────────────────────────────── */

/* Animated quote that types out letter by letter */
function TypewriterQuote({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (visible >= text.length) return;
    const id = setTimeout(() => setVisible((v) => v + 1), 28);
    return () => clearTimeout(id);
  }, [visible, started, text.length]);

  return (
    <span className="tw-text">
      {text.slice(0, visible)}
      {visible < text.length && <span className="tw-cursor">|</span>}
    </span>
  );
}

/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function ThinkingPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);
  const [activeBook, setActiveBook] = useState<number | null>(null);
  const [activeInfluence, setActiveInfluence] = useState<number | null>(null);
  const [activeIdea, setActiveIdea] = useState(0);

  // Cycle through ideas automatically
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdea((prev) => (prev + 1) % IDEAS.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <main ref={ref} className="page-wrap">
      {/* ── Hero ── */}
      <div className="think-hero reveal">
        <p className="page-eyebrow">What shapes the mind</p>
        <h1 className="think-headline">
          Inputs that <span className="acc">compound.</span>
        </h1>
        <p className="think-sub">
          Books, people, and ideas that rewired how I think about building.
          Not a reading list — a map of mental models that actually stuck.
        </p>
      </div>

      {/* ── Stats strip ── */}
      <div className="think-stats reveal" style={{ transitionDelay: "50ms" }}>
        <div className="think-stat-item">
          <span className="think-stat-val">{BOOKS.length}</span>
          <span className="think-stat-label">Books</span>
        </div>
        <div className="think-stat-item">
          <span className="think-stat-val">{INFLUENCES.length}</span>
          <span className="think-stat-label">Influences</span>
        </div>
        <div className="think-stat-item">
          <span className="think-stat-val">{IDEAS.length}</span>
          <span className="think-stat-label">Mental Notes</span>
        </div>
        <div className="think-stat-item">
          <span className="think-stat-val">{EXPLORING.length}+</span>
          <span className="think-stat-label">Exploring</span>
        </div>
      </div>

      {/* ── Active thought (rotating quote) ── */}
      <div className="think-active-thought reveal" style={{ transitionDelay: "60ms" }}>
        <span className="think-active-label">Current conviction</span>
        <div className="think-active-quote" key={activeIdea}>
          <span className="think-active-mark">&ldquo;</span>
          {IDEAS[activeIdea]}
          <span className="think-active-mark">&rdquo;</span>
        </div>
        <div className="think-active-dots">
          {IDEAS.map((_, i) => (
            <button
              key={i}
              className={`think-dot ${i === activeIdea ? "think-dot-active" : ""}`}
              onClick={() => setActiveIdea(i)}
              type="button"
              aria-label={`Quote ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Books ── */}
      <div className="think-section reveal" style={{ transitionDelay: "70ms" }}>
        <span className="think-section-label">Books that planted something</span>
        <div className="think-books-grid">
          {BOOKS.map((b, i) => (
            <div
              key={b.title}
              className={`think-book ${activeBook === i ? "think-book-open" : ""}`}
              onClick={() => setActiveBook(activeBook === i ? null : i)}
            >
              <div className="think-book-top">
                <span className="think-book-emoji">{b.emoji}</span>
                <div className="think-book-meta">
                  <span className="think-book-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="think-book-tag">{b.tag}</span>
                </div>
              </div>
              <p className="think-book-title">{b.title}</p>
              <p className="think-book-author">{b.author}</p>
              <div className={`think-book-note ${activeBook === i ? "think-book-note-open" : ""}`}>
                <p className="think-book-note-text">{b.note}</p>
              </div>
              <span className="think-book-expand">{activeBook === i ? "−" : "+"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Influences ── */}
      <div className="think-section reveal" style={{ transitionDelay: "80ms" }}>
        <span className="think-section-label">People I study</span>
        <div className="think-influences">
          {INFLUENCES.map((inf, i) => (
            <div
              key={inf.name}
              className={`think-inf-card ${activeInfluence === i ? "think-inf-active" : ""}`}
              onClick={() => setActiveInfluence(activeInfluence === i ? null : i)}
            >
              <div className="think-inf-header">
                <div className="think-inf-left">
                  <span className="think-inf-name">{inf.name}</span>
                  <span className="think-inf-field">{inf.field}</span>
                </div>
                <span className="think-inf-motto">&ldquo;{inf.note}&rdquo;</span>
              </div>
              <div className={`think-inf-expand ${activeInfluence === i ? "think-inf-expand-open" : ""}`}>
                <p className="think-inf-takeaway">{inf.takeaway}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Currently exploring ── */}
      <div className="think-section reveal" style={{ transitionDelay: "90ms" }}>
        <span className="think-section-label">Currently exploring</span>
        <div className="think-explore">
          {EXPLORING.map((topic, i) => (
            <span
              key={topic}
              className="think-explore-tag"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {topic}
            </span>
          ))}
        </div>
      </div>

      {/* ── Mental notes (typewriter) ── */}
      <div className="think-section reveal" style={{ transitionDelay: "100ms" }}>
        <span className="think-section-label">Mental notes</span>
        <div className="think-notes">
          {IDEAS.map((idea, i) => (
            <div key={i} className="think-note-item">
              <span className="think-note-dash">—</span>
              <p className="think-note-text">{idea}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="think-footnote reveal" style={{ transitionDelay: "110ms" }}>
        Updated as the library grows —
      </p>
    </main>
  );
}
