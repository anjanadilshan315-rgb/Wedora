import { FREE_SAMPLE, readFreeDetails, type FreeInvitationDetails } from "./free-invitation";
import type { StudioGuest } from "./free-studio-types";

export const BASIC_PLAN = { guestLimit: 100, invitationLimit: 1, watermark: false } as const;
// Templates change the layout. Colour themes below work with every template.
export const BASIC_TEMPLATES = [
  { code: "arch", name: "Basic Wedding Invitation", description: "Classic gold arch, circular portrait and romantic stationery." },
  { code: "editorial", name: "Ever After Editorial", description: "Contemporary editorial typography, a full portrait and elegant numbered details." },
  { code: "botanical", name: "Botanical Vow", description: "An immersive photo cover, delicate botanical details and layered invitation cards." },
  { code: "maison", name: "Maison Amour", description: "Modern sculptural stationery with an asymmetric portrait, bold couple names and a signature date card." },
] as const;
export type BasicTemplateCode = typeof BASIC_TEMPLATES[number]["code"];
export const BASIC_DESIGNS = [
  // Existing codes remain compatible with saved invitations.
  { code: "champagne", name: "Royal Ivory", colour: "#7a1f2b", background: "#faf6ee", paper: "#fffdf8", ink: "#3a2a22", muted: "#8a7a6c", gold: "#b8923f", line: "#e6dcc8", onAccent: "#ffffff" },
  { code: "sage", name: "Sage Garden", colour: "#3f6a4b", background: "#f1f4ec", paper: "#fbfcf8", ink: "#26342a", muted: "#6f7f72", gold: "#a7894a", line: "#d8e0d0", onAccent: "#ffffff" },
  { code: "midnight", name: "Midnight Gold", colour: "#d4af5f", background: "#121a2e", paper: "#1a2440", ink: "#f1e8d4", muted: "#a9a58f", gold: "#d4af5f", line: "#2c3860", onAccent: "#121a2e" },
  { code: "rose", name: "Rose Blush", colour: "#b4506a", background: "#fbeeee", paper: "#fff9f8", ink: "#4a2c33", muted: "#9a7a80", gold: "#c49a6c", line: "#f0d6d9", onAccent: "#ffffff" },
] as const;

// Reuse the Free fields and add only the personal touches included in Basic.
export interface BasicInvitationDetails extends FreeInvitationDetails {
  /** Old invitations default to the original arch layout. */
  layout?: BasicTemplateCode;
  design: typeof BASIC_DESIGNS[number]["code"];
  couplePhoto: string;
  musicUrl: string;
  mapUrl: string;
}
export const BASIC_SAMPLE: BasicInvitationDetails = {
  ...FREE_SAMPLE, design: "champagne", couplePhoto: "", musicUrl: "", mapUrl: "",
};
export interface BasicSnapshot {
  user: { email: string };
  invitation: null | {
    id: string; slug: string; details: BasicInvitationDetails; published: boolean;
    hasChanges: boolean; updatedAt: string; version: number;
  };
  guests: StudioGuest[];
}
export interface PublicBasicInvitation {
  details: BasicInvitationDetails;
  guest: { name: string; status: StudioGuest["status"] } | null;
}

export function readBasicDetails(value: unknown): BasicInvitationDetails | null {
  const free = readFreeDetails(value);
  if (!free || !value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (input.layout !== undefined && !BASIC_TEMPLATES.some((template) => template.code === input.layout)) return null;
  if (!BASIC_DESIGNS.some((design) => design.code === input.design)) return null;
  for (const key of ["couplePhoto", "musicUrl", "mapUrl"]) {
    if (typeof input[key] !== "string") return null;
  }
  const couplePhoto = input.couplePhoto as string;
  // Only raster uploads: SVG and arbitrary remote image URLs are excluded.
  if (couplePhoto && (couplePhoto.length > 1_400_000 || !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(couplePhoto))) return null;
  const musicUrl = (input.musicUrl as string).trim();
  const mapUrl = (input.mapUrl as string).trim();
  for (const address of [musicUrl, mapUrl]) {
    if (!address) continue;
    try { if (address.length > 2000 || new URL(address).protocol !== "https:") return null; }
    catch { return null; }
  }
  if (mapUrl) {
    const host = new URL(mapUrl).hostname;
    if (!["google.com", "www.google.com", "maps.google.com", "maps.app.goo.gl", "goo.gl"].includes(host)) return null;
  }
  return { ...free, layout: (input.layout ?? "arch") as BasicTemplateCode, design: input.design as BasicInvitationDetails["design"], couplePhoto, musicUrl, mapUrl };
}
