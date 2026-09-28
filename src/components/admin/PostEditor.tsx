"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import ImageDrop from "./ImageDrop";
import Gallery from "../Gallery";
import { api, pendingSrc, resolveSrc, slugify, today, uploadImage, type LocalImage } from "@/lib/admin/client";
import { CATEGORIES, formatDate, type Category } from "@/lib/journal-shared";
import type { AdminImage, AdminPost, PendingUpload } from "@/lib/admin/types";

const EMPTY: AdminPost = {
  slug: "", title: "", date: today(), category: "achievement", summary: "", location: "",
  tags: [], link: "", draft: true, cover: undefined, gallery: [], body: "",
};

type Status = { kind: "idle" | "saving" | "saved" | "error"; text?: string; url?: string };

const PENDING_RE = /pending:([a-z0-9]{6})/g;
const MD_IMAGE_RE = /(!\[[^\]]*\]\()([^)\s]+)/g;

/* Every image src a post currently uses (cover, gallery, inline). */
function imageSrcs(p: AdminPost) {
  const srcs = new Set<string>();
  if (p.cover) srcs.add(p.cover.src);
  p.gallery.forEach((g) => srcs.add(g.src));
  for (const m of p.body.matchAll(MD_IMAGE_RE)) srcs.add(m[2]);
  return srcs;
}

export default function PostEditor({ slug }: { slug?: string }) {
  const router = useRouter();
  const [isNew, setIsNew] = useState(!slug);
  const [post, setPost] = useState<AdminPost>(EMPTY);
  const [saved, setSaved] = useState<AdminPost | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));
  const [locals, setLocals] = useState<Record<string, LocalImage>>({});
  const [committedPreviews, setCommittedPreviews] = useState<Record<string, string>>({});
  const [rawBase, setRawBase] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [view, setView] = useState<"write" | "preview">("write");
  const body = useRef<HTMLTextAreaElement>(null);

  // Load config + existing post
  useEffect(() => {
    api<{ rawBase: string }>("/api/admin/config").then((c) => setRawBase(c.rawBase)).catch(() => {});
    if (!slug) return;
    api<{ post: AdminPost }>(`/api/admin/posts/${slug}`)
      .then(({ post }) => { setPost(post); setSaved(post); })
      .catch((e) => setStatus({ kind: "error", text: e.message }))
      .finally(() => setLoading(false));
  }, [slug]);

  const dirty = useMemo(() => JSON.stringify(post) !== JSON.stringify(saved ?? EMPTY), [post, saved]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof AdminPost>(key: K, value: AdminPost[K]) => setPost((p) => ({ ...p, [key]: value }));

  const setTitle = (title: string) =>
    setPost((p) => ({ ...p, title, slug: slugTouched ? p.slug : slugify(title) }));

  const src = (s: string) => committedPreviews[s] ?? resolveSrc(s, rawBase, locals);

  /* ── Uploads ── */
  const upload = async (files: File[], label: string) => {
    setUploading(label);
    setStatus({ kind: "idle" });
    const done: LocalImage[] = [];
    try {
      for (const f of files) done.push(await uploadImage(f));
    } catch (e) {
      setStatus({ kind: "error", text: (e as Error).message });
    } finally {
      setUploading(null);
      setLocals((l) => ({ ...l, ...Object.fromEntries(done.map((d) => [d.id, d])) }));
    }
    return done;
  };

  const toImage = (l: LocalImage, alt = ""): AdminImage => ({ src: pendingSrc(l.id), alt, width: l.width, height: l.height });

  const addCover = async (files: File[]) => {
    const [img] = await upload(files, "cover");
    if (img) set("cover", toImage(img, post.cover?.alt ?? ""));
  };

  const addGallery = async (files: File[]) => {
    const imgs = await upload(files, "gallery");
    if (imgs.length) setPost((p) => ({ ...p, gallery: [...p.gallery, ...imgs.map((i) => toImage(i))] }));
  };

  const insertInline = async (files: File[]) => {
    const [img] = await upload(files, "inline");
    if (img) insert(`\n![${img.filename.replace(/-[a-z0-9]{6}\.\w+$/, "")}](${pendingSrc(img.id)})\n`);
  };

  const moveGallery = (i: number, d: number) =>
    setPost((p) => {
      const g = [...p.gallery];
      const j = i + d;
      if (j < 0 || j >= g.length) return p;
      [g[i], g[j]] = [g[j], g[i]];
      return { ...p, gallery: g };
    });

  /* ── Markdown toolbar ── */
  const insert = (before: string, after = "", placeholder = "") => {
    const el = body.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    set("body", next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  };
  const linePrefix = (prefix: string) => {
    const el = body.current;
    if (!el) return;
    const { selectionStart: s, value } = el;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    set("body", value.slice(0, lineStart) + prefix + value.slice(lineStart));
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(s + prefix.length, s + prefix.length); });
  };

  /* ── Save / delete ── */
  const save = async (draft: boolean) => {
    if (!post.title.trim()) return setStatus({ kind: "error", text: "Give the post a title first." });
    if (!post.slug) return setStatus({ kind: "error", text: "The post needs a URL slug." });
    setStatus({ kind: "saving", text: draft ? "Saving draft…" : "Publishing…" });

    // Swap pending image ids for their final paths under /journal/<slug>/
    const uploads: PendingUpload[] = [];
    const previews: Record<string, string> = {};
    const finalSrc = (s: string) =>
      s.replace(PENDING_RE, (_m, id: string) => {
        const l = locals[id];
        if (!l) return _m;
        const publicSrc = `/journal/${post.slug}/${l.filename}`;
        if (!uploads.some((u) => u.sha === l.sha && u.path === `public${publicSrc}`)) {
          uploads.push({ path: `public${publicSrc}`, sha: l.sha });
        }
        previews[publicSrc] = l.previewUrl;
        return publicSrc;
      });

    const final: AdminPost = {
      ...post,
      draft,
      cover: post.cover ? { ...post.cover, src: finalSrc(post.cover.src) } : undefined,
      gallery: post.gallery.map((g) => ({ ...g, src: finalSrc(g.src) })),
      body: finalSrc(post.body),
    };

    // Photos that were in the saved version but aren't used any more get deleted
    const now = imageSrcs(final);
    const removeImages = saved
      ? Array.from(imageSrcs(saved)).filter((s) => s.startsWith("/journal/") && !now.has(s)).map((s) => `public${s}`)
      : [];

    try {
      const res = await api<{ commit: { url: string } }>(`/api/admin/posts/${final.slug}`, {
        method: "PUT",
        body: JSON.stringify({ post: final, isNew, previousSlug: saved?.slug, uploads, removeImages }),
      });
      setCommittedPreviews((c) => ({ ...c, ...previews }));
      setPost(final);
      setSaved(final);
      setSlugTouched(true);
      if (isNew || saved?.slug !== final.slug) {
        setIsNew(false);
        window.history.replaceState(null, "", `/admin/journal/${final.slug}`);
      }
      setStatus({
        kind: "saved",
        text: draft ? "Draft saved to GitHub — not visible on the site." : "Published. The site redeploys in about a minute.",
        url: res.commit.url,
      });
    } catch (e) {
      setStatus({ kind: "error", text: (e as Error).message });
    }
  };

  const remove = async () => {
    if (!saved || !confirm(`Delete "${saved.title}" and its photos? This can be undone from GitHub history, but not from here.`)) return;
    setStatus({ kind: "saving", text: "Deleting…" });
    try {
      await api(`/api/admin/posts/${saved.slug}`, { method: "DELETE" });
      setSaved(post); // clear dirty flag so navigation isn't blocked
      router.push("/admin");
    } catch (e) {
      setStatus({ kind: "error", text: (e as Error).message });
    }
  };

  /* ── Preview ── */
  const previewHtml = useMemo(
    () => marked.parse(post.body.replace(MD_IMAGE_RE, (_m, pre: string, s: string) => `${pre}${src(s)}`), { async: false }) as string,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [post.body, locals, rawBase, committedPreviews]
  );

  if (loading) return <div className="admin-page"><p className="admin-sub">Loading post…</p></div>;

  return (
    <div className="editor">
      <div className="editor-top">
        <Link href="/admin" className="admin-link">← All posts</Link>
        <div className="editor-view" role="tablist" aria-label="Editor view">
          <button type="button" role="tab" aria-selected={view === "write"} onClick={() => setView("write")}>Write</button>
          <button type="button" role="tab" aria-selected={view === "preview"} onClick={() => setView("preview")}>Preview</button>
        </div>
        <div className="editor-actions">
          {!isNew && saved && !saved.draft && (
            <a href={`/journal/${saved.slug}`} target="_blank" rel="noopener noreferrer" className="admin-link">View ↗</a>
          )}
          {!isNew && <button type="button" className="abtn abtn-danger" onClick={remove} disabled={status.kind === "saving"}>Delete</button>}
          <button type="button" className="abtn" onClick={() => save(true)} disabled={status.kind === "saving" || !!uploading}>
            {saved && !saved.draft ? "Unpublish (draft)" : "Save draft"}
          </button>
          <button type="button" className="abtn abtn-primary" onClick={() => save(false)} disabled={status.kind === "saving" || !!uploading}>
            {saved && !saved.draft ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {status.kind !== "idle" && (
        <p className={`admin-status is-${status.kind}`} role="status">
          {status.text}
          {status.url && <> · <a href={status.url} target="_blank" rel="noopener noreferrer">commit ↗</a></>}
        </p>
      )}
      {dirty && status.kind !== "saving" && <p className="admin-dirty">Unsaved changes</p>}

      <div className={`editor-grid view-${view}`}>
        {/* ── Form ── */}
        <section className="editor-form" aria-label="Post details">
          <label className="afield afield-title">
            <span>Title</span>
            <input value={post.title} onChange={(e) => setTitle(e.target.value)} placeholder="What happened?" />
          </label>

          <div className="afield-row">
            <label className="afield">
              <span>URL</span>
              <div className="afield-prefix">
                <em>/journal/</em>
                <input
                  value={post.slug}
                  onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }}
                  placeholder="my-post"
                />
              </div>
            </label>
            <label className="afield">
              <span>Date</span>
              <input type="date" value={post.date} onChange={(e) => set("date", e.target.value)} />
            </label>
            <label className="afield">
              <span>Type</span>
              <select value={post.category} onChange={(e) => set("category", e.target.value as Category)}>
                {Object.entries(CATEGORIES).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
              </select>
            </label>
          </div>

          <label className="afield">
            <span>Summary <small>shown in lists and link previews</small></span>
            <textarea rows={2} value={post.summary} onChange={(e) => set("summary", e.target.value)} />
          </label>

          <div className="afield-row">
            <label className="afield">
              <span>Location</span>
              <input value={post.location} onChange={(e) => set("location", e.target.value)} placeholder="Chennai, India" />
            </label>
            <label className="afield">
              <span>Tags <small>comma separated</small></span>
              <input
                value={post.tags.join(", ")}
                onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trimStart()))}
                onBlur={() => set("tags", post.tags.map((t) => t.trim()).filter(Boolean))}
                placeholder="Hackathon, AI"
              />
            </label>
          </div>

          <label className="afield">
            <span>Link <small>certificate, event page, repo…</small></span>
            <input type="url" value={post.link} onChange={(e) => set("link", e.target.value)} placeholder="https://" />
          </label>

          {/* Cover */}
          <div className="afield">
            <span>Cover photo</span>
            {post.cover ? (
              <div className="acover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src(post.cover.src)} alt="" />
                <div className="acover-side">
                  <input
                    value={post.cover.alt}
                    onChange={(e) => set("cover", { ...post.cover!, alt: e.target.value })}
                    placeholder="Describe the photo (alt text)"
                  />
                  <div className="acover-actions">
                    <ImageDrop label="Replace" onFiles={addCover} busy={uploading === "cover"} />
                    <button type="button" className="abtn abtn-small" onClick={() => set("cover", undefined)}>Remove</button>
                  </div>
                </div>
              </div>
            ) : (
              <ImageDrop label="Add a cover photo" onFiles={addCover} busy={uploading === "cover"} />
            )}
          </div>

          {/* Body */}
          <div className="afield">
            <span>Story</span>
            <div className="atoolbar" role="toolbar" aria-label="Formatting">
              <button type="button" onClick={() => insert("**", "**", "bold")} title="Bold"><b>B</b></button>
              <button type="button" onClick={() => insert("_", "_", "italic")} title="Italic"><i>I</i></button>
              <button type="button" onClick={() => linePrefix("## ")} title="Heading">H</button>
              <button type="button" onClick={() => linePrefix("- ")} title="List">•</button>
              <button type="button" onClick={() => linePrefix("> ")} title="Quote">“</button>
              <button type="button" onClick={() => insert("[", "](https://)", "link text")} title="Link">Link</button>
              <label className="atoolbar-file" title="Insert photo">
                <input type="file" accept="image/*" className="visually-hidden"
                  onChange={(e) => { const f = Array.from(e.target.files ?? []); if (f.length) insertInline(f); e.target.value = ""; }} />
                {uploading === "inline" ? "Uploading…" : "Photo"}
              </label>
            </div>
            <textarea
              ref={body}
              className="abody"
              rows={16}
              value={post.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder={"Write in Markdown.\n\n## Headings, **bold**, _italic_, - lists, > quotes and [links](https://…) all work."}
            />
          </div>

          {/* Gallery */}
          <div className="afield">
            <span>Gallery <small>{post.gallery.length ? `${post.gallery.length} photos` : "shown below the story"}</small></span>
            {post.gallery.length > 0 && (
              <ul className="agallery">
                {post.gallery.map((g, i) => (
                  <li key={`${g.src}-${i}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src(g.src)} alt="" />
                    <input
                      value={g.alt}
                      placeholder="Caption / alt text"
                      onChange={(e) => setPost((p) => ({ ...p, gallery: p.gallery.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)) }))}
                    />
                    <div className="agallery-actions">
                      <button type="button" onClick={() => moveGallery(i, -1)} disabled={i === 0} aria-label="Move left">←</button>
                      <button type="button" onClick={() => moveGallery(i, 1)} disabled={i === post.gallery.length - 1} aria-label="Move right">→</button>
                      <button type="button" onClick={() => set("cover", { ...g })} title="Use as cover">Cover</button>
                      <button type="button" onClick={() => setPost((p) => ({ ...p, gallery: p.gallery.filter((_, j) => j !== i) }))} aria-label="Remove">✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <ImageDrop label="Add photos" multiple onFiles={addGallery} busy={uploading === "gallery"} />
          </div>
        </section>

        {/* ── Live preview (same markup/styles as the public post page) ── */}
        <section className="editor-preview" aria-label="Preview">
          <p className="editor-preview-label">Preview{post.draft ? " · draft" : ""}</p>
          <article className="post post--preview">
            <header className="post-head">
              <p className="post-meta">
                <span>{CATEGORIES[post.category].label}</span>
                <time className="tabular">{formatDate(post.date)}</time>
                {post.location && <span>{post.location}</span>}
              </p>
              <h1 className="h-post">{post.title || "Untitled"}</h1>
              {post.summary && <p className="lede">{post.summary}</p>}
            </header>
            {post.cover && (
              <figure className="post-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src(post.cover.src)} alt={post.cover.alt} />
              </figure>
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            {post.gallery.length > 0 && (
              <Gallery images={post.gallery.map((g) => ({ ...g, src: src(g.src) }))} />
            )}
            {(post.link || post.tags.some(Boolean)) && (
              <footer className="post-foot">
                {post.tags.some(Boolean) && <span>{post.tags.filter(Boolean).join(" · ")}</span>}
                {post.link && <span className="link">Related link ↗</span>}
              </footer>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}
