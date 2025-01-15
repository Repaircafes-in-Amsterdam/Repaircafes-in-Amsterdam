import { it, expect, describe } from "vitest";
import { Event } from "@/app/types";
import createTestEvent from "./createTestEvent";
import filterEvents from "./filterEvents";
import { defaultValue as defaultDistrict } from "../useDistrict";

function event(
  slug: string,
  district: string,
  startTime: string,
  endTime: string,
  dateValue: string = "2025-01-01",
) {
  const date = new Date(dateValue);
  return createTestEvent({ slug, district, startTime, endTime, date });
}

const events: Event[] = [
  event("center-day", "Centrum", "13:00", "15:00"),
  event("center-evening", "Centrum", "19:00", "21:00"),
  event("north-day", "Noord", "13:00", "15:00"),
  event("north-evening", "Noord", "19:00", "21:00"),
  event("north-weekend", "Noord", "13:00", "15:00", "2025-01-04"),
];

function slugs(events: Event[]) {
  return events.map((event) => event.slug);
}

it("Does not filter when no filters are enabled", () => {
  expect(slugs(filterEvents(events, defaultDistrict, false))).toEqual(
    slugs(events),
  );
});

it("Does filter on district", () => {
  expect(slugs(filterEvents(events, "Centrum", false))).toEqual([
    "center-day",
    "center-evening",
  ]);
  expect(slugs(filterEvents(events, "Noord", false))).toEqual([
    "north-day",
    "north-evening",
    "north-weekend",
  ]);
});

it("Does filter on out of office time events", () => {
  expect(slugs(filterEvents(events, defaultDistrict, true))).toEqual([
    "center-evening",
    "north-evening",
    "north-weekend",
  ]);
});

it("Does filter on combination", () => {
  expect(slugs(filterEvents(events, "Noord", true))).toEqual([
    "north-evening",
    "north-weekend",
  ]);
});

describe("Office hour day filtering", () => {
  const events: Event[] = [
    event("monday", "Centrum", "13:00", "15:00", "2025-01-06"),
    event("tuesday", "Centrum", "13:00", "15:00", "2025-01-07"),
    event("wednesday", "Centrum", "13:00", "15:00", "2025-01-08"),
    event("thursday", "Centrum", "13:00", "15:00", "2025-01-09"),
    event("friday", "Centrum", "13:00", "15:00", "2025-01-10"),
    event("saturday", "Centrum", "13:00", "15:00", "2025-01-11"),
    event("sunday", "Centrum", "13:00", "15:00", "2025-01-12"),
  ];

  it("When only outside office filter is not enabled it does not filter", () => {
    expect(slugs(filterEvents(events, defaultDistrict, false))).toEqual(
      slugs(events),
    );
  });

  it("When only outside office filter is enabled it filters out day time events during work days", () => {
    expect(slugs(filterEvents(events, defaultDistrict, true))).toEqual([
      "saturday",
      "sunday",
    ]);
  });
});
