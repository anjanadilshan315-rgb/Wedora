// Build once, then run this test. It uses a separate disposable database.
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const { randomUUID } = require("node:crypto");
const path = require("node:path");
const { createClient } = require("@libsql/client");
const { BASIC_SAMPLE } = require("./load-typescript.cjs")("src/lib/basic-invitation.ts");

test("Basic Studio persists media, separates plans and enforces 100 guests atomically", { timeout: 120000 }, async () => {
  const base = "http://localhost:3188";
  const database = `file:${path.join(process.cwd(), ".next", `basic-test-${randomUUID()}.db`).replaceAll("\\", "/")}`;
  const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", "3188"], {
    windowsHide: true, env: { ...process.env, FREE_DATABASE_URL: database, FREE_ALLOW_LOCAL_DATABASE: "true" }, stdio: ["ignore", "pipe", "pipe"],
  });
  let log = "";
  server.stdout.on("data", (data) => { log = (log + data).slice(-4000); });
  server.stderr.on("data", (data) => { log = (log + data).slice(-4000); });
  const cookies = new Map();
  async function request(route, method = "GET", data, jar = cookies, plan = "basic") {
    const response = await fetch(`${base}/api/${plan}/${route}`, {
      method, headers: { Origin: base, Cookie: [...jar].map(([key, value]) => `${key}=${value}`).join("; "), ...(data ? { "Content-Type": "application/json" } : {}) },
      ...(data ? { body: JSON.stringify(data) } : {}),
    });
    for (const cookie of response.headers.getSetCookie()) { const [key, value] = cookie.split(";")[0].split("="); jar.set(key, value); }
    return { status: response.status, ...await response.json() };
  }
  let db;
  try {
    let started = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try { if ((await fetch(`${base}/api/basic/session`)).ok) { started = true; break; } } catch {}
      if (server.exitCode !== null) break;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    assert.ok(started, log);
    const details = { ...BASIC_SAMPLE, layout: "maison", weddingDate: "2099-02-20", rsvpDeadline: "2099-02-01", musicUrl: "https://example.com/music.mp3", couplePhoto: "data:image/jpeg;base64,/9j/" };
    assert.equal((await request("invitation", "PUT", { details }, new Map())).status, 401);
    assert.equal((await request("auth/register", "POST", { email: `${randomUUID()}@example.com`, password: "My secure test password 2099!" })).status, 200);
    assert.equal((await request("invitation", "PUT", { details: { ...details, mapUrl: "javascript:alert(1)" } })).status, 400);
    const saved = await request("invitation", "PUT", { details });
    assert.equal(saved.status, 200, saved.error);
    const invitation = saved.data.invitation;
    assert.equal(invitation.details.layout, "maison");
    assert.equal((await request(`public/${invitation.slug}`, "GET", undefined, new Map())).status, 404);
    assert.equal((await request("studio", "GET", undefined, cookies, "free")).data.invitation, null);
    assert.equal((await request("publish", "POST", { version: invitation.version })).status, 200);
    const published = await request(`public/${invitation.slug}`, "GET", undefined, new Map());
    assert.equal(published.data.details.couplePhoto, details.couplePhoto);
    assert.equal(published.data.details.musicUrl, details.musicUrl);
    assert.equal(published.data.details.layout, "maison");
    assert.equal((await fetch(`${base}/basic-invitation`)).status, 200);
    assert.equal((await fetch(`${base}/basic-invitation/dashboard`)).status, 200);
    assert.equal((await fetch(`${base}/celebrate/basic/${invitation.slug}`)).status, 200);
    const added = await request("guests", "POST", { name: "Personal guest" });
    const personal = added.data.guests[0];
    assert.equal((await request(`public/${invitation.slug}/rsvp?guest=${personal.token}`, "POST", { attending: true }, new Map())).status, 200);
    assert.equal((await request(`public/${invitation.slug}/rsvp`, "POST", { name: "General guest", attending: false }, new Map())).status, 200);
    assert.equal((await request("studio", "GET", undefined, new Map())).status, 401);
    // Seed near capacity without consuming the owner action rate limit.
    db = createClient({ url: database });
    await db.batch(Array.from({ length: 96 }, (_, index) => ({
      sql: "INSERT INTO basic_guests(token,invitation_id,name,name_key) VALUES (?,?,?,?)",
      args: [randomUUID(), invitation.id, `Seed ${index}`, `seed ${index}`],
    })), "write");
    const additions = await Promise.all(Array.from({ length: 4 }, (_, index) => request("guests", "POST", { name: `Final guest ${index}` })));
    assert.equal(additions.filter((result) => result.status === 200).length, 2);
    assert.equal(additions.filter((result) => result.status === 409).length, 2);
    assert.equal((await request("studio")).data.guests.length, 100);
    assert.equal((await request(`public/${invitation.slug}/rsvp`, "POST", { name: "Guest 101", attending: true }, new Map())).status, 409);
    assert.equal((await request(`public/${invitation.slug}/rsvp?guest=${personal.token}`, "POST", { attending: false }, new Map())).status, 200);
    assert.equal((await request("guests", "DELETE", { token: personal.token })).status, 200);
    assert.equal((await request(`public/${invitation.slug}?guest=${personal.token}`, "GET", undefined, new Map())).status, 404);
    const changed = await request("invitation", "PUT", { details: { ...details, layout: "arch", venueName: "Changed venue" } });
    assert.equal(changed.data.invitation.slug, invitation.slug);
    assert.equal(changed.data.invitation.details.layout, "arch");
    assert.equal(changed.data.guests.length, 99);
    assert.equal((await request(`public/${invitation.slug}`, "GET", undefined, new Map())).data.details.venueName, details.venueName);
    assert.equal((await request(`public/${invitation.slug}`, "GET", undefined, new Map())).data.details.layout, "maison");
    assert.equal((await request("publish", "POST", { version: invitation.version })).status, 409);
    assert.equal((await request("publish", "POST", { version: changed.data.invitation.version })).status, 200);
    assert.equal((await request(`public/${invitation.slug}`, "GET", undefined, new Map())).data.details.layout, "arch");
    assert.equal((await request("unpublish", "POST", { version: changed.data.invitation.version })).status, 200);
    assert.equal((await request(`public/${invitation.slug}`, "GET", undefined, new Map())).status, 404);
    assert.equal((await request(`public/${invitation.slug}/rsvp`, "POST", { name: "Late guest", attending: true }, new Map())).status, 404);
  } finally {
    db?.close();
    if (server.exitCode === null) { const exited = once(server, "exit"); server.kill(); await exited; }
  }
});
