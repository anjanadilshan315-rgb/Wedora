"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import FreeInvitationTemplate from "@/components/invitation/FreeInvitationTemplate";
import type { InvitationInteractions } from "@/components/invitation/types";
import type { PublicFreeInvitation } from "@/lib/free-studio-types";
import { studioRequest } from "@/lib/free-studio-client";

function PublishedInvitation() {
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const token = search.get("guest");
  const query = token ? `?guest=${encodeURIComponent(token)}` : "";
  const [invitation, setInvitation] = useState<PublicFreeInvitation | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setInvitation(null);
    setError("");
    studioRequest<PublicFreeInvitation>(`public/${encodeURIComponent(slug)}${query}`)
      .then((result) => { if (!cancelled) setInvitation(result); })
      .catch((reason: Error) => { if (!cancelled) setError(reason.message); });
    return () => { cancelled = true; };
  }, [slug, query]);

  if (error) return <main className="min-h-screen bg-[#FAF7F2] px-6 py-28 text-center"><h1 className="font-serif-luxury text-4xl">Your invitation</h1><p role="alert" className="mx-auto mt-5 max-w-md text-sm leading-7">{error}</p><Link href="/" className="mt-8 inline-block underline">Visit Forever</Link></main>;
  if (!invitation) return <p role="status" className="p-20 text-center">Opening your invitation…</p>;
  const actions: InvitationInteractions = {
    mode: "live", wishes: [], guestIdentified: Boolean(invitation.guest),
    rsvp: invitation.guest ? { status: invitation.guest.status, headCount: 1 } : null,
    submitWish: async () => { throw new Error("Wishes are not included in this invitation."); },
    submitRsvp: async ({ name, attending }) => {
      const result = await studioRequest<PublicFreeInvitation>(`public/${encodeURIComponent(slug)}/rsvp${query}`, "POST", { name, attending });
      setInvitation(result);
    },
  };
  return <FreeInvitationTemplate key={invitation.guest ? "identified" : "open"} details={invitation.details} guestName={invitation.guest?.name} actions={actions} />;
}

export default function CelebrationPage() {
  return <Suspense fallback={<p role="status" className="p-20 text-center">Opening your invitation…</p>}><PublishedInvitation /></Suspense>;
}
