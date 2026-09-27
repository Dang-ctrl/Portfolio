"use client";
import { useEffect, useState } from "react";

export default function ConvictionRotator({ ideas }: { ideas: string[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((p) => (p + 1) % ideas.length), 6000);
    return () => clearInterval(id);
  }, [paused, ideas.length]);

  return (
    <section
      className="card conviction reveal"
      aria-roledescription="carousel"
      aria-label="Convictions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="eyebrow">Current conviction · {String(i + 1).padStart(2, "0")}/{String(ideas.length).padStart(2, "0")}</p>
      <blockquote key={i} className="conviction-quote" aria-live="polite">
        &ldquo;{ideas[i]}&rdquo;
      </blockquote>
      <div className="dots">
        {ideas.map((idea, j) => (
          <button
            key={j}
            type="button"
            className="dot"
            aria-current={j === i}
            aria-label={`Show conviction ${j + 1}: ${idea}`}
            onClick={() => setI(j)}
          />
        ))}
      </div>
    </section>
  );
}
