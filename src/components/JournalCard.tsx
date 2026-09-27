import Link from "next/link";
import TiltCard from "./TiltCard";
import { CATEGORIES, formatDate, type PostMeta } from "@/lib/journal-shared";

export default function JournalCard({ post, delay = 0 }: { post: PostMeta; delay?: number }) {
  return (
    <TiltCard className="reveal" style={{ transitionDelay: `${delay}ms` }} max={5}>
      <Link href={`/journal/${post.slug}`} className="j-card" data-cat={post.category}>
        {post.cover && (
          <span className="j-card-cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt={post.coverAlt ?? ""} loading="lazy" />
          </span>
        )}
        <span className="j-card-meta">
          <span className="badge" data-cat={post.category}>{CATEGORIES[post.category].label}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </span>
        <span className="j-card-title">{post.title}</span>
        {post.summary && <span className="j-card-summary">{post.summary}</span>}
        <span className="j-card-foot">
          {post.location && <span>{post.location}</span>}
          <span>{post.readingMinutes} min read</span>
        </span>
      </Link>
    </TiltCard>
  );
}
