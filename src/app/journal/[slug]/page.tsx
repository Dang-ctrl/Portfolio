import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TLink from "@/components/TLink";
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
  const older = all[idx + 1];

  return (
    <main className="page">
      <TLink href="/journal" className="back link" data-reveal>← Journal</TLink>

      <article className="post">
        <header className="post-head">
          <p className="post-meta" data-reveal>
            <span>{CATEGORIES[post.category].label}</span>
            <time dateTime={post.date} className="tabular">{formatDate(post.date)}</time>
            {post.location && <span>{post.location}</span>}
          </p>
          <h1 className="h-post" data-split>{post.title}</h1>
          {post.summary && <p className="lede" data-reveal>{post.summary}</p>}
        </header>

        {post.cover && (
          <figure className="post-cover" data-reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt={post.coverAlt ?? ""} />
          </figure>
        )}

        <div className="prose" data-reveal dangerouslySetInnerHTML={{ __html: post.html }} />

        {(post.link || post.tags.length > 0) && (
          <footer className="post-foot" data-reveal>
            {post.tags.length > 0 && <span>{post.tags.join(" · ")}</span>}
            {post.link && <a href={post.link} target="_blank" rel="noopener noreferrer" className="link">Related link ↗</a>}
          </footer>
        )}
      </article>

      {older && (
        <TLink href={`/journal/${older.slug}`} className="next-project">
          <span className="next-label" data-reveal>Previous entry</span>
          <span className="next-name next-name--sm" data-split>{older.title}</span>
        </TLink>
      )}
    </main>
  );
}
