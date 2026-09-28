"use client";
import { useEffect, useMemo, useState } from "react";
import ImageDrop from "./ImageDrop";
import { api, pendingSrc, resolveSrc, slugify, uploadImage, type LocalImage } from "@/lib/admin/client";
import type { AdminProject, PendingUpload } from "@/lib/admin/types";

type Status = { kind: "idle" | "saving" | "saved" | "error"; text?: string; url?: string };

const blank = (): AdminProject => ({
  slug: "", name: "", year: String(new Date().getFullYear()), role: "", summary: "",
  description: [], highlights: [], stack: [],
});

/* Textareas edit arrays: paragraphs are separated by blank lines, list items by new lines. */
const paras = (v: string) => v.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
const lines = (v: string) => v.split("\n").map((s) => s.trim()).filter(Boolean);

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<AdminProject[] | null>(null);
  const [saved, setSaved] = useState<AdminProject[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [locals, setLocals] = useState<Record<string, LocalImage>>({});
  const [committedPreviews, setCommittedPreviews] = useState<Record<string, string>>({});
  const [rawBase, setRawBase] = useState("");
  const [uploading, setUploading] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Draft text for the array fields, so typing blank lines doesn't get normalised away mid-edit
  const [text, setText] = useState<Record<string, string>>({});

  useEffect(() => {
    api<{ rawBase: string }>("/api/admin/config").then((c) => setRawBase(c.rawBase)).catch(() => {});
    api<{ projects: AdminProject[] }>("/api/admin/projects")
      .then((d) => { setProjects(d.projects); setSaved(d.projects); })
      .catch((e) => setStatus({ kind: "error", text: e.message }));
  }, []);

  const dirty = useMemo(() => JSON.stringify(projects) !== JSON.stringify(saved), [projects, saved]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!projects) {
    return (
      <div className="admin-page">
        <h1 className="admin-title">Projects</h1>
        {status.kind === "error" ? <p className="admin-error">{status.text}</p> : <p className="admin-sub">Loading…</p>}
      </div>
    );
  }

  const update = (i: number, patch: Partial<AdminProject>) =>
    setProjects((ps) => ps!.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= projects.length) return;
    const next = [...projects];
    [next[i], next[j]] = [next[j], next[i]];
    setProjects(next);
    setText({});
    setOpen((o) => (o === i ? j : o === j ? i : o));
  };

  const add = () => {
    setProjects([...projects, blank()]);
    setOpen(projects.length);
  };

  const removeAt = (i: number) => {
    if (!confirm(`Remove "${projects[i].name || "this project"}"? It disappears from the site when you save.`)) return;
    setProjects(projects.filter((_, j) => j !== i));
    setText({});
    setOpen(null);
  };

  const addCover = async (i: number, files: File[]) => {
    setUploading(i);
    try {
      const img = await uploadImage(files[0]);
      setLocals((l) => ({ ...l, [img.id]: img }));
      update(i, { cover: { src: pendingSrc(img.id), alt: projects[i].cover?.alt ?? "", width: img.width, height: img.height } });
    } catch (e) {
      setStatus({ kind: "error", text: (e as Error).message });
    } finally {
      setUploading(null);
    }
  };

  const src = (s: string) => committedPreviews[s] ?? resolveSrc(s, rawBase, locals);
  const field = (i: number, key: string, value: string[], join: string) => text[`${i}:${key}`] ?? value.join(join);

  const save = async () => {
    setStatus({ kind: "saving", text: "Saving projects…" });
    const uploads: PendingUpload[] = [];
    const previews: Record<string, string> = {};
    const final = projects.map((p) => {
      if (!p.cover?.src.startsWith("pending:")) return p;
      const l = locals[p.cover.src.slice(8)];
      if (!l) return { ...p, cover: undefined };
      const publicSrc = `/work/${p.slug}/${l.filename}`;
      uploads.push({ path: `public${publicSrc}`, sha: l.sha });
      previews[publicSrc] = l.previewUrl;
      return { ...p, cover: { ...p.cover, src: publicSrc } };
    });
    const used = new Set(final.map((p) => p.cover?.src).filter(Boolean));
    const removeImages = saved
      .map((p) => p.cover?.src)
      .filter((s): s is string => !!s && s.startsWith("/work/") && !used.has(s))
      .map((s) => `public${s}`);

    try {
      const res = await api<{ commit: { url: string } }>("/api/admin/projects", {
        method: "PUT",
        body: JSON.stringify({ projects: final, uploads, removeImages }),
      });
      setCommittedPreviews((c) => ({ ...c, ...previews }));
      setProjects(final);
      setSaved(final);
      setStatus({ kind: "saved", text: "Saved. The site redeploys in about a minute.", url: res.commit.url });
    } catch (e) {
      setStatus({ kind: "error", text: (e as Error).message });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-head">
        <div>
          <h1 className="admin-title">Projects</h1>
          <p className="admin-sub">
            Order here is the order on the site. <strong>Featured</strong> projects appear in the home page reel
            ({projects.filter((p) => p.featured).length} featured).
          </p>
        </div>
        <div className="editor-actions">
          <button type="button" className="abtn" onClick={add}>Add project</button>
          <button type="button" className="abtn abtn-primary" onClick={save} disabled={!dirty || status.kind === "saving" || uploading !== null}>
            Save changes
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

      <ol className="aprojects">
        {projects.map((p, i) => (
          <li key={i} className={`aproject ${open === i ? "is-open" : ""}`}>
            <div className="aproject-row">
              <span className="tabular admin-row-date">{String(i + 1).padStart(2, "0")}</span>
              <button type="button" className="aproject-name" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                {p.name || "New project"} <small>{p.year}</small>
              </button>
              <label className="acheck">
                <input type="checkbox" checked={Boolean(p.featured)} onChange={(e) => update(i, { featured: e.target.checked || undefined })} />
                Featured
              </label>
              <div className="agallery-actions">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === projects.length - 1} aria-label="Move down">↓</button>
                <button type="button" onClick={() => removeAt(i)} aria-label="Remove project">✕</button>
              </div>
            </div>

            {open === i && (
              <div className="aproject-form">
                <div className="afield-row">
                  <label className="afield">
                    <span>Name</span>
                    <input
                      value={p.name}
                      onChange={(e) => update(i, { name: e.target.value, slug: saved.some((s) => s.slug === p.slug) ? p.slug : slugify(e.target.value) })}
                    />
                  </label>
                  <label className="afield">
                    <span>URL</span>
                    <div className="afield-prefix"><em>/work/</em>
                      <input value={p.slug} onChange={(e) => update(i, { slug: slugify(e.target.value) })} />
                    </div>
                  </label>
                </div>
                <div className="afield-row">
                  <label className="afield"><span>Year</span><input value={p.year} onChange={(e) => update(i, { year: e.target.value })} placeholder="2024 or 2023–" /></label>
                  <label className="afield"><span>Role</span><input value={p.role} onChange={(e) => update(i, { role: e.target.value })} /></label>
                  <label className="afield"><span>Link</span><input type="url" value={p.link ?? ""} onChange={(e) => update(i, { link: e.target.value || undefined })} placeholder="https://" /></label>
                </div>
                <label className="afield">
                  <span>One-line summary <small>shown in lists and the home reel</small></span>
                  <input value={p.summary} onChange={(e) => update(i, { summary: e.target.value })} />
                </label>
                <label className="afield">
                  <span>Description <small>blank line between paragraphs</small></span>
                  <textarea
                    rows={6}
                    value={field(i, "description", p.description, "\n\n")}
                    onChange={(e) => { setText((t) => ({ ...t, [`${i}:description`]: e.target.value })); update(i, { description: paras(e.target.value) }); }}
                  />
                </label>
                <div className="afield-row">
                  <label className="afield">
                    <span>Highlights <small>one per line</small></span>
                    <textarea
                      rows={4}
                      value={field(i, "highlights", p.highlights, "\n")}
                      onChange={(e) => { setText((t) => ({ ...t, [`${i}:highlights`]: e.target.value })); update(i, { highlights: lines(e.target.value) }); }}
                    />
                  </label>
                  <label className="afield">
                    <span>Stack <small>one per line</small></span>
                    <textarea
                      rows={4}
                      value={field(i, "stack", p.stack, "\n")}
                      onChange={(e) => { setText((t) => ({ ...t, [`${i}:stack`]: e.target.value })); update(i, { stack: lines(e.target.value) }); }}
                    />
                  </label>
                </div>
                <div className="afield">
                  <span>Cover image <small>optional — replaces the typographic card in the reel</small></span>
                  {p.cover ? (
                    <div className="acover">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src(p.cover.src)} alt="" />
                      <div className="acover-side">
                        <input value={p.cover.alt} placeholder="Describe the image (alt text)" onChange={(e) => update(i, { cover: { ...p.cover!, alt: e.target.value } })} />
                        <div className="acover-actions">
                          <ImageDrop label="Replace" onFiles={(f) => addCover(i, f)} busy={uploading === i} />
                          <button type="button" className="abtn abtn-small" onClick={() => update(i, { cover: undefined })}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ImageDrop label="Add a cover image" onFiles={(f) => addCover(i, f)} busy={uploading === i} />
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
