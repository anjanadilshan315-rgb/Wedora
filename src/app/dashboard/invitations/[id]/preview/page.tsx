"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { Notice, Spinner } from "@/components/dashboard/ui";
import { designFor, toViewData } from "@/components/invitation/registry";
import type { InvitationInteractions } from "@/components/invitation/types";
import { api, errorMessage } from "@/lib/api";
import type { Invitation } from "@/lib/types";

const PREVIEW_ACTIONS: InvitationInteractions = {
  mode: "preview",
  wishes: [],
  guestIdentified: false,
  rsvp: null,
  submitWish: async () => undefined,
  submitRsvp: async () => undefined,
};

/** The couple's own preview — works for drafts too; RSVP and wishes are disabled. */
export default function PreviewInvitationPage() {
  const params = useParams<{ id: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Invitation>(`/customer/invitations/${params.id}`)
      .then(({ data }) => setInvitation(data))
      .catch((e) => setError(errorMessage(e, "Could not load this invitation.")));
  }, [params.id]);

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-8">
        <Notice tone="error">{error}</Notice>
        <Link href="/dashboard" className="inline-block mt-4 text-sm text-[#9A6F24] underline">
          Back to dashboard
        </Link>
      </div>
    );
  }
  if (!invitation) return <Spinner label="Loading preview…" />;

  const Template = designFor(invitation.template.code).component;

  return (
    <>
      <div className="sticky top-0 z-[999] flex items-center justify-between gap-3 bg-[#29221D] text-white px-4 py-2.5 text-xs">
        <Link href={`/dashboard/invitations/${invitation.id}/edit`} className="flex items-center gap-1.5 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Edit details
        </Link>
        <span className="flex items-center gap-1.5 text-white/80">
          <Eye className="w-4 h-4" /> Preview — {invitation.status === "paid" ? "this is how guests see it" : "guests can open it once payment is confirmed"}
        </span>
      </div>
      <Template data={toViewData(invitation, "Guest Name")} actions={PREVIEW_ACTIONS} />
    </>
  );
}
