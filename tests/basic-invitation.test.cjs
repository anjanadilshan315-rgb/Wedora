const test = require("node:test");
const assert = require("node:assert/strict");
const loadTypeScript = require("./load-typescript.cjs");
const { BASIC_SAMPLE, BASIC_DESIGNS, BASIC_TEMPLATES, BASIC_PLAN, readBasicDetails } = loadTypeScript("src/lib/basic-invitation.ts");
const { guestListCsv } = loadTypeScript("src/lib/guest-export.ts");

test("Basic designs preserve personal details and enforce media boundaries", () => {
  assert.deepEqual(Array.from(BASIC_DESIGNS, (design) => design.code), ["champagne", "sage", "midnight", "rose"]);
  assert.deepEqual(Array.from(BASIC_TEMPLATES, (template) => template.code), ["arch", "editorial", "botanical", "maison"]);
  assert.equal(readBasicDetails(BASIC_SAMPLE).layout, "arch");
  assert.equal(readBasicDetails({ ...BASIC_SAMPLE, layout: "editorial" }).layout, "editorial");
  for (const template of BASIC_TEMPLATES) {
    for (const theme of BASIC_DESIGNS) {
      const parsed = readBasicDetails({ ...BASIC_SAMPLE, layout: template.code, design: theme.code });
      assert.equal(parsed.layout, template.code);
      assert.equal(parsed.design, theme.code);
    }
  }
  for (const design of BASIC_DESIGNS) {
    const result = readBasicDetails({ ...BASIC_SAMPLE, design: design.code, musicUrl: "https://example.com/song.mp3", mapUrl: "https://maps.app.goo.gl/venue", couplePhoto: "data:image/jpeg;base64,/9j/" });
    assert.equal(result.design, design.code);
    assert.equal(result.couplePhoto, "data:image/jpeg;base64,/9j/");
  }
  assert.equal(BASIC_PLAN.guestLimit, 100);
  assert.equal(BASIC_PLAN.watermark, false);
  for (const change of [
    { layout: "unknown" }, { design: "unknown" }, { couplePhoto: "data:image/svg+xml;base64,AAAA" },
    { couplePhoto: "data:image/jpeg;base64," + "A".repeat(1_400_000) },
    { musicUrl: "javascript:alert(1)" }, { musicUrl: "http://example.com/song.mp3" },
    { mapUrl: "https://google.com.attacker.example/" }, { weddingDate: "2027-02-30" },
  ]) assert.equal(readBasicDetails({ ...BASIC_SAMPLE, ...change }), null);
});

test("guest CSV preserves Unicode and quotes while neutralizing spreadsheet formulas", () => {
  const guests = ['සඳුනි, "Guest"', '=HYPERLINK("https://example.com")', '  +SUM(1,2)', 'First\nLast'].map((name) => ({
    name, token: "private-token", status: "pending", repliedAt: null,
  }));
  const csv = guestListCsv(guests);
  assert.ok(csv.startsWith('\uFEFF"Name","Status","Replied at"\r\n'));
  assert.ok(csv.includes('"සඳුනි, ""Guest"""'));
  assert.ok(csv.includes('"\'=HYPERLINK(""https://example.com"")"'));
  assert.ok(csv.includes('"\'  +SUM(1,2)"'));
  assert.ok(csv.includes('"First\nLast"'));
  assert.ok(!csv.includes("private-token"));
});
