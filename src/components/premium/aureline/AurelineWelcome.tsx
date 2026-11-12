"use client";
/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { PremiumDetails } from "@/lib/premium-invitation";
import { formatDateLong } from "../../invitation/format";
import { AurelineMandala, AurelineProcession } from "./AurelineOrnaments";
import { AurelineSpiralRain } from "./AurelineAtmosphere";
import styles from "./Aureline.module.css";

export default function AurelineWelcome({ details, guestName, opening, onOpen, onSkip }: {
  details: PremiumDetails; guestName?: string | null; opening: boolean; onOpen: () => void; onSkip: () => void;
}) {
  return <section className={styles.welcome} data-opening={opening} data-effect={details.opening} aria-label="Your personal wedding invitation">
    <AurelineMandala className={styles.mandala} />
    <div className={styles.silkLines} aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
    <div className={styles.welcomeLetter}>
      <span className={styles.kicker}>THE WEDDING OF</span>
      <h1>{details.brideName}<i>&amp;</i>{details.groomName}</h1>
      <span className={styles.welcomeDate}>{formatDateLong(details.weddingDate)}</span>
      <p>{details.welcomeMessage}</p>
      <button type="button" disabled={opening} aria-label="Open your wedding invitation" onClick={onOpen}>{opening ? "Our journey is beginning…" : "Begin our journey"}<ArrowRight size={15} />
      </button>
      <div className={styles.recipient}>
        <span>A PERSONAL INVITATION FOR</span>
        <strong>{guestName || "our favourite people"}</strong>
      </div>
    </div>
    <AurelineProcession className={styles.procession} />
    {opening && <div className={styles.journeyScene} role="status" aria-label="Your invitation journey is opening">
      <img src="/assets/aureline/journey.webp" alt="An illustrated wedding couple beginning their journey in a vintage convertible" />
      <div className={styles.sceneTitle}>
        <Sparkles size={18} strokeWidth={1} />
        <span>EVERY ROAD LED TO YOU</span>
        <strong>{details.brideName} &amp; {details.groomName}</strong>
      </div>
      <button type="button" className={styles.skip} onClick={onSkip}>Skip intro →</button>
      <AurelineSpiralRain />
      <div className={styles.petalBurst} aria-hidden="true">{Array.from({ length: 24 }, (_, n) => <i key={n} style={{ "--angle": `${n * 15}deg`, "--delay": `${n % 4 * .06}s` } as CSSProperties} />)}</div>
    </div>}
  </section>;
}
