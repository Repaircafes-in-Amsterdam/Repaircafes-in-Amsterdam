import compareDates from "./compareDates";
import normalizeRange from "./normalizeRange";

export default function isDateInRange(date: Date, range: string) {
  // Convert input date to comparable string (without year)
  const eventDate = date.toISOString().slice(5, 10); // Extract "MM-DD"

  // Normalize and split the range
  const [start, end] = normalizeRange(range).split(":");

  // Function to compare MM-DD strings

  if (compareDates(start, end) <= 0) {
    // Normal range within the same year
    return (
      compareDates(start, eventDate) <= 0 && compareDates(eventDate, end) <= 0
    );
  } else {
    // Overlapping range across the year end
    return (
      compareDates(start, eventDate) <= 0 || compareDates(eventDate, end) <= 0
    );
  }
}
