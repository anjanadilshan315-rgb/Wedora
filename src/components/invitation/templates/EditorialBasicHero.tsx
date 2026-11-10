import { ArrowDown, ArrowUpRight, Flower2, Heart } from "lucide-react";
import type { BasicInvitationDetails } from "@/lib/basic-invitation";
import { formatDateShort } from "../format";
import WeddingCountdown from "../WeddingCountdown";
import styles from "./EditorialBasic.module.css";

/** Presentation only: editing and guest replies stay in the shared Basic components. */
export default function EditorialBasicHero({ details, guestName }: {
  details: BasicInvitationDetails;
  guestName?: string | null;
}) {
  return <>
    <header className={styles.masthead}>
      <span className={styles.monogram}>{details.brideName.slice(0, 1)}<i>&</i>{details.groomName.slice(0, 1)}</span>
      <span>THE WEDDING EDITION</span>
      <a href="#basic-rsvp">RSVP ↗</a>
    </header>
    <section className={styles.hero}>
      <div className={styles.spread}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span />TOGETHER, WITH OUR FAMILIES</p>
          <div className={styles.heading}><span>A love to celebrate.</span><h1>A lifetime<br />to <em>cherish.</em></h1></div>
          <p className={styles.heroNote}>Some moments become memories.<br />We would love you to be part of ours.</p>
          <a className={styles.heroLink} href="#basic-rsvp">JOIN OUR CELEBRATION <ArrowUpRight size={14} /></a>
          <div className={styles.edition}><Flower2 size={30} strokeWidth={.8} /><span>ONE BEAUTIFUL DAY.<br />A LIFETIME OF LOVE.</span></div>
        </div>
        <div className={styles.editorialPhoto}>
        {details.couplePhoto ? <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={details.couplePhoto} alt={`${details.brideName} and ${details.groomName}`} />
        </> : <div className={styles.photoPlaceholder}><div className={styles.portraitMonogram}>{details.brideName.slice(0, 1)}<i>&amp;</i>{details.groomName.slice(0, 1)}</div><Heart size={20} strokeWidth={.8} /><span>Written in the stars.</span><small>YOUR PHOTOGRAPH GOES HERE</small></div>}
        <span className={styles.photoLabel}>THE NEXT CHAPTER / {details.weddingDate.slice(0, 4) || "FOREVER"}</span>
        <span className={styles.photoSeal}><Heart size={12} strokeWidth={1} />with<br /><em>love.</em></span>
        </div>
      </div>
      <div className={styles.nameplate}><div><span className={styles.eyebrow}>JOYFULLY INVITE YOU</span><p>{details.brideName}<i>&amp;</i>{details.groomName}</p></div><div className={styles.dateplate}><span>SAVE THE DATE</span><strong>{formatDateShort(details.weddingDate)}</strong><small>{details.venueName || "Our wedding day"}</small></div></div>
      {guestName && <p className={styles.guest}>Reserved with love for <strong>{guestName}</strong></p>}
      <div className={styles.countdownWrap}><p className={styles.eyebrow}>EVERY MOMENT BRINGS US CLOSER</p><WeddingCountdown date={details.weddingDate} time={details.weddingTime} /></div>
      <div className={styles.scrollNote}><span>THE DETAILS OF OUR DAY</span><ArrowDown size={16} strokeWidth={1} /></div>
    </section>
  </>;
}
