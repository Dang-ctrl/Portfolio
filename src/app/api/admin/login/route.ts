import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, safeEqual } from "@/lib/admin/session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "The portal isn't set up yet: add ADMIN_PASSWORD in Vercel." }, { status: 503 });
  }

  const { password } = await req.json().catch(() => ({ password: "" }));
  const ok = typeof password === "string" && (await safeEqual(password, expected));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
