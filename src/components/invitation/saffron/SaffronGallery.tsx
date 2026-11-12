"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import styles from "./Saffron.module.css";

// Change these two values to give the photo journal a different pace or voice.
const SLIDE_INTERVAL = 5200;
const CAPTIONS = ["The everyday, made extraordinary.", "A little closer to our forever.", "The details we want to remember.", "Life looks better together."];

export default function SaffronGallery({ photos, active, motion, sample }: { photos: string[]; active: boolean; motion: boolean; sample: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update(); preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!active || !motion || reducedMotion || paused || photos.length < 2) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % photos.length), SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [active, motion, reducedMotion, paused, photos.length]);
  const current = index % Math.max(1, photos.length);
  function move(direction: number) {
    setPaused(true);
    setIndex((current + direction + photos.length) % photos.length);
  }
  if (!photos.length) return null;
  const autoplayPaused = paused || reducedMotion || !motion;

  return (
    <div className={styles.journal}>
      <div className={styles.journalRail}>
        {photos.map((source, photoIndex) => (
          <button
            key={`${source}-${photoIndex}`}
            type="button"
            onClick={() => { setIndex(photoIndex); setPaused(true); }}
            aria-label={`Show memory ${photoIndex + 1}`}
            aria-pressed={current === photoIndex}
          >
            <span>0{photoIndex + 1}</span>
            <img src={source} alt={`Photo journal memory ${photoIndex + 1}`} loading="lazy" />
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>

      <figure className={styles.journalFeature}>
        <div className={styles.journalImage}>
          <img key={photos[current]} src={photos[current]} alt={`Our photo journal, memory ${current + 1}`} loading="lazy" />
        </div>
        <figcaption>
          <span>FIELD NOTES / 0{current + 1}</span>
          <p>{CAPTIONS[current % CAPTIONS.length]}</p>
          <small>{sample ? "Sample photographs · Your photos belong here" : "OUR LITTLE COLLECTION OF HAPPY"}</small>
        </figcaption>
      </figure>

      <div className={styles.journalControls}>
        <p>COLLECT MOMENTS. KEEP THEM CLOSE.</p>
        <div>
          <button type="button" aria-label="Previous memory" onClick={() => move(-1)}>
            <ArrowLeft size={17} />
          </button>
          <button
            type="button"
            aria-label={autoplayPaused ? "Play photo slideshow" : "Pause photo slideshow"}
            disabled={reducedMotion || !motion || photos.length < 2}
            onClick={() => setPaused(!paused)}
          >
            {autoplayPaused ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button type="button" aria-label="Next memory" onClick={() => move(1)}>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
