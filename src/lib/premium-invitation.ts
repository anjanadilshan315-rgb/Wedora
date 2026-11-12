import { STANDARD_SAMPLE, readStandardDetails, readStandardReply, type StandardInvitationDetails, type StandardReply } from "./standard-invitation";

export const PREMIUM_PLAN = { invitationLimit: 1, guestLimit: null, watermark: false, mediaBytes: 8 * 1024 * 1024 } as const;
export const PREMIUM_LAYOUTS = ["atelier", "portrait", "letter"] as const;
export const PREMIUM_OPENINGS = ["wax", "curtain", "bloom", "journey", "iris", "unfurl", "doors", "courtyard", "lamplight", "film", "ribbon", "petal"] as const;
export const PREMIUM_TEMPLATES = [
  { code: "rose", name: "Rosé Atelier", description: "Floral stationery and an embossed crimson envelope." },
  { code: "aureline", name: "Aureline", description: "An ornamental mandala, a cinematic wedding journey and porcelain-blue stationery." },
  { code: "walawwa", name: "Walawwa", description: "Carved timber doors, a floral ceremony and a lantern-lit courtyard after dark." },
  { code: "evermore", name: "Evermore", description: "A cinematic wedding-film welcome, romantic lilac stationery and a little story of forever." },
] as const;
export interface PremiumGallery { id: string; title: string; photos: string[]; }
export interface PremiumQuestion { id: string; label: string; type: "text" | "select"; required: boolean; options: string[]; }
export interface PremiumTable { id: string; name: string; capacity: number; }
export interface PremiumDetails extends Omit<StandardInvitationDetails, "customSlug" | "standardLayout"> {
  /** Older drafts keep Rosé Atelier when this field is absent. */
  premiumTemplate?: typeof PREMIUM_TEMPLATES[number]["code"];
  premiumLayout: typeof PREMIUM_LAYOUTS[number];
  opening: typeof PREMIUM_OPENINGS[number];
  galleries: PremiumGallery[];
  questions: PremiumQuestion[];
  seatingTables: PremiumTable[];
  passwordEnabled: boolean;
  headingScale: number;
  letterSpacing: number;
}
export interface PremiumReply extends StandardReply { answers: Record<string, string>; }
export interface PremiumGuest {
  token: string; name: string; status: "pending" | "attending" | "declined";
  repliedAt: string | null; reply: PremiumReply | null; tableId: string;
  group: string; notes: string; openedAt: string | null; visits: number;
}
export interface PremiumSnapshot {
  user: { email: string };
  invitation: null | { id: string; slug: string; details: PremiumDetails; published: boolean; version: number; hasChanges: boolean; views: number; };
  guests: PremiumGuest[];
  tickets: { id: string; message: string; status: string; createdAt: string }[];
}
export interface PublicPremiumInvitation {
  details: PremiumDetails;
  guest: null | { name: string; status: PremiumGuest["status"]; reply: PremiumReply | null; table: string };
}

const { customSlug: _slug, standardLayout: _layout, ...base } = STANDARD_SAMPLE;
void _slug; void _layout;
export const PREMIUM_SAMPLE: PremiumDetails = {
  ...base, brideName: "Ananya", groomName: "Devon", font: "classic", animation: "romantic",
  weddingDate: "2027-10-09", weddingTime: "16:00", rsvpDeadline: "2027-09-25",
  venueName: "The Rosewood Estate", venueAddress: "Colombo, Sri Lanka",
  greetingMessage: "Somewhere between a chance meeting and a thousand little moments, we found our forever. Together with our families, we request the pleasure of your company as we begin our next chapter.",
  welcomeMessage: "A day we have dreamed of. The people we love. An invitation, especially for you.",
  customColors: { primary: "#792d43", accent: "#a9824f", background: "#f7e9ec" },
  premiumLayout: "atelier", opening: "wax", headingScale: 1, letterSpacing: 0,
  passwordEnabled: false, galleries: [{ id: "our-story", title: "A thousand little moments", photos: [] }, { id: "the-details", title: "The details, held close", photos: [] }],
  questions: [{ id: "song", label: "What song will get you on the dance floor?", type: "text", required: false, options: [] }],
  seatingTables: [{ id: "rose", name: "The Rose Table", capacity: 10 }, { id: "peony", name: "The Peony Table", capacity: 10 }],
  events: [{ id: "wedding", name: "The wedding ceremony", date: "2027-10-09", time: "16:00", venue: "The Rosewood Estate", address: "Colombo, Sri Lanka" }, { id: "homecoming", name: "Homecoming celebration", date: "2027-10-11", time: "18:30", venue: "The Garden Pavilion", address: "Kandy, Sri Lanka" }],
};

export const AURELINE_PALETTES = [
  { name: "Copper & Porcelain", primary: "#614136", accent: "#8dabb6", background: "#edf4f7" },
  { name: "Inkstone & Juniper", primary: "#354c54", accent: "#a6b8a5", background: "#e8efed" },
  { name: "Obsidian & Frost", primary: "#b5cad4", accent: "#d0a17b", background: "#17232a" },
] as const;
const { name: _paletteName, ...aurelineColors } = AURELINE_PALETTES[0];
void _paletteName;
export const AURELINE_SAMPLE: PremiumDetails = {
  ...PREMIUM_SAMPLE, premiumTemplate: "aureline", opening: "journey", animation: "cinematic",
  brideName: "Nethmi", groomName: "Kavindu", customColors: aurelineColors,
  weddingDate: "2027-12-12", weddingTime: "15:30", rsvpDeadline: "2027-11-28",
  venueName: "The Highland Pavilion", venueAddress: "Nuwara Eliya, Sri Lanka",
  welcomeMessage: "With the blessings of our families, we invite you to the beginning of our greatest journey.",
  greetingMessage: "A thousand roads, a little serendipity, and one extraordinary love. Together with our families, we invite you to share in a celebration of the life we are building together. Your presence would mean the world to us.",
  galleries: [{ id: "our-journey", title: "The moments that made us", photos: [] }, { id: "little-details", title: "All the little things", photos: [] }],
  events: [{ id: "wedding", name: "Registration & wedding vows", date: "2027-12-12", time: "15:30", venue: "The Highland Pavilion", address: "Nuwara Eliya, Sri Lanka" }, { id: "homecoming", name: "Homecoming reception", date: "2027-12-14", time: "18:30", venue: "The Conservatory", address: "Colombo, Sri Lanka" }],
};
export const WALAWWA_PALETTES = [
  { name: "Walnut & Champagne", primary: "#55301d", accent: "#b27c32", background: "#fff5e5" },
  { name: "Clove & Sage", primary: "#374733", accent: "#9c7d43", background: "#f1f0df" },
  { name: "Midnight & Saffron", primary: "#28365a", accent: "#b7853f", background: "#f0eee7" },
] as const;
export const WALAWWA_SAMPLE: PremiumDetails = {
  ...PREMIUM_SAMPLE, premiumTemplate: "walawwa", opening: "doors", animation: "cinematic",
  brideName: "Anuki", groomName: "Sahan", brideParents: "The Perera family", groomParents: "The Jayawardena family",
  weddingDate: "2027-08-21", weddingTime: "10:30", rsvpDeadline: "2027-08-01",
  venueName: "The Golden House, Demo Walawwa", venueAddress: "Heritage courtyard, Kandy, Sri Lanka",
  welcomeMessage: "Beyond these doors, a beautiful new chapter awaits. We have saved a place for you.",
  greetingMessage: "With the blessings of our families, we warmly invite you to share the beginning of our next chapter. From the first golden light to an evening beneath the stars, let us fill this day with love, laughter and the people who feel like home.",
  customColors: { primary: "#55301d", accent: "#b27c32", background: "#fff5e5" },
  galleries: [{ id: "our-traditions", title: "The moments we keep", photos: [] }, { id: "our-forever", title: "A little more of our story", photos: [] }],
  seatingTables: [{ id: "jasmine", name: "The Jasmine Table", capacity: 10 }, { id: "lotus", name: "The Lotus Table", capacity: 10 }],
  events: [{ id: "wedding", name: "Poruwa ceremony", date: "2027-08-21", time: "10:30", venue: "The Golden House, Demo Walawwa", address: "Kandy, Sri Lanka" }, { id: "reception", name: "The lantern reception", date: "2027-08-21", time: "18:30", venue: "The Courtyard, Demo Walawwa", address: "Kandy, Sri Lanka" }],
};
export const EVERMORE_PALETTES = [
  { name: "Amethyst & Peach", primary: "#635078", accent: "#b98568", background: "#f2edf5" },
  { name: "Fig & Honey", primary: "#704658", accent: "#bf955e", background: "#f6eef0" },
  { name: "Wisteria & Pearl", primary: "#53627f", accent: "#ad8393", background: "#eef1f8" },
] as const;
export const EVERMORE_PHOTOS = ["/assets/evermore/shoreline-vows.jpg", "/assets/evermore/quiet-romance.jpg", "/assets/evermore/first-kiss.jpg", "/assets/evermore/garden-tradition.jpg"];
export const EVERMORE_SAMPLE: PremiumDetails = {
  ...PREMIUM_SAMPLE, premiumTemplate: "evermore", opening: "film", animation: "romantic",
  brideName: "Tharushi", groomName: "Kasun", brideParents: "The Silva family", groomParents: "The Perera family",
  weddingDate: "2027-05-20", weddingTime: "09:30", rsvpDeadline: "2027-05-06",
  venueName: "The Willow Conservatory", venueAddress: "Garden pavilion, Kandy, Sri Lanka",
  welcomeMessage: "A little hello. A beautiful journey. A lifetime of choosing each other.",
  greetingMessage: "With the love and blessings of our families, we invite you to celebrate our marriage. From the very first hello to this beautiful next chapter, our story has been made brighter by the people we love. We would be so happy to have you beside us.",
  customColors: { primary: "#635078", accent: "#b98568", background: "#f2edf5" },
  galleries: [{ id: "our-beginning", title: "Once upon a little forever.", photos: [] }, { id: "our-keepsakes", title: "The things we want to remember.", photos: [] }],
  seatingTables: [{ id: "wisteria", name: "The Wisteria Table", capacity: 10 }, { id: "camellia", name: "The Camellia Table", capacity: 10 }],
  events: [{ id: "wedding", name: "Wedding celebration", date: "2027-05-20", time: "09:30", venue: "The Willow Conservatory", address: "Kandy, Sri Lanka" }, { id: "poruwa", name: "Poruwa ceremony", date: "2027-05-20", time: "11:00", venue: "The Willow Conservatory", address: "Kandy, Sri Lanka" }, { id: "homecoming", name: "Homecoming", date: "2027-05-22", time: "18:30", venue: "The Orchid Pavilion", address: "Colombo, Sri Lanka" }],
};
export function premiumSample(template?: string | null) {
  return template === "evermore" ? EVERMORE_SAMPLE : template === "walawwa" ? WALAWWA_SAMPLE : template === "aureline" ? AURELINE_SAMPLE : PREMIUM_SAMPLE;
}

/** Keep the public preview and editor's animation choices in sync. */
export function premiumOpeningOptions(template?: PremiumDetails["premiumTemplate"]) {
  if (template === "evermore") return [{ code: "film", label: "Cinematic film reveal" }, { code: "ribbon", label: "Silk ribbon opening" }, { code: "petal", label: "Petal-light opening" }] as const;
  if (template === "walawwa") return [{ code: "doors", label: "Carved timber doors" }, { code: "courtyard", label: "Courtyard reveal" }, { code: "lamplight", label: "Golden lamplight" }] as const;
  if (template === "aureline") return [{ code: "journey", label: "Wedding journey" }, { code: "iris", label: "Mandala iris" }, { code: "unfurl", label: "Parchment reveal" }] as const;
  return [{ code: "wax", label: "Wax-seal opening" }, { code: "curtain", label: "Silk curtain opening" }, { code: "bloom", label: "Bloom opening" }] as const;
}

export function premiumMedia(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2000) return false;
  if (!value || /^\/api\/premium\/media\/[a-f0-9]{48}$/.test(value)) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
const id = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9-]{1,64}$/.test(value);
const text = (value: unknown, max: number): value is string => typeof value === "string" && value.trim().length > 0 && value.length <= max;

/** Validate everything on both the editor and server; never accept CSS or arbitrary font URLs. */
export function readPremiumDetails(value: unknown): PremiumDetails | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.premiumTemplate !== undefined && !PREMIUM_TEMPLATES.some((t) => t.code === input.premiumTemplate)) return null;
  if (![input.musicUrl, input.videoUrl, input.backgroundVideoUrl].every(premiumMedia)) return null;
  const standard = readStandardDetails({ ...input, customSlug: "", standardLayout: "vow", musicUrl: "", videoUrl: "", backgroundVideoUrl: "" });
  if (!standard || !PREMIUM_LAYOUTS.includes(input.premiumLayout as PremiumDetails["premiumLayout"]) || !PREMIUM_OPENINGS.includes(input.opening as PremiumDetails["opening"])) return null;
  if (typeof input.passwordEnabled !== "boolean" || typeof input.headingScale !== "number" || !Number.isFinite(input.headingScale) || input.headingScale < .8 || input.headingScale > 1.2 || typeof input.letterSpacing !== "number" || !Number.isFinite(input.letterSpacing) || input.letterSpacing < -.03 || input.letterSpacing > .08) return null;
  if (!Array.isArray(input.galleries) || input.galleries.length > 3 || !Array.isArray(input.questions) || input.questions.length > 8 || !Array.isArray(input.seatingTables) || input.seatingTables.length > 100) return null;
  const galleries: PremiumGallery[] = [];
  for (const item of input.galleries) {
    if (!item || !id(item.id) || !text(item.title, 100) || !Array.isArray(item.photos) || item.photos.length > 4 || galleries.some((g) => g.id === item.id)) return null;
    if (!readStandardDetails({ ...standard, gallery: item.photos })) return null;
    galleries.push({ id: item.id, title: item.title.trim(), photos: item.photos });
  }
  const questions: PremiumQuestion[] = [];
  for (const item of input.questions) {
    if (!item || !id(item.id) || !text(item.label, 200) || !["text", "select"].includes(item.type) || typeof item.required !== "boolean" || !Array.isArray(item.options) || item.options.length > 12 || !item.options.every((option: unknown) => text(option, 100)) || (item.type === "select" && item.options.length < 2) || questions.some((q) => q.id === item.id)) return null;
    questions.push({ id: item.id, label: item.label.trim(), type: item.type, required: item.required, options: item.options.map((s: string) => s.trim()) });
  }
  const seatingTables: PremiumTable[] = [];
  for (const item of input.seatingTables) {
    if (!item || !id(item.id) || !text(item.name, 100) || !Number.isInteger(item.capacity) || item.capacity < 1 || item.capacity > 100 || seatingTables.some((t) => t.id === item.id)) return null;
    seatingTables.push({ id: item.id, name: item.name.trim(), capacity: item.capacity });
  }
  const { customSlug, standardLayout, ...clean } = standard;
  void customSlug; void standardLayout;
  return { ...clean, premiumTemplate: (input.premiumTemplate ?? "rose") as PremiumDetails["premiumTemplate"], musicUrl: input.musicUrl as string, videoUrl: input.videoUrl as string, backgroundVideoUrl: input.backgroundVideoUrl as string, premiumLayout: input.premiumLayout as PremiumDetails["premiumLayout"], opening: input.opening as PremiumDetails["opening"], galleries, questions, seatingTables, passwordEnabled: input.passwordEnabled, headingScale: input.headingScale, letterSpacing: input.letterSpacing };
}

export function readPremiumReply(input: Record<string, unknown>, details: PremiumDetails): PremiumReply | null {
  const reply = readStandardReply(input, { ...details, customSlug: "" });
  if (!reply || !input.answers || typeof input.answers !== "object" || Array.isArray(input.answers)) return null;
  const answers: Record<string, string> = {};
  for (const question of details.questions) {
    const answer = (input.answers as Record<string, unknown>)[question.id] ?? "";
    if (typeof answer !== "string" || answer.length > 500 || (input.attending && question.required && !answer.trim()) || (answer && question.type === "select" && !question.options.includes(answer))) return null;
    answers[question.id] = answer.trim();
  }
  return { ...reply, answers };
}

export function premiumAnalytics(guests: PremiumGuest[], details: PremiumDetails) {
  return {
    invited: guests.length,
    attending: guests.reduce((n, g) => n + (g.status === "attending" ? g.reply?.headCount ?? 1 : 0), 0),
    pending: guests.filter((g) => g.status === "pending").length,
    declined: guests.filter((g) => g.status === "declined").length,
    opened: guests.filter((g) => g.openedAt).length,
    events: details.events.map((event) => ({ ...event, count: guests.reduce((n, g) => n + (g.status === "attending" && g.reply?.events.includes(event.id) ? g.reply.headCount : 0), 0) })),
  };
}

export function premiumGuestCsv(guests: PremiumGuest[], details: PremiumDetails) {
  const cell = (value: string) => `"${(/^[\s]*[=+@-]/.test(value) ? "'" + value : value).replaceAll('"', '""')}"`;
  const rows = [["Name", "Group", "Status", "Party size", "Table", "Events", "Dietary", "Message", "Notes", ...details.questions.map((q) => q.label)], ...guests.map((g) => [g.name, g.group, g.status, String(g.reply?.headCount ?? 0), details.seatingTables.find((t) => t.id === g.tableId)?.name ?? "", g.reply?.events.map((event) => details.events.find((e) => e.id === event)?.name ?? event).join("; ") ?? "", g.reply?.dietary ?? "", g.reply?.message ?? "", g.notes, ...details.questions.map((q) => g.reply?.answers[q.id] ?? "")])];
  return "\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
