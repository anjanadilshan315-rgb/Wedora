import { HEIRLOOM_TEXT, type HeirloomStoryMoment } from "./heirloom";

/** Separate settings for the NEW invitation; Heritage Door settings are untouched. */
export interface EnvelopeSettings {
  language: "en" | "si";
  palette: string;
  font: "classic" | "romantic" | "modern";
  main: string;
  accent: string;
  background: string;
  envelope: string;
  musicUrl: string;
  messageSi: string;
  storyEn: string;
  storySi: string;
  dressEn: string;
  dressSi: string;
  timeline: HeirloomStoryMoment[];
}

export const ENVELOPE_PALETTES = [
  {
    id: "burgundy",
    name: "Burgundy",
    main: "#7a1414",
    accent: "#c9a15b",
    background: "#f8eae8",
    envelope: "#a2431f",
  },
  {
    id: "navy",
    name: "Navy Gold",
    main: "#1f3a5f",
    accent: "#c9a15b",
    background: "#eaf0f7",
    envelope: "#2c4a73",
  },
  {
    id: "emerald",
    name: "Emerald",
    main: "#1f5a45",
    accent: "#c4a35a",
    background: "#eaf3ee",
    envelope: "#3d7a62",
  },
  {
    id: "rose",
    name: "Rose Mauve",
    main: "#8a3b5a",
    accent: "#d4a373",
    background: "#fbeef1",
    envelope: "#b5587a",
  },
  {
    id: "purple",
    name: "Royal Purple",
    main: "#5b2a86",
    accent: "#d4af6a",
    background: "#f3ecf8",
    envelope: "#7d4aa8",
  },
  {
    id: "teal",
    name: "Teal Coral",
    main: "#0f6b6b",
    accent: "#e07a5f",
    background: "#e8f4f2",
    envelope: "#1f8a8a",
  },
  {
    id: "noir",
    name: "Noir Gold",
    main: "#2a2a2a",
    accent: "#c9a15b",
    background: "#f5f1ea",
    envelope: "#3a3a3a",
  },
  {
    id: "sage",
    name: "Dusty Sage",
    main: "#5d6b4a",
    accent: "#b8956a",
    background: "#f1f3ea",
    envelope: "#7d8c66",
  },
  {
    id: "peach",
    name: "Peach Blush",
    main: "#b5535f",
    accent: "#d9a066",
    background: "#fff1ea",
    envelope: "#e08a73",
  },
] as const;

export const DEFAULT_ENVELOPE: EnvelopeSettings = {
  language: "en",
  palette: "burgundy",
  font: "classic",
  main: "",
  accent: "",
  background: "",
  envelope: "",
  musicUrl: "",
  messageSi: "",
  storyEn: "",
  storySi: "",
  dressEn: "",
  dressSi: "",
  timeline: [],
};

export function envelopeSettings(value: unknown): EnvelopeSettings {
  const source =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const settings = { ...DEFAULT_ENVELOPE };
  if (source.language === "si") settings.language = "si";
  if (source.font === "romantic" || source.font === "modern")
    settings.font = source.font;
  if (ENVELOPE_PALETTES.some((palette) => palette.id === source.palette))
    settings.palette = source.palette as string;
  for (const key of ["main", "accent", "background", "envelope"] as const) {
    if (typeof source[key] === "string" && /^#[0-9a-f]{6}$/i.test(source[key]))
      settings[key] = source[key];
  }
  for (const key of [
    "messageSi",
    "storyEn",
    "storySi",
    "dressEn",
    "dressSi",
  ] as const) {
    if (typeof source[key] === "string") settings[key] = source[key];
  }
  if (
    typeof source.musicUrl === "string" &&
    /^(https:\/\/|\/(?!\/))/.test(source.musicUrl)
  )
    settings.musicUrl = source.musicUrl;
  if (Array.isArray(source.timeline))
    settings.timeline = source.timeline.slice(0, 10).map((item) => {
      const row =
        item && typeof item === "object"
          ? (item as Record<string, unknown>)
          : {};
      const string = (key: string) =>
        typeof row[key] === "string" ? (row[key] as string) : "";
      return {
        year: string("year"),
        titleEn: string("titleEn"),
        titleSi: string("titleSi"),
        descriptionEn: string("descriptionEn"),
        descriptionSi: string("descriptionSi"),
      };
    });
  return settings;
}

export function envelopeColours(settings: EnvelopeSettings) {
  const palette =
    ENVELOPE_PALETTES.find((item) => item.id === settings.palette) ??
    ENVELOPE_PALETTES[0];
  return {
    main: settings.main || palette.main,
    accent: settings.accent || palette.accent,
    background: settings.background || palette.background,
    envelope: settings.envelope || palette.envelope,
  };
}

// Copy shared labels; never mutate the existing Heritage Door translations.
export const ENVELOPE_TEXT = {
  en: {
    ...HEIRLOOM_TEXT.en,
    open: "Tap to open",
    replay: "Replay envelope",
    classic: "Classic",
    romantic: "Romantic",
    modern: "Modern",
    until: "Until",
    storyLead: "A few of the moments that brought us here.",
    sealed: "Sealed with autumn light",
  },
  si: {
    ...HEIRLOOM_TEXT.si,
    open: "විවෘත කිරීමට ඔබන්න",
    replay: "කවරය නැවත බලන්න",
    classic: "සම්ප්‍රදායික",
    romantic: "ආදරණීය",
    modern: "නවීන",
    until: "තව",
    storyLead: "අප මෙතැනට ගෙන ආ සුන්දර මොහොත කිහිපයක්.",
    sealed: "ආදරයෙන් මුද්‍රා තබා",
  },
};
