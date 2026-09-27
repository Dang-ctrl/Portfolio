import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, formatDate, getAllPosts, getPost } from "@/lib/journal";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      images: post.cover ? [{ url: post.cover }] : undefined,
    },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === post.slug);
  const newer = all[idx - 1];
  const older = all[idx + 1];

  return (
    <main className="page container post">
      <Link href="/journal" className="back-link reveal">← Journal</Link>

      <header className="post-head reveal">
        <div className="post-meta">
          <span className="badge" data-cat={post.category}>{CATEGORIES[post.category].label}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.location && <span>· {post.location}</span>}
          <span>· {post.readingMinutes} min read</span>
        </div>
        <h1 className="h1 post-title">{post.title}</h1>
        {post.summary && <p className="lead">{post.summary}</p>}
        {post.tags.length > 0 && (
          <div className="chips">
            {post.tags.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
        )}
      </header>

      {post.cover && (
        <figure className="post-cover reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover} alt={post.coverAlt ?? ""} />
        </figure>
      )}

      <article className="prose reveal" dangerouslySetInnerHTML={{ __html: post.html }} />

      {post.link && (
        <p className="reveal">
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            Related link ↗
          </a>
        </p>
      )}

      <nav className="post-nav reveal" aria-label="More entries">
        {older ? (
          <Link href={`/journal/${older.slug}`} className="post-nav-link">
            <span className="eyebrow">← Older</span>
            <span>{older.title}</span>
          </Link>
        ) : <span />}
        {newer ? (
          <Link href={`/journal/${newer.slug}`} className="post-nav-link post-nav-link--next">
            <span className="eyebrow">Newer →</span>
            <span>{newer.title}</span>
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
