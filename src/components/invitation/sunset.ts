import type { CSSProperties } from "react";
import { hex2rgb, mix } from "./templates/sunset-art";

export const SUNSET_PALETTES = [
  { name: "Ivory & Forest", main: "#2f5a45", gold: "#c4a468", paper: "#f7f3ee", sky: "#f08a24" },
  { name: "Blush & Rose Gold", main: "#8c4a5a", gold: "#c98f7a", paper: "#fbf2f0", sky: "#f3a0a8" },
  { name: "Navy & Silver", main: "#25406b", gold: "#aeb7c6", paper: "#f2f5f9", sky: "#4d6fb5" },
  { name: "Burgundy & Gold", main: "#7a1f2b", gold: "#c9a15b", paper: "#faf3ee", sky: "#d2583a" },
  { name: "Sage & Champagne", main: "#5f7357", gold: "#bfa77a", paper: "#f5f4ee", sky: "#e9b95a" },
  { name: "Royal Purple", main: "#5a3a7a", gold: "#c8aa6a", paper: "#f6f2f9", sky: "#c06aa8" },
] as const;

export const SUNSET_FONTS = [
  {
    value: "classic",
    label: "Classic",
    heading: "var(--font-sunset-heading), serif",
    names: "var(--font-sunset-serif), serif",
    style: "italic",
    size: "2.5rem",
  },
  {
    value: "script",
    label: "Script",
    heading: "var(--font-sunset-heading), serif",
    names: "var(--font-great-vibes), cursive",
    style: "normal",
    size: "2.9rem",
  },
  {
    value: "modern",
    label: "Modern",
    heading: "var(--font-sunset-modern), sans-serif",
    names: "var(--font-sunset-modern), sans-serif",
    style: "normal",
    size: "1.9rem",
  },
] as const;

export const SUNSET_COLOURS = [
  ["main", "Main colour"],
  ["gold", "Gold / accent"],
  ["paper", "Paper"],
  ["sky", "Sunset sky"],
] as const;

export interface SunsetStoryMoment {
  year: string;
  title: string;
  description: string;
}

export interface SunsetSettings {
  main: string;
  gold: string;
  paper: string;
  sky: string;
  font: "classic" | "script" | "modern";
  story: string;
  familiesLine: string;
  timeline: SunsetStoryMoment[];
  eventDates: string[];
  musicUrl: string;
  filmVideoUrl: string;
}

export const DEFAULT_SUNSET: SunsetSettings = {
  main: "#2f5a45",
  gold: "#c4a468",
  paper: "#f7f3ee",
  sky: "#f08a24",
  font: "classic",
  story:
    "We are delighted to invite you to celebrate the beginning of our forever as we exchange vows surrounded by our loved ones. Your presence will make this special day even more memorable.",
  familiesLine:
    "Together with their families request your presence at the celebration of their wedding at",
  timeline: [
    {
      year: "2019",
      title: "The Beginning",
      description: "Two paths crossed on an ordinary day and somehow nothing was ordinary after.",
    },
    {
      year: "2021",
      title: "Growing Together",
      description:
        "Through seasons of laughter and quiet moments, a friendship blossomed into deep love.",
    },
    {
      year: "2023",
      title: "The Promise",
      description:
        "Under the light of a golden evening, a question was asked and the answer was yes.",
    },
    {
      year: "2025",
      title: "Building a Home",
      description: "We took our first steps into a shared life and a place we call ours.",
    },
    {
      year: "2026",
      title: "Forever Begins",
      description: "Surrounded by the people we love most, we begin our forever.",
    },
  ],
  eventDates: [],
  musicUrl: "",
  filmVideoUrl: "",
};

export function isSunsetMediaUrl(value: string) {
  return value === "" || /^(https:\/\/|\/(?!\/))/.test(value);
}

/** Validate saved data before it reaches CSS, artwork or media elements. */
export function sunsetSettings(value: unknown): SunsetSettings {
  const source = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const result = {
    ...DEFAULT_SUNSET,
    timeline: DEFAULT_SUNSET.timeline.map((moment) => ({ ...moment })),
  };
  for (const [key] of SUNSET_COLOURS) {
    if (typeof source[key] === "string" && /^#[0-9a-f]{6}$/i.test(source[key]))
      result[key] = source[key];
  }
  const font = SUNSET_FONTS.find((font) => font.value === source.font);
  if (font) result.font = font.value;
  for (const key of ["story", "familiesLine"] as const) {
    if (typeof source[key] === "string") result[key] = source[key].slice(0, 2000);
  }
  for (const key of ["musicUrl", "filmVideoUrl"] as const) {
    if (typeof source[key] === "string" && isSunsetMediaUrl(source[key]))
      result[key] = source[key].slice(0, 1000);
  }
  if (Array.isArray(source.timeline)) {
    result.timeline = source.timeline
      .slice(0, 10)
      .filter((moment) => moment && typeof moment === "object")
      .map((moment) => ({
        year: String(moment.year ?? "").slice(0, 20),
        title: String(moment.title ?? "").slice(0, 150),
        description: String(moment.description ?? "").slice(0, 1000),
      }));
  }
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
  return result;
}

/** Match the original ZIP's readable ink and paper adjustments. */
export function sunsetColours(settings: SunsetSettings) {
  const luminance = (hex: string) => {
    const [red, green, blue] = hex2rgb(hex).map((channel: number) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  };
  let main = settings.main;
  let paper = settings.paper;
  for (let i = 0; i < 12 && luminance(main) > 0.25; i++) main = mix(main, "#000000", 0.1);
  for (let i = 0; i < 12 && luminance(paper) < 0.8; i++) paper = mix(paper, "#ffffff", 0.15);
  return { main, paper, sky: settings.sky };
}

export function sunsetStyle(settings: SunsetSettings): CSSProperties {
  const { main, paper } = sunsetColours(settings);
  const ink = mix(main, "#1c2224", 0.55);
  const font = SUNSET_FONTS.find((font) => font.value === settings.font) ?? SUNSET_FONTS[0];
  return {
    "--main": main,
    "--main-d": mix(main, "#000000", 0.38),
    "--main-rgb": hex2rgb(main).join(","),
    "--gold": settings.gold,
    "--gold-rgb": hex2rgb(settings.gold).join(","),
    "--paper": paper,
    "--paper2": mix(paper, "#000000", 0.05),
    "--ink": ink,
    "--soft": mix(ink, paper, 0.5),
    "--f-head": font.heading,
    "--f-it": "var(--font-sunset-serif), serif",
    "--f-name": font.names,
    "--name-style": font.style,
    "--name-size": font.size,
  } as CSSProperties;
}
