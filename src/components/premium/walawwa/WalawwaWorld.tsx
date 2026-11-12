"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./Walawwa.module.css";

/** The scenery stays behind the page; approaching the reception brings in night. */
export default function WalawwaWorld({ opened, motion, videoUrl, onError }: { opened: boolean; motion: boolean; videoUrl: string; onError: () => void }) {
  const world = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = world.current;
    if (!element) return;
    let frame = 0;
    function update() {
      frame = 0;
      const reception = element!.closest("article")?.querySelector("#premium-night");
      const top = reception?.getBoundingClientRect().top ?? Infinity;
      const progress = Math.max(0, Math.min(1, (innerHeight * .85 - top) / (innerHeight * .65)));
      element!.style.setProperty("--night", String(progress * progress * (3 - 2 * progress)));
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    update(); window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    // Embedded editor previews have their own scrolling container.
    document.addEventListener("scroll", schedule, true);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); document.removeEventListener("scroll", schedule, true); };
  }, [opened]);
  useEffect(() => {
    if (!video.current) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { const stop = !motion || preference.matches; setPaused(stop); if (stop) video.current?.pause(); else void video.current?.play().catch(() => setPaused(true)); };
    update(); preference.addEventListener("change", update); return () => preference.removeEventListener("change", update);
  }, [videoUrl, motion]);
  return <div ref={world} className={styles.world} style={{ "--night": 0 } as CSSProperties}>
    <div className={styles.worldCanvas}>
      <div className={styles.scenery} aria-hidden="true"><img className={styles.dayScene} src="/assets/walawwa/ceremony-floral-day.webp" alt="" /><img className={styles.nightScene} src="/assets/walawwa/garden-moonlight-night.webp" alt="" /><img className={styles.bulbLights} src="/assets/walawwa/night-bulb-lights.svg" alt="" /></div>
      {videoUrl && <><video className={styles.customBackground} ref={video} src={videoUrl} muted playsInline loop poster="/assets/walawwa/ceremony-floral-day.webp" onError={onError} /><button className={styles.backgroundControl} type="button" aria-label={paused ? "Play background video" : "Pause background video"} onClick={() => { if (paused) void video.current?.play().then(() => setPaused(false)).catch(onError); else { video.current?.pause(); setPaused(true); } }}>{paused ? <Play size={16} /> : <Pause size={16} />}</button></>}
      <div className={styles.lanterns} aria-hidden="true">{[8, 24, 41, 60, 78, 92].map((x,n) => <span key={x} style={{ "--x": `${x}%`, "--length": `${60 + n * 17 % 90}px`, "--delay": `${-n * .9}s` } as CSSProperties}><i /><b /></span>)}</div>
      {motion && <div className={styles.atmosphere} aria-hidden="true">
        {Array.from({ length: 30 }, (_,n) => <i className={styles.petal} key={n} style={{ "--x": `${(n * 37 + 7) % 98}%`, "--delay": `${-n * .9}s`, "--duration": `${12 + n % 7}s`, "--size": `${7 + n % 5 * 2}px` } as CSSProperties} />)}
        {Array.from({ length: 20 }, (_,n) => <i className={styles.firefly} key={`light-${n}`} style={{ "--x": `${(n * 29 + 3) % 97}%`, "--y": `${(n * 17) % 95}%`, "--delay": `${-n * 1.2}s` } as CSSProperties} />)}
      </div>}
    </div>
  </div>;
}
