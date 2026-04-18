"use client";
import { usePathname } from "next/navigation";
import TLink from "./TLink";
import { useTheme } from "./ThemeProvider";

const LINKS = [
  { href: "/work",     label: "Work"     },
  { href: "/craft",    label: "Craft"    },
  { href: "/thinking", label: "Thinking" },
  { href: "/now",      label: "Now"      },
  { href: "/about",    label: "About"    },
];

export default function Nav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <div className="nav-wrap">
      <div className="nav-top">
        <TLink href="/" className="nav-logo">Vidit Jain</TLink>

        <nav className="nav-links">
          {LINKS.map(({ href, label }) => (
            <TLink
              key={href}
              href={href}
              className="nav-link"
              {...({ "data-active": pathname === href ? "true" : undefined } as object)}>
              {label}
            </TLink>
          ))}
        </nav>

        <div className="nav-right">
          <button className="theme-btn" onClick={toggle} aria-label="Toggle theme">
            {theme === "light" ? "●" : "◐"}
          </button>
          <div className="avail-pill">
            <span className="avail-dot" />
            Available
          </div>
        </div>
      </div>
    </div>
  );
}
