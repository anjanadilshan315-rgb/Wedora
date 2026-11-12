import { ArrowUpRight, CalendarDays, MapPin, Moon, Sun } from "lucide-react";
import type { PremiumDetails } from "@/lib/premium-invitation";
import { formatDateLong, formatTime } from "../../invitation/format";
import styles from "./Walawwa.module.css";

function calendarLink(event: PremiumDetails["events"][number], details: PremiumDetails) {
  const start = new Date(`${event.date}T${event.time || "10:30"}:00+05:30`);
  const stamp = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "");
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: `${details.brideName} & ${details.groomName}: ${event.name}`, dates: `${stamp(start)}/${stamp(new Date(start.getTime() + 2 * 3600000))}`, location: `${event.venue}, ${event.address}` })}`;
}
export default function WalawwaEvents({ details }: { details: PremiumDetails }) {
  return <section className={styles.events} id="premium-events" aria-label="Wedding event schedule">
    {details.events.map((event,n) => <article key={event.id} className={styles.eventCard} id={n === 1 ? "premium-night" : undefined} data-evening={n > 0}>
      <div className={styles.eventOrnament}>{n === 0 ? <Sun size={30} strokeWidth={.8} /> : <Moon size={30} strokeWidth={.8} />}</div>
      <span className={styles.eyebrow}>{n === 0 ? "IN THE GOLDEN LIGHT" : "BENEATH A THOUSAND LITTLE LIGHTS"}</span><h2>{event.name}</h2><span className={styles.rule} /><p>{formatDateLong(event.date)}</p><strong className={styles.eventTime}>{formatTime(event.time)}</strong><h3>{event.venue}</h3><p>{event.address}</p><div className={styles.eventActions}><a href={calendarLink(event, details)} target="_blank" rel="noopener noreferrer"><CalendarDays size={14} />Save the date</a><a href={details.mapUrl && n === 0 ? details.mapUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.address}`)}`} target="_blank" rel="noopener noreferrer"><MapPin size={14} />Find your way<ArrowUpRight size={12} /></a></div>
    </article>)}
  </section>;
}
