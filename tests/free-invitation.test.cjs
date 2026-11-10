// Run with: node --test tests/free-invitation.test.cjs
const test = require("node:test");
const assert = require("node:assert/strict");
const loadTypeScript = require("./load-typescript.cjs");
const { FREE_SAMPLE, freeInvitationPath, decodeFreeDetails, readFreeDetails, freeViewData } = loadTypeScript("src/lib/free-invitation.ts");

test("Free template selections survive sharing and old Lotus links still work", () => {
  for (const templateCode of ["tpl_free_arch", "tpl_royal", "tpl_floral", "tpl_modern"]) {
    const link = new URL(freeInvitationPath({ ...FREE_SAMPLE, templateCode }), "https://example.com");
    assert.equal(decodeFreeDetails(link.searchParams.get("details")).templateCode, templateCode);
  }
  assert.ok(decodeFreeDetails(JSON.stringify(FREE_SAMPLE)));
  assert.equal(readFreeDetails({ ...FREE_SAMPLE, templateCode: "tpl_unknown" }), null);
});

test("shared links preserve Sinhala names, punctuation and the selected theme", () => {
  const input = { ...FREE_SAMPLE, brideName: "සඳුනි", groomName: "Tharindu & family", greetingMessage: "Come celebrate! + love? #forever", theme: "jade" };
  const link = new URL(freeInvitationPath(input, "අමා & family"), "https://example.com");
  assert.equal(link.pathname, "/invite/free");
  assert.equal(link.searchParams.get("guest"), "අමා & family");
  const result = decodeFreeDetails(link.searchParams.get("details"));
  assert.equal(result.brideName, input.brideName);
  assert.equal(result.greetingMessage, input.greetingMessage);
  assert.equal(result.theme, "jade");
});

test("malformed or incomplete shared data is rejected", () => {
  for (const input of [null, "", "{", "[]", "{}", "x".repeat(5001)]) assert.equal(decodeFreeDetails(input), null);
  assert.equal(readFreeDetails({ ...FREE_SAMPLE, theme: "unknown" }), null);
  assert.equal(readFreeDetails({ ...FREE_SAMPLE, brideName: " " }), null);
  assert.equal(readFreeDetails({ ...FREE_SAMPLE, venueName: 123 }), null);
  assert.equal(readFreeDetails({ ...FREE_SAMPLE, greetingMessage: "x".repeat(601) }), null);
});

test("dates, time and WhatsApp values are checked before sharing", () => {
  assert.equal(readFreeDetails({ ...FREE_SAMPLE, weddingDate: "2027-02-30" }), null);
  assert.equal(readFreeDetails({ ...FREE_SAMPLE, weddingTime: "24:30" }), null);
  assert.equal(readFreeDetails({ ...FREE_SAMPLE, whatsapp: "javascript:alert(1)" }), null);
  assert.ok(readFreeDetails({ ...FREE_SAMPLE, weddingDate: "2028-02-29", whatsapp: "+94771234567" }));
  assert.ok(readFreeDetails({ ...FREE_SAMPLE, rsvpDeadline: "", whatsapp: "" }));
});

test("unknown link properties are discarded and free data has no paid media", () => {
  const result = readFreeDetails({ ...FREE_SAMPLE, mapUrl: "javascript:alert(1)", plan: "premium" });
  assert.equal(result.mapUrl, undefined);
  assert.equal(result.plan, undefined);
  const view = freeViewData(result, "Guest");
  assert.equal(view.guestName, "Guest");
  assert.equal(view.brideName, FREE_SAMPLE.brideName);
  assert.equal(view.coverPhoto, null);
  assert.equal(view.gallery.length, 0);
});
