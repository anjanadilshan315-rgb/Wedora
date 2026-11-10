import type { StudioGuest } from "./free-studio-types";

/** Quote cells and prevent guest names being interpreted as spreadsheet formulas. */
export function guestListCsv(guests: StudioGuest[]): string {
  function cell(value: string) {
    const safe = /^[\s]*[=+@-]/.test(value) ? `'${value}` : value;
    return `"${safe.replaceAll('"', '""')}"`;
  }
  const rows = [["Name", "Status", "Replied at"], ...guests.map((guest) => [guest.name, guest.status, guest.repliedAt ?? ""])];
  return "\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
