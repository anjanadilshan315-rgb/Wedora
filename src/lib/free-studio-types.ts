import type { FreeInvitationDetails } from "./free-invitation";

export interface StudioGuest {
  token: string;
  name: string;
  status: "pending" | "attending" | "declined";
  repliedAt: string | null;
}
export interface StudioInvitation {
  id: string;
  slug: string;
  details: FreeInvitationDetails;
  published: boolean;
  hasChanges: boolean;
  updatedAt: string;
  version: number;
}
export interface StudioSnapshot {
  user: { email: string };
  invitation: StudioInvitation | null;
  guests: StudioGuest[];
}
export interface PublicFreeInvitation {
  details: FreeInvitationDetails;
  guest: { name: string; status: StudioGuest["status"] } | null;
}
