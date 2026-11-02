import type { ComponentType } from "react";
import type { InvitationContent, Photos } from "@/lib/types";
import KeepsakeTemplate from "./templates/KeepsakeTemplate";
import { keepsakeSettings } from "./keepsake";
import GoldenHourTemplate from "./templates/GoldenHourTemplate";
import HeirloomTemplate from "./templates/HeritageDoorTemplate";
import FloralEnvelopeTemplate from "./templates/FloralEnvelopeTemplate";
import { envelopeSettings } from "./envelope";
import { heirloomSettings } from "./heirloom";
import { rubySettings } from "./ruby";
import SunsetJourneyTemplate from "./templates/SunsetJourneyTemplate";
import { sunsetSettings } from "./sunset";
import GildedCelebrationTemplate from "./templates/GildedCelebrationTemplate";
import { gildedSettings } from "./gilded";
import type { InvitationViewData, TemplateProps } from "./types";

export interface TemplateDesign {
  code: string;
  name: string;
  style: string;
  gradient: string;
  accent: string;
  /** Static preview route on this website (also stored as templates.demo_slug in the DB). */
  demoSlug: string;
  component: ComponentType<TemplateProps>;
}

/**
 * The available designs. `code` must match the `templates.code` column
 * seeded by backend/database/schema.sql.
 */
export const TEMPLATE_DESIGNS: TemplateDesign[] = [
  { code: "tpl_classic", name: "The Golden Keepsake", style: "Luxury Gold & Ivory", gradient: "from-[#FFFFF0] to-[#F5EBDD]", accent: "#C6A667", demoSlug: "demo-keepsake", component: KeepsakeTemplate },
  { code: "tpl_golden_hour", name: "Ruby Heart Romance", style: "Ruby, Blush & Gold Editorial", gradient: "from-[#64142D] to-[#F5DCE0]", accent: "#8C1D40", demoSlug: "demo-golden-hour", component: GoldenHourTemplate },
  { code: "tpl_grand_heirloom", name: "The Grand Heirloom", style: "Heritage Door · Sinhala & English", gradient: "from-[#7A4A28] to-[#1C3F8F]", accent: "#E6C58F", demoSlug: "demo-grand-heirloom", component: HeirloomTemplate },
  { code: "tpl_heirloom_envelope", name: "Floral Envelope", style: "Burgundy & Gold · Sinhala & English", gradient: "from-[#F8EAE8] to-[#ECD0CC]", accent: "#7A1414", demoSlug: "demo-heirloom-envelope", component: FloralEnvelopeTemplate },
  { code: "tpl_sunset_journey", name: "Sunset Journey", style: "Vintage Car · Sunset & Petals", gradient: "from-[#2f5a45] to-[#f08a24]", accent: "#c4a468", demoSlug: "demo-sunset-journey", component: SunsetJourneyTemplate },
  { code: "tpl_gilded_celebration", name: "The Gilded Celebration", style: "Burgundy, Gold & Ivory", gradient: "from-[#faf7f0] to-[#efdfc8]", accent: "#781c32", demoSlug: "demo-gilded-celebration", component: GildedCelebrationTemplate },
];

export function designFor(code: string | null | undefined): TemplateDesign {
  return TEMPLATE_DESIGNS.find((t) => t.code === code) ?? TEMPLATE_DESIGNS[0];
}

export function designForDemoSlug(slug: string): TemplateDesign | null {
  // Previously shared preview URLs now display the replacement invitation.
  if (slug === "demo-template" || slug === "demo-minimal") return designFor("tpl_classic");
  return TEMPLATE_DESIGNS.find((t) => t.demoSlug === slug) ?? null;
}

/** Converts invitation data from the API into what the templates render. */
export function toViewData(
  invitation: InvitationContent & { photos: Photos },
  guestName: string | null,
): InvitationViewData {
  return {
    keepsake: keepsakeSettings(invitation.extraDetails?.keepsake),
    heirloom: heirloomSettings(invitation.extraDetails?.heirloom),
    floralEnvelope: envelopeSettings(invitation.extraDetails?.floralEnvelope),
    ruby: rubySettings(invitation.extraDetails?.ruby),
    sunset: sunsetSettings(invitation.extraDetails?.sunset),
    gilded: gildedSettings(invitation.extraDetails?.gilded),
    bridePhone: invitation.bridePhone,
    groomPhone: invitation.groomPhone,
    guestName,
    groomName: invitation.groomName || "Groom",
    brideName: invitation.brideName || "Bride",
    groomParents: invitation.groomParents,
    brideParents: invitation.brideParents,
    weddingDate: invitation.weddingDate,
    weddingTime: invitation.weddingTime,
    rsvpDeadline: invitation.rsvpDeadline,
    venueName: invitation.venueName,
    venueAddress: invitation.venueAddress,
    mapUrl: invitation.mapUrl,
    greetingMessage: invitation.greetingMessage,
    eventsSchedule: invitation.eventsSchedule ?? [],
    coverPhoto: invitation.photos.cover?.url ?? null,
    groomPhoto: invitation.photos.groom?.url ?? null,
    bridePhoto: invitation.photos.bride?.url ?? null,
    gallery: invitation.photos.gallery.map((p) => p.url),
  };
}
