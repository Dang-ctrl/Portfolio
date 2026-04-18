"use client";
import { useRef } from "react";
import ProjectRow, { type Project } from "@/components/ProjectRow";
import Marquee from "@/components/Marquee";
import { useReveal } from "@/hooks/useReveal";

const PROJECTS: Project[] = [
  { num:"01", name:"PARIDHAN", year:"2024", tags:["Creative Dev","Canvas","GSAP"],
    description:"Cinematic scroll-driven website for a clothing manufacturing brand in Noida. GSAP ScrollTrigger, canvas hero animations, curl-noise particle system. Three full build phases from concept to live.",
    stack:["Next.js 14","GSAP","Canvas API","Tailwind CSS"] },
  { num:"02", name:"ALLOY", year:"2024", tags:["Fintech","B2B","Product"],
    description:"B2B fintech platform for business credit line efficiency. Apple-style silent video script, full product identity and landing page. Thinking in CAC, not features.",
    stack:["Next.js","FastAPI","PostgreSQL","Stripe"] },
  { num:"03", name:"REPOMIND", year:"2024", tags:["AI Agent","Dev Tools"],
    description:"Autonomous code review agent on Codex. Analyses pull requests, flags issues, suggests refactors from codebase history. Next.js + FastAPI stack.",
    stack:["Next.js","FastAPI","OpenAI Codex","GitHub API"] },
  { num:"04", name:"FARMHUB", year:"2023", tags:["Marketplace","P2P"],
    description:"Peer-to-peer crop price marketplace connecting farmers directly with buyers. Real-time price discovery, location-based matching, zero middlemen.",
    stack:["React","Node.js","MongoDB","Socket.io"] },
  { num:"05", name:"IOT DETECTOR", year:"2023", tags:["IoT","Networking"],
    description:"WiFi probe sniffing system on NodeMCU ESP-12E in promiscuous mode. Detects nearby phones without any app. LED and buzzer real-time alerts.",
    stack:["C++","Arduino","NodeMCU","WiFi 802.11"] },
  { num:"06", name:"4ZE RACING", year:"2023—", tags:["Formula EV","Strategy"],
    description:"Corporate Representative for SRM's Formula Student EV team. Sponsorship acquisition, brand partnerships, external communications for the racing programme.",
    stack:["Strategy","Partnerships","Brand Direction"] },
];

export default function WorkPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);
  return (
    <main ref={ref} className="page-wrap">
      <p className="page-eyebrow reveal">Selected work</p>
      <div className="page-headline reveal" style={{ transitionDelay:"50ms" }}>
        PROJECTS THAT <span className="acc">SHIPPED</span>
      </div>
      <div className="proj-list">
        {PROJECTS.map((p, i) => <ProjectRow key={p.num} p={p} delay={100 + i * 55} />)}
      </div>
      <Marquee />
      <p className="reveal" style={{ fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--dim)", marginTop:8, transitionDelay:"600ms" }}>
        More in pipeline —
      </p>
    </main>
  );
}
