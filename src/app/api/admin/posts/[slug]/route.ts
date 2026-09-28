import { handle } from "@/lib/admin/http";
import { commit, listDir, readFile, type Change } from "@/lib/admin/github";
import {
  JOURNAL_DIR, ValidationError, assertImagePath, assertSlug, parsePostFile, serializePost, validatePost,
} from "@/lib/admin/content";
import type { PendingUpload } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string } };
const postPath = (slug: string) => `${JOURNAL_DIR}/${slug}.md`;

export async function GET(_req: Request, { params }: Params) {
  return handle(async () => {
    assertSlug(params.slug);
    const file = await readFile(postPath(params.slug));
    if (!file) throw new ValidationError("Post not found.");
    return { post: parsePostFile(params.slug, file.text) };
  });
}

/* Create or update a post (and its photos) in one commit.
   Body: { post, isNew, previousSlug?, uploads: PendingUpload[], removeImages: string[] } */
export async function PUT(req: Request, { params }: Params) {
  return handle(async () => {
    const body = await req.json();
    const post = validatePost({ ...body.post, slug: params.slug });
    const uploads: PendingUpload[] = Array.isArray(body.uploads) ? body.uploads : [];
    const removeImages: string[] = Array.isArray(body.removeImages) ? body.removeImages : [];
    const previousSlug = typeof body.previousSlug === "string" && body.previousSlug ? body.previousSlug : null;

    const renamed = previousSlug && previousSlug !== post.slug;
    if (body.isNew || renamed) {
      if (await readFile(postPath(post.slug))) {
        throw new ValidationError(`A post with the slug "${post.slug}" already exists.`);
      }
    }

    const changes: Change[] = [{ path: postPath(post.slug), content: serializePost(post) }];
    if (renamed) {
      assertSlug(previousSlug);
      changes.push({ path: postPath(previousSlug), delete: true });
    }
    for (const u of uploads) {
      assertImagePath(u.path, "public/journal/");
      if (typeof u.sha !== "string" || !/^[0-9a-f]{40}$/.test(u.sha)) throw new ValidationError("Bad upload reference.");
      changes.push({ path: u.path, blobSha: u.sha });
    }
    for (const p of removeImages) {
      assertImagePath(p, "public/journal/");
      if (!uploads.some((u) => u.path === p)) changes.push({ path: p, delete: true });
    }

    const verb = body.isNew ? (post.draft ? "Draft" : "Publish") : post.draft ? "Update draft" : "Update";
    const result = await commit(`journal: ${verb.toLowerCase()} "${post.title}"`, changes);
    return { ok: true, slug: post.slug, commit: result };
  });
}

/* Delete a post and the photos stored in its folder. */
export async function DELETE(_req: Request, { params }: Params) {
  return handle(async () => {
    assertSlug(params.slug);
    const file = await readFile(postPath(params.slug));
    if (!file) throw new ValidationError("Post not found.");
    const images = (await listDir(`public/journal/${params.slug}`)).filter((f) => f.type === "file");
    const post = parsePostFile(params.slug, file.text);
    const result = await commit(`journal: delete "${post.title}"`, [
      { path: postPath(params.slug), delete: true },
      ...images.map((f) => ({ path: f.path, delete: true as const })),
    ]);
    return { ok: true, commit: result };
  });
}
