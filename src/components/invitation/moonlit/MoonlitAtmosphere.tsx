import type { CSSProperties } from "react";
import styles from "./MoonlitAtmosphere.module.css";

// Adjust these counts to change the decoration density. No JavaScript timers
// are needed: CSS handles the falling movement, shimmer and light trails.
const PETAL_COUNT = 48;
const LIGHT_COUNT = 24;

/** Decoration only: every layer ignores clicks and is hidden from screen readers. */
export default function MoonlitAtmosphere({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <>
    <div className={styles.atmosphere} aria-hidden="true">
    <div className={styles.ribbon} /><div className={styles.ribbon} /><div className={styles.ribbon} />
    {Array.from({ length: LIGHT_COUNT }, (_, index) => <span className={styles.opal} key={index} style={{ "--x": `${(index * 37 + 6) % 96}%`, "--y": `${Math.floor(index / 4) * 16 + 2}%`, "--delay": `${-index * 1.4}s`, "--duration": `${12 + index % 6}s` } as CSSProperties} />)}
    </div>
    <div className={styles.particles} aria-hidden="true">
      {Array.from({ length: PETAL_COUNT }, (_, index) => <span
        className={styles.petal}
        key={index}
        style={{
          "--x": `${(index * 29 + 3) % 97}%`,
          "--y": `${Math.floor(index / 6) * 12}%`,
          "--size": `${10 + index % 4 * 3}px`,
          "--delay": `${-index * 1.65}s`,
          "--duration": `${13 + index % 8}s`,
          "--sway": `${index % 2 ? -35 : 45}px`,
        } as CSSProperties}
      ><i /></span>)}
      {Array.from({ length: 4 }, (_, index) => <span
        className={styles.shootingStar}
        key={`trail-${index}`}
        style={{ "--y": `${index * 24 + 7}%`, "--delay": `${-index * 4.5}s`, "--duration": `${14 + index * 2}s` } as CSSProperties}
      />)}
    </div>
  </>;
}
