import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Curtain from "@/components/motion/Curtain";
import Reveals from "@/components/motion/Reveals";
import { SITE, SITE_URL } from "@/lib/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#0b0b0a" },
    { media: "(prefers-color-scheme: light)", color: "#ebe9e4" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  openGraph: { type: "website", siteName: SITE.name, title: SITE.title, description: SITE.description, url: "/" },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  alternates: { types: { "application/rss+xml": [{ url: "/journal/feed.xml", title: `${SITE.name} — Journal` }] } },
};

/* Before paint: apply the saved theme, flag JS, and un-hide animated content
   if the motion scripts haven't started within a few seconds. */
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('vj-theme');if(t==='light'){d.classList.remove('dark');}setTimeout(function(){if(!window.__motion)d.classList.add('no-motion')},4000);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main" className="skip-link">Skip to content</a>
          <SmoothScroll />
          <Nav />
          <div id="main">
            {children}
            <Footer />
          </div>
          <Curtain />
          <Reveals />
        </ThemeProvider>
      </body>
    </html>
  );
}
