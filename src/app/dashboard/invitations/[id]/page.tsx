"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Spinner } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import type { InvitationSummary } from "@/lib/types";

/** /dashboard/invitations/:id → the guests page once paid, otherwise the step form. */
export default function InvitationRedirectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    api<InvitationSummary>(`/customer/invitations/${params.id}`)
      .then(({ data }) => router.replace(`/dashboard/invitations/${data.id}/${data.status === "paid" ? "guests" : "edit"}`))
      .catch(() => router.replace("/dashboard"));
  }, [params.id, router]);

  return <Spinner />;
}
