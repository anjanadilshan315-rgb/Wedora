"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Heart, Pause, Play } from "lucide-react";
import styles from "./MemoryGallery.module.css";

export default function MemoryGallery({ photos, active, motion, sample }: { photos: string[]; active: boolean; motion: boolean; sample: boolean }) {
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!active || !playing || !motion || photos.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setSlide((current) => (current + 1) % photos.length), 5500);
    return () => clearInterval(timer);
  }, [active, playing, motion, photos.length]);
  if (!photos.length) return null;
  const current = slide % photos.length;
  const captions = ["the sweetest little moments", "a little closer, always", "all the love in between", "a day to hold on to"];
  function side(offset: number) {
    const index = (current + offset) % photos.length;
    return <button type="button" className={styles.sideFrame} aria-label={`View photograph ${index + 1}`} onClick={() => setSlide(index)}><span className={styles.corner} /><span className={styles.sideImage}><img key={photos[index]} src={photos[index]} alt={`A little moment together, photograph ${index + 1}`} loading="lazy" /></span><span className={styles.sideCaption}>{captions[index % captions.length]}</span><Heart size={11} strokeWidth={1} /></button>;
  }
  return <div className={styles.memory} data-motion={motion ? "on" : "off"}>
    <div className={styles.hearts} aria-hidden="true">{Array.from({ length: 24 }, (_, index) => <span key={index} style={{ "--x": `${(index * 29 + 5) % 96}%`, "--duration": `${7 + index % 5}s`, "--delay": `${-index * .85}s` } as CSSProperties}><Heart size={index % 2 ? 16 : 24} strokeWidth={.8} fill={index % 4 === 0 ? "currentColor" : "none"} /></span>)}</div>
    <div className={styles.intro}><span>COLLECTING MOMENTS, KEEPING THEM FOREVER</span><p>A few little pieces of our love story.</p></div>
    <div className={styles.frames} data-count={Math.min(photos.length, 3)}>
      {photos.length > 1 && <div className={styles.left}>{side(1)}</div>}
      <figure className={styles.mainFrame}><span className={styles.tape} aria-hidden="true" /><div className={styles.imageWindow}>{photos.map((photo, index) => <img key={`${index}-${photo.slice(-20)}`} src={photo} alt={`Our love story, photograph ${index + 1}`} className={index === current ? styles.active : ""} aria-hidden={index !== current} loading="lazy" />)}<span className={styles.counter}>{String(current + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span></div><figcaption><span>Every picture, a little more us.</span><Heart size={15} strokeWidth={1} /></figcaption></figure>
      {photos.length > 2 && <div className={styles.right}>{side(2)}</div>}
    </div>
    <div className={styles.controls}><button type="button" aria-label="Previous photo" onClick={() => setSlide((current + photos.length - 1) % photos.length)}><ChevronLeft size={17} /></button><div className={styles.dots} aria-label="Choose a gallery photograph">{photos.map((_, index) => <button key={index} type="button" aria-label={`Show photograph ${index + 1}`} aria-pressed={index === current} style={{ "--delay": `${index * .1}s` } as CSSProperties} onClick={() => setSlide(index)} />)}</div><button type="button" aria-label={playing ? "Pause slideshow" : "Play slideshow"} aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={13} /> : <Play size={13} />}</button><button type="button" aria-label="Next photo" onClick={() => setSlide((current + 1) % photos.length)}><ChevronRight size={17} /></button></div>
    {sample && <p className={styles.sample}>Sample photographs · Your own memories will appear here.</p>}
  </div>;
}
