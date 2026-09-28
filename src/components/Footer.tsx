import TLink from "./TLink";
import PixelShape from "./PixelShape";
import LocalTime from "./LocalTime";
import { SITE, NAV_LINKS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <p className="footer-lead" data-reveal>
          <PixelShape name="asterisk" className="footer-mark" data-spin="1.5" />
          Have something <span data-annotate="circle">in mind</span>?
        </p>
        <a href={`mailto:${SITE.email}`} className="footer-email" data-split>
          {SITE.email}
        </a>
      </div>

      <div className="footer-grid">
        <div className="footer-col">
          <span className="footer-label">Pages</span>
          <TLink href="/">Home</TLink>
          {NAV_LINKS.map(({ href, label }) => <TLink key={href} href={href}>{label}</TLink>)}
        </div>
        <div className="footer-col">
          <span className="footer-label">Elsewhere</span>
          <a href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="/journal/feed.xml">RSS</a>
        </div>
        <div className="footer-col">
          <span className="footer-label">Chennai</span>
          <LocalTime />
        </div>
        <div className="footer-col footer-copy">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
        </div>
      </div>
    </footer>
  );
}
