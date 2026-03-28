import { afterEach, describe, expect, it, vi } from "vitest";
import type { Event, Festival, RC } from "@/app/types";
import createTestRC from "@/app/utils/createTestRC";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TIME_ZONE } from "../constants";

type GetEventsModule = typeof import("./getEvents");

dayjs.extend(utc);
dayjs.extend(timezone);

function setAmsterdamTime(dateTime: string) {
  vi.useFakeTimers();
  vi.setSystemTime(dayjs.tz(dateTime, TIME_ZONE).toDate());
}

function createTestFestival(overrides: Partial<Festival> = {}): Festival {
  return {
    name: "Festival",
    slug: "festival",
    district: "Centrum",
    location: "Square",
    address: "Main street 1",
    dates: ["2025-02-08"],
    startTime: "10:00",
    endTime: "16:00",
    link: "https://example.com",
    description: { nl: "", en: "" },
    ...overrides,
  };
}

async function loadGetEvents({
  cafes,
  festivals = [],
  closedCauseBySlug = {},
}: {
  cafes: RC[];
  festivals?: Festival[];
  closedCauseBySlug?: Record<string, string>;
}) {
  vi.resetModules();

  const isClosed = vi.fn((event: Event) => closedCauseBySlug[event.slug] ?? "");

  vi.doMock("@/data/data/cafes.json", () => ({
    default: cafes,
  }));
  vi.doMock("@/data/data/festivals.json", () => ({
    default: festivals,
  }));
  vi.doMock("@/app/utils/isClosed", () => ({
    default: isClosed,
  }));

  const module: GetEventsModule = await import("./getEvents");

  return {
    getEvents: module.default,
    isClosed,
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
  vi.resetModules();
  vi.doUnmock("@/data/data/cafes.json");
  vi.doUnmock("@/data/data/festivals.json");
  vi.doUnmock("@/app/utils/isClosed");
});

describe("getEvents", () => {
  it("gets events based on their recurrence rules,", async () => {
    setAmsterdamTime("2025-01-29 11:00");

    const recurringCafe = createTestRC({
      name: "Monday Cafe",
      slug: "monday-cafe",
      district: "Centrum",
      rrule: ["FREQ=WEEKLY;BYDAY=MO"],
      startTime: ["13:30"],
      endTime: ["15:00"],
    });

    const { getEvents } = await loadGetEvents({
      cafes: [recurringCafe],
    });

    const events = await getEvents({
      locale: "en",
    });

    expect(events.map((event) => event.slug)).toEqual([
      "monday-cafe",
      "monday-cafe",
      "monday-cafe",
      "monday-cafe",
    ]);
    // Note these times are in UTC, so often 1 or 2 hours before the local time depending on daylight saving time
    expect(events.map((event) => event.date.toISOString())).toEqual([
      "2025-02-03T12:30:00.000Z",
      "2025-02-10T12:30:00.000Z",
      "2025-02-17T12:30:00.000Z",
      "2025-02-24T12:30:00.000Z",
    ]);
    expect(events.every((event) => event.startTime === "13:30")).toBe(true);
    expect(events.every((event) => event.endTime === "15:00")).toBe(true);
  });

  it("includes the current occurrence when an event has already started but not finished", async () => {
    setAmsterdamTime("2025-02-03 14:30");

    const recurringCafe = createTestRC({
      name: "Monday Cafe",
      slug: "monday-cafe",
      district: "Centrum",
      rrule: ["FREQ=MONTHLY;BYDAY=1MO;INTERVAL=1"],
      startTime: ["13:00"],
      endTime: ["15:00"],
    });

    const { getEvents } = await loadGetEvents({
      cafes: [recurringCafe],
    });

    const events = await getEvents({
      locale: "en",
    });

    expect(events.map((event) => event.slug)).toEqual([
      "monday-cafe",
      "monday-cafe",
    ]);

    // Note these times are in UTC, so often 1 or 2 hours before the local time depending on daylight saving time
    expect(events.map((event) => event.date.toISOString())).toEqual([
      "2025-02-03T12:00:00.000Z",
      "2025-03-03T12:00:00.000Z",
    ]);
    expect(events.every((event) => event.startTime === "13:00")).toBe(true);
    expect(events.every((event) => event.endTime === "15:00")).toBe(true);
  });

  it("excludes the occurrence that just finished", async () => {
    setAmsterdamTime("2025-02-03 15:00");

    const recurringCafe = createTestRC({
      name: "Monday Cafe",
      slug: "monday-cafe",
      district: "Centrum",
      rrule: ["FREQ=MONTHLY;BYDAY=1MO;INTERVAL=1"],
      startTime: ["13:00"],
      endTime: ["15:00"],
    });

    const { getEvents } = await loadGetEvents({
      cafes: [recurringCafe],
    });

    const events = await getEvents({
      locale: "en",
    });

    expect(events.map((event) => event.slug)).toEqual(["monday-cafe"]);

    // Note these times are in UTC, so often 1 or 2 hours before the local time depending on daylight saving time
    expect(events.map((event) => event.date.toISOString())).toEqual([
      "2025-03-03T12:00:00.000Z",
    ]);
    expect(events.every((event) => event.startTime === "13:00")).toBe(true);
    expect(events.every((event) => event.endTime === "15:00")).toBe(true);
  });

  it("filters by slug, keeps exception dates, and excludes festivals", async () => {
    setAmsterdamTime("2025-01-01 10:00");

    const selectedCafe = createTestRC({
      name: "Selected",
      slug: "selected-cafe",
      district: "West",
      rrule: ["FREQ=WEEKLY;BYDAY=WE"],
      startTime: ["18:00"],
      endTime: ["20:00"],
      exceptions: ["2025-01-09"],
    });
    const otherCafe = createTestRC({
      name: "Other",
      slug: "other-cafe",
      district: "Noord",
      rrule: ["FREQ=WEEKLY;BYDAY=FR"],
      startTime: ["19:00"],
      endTime: ["21:00"],
    });

    const { getEvents } = await loadGetEvents({
      cafes: [selectedCafe, otherCafe],
      festivals: [
        createTestFestival({
          slug: "winter-festival",
          dates: ["2025-01-18"],
        }),
      ],
    });

    const events = await getEvents({
      slug: "selected-cafe",
      locale: "en",
    });

    expect(events.every((event) => event.slug === "selected-cafe")).toBe(true);
    expect(events.some((event) => event.exceptionCause === "2025-01-09")).toBe(
      true,
    );
    expect(events.some((event) => event.festival)).toBe(false);
  });

  it("includes festivals only when no slug is provided", async () => {
    setAmsterdamTime("2025-01-01 10:00");

    const { getEvents } = await loadGetEvents({
      cafes: [
        createTestRC({
          slug: "cafe",
          rrule: ["FREQ=WEEKLY;BYDAY=WE"],
          startTime: ["18:00"],
          endTime: ["20:00"],
        }),
      ],
      festivals: [
        createTestFestival({
          slug: "festival-only",
          dates: ["2025-01-18"],
        }),
      ],
    });

    const allEvents = await getEvents({ locale: "en" });
    const cafeEvents = await getEvents({ slug: "cafe", locale: "en" });

    expect(allEvents.some((event) => event.slug === "festival-only")).toBe(
      true,
    );
    expect(cafeEvents.some((event) => event.slug === "festival-only")).toBe(
      false,
    );
  });

  it("omits closed events unless debug is enabled", async () => {
    setAmsterdamTime("2025-01-01 10:00");

    const openCafe = createTestRC({
      slug: "open-cafe",
      rrule: ["FREQ=WEEKLY;BYDAY=WE"],
      startTime: ["18:00"],
      endTime: ["20:00"],
    });
    const closedCafe = createTestRC({
      slug: "closed-cafe",
      rrule: ["FREQ=WEEKLY;BYDAY=WE"],
      startTime: ["18:00"],
      endTime: ["20:00"],
    });

    const { getEvents, isClosed } = await loadGetEvents({
      cafes: [openCafe, closedCafe],
      closedCauseBySlug: {
        "closed-cafe": "Closed for maintenance",
      },
    });

    const visibleEvents = await getEvents({ locale: "en" });
    const debugEvents = await getEvents({ locale: "en", debug: true });

    expect(visibleEvents.some((event) => event.slug === "closed-cafe")).toBe(
      false,
    );
    expect(
      debugEvents.find((event) => event.slug === "closed-cafe")?.closedCause,
    ).toBe("Closed for maintenance");
    expect(isClosed).toHaveBeenCalled();
  });
});
