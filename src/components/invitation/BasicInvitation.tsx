"use client";

import { useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, Heart, Music2, Pause } from "lucide-react";
import { BASIC_DESIGNS, type BasicInvitationDetails } from "@/lib/basic-invitation";
import ShareInvitation from "@/components/basic-studio/ShareInvitation";
import { formatDateLong, formatTime } from "./format";
import type { InvitationInteractions } from "./types";
import WeddingCountdown from "./WeddingCountdown";
import archStyles from "./BasicInvitation.module.css";
import editorialStyles from "./templates/EditorialBasic.module.css";
import EditorialBasicHero from "./templates/EditorialBasicHero";
import botanicalStyles from "./templates/BotanicalBasic.module.css";
import BotanicalBasicHero from "./templates/BotanicalBasicHero";
import maisonStyles from "./templates/MaisonBasic.module.css";
import MaisonBasicHero from "./templates/MaisonBasicHero";

/** Every layout shares one set of Basic Plan features and guest interactions. */
export default function BasicInvitation({ details, guestName, actions, sharePath }: {
  details: BasicInvitationDetails;
  guestName?: string | null;
  actions: InvitationInteractions;
  sharePath?: string;
}) {
  const design = BASIC_DESIGNS.find((item) => item.code === details.design) ?? BASIC_DESIGNS[0];
  // New templates only supply a hero and stylesheet; guest behaviour stays here.
  const templateStyles = { arch: archStyles, editorial: editorialStyles, botanical: botanicalStyles, maison: maisonStyles };
  const styles = templateStyles[details.layout ?? "arch"];
  const templateHeroes = { editorial: EditorialBasicHero, botanical: BotanicalBasicHero, maison: MaisonBasicHero };
  const Hero = details.layout && details.layout !== "arch" ? templateHeroes[details.layout] : null;
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [name, setName] = useState(guestName ?? "");
  const [attending, setAttending] = useState("yes");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const venueQuery = encodeURIComponent(`${details.venueName} ${details.venueAddress}`.trim());
  const maps = details.mapUrl || `https://www.google.com/maps/search/?api=1&query=${venueQuery}`;
  const colours = {
    "--accent": design.colour, "--bg": design.background, "--paper": design.paper,
    "--ink": design.ink, "--muted": design.muted, "--gold": design.gold,
    "--line": design.line, "--on-accent": design.onAccent,
  } as CSSProperties;

  async function toggleMusic() {
    if (!audio.current) return;
    if (playing) audio.current.pause();
    else {
      try { await audio.current.play(); }
      catch { setError("Music could not play. Please try again or contact the couple."); }
    }
  }

  return <article className={styles.invitation} data-design={details.design} style={colours}>
    {Hero ? <Hero details={details} guestName={guestName} /> : <section className={styles.hero}>
      <div className={styles.frame}>
        <div className={styles.portrait}>
          {details.couplePhoto ? <>
            {/* Uploaded photos are compressed data URLs saved with the invitation. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={details.couplePhoto} alt={`${details.brideName} and ${details.groomName}`} />
          </> : <div className={styles.emptyPhoto}><Heart size={60} strokeWidth={1} aria-hidden="true" /><span className={styles.srOnly}>Couple photo placeholder</span></div>}
        </div>
        <p className={styles.kicker}>Together with their families</p>
        <h1 className={styles.names}><span>{details.brideName}</span><i>&amp;</i><span>{details.groomName}</span></h1>
        <p className={styles.kicker}>invite you to celebrate their wedding</p>
        <p className={styles.date}>{formatDateLong(details.weddingDate)}</p>
        <WeddingCountdown date={details.weddingDate} time={details.weddingTime} />
        {guestName && <p className={styles.guest}>A special invitation for <strong>{guestName}</strong></p>}
      </div>
    </section>}

    <section className={`${styles.block} ${styles.message}`}>
      <p>{details.greetingMessage}</p>
      {(details.brideParents || details.groomParents) && <div className={styles.families}><p>{details.brideParents}</p><p>{details.groomParents}</p></div>}
    </section>

    <section className={`${styles.block} ${styles.details}`} aria-label="Wedding details">
      <div><h3>When</h3><p>{formatDateLong(details.weddingDate)}</p><p>{formatTime(details.weddingTime)}</p><p className={styles.muted}>Sri Lanka time</p></div>
      <div><h3>Where</h3><p>{details.venueName || "Venue to be announced"}</p><p className={styles.muted}>{details.venueAddress}</p></div>
    </section>

    <section className={styles.block}>
      <h2>Find the venue</h2>
      {venueQuery && <div className={styles.map}><iframe src={`https://maps.google.com/maps?q=${venueQuery}&output=embed`} title={`Venue location: ${details.venueName}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>}
      <a className={`${styles.button} ${styles.ghost}`} href={maps} target="_blank" rel="noopener noreferrer">Open in Google Maps <ArrowUpRight size={15} /></a>
    </section>

    <section id="basic-rsvp" className={styles.block}>
      <h2>Will you join us?</h2>
      {details.rsvpDeadline && <p className={styles.deadline}>Kindly reply by {formatDateLong(details.rsvpDeadline)}.</p>}
      {actions.rsvp && <p role="status" className={styles.confirmation}>Your reply: {actions.rsvp.status === "attending" ? "Joyfully attending" : actions.rsvp.status === "declined" ? "Unable to attend" : "Awaiting your reply"}</p>}
      <form className={styles.form} onSubmit={async (event) => {
        event.preventDefault();
        if (busy || actions.mode === "preview") return;
        setBusy(true); setError(""); setMessage("");
        try {
          await actions.submitRsvp({ name: guestName || name, attending: attending === "yes", headCount: 1 });
          setMessage("Thank you. Your reply has been sent to the couple.");
        } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not send your reply."); }
        finally { setBusy(false); }
      }}>
        <label>Your name<input required maxLength={150} autoComplete="name" value={guestName || name} readOnly={Boolean(guestName)} onChange={(event) => setName(event.target.value)} placeholder="Full name" /></label>
        <fieldset><legend>Your answer</legend>
          <label className={styles.radio}><input type="radio" name="attendance" value="yes" checked={attending === "yes"} onChange={() => setAttending("yes")} />Joyfully accept</label>
          <label className={styles.radio}><input type="radio" name="attendance" value="no" checked={attending === "no"} onChange={() => setAttending("no")} />Regretfully decline</label>
        </fieldset>
        <button className={styles.button} disabled={busy || actions.mode === "preview"}>{actions.mode === "preview" ? "RSVP available after publishing" : busy ? "Sending your reply..." : "Send RSVP"}</button>
        {message && <p role="status" className={styles.status}>{message}</p>}
      </form>
      {error && <p role="alert" className={styles.status}>{error}</p>}
      {details.whatsapp && <a href={`https://wa.me/${details.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className={styles.contact}>A little question? Message the couple</a>}
    </section>

    <section className={styles.block}>
      <h2>Share this invitation</h2>
      {sharePath ? <ShareInvitation path={sharePath} title={`${details.brideName} & ${details.groomName} - Wedding invitation`} invitationStyle /> : <p className={styles.muted}>Publish your invitation to share by WhatsApp, email or QR code.</p>}
    </section>
    <footer className={styles.footer}>{details.brideName} &amp; {details.groomName}</footer>
    {details.musicUrl && <div className={styles.music}>
      <audio ref={audio} src={details.musicUrl} loop preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setError("The music link is unavailable. The couple can update it in their invitation."); }} />
      <button type="button" onClick={() => void toggleMusic()} aria-label={playing ? "Pause background music" : "Play background music"} aria-pressed={playing}>{playing ? <Pause size={20} /> : <Music2 size={20} />}</button>
    </div>}
  </article>;
}
