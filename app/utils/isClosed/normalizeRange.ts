// Normalize MM:MM, MM and MM-DD to MM-DD:MM-DD
export default function normalizeRange(range: string) {
  if (range.includes("-") && range.includes(":")) {
    return range; // Already in MM-DD:MM-DD format
  } else if (range.includes("-")) {
    return `${range}:${range}`; // Single day format, convert to MM-DD:MM-DD
  } else {
    const [startMonth, endMonth] = range.split(":");
    const startDay = "01";
    const endDay = "31"; // Use 31 as the last possible day of the month
    return `${startMonth}-${startDay}:${endMonth || startMonth}-${endDay}`;
  }
}
