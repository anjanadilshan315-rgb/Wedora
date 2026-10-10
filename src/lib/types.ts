/** Shapes returned by the backend API (see backend/README.md). */

export type InvitationStatus = "draft" | "pending" | "paid" | "cancelled";
export type PhotoCategory = "cover" | "groom" | "bride" | "gallery";
export type RsvpStatus = "pending" | "attending" | "declined";
export type GuestEmailStatus = "not_sent" | "queued" | "sent" | "failed";

export interface Template {
  id: number;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  previewImageUrl: string | null;
  demoSlug: string | null;
  price: number | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Photo {
  id: number;
  category: PhotoCategory;
  url: string;
  width: number | null;
  height: number | null;
  sortOrder: number;
}

export interface Photos {
  cover: Photo | null;
  groom: Photo | null;
  bride: Photo | null;
  gallery: Photo[];
}

export interface EventItem {
  name: string;
  time: string;
  venue?: string;
  description?: string;
}

export interface InvitationContent {
  groomName: string | null;
  brideName: string | null;
  groomPhone: string | null;
  bridePhone: string | null;
  groomParents: string | null;
  brideParents: string | null;
  weddingDate: string | null;
  weddingTime: string | null;
  rsvpDeadline: string | null;
  venueName: string | null;
  venueAddress: string | null;
  mapUrl: string | null;
  greetingMessage: string | null;
  eventsSchedule: EventItem[];
  extraDetails: Record<string, unknown>;
}

export interface InvitationSummary {
  id: number;
  referenceNo: string | null;
  status: InvitationStatus;
  currentStep: number;
  template: { id: number; code: string; name: string };
  groomName: string | null;
  brideName: string | null;
  weddingDate: string | null;
  slug: string | null;
  inviteUrl: string | null;
  submittedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GuestStats {
  total: number;
  withEmail: number;
  email: { notSent: number; queued: number; sent: number; failed: number };
  rsvp: { pending: number; attending: number; declined: number; attendingHeadCount: number };
}

export interface Invitation extends InvitationSummary, InvitationContent {
  photos: Photos;
  payment: { amount: number | null; reference: string | null };
  guestStats?: GuestStats;
}

export interface PublicInvitation extends InvitationContent {
  slug: string;
  template: { code: string; name: string };
  photos: Photos;
  guest: { name: string; rsvpStatus: RsvpStatus; headCount: number } | null;
}

export interface Guest {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  inviteCode: string;
  inviteUrl: string | null;
  emailStatus: GuestEmailStatus;
  emailError: string | null;
  emailSentAt: string | null;
  rsvpStatus: RsvpStatus;
  headCount: number;
  respondedAt: string | null;
  createdAt: string;
}

export interface EmailBatch {
  id: number;
  invitationId: number;
  status: "queued" | "processing" | "completed" | "completed_with_errors";
  totalCount: number;
  sentCount: number;
  failedCount: number;
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface Wish {
  id: number;
  name: string;
  message: string;
  isVisible?: boolean;
  fromInvitedGuest?: boolean;
  createdAt: string;
}

export interface ImportResult {
  totalRows: number;
  imported: number;
  skipped: number;
  errors: { row: number; reason: string }[];
  emailBatch: EmailBatch | null;
}
