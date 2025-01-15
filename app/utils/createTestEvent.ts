import { Event } from "@/app/types";
import getDateString from "./getDateString";

export default function createTestEvent(options: Partial<Event>): Event {
  const date = options.date || new Date();
  return {
    name: "Test",
    slug: "test",
    district: "",
    verified: true,
    festival: false,
    date,
    dateString: getDateString(date, "nl"),
    startTime: "0:00",
    endTime: "23:00",
    ...options,
  };
}
