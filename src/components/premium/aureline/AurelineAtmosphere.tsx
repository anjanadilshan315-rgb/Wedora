import type { CSSProperties } from "react";
import styles from "./Aureline.module.css";

// These new accents belong only to Aureline's decorative background.
const EFFECT_COLOURS = ["#9748d6", "#087fb4", "#8aab28"];
const SEED_COUNT = 81;
const SEEDS_PER_BAND = 9;
const GLINT_COUNT = 18;

/** Small rings follow a winding path down the middle of each section. */
export function AurelineSpiralRain() {
  return <div className={styles.spiralRain} aria-hidden="true">
    {Array.from({ length: 27 }, (_, n) => <i key={n} style={{
      "--y": `${Math.floor(n / 3) * 11}%`,
      "--delay": `${-n * 1.7}s`,
      "--duration": `${12 + n % 4}s`,
      "--ring-colour": EFFECT_COLOURS[n % EFFECT_COLOURS.length],
    } as CSSProperties} />)}
  </div>;
}

/** Colourful seed lanterns drift down through the invitation's silk illumination. */
export default function AurelineAtmosphere() {
  return <div className={styles.atmosphere} aria-hidden="true">
    <AurelineSpiralRain />
    <div className={styles.lightBeams}>
      <i />
      <i />
      <i />
    </div>{Array.from({ length: SEED_COUNT }, (_, n) => <span className={styles.seed} key={n} style={{
      "--x": `${(n * 37 + 9) % 97}%`,
      "--y": `${Math.floor(n / SEEDS_PER_BAND) * 11}%`,
      "--delay": `${-n * 1.6}s`,
      "--duration": `${13 + n % 6}s`,
      "--seed-colour": EFFECT_COLOURS[(n + Math.floor(n / 3)) % EFFECT_COLOURS.length],
      "--seed-size": `${15 + n % 4 * 2}px`,
    } as CSSProperties}>
      <i />
    </span>)}
    {Array.from({ length: GLINT_COUNT }, (_, n) => (
      <span className={styles.glint} key={`glint-${n}`} style={{
        "--x": `${n % 2 ? 4 + n * 7 % 18 : 78 + n * 3 % 18}%`,
        "--y": `${Math.floor(n / 2) * 11 + 3}%`,
        "--delay": `${-n * 1.3}s`,
        "--seed-colour": EFFECT_COLOURS[n % EFFECT_COLOURS.length],
      } as CSSProperties} />
    ))}
  </div>;
}
