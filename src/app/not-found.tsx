import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page container not-found">
      <p className="not-found-num">404</p>
      <p className="lead">
        This page doesn&apos;t exist. Either it never did, or I deleted it at 2am because something felt off.
      </p>
      <Link href="/" className="btn btn-primary">← Back home</Link>
    </main>
  );
}
