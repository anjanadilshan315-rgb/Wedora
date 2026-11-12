const test = require("node:test");
const assert = require("node:assert/strict");
const load = require("./load-typescript.cjs");
const { PREMIUM_SAMPLE, AURELINE_SAMPLE, AURELINE_PALETTES, premiumSample, readPremiumDetails, readPremiumReply, premiumAnalytics, premiumGuestCsv } = load("src/lib/premium-invitation.ts");

test("Evermore preserves its video-opening variants, unique palettes and editable customer details", () => {
  const { EVERMORE_SAMPLE, EVERMORE_PALETTES, premiumOpeningOptions } = load("src/lib/premium-invitation.ts");
  assert.equal(premiumSample("evermore").brideName, "Tharushi");
  for (const { code } of premiumOpeningOptions("evermore")) {
    const details = readPremiumDetails({ ...EVERMORE_SAMPLE, opening: code, font: "timeless", premiumLayout: "letter", brideName: "Custom bride" });
    assert.equal(details.premiumTemplate, "evermore"); assert.equal(details.opening, code);
    assert.equal(details.brideName, "Custom bride"); assert.equal(details.font, "timeless");
    assert.equal(details.events.length, 3); assert.equal(details.customSlug, undefined);
  }
  for (const { name, ...colors } of EVERMORE_PALETTES) {
    assert.ok(name); assert.deepEqual(readPremiumDetails({ ...EVERMORE_SAMPLE, customColors: colors }).customColors, colors);
    assert.notEqual(colors.primary, PREMIUM_SAMPLE.customColors.primary);
    assert.notEqual(colors.primary, AURELINE_SAMPLE.customColors.primary);
  }
});

test("Evermore movie keeps full portrait and landscape images inside its frame", () => {
  const { EVERMORE_SAMPLE } = load("src/lib/premium-invitation.ts");
  const { standardAppearance } = load("src/lib/standard-appearance.ts");
  const { drawEvermoreVideoFrame } = load("src/lib/evermore-video.ts");
  const draws = [];
  const context = new Proxy({}, { get: (_, key) => key === "drawImage" ? (...args) => draws.push(args) : () => {} });
  for (const image of [{ width: 600, height: 1200 }, { width: 1600, height: 900 }]) {
    drawEvermoreVideoFrame(context, EVERMORE_SAMPLE, standardAppearance(EVERMORE_SAMPLE), "Georgia", image, 8000);
    const [, x, y, width, height] = draws.at(-1);
    assert.ok(x >= 150 && y >= 490 && x + width <= 570 && y + height <= 840);
    assert.ok(Math.abs(width / height - image.width / image.height) < .0001);
  }
});

test("Walawwa saves its design, opening variants and customer appearance with the shared Premium schema", () => {
  const { WALAWWA_SAMPLE, WALAWWA_PALETTES, premiumOpeningOptions } = load("src/lib/premium-invitation.ts");
  assert.equal(premiumSample("walawwa").brideName, "Anuki");
  for (const { code } of premiumOpeningOptions("walawwa")) {
    const saved = readPremiumDetails({ ...WALAWWA_SAMPLE, opening: code, font: "modern", headingScale: 1.15 });
    assert.equal(saved.premiumTemplate, "walawwa"); assert.equal(saved.opening, code);
    assert.equal(saved.font, "modern"); assert.equal(saved.headingScale, 1.15);
    assert.equal(saved.customSlug, undefined);
  }
  for (const { name, ...colors } of WALAWWA_PALETTES) {
    assert.ok(name); assert.deepEqual(readPremiumDetails({ ...WALAWWA_SAMPLE, customColors: colors }).customColors, colors);
  }
});

test("Walawwa's shared film renderer keeps full portrait and landscape photos within the frame", () => {
  const { drawWalawwaVideoFrame } = load("src/lib/walawwa-video.ts");
  const { standardAppearance } = load("src/lib/standard-appearance.ts");
  const { WALAWWA_SAMPLE } = load("src/lib/premium-invitation.ts");
  const draws = [];
  const context = new Proxy({}, { get: (_, key) => key === "drawImage" ? (...args) => draws.push(args) : () => {} });
  for (const photo of [{ width: 600, height: 1200 }, { width: 1600, height: 900 }]) {
    for (const elapsed of [0, 6000, 12000]) {
      drawWalawwaVideoFrame(context, WALAWWA_SAMPLE, standardAppearance(WALAWWA_SAMPLE), "Georgia", photo, elapsed);
      const [image, x, y, width, height] = draws.at(-1);
      assert.equal(image, photo); assert.ok(x >= 145 && y >= 470);
      assert.ok(x + width <= 575 && y + height <= 850);
      assert.ok(Math.abs(width / height - photo.width / photo.height) < .0001);
    }
  }
});

test("Aureline keeps distinct palettes and saves its own template/opening while old drafts remain Rose", () => {
  const saved = readPremiumDetails(AURELINE_SAMPLE);
  assert.equal(saved.premiumTemplate, "aureline"); assert.equal(saved.opening, "journey");
  assert.equal(saved.events[1].id, "homecoming"); assert.equal(premiumSample("aureline").brideName, "Nethmi");
  assert.equal(readPremiumDetails(PREMIUM_SAMPLE).premiumTemplate, "rose");
  assert.equal(readPremiumDetails({ ...AURELINE_SAMPLE, premiumTemplate: "unknown" }), null);
  for (const opening of ["journey", "iris", "unfurl"]) assert.equal(readPremiumDetails({ ...AURELINE_SAMPLE, opening }).opening, opening);
  for (const palette of AURELINE_PALETTES) {
    assert.notEqual(palette.primary, PREMIUM_SAMPLE.customColors.primary);
    assert.notEqual(palette.background, PREMIUM_SAMPLE.customColors.background);
  }
});

test("Premium validates typography, privacy and galleries without accepting a custom slug", () => {
  const details = readPremiumDetails({ ...PREMIUM_SAMPLE, customSlug: "not-in-premium" });
  assert.equal(details.brideName, "Ananya"); assert.equal(details.customSlug, undefined);
  assert.equal(readPremiumDetails({ ...PREMIUM_SAMPLE, headingScale: NaN }), null);
  assert.equal(readPremiumDetails({ ...PREMIUM_SAMPLE, letterSpacing: NaN }), null);
  for (const patch of [{ premiumLayout: "evil" }, { opening: "evil" }, { font: "url(evil)" }, { headingScale: 10 }, { letterSpacing: 10 }, { passwordEnabled: "yes" }, { musicUrl: "javascript:alert(1)" }, { galleries: [{ id: "a", title: "Gallery", photos: ["https://unsafe-image.test/x.svg"] }] }, { seatingTables: [{ id: "rose", name: "Rose", capacity: 0 }] }]) assert.equal(readPremiumDetails({ ...PREMIUM_SAMPLE, ...patch }), null);
  const uploaded = readPremiumDetails({ ...PREMIUM_SAMPLE, musicUrl: "/api/premium/media/" + "a".repeat(48) });
  assert.ok(uploaded); assert.equal(readPremiumDetails({ ...PREMIUM_SAMPLE, musicUrl: "/api/premium/media/../secret" }), null);
});
test("Custom RSVP answers are bounded and required choices are enforced server-side", () => {
  const details = { ...PREMIUM_SAMPLE, questions: [{ id: "meal", label: "Meal", type: "select", required: true, options: ["Vegan", "Fish"] }] };
  const reply = { attending: true, headCount: 2, events: ["wedding"], dietary: "", message: "", answers: { meal: "Vegan", ignored: "discard" } };
  assert.deepEqual(readPremiumReply(reply, details).answers, { meal: "Vegan" });
  assert.equal(readPremiumReply({ ...reply, answers: {} }, details), null);
  assert.equal(readPremiumReply({ ...reply, answers: { meal: "Unknown" } }, details), null);
  assert.ok(readPremiumReply({ ...reply, attending: false, answers: {} }, details));
});
test("Premium analytics count people per event and CSV protects custom answers and private notes", () => {
  const guests = [{ name: "=SUM(A1)", token: "a", status: "attending", group: "Friends", notes: "+formula", tableId: "rose", openedAt: "today", visits: 2, repliedAt: null, reply: { headCount: 3, events: ["homecoming"], dietary: "Vegan", message: "Love", answers: { song: "@formula" } } }];
  const stats = premiumAnalytics(guests, PREMIUM_SAMPLE);
  assert.equal(stats.attending, 3); assert.equal(stats.opened, 1); assert.equal(stats.events[1].count, 3); assert.equal(stats.events[0].count, 0);
  const csv = premiumGuestCsv(guests, PREMIUM_SAMPLE);
  assert.ok(csv.includes("'=SUM(A1)")); assert.ok(csv.includes("'+formula")); assert.ok(csv.includes("'@formula")); assert.ok(csv.includes("The Rose Table"));
});
