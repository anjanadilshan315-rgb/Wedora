import type { ComponentType } from "react";
import type { InvitationContent, Photos } from "@/lib/types";
import ClassicTemplate from "./templates/ClassicTemplate";
import FloralTemplate from "./templates/FloralTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import RoyalTemplate from "./templates/RoyalTemplate";
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
 * The five static designs. `code` must match the `templates.code` column
 * seeded by backend/database/schema.sql.
 */
export const TEMPLATE_DESIGNS: TemplateDesign[] = [
  { code: "tpl_classic", name: "Classic Elegance", style: "Sage & Gold", gradient: "from-[#FBF3E4] to-[#EDE0CC]", accent: "#C59B48", demoSlug: "demo-template", component: ClassicTemplate },
  { code: "tpl_royal", name: "Royal Kandyan", style: "Traditional & Gold", gradient: "from-[#FDFBF7] to-[#EBE5DA]", accent: "#A67C00", demoSlug: "demo-kandyan", component: RoyalTemplate },
  { code: "tpl_modern", name: "Modern Luxe", style: "Emerald & Amber", gradient: "from-[#E3EEE9] to-[#C9DDD3]", accent: "#1E4D3E", demoSlug: "demo-modern", component: ModernTemplate },
  { code: "tpl_floral", name: "Floral Garden", style: "Blush Watercolor", gradient: "from-[#FBEAF0] to-[#EFE6F7]", accent: "#B5577A", demoSlug: "demo-floral", component: FloralTemplate },
  { code: "tpl_minimal", name: "Minimal White", style: "Modern Editorial", gradient: "from-[#FFFFFF] to-[#EDEDED]", accent: "#262626", demoSlug: "demo-minimal", component: MinimalTemplate },
];

export function designFor(code: string | null | undefined): TemplateDesign {
  return TEMPLATE_DESIGNS.find((t) => t.code === code) ?? TEMPLATE_DESIGNS[0];
}

export function designForDemoSlug(slug: string): TemplateDesign | null {
  // "template2" is an older preview link for the Kandyan design.
  if (slug === "template2") return designFor("tpl_royal");
  return TEMPLATE_DESIGNS.find((t) => t.demoSlug === slug) ?? null;
}

/** Converts invitation data from the API into what the templates render. */
export function toViewData(
  invitation: InvitationContent & { photos: Photos },
  guestName: string | null,
): InvitationViewData {
  return {
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
