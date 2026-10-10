"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Loader2,
  Mail,
  MessageCircle,
  Plus,
  Search,
  Send,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  FieldError,
  Modal,
  Notice,
  Spinner,
  ghostButton,
  inputClass,
  labelClass,
  primaryButton,
  secondaryButton,
} from "@/components/dashboard/ui";
import { formatDateShort } from "@/components/invitation/format";
import { api, ApiError, errorMessage, sampleGuestExcelUrl } from "@/lib/api";
import type { EmailBatch, Guest, GuestEmailStatus, GuestStats, ImportResult, Invitation, RsvpStatus, Wish } from "@/lib/types";

const PAGE_SIZE = 25;

const EMAIL_BADGE: Record<GuestEmailStatus, { label: string; cls: string }> = {
  not_sent: { label: "Not sent", cls: "text-[#A69B90] bg-[#F8F5F0]" },
  queued: { label: "Sending…", cls: "text-blue-700 bg-blue-50" },
  sent: { label: "Sent", cls: "text-green-700 bg-green-50" },
  failed: { label: "Failed", cls: "text-red-700 bg-red-50" },
};

function RsvpBadge({ status, headCount }: { status: RsvpStatus; headCount: number }) {
  if (status === "attending")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
        <CheckCircle2 className="w-3.5 h-3.5" /> Attending ({headCount})
      </span>
    );
  if (status === "declined")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
        <XCircle className="w-3.5 h-3.5" /> Declined
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#9A6F24] bg-[#FBF3E4] px-2.5 py-1 rounded-full">
      <Clock className="w-3.5 h-3.5" /> Pending
    </span>
  );
}

interface GuestFormState {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export default function GuestsPage() {
  const params = useParams<{ id: string }>();
  const invitationId = Number(params.id);
  const base = `/customer/invitations/${invitationId}`;

  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState<"guests" | "wishes">("guests");

  // guests list
  const [guests, setGuests] = useState<Guest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [emailFilter, setEmailFilter] = useState<GuestEmailStatus | "">("");
  const [rsvpFilter, setRsvpFilter] = useState<RsvpStatus | "">("");
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedKey, setLoadedKey] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [stats, setStats] = useState<GuestStats | null>(null);

  // actions
  const [notice, setNotice] = useState<{ tone: "success" | "error" | "info"; text: string } | null>(null);
  const [guestForm, setGuestForm] = useState<GuestFormState | null>(null);
  const [guestFormErrors, setGuestFormErrors] = useState<Record<string, string>>({});
  const [savingGuest, setSavingGuest] = useState(false);
  const [importing, setImporting] = useState(false);
  const [sendAfterImport, setSendAfterImport] = useState(true);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [batch, setBatch] = useState<EmailBatch | null>(null);
  const [sending, setSending] = useState(false);
  const [copiedId, setCopiedId] = useState<number | "main" | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // wishes
  const [wishes, setWishes] = useState<Wish[]>([]);

  const isPaid = invitation?.status === "paid";

  const listKey = JSON.stringify({ page, search: search.trim(), emailFilter, rsvpFilter, reloadKey });
  const listLoading = loadedKey !== listKey;
  const loadGuests = useCallback(() => setReloadKey((k) => k + 1), []);

  const loadStats = useCallback(async () => {
    const { data } = await api<GuestStats>(`${base}/guests/stats`);
    setStats(data);
  }, [base]);


  // initial load
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api<Invitation>(base);
        setInvitation(data);
        if (data.guestStats) setStats(data.guestStats);
        const batches = await api<EmailBatch[]>(`${base}/email-batches`);
        const active = batches.data.find((b) => b.status === "queued" || b.status === "processing");
        if (active) setBatch(active);
      } catch (e) {
        setLoadError(e instanceof ApiError && e.status === 404 ? "This invitation was not found." : errorMessage(e));
      }
    })();
  }, [base]);

  const hasInvitation = invitation !== null;

  useEffect(() => {
    if (!hasInvitation) return;
    let active = true;
    const { page: p, search: q, emailFilter: es, rsvpFilter: rs } = JSON.parse(listKey);
    api<Guest[]>(`${base}/guests`, { query: { page: p, limit: PAGE_SIZE, search: q, emailStatus: es, rsvpStatus: rs } })
      .then((res) => {
        if (!active) return;
        setGuests(res.data);
        setTotal(res.meta?.total ?? res.data.length);
      })
      .catch((e) => active && setNotice({ tone: "error", text: errorMessage(e) }))
      .finally(() => active && setLoadedKey(listKey));
    return () => {
      active = false;
    };
  }, [hasInvitation, base, listKey]);

  useEffect(() => {
    if (!hasInvitation || tab !== "wishes") return;
    let active = true;
    api<Wish[]>(`${base}/wishes`, { query: { limit: 100 } })
      .then(({ data }) => active && setWishes(data))
      .catch((e) => active && setNotice({ tone: "error", text: errorMessage(e) }));
    return () => {
      active = false;
    };
  }, [hasInvitation, tab, base]);

  // poll the running e-mail batch
  useEffect(() => {
    if (!batch || batch.status.startsWith("completed")) return;
    const timer = setInterval(async () => {
      try {
        const { data } = await api<EmailBatch>(`${base}/email-batches/${batch.id}`);
        setBatch(data);
        if (data.status.startsWith("completed")) {
          clearInterval(timer);
          loadGuests();
          loadStats().catch(() => undefined);
          setNotice({
            tone: data.failedCount ? "error" : "success",
            text: data.failedCount
              ? `Sent ${data.sentCount} invitation(s); ${data.failedCount} failed. Check the guests marked "Failed" and try again.`
              : `All ${data.sentCount} invitation(s) were sent successfully.`,
          });
        }
      } catch {
        /* keep polling */
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [batch, base, loadGuests, loadStats]);

  if (loadError) {
    return (
      <div className="max-w-xl mx-auto">
        <Notice tone="error">{loadError}</Notice>
        <Link href="/dashboard" className={`${secondaryButton} mt-4`}>
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>
      </div>
    );
  }
  if (!invitation) return <Spinner label="Loading guests…" />;

  const couple = `${invitation.groomName ?? "Groom"} & ${invitation.brideName ?? "Bride"}`;
  const sendingNow = batch !== null && !batch.status.startsWith("completed");
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const refresh = () => {
    loadGuests();
    loadStats().catch(() => undefined);
  };

  const copy = async (text: string, key: number | "main") => {
    await navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const whatsappLink = (guest: Guest) => {
    const phone = (guest.phone ?? "").replace(/[^0-9]/g, "").replace(/^0/, "94");
    const message = `Dear ${guest.name},\n\n${invitation.greetingMessage ?? "You are cordially invited to our wedding!"}\n\n${
      invitation.rsvpDeadline ? `Please RSVP before ${formatDateShort(invitation.rsvpDeadline)}.\n\n` : ""
    }View your invitation: ${guest.inviteUrl ?? ""}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // ---- guest add / edit
  const saveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm) return;
    setSavingGuest(true);
    setGuestFormErrors({});
    const body = { name: guestForm.name.trim(), email: guestForm.email.trim(), phone: guestForm.phone.trim() };
    try {
      if (guestForm.id) await api(`${base}/guests/${guestForm.id}`, { method: "PATCH", body });
      else await api(`${base}/guests`, { method: "POST", body });
      setNotice({ tone: "success", text: guestForm.id ? "Guest updated." : `${body.name} was added to your guest list.` });
      setGuestForm(null);
      refresh();
    } catch (err) {
      if (err instanceof ApiError && err.code === "VALIDATION_ERROR") setGuestFormErrors(err.fieldErrors());
      else if (err instanceof ApiError && err.code === "GUEST_EXISTS") setGuestFormErrors({ email: err.message });
      else setGuestFormErrors({ form: errorMessage(err) });
    } finally {
      setSavingGuest(false);
    }
  };

  const deleteGuest = async (guest: Guest) => {
    if (!confirm(`Remove ${guest.name} from the guest list?`)) return;
    try {
      await api(`${base}/guests/${guest.id}`, { method: "DELETE" });
      setSelected((s) => {
        const next = new Set(s);
        next.delete(guest.id);
        return next;
      });
      refresh();
    } catch (err) {
      setNotice({ tone: "error", text: errorMessage(err) });
    }
  };

  const deleteSelected = async () => {
    if (!selected.size || !confirm(`Remove ${selected.size} selected guest(s)?`)) return;
    try {
      await api(`${base}/guests/bulk-delete`, { method: "POST", body: { guestIds: [...selected] } });
      setSelected(new Set());
      refresh();
    } catch (err) {
      setNotice({ tone: "error", text: errorMessage(err) });
    }
  };

  // ---- Excel import
  const importExcel = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setNotice({ tone: "error", text: "Please upload an .xlsx Excel file. Download the sample file for the correct format." });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setNotice({ tone: "error", text: "The Excel file must be smaller than 2 MB." });
      return;
    }
    setImporting(true);
    setNotice(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("sendEmails", sendAfterImport && !sendingNow ? "true" : "false");
      const { data } = await api<ImportResult>(`${base}/guests/import`, { method: "POST", form: body });
      setImportResult(data);
      if (data.emailBatch) setBatch(data.emailBatch);
      setPage(1);
      refresh();
    } catch (err) {
      setNotice({ tone: "error", text: errorMessage(err) });
    } finally {
      setImporting(false);
    }
  };

  // ---- bulk e-mail
  const sendEmails = async (mode: "unsent" | "all" | "selected") => {
    const count = mode === "selected" ? selected.size : mode === "unsent" ? (stats?.email.notSent ?? 0) + (stats?.email.failed ?? 0) : stats?.withEmail ?? 0;
    const label = mode === "selected" ? `${count} selected guest(s)` : mode === "unsent" ? `${count} guest(s) who have not received it yet` : `all ${count} guest(s) with an e-mail`;
    if (!confirm(`Send the invitation e-mail to ${label}?`)) return;
    setSending(true);
    setNotice(null);
    try {
      const { data } = await api<EmailBatch>(`${base}/email-batches`, {
        method: "POST",
        body: mode === "selected" ? { mode, guestIds: [...selected] } : { mode },
      });
      setBatch(data);
      setSelected(new Set());
      loadGuests();
    } catch (err) {
      setNotice({ tone: "error", text: errorMessage(err) });
    } finally {
      setSending(false);
    }
  };

  // ---- wishes
  const toggleWish = async (wish: Wish) => {
    try {
      const { data } = await api<Wish>(`${base}/wishes/${wish.id}`, { method: "PATCH", body: { isVisible: !wish.isVisible } });
      setWishes((list) => list.map((w) => (w.id === wish.id ? data : w)));
    } catch (err) {
      setNotice({ tone: "error", text: errorMessage(err) });
    }
  };
  const deleteWish = async (wish: Wish) => {
    if (!confirm("Delete this wish?")) return;
    try {
      await api(`${base}/wishes/${wish.id}`, { method: "DELETE" });
      setWishes((list) => list.filter((w) => w.id !== wish.id));
    } catch (err) {
      setNotice({ tone: "error", text: errorMessage(err) });
    }
  };

  const allOnPageSelected = guests.length > 0 && guests.every((g) => selected.has(g.id));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-[#A69B90] hover:text-[#C59B48] text-xs font-semibold uppercase tracking-wider mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#29221D]">Guest List & RSVP</h1>
          <p className="text-sm text-[#7D736A] mt-1">{couple} — import your guests and send the invitation by e-mail.</p>
        </div>
        {invitation.inviteUrl && (
          <div className="flex items-center gap-2">
            <Link href={`/invite/${invitation.slug}`} target="_blank" className={secondaryButton}>
              <Eye className="w-4 h-4" /> View invitation
            </Link>
            <button onClick={() => copy(invitation.inviteUrl!, "main")} className={secondaryButton}>
              {copiedId === "main" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copy link
            </button>
          </div>
        )}
      </div>

      {!isPaid && (
        <Notice tone="warning">
          Guest management unlocks after your payment is confirmed. Current status: <strong>{invitation.status}</strong>.{" "}
          <Link href="/dashboard" className="underline">
            Back to dashboard
          </Link>
        </Notice>
      )}

      {notice && (
        <div className="mb-4">
          <Notice tone={notice.tone} onClose={() => setNotice(null)}>
            {notice.text}
          </Notice>
        </div>
      )}

      {isPaid && (
        <>
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              {[
                { label: "Guests", value: stats.total, cls: "text-[#4A3F37] bg-[#F8F5F0]" },
                { label: "With e-mail", value: stats.withEmail, cls: "text-[#4A3F37] bg-white" },
                { label: "E-mailed", value: stats.email.sent, cls: "text-[#9A6F24] bg-[#FBF3E4]" },
                { label: "Failed", value: stats.email.failed, cls: "text-red-600 bg-red-50" },
                { label: "Attending", value: stats.rsvp.attending, cls: "text-green-600 bg-green-50" },
                { label: "Declined", value: stats.rsvp.declined, cls: "text-red-500 bg-red-50" },
                { label: "Total heads", value: stats.rsvp.attendingHeadCount, cls: "text-[#29221D] bg-[#F0E8DC]/60" },
              ].map((s) => (
                <div key={s.label} className={`${s.cls} border border-black/5 rounded-2xl p-3 text-center`}>
                  <p className="text-2xl font-serif-luxury font-bold">{s.value}</p>
                  <p className="text-[10px] font-semibold text-[#7D736A] uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sending progress */}
          {batch && sendingNow && (
            <div className="mb-6 bg-white border border-[#EADBCA] rounded-2xl p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-[#29221D] mb-2">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#C59B48]" /> Sending invitations…
                </span>
                <span>
                  {batch.sentCount + batch.failedCount} / {batch.totalCount}
                </span>
              </div>
              <div className="h-2 bg-[#F0E8DC] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#C79848] to-[#9A6F24] transition-all" style={{ width: `${batch.progress}%` }} />
              </div>
              <p className="text-[11px] text-[#A69B90] mt-2">You can leave this page — sending continues in the background.</p>
            </div>
          )}

          {/* Import + send */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader icon={<FileSpreadsheet className="w-5 h-5 text-[#C59B48]" />} title="Import from Excel" />
              <div className="p-6 space-y-4">
                <ol className="text-sm text-[#7D736A] space-y-1 list-decimal list-inside">
                  <li>Download the sample Excel file.</li>
                  <li>Fill in your guests&apos; Name, Email (and Phone).</li>
                  <li>Upload it here — duplicates and invalid rows are skipped.</li>
                </ol>
                <label className="flex items-center gap-2 text-sm text-[#4A3F37] cursor-pointer select-none">
                  <input type="checkbox" checked={sendAfterImport} onChange={(e) => setSendAfterImport(e.target.checked)} className="w-4 h-4 accent-[#B88737]" />
                  Send the invitation e-mail to new guests right away
                </label>
                <div className="flex flex-wrap gap-2">
                  <a href={sampleGuestExcelUrl} className={secondaryButton} download>
                    <Download className="w-4 h-4" /> Sample Excel
                  </a>
                  <button onClick={() => fileInput.current?.click()} disabled={importing} className={primaryButton}>
                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload Excel
                  </button>
                  <input
                    ref={fileInput}
                    type="file"
                    accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) importExcel(file);
                    }}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader icon={<Mail className="w-5 h-5 text-[#C59B48]" />} title="Send by E-mail" />
              <div className="p-6 space-y-4">
                <p className="text-sm text-[#7D736A]">
                  Every guest receives a personal link with their name, so their RSVP is matched to them automatically.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => sendEmails("unsent")} disabled={sending || sendingNow || !stats || stats.email.notSent + stats.email.failed === 0} className={primaryButton}>
                    <Send className="w-4 h-4" /> Send to new guests ({stats ? stats.email.notSent + stats.email.failed : 0})
                  </button>
                  <button onClick={() => sendEmails("selected")} disabled={sending || sendingNow || selected.size === 0} className={secondaryButton}>
                    Send to selected ({selected.size})
                  </button>
                  <button onClick={() => sendEmails("all")} disabled={sending || sendingNow || !stats?.withEmail} className={secondaryButton}>
                    Re-send to all
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["guests", "wishes"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === t ? "bg-[#29221D] text-white" : "bg-white border border-[#EADBCA] text-[#7D736A]"}`}
          >
            {t === "guests" ? `Guests (${total})` : "Wishes"}
          </button>
        ))}
      </div>

      {tab === "guests" ? (
        <Card className="overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between p-4 border-b border-[#F0E8DC]">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A69B90]" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search guests…"
                  className="w-full sm:w-56 pl-8 pr-3 py-2 rounded-xl border border-[#E0D8CC] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C59B48]/40"
                />
              </div>
              <select
                value={emailFilter}
                onChange={(e) => {
                  setEmailFilter(e.target.value as GuestEmailStatus | "");
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-[#E0D8CC] bg-white text-xs"
              >
                <option value="">All e-mail statuses</option>
                <option value="not_sent">Not sent</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
                <option value="queued">Sending</option>
              </select>
              <select
                value={rsvpFilter}
                onChange={(e) => {
                  setRsvpFilter(e.target.value as RsvpStatus | "");
                  setPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-[#E0D8CC] bg-white text-xs"
              >
                <option value="">All RSVP</option>
                <option value="attending">Attending</option>
                <option value="declined">Declined</option>
                <option value="pending">No reply</option>
              </select>
            </div>
            {isPaid && (
              <div className="flex gap-2">
                {selected.size > 0 && (
                  <button onClick={deleteSelected} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100">
                    <Trash2 className="w-3.5 h-3.5" /> Remove ({selected.size})
                  </button>
                )}
                <button onClick={() => setGuestForm({ name: "", email: "", phone: "" })} className={primaryButton}>
                  <Plus className="w-4 h-4" /> Add Guest
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCFAF7] border-b border-[#F0E8DC] text-[11px] font-semibold text-[#7D736A] uppercase tracking-wider">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all on this page"
                      disabled={!isPaid}
                      checked={allOnPageSelected}
                      onChange={() =>
                        setSelected((s) => {
                          const next = new Set(s);
                          guests.forEach((g) => (allOnPageSelected ? next.delete(g.id) : next.add(g.id)));
                          return next;
                        })
                      }
                      className="w-4 h-4 accent-[#B88737]"
                    />
                  </th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">E-mail</th>
                  <th className="px-4 py-3 text-center">RSVP</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-[#FCFAF7]/60">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${guest.name}`}
                        disabled={!isPaid}
                        checked={selected.has(guest.id)}
                        onChange={() =>
                          setSelected((s) => {
                            const next = new Set(s);
                            if (next.has(guest.id)) next.delete(guest.id);
                            else next.add(guest.id);
                            return next;
                          })
                        }
                        className="w-4 h-4 accent-[#B88737]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#29221D]">{guest.name}</p>
                      <p className="text-xs text-[#7D736A]">{guest.email ?? "—"}</p>
                      {guest.phone && <p className="text-xs text-[#A69B90]">{guest.phone}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${EMAIL_BADGE[guest.emailStatus].cls}`} title={guest.emailError ?? undefined}>
                        {EMAIL_BADGE[guest.emailStatus].label}
                      </span>
                      {guest.emailStatus === "failed" && guest.emailError && (
                        <p className="text-[10px] text-red-500 mt-1 max-w-[200px] truncate flex items-center gap-1" title={guest.emailError}>
                          <AlertCircle className="w-3 h-3 shrink-0" /> {guest.emailError}
                        </p>
                      )}
                      {guest.emailSentAt && <p className="text-[10px] text-[#A69B90] mt-1">{new Date(guest.emailSentAt).toLocaleString()}</p>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RsvpBadge status={guest.rsvpStatus} headCount={guest.headCount} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {guest.inviteUrl && (
                          <button onClick={() => copy(guest.inviteUrl!, guest.id)} className={ghostButton} title="Copy personal link">
                            {copiedId === guest.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="hidden sm:inline">{copiedId === guest.id ? "Copied" : "Link"}</span>
                          </button>
                        )}
                        {guest.phone && guest.inviteUrl && (
                          <a href={whatsappLink(guest)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#25D366] hover:opacity-90" title="Send on WhatsApp">
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {isPaid && (
                          <>
                            <button onClick={() => setGuestForm({ id: guest.id, name: guest.name, email: guest.email ?? "", phone: guest.phone ?? "" })} className="p-1.5 text-[#A69B90] hover:text-[#9A6F24] hover:bg-[#FBF3E4] rounded-lg" title="Edit">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteGuest(guest)} className="p-1.5 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg" title="Remove">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!listLoading && guests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#7D736A]">
                      {search || emailFilter || rsvpFilter ? "No guests match your filters." : "No guests yet. Import your Excel file or add guests one by one."}
                    </td>
                  </tr>
                )}
                {listLoading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <Loader2 className="w-5 h-5 animate-spin text-[#C59B48] mx-auto" />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#F0E8DC] text-xs text-[#7D736A]">
              <span>
                Page {page} of {totalPages} · {total} guests
              </span>
              <div className="flex gap-1">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className={ghostButton} aria-label="Previous page">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className={ghostButton} aria-label="Next page">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-6">
          {wishes.length === 0 ? (
            <p className="text-sm text-center text-[#7D736A] py-8">No wishes yet. They appear here when guests post them on your invitation.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishes.map((w) => (
                <div key={w.id} className={`rounded-2xl border p-4 ${w.isVisible ? "border-[#EADBCA] bg-white" : "border-dashed border-[#DFD3C3] bg-[#FCFAF7] opacity-70"}`}>
                  <p className="text-sm italic text-[#4A3F37] break-words">&ldquo;{w.message}&rdquo;</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs font-semibold text-[#9A6F24]">
                      — {w.name}
                      <span className="font-normal text-[#A69B90]"> · {new Date(w.createdAt).toLocaleDateString()}</span>
                    </p>
                    <div className="flex gap-1">
                      <button onClick={() => toggleWish(w)} className={ghostButton} title={w.isVisible ? "Hide from invitation" : "Show on invitation"}>
                        {w.isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} {w.isVisible ? "Hide" : "Show"}
                      </button>
                      <button onClick={() => deleteWish(w)} className="p-1.5 text-[#A69B90] hover:text-red-500 hover:bg-red-50 rounded-lg" aria-label="Delete wish">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Add / edit guest */}
      {guestForm && (
        <Modal title={guestForm.id ? "Edit Guest" : "Add Guest"} onClose={() => setGuestForm(null)}>
          <form onSubmit={saveGuest} className="space-y-4">
            {guestFormErrors.form && <Notice tone="error">{guestFormErrors.form}</Notice>}
            <div className="space-y-1.5">
              <label className={labelClass}>Name *</label>
              <input required maxLength={150} value={guestForm.name} onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })} className={inputClass} placeholder="e.g. Nimal Perera" />
              <FieldError message={guestFormErrors.name} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>E-mail *</label>
              <input required type="email" value={guestForm.email} onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })} className={inputClass} placeholder="nimal@example.com" />
              <FieldError message={guestFormErrors.email} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>WhatsApp / Phone</label>
              <input type="tel" value={guestForm.phone} onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })} className={inputClass} placeholder="+94 77 123 4567" />
              <FieldError message={guestFormErrors.phone} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setGuestForm(null)} className={secondaryButton}>
                Cancel
              </button>
              <button type="submit" disabled={savingGuest} className={primaryButton}>
                {savingGuest && <Loader2 className="w-4 h-4 animate-spin" />} {guestForm.id ? "Save" : "Add to list"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Import result */}
      {importResult && (
        <Modal title="Import complete" onClose={() => setImportResult(null)} wide>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-[#F8F5F0] p-3">
                <p className="text-2xl font-serif-luxury font-bold">{importResult.totalRows}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#7D736A]">Rows</p>
              </div>
              <div className="rounded-2xl bg-green-50 p-3">
                <p className="text-2xl font-serif-luxury font-bold text-green-700">{importResult.imported}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#7D736A]">Imported</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3">
                <p className="text-2xl font-serif-luxury font-bold text-amber-700">{importResult.skipped}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#7D736A]">Skipped</p>
              </div>
            </div>
            {importResult.emailBatch && <Notice tone="success">Sending the invitation to {importResult.emailBatch.totalCount} new guest(s)…</Notice>}
            {importResult.errors.length > 0 && (
              <div>
                <p className={`${labelClass} mb-2`}>Skipped rows</p>
                <ul className="max-h-60 overflow-y-auto divide-y divide-[#F0E8DC] border border-[#F0E8DC] rounded-xl text-sm">
                  {importResult.errors.map((e) => (
                    <li key={`${e.row}-${e.reason}`} className="px-3 py-2 flex gap-3">
                      <span className="font-mono text-xs text-[#A69B90] shrink-0">Row {e.row}</span>
                      <span className="text-[#4A3F37]">{e.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end">
              <button onClick={() => setImportResult(null)} className={primaryButton}>
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
