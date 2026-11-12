"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import type { StandardInvitationDetails } from "@/lib/standard-invitation";
import { formatDateLong } from "../format";
import { WeddingRings } from "./SolsticeCover";
import styles from "./Solstice.module.css";

/** Photo-led date announcement, separate from The Vow's countdown layout. */
export default function SolsticeCountdown({ details, photo }: { details: StandardInvitationDetails; photo?: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const target = Date.parse(`${details.weddingDate}T${details.weddingTime || "00:00"}:00+05:30`);
    const update = () => setRemaining(Number.isFinite(target) ? Math.max(0, target - Date.now()) : null);
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [details.weddingDate, details.weddingTime]);
  const parts = [[Math.floor((remaining ?? 0) / 86400000), "Days"], [Math.floor((remaining ?? 0) / 3600000) % 24, "Hours"], [Math.floor((remaining ?? 0) / 60000) % 60, "Minutes"], [Math.floor((remaining ?? 0) / 1000) % 60, "Seconds"]];
  return <section className={`${styles.countdownFeature} ${styles.reveal}`} aria-label="Countdown to our wedding">
    <div className={styles.countdownPhoto}>
      {photo && <img src={photo} alt={`${details.brideName} and ${details.groomName}, looking forward to forever`} loading="lazy" />}
      <div className={styles.countdownPhotoNote}><span>THE DAY WE BECOME</span><p>each other’s<br /><em>always.</em></p></div>
      <div className={styles.dateBookmark}><span>SAVE OUR DATE</span><strong>{details.weddingDate.split("-")[2] || "—"}</strong><small>{details.weddingDate ? new Date(`${details.weddingDate}T12:00:00`).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "Coming soon"}</small></div>
    </div>
    <div className={styles.countdownInvitation}>
      <WeddingRings size={62} />
      <p className={styles.countdownKicker}>EVERY MOMENT BRINGS US CLOSER</p>
      <h2>Counting down<br />to <em>forever.</em></h2>
      <p className={styles.countdownPromise}>A date on the calendar.<br />A lifetime in our hearts.</p>
      {remaining === 0 ? <p className={styles.celebrationStarted}>Our forever begins today.</p> : <div className={styles.countdownTiles} aria-label="Time until the wedding">{parts.map(([value, label]) => <div key={label}><strong>{remaining === null ? "—" : String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}</div>}
      <p className={styles.countdownDate}>{formatDateLong(details.weddingDate)}<span>{details.venueName}</span></p>
    </div>
  </section>;
}
