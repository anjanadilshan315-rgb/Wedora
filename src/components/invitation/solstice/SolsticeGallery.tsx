"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import styles from "./Solstice.module.css";

export default function SolsticeGallery({ photos, active, motion, sample }: { photos: string[]; active: boolean; motion: boolean; sample: boolean }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);
  const captions = ["The beginning of everything.", "A little wild. A lot of love.", "All the good things, together.", "Our favourite place is us."];
  function show(index: number) {
    const next = (index + photos.length) % photos.length;
    setSelected(next);
  }
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!active || !playing || !motion || photos.length < 2 || preference.matches) return;
    const interval = setInterval(() => show(selected + 1), 5000);
    return () => clearInterval(interval);
    // Each selected image starts the next five-second interval.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, active, playing, motion, photos.length]);
  const current = selected % Math.max(1, photos.length);
  return <div className={styles.memorySpread}>
    <div className={styles.memoryPortrait}>
      <div className={styles.memoryPhotoWindow}>
        {photos.map((photo, index) => <img key={photo} src={photo} alt={`Our story, photograph ${index + 1}`} className={index === current ? styles.selectedMemory : ""} aria-hidden={index !== current} loading="lazy" />)}
        <span className={styles.memoryEdition}>THE FOREVER COLLECTION</span>
      </div>
      <span className={styles.memoryNumber}>{String(current + 1).padStart(2, "0")}<i> / {String(photos.length).padStart(2, "0")}</i></span>
      <span className={styles.memorySideNote}>THE MOMENTS THAT MADE US</span>
    </div>
    <div className={styles.memoryEditorial}>
      <span className={styles.memoryLabel}>SOME THINGS ARE WORTH KEEPING</span>
      <h3>A thousand little moments.<br /><em>One beautiful us.</em></h3>
      <p className={styles.memoryQuote} key={current}>{captions[current % captions.length]}</p>
      <p className={styles.memoryDescription}>The quiet glances, the unplanned adventures, the everyday kind of magic. This is a little of our story.</p>
      <div className={styles.memoryThumbnails} aria-label="Choose a photograph">
        {photos.map((photo, index) => <button type="button" key={photo} onClick={() => show(index)} aria-label={`Show photograph ${index + 1}`} aria-pressed={index === current}><img src={photo} alt="" loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span></button>)}
      </div>
      <div className={styles.memoryNavigation}>
        <button type="button" aria-label="Previous photo" onClick={() => show(current - 1)}><ArrowLeft size={17} /></button>
        <span>A LITTLE MORE OF OUR STORY</span>
        <button type="button" aria-label={playing ? "Pause slideshow" : "Play slideshow"} aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={14} /> : <Play size={14} />}</button>
        <button type="button" aria-label="Next photo" onClick={() => show(current + 1)}><ArrowRight size={17} /></button>
      </div>
      {sample && <p className={styles.fine}>Sample photographs. Your own memories will appear here.</p>}
    </div>
  </div>;
}
