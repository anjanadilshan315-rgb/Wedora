import { api } from "./api";
import type { Invitation, Template } from "./types";

/** Creates a draft for the chosen template and returns its id (step 1 of the form). */
export async function createInvitationDraft(templateCode: string): Promise<number> {
  const { data: templates } = await api<Template[]>("/public/templates", { auth: false });
  const template = templates.find((t) => t.code === templateCode);
  if (!template) throw new Error("This template is no longer available.");
  const { data } = await api<Invitation>("/customer/invitations", {
    method: "POST",
    body: { templateId: template.id, currentStep: 2 },
  });
  return data.id;
}

export const STATUS_LABELS: Record<Invitation["status"], string> = {
  draft: "Draft",
  pending: "Pending payment",
  paid: "Paid",
  cancelled: "Cancelled",
};

export const STATUS_STYLES: Record<Invitation["status"], string> = {
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};
