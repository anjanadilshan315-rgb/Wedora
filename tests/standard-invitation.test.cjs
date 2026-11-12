const test = require("node:test");
const assert = require("node:assert/strict");
const load = require("./load-typescript.cjs");
const { STANDARD_SAMPLE, SOLSTICE_SAMPLE, MOONLIT_SAMPLE, SAFFRON_SAMPLE, standardSample, readStandardDetails, readStandardReply } = load("src/lib/standard-invitation.ts");
const { standardGuestListCsv } = load("src/lib/standard-guest-export.ts");
const { standardAppearance, standardPalettes, colorLuminance } = load("src/lib/standard-appearance.ts");

test("Saffron saves its own appearance, events and safe custom settings", () => {
  const details = readStandardDetails(SAFFRON_SAMPLE);
  assert.equal(details.standardLayout, "saffron");
  assert.equal(standardSample("saffron").brideName, "Maya");
  assert.equal(details.events[1].id, "homecoming");
  for (const palette of standardPalettes("saffron")) {
    const appearance = standardAppearance({ ...details, design: palette.code });
    for (const other of [STANDARD_SAMPLE, SOLSTICE_SAMPLE, MOONLIT_SAMPLE]) {
      assert.notEqual(appearance.primary, standardAppearance({ ...other, design: palette.code }).primary);
    }
    const a = colorLuminance(appearance.ink), b = colorLuminance(appearance.paper);
    assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5);
  }
  const custom = readStandardDetails({ ...details, font: "script", motionEnabled: false, customColors: { primary: "#bba344", accent: "#823344", background: "#fffbed" } });
  assert.equal(custom.font, "script"); assert.equal(custom.motionEnabled, false);
  assert.equal(standardAppearance(custom).primary, "#bba344");
});

test("Moonlit keeps its own demo, palettes and saved settings within the Standard contract", () => {
  const saved = readStandardDetails(MOONLIT_SAMPLE);
  assert.equal(saved.standardLayout, "moonlit"); assert.equal(saved.events[1].id, "homecoming");
  assert.equal(standardSample("moonlit").brideName, "Elena");
  for (const palette of standardPalettes("moonlit")) {
    const appearance = standardAppearance({ ...saved, design: palette.code });
    assert.notEqual(appearance.primary, standardAppearance({ ...STANDARD_SAMPLE, design: palette.code }).primary);
    assert.notEqual(appearance.background, standardAppearance({ ...SOLSTICE_SAMPLE, design: palette.code }).background);
    const a = colorLuminance(appearance.ink), b = colorLuminance(appearance.paper);
    assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5);
  }
  assert.equal(readStandardDetails({ ...MOONLIT_SAMPLE, font: "modern", motionEnabled: false }).motionEnabled, false);
});

test("Solstice is a valid Standard layout with its own palettes and safe saved customization", () => {
  const details = readStandardDetails(SOLSTICE_SAMPLE);
  assert.equal(details.standardLayout, "solstice");
  assert.equal(details.events[1].id, "homecoming");
  const solstice = standardAppearance(details);
  const vow = standardAppearance(STANDARD_SAMPLE);
  assert.notEqual(solstice.primary, vow.primary); assert.notEqual(solstice.background, vow.background);
  assert.equal(standardPalettes("solstice")[0].name, "Lagoon & Papaya");
  const custom = readStandardDetails({ ...SOLSTICE_SAMPLE, font: "modern", customColors: { primary: "#135357", accent: "#cc6633", background: "#f4efe4" } });
  assert.equal(standardAppearance(custom).primary, "#135357");
});

test("Appearance upgrades old invitations, preserves new choices and rejects unsafe customization", () => {
  const old = readStandardDetails(STANDARD_SAMPLE);
  assert.equal(old.standardLayout, "vow"); assert.equal(old.font, "classic"); assert.equal(old.motionEnabled, true);
  const colors = { primary: "#844359", accent: "#d4b878", background: "#fff1f3" };
  const selected = readStandardDetails({ ...STANDARD_SAMPLE, standardLayout: "garden", font: "script", customColors: colors, motionEnabled: false, animation: "enchanted" });
  assert.equal(selected.standardLayout, "garden"); assert.equal(selected.font, "script"); assert.equal(selected.customColors.primary, colors.primary); assert.equal(selected.motionEnabled, false);
  for (const patch of [{ standardLayout: "missing" }, { font: "url(evil)" }, { motionEnabled: "false" }, { customColors: null }, { customColors: [] }, { customColors: { ...colors, accent: "red; background: url(evil)" } }, { customColors: { ...colors, primary: "#fff" } }]) assert.equal(readStandardDetails({ ...STANDARD_SAMPLE, ...patch }), null);
});

test("Custom palettes keep text readable on light and dark backgrounds", () => {
  for (const background of ["#ffffff", "#080d15", "#edcfdf", "#758347", "#747474", "#777777", "#888888"]) {
    const result = standardAppearance({ design: "champagne", font: "modern", customColors: { primary: background, accent: "#ffffee", background } });
    const contrast = (a, b) => { const x = colorLuminance(a), y = colorLuminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
    assert.ok(contrast(result.readableAccent, result.paper) >= 4.5, background);
    assert.ok(contrast(result.ink, result.paper) >= 4.5, background);
    assert.ok(contrast(result.muted, result.paper) >= 4.5, background);
    assert.ok(contrast(result.onPrimary, result.primary) >= 4.5);
    assert.equal(result.font.code, "modern");
  }
});

test("Standard validates bounded events, uploaded photos, custom URLs and HTTPS media", () => {
  assert.ok(readStandardDetails(STANDARD_SAMPLE));
  for (const change of [
    { customSlug: "../admin" }, { customSlug: "a" }, { customSlug: "Couple Names" },
    { videoUrl: "javascript:alert(1)" }, { backgroundVideoUrl: "http://example.com/movie.mp4" },
    { gallery: ["https://example.com/tracking.jpg"] }, { gallery: Array(7).fill("data:image/jpeg;base64,/9j/") },
    { animation: "unknown" }, { events: [] }, { events: [STANDARD_SAMPLE.events[0], STANDARD_SAMPLE.events[0]] },
    { events: [{ ...STANDARD_SAMPLE.events[0], date: "2027-02-30" }] },
  ]) assert.equal(readStandardDetails({ ...STANDARD_SAMPLE, ...change }), null, JSON.stringify(change));
  assert.equal(readStandardDetails({ ...STANDARD_SAMPLE, customSlug: "amelia-and-oliver", gallery: ["data:image/jpeg;base64,/9j/"] }).customSlug, "amelia-and-oliver");
});
test("RSVP validates selected events, party sizes and dietary notes; declined parties reserve no attending places", () => {
  const reply = { attending: true, headCount: 3, events: ["wedding", "homecoming"], dietary: " Vegetarian ", message: " See you soon! " };
  assert.equal(readStandardReply(reply, STANDARD_SAMPLE).dietary, "Vegetarian");
  for (const change of [{ headCount: 0 }, { headCount: 11 }, { headCount: 1.5 }, { events: ["unknown"] }, { events: [] }, { events: ["wedding", "wedding"] }, { dietary: "x".repeat(251) }, { message: "x".repeat(601) }]) {
    assert.equal(readStandardReply({ ...reply, ...change }, STANDARD_SAMPLE), null);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(readStandardReply({ ...reply, attending: false }, STANDARD_SAMPLE))), { headCount: 0, events: [], dietary: "Vegetarian", message: "See you soon!" });
});
test("Guest export contains event names and party details with spreadsheet formula protection", () => {
  const csv = standardGuestListCsv([{ token: "test", name: "=SUM(1,1)", status: "attending", repliedAt: null, reply: { headCount: 2, events: ["wedding"], dietary: "+formula", message: 'A "lovely" day' } }], STANDARD_SAMPLE.events);
  assert.ok(csv.includes("Wedding ceremony")); assert.ok(csv.includes("'=SUM(1,1)"));
  assert.ok(csv.includes("'+formula")); assert.ok(csv.includes('A ""lovely"" day'));
});
