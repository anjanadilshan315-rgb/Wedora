"use client";

import { useEffect, useState } from "react";
import styles from "./BasicInvitation.module.css";

/** The reference ZIP's countdown, with an explicit Sri Lankan wedding timezone. */
export default function WeddingCountdown({ date, time }: { date: string; time: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(`${date}T${time || "00:00"}:00+05:30`).getTime();
    function update() { setRemaining(Number.isFinite(target) ? Math.max(0, target - Date.now()) : null); }
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [date, time]);
  if (remaining === null) return null;
  if (remaining === 0) return <p className={styles.muted}>The celebration has begun ♡</p>;
  const parts = [
    [Math.floor(remaining / 86400000), "Days"],
    [Math.floor(remaining / 3600000) % 24, "Hours"],
    [Math.floor(remaining / 60000) % 60, "Mins"],
    [Math.floor(remaining / 1000) % 60, "Secs"],
  ];
  // Avoid announcing a changing countdown every second to screen readers.
  return <div className={styles.countdown} role="group" aria-label="Time until the wedding">{parts.map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}</div>;
}
