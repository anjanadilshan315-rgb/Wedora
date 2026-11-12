import { ArrowUpRight, Heart } from "lucide-react";
import type { PremiumDetails } from "@/lib/premium-invitation";
import { formatDateLong } from "../../invitation/format";
import EvermoreVideo from "./EvermoreVideo";
import styles from "./Evermore.module.css";

export default function EvermoreWelcome({
  details,
  guestName,
  opening,
  motion,
  onOpen,
}: {
  details: PremiumDetails;
  guestName?: string | null;
  opening: boolean;
  motion: boolean;
  onOpen: () => void;
}) {
  return (
    <section
      className={styles.welcome}
      data-opening={opening}
      data-effect={details.opening}
      aria-label="Your personal wedding invitation"
    >
      <EvermoreVideo
        label="opening wedding film"
        motion={motion}
        className={styles.welcomeFilm}
      />
      <div className={styles.welcomeShade} aria-hidden="true" />
      <div className={styles.welcomeTop}>
        <span>A LITTLE FILM. A LIFETIME OF LOVE.</span>
        <span>{formatDateLong(details.weddingDate)}</span>
      </div>
      <div className={styles.welcomeCopy}>
        <span className={styles.welcomeKicker}>
          <Heart size={13} strokeWidth={1} /> AN INVITATION TO OUR FOREVER
        </span>
        <h1>
          {details.brideName}
          <i>&amp;</i>
          {details.groomName}
        </h1>
        <p>{details.welcomeMessage}</p>
        <div className={styles.welcomeBottom}>
          <div>
            <span>ESPECIALLY FOR</span>
            <strong>{guestName || "our favourite people"}</strong>
          </div>
          <button
            type="button"
            aria-label="Open your wedding invitation"
            disabled={opening}
            onClick={onOpen}
          >
            {opening ? "Our story is unfolding…" : "Open invitation"}
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
      <div className={styles.openingVeil} aria-hidden="true" />
    </section>
  );
}
