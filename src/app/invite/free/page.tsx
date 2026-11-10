"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FreeInvitationTemplate from "@/components/invitation/FreeInvitationTemplate";
import type { InvitationInteractions } from "@/components/invitation/types";
import { decodeFreeDetails } from "@/lib/free-invitation";

interface SavedReply { name: string; attending: boolean }

function GuestInvitation({ detailsText, guest }: { detailsText: string; guest: string | null }) {
  const details = decodeFreeDetails(detailsText);
  const [reply, setReply] = useState<SavedReply | null>(null);
  const [ready, setReady] = useState(false);
  // Each invitation and personal guest link has its own saved answer.
  const storageKey = `forever.free-reply.v1:${detailsText}:${guest || ""}`;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (typeof saved?.name === "string" && typeof saved.attending === "boolean") setReply(saved);
    } catch { /* A guest can still reply when saved browser data is unreadable. */ }
    setReady(true);
  }, [storageKey]);

  if (!details) return <div className="min-h-screen bg-[#FFF7F9] px-6 py-24 text-center">
    <h1 className="font-serif-luxury text-4xl">This invitation link is incomplete</h1>
    <p className="mt-4 text-sm">Ask the couple to send their full invitation link again.</p>
    <Link href="/free-invitation" className="mt-6 inline-block underline">Create a free invitation</Link>
  </div>;
  if (!ready) return <p role="status" className="p-12 text-center">Opening your invitation…</p>;

  const actions: InvitationInteractions = {
    mode: "live", wishes: [], guestIdentified: false,
    rsvp: reply ? { status: reply.attending ? "attending" : "declined", headCount: 1 } : null,
    submitWish: async () => undefined,
    submitRsvp: async ({ name, attending }) => {
      const saved = { name, attending };
      // Never claim an answer was saved if storage is blocked or full.
      localStorage.setItem(storageKey, JSON.stringify(saved));
      setReply(saved);
    },
  };
  return <FreeInvitationTemplate key={reply ? "answered" : "unanswered"} details={details} guestName={reply?.name || guest} actions={actions} localReplies />;
}

function ReadInvitationLink() {
  const search = useSearchParams();
  const detailsText = search.get("details") || "";
  const guest = search.get("guest")?.slice(0, 150) || null;
  return <GuestInvitation key={`${detailsText}:${guest}`} detailsText={detailsText} guest={guest} />;
}

export default function FreeInvitationPage() {
  return <Suspense fallback={<p role="status" className="p-12 text-center">Opening your invitation…</p>}><ReadInvitationLink /></Suspense>;
}
