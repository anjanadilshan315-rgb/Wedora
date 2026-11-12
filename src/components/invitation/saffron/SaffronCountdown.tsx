"use client";

import { useEffect, useState } from "react";
import type { StandardInvitationDetails } from "@/lib/standard-invitation";
import styles from "./Saffron.module.css";

export default function SaffronCountdown({ details }: { details: StandardInvitationDetails }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const target = Date.parse(`${details.weddingDate}T${details.weddingTime || "00:00"}:00+05:30`);
    const update = () => setLeft(Number.isFinite(target) ? Math.max(0, target - Date.now()) : null);
    update(); const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [details.weddingDate, details.weddingTime]);
  const units = [
    [Math.floor((left ?? 0) / 86400000), "DAYS"],
    [Math.floor((left ?? 0) / 3600000) % 24, "HOURS"],
    [Math.floor((left ?? 0) / 60000) % 60, "MINUTES"],
    [Math.floor((left ?? 0) / 1000) % 60, "SECONDS"],
  ];

  return (
    <section className={`${styles.countdownPanel} ${styles.reveal}`} aria-label="Countdown to our wedding">
      <div>
        <p className={styles.kicker}>COMING SOON / OUR FAVOURITE DAY</p>
        <h2>Worth<br />the <em>wait.</em></h2>
        <p>Clear your calendar.<br />We have some celebrating to do.</p>
      </div>
      {left === 0 ? (
        <p className={styles.today}>The wait is over.<br />Let the good times begin!</p>
      ) : (
        <div className={styles.clock}>
          {units.map(([value, label]) => (
            <div key={label}>
              <strong>{left === null ? "--" : String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
