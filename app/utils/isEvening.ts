export default function isEvening(time: string) {
  const [hours] = time.split(":").map(Number);
  return hours >= 18; // Might as well be 19?
}
