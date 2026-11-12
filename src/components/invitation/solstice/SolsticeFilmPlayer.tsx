"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { StandardInvitationDetails } from "@/lib/standard-invitation";
import { standardAppearance } from "@/lib/standard-appearance";
import { drawSolsticeVideoFrame } from "@/lib/solstice-video";
import { drawSaffronVideoFrame } from "@/lib/saffron-video";
import { drawPremiumVideoFrame } from "@/lib/premium-video";
import { drawEvermoreVideoFrame } from "@/lib/evermore-video";
import { drawWalawwaVideoFrame } from "@/lib/walawwa-video";
import { drawAurelineVideoFrame } from "@/lib/aureline-video";
import { drawMoonlitVideoFrame } from "@/lib/moonlit-video";
import styles from "./Solstice.module.css";

/** Preview the same postcard artwork used by the downloadable video. */
export default function SolsticeFilmPlayer({ details, photos }: { details: StandardInvitationDetails & { premiumFilm?: boolean; aurelineFilm?: boolean; walawwaFilm?: boolean; evermoreFilm?: boolean }; photos: string[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsed = useRef(0);
  const [images, setImages] = useState<(HTMLImageElement | null)[] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all(photos.map((source) => new Promise<HTMLImageElement | null>((resolve) => {
      const image = new Image(); image.onload = () => resolve(image); image.onerror = () => resolve(null); image.src = source;
    }))).then(async (loaded) => {
      await document.fonts.ready;
      if (!cancelled) { setImages(loaded); setPlaying(!window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
    });
    return () => { cancelled = true; };
    // The player is mounted afresh when the film dialog is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context || !images) return;
    const palette = standardAppearance(details);
    const computed = getComputedStyle(document.documentElement);
    const font = palette.font.family.replace(/var\((--[a-z-]+)\)/g, (_, key: string) => computed.getPropertyValue(key).trim() || "Georgia");
    let frame = 0;
    let previous = performance.now();
    let lastProgress = 0;
    function draw(now: number) {
      if (playing) elapsed.current = Math.min(12000, elapsed.current + now - previous);
      previous = now;
      const image = images!.length ? images![Math.min(images!.length - 1, Math.floor(elapsed.current / (12000 / images!.length)))] : null;
      const drawFrame = details.evermoreFilm ? drawEvermoreVideoFrame : details.walawwaFilm ? drawWalawwaVideoFrame : details.aurelineFilm ? drawAurelineVideoFrame : details.premiumFilm ? drawPremiumVideoFrame : details.standardLayout === "saffron" ? drawSaffronVideoFrame : details.standardLayout === "moonlit" ? drawMoonlitVideoFrame : drawSolsticeVideoFrame;
      drawFrame(context!, details, palette, font, image, elapsed.current);
      if (now - lastProgress > 200 || elapsed.current >= 12000) { setProgress(Math.round(elapsed.current / 120)); lastProgress = now; }
      if (elapsed.current >= 12000) setPlaying(false);
      else if (playing) frame = requestAnimationFrame(draw);
    }
    draw(performance.now());
    return () => cancelAnimationFrame(frame);
  }, [playing, images, details]);

  return <div className={styles.generatedFilm}>
    {!images && <p role="status">Preparing your invitation film…</p>}
    <canvas ref={canvas} width={720} height={1080} className={styles.filmCanvas} aria-label={`Animated wedding invitation for ${details.brideName} and ${details.groomName}`} />
    <div className={styles.generatedFilmControls}><button type="button" disabled={!images} aria-label={progress >= 100 ? "Replay invitation film" : playing ? "Pause invitation film" : "Play invitation film"} onClick={() => { if (progress >= 100) { elapsed.current = 0; setProgress(0); } setPlaying(!playing); }}>{progress >= 100 ? <RotateCcw size={16} /> : playing ? <Pause size={16} /> : <Play size={16} />}</button><progress aria-label="Invitation film progress" max={100} value={progress} /><span>{Math.round(progress * .12)} / 12s · Silent film</span></div>
  </div>;
}
