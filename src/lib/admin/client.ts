"use client";

/* Browser-side helpers for the admin portal. */

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { ...(init.body ? { "Content-Type": "application/json" } : {}), ...init.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const today = () => new Date().toISOString().slice(0, 10);

/* ── Images ── */

export interface LocalImage {
  id: string;          // referenced as `pending:<id>` until the post is saved
  sha: string;         // git blob sha returned by /api/admin/upload
  filename: string;    // final file name (folder is decided at save time)
  previewUrl: string;  // object URL for previews
  width: number;
  height: number;
}

const MAX_EDGE = 2000;

/* Resize to ≤ 2000px on the long edge and re-encode (WebP where supported, else JPEG). */
async function compress(file: File) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => {
    throw new Error(`Couldn't read ${file.name}. Try a JPEG or PNG (iPhone HEIC photos: export as JPEG first).`);
  });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const toBlob = (type: string, q: number) =>
    new Promise<Blob | null>((res) => canvas.toBlob(res, type, q));
  let blob = await toBlob("image/webp", 0.82);
  let ext = "webp";
  if (!blob || blob.type !== "image/webp") {
    blob = await toBlob("image/jpeg", 0.85);
    ext = "jpg";
  }
  if (!blob) throw new Error(`Couldn't compress ${file.name}.`);
  return { blob, ext, width, height };
}

function toBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

/* Compress + upload one file as a git blob. Nothing is published until save. */
export async function uploadImage(file: File): Promise<LocalImage> {
  const { blob, ext, width, height } = await compress(file);
  const { sha } = await api<{ sha: string }>("/api/admin/upload", {
    method: "POST",
    body: JSON.stringify({ data: await toBase64(blob) }),
  });
  const id = Math.random().toString(36).slice(2, 8);
  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 40) || "photo";
  return { id, sha, filename: `${base}-${id}.${ext}`, previewUrl: URL.createObjectURL(blob), width, height };
}

export const pendingSrc = (id: string) => `pending:${id}`;

/* Resolve an image src for previews: pending uploads → object URLs;
   committed files → the raw GitHub URL (works before the site redeploys). */
export function resolveSrc(src: string, rawBase: string, locals: Record<string, LocalImage>) {
  if (src.startsWith("pending:")) return locals[src.slice(8)]?.previewUrl ?? "";
  if (src.startsWith("/") && rawBase) return `${rawBase}/public${src}`;
  return src;
}
