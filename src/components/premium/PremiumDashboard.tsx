"use client";
import { useState } from "react";
import { ArrowUpRight, Download, RefreshCw, Users } from "lucide-react";
import { premiumAnalytics, premiumGuestCsv, type PremiumDetails, type PremiumSnapshot } from "@/lib/premium-invitation";
import { premiumRequest } from "@/lib/premium-studio-client";
import ShareInvitation from "@/components/basic-studio/ShareInvitation";
import styles from "./PremiumStudio.module.css";

export default function PremiumDashboard({ snapshot, details, busy, perform, onSnapshot }: {
  snapshot: PremiumSnapshot | null; details: PremiumDetails; busy: boolean;
  perform: (action: () => Promise<void>) => Promise<void>; onSnapshot: (snapshot: PremiumSnapshot) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [name, setName] = useState("");
  const [sharing, setSharing] = useState("");
  const guests = snapshot?.guests ?? [];
  const invitation = snapshot?.invitation;
  const analytics = premiumAnalytics(guests, details);
  const path = invitation ? `/celebrate/premium/${invitation.slug}` : "";
  const visible = guests.filter((g) => (status === "all" || g.status === status) && `${g.name} ${g.group} ${g.notes}`.toLowerCase().includes(search.toLowerCase()));
  function downloadCsv() {
    const url = URL.createObjectURL(new Blob([premiumGuestCsv(guests, details)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "premium-wedding-guests.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  return <div className={styles.dashboard}>
    <div className={styles.statGrid}>{[["Invitation parties", analytics.invited], ["Attending people", analytics.attending], ["Awaiting reply", analytics.pending], ["Declined parties", analytics.declined]].map(([label, n]) => <div key={label} className={styles.stat}><span>{label}</span><strong>{n}</strong></div>)}</div>
    <section className={styles.panel}><div className={styles.panelHeading}><div><span>01 / INVITATION ANALYTICS</span><h2>A little closer to everyone.</h2></div><button type="button" className={styles.secondary} disabled={busy || !snapshot} onClick={() => void perform(async () => onSnapshot(await premiumRequest<PremiumSnapshot>("studio")))}><RefreshCw size={14} />Refresh</button></div><div className={styles.analytics}><div><p><strong>{invitation?.views ?? 0}</strong> total invitation opens</p><p><strong>{analytics.opened}</strong> personal links opened</p><small>Opens are page loads, not unique people. Counts start after password access is granted.</small></div><div>{analytics.events.map((event) => <div key={event.id} className={styles.eventBar}><span>{event.name}<strong>{event.count} people</strong></span><progress aria-label={`${event.name} attendance`} max={Math.max(1, analytics.attending)} value={event.count} /></div>)}</div></div></section>
    <section className={styles.panel}><div className={styles.panelHeading}><div><span>02 / YOUR SEATING PLAN</span><h2>A place for every favourite person.</h2></div></div><p className={styles.help}>Create tables in the editor, save your draft, then assign each guest party below. Pending parties reserve one seat; replies reserve their full party size. Declined parties reserve none.</p><div className={styles.tableCards}>{details.seatingTables.map((table) => { const parties = guests.filter((g) => g.tableId === table.id); const places = parties.reduce((n, g) => n + (g.status === "declined" ? 0 : Math.max(1, g.reply?.headCount ?? 1)), 0); return <article key={table.id}><span><Users size={14} />{places} / {table.capacity} seats</span><h3>{table.name}</h3><p>{parties.map((g) => g.name).join(" · ") || "A lovely table, waiting to be filled."}</p></article>; })}</div>{!details.seatingTables.length && <p className={styles.help}>Add seating tables in your invitation editor.</p>}</section>
    <section className={styles.panel}><div className={styles.panelHeading}><div><span>03 / GUEST CONCIERGE</span><h2>Every name. Every thoughtful detail.</h2></div><button type="button" className={styles.secondary} disabled={!guests.length} onClick={downloadCsv}><Download size={14} />Guest CSV</button></div>
      <form className={styles.addGuest} onSubmit={(event) => { event.preventDefault(); void perform(async () => { onSnapshot(await premiumRequest<PremiumSnapshot>("guests", "POST", { name })); setName(""); }); }}><label>Invite a guest<input required maxLength={150} placeholder="Guest or family name" value={name} onChange={(event) => setName(event.target.value)} /></label><button className={styles.primary} disabled={!invitation || busy}>Add to guest list <ArrowUpRight size={14} /></button></form>
      <p className={styles.help}>Unlimited guest invitations under fair use. Each guest receives an individual link after publication.</p>
      <div className={styles.filters}><label>Find a guest<input type="search" value={search} placeholder="Name, group or private note" onChange={(event) => setSearch(event.target.value)} /></label><label>Attendance<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All guests</option><option value="pending">Awaiting reply</option><option value="attending">Attending</option><option value="declined">Declined</option></select></label></div>
      <div className={styles.guestList}>{visible.map((guest) => <article key={guest.token} className={styles.guestCard}>
        <div className={styles.guestSummary}><div><h3>{guest.name}</h3><p>{guest.group || "Guest party"} · {guest.reply?.headCount ?? "No"} confirmed {guest.reply?.headCount === 1 ? "place" : "places"}</p></div><span className={styles.status} data-status={guest.status}>{guest.status === "pending" ? "Awaiting reply" : guest.status}</span></div>
        {guest.reply && <div className={styles.replyDetails}><p>{guest.reply.events.map((id) => details.events.find((e) => e.id === id)?.name ?? id).join(" · ")}</p>{guest.reply.dietary && <p>Dietary: {guest.reply.dietary}</p>}{guest.reply.message && <p>“{guest.reply.message}”</p>}{details.questions.map((q) => guest.reply?.answers[q.id] ? <p key={q.id}><strong>{q.label}</strong> {guest.reply.answers[q.id]}</p> : null)}</div>}
        <div className={styles.guestActions}><span>{guest.openedAt ? `Personal link opened ${guest.visits} ${guest.visits === 1 ? "time" : "times"}` : "Personal link not opened yet"}</span><button type="button" disabled={!invitation?.published} onClick={() => setSharing(sharing === guest.token ? "" : guest.token)}>Share personal link</button></div>
        <details><summary>Edit guest &amp; seating</summary><form className={styles.guestEdit} onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); void perform(async () => onSnapshot(await premiumRequest<PremiumSnapshot>("guests", "PATCH", { token: guest.token, name: data.get("name"), group: data.get("group"), notes: data.get("notes"), tableId: data.get("tableId") }))); }}><label>Guest name<input name="name" required maxLength={150} defaultValue={guest.name} /></label><label>Group<input name="group" maxLength={100} defaultValue={guest.group} placeholder="Family, friends…" /></label><label>Seating table<select name="tableId" defaultValue={guest.tableId}><option value="">Not assigned</option>{details.seatingTables.map((table) => <option key={table.id} value={table.id}>{table.name} · {table.capacity} seats</option>)}</select></label><label>Private planning notes<textarea name="notes" rows={2} maxLength={1000} defaultValue={guest.notes} /></label><div className={styles.actions}><button className={styles.primary} disabled={busy}>Save guest</button><button type="button" className={styles.danger} disabled={busy} onClick={() => { if (confirm(`Remove ${guest.name}, their reply and personal link?`)) void perform(async () => onSnapshot(await premiumRequest<PremiumSnapshot>("guests", "DELETE", { token: guest.token }))); }}>Remove guest</button></div></form></details>
        {sharing === guest.token && invitation?.published && <div className={styles.sharePanel}><ShareInvitation path={`${path}?guest=${guest.token}`} title={`A personal wedding invitation for ${guest.name}`} /></div>}
      </article>)}</div>{!visible.length && <p className={styles.empty}>Your lovely guest list starts here.</p>}
    </section>
    <section className={styles.panel}><div className={styles.panelHeading}><div><span>04 / READY TO SHARE</span><h2>Your celebration, one beautiful link away.</h2></div></div>{invitation?.published ? <div className={styles.sharePanel}><ShareInvitation path={path} title={`${details.brideName} & ${details.groomName} · Wedding invitation`} /></div> : <p className={styles.help}>Save and publish your invitation from the editor to create live sharing links.</p>}</section>
  </div>;
}
