import type { EventItem, RsvpStatus } from "@/lib/types";

/** Everything a template needs to render, already resolved from the API (or sample data). */
export interface InvitationViewData {
  /** Name of the person viewing the invitation ("Dear …"). */
  guestName: string | null;
  groomName: string;
  brideName: string;
  groomParents: string | null;
  brideParents: string | null;
  /** YYYY-MM-DD */
  weddingDate: string | null;
  /** HH:mm (24h) */
  weddingTime: string | null;
  rsvpDeadline: string | null;
  venueName: string | null;
  venueAddress: string | null;
  mapUrl: string | null;
  greetingMessage: string | null;
  eventsSchedule: EventItem[];
  coverPhoto: string | null;
  groomPhoto: string | null;
  bridePhoto: string | null;
  gallery: string[];
}

export interface WishItem {
  id: number;
  name: string;
  message: string;
}

/**
 * How the template talks to the outside world.
 *   live    – a real, paid invitation: RSVP and wishes go to the API
 *   demo    – template gallery preview: everything stays in the browser
 *   preview – the couple previewing their own draft: RSVP / wishes disabled
 */
export interface InvitationInteractions {
  mode: "live" | "demo" | "preview";
  wishes: WishItem[];
  /** True when the guest is identified by an invite code (no need to ask for a name). */
  guestIdentified: boolean;
  rsvp: { status: RsvpStatus; headCount: number } | null;
  submitWish: (name: string, message: string) => Promise<void>;
  submitRsvp: (input: { attending: boolean; headCount: number; name: string }) => Promise<void>;
}

export interface TemplateProps {
  data: InvitationViewData;
  actions: InvitationInteractions;
}
