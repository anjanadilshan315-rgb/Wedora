"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import styles from "./Aureline.module.css";

const INTERVAL_MS = 5200;
export default function AurelineGallery({ title, photos, motion }: { title: string; photos: string[]; motion: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!motion || reduced || paused || photos.length < 2) return;
    const timer = setInterval(() => setIndex((n) => (n + 1) % photos.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [motion, reduced, paused, photos.length]);
  if (!photos.length) return null;
  const current = index % photos.length;
  function move(direction: number) { setPaused(true); setIndex((current + direction + photos.length) % photos.length); }
  return <section className={styles.mosaicSection} aria-label={title}>
    <div className={styles.mosaicHeading}>
      <span className={styles.kicker}>THE MOMENTS BETWEEN THE MILESTONES</span>
      <h2>{title}</h2>
      <i>✦</i>
    </div>
    <div className={styles.mosaic}>
      <figure className={styles.mosaicLead}>
        <img key={photos[current]} src={photos[current]} alt={`${title}, photograph ${current + 1}`} loading="lazy" />
        <figcaption>ONE OF OUR FAVOURITE MOMENTS / 0{current + 1}</figcaption>
      </figure>
      <div className={styles.mosaicRail}>{photos.map((photo, n) => <button key={n} type="button" aria-label={`${title}: photo ${n + 1}`} aria-pressed={current === n} onClick={() => { setIndex(n); setPaused(true); }}>
        <img src={photo} alt={`Memory ${n + 1}`} loading="lazy" />
      </button>)}</div>
    </div>
    <div className={styles.mosaicControls}>
      <button type="button" aria-label={`${title}: previous photo`} onClick={() => move(-1)}>
        <ArrowLeft size={16} />
      </button>
      <button type="button" disabled={reduced || !motion || photos.length < 2} aria-label={`${title}: ${paused ? "play" : "pause"} slideshow`} onClick={() => setPaused(!paused)}>{paused || reduced || !motion ? <Play size={14} /> : <Pause size={14} />}</button>
      <button type="button" aria-label={`${title}: next photo`} onClick={() => move(1)}>
        <ArrowRight size={16} />
      </button>
    </div>
  </section>;
}
