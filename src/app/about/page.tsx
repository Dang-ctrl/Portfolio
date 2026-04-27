"use client";
import { useRef, useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "next/navigation";
import { fireWipeOut, setWipeDest } from "@/components/PageWipe";
import Marquee from "@/components/Marquee";

/* ─── DATA ─── */
const EMAIL = "viditdang9@gmail.com";
const MAX_CHARS = 3000;

const PRINCIPLES = [
  {
    num: "01",
    title: "Understand first.",
    desc: "Before writing code, I map the problem space. Users, constraints, edge cases — the system only works when the thinking is right.",
    tags: ["Research", "User needs", "Problem framing"],
  },
  {
    num: "02",
    title: "Design with intent.",
    desc: "Every decision — type, spacing, flow — is deliberate. Premium isn't decoration. It's the absence of anything unnecessary.",
    tags: ["UI/UX", "Systems thinking", "Visual clarity"],
  },
  {
    num: "03",
    title: "Build to last.",
    desc: "Clean architecture, real performance, zero shortcuts. If it ships, it should hold up under real traffic and real scrutiny.",
    tags: ["Engineering", "Scale", "Quality"],
  },
];

const EXPERIENCE = [
  { role: "Product Engineer", org: "Alloy (Fintech)", period: "2024 – Present" },
  { role: "AI Agent Builder", org: "Repomind", period: "2024 – Present" },
  { role: "Partnerships Lead", org: "4ZE Racing", period: "2023 – Present" },
  { role: "Hackathon Finalist", org: "CredMatch (Fintech)", period: "2024" },
];

const CONNECT = [
  { label: "GitHub", url: "https://github.com/Dang-ctrl", icon: "↗" },
  { label: "LinkedIn", url: "https://linkedin.com/in/vidit-dang", icon: "↗" },
  { label: "Twitter / X", url: "https://x.com", icon: "↗" },
  { label: "Email", url: `mailto:${EMAIL}`, icon: "→" },
];

/* ─── NAV LINK ─── */
function AboutLink({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const go = async () => { setWipeDest(href); await fireWipeOut(); router.push(href); };
  return <button onClick={go} className="abt-cta">{label} ↗</button>;
}

/* ─── LIVE CLOCK ─── */
function MiniClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const u = () => setT(new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false, timeZone: "Asia/Kolkata",
    }));
    u(); const id = setInterval(u, 1000); return () => clearInterval(id);
  }, []);
  return <span className="abt-clock">{t}</span>;
}

/* ─── PAGE ─── */
export default function AboutPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleMsg = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) setMessage(e.target.value);
  };
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setLoading(true);
    try {
      await fetch("https://formsubmit.co/ajax/viditdang9@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio Message from ${name}`,
        }),
      });
      
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try the direct email link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main ref={ref} className="page-wrap">
      {/* ══ HERO ══ */}
      <div className="abt-hero reveal">
        <p className="page-eyebrow">About</p>
        <h1 className="abt-headline">
          I build things<br />that <span className="acc">matter.</span>
        </h1>
        <p className="abt-sub">
          Systems meant to be used — not just seen. Most of my work sits at the
          intersection of product, engineering, and design.
        </p>
      </div>

      {/* ══ STATS ══ */}
      <div className="abt-stats reveal" style={{ transitionDelay: "40ms" }}>
        <div className="abt-stat"><span className="abt-stat-val">8+</span><span className="abt-stat-lbl">Projects shipped</span></div>
        <div className="abt-stat"><span className="abt-stat-val">2+</span><span className="abt-stat-lbl">Years building</span></div>
        <div className="abt-stat"><span className="abt-stat-val">4</span><span className="abt-stat-lbl">Domains</span></div>
        <div className="abt-stat"><span className="abt-stat-val abt-stat-tags">Tech · Design · Racing · Finance</span><span className="abt-stat-lbl">Spectrum</span></div>
      </div>

      {/* ══ TWO-COL ABOUT + CURRENTLY ══ */}
      <div className="abt-cards reveal" style={{ transitionDelay: "60ms" }}>
        <div className="abt-card">
          <span className="abt-card-label">Who I am</span>
          <p className="abt-card-body">
            I care about how things perform, scale, and feel in real use — where
            small decisions compound. From fintech platforms to AI tools to
            cinematic interfaces, the goal stays the same: make it work, make it
            clear, make it inevitable.
          </p>
          <AboutLink href="/work" label="View work" />
        </div>
        <div className="abt-card">
          <span className="abt-card-label">Currently</span>
          <p className="abt-card-body">
            B.Tech CSE (Networking) at SRM.<br />
            Working across fintech, AI, and product systems.<br />
            Part of 4ZE Racing — partnerships &amp; external strategy.<br />
            Open to building things that matter.
          </p>
          <AboutLink href="/now" label="What I'm doing now" />
        </div>
      </div>

      {/* ══ MARQUEE ══ */}
      <div className="reveal" style={{ transitionDelay: "70ms" }}>
        <Marquee />
      </div>

      {/* ══ PRINCIPLES ══ */}
      <div className="abt-section reveal" style={{ transitionDelay: "80ms" }}>
        <span className="abt-section-label">How I approach every project</span>
        <div className="abt-principles">
          {PRINCIPLES.map((p) => (
            <div key={p.num} className="abt-principle">
              <span className="abt-principle-num">{p.num}</span>
              <div className="abt-principle-body">
                <h3 className="abt-principle-title">{p.title}</h3>
                <p className="abt-principle-desc">{p.desc}</p>
                <div className="abt-principle-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="abt-principle-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ EXPERIENCE ══ */}
      <div className="abt-section reveal" style={{ transitionDelay: "90ms" }}>
        <span className="abt-section-label">Experience</span>
        <div className="abt-exp">
          {EXPERIENCE.map((e, i) => (
            <div key={i} className="abt-exp-row">
              <div className="abt-exp-left">
                <span className="abt-exp-role">{e.role}</span>
                <span className="abt-exp-org">{e.org}</span>
              </div>
              <span className="abt-exp-period">{e.period}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ CONTACT ══ */}
      <div className="abt-contact reveal" style={{ transitionDelay: "100ms" }}>
        <div className="abt-contact-form-col">
          <span className="abt-section-label">Contact</span>
          <h2 className="abt-contact-heading">Start a conversation.</h2>
          <p className="abt-contact-sub">
            Work inquiries, collaborations, or just something worth saying.
          </p>

          <form onSubmit={handleSubmit} className="abt-form">
            <div className={`abt-field ${focused === "name" ? "abt-field-active" : ""}`}>
              <label className="abt-field-label" htmlFor="abt-name">Name</label>
              <input id="abt-name" type="text" className="abt-input" value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                autoComplete="name" required />
            </div>
            <div className={`abt-field ${focused === "email" ? "abt-field-active" : ""}`}>
              <label className="abt-field-label" htmlFor="abt-email">Email</label>
              <input id="abt-email" type="email" className="abt-input" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                autoComplete="email" required />
            </div>
            <div className={`abt-field abt-field-area ${focused === "msg" ? "abt-field-active" : ""}`}>
              <label className="abt-field-label" htmlFor="abt-msg">Message</label>
              <textarea id="abt-msg" className="abt-textarea" value={message}
                onChange={handleMsg} onFocus={() => setFocused("msg")}
                onBlur={() => setFocused(null)} rows={5} required />
              <span className="abt-counter">{message.length}/{MAX_CHARS}</span>
            </div>
            <div className="abt-form-actions">
              <button type="submit" className="abt-send" disabled={loading}>
                {loading ? "Sending..." : sent ? "Sent ✓" : "Send →"}
              </button>
              <a href={`mailto:${EMAIL}`} className="abt-direct">
                Or email directly: <span>{EMAIL}</span>
              </a>
            </div>
          </form>
        </div>

        <div className="abt-contact-info-col">
          <div className="abt-info-card">
            <span className="abt-info-label">Local time</span>
            <MiniClock />
          </div>
          <div className="abt-info-card">
            <span className="abt-info-label">Based in</span>
            <span className="abt-info-val">Chennai, India</span>
          </div>
          <div className="abt-info-card">
            <span className="abt-info-label">Response time</span>
            <span className="abt-info-val">Usually within 24h</span>
          </div>
          <div className="abt-info-card">
            <span className="abt-info-label">Open to</span>
            <span className="abt-info-val">Freelance · Full-time<br />Collabs · Internships</span>
          </div>
          <div className="abt-info-card">
            <span className="abt-info-label">Connect</span>
            <div className="abt-links">
              {CONNECT.map((c) => (
                <a key={c.label} href={c.url} target="_blank" rel="noopener noreferrer" className="abt-link">
                  {c.label} <span>{c.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
