"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import styles from "./Evermore.module.css";

const CHAPTERS = [
  ["Once upon a time", "It began with a simple hello."],
  ["Every road led to you", "A thousand little moments brought us here."],
  ["And now, forever", "Love, laughter, and a little magic."],
];
export default function EvermoreGallery({
  title,
  photos,
  motion,
  story = false,
}: {
  title: string;
  photos: string[];
  motion: boolean;
  story?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (story || !motion || reduced || paused || photos.length < 2) return;
    const timer = setInterval(
      () => setIndex((n) => (n + 1) % photos.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [story, motion, reduced, paused, photos.length]);
  if (!photos.length) return null;
  const current = index % photos.length;
  return (
    <section
      className={story ? styles.photoStory : styles.keepsakes}
      aria-label={title}
    >
      <div className={styles.sectionHeading} data-evermore-reveal>
        <span>
          {story ? "THE LITTLE MOMENTS THAT MADE US" : "COLLECTED WITH LOVE"}
        </span>
        <h2>{title}</h2>
      </div>
      {story ? (
        <div className={styles.storyRows}>
          {photos.map((photo, n) => (
            <figure
              key={`${photo}-${n}`}
              className={styles.storyCard}
              data-evermore-reveal
            >
              <img
                src={photo}
                alt={`${title}, chapter ${n + 1}`}
                loading="lazy"
                style={{
                  objectPosition: photo.endsWith("/first-kiss.jpg")
                    ? "center 82%"
                    : "center 35%",
                }}
              />
              <figcaption>
                <span>0{n + 1} / OUR STORY</span>
                <strong>{CHAPTERS[n % CHAPTERS.length][0]}</strong>
                <p>{CHAPTERS[n % CHAPTERS.length][1]}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <>
          <figure className={styles.keepsakeLead}>
            <img
              key={photos[current]}
              src={photos[current]}
              alt={`${title}, photograph ${current + 1}`}
              loading="lazy"
            />
            <figcaption>
              A moment we will always come back to · 0{current + 1}
            </figcaption>
          </figure>
          <div className={styles.keepsakeThumbnails}>
            {photos.map((photo, n) => (
              <button
                key={n}
                type="button"
                aria-label={`${title}: photo ${n + 1}`}
                aria-pressed={current === n}
                onClick={() => {
                  setIndex(n);
                  setPaused(true);
                }}
              >
                <img src={photo} alt={`Memory ${n + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
          <div className={styles.galleryControls}>
            <button
              type="button"
              aria-label={`${title}: previous photo`}
              onClick={() => {
                setIndex((current - 1 + photos.length) % photos.length);
                setPaused(true);
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              disabled={!motion || reduced || photos.length < 2}
              aria-label={`${title}: ${paused ? "play" : "pause"} slideshow`}
              onClick={() => setPaused(!paused)}
            >
              {paused || reduced || !motion ? (
                <Play size={14} />
              ) : (
                <Pause size={14} />
              )}
            </button>
            <button
              type="button"
              aria-label={`${title}: next photo`}
              onClick={() => {
                setIndex((current + 1) % photos.length);
                setPaused(true);
              }}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
