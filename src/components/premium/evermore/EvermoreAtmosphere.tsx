"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./Evermore.module.css";

export default function EvermoreAtmosphere({ opened }: { opened: boolean }) {
  const layer = useRef<HTMLDivElement>(null);
  const particleCount = opened ? 72 : 36;
  const particlesPerBand = opened ? 8 : 4;
  const colours = ["#9b6bb6", "#cc8a63", "#bd6e91"];
  useEffect(() => {
    const root = layer.current?.closest("article");
    if (!root) return;
    const elements = root.querySelectorAll<HTMLElement>(
      "[data-evermore-reveal]",
    );
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealed = "true";
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    const update = () =>
      elements.forEach((element) => {
        element.dataset.revealed =
          preference.matches ||
          element.getBoundingClientRect().top < innerHeight
            ? "true"
            : "false";
        if (!preference.matches) observer.observe(element);
      });
    update();
    preference.addEventListener("change", update);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", update);
      elements.forEach((element) => {
        element.dataset.revealed = "true";
      });
    };
  }, [opened]);
  return (
    <div ref={layer} className={styles.atmosphere} aria-hidden="true">
      <div className={styles.silkGlow} />
      {Array.from({ length: particleCount }, (_, n) => (
        <i
          key={n}
          style={
            {
              "--x": `${(n * 37 + 9) % 98}%`,
              "--y": `${Math.floor(n / particlesPerBand) * 11}%`,
              "--delay": `${-n * 1.6}s`,
              "--duration": `${15 + (n % 6)}s`,
              "--particle-colour": colours[n % colours.length],
              "--particle-size": `${10 + (n % 4) * 2}px`,
            } as CSSProperties
          }
        />
      ))}
      {opened &&
        Array.from({ length: 27 }, (_, n) => (
          <span
            key={`sparkle-${n}`}
            className={styles.sparkle}
            style={
              {
                "--x": `${n % 2 ? 7 + ((n * 3) % 18) : 78 + ((n * 5) % 16)}%`,
                "--y": `${Math.floor(n / 3) * 11 + 4}%`,
                "--delay": `${-n * 1.3}s`,
                "--particle-colour": colours[n % colours.length],
              } as CSSProperties
            }
          />
        ))}
    </div>
  );
}
