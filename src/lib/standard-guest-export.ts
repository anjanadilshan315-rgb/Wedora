import type { StandardEvent, StandardGuest } from "./standard-invitation";

export function standardGuestListCsv(guests: StandardGuest[], events: StandardEvent[]): string {
  const cell = (value: string) => `"${(/^[\s]*[=+@-]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;
  const rows = [["Name", "Status", "Party size", "Events", "Dietary requirements", "Message", "Replied at"], ...guests.map((guest) => [guest.name, guest.status, String(guest.reply?.headCount ?? 0), guest.reply?.events.map((id) => events.find((event) => event.id === id)?.name ?? id).join("; ") ?? "", guest.reply?.dietary ?? "", guest.reply?.message ?? "", guest.repliedAt ?? ""])];
  return "\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
