"use client";

/* Solstice owns its visuals. Guest replies, publishing and media controls stay
   in StandardInvitation so every Standard template has the same features. */
/* eslint-disable @next/next/no-img-element */
import { useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { StandardInvitationDetails } from "@/lib/standard-invitation";
import { formatDateLong } from "../format";
import styles from "./Solstice.module.css";

type DetailsProps = { details: StandardInvitationDetails; guestName?: string | null };
/** Interlocking rings replace the former sun ornament throughout the cover. */
export function WeddingRings({ size = 64 }: { size?: number }) {
  return <svg width={size} height={size * .72} viewBox="0 0 100 72" fill="none" aria-hidden="true"><ellipse cx="37" cy="40" rx="24" ry="26" transform="rotate(-25 37 40)" stroke="currentColor" strokeWidth="1.2" /><ellipse cx="64" cy="40" rx="24" ry="26" transform="rotate(25 64 40)" stroke="currentColor" strokeWidth="1.2" /><path d="m57 9 7-7 7 7-7 9-7-9ZM57 9h14M64 2v16" stroke="currentColor" strokeWidth="1" /></svg>;
}

export function SolsticeWelcome({ details, photos, guestName, opening, onOpen }: DetailsProps & { photos: string[]; opening: boolean; onOpen: () => void }) {
  return <section className={`${styles.welcome} ${styles.photoWelcome}`} data-opening={opening} aria-label="Personal wedding invitation">
    <div className={styles.welcomeBackdrop} aria-hidden="true">{photos[0] && <img src={photos[0]} alt="" fetchPriority="high" />}</div>
    <div className={styles.welcomeLights} aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <span key={index} style={{ "--i": index } as CSSProperties} />)}</div>
    <div className={styles.ringSignature}><WeddingRings size={95} /><span>TWO SOULS. ONE FOREVER.</span></div>
    <div className={styles.welcomeContent}>
      <p className={styles.eyebrow}>AN INVITATION TO OUR FOREVER</p>
      <h1>A beautiful beginning.<br /><em>With you, beside us.</em></h1>
      <p className={styles.welcomeMessage}>{details.welcomeMessage}</p>
      <button className={styles.folio} type="button" disabled={opening} onClick={onOpen} aria-label="Open your wedding invitation">
        <span className={styles.folioInside}><WeddingRings size={52} /><strong>{details.brideName} &amp; {details.groomName}</strong><small>{formatDateLong(details.weddingDate)}</small></span>
        <span className={styles.folioLeft}><span>THE WEDDING OF</span><strong>{details.brideName}</strong><small>WITH OUR WHOLE HEARTS</small></span>
        <span className={styles.folioRight}><span>A NEW CHAPTER</span><strong>{details.groomName}</strong><small>{details.weddingDate.split("-").reverse().join(" · ")}</small></span>
        <span className={styles.folioClasp}><WeddingRings size={37} /></span>
        <span className={styles.folioHint}>TAP TO UNFOLD OUR STORY</span>
      </button>
      <p className={styles.recipient}>Especially for <strong>{guestName || "our favourite people"}</strong></p>
      <button className={styles.openButton} type="button" onClick={onOpen} disabled={opening}>{opening ? "A new chapter is unfolding…" : "Unfold our story"}<ArrowUpRight size={16} /></button>
      <p className={styles.fine}>One beautiful day. A lifetime of us.</p>
    </div>
  </section>;
}

export function SolsticeHero({ details, photos, onMediaError }: DetailsProps & { photos: string[]; onMediaError: () => void }) {
  const background = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  return <section id="standard-home" className={styles.hero}>
    <div className={styles.heroHeading}><p className={styles.eyebrow}>A LOVE WORTH GOING PLACES FOR</p><div className={styles.heroTitle}><h1><span>{details.brideName}</span><i>&amp;</i><span>{details.groomName}</span></h1><div className={styles.heroStamp}><WeddingRings size={45} /><span>OUR NEXT<br />GREAT ADVENTURE</span></div></div><div className={styles.heroSubline}><p>We found our person.<br />Now, let’s make a day of it.</p><a href="#standard-rsvp" className={styles.button}>Count me in <ArrowUpRight size={16} /></a></div></div>
    <div className={styles.panorama}>
      {details.backgroundVideoUrl ? <><video ref={background} src={details.backgroundVideoUrl} poster={photos[0]} muted autoPlay playsInline loop onError={onMediaError} /><button className={styles.backgroundControl} type="button" aria-label={paused ? "Play background video" : "Pause background video"} onClick={() => { if (!background.current) return; if (paused) { void background.current.play().then(() => setPaused(false)).catch(onMediaError); } else { background.current.pause(); setPaused(true); } }}>{paused ? "Play the moment" : "Pause the moment"}</button></> : photos[0] ? <img src={photos[0]} alt={`${details.brideName} and ${details.groomName}, a new adventure together`} fetchPriority="high" /> : <div className={styles.emptyCover}><WeddingRings size={90} /><span>Your adventure, captured here.</span></div>}
      <div className={styles.horizonLines} aria-hidden="true"><span /><span /><span /></div><span className={styles.panoramaCaption}>SOMEWHERE BETWEEN A LITTLE MAGIC &amp; A LIFETIME OF LOVE</span>
    </div>
    <div className={styles.travelStrip}><div><span>THE DATE</span><strong>{formatDateLong(details.weddingDate)}</strong></div><div><span>THE PLACE</span><strong>{details.venueName || "Our favourite place, coming soon"}</strong></div><a href="#standard-story">The story continues <ArrowDown size={16} /></a></div>
  </section>;
}
