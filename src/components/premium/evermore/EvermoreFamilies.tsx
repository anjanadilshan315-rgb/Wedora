/* eslint-disable @next/next/no-img-element */
import type { PremiumDetails } from "@/lib/premium-invitation";
import styles from "./Evermore.module.css";

export default function EvermoreFamilies({
  details,
  photo,
  guestName,
}: {
  details: PremiumDetails;
  photo: string;
  guestName?: string | null;
}) {
  return (
    <section className={styles.familySection} id="premium-story">
      <div className={styles.inviteNote} data-evermore-reveal>
        <span className={styles.eyebrow}>TOGETHER WITH OUR FAMILIES</span>
        <h2>
          You are cordially invited
          <br />
          <em>to celebrate our union.</em>
        </h2>
        <p>{details.greetingMessage}</p>
        {photo && (
          <img
            src={photo}
            alt={`${details.brideName} and ${details.groomName}, wedding inspiration`}
          />
        )}
      </div>
      <div className={styles.familyCards} data-evermore-reveal>
        <div>
          <span>{details.brideParents}</span>
          <h3>{details.brideName}</h3>
        </div>
        <i>&amp;</i>
        <div>
          <span>{details.groomParents}</span>
          <h3>{details.groomName}</h3>
        </div>
      </div>
      {guestName && (
        <p className={styles.guestNote}>
          Dear {guestName}, we have saved a little place in our forever for you.
        </p>
      )}
    </section>
  );
}
