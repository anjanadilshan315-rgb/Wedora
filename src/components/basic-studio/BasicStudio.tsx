"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, Heart, ImagePlus, Save, Send, Users } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import BasicInvitation from "@/components/invitation/BasicInvitation";
import type { InvitationInteractions } from "@/components/invitation/types";
import { BASIC_DESIGNS, BASIC_TEMPLATES, BASIC_PLAN, BASIC_SAMPLE, readBasicDetails, type BasicInvitationDetails, type BasicSnapshot } from "@/lib/basic-invitation";
import { basicRequest } from "@/lib/basic-studio-client";
import { prepareCouplePhoto } from "@/lib/couple-photo";
import { guestListCsv } from "@/lib/guest-export";
import ShareInvitation from "./ShareInvitation";
import BasicTemplatePicker from "./BasicTemplatePicker";

const input = "mt-2 w-full rounded-xl border border-[#e1d8c9] bg-white px-4 py-3 text-sm outline-none focus:border-[#9c8054] focus:ring-2 focus:ring-[#9c8054]/15";
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#494b3d] px-5 py-3 text-xs font-semibold text-white disabled:opacity-40";
const secondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ddd2bf] bg-white px-5 py-3 text-xs disabled:opacity-40";
const panel = "rounded-2xl border border-[#e8e0d3] bg-white p-6 sm:p-7";
const preview: InvitationInteractions = { mode: "preview", wishes: [], guestIdentified: false, rsvp: null, submitWish: async () => {}, submitRsvp: async () => {} };

// Keep field labels and limits in one place so beginners can edit the form easily.
const fields: { key: keyof BasicInvitationDetails; label: string; type?: string; required?: boolean; max?: number }[] = [
  { key: "brideName", label: "Bride’s name", required: true },
  { key: "groomName", label: "Groom’s name", required: true },
  { key: "brideParents", label: "Bride’s family" },
  { key: "groomParents", label: "Groom’s family" },
  { key: "weddingDate", label: "Wedding date", type: "date", required: true },
  { key: "weddingTime", label: "Wedding time · Sri Lanka", type: "time", required: true },
  { key: "venueName", label: "Venue name", required: true },
  { key: "venueAddress", label: "Venue address", max: 250 },
  { key: "rsvpDeadline", label: "RSVP deadline", type: "date" },
  { key: "whatsapp", label: "Couple’s WhatsApp · e.g. 94771234567", type: "tel" },
];

export default function BasicStudio({ dashboard = false }: { dashboard?: boolean }) {
  const [details, setDetails] = useState<BasicInvitationDetails>({ ...BASIC_SAMPLE });
  const [snapshot, setSnapshot] = useState<BasicSnapshot | null>(null);
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
  const invitation = snapshot?.invitation;
  const guests = snapshot?.guests ?? [];
  const publicPath = invitation ? `/celebrate/basic/${invitation.slug}` : "";
  const unsaved = !invitation || JSON.stringify(details) !== JSON.stringify(invitation.details);

  useEffect(() => {
    let cancelled = false;
    basicRequest<{ user: { email: string } | null }>("session")
      .then(async ({ user }) => {
        let restored: BasicInvitationDetails = { ...BASIC_SAMPLE };
        if (user) {
          const result = await basicRequest<BasicSnapshot>("studio");
          if (cancelled) return;
          setSnapshot(result);
          if (result.invitation) restored = result.invitation.details;
        }
        // Package links preselect a theme while preserving the couple's saved details.
        const selected = new URLSearchParams(window.location.search).get("design");
        const design = BASIC_DESIGNS.find((item) => item.code === selected);
        if (design && !dashboard) restored = { ...restored, design: design.code };
        const selectedTemplate = new URLSearchParams(window.location.search).get("template");
        const template = BASIC_TEMPLATES.find((item) => item.code === selectedTemplate);
        if (template && !dashboard) restored = { ...restored, layout: template.code };
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
    const valid = readBasicDetails(details);
    if (!valid) throw new Error("Check the names, dates, photo and links. Music and Google Maps links must start with https://.");
    const result = await basicRequest<BasicSnapshot>("invitation", "PUT", { details: valid });
    setSnapshot(result); setDetails(valid);
    return result;
  }
  function update(key: keyof BasicInvitationDetails, value: string) {
    setDetails((current) => ({ ...current, [key]: value }));
  }

  function downloadGuests() {
    const url = URL.createObjectURL(new Blob([guestListCsv(guests)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding-guest-list.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className="min-h-screen bg-[#f8f6f1] text-[#393b31]">
    <SiteHeader active="Packages" />
    <header className="border-b border-[#e8e0d3] bg-[#f0ede4] px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
        <div><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.24em] text-[#947a4b]"><Heart size={13} />The Basic Collection</p><h1 className="mt-4 font-serif-luxury text-4xl sm:text-5xl">{dashboard ? "Every name. Every lovely reply." : "A little more you. A little more forever."}</h1><p className="mt-4 max-w-xl text-sm leading-7 text-[#807969]">{dashboard ? "Your guest list, personal invitations and RSVP replies, thoughtfully together." : "Beautiful stationery, your favourite photograph and all the details that bring your people together."}</p></div>
        <Link className={secondary} href={dashboard ? "/basic-invitation" : "/basic-invitation/dashboard"}>{dashboard ? <Eye size={15} /> : <Users size={15} />}{dashboard ? "Edit invitation" : "Guest dashboard"}<ArrowRight size={14} /></Link>
      </div>
      <div className="mx-auto mt-6 flex max-w-7xl flex-wrap gap-x-6 gap-y-3 text-[11px] text-[#807969]">{[`${BASIC_TEMPLATES.length} invitation templates`, `${BASIC_DESIGNS.length} colour themes`, "Your photo & music", "100 guests", "Personal RSVP links", "No watermark"].map((feature) => <span key={feature} className="flex items-center gap-2"><Check size={12} />{feature}</span>)}</div>
    </header>
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8" aria-busy={busy}>
      {notice && <p role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">{notice}</p>}
      {error && <p role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error}</p>}
      {!ready ? <p role="status" className="py-20 text-center">Opening your Basic Studio…</p> : <>
        {!snapshot && <section className={`${panel} mb-7`}>
          <h2 className="font-serif-luxury text-2xl">{authMode === "register" ? "Save your invitation with an account" : "Welcome back"}</h2>
          <p className="mt-2 text-xs leading-6 text-[#807969]">Explore the editor below. Sign in to save, publish and manage guests. Your existing Free Studio account works here too.</p>
          <form className="mt-5 grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={(event) => {
            event.preventDefault(); void perform(async () => {
              await basicRequest(`auth/${authMode}`, "POST", { email, password });
              const result = await basicRequest<BasicSnapshot>("studio");
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
            ["Guest places", `${guests.length} / ${BASIC_PLAN.guestLimit}`],
            ["Attending", guests.filter((guest) => guest.status === "attending").length],
            ["Declined", guests.filter((guest) => guest.status === "declined").length],
            ["Awaiting reply", guests.filter((guest) => guest.status === "pending").length],
          ].map(([label, count]) => <div key={label} className={panel}><p className="text-[10px] uppercase tracking-widest text-[#807969]">{label}</p><p className="mt-3 font-serif-luxury text-4xl">{count}</p></div>)}</div>
          <section className={`${panel} mb-6`}><h2 className="font-serif-luxury text-3xl">Your invitation, ready to share.</h2><p className="mt-3 text-xs text-[#807969]">{invitation?.published ? "Published. Choose a sharing option below." : "Save and publish your invitation in the editor to start sharing."}</p>{invitation?.published && <ShareInvitation path={publicPath} title={`${invitation.details.brideName} & ${invitation.details.groomName} · Wedding invitation`} />}</section>
          <section className={panel}>
            <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-serif-luxury text-3xl">The people who make your day.</h2><p className="mt-2 text-xs leading-6 text-[#807969]">Each name uses one of your 100 guest places. Personal links and general-link replies share this limit.</p></div><button type="button" className={secondary} disabled={busy || !snapshot} onClick={() => void perform(async () => { setSnapshot(await basicRequest<BasicSnapshot>("studio")); setNotice("Guest replies refreshed."); })}>Refresh replies</button></div>
            <form className="mt-6 flex flex-wrap items-end gap-3" onSubmit={(event) => {
              event.preventDefault(); void perform(async () => {
                setSnapshot(await basicRequest<BasicSnapshot>("guests", "POST", { name: guestName }));
                setGuestName(""); setNotice("Guest added. Share their personal link after publishing.");
              });
            }}><label className="min-w-48 flex-1 text-xs">Guest name<input className={input} required maxLength={150} value={guestName} onChange={(event) => setGuestName(event.target.value)} disabled={!invitation || busy || guests.length >= 100} /></label><button className={button} disabled={!invitation || busy || guests.length >= 100}>Add guest</button></form>
            <label className="mt-6 block text-xs">Find a guest<input className={input} type="search" placeholder="Search by name" value={guestFilter} onChange={(event) => setGuestFilter(event.target.value)} /></label>
            <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-xs"><caption className="sr-only">Guest list, attendance and invitation sharing</caption><thead><tr className="border-b border-[#e8e0d3] text-[#807969]"><th className="py-4 pr-4">Guest</th><th className="py-4 pr-4">Reply</th><th className="py-4 text-right">Actions</th></tr></thead><tbody>{guests.filter((guest) => guest.name.toLowerCase().includes(guestFilter.toLowerCase())).map((guest) => <tr key={guest.token} className="border-b border-[#f1ece3]">
              <td className="max-w-48 break-words py-5 pr-4">{guest.name}</td><td className="py-5 pr-4"><span className={`inline-block rounded-full px-3 py-1.5 ${guest.status === "attending" ? "bg-green-50 text-green-800" : guest.status === "declined" ? "bg-rose-50 text-rose-800" : "bg-[#f5f0e6]"}`}>{guest.status === "pending" ? "Awaiting reply" : guest.status}</span></td>
              <td className="py-5 text-right"><div className="flex justify-end gap-4"><button type="button" className="underline disabled:opacity-30" disabled={!invitation?.published} onClick={() => setShareGuest(shareGuest === guest.token ? "" : guest.token)}>Share</button><button type="button" className="text-rose-800 disabled:opacity-30" disabled={busy} onClick={() => {
                if (!window.confirm(`Remove ${guest.name}, their reply and their personal invitation link?`)) return;
                void perform(async () => { setSnapshot(await basicRequest<BasicSnapshot>("guests", "DELETE", { token: guest.token })); if (shareGuest === guest.token) setShareGuest(""); setNotice("Guest removed."); });
              }}>Remove</button></div></td>
            </tr>)}</tbody></table>{!guests.length && <p className="py-10 text-center text-sm text-[#807969]">Save an invitation, then add your first guest.</p>}</div>
            {shareGuest && invitation?.published && guests.some((guest) => guest.token === shareGuest) && <ShareInvitation path={`${publicPath}?guest=${shareGuest}`} title={`A wedding invitation for ${guests.find((guest) => guest.token === shareGuest)?.name}`} />}
            <button type="button" className={`${secondary} mt-5`} disabled={!guests.length} onClick={downloadGuests}>Download guest CSV</button>
          </section>
        </> : <div className="grid items-start gap-7 lg:grid-cols-[1fr_1fr]">
          <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); void perform(async () => { await save(); setNotice("Draft saved. Publish when you are ready to share."); }); }}>
            <section className={panel}>
              <p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">Your invitation template</p>
              <h2 className="mt-3 font-serif-luxury text-3xl">Find a beautiful way to tell your story.</h2>
              <p className="mt-3 text-xs leading-6 text-[#807969]">Choose a layout, then make it yours. Your details, photo and guest list stay together when you switch.</p>
              <BasicTemplatePicker selected={details.layout ?? "arch"} onSelect={(layout) => update("layout", layout)} />
            </section>
            <section className={panel}><p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">01 / Your stationery</p><h2 className="mt-3 font-serif-luxury text-3xl">Find your kind of beautiful.</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{BASIC_DESIGNS.map((design) => <button type="button" key={design.code} aria-pressed={details.design === design.code} onClick={() => update("design", design.code)} className={`overflow-hidden rounded-xl border text-left ${details.design === design.code ? "border-[#947a4b] ring-1 ring-[#947a4b]" : "border-[#e8e0d3]"}`}><div style={{ background: design.background, color: design.colour }} className="flex h-28 flex-col items-center justify-center"><Heart size={15} strokeWidth={1} /><span className="mt-2 font-serif-luxury text-3xl italic">A &amp; B</span></div><p className="p-3 text-[11px] leading-5">{design.name}{details.design === design.code && <Check className="mt-1" size={13} />}</p></button>)}</div></section>
            <section className={panel}><p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">02 / The lovely details</p><h2 className="mt-3 font-serif-luxury text-3xl">Your story starts here.</h2><div className="mt-6 grid gap-5 sm:grid-cols-2">{fields.map((field) => <label key={field.key} className="text-xs">{field.label}{field.required && " *"}<input className={input} type={field.type ?? "text"} required={field.required} maxLength={field.max ?? 150} value={details[field.key] ?? ""} onChange={(event) => update(field.key, event.target.value)} /></label>)}</div><label className="mt-5 block text-xs">Your wedding message<textarea className={input} rows={4} maxLength={600} value={details.greetingMessage} onChange={(event) => update("greetingMessage", event.target.value)} /></label></section>
            <section className={panel}><p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">03 / Make it personal</p><h2 className="mt-3 font-serif-luxury text-3xl">A photograph. A favourite song.</h2>
              <label className="mt-6 block rounded-xl border border-dashed border-[#d8cbb4] bg-[#faf8f3] p-5 text-xs"><span className="flex items-center gap-2"><ImagePlus size={18} />Upload your couple photo</span><input className="mt-4 block w-full text-xs" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => {
                const file = event.target.files?.[0]; if (!file) return;
                void perform(async () => { update("couplePhoto", await prepareCouplePhoto(file)); setNotice("Photo added to your preview. Save your draft to keep it."); });
                event.target.value = "";
              }} /><span className="mt-3 block text-[11px] leading-6 text-[#807969]">JPG, PNG or WebP · up to 10 MB. Resized before saving. A heart placeholder appears until you upload yours.</span></label>
              {details.couplePhoto && <button type="button" className="mt-3 text-xs underline" onClick={() => update("couplePhoto", "")}>Remove uploaded photo</button>}
              <label className="mt-6 block text-xs">Background music · direct HTTPS audio link<input className={input} type="url" maxLength={2000} placeholder="https://your-website.com/wedding-song.mp3" value={details.musicUrl} onChange={(event) => update("musicUrl", event.target.value)} /></label><p className="mt-2 text-[11px] leading-6 text-[#807969]">Use a publicly accessible MP3, WAV or OGG file you have permission to share. Guests tap Play music to listen. YouTube and Spotify page links do not play as audio files.</p>
              <label className="mt-6 block text-xs">Google Maps venue link · optional<input className={input} type="url" maxLength={2000} placeholder="https://maps.app.goo.gl/…" value={details.mapUrl} onChange={(event) => update("mapUrl", event.target.value)} /></label><p className="mt-2 text-[11px] leading-6 text-[#807969]">Leave blank to use your venue name and address for Google Maps directions.</p>
            </section>
            <section className={panel}><p className="text-[10px] uppercase tracking-[.2em] text-[#947a4b]">04 / Ready for your loved ones</p><h2 className="mt-3 font-serif-luxury text-3xl">Send a little piece of forever.</h2><p className="mt-3 text-xs leading-7 text-[#807969]">{invitation?.published ? invitation.hasChanges || unsaved ? "Your invitation is live. Publish again to share your latest changes." : "Your invitation is live and ready to share." : "Save your draft, check the preview, then publish your invitation. Anyone with its link can view it. Guest lists stay private."}</p>
              {!snapshot && <p className="mt-3 text-xs text-[#947a4b]">Sign in above to save and publish.</p>}
              <div className="mt-5 flex flex-wrap gap-3"><button className={secondary} disabled={busy || !snapshot}><Save size={14} />{unsaved ? "Save draft" : "Draft saved"}</button><button type="button" className={button} disabled={busy || !snapshot} onClick={() => void perform(async () => {
                const saved = await save();
                setSnapshot(await basicRequest<BasicSnapshot>("publish", "POST", { version: saved.invitation!.version }));
                setNotice("Published. Your live link and QR code are ready to share.");
              })}><Send size={14} />{busy ? "Working…" : invitation?.published ? "Publish changes" : "Publish invitation"}</button></div>
              {invitation?.published && <><Link href={publicPath} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs underline"><Eye size={14} />Open live invitation</Link><ShareInvitation path={publicPath} title={`${invitation.details.brideName} & ${invitation.details.groomName} · Wedding invitation`} /><button type="button" className="mt-5 text-xs text-rose-800 underline" disabled={busy} onClick={() => void perform(async () => { setSnapshot(await basicRequest<BasicSnapshot>("unpublish", "POST", { version: invitation.version })); setNotice("Unpublished. Your draft and guest list are saved."); })}>Unpublish invitation</button></>}
            </section>
          </form>
          <section className="min-w-0 lg:sticky lg:top-24" aria-label="Live invitation preview"><div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[.16em] text-[#807969]"><span className="flex items-center gap-2"><Eye size={13} />Your invitation preview</span><span>Basic · No watermark</span></div><div className="max-h-[850px] overflow-y-auto rounded-2xl border border-[#e1d8c9] shadow-[0_15px_60px_#4033230c]"><BasicInvitation details={details} actions={preview} /></div><p className="mt-3 text-center text-[11px] text-[#807969]">Scroll to explore · Your guests will see this design.</p></section>
        </div>}
      </>}
    </main>
    <footer className="mt-8 border-t border-[#e8e0d3] p-7 text-center text-[10px] uppercase tracking-[.2em] text-[#947a4b]">Thoughtfully made for your forever.</footer>
  </div>;
}
