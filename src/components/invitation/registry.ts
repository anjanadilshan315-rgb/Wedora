import type { ComponentType } from "react";
import type { InvitationContent, Photos } from "@/lib/types";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import { FreeRoyalTemplate, FreeFloralTemplate, FreeModernTemplate } from "./FreeInvitationTemplate";
import GoldenHourTemplate from "./templates/GoldenHourTemplate";
import FreeArchTemplate from "./templates/FreeArchTemplate";
import type { InvitationViewData, TemplateProps } from "./types";
import { TEMPLATE_CATALOG } from "@/lib/template-catalog";

export interface TemplateDesign {
  code: string;
  name: string;
  style: string;
  gradient: string;
  accent: string;
  /** Free designs use the browser editor instead of the paid checkout. */
  plan: "free" | "paid";
  description: string;
  /** Static preview route on this website (also stored as templates.demo_slug in the DB). */
  demoSlug: string;
  component: ComponentType<TemplateProps>;
}

/**
 * Designs used by the gallery and invitation pages. Paid design codes must
 * match the API's templates. Free designs use their own browser-based editor.
 */
const components: Record<string, ComponentType<TemplateProps>> = {
  tpl_classic: ClassicTemplate,
  tpl_royal: FreeRoyalTemplate,
  tpl_modern: FreeModernTemplate,
  tpl_floral: FreeFloralTemplate,
  tpl_minimal: MinimalTemplate,
  tpl_golden_hour: GoldenHourTemplate,
  tpl_free_arch: FreeArchTemplate,
};
export const TEMPLATE_DESIGNS: TemplateDesign[] = TEMPLATE_CATALOG.map((design) => ({ ...design, component: components[design.code] }));

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
