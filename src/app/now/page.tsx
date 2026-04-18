"use client";
import { useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

interface NowSection {
  heading: string;
  body:    string[];
  tag:     string;
}

const NOW: NowSection[] = [
  {
    tag: "01 / Building",
    heading: "Building.",
    body: [
      "Two projects running in parallel — which is always one too many, but here we are. Alloy, a B2B fintech platform for business credit lines, is deep in the product identity phase. Thinking in CAC curves and silent explainer scripts, not features.",
      "Repomind is an autonomous code-review agent that reads pull requests the way a senior engineer would — from codebase history, not just the diff. It shouldn't exist yet, but it does.",
    ],
  },
  {
    tag: "02 / Learning",
    heading: "Learning.",
    body: [
      "Computer networking — properly. Not the conceptual layer-by-layer overview, but the part where packets actually move and why latency behaves the way it does. Doing this alongside my B.Tech CSE at SRM.",
      "Also deep in typesetting. The more you read about type, the more you can't un-see bad kerning in the wild. It's a curse with good side effects.",
    ],
  },
  {
    tag: "03 / Thinking about",
    heading: "Thinking about.",
    body: [
      "Whether premium software has to be expensive to feel premium, or whether that's just a habit of the industry. The answer is probably no, but nobody acts like it.",
      "The gap between what an interface communicates and what a user experiences. Most UI problems are communication problems. The pixel work is the last 10%.",
    ],
  },
  {
    tag: "04 / Reading",
    heading: "Reading.",
    body: [
      "The Design of Everyday Things — for the third time, and still finding new edges. Also halfway through Zero to One, which is either deeply obvious or quietly radical depending on the day.",
    ],
  },
  {
    tag: "05 / Outside all of this",
    heading: "Outside all of this.",
    body: [
      "Running the corporate relations arm of 4ZE Racing, SRM's Formula Student EV team. Mostly emails, some strategy, occasional calls with people who take motorsport very seriously.",
      "Trying to spend more time away from screens before midnight. Failing consistently. Getting better at failing gracefully.",
    ],
  },
];

const UPDATED = "April 2025 — Chennai";

export default function NowPage() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  return (
    <main ref={ref} className="page-wrap now-page">

      <div className="now-header reveal">
        <p className="page-eyebrow">Now</p>
        <h1 className="now-headline">What I&apos;m focused on.</h1>
        <p className="now-updated">{UPDATED}</p>
      </div>

      <div className="now-sections">
        {NOW.map((s, i) => (
          <article
            key={s.tag}
            className="now-section reveal"
            style={{ transitionDelay: `${80 + i * 70}ms` }}
          >
            <header className="now-section-head">
              <span className="now-section-tag">{s.tag}</span>
              <h2 className="now-section-heading">{s.heading}</h2>
            </header>
            <div className="now-section-body">
              {s.body.map((p, j) => (
                <p key={j} className="now-para">{p}</p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="now-footer reveal" style={{ transitionDelay: `${80 + NOW.length * 70 + 40}ms` }}>
        A /now page is a snapshot, not a statement. Things change fast.
      </p>

    </main>
  );
}
