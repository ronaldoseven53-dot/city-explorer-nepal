// Minimal festival data needed to generate calendar entries.
// Compatible with (a subset of) the Festival type in @/data/festivals.
export interface CalendarEvent {
  name:        string;
  emoji:       string;
  dateISO:     string;
  endDateISO?: string;
  description: string;
  location:    string;
}

function compact(iso: string) { return iso.replace(/-/g, ""); }

export function googleCalUrl(ev: CalendarEvent): string {
  const s = compact(ev.dateISO);
  const e = compact(ev.endDateISO ?? ev.dateISO);
  const p = new URLSearchParams({
    action:   "TEMPLATE",
    text:     `${ev.name} ${ev.emoji}`,
    dates:    `${s}/${e}`,
    details:  ev.description,
    location: ev.location,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function downloadICS(ev: CalendarEvent): void {
  const s = compact(ev.dateISO);
  const e = compact(ev.endDateISO ?? ev.dateISO);
  const uid = ev.name.toLowerCase().replace(/\s+/g, "-");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//City Explorer Nepal//Cultural Hub//EN",
    "BEGIN:VEVENT",
    `UID:${uid}@cityexplorernepal`,
    `DTSTART;VALUE=DATE:${s}`,
    `DTEND;VALUE=DATE:${e}`,
    `SUMMARY:${ev.name} ${ev.emoji}`,
    `DESCRIPTION:${ev.description.replace(/[\\;,]/g, "\\$&")}`,
    `LOCATION:${ev.location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const a = Object.assign(document.createElement("a"), {
    href:     URL.createObjectURL(new Blob([ics], { type: "text/calendar" })),
    download: `${uid}.ics`,
  });
  a.click();
}
