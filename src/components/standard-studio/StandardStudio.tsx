"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, Heart, ImagePlus, Save, Send, Users } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import StandardInvitation from "@/components/invitation/StandardInvitation";

import { STANDARD_PLAN, STANDARD_SAMPLE, standardSample, STANDARD_LAYOUTS, STANDARD_FONTS, readStandardDetails, type StandardInvitationDetails, type StandardSnapshot } from "@/lib/standard-invitation";
import AppearanceEditor from "./AppearanceEditor";
import { standardRequest } from "@/lib/standard-studio-client";
import { prepareCouplePhoto } from "@/lib/couple-photo";
import { standardGuestListCsv } from "@/lib/standard-guest-export";
import ShareInvitation from "@/components/basic-studio/ShareInvitation";
import { STANDARD_PALETTES as STANDARD_DESIGNS } from "@/lib/standard-appearance";

const input = "mt-2 w-full rounded-xl border border-[#e1d8c9] bg-white px-4 py-3 text-sm outline-none focus:border-[#9c8054] focus:ring-2 focus:ring-[#9c8054]/15";
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#494b3d] px-5 py-3 text-xs font-semibold text-white disabled:opacity-40";
const secondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ddd2bf] bg-white px-5 py-3 text-xs disabled:opacity-40";
const panel = "rounded-2xl border border-[#e8e0d3] bg-white p-6 sm:p-7";


// Keep field labels and limits in one place so beginners can edit the form easily.
const fields: { key: "brideName" | "groomName" | "brideParents" | "groomParents" | "weddingDate" | "weddingTime" | "venueName" | "venueAddress" | "rsvpDeadline" | "whatsapp"; label: string; type?: string; required?: boolean; max?: number }[] = [
  { key: "brideName", label: "Bride's name", required: true },
  { key: "groomName", label: "Groom's name", required: true },
  { key: "brideParents", label: "Bride's family" },
  { key: "groomParents", label: "Groom's family" },
  { key: "weddingDate", label: "Wedding date", type: "date", required: true },
  { key: "weddingTime", label: "Wedding time · Sri Lanka", type: "time", required: true },
  { key: "venueName", label: "Venue name", required: true },
  { key: "venueAddress", label: "Venue address", max: 250 },
  { key: "rsvpDeadline", label: "RSVP deadline", type: "date" },
  { key: "whatsapp", label: "Couple's WhatsApp · e.g. 94771234567", type: "tel" },
];

export default function StandardStudio({ dashboard = false }: { dashboard?: boolean }) {
  const [details, setDetails] = useState<StandardInvitationDetails>({ ...STANDARD_SAMPLE });
  const [snapshot, setSnapshot] = useState<StandardSnapshot | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestFilter, setGuestFilter] = useState("");
  const [shareGuest, setShareGuest] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [envelopePreview, setEnvelopePreview] = useState(false);
  const invitation = snapshot?.invitation;
  const guests = snapshot?.guests ?? [];
  const publicPath = invitation ? `/celebrate/standard/${invitation.slug}` : "";
  const unsaved = !invitation || JSON.stringify(details) !== JSON.stringify(invitation.details);

  useEffect(() => {
    let cancelled = false;
    standardRequest<{ user: { email: string } | null }>("session")
      .then(async ({ user }) => {
        let restored: StandardInvitationDetails = { ...standardSample(!dashboard ? new URLSearchParams(window.location.search).get("layout") : undefined) };
        if (user) {
          const result = await standardRequest<StandardSnapshot>("studio");
          if (cancelled) return;
          setSnapshot(result);
          if (result.invitation) restored = result.invitation.details;
        }
        // Package links preselect a theme while preserving the couple's saved details.
        const selected = new URLSearchParams(window.location.search).get("design");
        const design = STANDARD_DESIGNS.find((item) => item.code === selected);
        if (design && !dashboard) restored = { ...restored, design: design.code, customColors: undefined };
        const params = new URLSearchParams(window.location.search);
        const layout = STANDARD_LAYOUTS.find((item) => item.code === params.get("layout"));
        const font = STANDARD_FONTS.find((item) => item.code === params.get("font"));
        if (layout && !dashboard) restored = { ...restored, standardLayout: layout.code };
        if (font && !dashboard) restored = { ...restored, font: font.code };
        if (!cancelled) setDetails(restored);
      })
      .catch((reason: Error) => { if (!cancelled) setError(reason.message); })
      .finally(() => { if (!cancelled) setReady(true); });
    return () => { cancelled = true; };
  }, [dashboard]);

  // All actions show their result in the same accessible message area.
  async function perform(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError(""); setNotice("");
    try { await action(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); }
    finally { setBusy(false); }
  }
  async function save() {
    const valid = readStandardDetails(details);
    if (!valid) throw new Error("Check the names, dates, photo and links. Music and Google Maps links must start with https://.");
    const result = await standardRequest<StandardSnapshot>("invitation", "PUT", { details: valid });
    setSnapshot(result); setDetails(valid);
    return result;
  }
  function update(key: keyof StandardInvitationDetails, value: string) {
    setDetails((current) => ({ ...current, [key]: value })); if (key === "animation") setPreviewKey((current) => current + 1);
  }

  function downloadGuests() {
    const url = URL.createObjectURL(new Blob([standardGuestListCsv(guests, details.events)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding-guest-list.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  return <div className="min-h-screen bg-[#f8f6f1] text-[#393b31]">
    <SiteHeader active="Packages" />
    <header className="border-b border-[#e8e0d3] bg-[#f0ede4] px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        <div><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.24em] text-[#947a4b]"><Heart size={13} />The Standard Collection</p><h1 className="mt-4 font-serif-luxury text-4xl sm:text-5xl">{dashboard ? "Every name. Every lovely reply." : "Your love story. Beautifully in motion."}</h1><p className="mt-4 max-w-xl text-sm leading-7 text-[#807969]">{dashboard ? "Your guest list, personal invitations and RSVP replies, thoughtfully together." : details.standardLayout === "moonlit" ? "Moonlit - a cinematic evening, a lunar envelope and a constellation of lovely details." : details.standardLayout === "solstice" ? "Solstice - a sunlit celebration, a folding wedding folio, and a new adventure together." : "The Vow — cinematic wedding stationery, a little envelope magic, and every detail your loved ones need."}</p></div>
        <Link className={secondary} href={dashboard ? "/standard-invitation" : "/standard-invitation/dashboard"}>{dashboard ? <Eye size={15} /> : <Users size={15} />}{dashboard ? "Edit invitation" : "Guest dashboard"}<ArrowRight size={14} /></Link>
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl flex-wrap gap-x-6 gap-y-3 text-[11px] text-[#807969]">{["Cinematic invitation", `${STANDARD_DESIGNS.length} colour themes`, "Envelope, slideshow & music", "500 guests", "Personal RSVP links", "No watermark"].map((feature) => <span key={feature} className="flex items-center gap-2"><Check size={12} />{feature}</span>)}</div>
    </header>
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8" aria-busy={busy}>
      {notice && <p role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">{notice}</p>}
      {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error}</p>}
      {!ready ? <p role="status" className="py-20 text-center">Opening your Standard Studio...</p> : <>
        {!snapshot && <section className={`${panel} mb-7`}>
          <h2 className="font-serif-luxury text-2xl">{authMode === "register" ? "Save your invitation with an account" : "Welcome back"}</h2>
          <p className="mt-2 text-xs leading-6 text-[#807969]">Explore the editor below. Sign in to save, publish and manage guests. Your existing Free or Basic Studio account works here too.</p>
          <form className="mt-5 grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={(event) => {
            event.preventDefault(); void perform(async () => {
              await standardRequest(`auth/${authMode}`, "POST", { email, password });
              const result = await standardRequest<StandardSnapshot>("studio");
              setSnapshot(result); if (result.invitation) setDetails(result.invitation.details);
              setPassword(""); setNotice("Signed in. Your invitation is ready to save.");
            });
          }}>
            <label className="text-xs">Email<input className={input} required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label className="text-xs">Password · at least 12 characters<input className={input} required type="password" minLength={12} maxLength={128} autoComplete={authMode === "register" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button className={button} disabled={busy}>{authMode === "register" ? "Create account" : "Sign in"}</button>
          </form>
          <button type="button" className="mt-4 text-xs underline" onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}>{authMode === "register" ? "Already have an account? Sign in" : "Create an account"}</button>
        </section>}
        {dashboard ? <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{[
            ["Guest places", `${guests.reduce((sum, guest) => sum + Math.max(1, guest.reply?.headCount ?? 1), 0)} / ${STANDARD_PLAN.guestLimit}`],
            ["Attending people", guests.reduce((sum, guest) => sum + (guest.status === "attending" ? guest.reply?.headCount ?? 1 : 0), 0)],
            ["Declined", guests.filter((guest) => guest.status === "declined").length],
            ["Awaiting reply", guests.filter((guest) => guest.status === "pending").length],
          ].map(([label, count]) => <div key={label} className={panel}><p className="text-[10px] uppercase tracking-widest text-[#807969]">{label}</p><p className="mt-3 font-serif-luxury text-4xl">{count}</p></div>)}</div>
          <section className={`${panel} mb-6`}><h2 className="font-serif-luxury text-3xl">Your invitation, ready to share.</h2><p className="mt-3 text-xs text-[#807969]">{invitation?.published ? "Published. Choose a sharing option below." : "Save and publish your invitation in the editor to start sharing."}</p>{invitation?.published && <ShareInvitation path={publicPath} title={`${invitation.details.brideName} & ${invitation.details.groomName} · Wedding invitation`} />}</section>
          <section className={`${panel} mb-6`}><h2 className="font-serif-luxury text-3xl">Every celebration, thoughtfully counted.</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{details.events.map((event) => <div key={event.id} className="rounded-xl bg-[#f8f6f1] p-4"><p className="text-xs">{event.name}</p><p className="mt-2 font-serif-luxury text-3xl">{guests.reduce((sum, guest) => sum + (guest.status === "attending" && guest.reply?.events.includes(event.id) ? guest.reply.headCount : 0), 0)} <span className="text-xs">attending</span></p></div>)}</div></section>
          <section className={panel}>
            <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-serif-luxury text-3xl">The people who make your day.</h2><p className="mt-2 text-xs leading-6 text-[#807969]">Party sizes count toward your 500 guest places. Personal invitations and general-link replies share this limit.</p></div><button type="button" className={secondary} disabled={busy || !snapshot} onClick={() => void perform(async () => { setSnapshot(await standardRequest<StandardSnapshot>("studio")); setNotice("Guest replies refreshed."); })}>Refresh replies</button></div>
            <form className="mt-6 flex flex-wrap items-end gap-3" onSubmit={(event) => {
              event.preventDefault(); void perform(async () => {
                setSnapshot(await standardRequest<StandardSnapshot>("guests", "POST", { name: guestName }));
                setGuestName(""); setNotice("Guest added. Share their personal link after publishing.");
              });
            }}><label className="min-w-48 flex-1 text-xs">Guest name<input className={input} required maxLength={150} value={guestName} onChange={(event) => setGuestName(event.target.value)} disabled={!invitation || busy || guests.reduce((sum, guest) => sum + Math.max(1, guest.reply?.headCount ?? 1), 0) >= 500} /></label><button className={button} disabled={!invitation || busy || guests.reduce((sum, guest) => sum + Math.max(1, guest.reply?.headCount ?? 1), 0) >= 500}>Add guest</button></form>
            <label className="mt-6 block text-xs">Find a guest<input className={input} type="search" placeholder="Search by name" value={guestFilter} onChange={(event) => setGuestFilter(event.target.value)} /></label>
            <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-xs"><caption className="sr-only">Guest list, attendance and invitation sharing</caption><thead><tr className="border-b border-[#e8e0d3] text-[#807969]"><th className="py-4 pr-4">Guest</th><th className="py-4 pr-4">Reply</th><th className="py-4 text-right">Actions</th></tr></thead><tbody>{guests.filter((guest) => guest.name.toLowerCase().includes(guestFilter.toLowerCase())).map((guest) => <tr key={guest.token} className="border-b border-[#f1ece3]">
              <td className="max-w-48 break-words py-5 pr-4">{guest.name}{guest.reply && <div className="mt-2 space-y-1 text-[10px] leading-5 text-[#807969]"><p>{guest.reply.headCount} attending · {guest.reply.events.map((id) => details.events.find((event) => event.id === id)?.name ?? id).join(", ")}</p>{guest.reply.dietary && <p>Dietary: {guest.reply.dietary}</p>}{guest.reply.message && <p>“{guest.reply.message}”</p>}</div>}</td><td className="py-5 pr-4"><span className={`inline-block rounded-full px-3 py-1.5 ${guest.status === "attending" ? "bg-green-50 text-green-800" : guest.status === "declined" ? "bg-rose-50 text-rose-800" : "bg-[#f5f0e6]"}`}>{guest.status === "pending" ? "Awaiting reply" : guest.status}</span></td>
              <td className="py-5 text-right"><div className="flex justify-end gap-4"><button type="button" className="underline disabled:opacity-30" disabled={!invitation?.published} onClick={() => setShareGuest(shareGuest === guest.token ? "" : guest.token)}>Share</button><button type="button" className="text-rose-800 disabled:opacity-30" disabled={busy} onClick={() => {
                if (!window.confirm(`Remove ${guest.name}, their reply and their personal invitation link?`)) return;
                void perform(async () => { setSnapshot(await standardRequest<StandardSnapshot>("guests", "DELETE", { token: guest.token })); if (shareGuest === guest.token) setShareGuest(""); setNotice("Guest removed."); });
              }}>Remove</button></div></td>
            </tr>)}</tbody></table>{!guests.length && <p className="py-10 text-center text-sm text-[#807969]">Save an invitation, then add your first guest.</p>}</div>
            {shareGuest && invitation?.published && guests.some((guest) => guest.token === shareGuest) && <ShareInvitation path={`${publicPath}?guest=${shareGuest}`} title={`A wedding invitation for ${guests.find((guest) => guest.token === shareGuest)?.name}`} />}
            <button type="button" className={`${secondary} mt-5`} disabled={!guests.length} onClick={downloadGuests}>Download guest CSV</button>
          </section>
        </> : <div className="grid items-start gap-7 lg:grid-cols-[1fr_1fr]">
          <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); void perform(async () => { await save(); setNotice("Draft saved. Publish when you are ready to share."); }); }}>
            <AppearanceEditor details={details} onChange={(patch) => { setDetails((current) => ({ ...current, ...patch })); if (patch.animation || patch.standardLayout) setPreviewKey((value) => value + 1); }} />
            <section className={panel}><p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">02 / The lovely details</p><h2 className="mt-3 font-serif-luxury text-3xl">Your story starts here.</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">{fields.map((field) => <label key={field.key} className="text-xs">{field.label}{field.required && " *"}<input className={input} type={field.type ?? "text"} required={field.required} maxLength={field.max ?? 150} value={details[field.key] ?? ""} onChange={(event) => update(field.key, event.target.value)} /></label>)}</div><label className="mt-5 block text-xs">Your wedding message<textarea className={input} rows={4} maxLength={600} value={details.greetingMessage} onChange={(event) => update("greetingMessage", event.target.value)} /></label></section>
            <section className={panel}><p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">03 / Make it personal</p><h2 className="mt-3 font-serif-luxury text-3xl">A photograph. A favourite song.</h2>
              <label className="mt-6 block rounded-xl border border-dashed border-[#d8cbb4] bg-[#faf8f3] p-5 text-xs"><span className="flex items-center gap-2"><ImagePlus size={18} />Upload your couple photo</span><input className="mt-4 block w-full text-xs" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => {
                const file = event.target.files?.[0]; if (!file) return;
                void perform(async () => { update("couplePhoto", await prepareCouplePhoto(file)); setNotice("Photo added to your preview. Save your draft to keep it."); });
                event.target.value = "";
              }} /><span className="mt-3 block text-[11px] leading-6 text-[#807969]">JPG, PNG or WebP · up to 10 MB. Resized before saving. Preview photos are samples. Your uploaded photo appears on the published invitation.</span></label>
              {details.couplePhoto && <button type="button" className="mt-3 text-xs underline" onClick={() => update("couplePhoto", "")}>Remove uploaded photo</button>}
              <label className="mt-6 block text-xs">Background music · direct HTTPS audio link<input className={input} type="url" maxLength={2000} placeholder="https://your-website.com/wedding-song.mp3" value={details.musicUrl} onChange={(event) => update("musicUrl", event.target.value)} /></label><p className="mt-2 text-[11px] leading-6 text-[#807969]">Use a publicly accessible MP3, WAV or OGG file you have permission to share. Guests tap Play music to listen. YouTube and Spotify page links do not play as audio files.</p>
              <label className="mt-6 block text-xs">Google Maps venue link · optional<input className={input} type="url" maxLength={2000} placeholder="https://maps.app.goo.gl/..." value={details.mapUrl} onChange={(event) => update("mapUrl", event.target.value)} /></label><p className="mt-2 text-[11px] leading-6 text-[#807969]">Leave blank to use your venue name and address for Google Maps directions.</p>
            </section>
            <section className={panel}>
              <p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">04 / A little magic</p><h2 className="mt-3 font-serif-luxury text-3xl">Bring every moment to life.</h2>
              <label className="mt-6 block text-xs">Envelope welcome message<input className={input} maxLength={200} value={details.welcomeMessage} onChange={(event) => update("welcomeMessage", event.target.value)} /></label>
              <label className="mt-5 block text-xs">Your custom invitation URL<input className={input} minLength={3} maxLength={64} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="amelia-and-oliver" value={details.customSlug} readOnly={Boolean(invitation?.published)} onChange={(event) => update("customSlug", event.target.value.toLowerCase())} /></label><p className="mt-2 break-all text-[10px] leading-6 text-[#807969]">/celebrate/standard/{details.customSlug || "your-personal-link"} · Lowercase letters, numbers and hyphens. Unpublish before changing a live URL.</p>
              <label className="mt-5 block text-xs">Couple slideshow · up to 6 extra photos<input className="mt-3 block w-full text-xs" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => { const files = Array.from(event.target.files ?? []); event.target.value = ""; if (!files.length) return; void perform(async () => { if (details.gallery.length + files.length > 6) throw new Error("Choose up to six slideshow photos in total."); const photos = await Promise.all(files.map(prepareCouplePhoto)); setDetails((current) => ({ ...current, gallery: [...current.gallery, ...photos] })); setNotice("Slideshow photos added. Save to keep your changes."); }); }} /></label>
              <div className="mt-4 grid grid-cols-3 gap-3">{details.gallery.map((photo, index) => <div key={index} className="relative">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={photo} alt={`Slideshow photo ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" /><button type="button" className="mt-2 text-[10px] underline" onClick={() => setDetails((current) => ({ ...current, gallery: current.gallery.filter((_, n) => n !== index) }))}>Remove photo {index + 1}</button></div>)}</div>
              <label className="mt-5 block text-xs">Invitation video · direct HTTPS MP4/WebM URL<input className={input} type="url" maxLength={2000} value={details.videoUrl} placeholder="https://your-website.com/our-film.mp4" onChange={(event) => update("videoUrl", event.target.value)} /></label>
              <label className="mt-5 block text-xs">Video background · optional direct HTTPS video URL<input className={input} type="url" maxLength={2000} value={details.backgroundVideoUrl} onChange={(event) => update("backgroundVideoUrl", event.target.value)} /></label><p className="mt-2 text-[11px] leading-6 text-[#807969]">Background videos play muted. Guests can pause them. The downloadable keepsake is a separate 12-second silent film made from your names, details and photos.</p>
            </section>
            <section className={panel}><p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">05 / The celebrations</p><h2 className="mt-3 font-serif-luxury text-3xl">One story. More lovely moments.</h2><p className="mt-3 text-xs leading-6 text-[#807969]">Add up to five events. Guests can choose the celebrations they will attend. The main wedding date above controls the countdown.</p><div className="mt-5 space-y-5">{details.events.map((item, index) => <div key={item.id} className="rounded-xl border border-[#e8e0d3] p-4"><div className="flex justify-between gap-3"><span className="text-xs">Event {index + 1}</span><button type="button" disabled={details.events.length === 1} className="text-[10px] text-rose-800 underline disabled:opacity-30" onClick={() => setDetails((current) => ({ ...current, events: current.events.filter((event) => event.id !== item.id) }))}>Remove event</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{([['name', 'Event name', 'text'], ['date', 'Date', 'date'], ['time', 'Time · Sri Lanka', 'time'], ['venue', 'Venue', 'text'], ['address', 'Address', 'text']] as const).map(([key, label, type]) => <label key={key} className="text-[11px]">{label}<input className={input} type={type} maxLength={250} required={key !== 'address'} value={item[key]} onChange={(change) => setDetails((current) => ({ ...current, events: current.events.map((event) => event.id === item.id ? { ...event, [key]: change.target.value } : event) }))} /></label>)}</div></div>)}</div><button type="button" disabled={details.events.length >= 5} className={`${secondary} mt-4`} onClick={() => setDetails((current) => ({ ...current, events: [...current.events, { id: `event-${crypto.randomUUID().slice(0, 8)}`, name: "Reception", date: current.weddingDate, time: "18:00", venue: current.venueName, address: current.venueAddress }] }))}>Add a celebration +</button></section>
            <section className={panel}><p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">06 / Ready for your loved ones</p><h2 className="mt-3 font-serif-luxury text-3xl">Send a little piece of forever.</h2><p className="mt-3 text-xs leading-7 text-[#807969]">{invitation?.published ? invitation.hasChanges || unsaved ? "Your invitation is live. Publish again to share your latest changes." : "Your invitation is live and ready to share." : "Save your draft, check the preview, then publish your invitation. Anyone with its link can view it. Guest lists stay private."}</p>
              {!snapshot && <p className="mt-3 text-xs text-[#947a4b]">Sign in above to save and publish.</p>}
              <div className="mt-5 flex flex-wrap gap-3"><button className={secondary} disabled={busy || !snapshot}><Save size={14} />{unsaved ? "Save draft" : "Draft saved"}</button><button type="button" className={button} disabled={busy || !snapshot} onClick={() => void perform(async () => {
                const saved = await save();
                setSnapshot(await standardRequest<StandardSnapshot>("publish", "POST", { version: saved.invitation!.version }));
                setNotice("Published. Your live link and QR code are ready to share.");
              })}><Send size={14} />{busy ? "Working..." : invitation?.published ? "Publish changes" : "Publish invitation"}</button></div>
              {invitation?.published && <><Link href={publicPath} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs underline"><Eye size={14} />Open live invitation</Link><ShareInvitation path={publicPath} title={`${invitation.details.brideName} & ${invitation.details.groomName} · Wedding invitation`} /><button type="button" className="mt-5 text-xs text-rose-800 underline" disabled={busy} onClick={() => void perform(async () => { setSnapshot(await standardRequest<StandardSnapshot>("unpublish", "POST", { version: invitation.version })); setNotice("Unpublished. Your draft and guest list are saved."); })}>Unpublish invitation</button></>}
            </section>
          </form>
          <section className="min-w-0 lg:sticky lg:top-24" aria-label="Live invitation preview"><div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[.16em] text-[#807969]"><span className="flex items-center gap-2"><Eye size={13} />Your invitation preview</span><button type="button" className="underline" onClick={() => { setEnvelopePreview(!envelopePreview); setPreviewKey((value) => value + 1); }}>{envelopePreview ? "Show invitation" : "Try envelope opening"}</button></div><div className="max-h-[850px] overflow-y-auto rounded-2xl border border-[#e1d8c9] shadow-[0_15px_60px_#4033230c]"><StandardInvitation key={previewKey} details={details} preview={!envelopePreview} demo /></div><p className="mt-3 text-center text-[11px] text-[#807969]">Scroll to explore · Your guests will see this design.</p></section>
        </div>}
      </>}
    </main>
    <footer className="mt-8 border-t border-[#e8e0d3] p-7 text-center text-[10px] uppercase tracking-[.2em] text-[#947a4b]">Thoughtfully made for your forever.</footer>
  </div>;
}


