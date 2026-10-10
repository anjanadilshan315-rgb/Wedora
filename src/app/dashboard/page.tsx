"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Check,
  Copy,
  Edit,
  Eye,
  Heart,
  Loader2,
  MapPin,
  Plus,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { Card, Notice, Spinner, StatusBadge, ghostButton, primaryButton, secondaryButton } from "@/components/dashboard/ui";
import { formatDateLong } from "@/components/invitation/format";
import { api, errorMessage } from "@/lib/api";
import { useSession } from "@/lib/use-session";
import type { GuestStats, Invitation, InvitationSummary } from "@/lib/types";

const TOTAL_STEPS = 6;

function Progress({ status }: { status: InvitationSummary["status"] }) {
  const steps = [
    { key: "draft", label: "Details" },
    { key: "pending", label: "Submitted" },
    { key: "paid", label: "Paid & Live" },
  ];
  const reached = status === "paid" ? 3 : status === "pending" ? 2 : 1;
  return (
    <ol className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
      {steps.map((step, i) => (
        <li key={step.key} className="flex items-center gap-2">
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center ${
              i < reached ? "bg-[#C59B48] text-white" : "bg-[#F0E8DC] text-[#A69B90]"
            }`}
          >
            {i < reached ? <Check className="w-3 h-3" /> : i + 1}
          </span>
          <span className={i < reached ? "text-[#9A6F24]" : "text-[#A69B90]"}>{step.label}</span>
          {i < steps.length - 1 && <span className="w-6 h-px bg-[#EADBCA]" />}
        </li>
      ))}
    </ol>
  );
}

function GuestStatsRow({ stats }: { stats: GuestStats }) {
  const items = [
    { label: "Invited", value: stats.total, color: "text-[#4A3F37]", bg: "bg-[#F8F5F0]" },
    { label: "Emailed", value: stats.email.sent, color: "text-[#9A6F24]", bg: "bg-[#FBF3E4]" },
    { label: "Accepted", value: stats.rsvp.attending, color: "text-green-600", bg: "bg-green-50" },
    { label: "Declined", value: stats.rsvp.declined, color: "text-red-500", bg: "bg-red-50" },
    { label: "Total Heads", value: stats.rsvp.attendingHeadCount, color: "text-[#29221D]", bg: "bg-[#F0E8DC]/50" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {items.map((stat) => (
        <div key={stat.label} className={`${stat.bg} border border-black/5 rounded-2xl p-3 text-center`}>
          <p className={`text-2xl font-serif-luxury font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-[10px] font-semibold text-[#7D736A] uppercase tracking-wider mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function InvitationCard({ invitation, stats, onDelete }: { invitation: InvitationSummary; stats?: GuestStats; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const title =
    invitation.groomName || invitation.brideName
      ? `${invitation.groomName ?? "Groom"} & ${invitation.brideName ?? "Bride"}'s Wedding`
      : "New invitation";

  const copyLink = async () => {
    if (!invitation.inviteUrl) return;
    await navigator.clipboard.writeText(invitation.inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#FBF3E4] rounded-full opacity-50 blur-3xl pointer-events-none" />
      <div className="relative space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <StatusBadge status={invitation.status} />
              {invitation.referenceNo && <span className="text-[11px] text-[#A69B90] font-mono">{invitation.referenceNo}</span>}
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#29221D]">{title}</h2>
            <p className="text-xs text-[#A69B90] mt-1">Template: {invitation.template.name}</p>
          </div>
          <Progress status={invitation.status} />
        </div>

        {(invitation.weddingDate || invitation.status !== "draft") && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#4A3F37]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C59B48]" /> {formatDateLong(invitation.weddingDate)}
            </span>
          </div>
        )}

        {invitation.status === "draft" && (
          <Notice tone="info">
            You are on step {Math.min(invitation.currentStep, TOTAL_STEPS)} of {TOTAL_STEPS}. Complete the details and submit — our team will then contact you
            for the payment.
          </Notice>
        )}
        {invitation.status === "pending" && (
          <Notice tone="warning">
            Submitted{invitation.submittedAt ? ` on ${new Date(invitation.submittedAt).toLocaleDateString()}` : ""}. Our team will contact you to complete the
            payment. You can still edit your details until then.
          </Notice>
        )}
        {invitation.status === "cancelled" && <Notice tone="error">This invitation was cancelled. Please contact us if you need help.</Notice>}

        {invitation.status === "paid" && (
          <>
            <Notice tone="success">
              Payment confirmed{invitation.paidAt ? ` on ${new Date(invitation.paidAt).toLocaleDateString()}` : ""}. Your invitation is live — add your guests
              and send it!
            </Notice>
            {invitation.inviteUrl && (
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center bg-[#FCFAF7] border border-[#F0E8DC] rounded-2xl p-3">
                <code className="flex-1 text-xs text-[#7D736A] break-all">{invitation.inviteUrl}</code>
                <button onClick={copyLink} className={ghostButton}>
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            )}
            {stats && <GuestStatsRow stats={stats} />}
          </>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {(invitation.status === "draft" || invitation.status === "pending") && (
            <Link href={`/dashboard/invitations/${invitation.id}/edit`} className={primaryButton}>
              <Edit className="w-4 h-4" /> {invitation.status === "draft" ? "Continue" : "Edit details"}
            </Link>
          )}
          {invitation.status === "paid" && (
            <Link href={`/dashboard/invitations/${invitation.id}/guests`} className={primaryButton}>
              <Users className="w-4 h-4" /> Guests & Send
            </Link>
          )}
          <Link
            href={invitation.status === "paid" && invitation.slug ? `/invite/${invitation.slug}` : `/dashboard/invitations/${invitation.id}/preview`}
            target="_blank"
            className={secondaryButton}
          >
            <Eye className="w-4 h-4" /> {invitation.status === "paid" ? "View live" : "Preview"}
          </Link>
          {invitation.status === "draft" && (
            <button onClick={onDelete} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

/** Invitations plus guest statistics for the paid ones. */
async function fetchOverview(): Promise<{ invitations: InvitationSummary[]; stats: Record<number, GuestStats> }> {
  const { data: invitations } = await api<InvitationSummary[]>("/customer/invitations");
  const details = await Promise.all(
    invitations
      .filter((i) => i.status === "paid")
      .map((i) =>
        api<Invitation>(`/customer/invitations/${i.id}`)
          .then((r) => r.data)
          .catch(() => null),
      ),
  );
  const stats: Record<number, GuestStats> = {};
  for (const d of details) if (d?.guestStats) stats[d.id] = d.guestStats;
  return { invitations, stats };
}

export default function DashboardPage() {
  const { session } = useSession();
  const [invitations, setInvitations] = useState<InvitationSummary[] | null>(null);
  const [stats, setStats] = useState<Record<number, GuestStats>>({});
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetchOverview()
      .then((result) => {
        if (!active) return;
        setInvitations(result.invitations);
        setStats(result.stats);
      })
      .catch((e) => {
        if (!active) return;
        setError(errorMessage(e, "Could not load your invitations."));
        setInvitations([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this draft invitation? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api(`/customer/invitations/${id}`, { method: "DELETE" });
      setInvitations((list) => list?.filter((i) => i.id !== id) ?? null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#29221D]">Welcome back{session ? `, ${session.user.firstName}` : ""}!</h1>
          <p className="text-sm text-[#7D736A] mt-1">Here is the overview of your wedding invitations.</p>
        </div>
        <Link href="/templates" className={primaryButton}>
          <Plus className="w-4 h-4" /> New Invitation
        </Link>
      </motion.div>

      {error && (
        <div className="mb-6">
          <Notice tone="error" onClose={() => setError("")}>
            {error}
          </Notice>
        </div>
      )}

      {invitations === null ? (
        <Spinner label="Loading your invitations…" />
      ) : invitations.length === 0 ? (
        <Card className="p-10 text-center">
          <Heart className="w-10 h-10 mx-auto text-[#C59B48] mb-4" />
          <h2 className="font-serif-luxury text-2xl font-bold text-[#29221D]">Create your first invitation</h2>
          <p className="text-sm text-[#7D736A] mt-2 max-w-md mx-auto">
            Pick a template you love, fill in your wedding details and upload your photos. After payment you can send it to all your guests by email.
          </p>
          <Link href="/templates" className={`${primaryButton} mt-6`}>
            <Send className="w-4 h-4" /> Browse templates
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {invitations.map((invitation, i) => (
            <motion.div key={invitation.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i, duration: 0.4 }} className="relative">
              {deletingId === invitation.id && (
                <div className="absolute inset-0 z-10 bg-white/60 rounded-3xl flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#C59B48]" />
                </div>
              )}
              <InvitationCard invitation={invitation} stats={stats[invitation.id]} onDelete={() => handleDelete(invitation.id)} />
            </motion.div>
          ))}
          <p className="text-xs text-[#A69B90] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Need help? <Link href="/contact" className="underline">Contact our team</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
