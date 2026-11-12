"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, Sparkles } from "lucide-react";
import styles from "./AfterglowGallery.module.css";

// Edit these lines to change the gallery story. Photo controls stay below.
const CAPTIONS = [
  "The world got quieter when we found each other.",
  "Some moments need no words.",
  "A little wonder. A lot of us.",
  "And all at once, everything made sense.",
];
const SLIDE_INTERVAL_MS = 5500;

type GalleryProps = { photos: string[]; active: boolean; motion: boolean; sample: boolean };

export default function MoonlitGallery({ photos, active, motion, sample }: GalleryProps) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);
  const current = selected % Math.max(1, photos.length);

  // Listen for a preference change as well as checking it on the first render.
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    function refreshAutoplay() {
      clearInterval(timer);
      if (active && playing && motion && photos.length > 1 && !preference.matches) {
        timer = setInterval(() => setSelected((index) => (index + 1) % photos.length), SLIDE_INTERVAL_MS);
      }
    }
    refreshAutoplay();
    preference.addEventListener("change", refreshAutoplay);
    return () => {
      clearInterval(timer);
      preference.removeEventListener("change", refreshAutoplay);
    };
  }, [active, playing, motion, photos.length]);

  function goTo(index: number) { setSelected((index + photos.length) % photos.length); }
  if (!photos.length) return null;

  return <div className={styles.gallery} data-motion={motion ? "on" : "off"}>
    <div className={styles.galleryNote}><Sparkles size={14} strokeWidth={1} /><span>A FEW MOMENTS. ALL THE FEELINGS.</span></div>
    <div className={styles.photoStage}>
      <span className={styles.orbitLine} aria-hidden="true" />
      <span className={styles.glow} aria-hidden="true" />
      <div className={styles.photograph}>
        {photos.map((photo, index) => <img
          key={`${index}-${photo.slice(-12)}`}
          src={photo}
          alt={`A little afterglow, photograph ${index + 1}`}
          className={index === current ? styles.activePhoto : ""}
          aria-hidden={index !== current}
          loading="lazy"
        />)}
        <div className={styles.photoShade} />
        <span className={styles.edition}>THE MOMENTS WE KEEP</span>
        <span className={styles.photoIndex}>{String(current + 1).padStart(2, "0")}<i> / {String(photos.length).padStart(2, "0")}</i></span>
        <div className={styles.caption} key={current}><span>OUR LITTLE FOREVERS</span><p>{CAPTIONS[current % CAPTIONS.length]}</p></div>
      </div>
      <div className={styles.thumbnailTray} aria-label="Choose a gallery photograph">
        {photos.map((photo, index) => <button
          key={index}
          type="button"
          aria-label={`Show photograph ${index + 1}`}
          aria-pressed={index === current}
          onClick={() => goTo(index)}
        ><img src={photo} alt="" loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span></button>)}
      </div>
      <span className={styles.floatingStar} aria-hidden="true">✧</span>
      <span className={styles.floatingStar} aria-hidden="true">✧</span>
    </div>
    <div className={styles.controls}>
      <button type="button" aria-label="Previous photo" onClick={() => goTo(current - 1)}><ArrowLeft size={17} /><span>Previous moment</span></button>
      <button type="button" aria-label={playing ? "Pause slideshow" : "Play slideshow"} aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={14} /> : <Play size={14} />}<span>{playing ? "Pause the story" : "Play the story"}</span></button>
      <button type="button" aria-label="Next photo" onClick={() => goTo(current + 1)}><span>Next moment</span><ArrowRight size={17} /></button>
    </div>
    {sample && <p className={styles.sample}>Sample photographs. Your own memories will take their place.</p>}
  </div>;
}