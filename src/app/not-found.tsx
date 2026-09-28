import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page not-found">
      <h1 className="h-page">404</h1>
      <p className="body">This page doesn&apos;t exist — maybe it never did, maybe it got cut in a redesign.</p>
      <Link href="/" className="link">Back home</Link>
    </main>
  );
}
