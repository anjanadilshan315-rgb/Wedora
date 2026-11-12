"use client";

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { StandardInvitationDetails } from "@/lib/standard-invitation";
import { formatDateLong } from "../format";
import styles from "./MoonlitEntrance.module.css";

type EntranceProps = {
  details: StandardInvitationDetails;
  photos: string[];
  guestName?: string | null;
  opening: boolean;
  onOpen: () => void;
};

/** A ribbon-wrapped portrait card replaces the triangular envelope. */
export default function MoonlitEntrance({ details, photos, guestName, opening, onOpen }: EntranceProps) {
  const initials = `${details.brideName[0] || ""}${details.groomName[0] || ""}`;

  return <section className={styles.entrance} data-opening={opening} aria-label="Personal wedding invitation">
    <div className={styles.backdrop} aria-hidden="true">
      {photos[0] && <img src={photos[0]} alt="" />}
      <span className={styles.halo} /><span className={styles.halo} />
      {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--x": `${(index * 31 + 4) % 96}%`, "--y": `${(index * 17 + 8) % 90}%`, "--delay": `${-index * 1.3}s` } as CSSProperties} />)}
    </div>

    <div className={styles.introduction}>
      <p className={styles.eyebrow}><span /> A LITTLE LOVE, JUST FOR YOU</p>
      <h1>Every love story<br />has <em>its moment.</em></h1>
      <p className={styles.message}>{details.welcomeMessage}</p>
      <div className={styles.recipient}><span>WE SAVED THIS ONE FOR</span><strong>{guestName || "our favourite people"}</strong></div>
      <button type="button" className={styles.openButton} disabled={opening} onClick={onOpen}>{opening ? "Unwrapping a little forever…" : "Unwrap our invitation"}<ArrowUpRight size={17} /></button>
      <p className={styles.date}>{formatDateLong(details.weddingDate)}<span>{details.venueName}</span></p>
    </div>

    <div className={styles.cardStage}>
      <span className={styles.orbit} aria-hidden="true" />
      <span className={styles.paperEcho} aria-hidden="true" />
      <button type="button" className={styles.portraitCard} aria-label="Open your wedding invitation" disabled={opening} onClick={onOpen}>
        <span className={styles.coverPhoto}>
          {photos[0] ? <img src={photos[0]} alt={`${details.brideName} and ${details.groomName}`} fetchPriority="high" /> : <Sparkles size={60} strokeWidth={.5} />}
          <span>THE WEDDING EDITION</span>
        </span>
        <span className={styles.cardStory}><span>TOGETHER IS OUR FAVOURITE PLACE</span><strong>{details.brideName} <i>&amp;</i> {details.groomName}</strong><small>{formatDateLong(details.weddingDate)}</small></span>
        <span className={styles.ribbon}><span className={styles.ribbonShine} /><span className={styles.monogram}><span>{initials}</span></span></span>
      </button>
      <span className={styles.stageCaption}><Sparkles size={12} strokeWidth={1} /> TAP THE PORTRAIT TO UNWRAP OUR STORY</span>
      <span className={styles.star} aria-hidden="true">✧</span><span className={styles.star} aria-hidden="true">✧</span>
    </div>
  </section>;
}
