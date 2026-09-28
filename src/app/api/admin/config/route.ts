import { handle } from "@/lib/admin/http";
import { githubConfig, rawBaseUrl } from "@/lib/admin/github";

export const dynamic = "force-dynamic";

/* What the admin UI needs to know about where content lives. */
export async function GET() {
  return handle(async () => {
    const { repo, branch, token } = githubConfig();
    return { repo, branch, rawBase: rawBaseUrl(), hasToken: Boolean(token) };
  });
}
