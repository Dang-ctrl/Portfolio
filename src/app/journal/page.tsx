import type { Metadata } from "next";
import JournalIndex from "@/components/JournalIndex";
import { getPostMetas } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Hackathons, events, things I shipped and what I learned along the way.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <main className="page">
      <header className="page-head">
        <h1 className="h-page" data-split>Journal</h1>
        <p className="page-intro" data-reveal>
          Hackathons, events, things I shipped and what I learned along the way. Written as it happens.
        </p>
      </header>
      <JournalIndex posts={getPostMetas()} />
    </main>
  );
}
