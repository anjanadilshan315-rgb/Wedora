import type { CSSProperties } from "react";
import styles from "./PremiumFallingPetals.module.css";

// Spread petals through the whole invitation, so decoration continues as guests scroll.
const PETAL_COUNT = 72;
const VERTICAL_BANDS = 9;

export default function PremiumFallingPetals() {
  return (
    <div className={styles.atmosphere} aria-hidden="true">
      {Array.from({ length: PETAL_COUNT }, (_, index) => (
        <span key={index} className={styles.petal} style={{
          "--x": `${(index * 37 + 4) % 97}%`,
          "--y": `${Math.floor(index / (PETAL_COUNT / VERTICAL_BANDS)) * (100 / VERTICAL_BANDS)}%`,
          "--delay": `${-index * 1.73}s`,
          "--duration": `${13 + index % 7}s`,
          "--size": `${10 + index % 5 * 2}px`,
          "--sway": `${index % 2 ? -65 : 65}px`,
        } as CSSProperties}><i /></span>
      ))}
    </div>
  );
}
