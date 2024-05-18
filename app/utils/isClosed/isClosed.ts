import isDateInRange from "./isDateInRange";

export default function isClosed(eventDate: Date, closedRanges: string[]) {
  return closedRanges.some((range) => isDateInRange(eventDate, range));
}
