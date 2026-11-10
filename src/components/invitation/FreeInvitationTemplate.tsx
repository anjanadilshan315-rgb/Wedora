"use client";

import FreeArchTemplate from "./templates/FreeArchTemplate";
import RoyalTemplate from "./templates/RoyalTemplate";
import FloralTemplate from "./templates/FloralTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import type { InvitationInteractions, TemplateProps } from "./types";
import { freeViewData, type FreeInvitationDetails } from "@/lib/free-invitation";

/** Gallery previews use the same Royal design with Free Plan branding. */
export function FreeRoyalTemplate(props: TemplateProps) {
  return <RoyalTemplate {...props} freePlan />;
}

export function FreeFloralTemplate(props: TemplateProps) {
  return <FloralTemplate {...props} freePlan />;
}

/** Use the same Modern Luxe design in the gallery, editor and shared links. */
export function FreeModernTemplate(props: TemplateProps & { whatsapp?: string; localReplies?: boolean }) {
  return <ModernTemplate {...props} freePlan />;
}

/** Both the editor and shared link use this selector, so their designs match. */
export default function FreeInvitationTemplate({ details, actions, guestName = null, localReplies = false }: {
  details: FreeInvitationDetails;
  actions: InvitationInteractions;
  guestName?: string | null;
  localReplies?: boolean;
}) {
  const data = freeViewData(details, guestName);
  if (details.templateCode === "tpl_modern") {
    return <FreeModernTemplate data={data} actions={actions} whatsapp={details.whatsapp} localReplies={localReplies} />;
  }
  if (details.templateCode === "tpl_floral") {
    return <FloralTemplate data={data} actions={actions} freePlan localReplies={localReplies} whatsapp={details.whatsapp} />;
  }
  if (details.templateCode === "tpl_royal") {
    return <RoyalTemplate data={data} actions={actions} freePlan localReplies={localReplies} whatsapp={details.whatsapp} />;
  }
  return <FreeArchTemplate data={data} actions={actions} theme={details.theme} whatsapp={details.whatsapp} localReplies={localReplies} />;
}
