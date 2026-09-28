"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/admin/client";
import { CATEGORIES, formatDate } from "@/lib/journal-shared";
import type { AdminPostSummary } from "@/lib/admin/types";

export default function AdminHome() {
  const [posts, setPosts] = useState<AdminPostSummary[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api<{ posts: AdminPostSummary[] }>("/api/admin/posts")
      .then((d) => setPosts(d.posts))
      .catch((e) => setError(e.message));
  }, []);

  const shown = (posts ?? []).filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Journal</h1>
          <p className="admin-sub">
            {posts ? `${posts.length} posts · ${posts.filter((p) => p.draft).length} drafts` : "Loading…"}
          </p>
        </div>
        <Link href="/admin/journal/new" className="abtn abtn-primary">New post</Link>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}

      {posts && posts.length > 3 && (
        <input className="admin-search" placeholder="Search posts…" value={query} onChange={(e) => setQuery(e.target.value)} />
      )}

      {posts && (
        <ul className="admin-list">
          {shown.map((p) => (
            <li key={p.slug}>
              <Link href={`/admin/journal/${p.slug}`} className="admin-row">
                <span className="admin-row-date tabular">{formatDate(p.date, "short")}</span>
                <span className="admin-row-title">{p.title || "(untitled)"}</span>
                <span className="admin-row-meta">
                  {p.draft && <span className="admin-badge">Draft</span>}
                  {CATEGORIES[p.category].label}
                </span>
              </Link>
            </li>
          ))}
          {!shown.length && <li className="admin-empty">No posts yet — write your first one.</li>}
        </ul>
      )}
    </div>
  );
}
