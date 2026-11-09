// Build first, then: node --test tests/free-studio.integration.test.cjs
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { randomUUID } = require("node:crypto");
const path = require("node:path");
const { once } = require("node:events");
const loadTypeScript = require("./load-typescript.cjs");
const { FREE_SAMPLE } = loadTypeScript("src/lib/free-invitation.ts");
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("Free Studio stores invitations and replies securely across the full publish lifecycle", { timeout: 120000 }, async (t) => {
  const port = 3187;
  const base = `http://localhost:${port}`;
  const database = `file:${path.join(process.cwd(), ".next", `studio-integration-${randomUUID()}.db`).replaceAll("\\", "/")}`;
  let server;
  let log = "";
  async function start() {
    server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
      windowsHide: true, env: { ...process.env, FREE_DATABASE_URL: database, FREE_ALLOW_LOCAL_DATABASE: "true" }, stdio: ["ignore", "pipe", "pipe"],
    });
    server.stdout.on("data", (data) => { log = (log + data).slice(-6000); });
    server.stderr.on("data", (data) => { log = (log + data).slice(-6000); });
    for (let i = 0; i < 80; i++) {
      if (server.exitCode !== null) throw new Error(`Server stopped: ${log}`);
      try { if ((await fetch(`${base}/api/free/session`)).ok) return; } catch {}
      await pause(250);
    }
    throw new Error(`Server did not start: ${log}`);
  }
  async function stop() { if (server && server.exitCode === null) { const exited = once(server, "exit"); server.kill(); await exited; } }
  const owner = new Map(), other = new Map(), guest = new Map();
  async function request(route, method = "GET", input, cookies = owner, origin = base) {
    const response = await fetch(`${base}/api/free/${route}`, {
      method, headers: { Origin: origin, ...(input === undefined ? {} : { "Content-Type": "application/json" }), Cookie: [...cookies].map(([key, value]) => `${key}=${value}`).join("; ") },
      ...(input === undefined ? {} : { body: JSON.stringify(input) }),
    });
    for (const value of response.headers.getSetCookie()) {
      const first = value.split(";")[0];
      const index = first.indexOf("="); cookies.set(first.slice(0, index), first.slice(index + 1));
    }
    const result = await response.json();
    return { status: response.status, data: result.data, error: result.error, cookies: response.headers.getSetCookie() };
  }
  try {
    await start();
    let saved, published;
    const email = `owner-${randomUUID()}@example.com`;
    const password = "A long test password 2049!";
    const details = { ...FREE_SAMPLE, templateCode: "tpl_modern", weddingDate: "2099-02-20", rsvpDeadline: "2099-02-01" };

    await t.test("mutation requests require the site origin and an authenticated owner", async () => {
      assert.equal((await request("invitation", "PUT", { details }, new Map())).status, 401);
      assert.equal((await request("invitation", "PUT", { details }, new Map(), "https://different.example")).status, 403);
      assert.equal((await request("invitation", "PUT", { details }, new Map(), "null")).status, 403);
    });
    await t.test("accounts use HttpOnly sessions and reject incorrect passwords", async () => {
      const registered = await request("auth/register", "POST", { email, password });
      assert.equal(registered.status, 200, registered.error || log);
      assert.match(registered.cookies[0], /HttpOnly/i);
      assert.match(registered.cookies[0], /SameSite=Lax/i);
      assert.equal((await request("auth/login", "POST", { email, password: "An incorrect password here" }, new Map())).status, 401);
      assert.equal((await request("auth/register", "POST", { email: `other-${randomUUID()}@example.com`, password }, other)).status, 200);
    });
    await t.test("server accepts only Free templates and keeps drafts private", async () => {
      assert.equal((await request("invitation", "PUT", { details: { ...details, templateCode: "tpl_classic", plan: "free" } })).status, 400);
      const result = await request("invitation", "PUT", { details });
      assert.equal(result.status, 200, result.error);
      saved = result.data.invitation;
      assert.equal((await request(`public/${saved.slug}`, "GET", undefined, new Map())).status, 404);
      assert.equal((await request("studio", "GET", undefined, other)).data.invitation, null);
    });
    await t.test("publish creates a stable link; saved draft edits stay private until republished", async () => {
      const first = await request("publish", "POST", { version: saved.version });
      assert.equal(first.status, 200, first.error);
      published = first.data.invitation;
      assert.equal((await request(`public/${saved.slug}`, "GET", undefined, guest)).data.details.venueName, details.venueName);
      const changed = await request("invitation", "PUT", { details: { ...details, venueName: "Updated Wedding Hall" } });
      assert.equal(changed.data.invitation.slug, published.slug);
      assert.equal(changed.data.invitation.hasChanges, true);
      assert.equal((await request(`public/${saved.slug}`, "GET", undefined, guest)).data.details.venueName, details.venueName);
      assert.equal((await request("publish", "POST", { version: published.version })).status, 409);
      const updated = await request("publish", "POST", { version: changed.data.invitation.version });
      assert.equal(updated.status, 200);
      published = updated.data.invitation;
      assert.equal((await request(`public/${saved.slug}`, "GET", undefined, guest)).data.details.venueName, "Updated Wedding Hall");
    });
    let personal;
    await t.test("personal and general-link RSVP replies appear in the owner's inbox", async () => {
      const added = await request("guests", "POST", { name: "Personal Guest" });
      personal = added.data.guests[0];
      assert.equal((await request(`public/${published.slug}/rsvp?guest=${personal.token}`, "POST", { attending: true }, new Map())).status, 200);
      assert.equal((await request(`public/${published.slug}/rsvp`, "POST", { attending: false, name: "General Guest" }, guest)).status, 200);
      const restored = await request(`public/${published.slug}`, "GET", undefined, guest);
      assert.equal(restored.data.guest.status, "declined");
      assert.equal((await request(`public/${published.slug}/rsvp`, "POST", { attending: true }, guest)).status, 200);
      const inbox = (await request("studio")).data.guests;
      assert.equal(inbox.length, 2);
      assert.equal(inbox.filter((entry) => entry.status === "attending").length, 2);
      assert.equal((await request("studio", "GET", undefined, other)).data.guests.length, 0);
      await request("guests", "DELETE", { token: personal.token }, other);
      assert.equal((await request("studio")).data.guests.length, 2);
    });
    await t.test("concurrent requests cannot exceed ten guests; existing guests can still reply", async () => {
      const additions = await Promise.all(Array.from({ length: 12 }, (_, index) => request("guests", "POST", { name: `Guest ${index}` })));
      assert.equal(additions.filter((result) => result.status === 200).length, 8);
      assert.equal(additions.filter((result) => result.status === 409).length, 4);
      assert.equal((await request("studio")).data.guests.length, 10);
      assert.equal((await request(`public/${published.slug}/rsvp`, "POST", { name: "Eleventh guest", attending: true }, new Map())).status, 409);
      assert.equal((await request(`public/${published.slug}/rsvp?guest=${personal.token}`, "POST", { attending: false }, new Map())).status, 200);
      await request("guests", "DELETE", { token: personal.token });
      assert.equal((await request(`public/${published.slug}?guest=${personal.token}`, "GET", undefined, new Map())).status, 404);
    });
    await t.test("data and sessions survive a production server restart", async () => {
      await stop(); await start();
      const restored = await request("studio");
      assert.equal(restored.status, 200, restored.error || log);
      assert.equal(restored.data.invitation.slug, published.slug);
      assert.equal(restored.data.guests.length, 9);
    });
    await t.test("unpublish hides the invitation and rejects new replies", async () => {
      assert.equal((await request("unpublish", "POST", { version: published.version })).status, 200);
      assert.equal((await request(`public/${published.slug}`, "GET", undefined, new Map())).status, 404);
      assert.equal((await request(`public/${published.slug}/rsvp`, "POST", { name: "Late reply", attending: true }, new Map())).status, 404);
      await request("auth/logout", "POST", {});
      assert.equal((await request("studio")).status, 401);
    });
  } finally { await stop(); }
});
