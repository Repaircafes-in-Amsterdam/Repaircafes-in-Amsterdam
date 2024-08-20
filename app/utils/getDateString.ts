export default function getDateString(date: Date, locale: string) {
  const string = date.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return string[0].toUpperCase() + string.slice(1);
}
