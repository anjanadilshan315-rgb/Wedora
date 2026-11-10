"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, Copy, Eye, Flower2, Heart, Loader2, LockKeyhole, Save, Send, Users } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import FreeInvitationTemplate from "@/components/invitation/FreeInvitationTemplate";
import type { InvitationInteractions } from "@/components/invitation/types";
import { FREE_SAMPLE, FREE_THEMES, readFreeDetails, type FreeInvitationDetails } from "@/lib/free-invitation";
import { FREE_PLAN, FREE_TEMPLATES, isFreeTemplate } from "@/lib/template-catalog";
import { studioRequest } from "@/lib/free-studio-client";
import type { StudioSnapshot } from "@/lib/free-studio-types";

const inputClass = "mt-2 w-full rounded-xl border border-[#E5DCD1] bg-white px-4 py-3 text-sm text-[#302821] outline-none focus:border-[#A7854D] focus:ring-2 focus:ring-[#A7854D]/15";
const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#514234] px-6 py-3 text-xs font-semibold text-white hover:bg-[#342A21] disabled:cursor-not-allowed disabled:opacity-40";
const secondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#D7C7B3] bg-white px-5 py-3 text-xs font-semibold text-[#715537] hover:bg-[#F7F2EA] disabled:opacity-40";
const panel = "rounded-3xl border border-[#E8E0D5] bg-white p-6 sm:p-8";
const steps = ["Choose design", "Add details", "Preview", "Publish"];
const previewActions: InvitationInteractions = { mode: "preview", wishes: [], guestIdentified: false, rsvp: null, submitWish: async () => undefined, submitRsvp: async () => undefined };
const fields: { key: Exclude<keyof FreeInvitationDetails, "theme" | "templateCode" | "greetingMessage">; label: string; type?: string; required?: boolean; limit?: number }[] = [
  { key: "brideName", label: "Bride's name", required: true }, { key: "groomName", label: "Groom's name", required: true },
  { key: "brideParents", label: "Bride's family" }, { key: "groomParents", label: "Groom's family" },
  { key: "weddingDate", label: "Wedding date", type: "date", required: true }, { key: "weddingTime", label: "Wedding time", type: "time", required: true },
  { key: "venueName", label: "Venue name", required: true }, { key: "venueAddress", label: "Venue address", limit: 250 },
  { key: "rsvpDeadline", label: "Reply by", type: "date" }, { key: "whatsapp", label: "WhatsApp number (optional)", type: "tel" },
];

export default function FreeStudio({ dashboard = false }: { dashboard?: boolean }) {
  const [details, setDetails] = useState<FreeInvitationDetails>({ ...FREE_SAMPLE });
  const [state, setState] = useState<StudioSnapshot | null>(null);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestName, setGuestName] = useState("");
  const design = FREE_TEMPLATES.find((template) => template.code === (details.templateCode ?? "tpl_free_arch"))!;
  const invitation = state?.invitation;
  const guests = state?.guests ?? [];
  const unsaved = !invitation || JSON.stringify(invitation.details) !== JSON.stringify(details);
  const publicPath = invitation ? `/celebrate/${invitation.slug}` : "";

  useEffect(() => {
    if (showAuth) document.getElementById("studio-account")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showAuth]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const session = await studioRequest<{ user: { email: string } | null }>("session");
        let restored: FreeInvitationDetails = { ...FREE_SAMPLE };
        if (session.user) {
          const saved = await studioRequest<StudioSnapshot>("studio");
          if (cancelled) return;
          setState(saved);
          if (saved.invitation) restored = saved.invitation.details;
        }
        const selected = new URLSearchParams(window.location.search).get("template");
        if (isFreeTemplate(selected)) { restored = { ...restored, templateCode: selected }; setStep(1); }
        if (!cancelled) setDetails(restored);
      } catch (reason) { if (!cancelled) setError(reason instanceof Error ? reason.message : "Could not open Free Studio."); }
      finally { if (!cancelled) setReady(true); }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  // One helper gives every request the same loading, success and error behaviour.
  async function perform(label: string, action: () => Promise<void>) {
    if (busy) return;
    setBusy(label); setNotice(""); setError("");
    try { await action(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Please try again."); }
    finally { setBusy(""); }
  }
  function needsAccount() {
    if (state) return false;
    setShowAuth(true); setNotice("Create a free account or sign in to save your work across devices.");
    return true;
  }
  async function save() {
    const valid = readFreeDetails(details);
    if (!valid) throw new Error("Check your names, dates and WhatsApp number before saving.");
    const saved = await studioRequest<StudioSnapshot>("invitation", "PUT", { details: valid });
    setState(saved); setDetails(valid);
    return saved;
  }
  function saveDraft() {
    if (!needsAccount()) void perform("save", async () => { await save(); setNotice("Draft saved to your account. Your published invitation has not changed."); });
  }
  async function copy(path: string, message = "Invitation link copied.") {
    try { await navigator.clipboard.writeText(new URL(path, window.location.origin).href); setNotice(message); }
    catch { setNotice("Open the invitation and copy its address from your browser."); }
  }
  function importBrowserDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem("forever.free-invitation.draft.v1") || "null");
      const valid = readFreeDetails(saved?.details);
      if (!valid) throw new Error();
      setDetails(valid); setNotice("Browser draft imported. Save it to your account to keep it.");
    } catch { setError("No earlier browser draft was found on this device."); }
  }

  return <div className="min-h-screen bg-[#F8F6F1] text-[#302821]">
    <SiteHeader active="Packages" />
    <header className="border-b border-[#E8E0D5] bg-white"><div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs"><Link href="/packages" className="text-[#8F785C] hover:underline">← All packages</Link><div className="flex flex-wrap items-center gap-3">{state ? <><span className="max-w-60 truncate text-[#8A7C6C]">{state.user.email}</span><button type="button" disabled={Boolean(busy)} onClick={() => void perform("logout", async () => { await studioRequest("auth/logout", "POST", {}); setState(null); setDetails({ ...FREE_SAMPLE }); setPassword(""); setNotice("You have signed out."); })} className="text-[#715537]">Sign out</button></> : <button type="button" onClick={() => { setAuthMode("login"); setShowAuth(true); }} className="font-semibold text-[#715537]">Free Studio sign in</button>}</div></div>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-6"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.25em] text-[#9B8058]">Forever / Free Studio</p><h1 className="font-serif-luxury text-4xl sm:text-5xl">{dashboard ? "Your celebration, at a glance." : "Let’s make something beautiful."}</h1><p className="mt-3 max-w-xl text-sm leading-7 text-[#8A7C6C]">{dashboard ? "Your invitation, personal guest links and every reply, together in one place." : "Choose your design. Make it yours. Share a little piece of your forever."}</p></div><Link href={dashboard ? "/free-invitation" : "/free-invitation/dashboard"} className={secondary}><Users size={15} />{dashboard ? "Edit invitation" : "Guest dashboard"}<ArrowRight size={14} /></Link></div>
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[#8A7C6C]">{[`${FREE_TEMPLATES.length} free designs`, `${FREE_PLAN.guestLimit} guests`, "Central RSVP inbox", "Forever watermark", "No payment needed"].map((text) => <span key={text} className="flex items-center gap-1.5"><Check size={12} className="text-[#9B8058]" />{text}</span>)}</div>
    </div></header>
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      {notice && <p role="status" className="mb-5 rounded-2xl border border-[#D9E4D9] bg-[#F0F7EF] px-5 py-4 text-sm leading-6 text-[#3D6040]">{notice}</p>}
      {error && <p role="alert" className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-800">{error}</p>}
      {!ready ? <p role="status" className="py-20 text-center text-sm">Opening your studio…</p> : <>
        {showAuth && <section id="studio-account" aria-label="Free Studio account" className={`${panel} mb-8 scroll-mt-24`}>
          <div className="flex items-start justify-between gap-5"><div><p className="text-[10px] uppercase tracking-[.2em] text-[#9B8058]">Keep your forever safe</p><h2 className="mt-2 font-serif-luxury text-3xl">{authMode === "register" ? "Your free invitation account" : "Welcome back to Free Studio"}</h2><p className="mt-2 max-w-xl text-xs leading-6 text-[#8A7C6C]">Free Studio has its own sign-in for your free invitation. Your draft, guest list and replies will be saved to this account.</p></div><button type="button" onClick={() => { setShowAuth(false); setPassword(""); }} aria-label="Close account form" className="p-2 text-xl">×</button></div>
          <form onSubmit={(event) => { event.preventDefault(); void perform("auth", async () => { await studioRequest(`auth/${authMode}`, "POST", { email, password }); const saved = await studioRequest<StudioSnapshot>("studio"); setState(saved); if (saved.invitation) setDetails(saved.invitation.details); setPassword(""); setShowAuth(false); setNotice("Signed in. You can now save and publish your invitation."); }); }} className="mt-5 grid items-end gap-4 md:grid-cols-[1fr_1fr_auto]">
            <label className="text-xs">Email address<input className={inputClass} type="email" required autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="text-xs">Password (at least 12 characters)<input className={inputClass} type="password" required minLength={12} maxLength={128} autoComplete={authMode === "register" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className={primary} disabled={Boolean(busy)}>{busy === "auth" ? <Loader2 size={15} className="animate-spin" /> : <LockKeyhole size={15} />}{authMode === "register" ? "Create free account" : "Sign in"}</button>
          </form><button type="button" className="mt-4 text-xs text-[#8A6A43] underline" onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}>{authMode === "register" ? "Already have a Free Studio account? Sign in" : "New here? Create your free account"}</button>
        </section>}
        {dashboard ? <>
          {!state ? <section className={`${panel} py-16 text-center`}><Users className="mx-auto text-[#A78D67]" size={32} strokeWidth={1} /><h2 className="mt-5 font-serif-luxury text-3xl">A home for your guest list.</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#8A7C6C]">Sign in to see your invitation and the replies your guests send.</p><button type="button" onClick={() => setShowAuth(true)} className={`${primary} mt-6`}>Open my Free Studio</button></section> : <>
            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">{[{ label: "Guest places", value: `${guests.length} / ${FREE_PLAN.guestLimit}` }, { label: "Attending", value: guests.filter((guest) => guest.status === "attending").length }, { label: "Declined", value: guests.filter((guest) => guest.status === "declined").length }, { label: "Awaiting reply", value: guests.filter((guest) => guest.status === "pending").length }].map((stat) => <div key={stat.label} className="rounded-2xl border border-[#E8E0D5] bg-white p-5"><p className="text-[10px] uppercase tracking-widest text-[#8A7C6C]">{stat.label}</p><p className="mt-3 font-serif-luxury text-4xl">{stat.value}</p></div>)}</div>
            <section className={`${panel} mb-6`}><div className="flex flex-wrap items-center justify-between gap-5"><div><p className="text-[10px] uppercase tracking-widest text-[#9B8058]">Your invitation</p><h2 className="mt-2 font-serif-luxury text-3xl">{invitation ? `${invitation.details.brideName} & ${invitation.details.groomName}` : "Your forever starts here"}</h2><p className="mt-2 text-xs text-[#8A7C6C]">{invitation ? invitation.published ? invitation.hasChanges ? "Published · saved changes waiting to be published" : "Published · your guests can open the invitation" : "Draft · visible only to you" : "Choose a design and save your first draft."}</p></div><Link href="/free-invitation" className={primary}>{invitation ? "Edit invitation" : "Create invitation"}<ArrowRight size={14} /></Link></div>{invitation?.published && <div className="mt-5 flex flex-wrap gap-3"><Link href={publicPath} target="_blank" rel="noopener noreferrer" className={secondary}><Eye size={14} />View live</Link><button type="button" className={secondary} onClick={() => void copy(publicPath)}><Copy size={14} />Copy invitation link</button></div>}</section>
            <section className={panel}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif-luxury text-3xl">Your guest list &amp; replies</h2><p className="mt-2 text-xs leading-6 text-[#8A7C6C]">Personal links and replies to the general link share your {FREE_PLAN.guestLimit} guest places.</p></div><button type="button" disabled={Boolean(busy)} className={secondary} onClick={() => void perform("refresh", async () => { setState(await studioRequest<StudioSnapshot>("studio")); setNotice("Guest replies refreshed."); })}>Refresh replies</button></div>
              <form className="mt-6 flex flex-wrap items-end gap-3" onSubmit={(event) => { event.preventDefault(); void perform("guest", async () => { setState(await studioRequest<StudioSnapshot>("guests", "POST", { name: guestName })); setGuestName(""); setNotice("Guest added. Their personal link is ready when your invitation is published."); }); }}><label className="min-w-48 flex-1 text-xs">Guest name<input className={inputClass} maxLength={150} required value={guestName} onChange={(event) => setGuestName(event.target.value)} disabled={!invitation || guests.length >= FREE_PLAN.guestLimit} /></label><button className={primary} disabled={!invitation || Boolean(busy) || guests.length >= FREE_PLAN.guestLimit}>Add guest</button></form>{!invitation && <p className="mt-3 text-xs text-[#8A7C6C]">Save an invitation draft before adding guests.</p>}
              <div className="mt-6 overflow-x-auto"><table className="w-full text-left text-xs"><caption className="sr-only">Guest names, RSVP replies and invitation links</caption><thead><tr className="border-b border-[#E8E0D5] text-[10px] uppercase tracking-widest text-[#8A7C6C]"><th className="px-2 py-4">Guest</th><th className="px-2 py-4">Reply</th><th className="px-2 py-4 text-right">Actions</th></tr></thead><tbody>{guests.map((guest) => <tr key={guest.token} className="border-b border-[#F1EBE2]"><td className="max-w-44 break-words px-2 py-5 font-medium">{guest.name}</td><td className="px-2 py-5"><span className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] ${guest.status === "attending" ? "bg-green-50 text-green-800" : guest.status === "declined" ? "bg-rose-50 text-rose-800" : "bg-[#F4EFE7] text-[#8A7C6C]"}`}>{guest.status === "pending" ? "Awaiting reply" : guest.status === "attending" ? "Attending" : "Declined"}</span></td><td className="px-2 py-5 text-right"><div className="flex justify-end gap-4"><button type="button" disabled={!invitation?.published} onClick={() => void copy(`${publicPath}?guest=${guest.token}`, `Personal link for ${guest.name} copied.`)} className="whitespace-nowrap text-[#8A6A43] disabled:opacity-30">Copy link</button><button type="button" disabled={Boolean(busy)} title="Removes this guest, their reply and their personal link" onClick={() => void perform("remove", async () => { setState(await studioRequest<StudioSnapshot>("guests", "DELETE", { token: guest.token })); setNotice("Guest and their personal link removed."); })} className="text-[#9A6767]">Remove</button></div></td></tr>)}</tbody></table>{guests.length === 0 && <p className="py-10 text-center text-sm text-[#8A7C6C]">Your guest list is waiting for its first name.</p>}</div>
            </section>
          </>}
        </> : <>
          <nav aria-label="Invitation setup steps" className="mb-7 grid grid-cols-2 gap-2 sm:grid-cols-4">{steps.map((title, index) => <button key={title} type="button" onClick={() => setStep(index)} aria-current={step === index ? "step" : undefined} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-xs ${step === index ? "border-[#B49A75] bg-white text-[#514234] shadow-sm" : "border-transparent text-[#9B8C7A] hover:bg-white/60"}`}><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] ${step === index ? "bg-[#514234] text-white" : "bg-[#EBE5DA]"}`}>{index + 1}</span>{title}</button>)}</nav>
          <div className="grid items-start gap-7 lg:grid-cols-[1fr_1fr]"><div className="space-y-5"><section className={panel}>
            <div className="mb-7 flex items-center justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[.2em] text-[#9B8058]">Step {step + 1} of 4</p><h2 className="mt-2 font-serif-luxury text-3xl">{["Find your perfect design", "The details that make it yours", "A moment to make sure", "Ready for your loved ones?"][step]}</h2></div><Flower2 size={25} strokeWidth={1} className="shrink-0 text-[#B39A79]" /></div>
            {step === 0 && <><p className="mb-5 text-xs leading-6 text-[#8A7C6C]">Every design below is included in Free. Switch designs whenever you like; your details stay with you.</p><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{FREE_TEMPLATES.map((template) => <div key={template.code} className={`overflow-hidden rounded-2xl border ${design.code === template.code ? "border-[#9B8058] ring-1 ring-[#9B8058]" : "border-[#E8E0D5]"}`}><button type="button" className="block w-full text-left" onClick={() => setDetails((current) => ({ ...current, templateCode: template.code }))} aria-pressed={design.code === template.code}><div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${template.gradient}`}><div style={{ borderColor: `${template.accent}70`, color: template.accent }} className="flex h-24 w-20 flex-col items-center justify-center rounded-t-full border"><Heart size={14} strokeWidth={1} /><span className="mt-2 font-serif-luxury text-2xl italic">A &amp; B</span></div><span className="absolute right-3 top-3 rounded-full bg-white/85 px-2 py-1 text-[9px] font-semibold text-[#715537]">FREE</span>{design.code === template.code && <CheckCircle2 size={18} className="absolute bottom-3 right-3 text-[#715537]" />}</div><div className="p-4"><p className="font-serif-luxury text-xl">{template.name}</p><p className="mt-1 text-[10px] text-[#8A7C6C]">{template.style}</p></div></button><Link href={`/invite/${template.demoSlug}`} target="_blank" rel="noopener noreferrer" className="mx-4 mb-4 inline-block text-[10px] text-[#8A6A43] underline">View sample invitation ↗</Link></div>)}</div></>}
            {step === 1 && <form id="studio-details" onSubmit={(event) => { event.preventDefault(); setStep(2); }}>
              {design.code === "tpl_free_arch" && <label className="mb-5 block text-xs">Invitation colours<select className={inputClass} value={details.theme} onChange={(event) => setDetails((current) => ({ ...current, theme: event.target.value as FreeInvitationDetails["theme"] }))}>{FREE_THEMES.map((theme) => <option key={theme} value={theme}>{theme === "lotus" ? "Lotus · warm ivory & rose" : theme === "jade" ? "Jade · green & gold" : "Ocean · soft blue"}</option>)}</select></label>}
              <div className="grid gap-5 sm:grid-cols-2">{fields.map((field) => <label key={field.key} className="text-xs">{field.label}{field.required ? " *" : ""}<input className={inputClass} type={field.type || "text"} required={field.required} maxLength={field.limit || 150} value={details[field.key]} onChange={(event) => setDetails((current) => ({ ...current, [field.key]: event.target.value }))} pattern={field.key === "whatsapp" ? "[+]?[0-9]{8,15}" : undefined} placeholder={field.key === "whatsapp" ? "94771234567" : undefined} /></label>)}</div><label className="mt-5 block text-xs">Your invitation message<textarea className={inputClass} rows={4} maxLength={600} value={details.greetingMessage} onChange={(event) => setDetails((current) => ({ ...current, greetingMessage: event.target.value }))} /></label><p className="mt-3 text-[11px] leading-6 text-[#8A7C6C]">Only publish information you want guests to see. Your guest list and replies stay private to your account.</p>
            </form>}
            {step === 2 && <div><div className="rounded-2xl bg-[#F8F6F1] p-6"><p className="text-[10px] uppercase tracking-widest text-[#9B8058]">{design.name}</p><h3 className="mt-3 font-serif-luxury text-3xl">{details.brideName} &amp; {details.groomName}</h3><p className="mt-4 text-sm">{details.weddingDate || "Wedding date needed"} · {details.weddingTime || "Time needed"}</p><p className="mt-2 text-sm text-[#8A7C6C]">{details.venueName || "Venue needed"}</p><p className="mt-1 text-xs text-[#8A7C6C]">{details.venueAddress}</p></div><ul className="mt-6 space-y-4 text-xs leading-6 text-[#8A7C6C]">{["Check the spelling of your names and family details.", "Confirm the date, time and venue with your family.", "Scroll through the preview to check the whole invitation.", "Guest replies will appear in your guest dashboard."].map((text) => <li key={text} className="flex gap-3"><Check size={14} className="mt-1 shrink-0 text-[#9B8058]" />{text}</li>)}</ul></div>}
            {step === 3 && <div><div className="rounded-2xl border border-[#E8E0D5] bg-[#FAF8F3] p-6"><div className="flex items-center gap-2 text-xs text-[#715537]"><span className={`h-2 w-2 rounded-full ${invitation?.published ? "bg-green-600" : "bg-[#BAA581]"}`} />{invitation?.published ? "Your invitation is live" : "Your invitation is still a draft"}</div><h3 className="mt-4 font-serif-luxury text-3xl">One link. All your lovely details.</h3><p className="mt-3 text-xs leading-7 text-[#8A7C6C]">Publishing makes your invitation available to anyone with its link. Updates keep the same address. Draft changes stay private until you publish them.</p>{invitation?.published && <p className="mt-3 break-all text-[11px] text-[#8A6A43]">{publicPath}</p>}</div>
              <button type="button" disabled={Boolean(busy)} onClick={() => { if (needsAccount()) return; void perform("publish", async () => { const saved = await save(); setState(await studioRequest<StudioSnapshot>("publish", "POST", { version: saved.invitation!.version })); setNotice("Your invitation is published. Share the link or add personal guest links from your dashboard."); }); }} className={`${primary} mt-6 w-full`}><Send size={15} />{busy === "publish" ? "Publishing…" : invitation?.published ? "Publish latest changes" : "Publish invitation"}</button>
              {invitation?.published && <><div className="mt-4 flex flex-wrap gap-3"><button type="button" className={secondary} onClick={() => void copy(publicPath)}><Copy size={14} />Copy live link</button><Link href={publicPath} target="_blank" rel="noopener noreferrer" className={secondary}><Eye size={14} />View live</Link></div><button type="button" disabled={Boolean(busy)} className="mt-6 text-xs text-[#9A6767] underline" onClick={() => void perform("unpublish", async () => { setState(await studioRequest<StudioSnapshot>("unpublish", "POST", { version: invitation.version })); setNotice("Invitation unpublished. Guests cannot view it until you publish again."); })}>Unpublish invitation</button></>}
              <Link href="/free-invitation/dashboard" className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#8A6A43]">Manage guests &amp; view replies <ArrowRight size={14} /></Link>
            </div>}
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#EEE8DE] pt-6"><button type="button" disabled={step === 0} onClick={() => setStep((current) => current - 1)} className="text-xs text-[#8A7C6C] disabled:opacity-30">← Back</button>{step < 3 && (step === 1 ? <button type="submit" form="studio-details" className={primary}>Review invitation <ArrowRight size={14} /></button> : <button type="button" className={primary} onClick={() => setStep((current) => current + 1)}>{step === 0 ? "Make it yours" : "Continue to publish"}<ArrowRight size={14} /></button>)}</div>
          </section><div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8E0D5] bg-white px-5 py-4"><div><p className="text-xs font-medium">{invitation ? unsaved ? "You have unsaved changes" : "Draft saved to your account" : "Save your progress"}</p><p className="mt-1 text-[10px] text-[#8A7C6C]">{state ? "One Free invitation per account. Change your design anytime." : "A free account keeps your draft and replies together."}</p></div><button type="button" className={secondary} disabled={Boolean(busy)} onClick={saveDraft}>{busy === "save" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}Save draft</button></div><button type="button" className="text-[10px] text-[#9B8C7A] underline" onClick={importBrowserDraft}>Import an earlier draft from this browser</button></div>
            <section aria-label="Live invitation preview" className="min-w-0 lg:sticky lg:top-24"><div className="mb-3 flex items-center justify-between gap-3 px-1 text-[10px] uppercase tracking-[.15em] text-[#9B8C7A]"><span className="flex items-center gap-2"><Eye size={13} />Live preview</span><span>{design.name}</span></div><div className="max-h-[800px] overflow-y-auto rounded-3xl border border-[#E8E0D5] bg-white shadow-[0_12px_50px_#30282108]"><FreeInvitationTemplate key={design.code} details={details} actions={previewActions} /></div><p className="mt-3 text-center text-[10px] leading-6 text-[#9B8C7A]">Scroll to explore · RSVP is disabled in this preview</p></section>
          </div>
        </>}
      </>}
    </div><footer className="mt-8 border-t border-[#E8E0D5] px-5 py-7 text-center text-[10px] tracking-widest text-[#9B8C7A]">MADE WITH LOVE, FOR YOUR FOREVER.</footer>
  </div>;
}
