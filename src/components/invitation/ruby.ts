import type { CSSProperties } from "react";

export const RUBY_COLOURS = [
  ["accent", "Hearts / buttons"], ["deep", "Cover background"],
  ["gold", "Gold details"], ["background", "Page background"],
  ["surface", "Cards"], ["text", "Text"],
] as const;

export const RUBY_PALETTES = [
  { id: "ruby", label: "Ruby & Blush", accent: "#8C1D40", deep: "#64142D", gold: "#E8C27A", background: "#FFF3F2", surface: "#FFF9F7", text: "#4E2731" },
  { id: "emerald", label: "Emerald & Gold", accent: "#245C46", deep: "#153C2C", gold: "#DCC080", background: "#F0F6F0", surface: "#FAFCF8", text: "#243C30" },
  { id: "sapphire", label: "Sapphire & Champagne", accent: "#304F83", deep: "#1A2F55", gold: "#E6CEA0", background: "#F0F4FB", surface: "#FAFBFF", text: "#26364E" },
  { id: "plum", label: "Plum & Rose Gold", accent: "#754466", deep: "#48263F", gold: "#DEB5A1", background: "#F8F0F7", surface: "#FFFAFE", text: "#493044" },
  { id: "mocha", label: "Mocha & Ivory", accent: "#76513C", deep: "#493225", gold: "#D6B47C", background: "#F8F3EB", surface: "#FFFCF5", text: "#49392D" },
] as const;

export const RUBY_FONTS = [
  { value: "original", label: "Romantic Elegance", heading: 'var(--font-cormorant), Georgia, serif', names: 'var(--font-great-vibes), cursive' },
  { value: "classic", label: "Classic Serif", heading: 'var(--font-heritage-classic), Georgia, serif', names: 'var(--font-heritage-classic), Georgia, serif' },
  { value: "calligraphy", label: "Wedding Calligraphy", heading: 'var(--font-great-vibes), cursive', names: 'var(--font-great-vibes), cursive' },
  { value: "modern", label: "Modern Minimal", heading: 'var(--font-montserrat), sans-serif', names: 'var(--font-montserrat), sans-serif' },
] as const;

export type RubySettings = Record<(typeof RUBY_COLOURS)[number][0], string> & {
  font: (typeof RUBY_FONTS)[number]["value"];
};

export const DEFAULT_RUBY: RubySettings = {
  accent: "#8C1D40", deep: "#64142D", gold: "#E8C27A",
  background: "#FFF3F2", surface: "#FFF9F7", text: "#4E2731", font: "original",
};

export function rubySettings(value: unknown): RubySettings {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const settings = { ...DEFAULT_RUBY };
  for (const [key] of RUBY_COLOURS) {
    if (typeof source[key] === "string" && /^#[0-9a-f]{6}$/i.test(source[key])) settings[key] = source[key];
  }
  const font = RUBY_FONTS.find(({ value }) => value === source.font);
  if (font) settings.font = font.value;
  return settings;
}

/** Choose readable lettering on custom cover and button colours. */
function contrastText(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)!.map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722 > .179 ? "#231D20" : "#FFF7F3";
}

export function rubyStyle(settings: RubySettings): CSSProperties {
  const font = RUBY_FONTS.find(({ value }) => value === settings.font) ?? RUBY_FONTS[0];
  return {
    ...Object.fromEntries(RUBY_COLOURS.map(([key]) => [`--ruby-${key}`, settings[key]])),
    "--ruby-muted": "color-mix(in srgb, var(--ruby-text) 70%, var(--ruby-surface))",
    "--ruby-border": "color-mix(in srgb, var(--ruby-accent) 25%, var(--ruby-surface))",
    "--ruby-blush": "color-mix(in srgb, var(--ruby-accent) 18%, var(--ruby-background))",
    "--ruby-cover-text": contrastText(settings.deep),
    "--ruby-button-text": contrastText(settings.accent),
    "--ruby-heading-font": font.heading,
    "--ruby-names-font": font.names,
  } as CSSProperties;
}
