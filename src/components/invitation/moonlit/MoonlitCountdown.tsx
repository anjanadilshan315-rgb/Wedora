"use client";

import { useEffect, useState } from "react";
import type { StandardInvitationDetails } from "@/lib/standard-invitation";
import { formatDateLong } from "../format";
import { Moon } from "lucide-react";
import styles from "./MoonlitCountdown.module.css";
import shared from "../solstice/Solstice.module.css";

export default function MoonlitCountdown({ details }: { details: StandardInvitationDetails }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = Date.parse(`${details.weddingDate}T${details.weddingTime || "00:00"}:00+05:30`);
    const update = () => setLeft(Number.isFinite(target) ? Math.max(0, target - Date.now()) : null);
    update(); const interval = setInterval(update, 1000); return () => clearInterval(interval);
  }, [details.weddingDate, details.weddingTime]);
  const parts = [[Math.floor((left ?? 0) / 86400000), "Days"], [Math.floor((left ?? 0) / 3600000) % 24, "Hours"], [Math.floor((left ?? 0) / 60000) % 60, "Minutes"], [Math.floor((left ?? 0) / 1000) % 60, "Seconds"]];
  return (
    <section className={`${styles.countdown} ${shared.reveal}`} aria-label="Countdown to our wedding">
      <div className={styles.heading}>
        <span className={styles.emblem} aria-hidden="true"><Moon size={22} strokeWidth={.8} /></span>
        <p className={styles.eyebrow}>EVERY MOMENT BRINGS US CLOSER</p>
        <h2>A date with<br /> <em>forever.</em></h2>
        <p className={styles.date}>{formatDateLong(details.weddingDate)}<span>{details.venueName}</span></p>
      </div>
      <div className={styles.keepsake}>
        <p className={styles.label}>THE MOST BEAUTIFUL WAIT</p>
        {left === 0 ? <p className={styles.today}>Our forever begins tonight.</p> : (
          <div className={styles.clock} aria-label="Time until the wedding">
            {parts.map(([value, label]) => (
              <div key={label}>
                <strong>{left === null ? "—" : String(value).padStart(2, "0")}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        )}
        <p className={styles.footnote}>A little anticipation. A lifetime ahead.</p>
      </div>
    </section>
  );
}
