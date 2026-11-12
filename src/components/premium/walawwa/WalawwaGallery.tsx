"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import styles from "./Walawwa.module.css";

export default function WalawwaGallery({ title, photos, motion, variant = "arch" }: { title: string; photos: string[]; motion: boolean; variant?: "arch" | "album" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => { const media = matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReduced(media.matches); update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []);
  useEffect(() => { if (!motion || reduced || paused || photos.length < 2) return; const timer = setInterval(() => setIndex(n => (n + 1) % photos.length), 5000); return () => clearInterval(timer); }, [motion, reduced, paused, photos.length]);
  useEffect(() => { const container = track.current; const card = container?.children[index] as HTMLElement | undefined; if (container && card) container.scrollTo({ left: card.offsetLeft - container.offsetLeft - (container.clientWidth - card.clientWidth) / 2, behavior: reduced ? "instant" : "smooth" }); }, [index, reduced]);
  if (!photos.length) return null;
  const current = index % photos.length;
  return <section className={variant === "album" ? `${styles.gallery} ${styles.storyAlbum}` : styles.gallery} aria-label={title} data-gallery-style={variant}><div className={styles.sectionHeading}><span>{variant === "album" ? "THE IN-BETWEEN, KEPT FOREVER" : "CHAPTERS OF US"}</span><h2>{title}</h2><i /></div>
    {variant === "album" ? <div className={styles.albumSpread}>
      <figure className={styles.albumLead}><img key={photos[current]} src={photos[current]} alt={`${title}, memory ${current+1}`} loading="lazy" /><figcaption><span>OUR PHOTO JOURNAL</span><strong>A little moment.<br /><em>A lifetime of meaning.</em></strong><span>{String(current+1).padStart(2,"0")} / {String(photos.length).padStart(2,"0")}</span></figcaption></figure>
      <div className={styles.albumRail} aria-label={`${title}: choose a photo`}>{photos.map((photo,n) => <button type="button" key={`${photo}-${n}`} aria-label={`${title}: photo ${n+1}`} aria-pressed={current === n} onClick={() => { setIndex(n); setPaused(true); }}><img src={photo} alt={`Wedding memory ${n+1}`} loading="lazy" /><span>0{n+1}</span></button>)}</div>
    </div> : <div ref={track} className={styles.archTrack} onPointerDown={() => setPaused(true)} onFocus={() => setPaused(true)}>{photos.map((photo,n) => <figure key={`${photo}-${n}`} className={styles.archPhoto} data-active={n === current}><img src={photo} alt={`${title}, memory ${n+1}`} loading="lazy" /><figcaption>A moment, forever kept · 0{n+1}</figcaption></figure>)}</div>}
    <div className={styles.galleryControls}><button type="button" aria-label={`${title}: previous photo`} onClick={() => { setIndex((index - 1 + photos.length) % photos.length); setPaused(true); }}><ArrowLeft size={17} /></button><button type="button" disabled={!motion || reduced || photos.length < 2} aria-label={`${title}: ${paused ? "play" : "pause"} slideshow`} onClick={() => setPaused(!paused)}>{paused || reduced || !motion ? <Play size={14} /> : <Pause size={14} />}</button><button type="button" aria-label={`${title}: next photo`} onClick={() => { setIndex((index + 1) % photos.length); setPaused(true); }}><ArrowRight size={17} /></button></div>
  </section>;
}
