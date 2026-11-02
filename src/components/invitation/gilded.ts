import type { CSSProperties } from "react";

export const GILDED_COLOURS = [
  ["wine", "Main / burgundy"],
  ["gold", "Gold details"],
  ["ivory", "Page background"],
  ["ink", "Text"],
  ["muted", "Secondary text"],
] as const;

export const GILDED_PALETTES = [
  {
    name: "Original Burgundy & Gold",
    wine: "#781c32",
    gold: "#b88a43",
    ivory: "#faf7f0",
    ink: "#42332f",
    muted: "#84756c",
  },
  {
    name: "Forest & Champagne",
    wine: "#24513d",
    gold: "#b99758",
    ivory: "#f5f8f0",
    ink: "#2e4033",
    muted: "#6a7a6b",
  },
  {
    name: "Navy & Gold",
    wine: "#243e67",
    gold: "#b88a43",
    ivory: "#f3f6fb",
    ink: "#303c4e",
    muted: "#738096",
  },
  {
    name: "Plum & Rose Gold",
    wine: "#6d345e",
    gold: "#b88673",
    ivory: "#fbf4f8",
    ink: "#483545",
    muted: "#8b7484",
  },
] as const;

export const GILDED_FONTS = [
  { value: "classic", label: "Classic Cormorant", family: "var(--font-cormorant), serif" },
  { value: "script", label: "Great Vibes Calligraphy", family: "var(--font-great-vibes), cursive" },
  { value: "modern", label: "Modern DM Sans", family: "var(--font-gilded-body), sans-serif" },
] as const;

export interface GildedSettings {
  wine: string;
  gold: string;
  ivory: string;
  ink: string;
  muted: string;
  font: "classic" | "script" | "modern";
  storyHeading: string;
  storyText: string;
  quote: string;
  musicUrl: string;
  eventDates: string[];
  eventMaps: string[];
}

export const DEFAULT_GILDED: GildedSettings = {
  wine: "#781c32",
  gold: "#b88a43",
  ivory: "#faf7f0",
  ink: "#42332f",
  muted: "#84756c",
  font: "classic",
  storyHeading: "Every love story is beautiful, but ours is our favourite.",
  storyText:
    "What began as a simple hello blossomed into a lifetime of laughter, adventures and dreams. We can't wait to celebrate this next chapter with the people we love most.",
  quote: "Two hearts, one beautiful journey.",
  musicUrl: "",
  eventDates: [],
  eventMaps: [],
};

export function isGildedUrl(value: string) {
  return value === "" || /^(https:\/\/|\/(?!\/))/.test(value);
}

export function gildedSettings(value: unknown): GildedSettings {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const result = { ...DEFAULT_GILDED, eventDates: [], eventMaps: [] } as GildedSettings;
  for (const [key] of GILDED_COLOURS) {
    if (typeof source[key] === "string" && /^#[0-9a-f]{6}$/i.test(source[key]))
      result[key] = source[key];
  }
  const font = GILDED_FONTS.find((font) => font.value === source.font);
  if (font) result.font = font.value;
  for (const key of ["storyHeading", "storyText", "quote"] as const) {
    if (typeof source[key] === "string")
      result[key] = source[key].slice(0, key === "storyText" ? 4000 : 500);
  }
  if (typeof source.musicUrl === "string" && isGildedUrl(source.musicUrl))
    result.musicUrl = source.musicUrl.slice(0, 1000);
  if (Array.isArray(source.eventDates))
    result.eventDates = source.eventDates
      .slice(0, 20)
      .map((date) =>
        typeof date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(date) &&
        !Number.isNaN(Date.parse(`${date}T00:00:00`))
          ? date
          : "",
      );
  if (Array.isArray(source.eventMaps))
    result.eventMaps = source.eventMaps
      .slice(0, 20)
      .map((url) => (typeof url === "string" && /^https:\/\//.test(url) ? url.slice(0, 1000) : ""));
  return result;
}

export function gildedStyle(settings: GildedSettings): CSSProperties {
  const font = GILDED_FONTS.find((font) => font.value === settings.font) ?? GILDED_FONTS[0];
  const channels = settings.wine
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => parseInt(channel, 16) / 255);
  const brightness = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return {
    "--wine": settings.wine,
    "--gold": settings.gold,
    "--ivory": settings.ivory,
    "--ink": settings.ink,
    "--muted": settings.muted,
    "--gilded-heading": font.family,
    "--gilded-soft": "color-mix(in srgb, var(--gold) 14%, var(--ivory))",
    "--gilded-border": "color-mix(in srgb, var(--gold) 45%, var(--ivory))",
    "--gilded-on-wine": brightness > 0.6 ? "#241c20" : "#ffffff",
    "--gilded-hero-start":
      settings.ivory === DEFAULT_GILDED.ivory
        ? "#fffdf9"
        : "color-mix(in srgb, var(--ivory) 65%, white)",
    "--gilded-hero-mid":
      settings.ivory === DEFAULT_GILDED.ivory
        ? "#f9f0e4"
        : "color-mix(in srgb, var(--gold) 12%, var(--ivory))",
    "--gilded-hero-end":
      settings.ivory === DEFAULT_GILDED.ivory
        ? "#efdfc8"
        : "color-mix(in srgb, var(--gold) 24%, var(--ivory))",
  } as CSSProperties;
}
