import { afterEach, describe, expect, it, vi } from "vitest";
import type { Event, Festival, RC } from "@/app/types";
import createTestRC from "@/app/utils/createTestRC";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TIME_ZONE } from "../constants";
import createTestFestival from "../utils/createTestFestival";

type GetEventsModule = typeof import("./getEvents");
const ORIGINAL_TIME_ZONE = process.env.TZ;

dayjs.extend(utc);
dayjs.extend(timezone);

function setAmsterdamTime(dateTime: string) {
  vi.useFakeTimers();
  vi.setSystemTime(dayjs.tz(dateTime, TIME_ZONE).toDate());
}

function restoreProcessTimeZone() {
  if (ORIGINAL_TIME_ZONE === undefined) {
    delete process.env.TZ;
    return;
  }

  process.env.TZ = ORIGINAL_TIME_ZONE;
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

  const isClosed = vi.fn((event: Event, rc?: RC) => {
    if (!rc) {
      throw new Error("Expected getEvents to forward rc to isClosed");
    }

    return closedCauseBySlug[event.slug] ?? "";
  });

  vi.doMock("@/data/data/cafes.json", () => ({
    default: cafes,
  }));
  vi.doMock("@/data/data/festivals.json", () => ({
    default: festivals,
  }));
  vi.doMock("@/app/utils/isClosed", () => ({
    default: isClosed,
  }));

  const getEventsModule: GetEventsModule = await import("./getEvents");

  return {
    getEvents: getEventsModule.default,
    isClosed,
  };
}

afterEach(() => {
  restoreProcessTimeZone();
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

  it("keeps the same Amsterdam start time across the daylight saving transition", async () => {
    setAmsterdamTime("2025-03-28 12:00");

    const recurringCafe = createTestRC({
      name: "Saturday Cafe",
      slug: "saturday-cafe",
      district: "Centrum",
      rrule: ["FREQ=WEEKLY;BYDAY=SA"],
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
      "saturday-cafe",
      "saturday-cafe",
      "saturday-cafe",
      "saturday-cafe",
      "saturday-cafe",
    ]);

    // The local start time stays at 13:00 in Amsterdam even though UTC shifts from +1 to +2 after the DST change.
    expect(events.map((event) => event.date.toISOString())).toEqual([
      "2025-03-29T12:00:00.000Z",
      // 30 Mar 2025 - Daylight Saving Time Started
      "2025-04-05T11:00:00.000Z",
      "2025-04-12T11:00:00.000Z",
      "2025-04-19T11:00:00.000Z",
      "2025-04-26T11:00:00.000Z",
    ]);
    expect(events.every((event) => event.startTime === "13:00")).toBe(true);
    expect(events.every((event) => event.endTime === "15:00")).toBe(true);
  });

  it("keeps the Amsterdam calendar day when the host timezone is UTC", async () => {
    process.env.TZ = "UTC";
    setAmsterdamTime("2025-03-28 12:00");

    const recurringCafe = createTestRC({
      name: "Saturday Cafe",
      slug: "saturday-cafe",
      district: "Centrum",
      rrule: ["FREQ=WEEKLY;BYDAY=SA"],
      startTime: ["13:00"],
      endTime: ["15:00"],
    });

    const { getEvents } = await loadGetEvents({
      cafes: [recurringCafe],
    });

    const events = await getEvents({
      locale: "en",
    });

    expect(events.map((event) => event.date.toISOString())).toEqual([
      "2025-03-29T12:00:00.000Z",
      "2025-04-05T11:00:00.000Z",
      "2025-04-12T11:00:00.000Z",
      "2025-04-19T11:00:00.000Z",
      "2025-04-26T11:00:00.000Z",
    ]);
  });

  it("handles near-closing monthly events correctly both outside and during daylight saving time", async () => {
    const recurringCafe = createTestRC({
      name: "First Monday Cafe",
      slug: "first-monday-cafe",
      district: "Centrum",
      rrule: ["FREQ=MONTHLY;BYDAY=1MO;INTERVAL=1"],
      startTime: ["13:00"],
      endTime: ["15:00"],
    });

    setAmsterdamTime("2025-02-03 14:30");
    const { getEvents: getWinterEvents } = await loadGetEvents({
      cafes: [recurringCafe],
    });
    const winterEvents = await getWinterEvents({
      locale: "en",
    });

    setAmsterdamTime("2025-06-02 15:30");
    const { getEvents: getSummerEvents } = await loadGetEvents({
      cafes: [recurringCafe],
    });
    const summerEvents = await getSummerEvents({
      locale: "en",
    });

    // At 14:30 in winter Amsterdam the February occurrence is still ongoing.
    expect(winterEvents.map((event) => event.date.toISOString())).toEqual([
      "2025-02-03T12:00:00.000Z",
      "2025-03-03T12:00:00.000Z",
    ]);

    // At 15:30 in summer Amsterdam the June occurrence has already finished,
    // and the next first Monday falls outside the default one-month window.
    expect(summerEvents).toEqual([]);
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
