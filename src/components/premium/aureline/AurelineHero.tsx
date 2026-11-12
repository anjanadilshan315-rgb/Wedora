"use client";
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { ArrowDown, Pause, Play } from "lucide-react";
import type { PremiumDetails } from "@/lib/premium-invitation";
import { formatDateLong, formatTime } from "../../invitation/format";
import { AurelineMandala, AurelineProcession } from "./AurelineOrnaments";
import styles from "./Aureline.module.css";

export default function AurelineHero({ details, photo, onError }: { details: PremiumDetails; photo: string; onError: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const date = new Date(`${details.weddingDate || "2027-12-12"}T12:00:00+05:30`);
  return <section id="premium-home" className={styles.hero}>
    <AurelineMandala className={styles.heroMandala} />
    <div className={styles.heroCopy}>
      <span className={styles.kicker}>WITH THE BLESSINGS OF OUR FAMILIES</span>
      <h1>{details.brideName}<i>&amp;</i>{details.groomName}</h1>
      <p>Two stories, one beautiful beginning.</p>
      <div className={styles.dateRibbon}>
        <span>{date.toLocaleString("en-GB", { month: "long", timeZone: "Asia/Colombo" })}</span>
        <strong>{String(date.getUTCDate()).padStart(2, "0")}</strong>
        <span>{date.getUTCFullYear()}</span>
      </div>
      <p className={styles.venue}>{details.venueName}<span>{formatTime(details.weddingTime)} · {details.venueAddress}</span>
      </p>
      <a href="#premium-events">THE DETAILS OF OUR DAY <ArrowDown size={13} />
      </a>
    </div>
    <div className={styles.coupleStage}>
      <span className={styles.portraitHalo} aria-hidden="true" />
      {details.backgroundVideoUrl ? <video ref={video} src={details.backgroundVideoUrl} poster={photo} muted autoPlay loop playsInline onError={onError} /> : photo ? <img className={styles.customerPortrait} src={photo} alt={`${details.brideName} and ${details.groomName}`} fetchPriority="high" /> : <img className={styles.coupleIllustration} src="/assets/aureline/couple.webp" alt="Illustrated Sri Lankan wedding couple" fetchPriority="high" />}
      {details.backgroundVideoUrl && <button type="button" className={styles.backgroundControl} aria-label={paused ? "Play background video" : "Pause background video"} onClick={() => { if (!video.current) return; if (paused) void video.current.play().then(() => setPaused(false)).catch(onError); else { video.current.pause(); setPaused(true); } }}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>}
      <span className={styles.heroCaption}>{formatDateLong(details.weddingDate)}<i>THE START OF OUR ALWAYS</i>
      </span>
    </div>
    <AurelineProcession className={styles.heroProcession} />
  </section>;
}
