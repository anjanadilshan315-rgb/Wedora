const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseDate(date: string | null): Date | null {
  if (!date) return null;
  const d = new Date(`${date.slice(0, 10)}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`;
}

/** "2026-11-28" -> "28TH NOVEMBER 2026" */
export function formatDateBanner(date: string | null): string {
  const d = parseDate(date);
  if (!d) return "DATE TO BE ANNOUNCED";
  return `${ordinal(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`.toUpperCase();
}

/** "2026-11-28" -> "Saturday, November 28th, 2026" */
export function formatDateLong(date: string | null): string {
  const d = parseDate(date);
  if (!d) return "Date to be announced";
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${ordinal(d.getDate())}, ${d.getFullYear()}`;
}

/** "2026-11-28" -> "28 Nov 2026" */
export function formatDateShort(date: string | null): string {
  const d = parseDate(date);
  if (!d) return "—";
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

/** "16:30" -> "4:30 PM". Free text such as "After the Poruwa" is returned as is. */
export function formatTime(time: string | null | undefined): string {
  if (!time) return "";
  const match = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  if (!match || /am|pm/i.test(time)) return time;
  const h = Number(match[1]);
  return `${h % 12 || 12}:${match[2]} ${h >= 12 ? "PM" : "AM"}`;
}

/** Countdown target. Falls back to midnight when no time is set. */
export function weddingTimestamp(date: string | null, time: string | null): number | null {
  const d = parseDate(date);
  if (!d) return null;
  const match = time ? /^(\d{1,2}):(\d{2})/.exec(time) : null;
  if (match) d.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return d.getTime();
}

export function venueLine(name: string | null, address: string | null): string {
  return [name, address].filter(Boolean).join(", ") || "Venue to be announced";
}

export function mapLink(mapUrl: string | null, name: string | null, address: string | null): string | null {
  if (mapUrl) return mapUrl;
  const q = [name, address].filter(Boolean).join(", ");
  return q ? `https://maps.google.com/?q=${encodeURIComponent(q)}` : null;
}
