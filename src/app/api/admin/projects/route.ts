import { handle } from "@/lib/admin/http";
import { commit, readFile, type Change } from "@/lib/admin/github";
import { PROJECTS_FILE, ValidationError, assertImagePath, validateProjects } from "@/lib/admin/content";
import type { PendingUpload } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    const file = await readFile(PROJECTS_FILE);
    return { projects: file ? JSON.parse(file.text) : [] };
  });
}

/* Replace the whole project list (order matters: it's the display order).
   Body: { projects, uploads: PendingUpload[], removeImages: string[] } */
export async function PUT(req: Request) {
  return handle(async () => {
    const body = await req.json();
    const projects = validateProjects(body.projects);
    const uploads: PendingUpload[] = Array.isArray(body.uploads) ? body.uploads : [];
    const removeImages: string[] = Array.isArray(body.removeImages) ? body.removeImages : [];

    const changes: Change[] = [{ path: PROJECTS_FILE, content: JSON.stringify(projects, null, 2) + "\n" }];
    for (const u of uploads) {
      assertImagePath(u.path, "public/work/");
      if (typeof u.sha !== "string" || !/^[0-9a-f]{40}$/.test(u.sha)) throw new ValidationError("Bad upload reference.");
      changes.push({ path: u.path, blobSha: u.sha });
    }
    for (const p of removeImages) {
      assertImagePath(p, "public/work/");
      if (!uploads.some((u) => u.path === p)) changes.push({ path: p, delete: true });
    }

    const result = await commit(`work: update projects (${projects.length})`, changes);
    return { ok: true, commit: result };
  });
}
