/* eslint-disable @next/next/no-img-element */
import { ArrowDown } from "lucide-react";
import type { PremiumDetails } from "@/lib/premium-invitation";
import { formatDateLong } from "../../invitation/format";
import EvermoreVideo from "./EvermoreVideo";
import styles from "./Evermore.module.css";

export default function EvermoreHero({
  details,
  motion,
}: {
  details: PremiumDetails;
  motion: boolean;
}) {
  return (
    <section className={styles.hero} id="premium-home">
      <EvermoreVideo
        label="invitation background film"
        motion={motion}
        source={
          details.backgroundVideoUrl || "/assets/evermore/opening-hands.mp4"
        }
        className={styles.heroFilm}
      />
      <img
        className={styles.floralTop}
        src="/assets/evermore/romantic-flower-corner.webp"
        alt=""
      />
      <img
        className={styles.floralBottom}
        src="/assets/evermore/romantic-flower-corner.webp"
        alt=""
      />
      <div className={styles.archCover} data-evermore-reveal>
        <span className={styles.eyebrow}>THE BEGINNING OF ALWAYS</span>
        <h1>
          {details.brideName}
          <i>&amp;</i>
          {details.groomName}
        </h1>
        <span className={styles.archRule} />
        <p>PLEASE JOIN US</p>
        <strong>{formatDateLong(details.weddingDate)}</strong>
      </div>
      <div className={styles.marriedLine} data-evermore-reveal>
        <span>WE ARE</span>
        <strong>Getting married.</strong>
        <a href="#premium-story">
          A little more of our story <ArrowDown size={13} />
        </a>
      </div>
    </section>
  );
}
