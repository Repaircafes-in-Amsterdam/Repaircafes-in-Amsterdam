// Compare MM-DD date strings
// <0 means a is before b
// 0 means a is the same as b
// >0 means a is after b
export default function compareDates(a: string, b: string) {
  const [aMonth, aDay] = getMonthAndDay(a);
  const [bMonth, bDay] = getMonthAndDay(b);
  return aMonth !== bMonth ? aMonth - bMonth : aDay - bDay;
}

function getMonthAndDay(date: string) {
  return date.split("-").map((num: string) => parseInt(num, 10));
}
