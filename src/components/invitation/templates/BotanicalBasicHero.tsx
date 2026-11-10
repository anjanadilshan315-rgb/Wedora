import { ArrowDown, Leaf } from "lucide-react";
import type { BasicInvitationDetails } from "@/lib/basic-invitation";
import { formatDateLong } from "../format";
import WeddingCountdown from "../WeddingCountdown";
import styles from "./BotanicalBasic.module.css";
import BotanicalSprig from "./BotanicalSprig";

/** Only the design lives here. The shared Basic invitation handles guest actions. */
export default function BotanicalBasicHero({ details, guestName }: {
  details: BasicInvitationDetails;
  guestName?: string | null;
}) {
  return <>
    <header className={styles.cover}>
      {details.couplePhoto && <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.coverPhoto} src={details.couplePhoto} alt={`${details.brideName} and ${details.groomName}`} />
      </>}
      <div className={styles.coverShade} />
      <div className={styles.topSprig}><BotanicalSprig /></div>
      <div className={styles.bottomSprig}><BotanicalSprig /></div>
      <nav className={styles.navigation} aria-label="Invitation navigation">
        <span>{details.brideName.slice(0, 1)}<i>&amp;</i>{details.groomName.slice(0, 1)}</span>
        <a href="#basic-rsvp">KINDLY RSVP ↗</a>
      </nav>
      <div className={styles.coverContent}>
        <span className={styles.coverEdition}>THE BOTANICAL COLLECTION / {details.weddingDate.slice(0, 4) || "FOREVER"}</span>
        <div className={styles.botanicalMark} aria-hidden="true"><Leaf size={32} strokeWidth={.8} /><Leaf size={32} strokeWidth={.8} /></div>
        <p className={styles.eyebrow}>WITH OUR FAMILIES, WITH ALL OUR LOVE</p>
        <h1><span>{details.brideName}</span><i>&amp;</i><span>{details.groomName}</span></h1>
        <p className={styles.coverInvitation}>invite you to the beginning of forever</p>
        <div className={styles.coverDate}><span>TOGETHER IS OUR FAVOURITE PLACE</span><strong>{formatDateLong(details.weddingDate)}</strong><small>{details.venueName || "Our wedding celebration"}</small></div>
        <a className={styles.discover} href="#botanical-story"><span>OUR CELEBRATION</span><ArrowDown size={17} strokeWidth={1} /></a>
      </div>
      <span className={styles.coverFootnote}>A LOVE THAT GROWS, A LIFE TOGETHER.</span>
    </header>
    <section className={styles.welcome} aria-label="Welcome to our wedding">
      <div className={styles.welcomeSeal}><Leaf size={22} strokeWidth={1} /></div>
      <div className={styles.welcomeSprig}><BotanicalSprig /></div>
      <p className={styles.eyebrow}>A DAY MADE MORE BEAUTIFUL WITH YOU</p>
      <h2>Love brought us here.<br /><em>You make it complete.</em></h2>
      {guestName && <p className={styles.guest}>With a special place in our hearts for <strong>{guestName}</strong></p>}
      <div className={styles.countdownWrap}><WeddingCountdown date={details.weddingDate} time={details.weddingTime} /></div>
      <p className={styles.welcomeCaption}>COUNTING THE MOMENTS UNTIL WE CELEBRATE TOGETHER</p>
      <span id="botanical-story" className={styles.storyAnchor} />
    </section>
  </>;
}
