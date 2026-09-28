"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TLink from "./TLink";
import { useTheme } from "./ThemeProvider";
import { NAV_LINKS, SITE } from "@/lib/site";
import { getLenis } from "@/lib/motion";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export default function Nav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop(); else lenis?.start();
    document.body.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="header">
        <TLink href="/" className="header-name" aria-label={`${SITE.name} — home`}>
          Vidit Dang
        </TLink>

        <nav className="header-nav" aria-label="Primary">
          {NAV_LINKS.map(({ href, label }) => (
            <TLink key={href} href={href} className="header-link" data-magnetic="0.35" aria-current={isActive(pathname, href) ? "page" : undefined}>
              {label}
            </TLink>
          ))}
          <TLink href="/about#contact" className="header-link" data-magnetic="0.35">Contact</TLink>
          <button type="button" className="header-link header-theme" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </nav>

        <button
          type="button"
          className="header-link header-menu"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div id="menu" className="menu" data-open={open} aria-hidden={!open}>
        <nav aria-label="Mobile">
          {[...NAV_LINKS, { href: "/about#contact", label: "Contact" }].map(({ href, label }) => (
            <TLink key={href} href={href} className="menu-link" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
              {label}
            </TLink>
          ))}
        </nav>
        <div className="menu-foot">
          <button type="button" className="menu-theme" onClick={toggle} tabIndex={open ? 0 : -1}>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <a href={`mailto:${SITE.email}`} tabIndex={open ? 0 : -1}>{SITE.email}</a>
        </div>
      </div>
    </>
  );
}
