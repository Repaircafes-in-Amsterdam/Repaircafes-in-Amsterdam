const LOCALE = "NL-nl";

export default function getDateString(date: Date) {
  const string = date.toLocaleDateString(LOCALE, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return string[0].toUpperCase() + string.slice(1);
}
