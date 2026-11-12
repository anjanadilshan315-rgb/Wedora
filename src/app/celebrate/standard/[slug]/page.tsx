"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import StandardInvitation from "@/components/invitation/StandardInvitation";

import type { PublicStandardInvitation } from "@/lib/standard-invitation";
import { standardRequest } from "@/lib/standard-studio-client";

function PublishedInvitation() {
  const { slug } = useParams<{ slug: string }>();
  const search = useSearchParams();
  const token = search.get("guest");
  const query = token ? `?guest=${encodeURIComponent(token)}` : "";
  const [invitation, setInvitation] = useState<PublicStandardInvitation | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setInvitation(null);
    setError("");
    standardRequest<PublicStandardInvitation>(`public/${encodeURIComponent(slug)}${query}`)
      .then((result) => { if (!cancelled) setInvitation(result); })
      .catch((reason: Error) => { if (!cancelled) setError(reason.message); });
    return () => { cancelled = true; };
  }, [slug, query]);

  if (error) return <main className="min-h-screen bg-[#FAF7F2] px-6 py-28 text-center"><h1 className="font-serif-luxury text-4xl">Your invitation</h1><p role="alert" className="mx-auto mt-5 max-w-md text-sm leading-7">{error}</p><Link href="/" className="mt-8 inline-block underline">Visit Liora</Link></main>;
  if (!invitation) return <p role="status" className="p-20 text-center">Opening your invitation...</p>;
  return <StandardInvitation details={invitation.details} guestName={invitation.guest?.name} initialReply={invitation.guest?.reply} initialStatus={invitation.guest?.status} sharePath={`/celebrate/standard/${slug}`} submitRsvp={async (input) => {
    const result = await standardRequest<PublicStandardInvitation>(`public/${encodeURIComponent(slug)}/rsvp${query}`, "POST", input);
    setInvitation(result);
  }} />;
}

export default function CelebrationPage() {
  return <Suspense fallback={<p role="status" className="p-20 text-center">Opening your invitation...</p>}><PublishedInvitation /></Suspense>;
}



