"use client";
import { useRef, MouseEvent } from "react";
import { fireWipeOut } from "@/components/PageWipe";
import { useRouter }   from "next/navigation";

interface Card {
  href:  string;
  label: string;
  desc:  string;
  tag:   string;
}

const CARDS: Card[] = [
  { href: "/work",     label: "Work",     tag: "01", desc: "Projects that shipped. Fintech, IoT, creative dev." },
  { href: "/craft",    label: "Craft",    tag: "02", desc: "The reasoning behind every decision made." },
  { href: "/thinking", label: "Thinking", tag: "03", desc: "Books, ideas, and things that rewire the mind." },
  { href: "/now",      label: "Now",      tag: "04", desc: "What I'm building, learning, and thinking about right now." },
  { href: "/about",    label: "About",    tag: "05", desc: "The full picture — who I am, what I'm building." },
];

function NavCard({ href, label, desc, tag }: Card) {
  const router  = useRouter();
  const cardRef = useRef<HTMLButtonElement>(null);

  const go = async () => { await fireWipeOut(); router.push(href); };

  /* cursor-tracking radial glow */
  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el   = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width)  * 100;
    const y    = ((e.clientY - rect.top)  / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };

  return (
    <button
      ref={cardRef}
      onClick={go}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="nav-card"
      style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
    >
      <span className="nav-card-glow" aria-hidden />
      <span className="nav-card-tag">{tag}</span>
      <span className="nav-card-label">{label}</span>
      <span className="nav-card-desc">{desc}</span>
      <span className="nav-card-arrow">↗</span>
    </button>
  );
}

export default function NavCards() {
  return (
    <div className="nav-cards-grid">
      {CARDS.map(c => <NavCard key={c.href} {...c} />)}
    </div>
  );
}
