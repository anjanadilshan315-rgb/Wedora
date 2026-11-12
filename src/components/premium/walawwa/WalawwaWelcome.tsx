"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Sparkles } from "lucide-react";
import type { PremiumDetails } from "@/lib/premium-invitation";
import styles from "./Walawwa.module.css";

/** Two halves of one gate texture swing independently on their outside hinges. */
export default function WalawwaWelcome({ details, guestName, opening, onOpen, onSkip }: {
  details: PremiumDetails; guestName?: string | null; opening: boolean; onOpen: () => void; onSkip: () => void;
}) {
  return <section className={styles.welcome} data-opening={opening} data-effect={details.opening} aria-label="Your personal wedding invitation">
    <div className={styles.welcomeHeading}><span>A CELEBRATION BEGINS AT HOME</span><strong>{details.brideName} <i>&amp;</i> {details.groomName}</strong><p>{details.welcomeMessage}</p></div>
    <div className={styles.doorway} aria-hidden="true">
      <div className={styles.doorLight} />
      {["left", "right"].map(side => <span key={`column-${side}`} className={styles.gatePillar} data-side={side}><i className={styles.columnShaft} /></span>)}
      {["left", "right"].map(side => <div key={side} className={styles.doorLeaf} data-side={side}>
        <img src="/assets/walawwa/teak-gate.webp" alt="" fetchPriority="high" />
      </div>)}
      <span className={styles.doorMonogram}>{details.brideName[0]} &amp; {details.groomName[0]}</span>
    </div>
    <div className={styles.doorSteps} aria-hidden="true"><i /><i /><i /></div>
    <img className={styles.flowersLeft} src="/assets/walawwa/rose-arrangement.webp" alt="" fetchPriority="high" />
    <img className={styles.flowersRight} src="/assets/walawwa/rose-arrangement.webp" alt="" fetchPriority="high" />
    <div className={styles.welcomeReply}><span>ESPECIALLY FOR {guestName || "OUR FAVOURITE PEOPLE"}</span><button type="button" aria-label="Open your wedding invitation" disabled={opening} onClick={onOpen}><Sparkles size={15} />{opening ? "Welcome to our celebration…" : "Open invitation"}<ArrowRight size={15} /></button></div>
    {opening && <button type="button" className={styles.skipIntro} onClick={onSkip}>Skip intro →</button>}
  </section>;
}
