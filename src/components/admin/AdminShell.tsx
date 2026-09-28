"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "../ThemeProvider";

const TABS = [
  { href: "/admin", label: "Journal" },
  { href: "/admin/projects", label: "Projects" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();

  if (pathname === "/admin/login") return <div className="admin">{children}</div>;

  const active = (href: string) =>
    href === "/admin" ? pathname === "/admin" || pathname.startsWith("/admin/journal") : pathname.startsWith(href);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <div className="admin">
      <header className="admin-bar">
        <Link href="/admin" className="admin-brand">Portal</Link>
        <nav className="admin-tabs" aria-label="Portal">
          {TABS.map((t) => (
            <Link key={t.href} href={t.href} className="admin-tab" aria-current={active(t.href) ? "page" : undefined}>
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="admin-bar-right">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-link">View site ↗</a>
          <button type="button" className="admin-link" onClick={toggle}>{theme === "dark" ? "Light" : "Dark"}</button>
          <button type="button" className="admin-link" onClick={logout}>Sign out</button>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
