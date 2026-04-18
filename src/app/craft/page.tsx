"use client";
import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

const CRAFTS = [
  { domain:"Frontend", title:"SCROLL CINEMATICS", body:"Building Paridhan's hero taught me how to orchestrate GSAP timelines with canvas — when to use requestAnimationFrame vs ScrollTrigger, and when to let silence do the work.", from:"Paridhan" },
  { domain:"Systems",  title:"NETWORK THINKING",  body:"Designing IoT probe sniffing in promiscuous mode reframes how I architect any system — always at the protocol level first, then the application layer.", from:"IoT Detector" },
  { domain:"Product",  title:"B2B FRAMING",       body:"ALLOY pushed me to think in customer acquisition cost, not features. The Apple-style silent video came from understanding that restraint sells harder than noise.", from:"ALLOY" },
  { domain:"Creative", title:"CONCEPT DIRECTION",  body:"Every project gets a visual identity before it gets a codebase. I design the emotional experience first — then reverse-engineer the stack to deliver it precisely.", from:"All projects" },
];

const STATS = [
  { n:"8+", l:"Projects shipped" },
  { n:"4",  l:"Domains of work"  },
  { n:"2+", l:"Years building"   },
];

export default function CraftPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  return (
    <main ref={ref} className="page-wrap">
      <p className="page-eyebrow reveal">What I've built into</p>
      <div className="page-headline reveal" style={{ transitionDelay:"50ms" }}>
        CRAFT &amp; <span className="acc">GROWTH</span>
      </div>

      <p className="reveal" style={{ fontSize:13, color:"var(--sec)", maxWidth:440, lineHeight:1.75, marginBottom:28, transitionDelay:"90ms" }}>
        Skills shown through the work that grew them — not bars or percentages.
      </p>

      {/* craft cells */}
      <div className="craft-grid">
        {CRAFTS.map((c, i) => (
          <div key={c.domain} className="craft-cell reveal" style={{ transitionDelay:`${130 + i * 60}ms` }}>
            <p className="craft-domain">{c.domain}</p>
            <p className="craft-title">{c.title}</p>
            <p className="craft-body">{c.body}</p>
            <p className="craft-from">From → {c.from}</p>
          </div>
        ))}
      </div>

      {/* stat strip */}
      <div className="stat-strip">
        {STATS.map((s) => (
          <div key={s.l} className="stat-cell reveal" style={{ transitionDelay:"400ms" }}>
            <p className="stat-n">{s.n}</p>
            <p className="stat-l">{s.l}</p>
          </div>
        ))}
      </div>

      {/* education + activity */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", borderTop:"0.5px solid var(--bdr)", marginTop:0, transition:"border-color 0.5s" }}>
        {[
          { label:"Currently studying", val:"B.Tech CSE — Networking", sub:"SRM University · 2022–2026" },
          { label:"Active in",          val:"Competitive Programming",   sub:"Hackathons, algorithm contests" },
          { label:"Certifications",     val:"NPTEL — 8-week course",     sub:"Ongoing" },
        ].map((item) => (
          <div key={item.label} className="stat-cell reveal" style={{ transitionDelay:"480ms" }}>
            <p style={{ fontFamily:"var(--font-mono)", fontSize:8, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--sec)", marginBottom:6 }}>{item.label}</p>
            <p style={{ fontSize:12, color:"var(--pri)", marginBottom:3 }}>{item.val}</p>
            <p style={{ fontFamily:"var(--font-mono)", fontSize:9, color:"var(--sec)" }}>{item.sub}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
