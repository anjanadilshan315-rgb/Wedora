import { ArrowDownRight, ArrowUpRight, Heart } from "lucide-react";
import type { BasicInvitationDetails } from "@/lib/basic-invitation";
import { formatDateLong, formatDateShort } from "../format";
import WeddingCountdown from "../WeddingCountdown";
import styles from "./MaisonBasic.module.css";

/** Layout only. The Basic invitation supplies the working RSVP and sharing tools. */
export default function MaisonBasicHero({ details, guestName }: {
  details: BasicInvitationDetails;
  guestName?: string | null;
}) {
  const dateParts = details.weddingDate.split("-");
  const date = details.weddingDate ? new Date(`${details.weddingDate}T00:00:00Z`) : null;
  const validDate = date && Number.isFinite(date.getTime());
  const month = validDate ? new Intl.DateTimeFormat("en", { month: "long", timeZone: "UTC" }).format(date) : "Our day";

  return <>
    <header className={styles.navigation}>
      <span>{details.brideName.slice(0, 1)}<i>&amp;</i>{details.groomName.slice(0, 1)}</span>
      <p>THE WEDDING / {dateParts[0] || "FOREVER"}</p>
      <a href="#basic-rsvp">RSVP <ArrowUpRight size={13} /></a>
    </header>
    <section className={styles.hero}>
      <div className={styles.intro}><span className={styles.eyebrow}>A NEW CHAPTER, TOGETHER.</span><span className={styles.edition}>NO. 01 / OUR FOREVER</span></div>
      <div className={styles.composition}>
        <div className={styles.title}>
          <p>With our families,<br />we invite you to celebrate</p>
          <h1><span>{details.brideName}</span><i>&amp;</i><span>{details.groomName}</span></h1>
          <a className={styles.heroLink} href="#maison-details">A DAY TO CALL OURS <ArrowDownRight size={18} strokeWidth={1} /></a>
        </div>
        <div className={styles.photoGroup}>
          <div className={styles.photo}>
            {details.couplePhoto ? <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={details.couplePhoto} alt={`${details.brideName} and ${details.groomName}`} />
            </> : <div className={styles.photoPlaceholder}><div className={styles.rings} aria-hidden="true"><span /><span /></div><p>Made for<br /><em>each other.</em></p><small>YOUR PHOTO BELONGS HERE</small></div>}
          </div>
          <span className={styles.photoCaption}>YOU. ME. EVERYTHING IN BETWEEN.</span>
          <div className={styles.loveStamp}><Heart size={15} strokeWidth={1} /><span>ALL OF ME.<br />ALL OF YOU.</span></div>
        </div>
      </div>
      <div className={styles.dateCard} id="maison-details">
        <div className={styles.calendar}><span>{month}</span><strong>{validDate ? dateParts[2] : "—"}</strong><small>{validDate ? dateParts[0] : "FOREVER"}</small></div>
        <div className={styles.dateDetails}><p className={styles.eyebrow}>SAVE A LITTLE SPACE IN YOUR HEART</p><h2>One day.<br /><em>A lifetime of us.</em></h2><p>{details.venueName || "Our wedding celebration"}</p><span>{formatDateLong(details.weddingDate)}</span></div>
        <ArrowUpRight className={styles.dateArrow} size={34} strokeWidth={.8} aria-hidden="true" />
      </div>
      {guestName && <p className={styles.guest}>For <strong>{guestName}</strong>, with love. We saved you a place.</p>}
      <div className={styles.countdownWrap}><span className={styles.eyebrow}>UNTIL {formatDateShort(details.weddingDate).toUpperCase()}</span><WeddingCountdown date={details.weddingDate} time={details.weddingTime} /></div>
    </section>
  </>;
}
