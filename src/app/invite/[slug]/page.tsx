"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, HeartCrack } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import type { PublicInvitation, RsvpStatus } from "@/lib/types";
import { designFor, designForDemoSlug, toViewData } from "@/components/invitation/registry";
import { sampleInvitation } from "@/components/invitation/sample-data";
import type { InvitationInteractions, WishItem } from "@/components/invitation/types";

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5EE]">
      <div className="w-8 h-8 rounded-full border-2 border-[#C59B48] animate-ping" />
    </div>
  );
}

/* ─────────────── Template gallery previews (/invite/demo-…) ─────────────── */

function DemoInvitation({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const design = designForDemoSlug(slug)!;
  const data = useMemo(() => sampleInvitation(design.code, searchParams.get("guest")), [design.code, searchParams]);
  const [wishes, setWishes] = useState<WishItem[]>([]);

  const actions: InvitationInteractions = {
    mode: "demo",
    wishes,
    guestIdentified: false,
    rsvp: null,
    submitWish: async (name, message) => setWishes((w) => [{ id: Date.now(), name, message }, ...w]),
    submitRsvp: async () => undefined,
  };

  const Template = design.component;
  return (
    <>
      <Link
        href="/templates"
        className="fixed top-4 left-4 z-[999] bg-white/85 backdrop-blur-md text-[#2D241A] rounded-full pl-3 pr-4 py-2 shadow-md border border-[#EADBCA] hover:bg-white flex items-center gap-1.5 text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Templates
      </Link>
      <Template data={data} actions={actions} />
    </>
  );
}

/* ─────────────── Real invitations (/invite/kaveen-ishara?guest=…&code=…) ─────────────── */

const codeStorageKey = (slug: string) => `wedora.invite-code.${slug}`;

function readStoredCode(slug: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(codeStorageKey(slug));
  } catch {
    return null;
  }
}

function LiveInvitation({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get("code");
  const urlGuest = searchParams.get("guest");

  const [invitation, setInvitation] = useState<PublicInvitation | null>(null);
  const [wishes, setWishes] = useState<WishItem[]>([]);
  // A guest without a link code who already replied once keeps their code in localStorage.
  const [code, setCode] = useState<string | null>(() => urlCode ?? readStoredCode(slug));
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  const loadWishes = useCallback(async () => {
    const { data } = await api<WishItem[]>(`/public/invitations/${encodeURIComponent(slug)}/wishes`, {
      auth: false,
      query: { limit: 50 },
    });
    setWishes(data);
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api<PublicInvitation>(`/public/invitations/${encodeURIComponent(slug)}`, {
          auth: false,
          query: { code: urlCode ?? readStoredCode(slug) ?? undefined },
        });
        if (cancelled) return;
        setInvitation(data);
        setState("ready");
        loadWishes().catch(() => undefined);
      } catch (error) {
        if (!cancelled) setState(error instanceof ApiError && error.status === 404 ? "missing" : "error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, urlCode, loadWishes]);

  if (state === "loading") return <Spinner />;

  if (state !== "ready" || !invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] px-6 text-center">
        <HeartCrack className="w-12 h-12 text-[#C59B48] mb-4" />
        <h1 className="font-serif-luxury text-3xl font-bold text-[#29221D]">
          {state === "missing" ? "Invitation not available" : "Something went wrong"}
        </h1>
        <p className="text-sm text-[#7D736A] mt-2 max-w-sm">
          {state === "missing"
            ? "This invitation link is not active yet or no longer exists. Please check the link you received."
            : "We could not load this invitation. Please check your connection and try again."}
        </p>
        <Link href="/" className="mt-6 text-sm font-semibold text-[#B88737] hover:underline">
          Go to Wedora
        </Link>
      </div>
    );
  }

  const guestName = invitation.guest?.name ?? urlGuest;
  const design = designFor(invitation.template.code);
  const Template = design.component;

  const actions: InvitationInteractions = {
    mode: "live",
    wishes,
    guestIdentified: Boolean(invitation.guest && code),
    rsvp: invitation.guest ? { status: invitation.guest.rsvpStatus, headCount: invitation.guest.headCount } : null,
    submitWish: async (name, message) => {
      await api(`/public/invitations/${encodeURIComponent(slug)}/wishes`, {
        method: "POST",
        auth: false,
        body: { name, message, ...(code ? { code } : {}) },
      });
      await loadWishes().catch(() => undefined);
    },
    submitRsvp: async ({ attending, headCount, name }) => {
      const { data } = await api<{ name: string; rsvpStatus: RsvpStatus; headCount: number; inviteCode: string }>(
        `/public/invitations/${encodeURIComponent(slug)}/rsvp`,
        {
          method: "POST",
          auth: false,
          body: code && invitation.guest ? { code, attending, headCount } : { name, attending, headCount },
        },
      );
      if (!code || !invitation.guest) {
        try {
          window.localStorage.setItem(codeStorageKey(slug), data.inviteCode);
        } catch {
          /* ignore */
        }
        setCode(data.inviteCode);
        setInvitation({ ...invitation, guest: { name: data.name, rsvpStatus: data.rsvpStatus, headCount: data.headCount } });
      }
    },
  };

  return <Template key={invitation.guest?.name ?? "anonymous"} data={toViewData(invitation, guestName)} actions={actions} />;
}

function InviteContent() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);
  return designForDemoSlug(slug) ? <DemoInvitation slug={slug} /> : <LiveInvitation slug={slug} />;
}

export default function InvitePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <InviteContent />
    </Suspense>
  );
}
