"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import type { InvitationSummary } from "@/lib/types";

/** Older "Guests & RSVP" link: opens the guest list of the (first) paid invitation. */
export default function GuestsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    api<InvitationSummary[]>("/customer/invitations")
      .then(({ data }) => {
        const paid = data.find((i) => i.status === "paid");
        router.replace(paid ? `/dashboard/invitations/${paid.id}/guests` : "/dashboard");
      })
      .catch(() => router.replace("/dashboard"));
  }, [router]);

  return <Spinner />;
}
