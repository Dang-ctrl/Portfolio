"use client";
import { useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";

const BOOKS = [
  { title:"Zero to One",                   author:"Peter Thiel",     tag:"Monopoly thinking", note:"The question that reframes everything: what important truth do very few people agree with you on? Build from that." },
  { title:"The Design of Everyday Things", author:"Don Norman",      tag:"UX intuition",      note:"Good design is invisible. Bad design is a door you push when you should pull. I think about affordances before aesthetics now." },
  { title:"Computer Networks",             author:"Tanenbaum",       tag:"Protocol depth",    note:"Understanding layers changed how I think about software architecture. Every abstraction is a promise made to the layer above it." },
  { title:"Steve Jobs",                    author:"Isaacson",        tag:"Premium obsession", note:"The packaging matters as much as the product. People feel quality before they can articulate it." },
  { title:"The Almanack of Naval",         author:"Naval Ravikant",  tag:"Leverage",          note:"Code and media have zero marginal cost of replication. Build things that scale while you sleep." },
  { title:"Atomic Habits",                 author:"James Clear",     tag:"Systems over goals", note:"You don't rise to the level of your goals, you fall to the level of your systems." },
];

const INFLUENCES = [
  { name:"Dieter Rams",   field:"Industrial design",   note:"Less but better" },
  { name:"Virgil Abloh",  field:"Creative direction",  note:"The 3% rule — tweak just enough" },
  { name:"Andrej Karpathy", field:"AI / engineering",  note:"Deep technical clarity" },
  { name:"Paul Graham",   field:"Startups",            note:"Make something people want" },
  { name:"Jony Ive",      field:"Product design",      note:"Form follows feeling" },
];

const IDEAS = [
  "Premium is a feeling, not a price point.",
  "The best interface is the one that disappears.",
  "Build for yourself first — taste is a competitive advantage.",
  "A pitch is a story. The numbers are just proof.",
  "Every constraint is a creative direction waiting to be found.",
];

export default function ThinkingPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);
  const [active, setActive] = useState<number | null>(null);

  return (
    <main ref={ref} className="page-wrap">
      <p className="page-eyebrow reveal">What shapes the mind</p>
      <div className="page-headline reveal" style={{ transitionDelay:"50ms" }}>
        BOOKS &amp; <span className="acc">THINKING</span>
      </div>

      {/* books */}
      <p className="reveal" style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--sec)", marginBottom:12, transitionDelay:"80ms" }}>
        Books that planted something
      </p>
      <div className="books-grid reveal" style={{ transitionDelay:"100ms" }}>
        {BOOKS.map((b, i) => (
          <div
            key={b.title}
            className="book-card"
            onClick={() => setActive(active === i ? null : i)}>
            <p className="book-title">{b.title}</p>
            <p className="book-author">{b.author}</p>
            <p className="book-tag">{b.tag}</p>
            {/* expanded note */}
            <div style={{
              overflow:"hidden",
              maxHeight: active === i ? 100 : 0,
              opacity:   active === i ? 1   : 0,
              transition:"max-height 0.4s ease, opacity 0.3s ease",
              marginTop: active === i ? 10 : 0,
            }}>
              <p style={{ fontSize:10.5, color:"var(--sec)", lineHeight:1.6, borderTop:"0.5px solid var(--bdr)", paddingTop:8 }}>
                {b.note}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* influences */}
      <p className="reveal" style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--sec)", margin:"28px 0 10px", transitionDelay:"320ms" }}>
        People I study
      </p>
      <div style={{ borderTop:"0.5px solid var(--bdr)", transition:"border-color 0.5s" }}>
        {INFLUENCES.map((inf, i) => (
          <div
            key={inf.name}
            className="reveal"
            style={{
              display:"flex", alignItems:"baseline", justifyContent:"space-between",
              padding:"12px 0", borderBottom:"0.5px solid var(--bdr)",
              transition:"border-color 0.5s",
              transitionDelay:`${360 + i * 45}ms`,
            }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:14 }}>
              <span style={{ fontSize:14, color:"var(--pri)", fontFamily:"var(--font-sans)", transition:"color 0.5s" }}>{inf.name}</span>
              <span style={{ fontSize:10, color:"var(--sec)", fontFamily:"var(--font-mono)" }}>{inf.field}</span>
            </div>
            <span style={{ fontSize:11, color:"var(--dim)", fontStyle:"italic", transition:"color 0.5s" }}>"{inf.note}"</span>
          </div>
        ))}
      </div>

      {/* mental notes */}
      <div className="ideas-wrap">
        <p className="ideas-label reveal" style={{ transitionDelay:"580ms" }}>Mental notes</p>
        {IDEAS.map((idea, i) => (
          <div key={i} className="idea-item reveal" style={{ transitionDelay:`${620 + i * 50}ms` }}>
            <span className="idea-dash">—</span>
            <p className="idea-text">{idea}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
