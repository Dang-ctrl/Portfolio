import "server-only";
import { NextResponse } from "next/server";
import { GitHubError } from "./github";
import { ValidationError } from "./content";

/* Shared error handling for admin API routes. */
export async function handle<T>(fn: () => Promise<T>) {
  try {
    return NextResponse.json(await fn());
  } catch (e) {
    if (e instanceof ValidationError) return NextResponse.json({ error: e.message }, { status: 400 });
    if (e instanceof GitHubError) {
      const hint =
        e.status === 401 ? " — check GITHUB_TOKEN." :
        e.status === 403 || e.status === 404 ? " — check the token has Contents: read & write on the repo." : "";
      return NextResponse.json({ error: `GitHub: ${e.message}${hint}` }, { status: e.status >= 500 ? 502 : e.status });
    }
    console.error(e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
