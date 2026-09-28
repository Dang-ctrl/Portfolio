import { handle } from "@/lib/admin/http";
import { listDir, readFile } from "@/lib/admin/github";
import { JOURNAL_DIR, parsePostFile } from "@/lib/admin/content";
import type { AdminPostSummary } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

/* All journal posts on the branch, drafts included, newest first. */
export async function GET() {
  return handle(async () => {
    const files = (await listDir(JOURNAL_DIR)).filter((f) => f.type === "file" && /\.md$/.test(f.name) && !f.name.startsWith("_"));
    const posts = await Promise.all(
      files.map(async (f): Promise<AdminPostSummary | null> => {
        const file = await readFile(f.path);
        if (!file) return null;
        const p = parsePostFile(f.name.replace(/\.md$/, ""), file.text);
        return { slug: p.slug, title: p.title, date: p.date, category: p.category, draft: p.draft };
      })
    );
    return {
      posts: posts.filter((p): p is AdminPostSummary => !!p).sort((a, b) => (a.date < b.date ? 1 : -1)),
    };
  });
}
