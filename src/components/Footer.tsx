import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-cta">
          <p className="eyebrow">Let&apos;s talk</p>
          <p className="footer-heading">
            Have something worth building? <Link href="/about#contact" className="link-accent">Start a conversation →</Link>
          </p>
        </div>

        <div className="footer-cols">
          <nav aria-label="Footer" className="footer-col">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="footer-link">{label}</Link>
            ))}
          </nav>
          <div className="footer-col">
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub ↗</a>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn ↗</a>
            <a href={`mailto:${SITE.email}`} className="footer-link">Email ↗</a>
            <a href="/journal/feed.xml" className="footer-link">RSS ↗</a>
          </div>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} {SITE.name}</span>
        <span>{SITE.location}</span>
      </div>
    </footer>
  );
}
