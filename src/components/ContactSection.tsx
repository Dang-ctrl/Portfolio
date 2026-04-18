"use client";
import { useRef, useState, ChangeEvent, FormEvent } from "react";
import { useReveal } from "@/hooks/useReveal";

const MAX_CHARS = 3000;
const EMAIL = "viditjain.work@gmail.com";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleMsg = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) setMessage(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    const mailto = `mailto:${EMAIL}?subject=Hey Vidit — from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0A— ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
    window.open(mailto);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section ref={ref} className="contact-section">

      {/* ── LEFT — form ───────────────────────── */}
      <div className="contact-form-col">
        <p className="contact-eyebrow reveal">Contact</p>

        <h2 className="contact-heading reveal" style={{ transitionDelay: "40ms" }}>
          Start a conversation.
        </h2>

        <p className="contact-subtext reveal" style={{ transitionDelay: "80ms" }}>
          Work inquiries, collaborations, or just something worth saying.
        </p>

        <form onSubmit={handleSubmit} className="contact-form reveal" style={{ transitionDelay: "140ms" }}>

          {/* Name */}
          <div className={`cf-field ${focused === "name" ? "cf-field--active" : ""}`}>
            <label className="cf-label" htmlFor="cf-name">Name</label>
            <input
              id="cf-name"
              type="text"
              className="cf-input"
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              autoComplete="name"
              required
            />
          </div>

          {/* Email */}
          <div className={`cf-field ${focused === "email" ? "cf-field--active" : ""}`}>
            <label className="cf-label" htmlFor="cf-email">Email</label>
            <input
              id="cf-email"
              type="email"
              className="cf-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              autoComplete="email"
              required
            />
          </div>

          {/* Message */}
          <div className={`cf-field cf-field--area ${focused === "msg" ? "cf-field--active" : ""}`}>
            <label className="cf-label" htmlFor="cf-msg">Message</label>
            <textarea
              id="cf-msg"
              className="cf-textarea"
              value={message}
              onChange={handleMsg}
              onFocus={() => setFocused("msg")}
              onBlur={() => setFocused(null)}
              rows={5}
              required
            />
            <span className="cf-counter">{message.length}/{MAX_CHARS}</span>
          </div>

          <div className="cf-actions">
            <button type="submit" className="cf-send">
              {sent ? "Sent ✓" : "Send →"}
            </button>
            <a href={`mailto:${EMAIL}`} className="cf-direct">
              Or email directly: <span>{EMAIL}</span>
            </a>
          </div>

        </form>
      </div>

      {/* ── RIGHT — decorative info ───────────── */}
      <div className="contact-info-col reveal" style={{ transitionDelay: "180ms" }}>
        <div className="contact-info-inner">
          <p className="contact-info-label">Response time</p>
          <p className="contact-info-value">Usually within 24h</p>
        </div>
        <div className="contact-info-inner">
          <p className="contact-info-label">Based in</p>
          <p className="contact-info-value">Chennai, India</p>
        </div>
        <div className="contact-info-inner">
          <p className="contact-info-label">Open to</p>
          <p className="contact-info-value">
            Freelance · Full-time<br />Collabs · Internships
          </p>
        </div>
        <div className="contact-info-inner">
          <p className="contact-info-label">Timezone</p>
          <p className="contact-info-value">IST (UTC +5:30)</p>
        </div>
      </div>

    </section>
  );
}
