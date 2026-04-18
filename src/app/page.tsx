"use client";
import { useRef } from "react";
import TLink          from "@/components/TLink";
import PixelPortrait  from "@/components/PixelPortrait";
import { useReveal }  from "@/hooks/useReveal";
import { fireWipeOut } from "@/components/PageWipe";
import { useRouter }  from "next/navigation";
import NavCards       from "@/components/NavCards";

function NavPill({ label, href }: { label: string; href: string }) {
  const router = useRouter();
  const go = async () => { await fireWipeOut(); router.push(href); };
  return (
    <button onClick={go} className="pill">{label}</button>
  );
}

export default function Home() {
  const ref = useRef<HTMLElement>(null!);
  useReveal(ref);

  return (
    <main ref={ref} style={{ paddingTop: 52 }}>
      <div className="landing-grid">
        {/* LEFT */}
        <div className="landing-left">
          <div>
            <p className="landing-eyebrow reveal">About</p>
            <h1 className="landing-name reveal" style={{ transitionDelay: "40ms" }}>
              Vidit Jain
            </h1>

            <p className="landing-bio reveal" style={{ transitionDelay: "80ms" }}>
              B.Tech CSE student, networking specialist, and creative technologist.
              Based in Chennai with a one-track mind for{" "}
              <TLink href="/craft" className="bio-link">building things that feel premium</TLink>.
            </p>

            <p className="landing-bio reveal" style={{ transitionDelay: "120ms" }}>
              Ships{" "}
              <TLink href="/work" className="bio-link">
                products across fintech, IoT, and creative dev
              </TLink>{" "}
              — each one starting from the same question: what would make this genuinely better
              for the person using it?
            </p>

            <p className="landing-bio reveal" style={{ transitionDelay: "160ms" }}>
              Corporate Rep at 4ZE Racing Formula Student EV team. Obsessive about details.
              Reads{" "}
              <TLink href="/thinking" className="bio-link">books that rewire thinking</TLink>.
              Would redesign a button at 2am because the spacing was wrong.
            </p>
          </div>

          <div className="landing-footer reveal" style={{ transitionDelay: "220ms" }}>
            <div className="contact-row">
              <a href="https://github.com/vidit" target="_blank" rel="noopener noreferrer" className="contact-link">
                GitHub
              </a>
              <span className="contact-sep">·</span>
              <a href="https://linkedin.com/in/vidit" target="_blank" rel="noopener noreferrer" className="contact-link">
                LinkedIn
              </a>
              <span className="contact-sep">·</span>
              <a href="mailto:vidit@email.com" className="contact-link">
                vidit@email.com
              </a>
            </div>

            <div className="section-pills">
              <NavPill href="/work"     label="Work"          />
              <NavPill href="/craft"    label="Craft"         />
              <NavPill href="/thinking" label="Thinking"      />
              <button className="pill highlight" style={{ cursor: "default" }}>
                Open to collab
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — pixel portrait */}
        <PixelPortrait />
      </div>
      <NavCards />
    </main>
  );
}
