import type { Metadata, Viewport } from "next";
import { Anton, DM_Sans, DM_Mono, Cormorant_Garamond, Lora } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import PageWipe      from "@/components/PageWipe";
import Nav           from "@/components/Nav";
import CustomCursor     from "@/components/CustomCursor";
import ConcentricRings  from "@/components/ConcentricRings";

const anton     = Anton({ subsets:["latin"], weight:"400", variable:"--font-anton", display:"swap" });
const dmSans    = DM_Sans({ subsets:["latin"], weight:["300","400","500"], variable:"--font-sans", display:"swap" });
const dmMono    = DM_Mono({ subsets:["latin"], weight:["300","400"], variable:"--font-mono", display:"swap" });
const cormorant = Cormorant_Garamond({ subsets:["latin"], weight:["300","400"], style:["normal","italic"], variable:"--font-serif", display:"swap" });
const lora      = Lora({ subsets:["latin"], weight:["400","500"], style:["normal","italic"], variable:"--font-body", display:"swap" });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Vidit Dang",
  description: "Builder, creative technologist, and Corporate Rep at 4ZE Racing. B.Tech CSE at SRM University.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${dmSans.variable} ${dmMono.variable} ${cormorant.variable} ${lora.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ConcentricRings />
          <div id="page-wipe" aria-hidden />
          <PageWipe />
          <CustomCursor />
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
