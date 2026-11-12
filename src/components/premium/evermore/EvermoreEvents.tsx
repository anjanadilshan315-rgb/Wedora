import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { PremiumDetails } from "@/lib/premium-invitation";
import { formatDateLong, formatTime } from "../../invitation/format";
import styles from "./Evermore.module.css";

export default function EvermoreEvents({
  details,
}: {
  details: PremiumDetails;
}) {
  return (
    <section className={styles.events} id="premium-events">
      <div className={styles.sectionHeading} data-evermore-reveal>
        <span>SAVE A LITTLE SPACE IN YOUR CALENDAR</span>
        <h2>
          The day we say <em>always.</em>
        </h2>
      </div>
      <div className={styles.schedule}>
        {details.events.map((event, n) => {
          const start = new Date(
            `${event.date}T${event.time || "09:30"}:00+05:30`,
          );
          const stamp = (value: Date) =>
            value.toISOString().replace(/[-:]|\.\d{3}/g, "");
          const calendar = `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: `${details.brideName} & ${details.groomName}: ${event.name}`, dates: `${stamp(start)}/${stamp(new Date(start.getTime() + 2 * 3600000))}`, location: `${event.venue}, ${event.address}` })}`;
          return (
            <article
              className={styles.scheduleCard}
              key={event.id}
              data-evermore-reveal
            >
              <span className={styles.scheduleNumber}>0{n + 1}</span>
              <div>
                <span className={styles.eyebrow}>
                  {formatDateLong(event.date)}
                </span>
                <h3>{event.name}</h3>
                <strong>{formatTime(event.time)}</strong>
                <h4>{event.venue}</h4>
                <p>{event.address}</p>
                <div className={styles.eventLinks}>
                  <a href={calendar} target="_blank" rel="noopener noreferrer">
                    <CalendarDays size={13} />
                    Save the date
                  </a>
                  <a
                    href={
                      details.mapUrl && n === 0
                        ? details.mapUrl
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue} ${event.address}`)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin size={13} />
                    Directions
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
