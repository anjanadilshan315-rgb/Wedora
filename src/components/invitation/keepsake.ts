export interface KeepsakeSettings {
  theme: "luxury" | "dusty-rose" | "sage" | "black-gold" | "lavender";
  sinhala: string;
  blessing: string;
  heading: string;
  dress: string;
  musicUrl: string;
  accent: string;
  gold: string;
  ground: string;
  paper: string;
  paper2: string;
  ink: string;
  photoFrame: "window" | "heart" | "half-circle" | "floral-classic" | "circular-floral" | "geometric" | "elegant-arch" | "royal";
}

export const KEEPSAKE_FRAMES = [
  { value: "floral-classic", label: "Floral Classic Frame" },
  { value: "circular-floral", label: "Circular Floral Frame" },
  { value: "geometric", label: "Geometric Frame" },
  { value: "elegant-arch", label: "Elegant Arch Frame" },
  { value: "royal", label: "Royal Frame" },
  { value: "window", label: "Arched window" },
  { value: "heart", label: "Heart" },
  { value: "half-circle", label: "Half circle" },
] as const;

export const KEEPSAKE_GALLERY_LIMIT = 4;

export const KEEPSAKE_THEMES = [
  { value: "luxury", label: "Luxury Gold & Ivory" },
  { value: "dusty-rose", label: "Dusty Rose & Champagne" },
  { value: "sage", label: "Sage Green & Gold" },
  { value: "black-gold", label: "Black & Gold" },
  { value: "lavender", label: "Lavender & Silver" },
] as const;

export const KEEPSAKE_COLOUR_KEYS = ["accent", "gold", "ground", "paper", "paper2", "ink"] as const;

/** Display the active theme's colours in the editor before a custom colour is saved. */
export const KEEPSAKE_THEME_COLOURS = {
  luxury: { accent: "#C6A667", gold: "#D4AF37", ground: "#FFFFF0", paper: "#FFFFF0", paper2: "#F5EBDD", ink: "#3B2F2F" },
  "dusty-rose": { accent: "#C98C8C", gold: "#C5A46D", ground: "#F7E7CE", paper: "#F7E7CE", paper2: "#F4DADA", ink: "#705C53" },
  sage: { accent: "#A3B18A", gold: "#D4AF37", ground: "#A3B18A", paper: "#FAF9F6", paper2: "#EDE5D8", ink: "#344E41" },
  "black-gold": { accent: "#B89550", gold: "#D4AF37", ground: "#121212", paper: "#F8F6F0", paper2: "#E8DCC8", ink: "#121212" },
  lavender: { accent: "#B8A9C9", gold: "#C0C0C0", ground: "#B8A9C9", paper: "#FAF8FF", paper2: "#E6DFF0", ink: "#51425F" },
} as const;

export const KEEPSAKE_PALETTES = [
  ...KEEPSAKE_THEMES.filter(({ value }) => value !== "luxury").map(({ value, label }) => ({
    label, theme: value, ...KEEPSAKE_THEME_COLOURS[value],
  })),
] as const;

export const DEFAULT_KEEPSAKE: KeepsakeSettings = {
  theme: "luxury",
  sinhala: "විවාහ මංගල්‍යයට ඔබට සාදරයෙන් ආරාධනා කරමු",
  blessing: "With the blessings of the Triple Gem",
  heading: "Join us in celebration",
  dress: "Traditional or formal attire",
  musicUrl: "",
  accent: "",
  gold: "",
  ground: "",
  paper: "",
  paper2: "",
  ink: "",
  photoFrame: "elegant-arch",
};

export function keepsakeSettings(value: unknown): KeepsakeSettings {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const settings = { ...DEFAULT_KEEPSAKE };
  for (const key of ["sinhala", "blessing", "heading", "dress", "musicUrl", ...KEEPSAKE_COLOUR_KEYS] as const) {
    if (typeof source[key] === "string") settings[key] = source[key];
  }
  const theme = KEEPSAKE_THEMES.find(({ value }) => value === source.theme);
  if (theme) settings.theme = theme.value;
  // Continue loading invitations saved with the previous theme names.
  if (source.theme === "betel") settings.theme = "sage";
  if (source.theme === "sapphire") settings.theme = "lavender";
  if (source.theme === "ruby") settings.theme = "dusty-rose";
  const frame = KEEPSAKE_FRAMES.find(({ value }) => value === source.photoFrame);
  if (frame) settings.photoFrame = frame.value;
  return settings;
}
