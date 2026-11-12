/* eslint-disable @next/next/no-img-element */
import { ArrowDown } from "lucide-react";
import type { PremiumDetails } from "@/lib/premium-invitation";
import { formatDateLong } from "../../invitation/format";
import styles from "./Walawwa.module.css";

export default function WalawwaHero({ details }: { details: PremiumDetails }) {
  return <section className={styles.hero} id="premium-home">
    <div className={styles.heroLetter}><span className={styles.eyebrow}>YOU ARE WARMLY INVITED TO THE WEDDING OF</span><h1><span>{details.brideName}</span><i>&amp;</i><span>{details.groomName}</span></h1><strong>{formatDateLong(details.weddingDate)}</strong><p>{details.venueName}</p><a href="#premium-story">Discover the celebration <ArrowDown size={14} /></a></div>
    {details.couplePhoto && <img className={styles.customerPortrait} src={details.couplePhoto} alt={`${details.brideName} and ${details.groomName}`} />}
    <span className={styles.heroFootnote}>ONE DAY. TWO FAMILIES. A LIFETIME OF LOVE.</span>
  </section>;
}
