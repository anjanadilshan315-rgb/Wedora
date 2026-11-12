"use client";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./Evermore.module.css";

/** Pause decorative footage outside the viewport and respect the guest's motion choice. */
export default function EvermoreVideo({
  label,
  motion,
  source = "/assets/evermore/opening-hands.mp4",
  className = "",
}: {
  label: string;
  motion: boolean;
  source?: string;
  className?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [paused, setPaused] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    setUnavailable(false);
    userPaused.current = false;
  }, [source]);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    function update() {
      if (!motion || preference.matches || !visible || userPaused.current)
        element!.pause();
      else void element!.play().catch(() => setPaused(true));
    }
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        update();
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    preference.addEventListener("change", update);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      element.pause();
    };
  }, [source, motion]);
  return (
    <div className={`${styles.videoPanel} ${className}`}>
      <video
        ref={video}
        src={source}
        poster="/assets/evermore/opening-poster.png"
        muted
        playsInline
        loop
        preload="metadata"
        aria-label={label}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onError={() => {
          setUnavailable(true);
          setPaused(true);
        }}
      />
      <button
        type="button"
        className={styles.videoControl}
        disabled={unavailable}
        aria-label={`${paused ? "Play" : "Pause"} ${label}`}
        onClick={() => {
          if (!video.current) return;
          if (paused) {
            userPaused.current = false;
            void video.current.play().catch(() => setPaused(true));
          } else {
            userPaused.current = true;
            video.current.pause();
          }
        }}
      >
        {paused ? <Play size={14} /> : <Pause size={14} />}
        <span>
          {unavailable
            ? "Video unavailable"
            : paused
              ? "Play film"
              : "Pause film"}
        </span>
      </button>
    </div>
  );
}
