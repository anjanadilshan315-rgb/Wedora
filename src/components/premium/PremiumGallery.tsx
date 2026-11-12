"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import styles from "./PremiumInvitation.module.css";

export default function PremiumGallery({ title, photos, motion }: { title: string; photos: string[]; motion: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!motion || reduced || paused || photos.length < 2) return;
    const timer = setInterval(() => setIndex((n) => (n + 1) % photos.length), 5000);
    return () => clearInterval(timer);
  }, [motion, reduced, paused, photos.length]);
  const current = index % Math.max(1, photos.length);
  if (!photos.length) return null;
  return <section className={styles.gallery} aria-label={title}>
    <div className={styles.sectionHeading}><span>COLLECTED WITH LOVE</span><h2>{title}</h2><i /></div>
    <div className={styles.galleryGrid}>
      <figure className={styles.featuredPhoto}><img key={photos[current]} src={photos[current]} alt={`${title}, photograph ${current + 1}`} loading="lazy" /><figcaption>A memory worth keeping · {String(current + 1).padStart(2, "0")}</figcaption></figure>
      <div className={styles.photoThumbnails}>{photos.map((photo, n) => <button key={n} type="button" aria-label={`${title}: photo ${n + 1}`} aria-pressed={current === n} onClick={() => { setIndex(n); setPaused(true); }}><img src={photo} alt={`Memory ${n + 1}`} loading="lazy" /><span>0{n + 1}</span></button>)}</div>
    </div>
    <div className={styles.galleryControls}>
      <button type="button" aria-label={`${title}: previous photo`} onClick={() => { setIndex((current - 1 + photos.length) % photos.length); setPaused(true); }}><ArrowLeft size={17} /></button>
      <button type="button" disabled={!motion || reduced || photos.length < 2} aria-label={`${title}: ${paused ? "play" : "pause"} slideshow`} onClick={() => setPaused(!paused)}>{paused || reduced || !motion ? <Play size={14} /> : <Pause size={14} />}</button>
      <button type="button" aria-label={`${title}: next photo`} onClick={() => { setIndex((current + 1) % photos.length); setPaused(true); }}><ArrowRight size={17} /></button>
    </div>
  </section>;
}
