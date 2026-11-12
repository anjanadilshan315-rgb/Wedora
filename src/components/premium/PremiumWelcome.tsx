"use client";

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";
import type { PremiumDetails } from "@/lib/premium-invitation";
import { formatDateLong } from "../invitation/format";
import styles from "./PremiumInvitation.module.css";

type WelcomeProps = {
  details: PremiumDetails;
  guestName?: string | null;
  opening: boolean;
  onOpen: () => void;
};

/** The photographic envelope fades into the working flap and sliding paper on opening. */
export default function PremiumWelcome({ details, guestName, opening, onOpen }: WelcomeProps) {
  return (
    <section className={styles.welcome} data-opening={opening} aria-label="Your personal wedding invitation">
      <div className={styles.welcomeArtwork} aria-hidden="true">
        <img src="/assets/premium/rose-floral-paper.webp" alt="" fetchPriority="high" />
      </div>

      <div className={styles.gardenLights} aria-hidden="true">
        <span className={styles.gardenGlow} />
        <span className={styles.gardenGlow} />
        {Array.from({ length: 18 }, (_, index) => (
          <i key={index} style={{
            "--x": `${(index * 37 + 5) % 96}%`,
            "--y": `${(index * 23 + 11) % 94}%`,
            "--delay": `${-index * 1.25}s`,
          } as CSSProperties} />
        ))}
        {[0, 1].map((index) => (
          <span key={index} className={styles.butterfly}>
            <svg viewBox="0 0 50 40" fill="none">
              <path d="M25 30C6 34 1 8 12 6C19 5 24 17 25 25C26 17 31 5 38 6C49 8 44 34 25 30ZM25 28C7 25 9 43 21 35L25 30L29 35C41 43 43 25 25 28Z" fill="currentColor" fillOpacity=".25" stroke="currentColor" strokeWidth=".7" />
              <path d="M25 33V19M25 20L21 15M25 20L29 15" stroke="currentColor" strokeWidth="1" />
            </svg>
          </span>
        ))}
      </div>

      <div className={styles.welcomeTop}>
        <span>A CELEBRATION OF LOVE</span>
        <span>{details.weddingDate.slice(0, 4)}</span>
      </div>
      <div className={styles.welcomeCopy}>
        <span className={styles.eyebrow}>YOU ARE INVITED</span>
        <h1 className={styles.welcomeAccessibleTitle}>
          The wedding of {details.brideName} and {details.groomName}
        </h1>
        <span className={styles.welcomeOrnament} aria-hidden="true">✧</span>
      </div>

      <button type="button" className={styles.envelope} data-opening={opening} disabled={opening} onClick={onOpen} aria-label="Open your wedding invitation">
        <span className={styles.envelopeLetter}>
          <span>THE WEDDING OF</span>
          <strong>{details.brideName}<i>&amp;</i>{details.groomName}</strong>
          <small>{formatDateLong(details.weddingDate)}</small>
        </span>
        <span className={styles.envelopePocket} />
        <span className={styles.envelopeFlap} />
        <img className={styles.envelopeArtwork} src="/assets/premium/rose-envelope.webp" alt="" aria-hidden="true" fetchPriority="high" />
      </button>

      <button type="button" className={styles.openLink} disabled={opening} onClick={onOpen}>
        {opening ? "Opening your next chapter…" : "TAP TO OPEN"}
        <ArrowDown size={13} />
      </button>
      <div className={styles.welcomePersonalCard}>
        <div className={styles.welcomeRecipient}>
          <span>WITH LOVE, ESPECIALLY FOR</span>
          <strong>{guestName || "our favourite people"}</strong>
        </div>
        <p className={styles.welcomeNote}>{details.welcomeMessage}</p>
      </div>
    </section>
  );
}
