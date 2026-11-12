"use client";

/* Moonlit's visual entrance. The Standard component owns guest data and audio. */
/* eslint-disable @next/next/no-img-element */
import { useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowUpRight, Moon, Pause, Play } from "lucide-react";
import type { StandardInvitationDetails } from "@/lib/standard-invitation";
import { formatDateLong } from "../format";
import styles from "./Moonlit.module.css";
import hero from "./MoonlitHero.module.css";
import MoonlitEntrance from "./MoonlitEntrance";

type CoverProps = { details: StandardInvitationDetails; photos: string[] };
export function MoonlitStars() {
  return <div className={styles.stars} aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <span key={index} style={{ "--x": `${(index * 37 + 9) % 98}%`, "--y": `${(index * 19 + 4) % 95}%`, "--delay": `${-index * .6}s` } as CSSProperties} />)}<i /></div>;
}

export function MoonlitWelcome(props: CoverProps & { guestName?: string | null; opening: boolean; onOpen: () => void }) {
  return <MoonlitEntrance {...props} />;
}
export function MoonlitHero({ details, photos, onMediaError }: CoverProps & { onMediaError: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  function toggleVideo() {
    if (!video.current) return;
    if (paused) void video.current.play().then(() => setPaused(false)).catch(onMediaError);
    else { video.current.pause(); setPaused(true); }
  }

  return (
    <section id="standard-home" className={hero.hero}>
      <MoonlitStars />
      <div className={hero.copy}>
        <div className={hero.flourish} aria-hidden="true"><span /><Moon size={23} strokeWidth={.8} /><span /></div>
        <p className={hero.eyebrow}>TOGETHER WITH OUR FAMILIES</p>
        <h1><span>{details.brideName}</span><i>&amp;</i><span>{details.groomName}</span></h1>
        <p className={hero.note}>Under the same sky.<br /><em>At the start of our always.</em></p>
        <a className={hero.rsvp} href="#standard-rsvp">Celebrate with us <ArrowUpRight size={16} /></a>
        <a className={hero.explore} href="#standard-story">DISCOVER OUR STORY <ArrowDown size={13} /></a>
      </div>

      <div className={hero.portraitStage}>
        <span className={hero.outline} aria-hidden="true" />
        <div className={hero.portrait}>
          {details.backgroundVideoUrl ? (
            <video ref={video} src={details.backgroundVideoUrl} poster={photos[0]} muted autoPlay playsInline loop onError={onMediaError} />
          ) : photos[0] ? (
            <img src={photos[0]} alt={`${details.brideName} and ${details.groomName}, the wedding evening`} fetchPriority="high" />
          ) : (
            <div className={hero.placeholder}><Moon size={80} strokeWidth={.5} /></div>
          )}
          <span className={hero.photoCaption}>A LOVE LIKE THIS, A LIFETIME TO GO.</span>
          {details.backgroundVideoUrl && (
            <button type="button" className={hero.videoControl} aria-label={paused ? "Play background video" : "Pause background video"} onClick={toggleVideo}>
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
          )}
        </div>
        <div className={hero.dateCard}>
          <span>MEET US IN THIS MOMENT</span>
          <strong>{formatDateLong(details.weddingDate)}</strong>
          <small>{details.venueName}</small>
        </div>
        <span className={hero.sideNote}>THE MOONLIT WEDDING COLLECTION</span>
      </div>
    </section>
  );
}
