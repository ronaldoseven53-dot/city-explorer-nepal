import type { Destination } from "@/data/destinations";

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

function parseMonth(name: string): number {
  return MONTHS.indexOf(name.toLowerCase().trim());
}

function inRange(month: number, start: number, end: number): boolean {
  // start <= end: normal range (e.g. March–May)
  // start > end: wraps year boundary (e.g. October–February)
  return start <= end
    ? month >= start && month <= end
    : month >= start || month <= end;
}

/**
 * Returns destinations whose bestTimeToVisit includes the given month (0 = Jan).
 * Handles multiple ranges joined by "and" or ";", en-dashes, and parenthetical notes.
 */
export function checkSeasonality(
  destinations: Destination[],
  month: number
): Destination[] {
  return destinations.filter((d) => {
    const text = d.bestTimeToVisit
      .replace(/\([^)]*\)/g, "")   // strip "(clearest skies)" style notes
      .replace(/;/g, " and ");     // normalise semicolons → "and"

    // match every "MonthName – MonthName" pair (en-dash or hyphen)
    const rangeRe = /([a-z]+)\s*[–\-]\s*([a-z]+)/gi;
    let m: RegExpExecArray | null;
    while ((m = rangeRe.exec(text)) !== null) {
      const start = parseMonth(m[1]);
      const end   = parseMonth(m[2]);
      if (start !== -1 && end !== -1 && inRange(month, start, end)) return true;
    }
    return false;
  });
}
