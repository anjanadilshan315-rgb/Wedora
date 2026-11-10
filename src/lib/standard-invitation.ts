import { BASIC_SAMPLE, readBasicDetails, type BasicInvitationDetails } from "./basic-invitation";
import type { StudioGuest } from "./free-studio-types";

export const STANDARD_PLAN = { guestLimit: 500, invitationLimit: 1, watermark: false } as const;
export const STANDARD_ANIMATIONS = ["cinematic", "romantic", "enchanted", "minimal"] as const;
export const STANDARD_LAYOUTS = [
  { code: "vow", name: "The Vow", description: "An elegant arch, handwritten details and timeless romance." },
  { code: "garden", name: "Secret Garden", description: "Botanical flourishes, a soft portrait and a garden-party feeling." },
  { code: "editorial", name: "Modern Muse", description: "A full photograph, bold typography and a contemporary love story." },
] as const;
export const STANDARD_FONTS = [
  { code: "classic", name: "Classic Romance", sample: "Amelia & Oliver", family: "var(--font-cormorant), Georgia, serif" },
  { code: "script", name: "Written in Love", sample: "Amelia & Oliver", family: "var(--font-great-vibes), cursive" },
  { code: "modern", name: "Modern Editorial", sample: "AMELIA & OLIVER", family: "var(--font-montserrat), sans-serif" },
  { code: "timeless", name: "Timeless Serif", sample: "Amelia & Oliver", family: "Georgia, serif" },
] as const;
export interface StandardCustomColors { primary: string; accent: string; background: string; }
export interface StandardEvent { id: string; name: string; date: string; time: string; venue: string; address: string; }
export interface StandardInvitationDetails extends BasicInvitationDetails {
  animation: typeof STANDARD_ANIMATIONS[number];
  /** Optional for invitations saved before appearance customization was added. */
  standardLayout?: typeof STANDARD_LAYOUTS[number]["code"];
  font?: typeof STANDARD_FONTS[number]["code"];
  customColors?: StandardCustomColors;
  motionEnabled?: boolean;
  gallery: string[];
  videoUrl: string;
  backgroundVideoUrl: string;
  welcomeMessage: string;
  customSlug: string;
  events: StandardEvent[];
}
export interface StandardReply { headCount: number; events: string[]; dietary: string; message: string; }
export interface StandardGuest extends StudioGuest { reply: StandardReply | null; }
export interface StandardSnapshot {
  user: { email: string };
  invitation: null | { id: string; slug: string; details: StandardInvitationDetails; published: boolean; hasChanges: boolean; updatedAt: string; version: number; };
  guests: StandardGuest[];
}
export interface PublicStandardInvitation {
  details: StandardInvitationDetails;
  guest: { name: string; status: StudioGuest["status"]; reply: StandardReply | null } | null;
}
export const STANDARD_SAMPLE: StandardInvitationDetails = {
  ...BASIC_SAMPLE,
  brideName: "Amelia", groomName: "Oliver", brideParents: "Daughter of Mr. & Mrs. Perera", groomParents: "Son of Mr. & Mrs. Fernando",
  weddingDate: "2027-06-19", weddingTime: "16:00", rsvpDeadline: "2027-06-01",
  venueName: "The Grand Garden", venueAddress: "Colombo, Sri Lanka",
  greetingMessage: "Some things are simply meant to be. With full hearts and the blessings of our families, we invite you to a day of love, laughter, and the beginning of our forever.",
  animation: "cinematic", gallery: [], videoUrl: "", backgroundVideoUrl: "", customSlug: "",
  welcomeMessage: "A little envelope. A lifetime of love.",
  events: [{ id: "wedding", name: "Wedding ceremony", date: "2027-06-19", time: "16:00", venue: "The Grand Garden", address: "Colombo, Sri Lanka" },
    { id: "homecoming", name: "Homecoming", date: "2027-06-21", time: "18:30", venue: "The Lakeside Terrace", address: "Kandy, Sri Lanka" }],
};

function media(value: unknown, image = false): value is string {
  if (typeof value !== "string") return false;
  if (!value) return true;
  if (image) return value.length <= 1_400_000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(value);
  try { return value.length <= 2000 && new URL(value).protocol === "https:"; } catch { return false; }
}
export function readStandardDetails(value: unknown): StandardInvitationDetails | null {
  const basic = readBasicDetails(value);
  if (!basic || !value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (input.standardLayout !== undefined && !STANDARD_LAYOUTS.some((item) => item.code === input.standardLayout)) return null;
  if (input.font !== undefined && !STANDARD_FONTS.some((item) => item.code === input.font)) return null;
  if (input.motionEnabled !== undefined && typeof input.motionEnabled !== "boolean") return null;
  let customColors: StandardCustomColors | undefined;
  if (input.customColors !== undefined) {
    if (!input.customColors || typeof input.customColors !== "object" || Array.isArray(input.customColors)) return null;
    const colors = input.customColors as Record<string, unknown>;
    if (!["primary", "accent", "background"].every((key) => typeof colors[key] === "string" && /^#[0-9a-fA-F]{6}$/.test(colors[key] as string))) return null;
    customColors = { primary: colors.primary as string, accent: colors.accent as string, background: colors.background as string };
  }
  if (!STANDARD_ANIMATIONS.includes(input.animation as StandardInvitationDetails["animation"])) return null;
  if (!Array.isArray(input.gallery) || input.gallery.length > 6 || !input.gallery.every((item) => Boolean(item) && media(item, true))) return null;
  if (!media(input.videoUrl) || !media(input.backgroundVideoUrl)) return null;
  if (typeof input.welcomeMessage !== "string" || input.welcomeMessage.length > 200) return null;
  if (typeof input.customSlug !== "string" || (input.customSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.customSlug)) || input.customSlug.length > 64 || (input.customSlug && input.customSlug.length < 3)) return null;
  if (!Array.isArray(input.events) || input.events.length < 1 || input.events.length > 5) return null;
  const events: StandardEvent[] = [];
  for (const event of input.events) {
    if (!event || typeof event !== "object") return null;
    const e = event as Record<string, unknown>;
    if (!["id", "name", "date", "time", "venue", "address"].every((key) => typeof e[key] === "string" && (e[key] as string).length <= 250)) return null;
    if (!/^[a-z0-9-]{1,64}$/.test(e.id as string) || !String(e.name).trim() || events.some((item) => item.id === e.id)) return null;
    if (!readBasicDetails({ ...basic, weddingDate: e.date, weddingTime: e.time })) return null;
    events.push({ id: e.id as string, name: String(e.name).trim(), date: e.date as string, time: e.time as string, venue: String(e.venue).trim(), address: String(e.address).trim() });
  }
  return { ...basic, standardLayout: (input.standardLayout ?? "vow") as StandardInvitationDetails["standardLayout"], font: (input.font ?? "classic") as StandardInvitationDetails["font"], motionEnabled: input.motionEnabled !== false, ...(customColors ? { customColors } : {}), animation: input.animation as StandardInvitationDetails["animation"], gallery: input.gallery as string[], videoUrl: input.videoUrl, backgroundVideoUrl: input.backgroundVideoUrl, welcomeMessage: input.welcomeMessage.trim(), customSlug: input.customSlug, events };
}
export function readStandardReply(input: Record<string, unknown>, details: StandardInvitationDetails): StandardReply | null {
  if (typeof input.attending !== "boolean") return null;
  if (!Number.isInteger(input.headCount) || Number(input.headCount) < 0 || Number(input.headCount) > 10 || (input.attending && Number(input.headCount) < 1)) return null;
  if (!Array.isArray(input.events) || input.events.some((id) => !details.events.some((event) => event.id === id)) || new Set(input.events).size !== input.events.length || (input.attending && !input.events.length)) return null;
  if (typeof input.dietary !== "string" || input.dietary.length > 250 || typeof input.message !== "string" || input.message.length > 600) return null;
  return { headCount: input.attending ? Number(input.headCount) : 0, events: input.attending ? input.events as string[] : [], dietary: input.dietary.trim(), message: input.message.trim() };
}
