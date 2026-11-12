"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, MoveRight, Pause, Play } from "lucide-react";
import type { StandardInvitationDetails } from "@/lib/standard-invitation";
import { formatDateLong } from "../format";
import styles from "./Saffron.module.css";

type CoverProps = { details: StandardInvitationDetails; photos: string[] };

/** Decorative paper confetti uses deterministic positions, so hydration stays stable. */
export function SaffronConfetti({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: 32 }, (_, index) => (
        <i key={index} style={{
          "--x": `${(index * 37 + 3) % 98}%`,
          "--y": `${(index * 23 + 7) % 96}%`,
          "--delay": `${-index * 1.7}s`,
          "--duration": `${12 + index % 7}s`,
        } as CSSProperties} />
      ))}
    </div>
  );
}

export function SaffronWelcome({ details, photos, guestName, opening, onOpen }: CoverProps & { guestName?: string | null; opening: boolean; onOpen: () => void }) {
  return (
    <section className={styles.welcome} data-opening={opening} aria-label="Personal wedding invitation">
      <div className={styles.welcomeHeading}>
        <span className={styles.edition}>THE GOOD THINGS / WEDDING EDITION</span>
        <span>EST. {details.weddingDate.slice(0, 4)}</span>
      </div>
      <div className={styles.welcomeGrid}>
        <div className={styles.intro}>
          <p className={styles.kicker}>A DAY FOR OUR FAVOURITE PEOPLE</p>
          <h1>Big love.<br />Good company.<br /><em>You, included.</em></h1>
          <p>{details.welcomeMessage}</p>
          <div className={styles.guest}>
            DELIVERED WITH LOVE TO
            <strong>{guestName || "our favourite people"}</strong>
          </div>
          <button
            type="button"
            disabled={opening}
            className={styles.openButton}
            aria-label="Open your wedding invitation"
            onClick={onOpen}
          >
            {opening ? "Your story is opening..." : "A little something for you"}
            <MoveRight size={20} />
          </button>
        </div>

        {/* Both the envelope and the text button open the same invitation. */}
        <button type="button" disabled={opening} className={styles.mailer} onClick={onOpen} aria-label="Open the Saffron envelope">
          <span className={styles.letter}>
            {photos[0] && <img src={photos[0]} alt="A glimpse of our love story" fetchPriority="high" />}
            <span className={styles.letterNames}>{details.brideName}<i>&amp;</i>{details.groomName}</span>
            <small>{formatDateLong(details.weddingDate)}</small>
          </span>
          <span className={styles.sleeve}>
            <span className={styles.sleeveTop}>A VERY SPECIAL DELIVERY <ArrowUpRight size={22} /></span>
            <span className={styles.postmark}>SAVE<br />THE<br />DATE</span>
            <span className={styles.sleeveBottom}>OPEN FOR SOMETHING WONDERFUL <ArrowUpRight size={18} /></span>
          </span>
          <span className={styles.pullTab}>PULL INTO OUR NEXT CHAPTER <ArrowUpRight size={14} /></span>
        </button>
      </div>
      <div className={styles.welcomeBottom}>
        <span>{details.brideName} &amp; {details.groomName}</span>
        <span>AN INVITATION, MADE WITH FEELING.</span>
        <span>01 / THE BEGINNING</span>
      </div>
    </section>
  );
}

export function SaffronHero({ details, photos, onMediaError }: CoverProps & { onMediaError: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  function toggleVideo() {
    if (!video.current) return;
    if (paused) {
      void video.current.play().then(() => setPaused(false)).catch(onMediaError);
    } else {
      video.current.pause();
      setPaused(true);
    }
  }

  return (
    <section id="standard-home" className={styles.hero}>
      <div className={styles.heroHeadline}>
        <p className={styles.kicker}>TOGETHER WITH OUR FAMILIES / YOU ARE INVITED</p>
        <h1><span>{details.brideName}</span><i>&amp;</i><span>{details.groomName}</span></h1>
        <div className={styles.heroInfo}>
          <p>A day for the<br /><em>good things.</em></p>
          <a href="#standard-rsvp">Count me in <ArrowUpRight size={19} /></a>
        </div>
      </div>

      <div className={styles.heroPhoto}>
        {details.backgroundVideoUrl ? (
          <video ref={video} src={details.backgroundVideoUrl} poster={photos[0]} muted loop playsInline autoPlay onError={onMediaError} />
        ) : photos[0] ? (
          <img src={photos[0]} alt={`${details.brideName} and ${details.groomName}`} fetchPriority="high" />
        ) : (
          <div className={styles.placeholder}>{details.brideName[0]} + {details.groomName[0]}</div>
        )}
        <span className={styles.photoLabel}>THE NEXT CHAPTER LOOKS GOOD ON US.</span>
        {details.backgroundVideoUrl && (
          <button className={styles.videoControl} type="button" aria-label={paused ? "Play background video" : "Pause background video"} onClick={toggleVideo}>
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        )}
      </div>

      <div className={styles.dateStrip}>
        <span>THE DATE<strong>{formatDateLong(details.weddingDate)}</strong></span>
        <span>THE PLACE<strong>{details.venueName}</strong></span>
        <a href="#standard-story">OUR STORY <ArrowDown size={18} /></a>
      </div>
    </section>
  );
}
