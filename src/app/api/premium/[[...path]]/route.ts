import { NextRequest, NextResponse } from "next/server";
import { accountSession, authenticate, endSession, snapshot, saveDraft, publishInvitation, addGuest, removeGuest,
  publicInvitation, replyToInvitation, unlockInvitation, updateGuest, storeMedia, mediaFile, supportRequest, rateLimit, SESSION_COOKIE, SESSION_SECONDS, StudioError } from "@/lib/server/premium-studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path?: string[] }> };
const cookieOptions = (request: NextRequest) => ({ httpOnly: true, sameSite: "lax" as const, secure: request.nextUrl.protocol === "https:", path: "/", maxAge: SESSION_SECONDS });
const json = (data: unknown, status = 200) => NextResponse.json({ data }, { status, headers: { "Cache-Control": "no-store" } });

async function body(request: NextRequest): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new StudioError(415, "Send JSON data.");
  const reader = request.body?.getReader();
  if (!reader) throw new StudioError(400, "Request data is required.");
  let length = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    length += chunk.value.length;
    if (length > 24000000) { await reader.cancel(); throw new StudioError(413, "The submitted details are too long."); }
    chunks.push(chunk.value);
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value;
  } catch { throw new StudioError(400, "The submitted data is invalid."); }
}

async function handle(request: NextRequest, context: Context) {
  try {
    const segments = (await context.params).path ?? [];
    const route = segments.join("/");
    const method = request.method;
    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
    if (method !== "GET") {
      const origin = request.headers.get("origin");
      let sameSite = false;
      try { sameSite = Boolean(origin && new URL(origin).host === request.nextUrl.host); } catch { /* Invalid origins are rejected too. */ }
      if (!sameSite) throw new StudioError(403, "Please submit this form from the Liora website.");
    }
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
    if (method === "POST" && (route === "auth/login" || route === "auth/register")) {
      await rateLimit(`auth:${ip}`, 15, 900);
      const input = await body(request);
      await rateLimit(`email:${String(input.email).trim().toLowerCase()}`, 10, 900);
      const result = await authenticate(route === "auth/register" ? "register" : "login", input);
      const response = json({ user: result.user });
      response.cookies.set(SESSION_COOKIE, result.sessionToken, cookieOptions(request));
      return response;
    }
    if (route === "session" && method === "GET") {
      const user = await accountSession(sessionToken);
      return json({ user: user ? { email: user.email } : null });
    }
    if (route === "auth/logout" && method === "POST") {
      await endSession(sessionToken);
      const response = json({ success: true });
      response.cookies.set(SESSION_COOKIE, "", { ...cookieOptions(request), maxAge: 0 });
      return response;
    }
    if (segments[0] === "public" && /^[a-z0-9][a-z0-9-]{1,63}$/.test(segments[1] || "")) {
      const slug = segments[1];
      const explicitGuest = request.nextUrl.searchParams.get("guest");
      const guestCookie = `premium_guest_${slug}`;
      const guestToken = explicitGuest || request.cookies.get(guestCookie)?.value;
      const access = request.cookies.get(`premium_access_${slug}`)?.value;
      if (segments.length === 3 && segments[2] === "unlock" && method === "POST") {
        await rateLimit(`premium-password:${ip}:${slug}`, 10, 900);
        const code = await unlockInvitation(slug, (await body(request)).password);
        const response = json({ unlocked: true });
        response.cookies.set(`premium_access_${slug}`, code, { ...cookieOptions(request), maxAge: 7 * 86400 });
        return response;
      }
      if (segments.length === 2 && method === "GET") {
        await rateLimit(`premium-view:${ip}:${slug}`, 120, 600);
        return json(await publicInvitation(slug, guestToken, access, true));
      }
      if (segments.length === 3 && segments[2] === "rsvp" && method === "POST") {
        await rateLimit(`rsvp:${ip}:${slug}`, 40, 600);
        const result = await replyToInvitation(slug, await body(request), guestToken, access);
        const response = json(result.invitation);
        response.cookies.set(guestCookie, result.code, cookieOptions(request));
        return response;
      }
      throw new StudioError(404, "Page not found.");
    }
    const user = await accountSession(sessionToken);
    if (segments[0] === "media" && segments.length === 2 && method === "GET" && /^[a-f0-9]{48}$/.test(segments[1])) {
      const media = await mediaFile(segments[1], user?.id, (slug) => request.cookies.get(`premium_access_${slug}`)?.value);
      const headers = { "Content-Type": media.mime, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Accept-Ranges": "bytes" };
      const range = request.headers.get("range");
      if (range) {
        const match = /^bytes=(\d+)-(\d*)$/.exec(range);
        if (!match) return new NextResponse(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${media.bytes.length}` } });
        const start = Number(match[1]), end = match[2] ? Math.min(Number(match[2]), media.bytes.length - 1) : media.bytes.length - 1;
        if (start > end || start >= media.bytes.length) return new NextResponse(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${media.bytes.length}` } });
        return new NextResponse(new Uint8Array(media.bytes.subarray(start, end + 1)), { status: 206, headers: { ...headers, "Content-Length": String(end - start + 1), "Content-Range": `bytes ${start}-${end}/${media.bytes.length}` } });
      }
      return new NextResponse(new Uint8Array(media.bytes), { headers: { ...headers, "Content-Length": String(media.bytes.length) } });
    }
    if (!user) throw new StudioError(401, "Sign in to Premium Studio to save and manage your invitation.");
    if (route === "studio" && method === "GET") return json(await snapshot(user));
    if (method !== "GET") await rateLimit(`owner:${user.id}`, 90, 600);
    if (route === "upload" && method === "POST") {
      const reader = request.body?.getReader();
      if (!reader) throw new StudioError(400, "Choose a file.");
      const chunks: Uint8Array[] = []; let length = 0;
      while (true) { const chunk = await reader.read(); if (chunk.done) break; length += chunk.value.length; if (length > 8 * 1024 * 1024) { await reader.cancel(); throw new StudioError(413, "Choose a media file up to 8 MB."); } chunks.push(chunk.value); }
      return json(await storeMedia(user, request.headers.get("content-type")?.split(";")[0] || "", Buffer.concat(chunks)));
    }
    if (route === "invitation" && method === "PUT") { const input = await body(request); return json(await saveDraft(user, input.details, input.password)); }
    if ((route === "publish" || route === "unpublish") && method === "POST") return json(await publishInvitation(user, (await body(request)).version, route === "publish"));
    if (route === "guests" && method === "POST") return json(await addGuest(user, await body(request)));
    if (route === "guests" && method === "DELETE") return json(await removeGuest(user, (await body(request)).token));
    if (route === "guests" && method === "PATCH") return json(await updateGuest(user, await body(request)));
    if (route === "support" && method === "POST") return json(await supportRequest(user, (await body(request)).message));
    throw new StudioError(404, "Page not found.");
  } catch (error) {
    if (error instanceof StudioError) return NextResponse.json({ error: error.message }, { status: error.status, headers: { "Cache-Control": "no-store" } });
    console.error("Premium Studio request failed:", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({ error: "Premium Studio is temporarily unavailable. Please check the server database configuration or try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;



export const PATCH = handle;
