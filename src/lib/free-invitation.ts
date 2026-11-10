import type { InvitationViewData } from "@/components/invitation/types";
import { FREE_PLAN, isFreeTemplate, type FreeTemplateCode } from "./template-catalog";

// These settings belong to the Free Plan, separate from the paid templates.
export const FREE_GUEST_LIMIT = FREE_PLAN.guestLimit;
export const FREE_THEMES = ["lotus", "jade", "ocean"] as const;
export type FreeTheme = (typeof FREE_THEMES)[number];

export interface FreeInvitationDetails {
  /** Optional so invitation links created before template selection still work. */
  templateCode?: FreeTemplateCode;
  theme: FreeTheme;
  brideName: string;
  groomName: string;
  brideParents: string;
  groomParents: string;
  greetingMessage: string;
  weddingDate: string;
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  rsvpDeadline: string;
  whatsapp: string;
}

export const FREE_SAMPLE: FreeInvitationDetails = {
  theme: "lotus",
  brideName: "Sanduni",
  groomName: "Tharindu",
  brideParents: "Daughter of Mr. & Mrs. Perera",
  groomParents: "Son of Mr. & Mrs. Fernando",
  greetingMessage: "With joy in our hearts and the blessings of our families, we invite you to celebrate our wedding day.",
  weddingDate: "2027-02-20",
  weddingTime: "16:00",
  venueName: "Lotus Garden Hall",
  venueAddress: "No. 25, Flower Road, Colombo 07",
  rsvpDeadline: "2027-02-01",
  whatsapp: "",
};

/** Only accept the fields we understand. A shared URL is untrusted input. */
export function readFreeDetails(value: unknown): FreeInvitationDetails | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const result: FreeInvitationDetails = { ...FREE_SAMPLE };
  for (const key of Object.keys(FREE_SAMPLE) as (keyof FreeInvitationDetails)[]) {
    if (typeof input[key] !== "string") return null;
    const text = (input[key] as string).trim();
    const limit = key === "greetingMessage" ? 600 : key === "venueAddress" ? 250 : 150;
    if (text.length > limit) return null;
    // Theme is validated separately below; all other properties are plain strings.
    if (key !== "theme" && key !== "templateCode") result[key] = text;
  }
  if (!FREE_THEMES.includes(input.theme as FreeTheme)) return null;
  result.theme = input.theme as FreeTheme;
  if (input.templateCode !== undefined) {
    if (!isFreeTemplate(input.templateCode)) return null;
    result.templateCode = input.templateCode;
  }
  if (!result.brideName || !result.groomName) return null;
  for (const date of [result.weddingDate, result.rsvpDeadline]) {
    if (!date) continue;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null;
  }
  if (result.weddingTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(result.weddingTime)) return null;
  if (result.whatsapp && !/^\+?\d{8,15}$/.test(result.whatsapp)) return null;
  return result;
}

export function decodeFreeDetails(text: string | null): FreeInvitationDetails | null {
  if (!text || text.length > 5000) return null;
  try {
    return readFreeDetails(JSON.parse(text));
  } catch {
    return null;
  }
}

/** Keep the details in the URL so guests can open it without an account or API. */
export function freeInvitationPath(details: FreeInvitationDetails, guestName = ""): string {
  const query = new URLSearchParams({ details: JSON.stringify(details) });
  if (guestName.trim()) query.set("guest", guestName.trim().slice(0, 150));
  return `/invite/free?${query.toString()}`;
}

export function freeViewData(details: FreeInvitationDetails, guestName: string | null = null): InvitationViewData {
  return {
    ...details,
    guestName,
    mapUrl: null,
    eventsSchedule: [],
    coverPhoto: null,
    groomPhoto: null,
    bridePhoto: null,
    gallery: [],
  };
}
