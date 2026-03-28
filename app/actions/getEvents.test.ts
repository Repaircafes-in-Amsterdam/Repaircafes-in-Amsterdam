import { afterEach, describe, expect, it, vi } from "vitest";
import type { Event, Festival, RC } from "@/app/types";
import createTestRC from "@/app/utils/createTestRC";

type GetEventsModule = typeof import("./getEvents");

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
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-29T10:00:00.000Z"));

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
    expect(events.map((event) => event.date.toISOString())).toEqual([
      "2025-02-03T13:30:00.000Z",
      "2025-02-10T13:30:00.000Z",
      "2025-02-17T13:30:00.000Z",
      "2025-02-24T13:30:00.000Z",
    ]);
    expect(events.every((event) => event.startTime === "13:30")).toBe(true);
    expect(events.every((event) => event.endTime === "15:00")).toBe(true);
  });

  it("gets events that have already started but have not finished yet", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-02-03T14:00:00.000Z"));

    const recurringCafe = createTestRC({
      name: "Monday Cafe",
      slug: "monday-cafe",
      district: "Centrum",
      rrule: ["FREQ=WEEKLY;BYDAY=MO"],
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
      "monday-cafe",
      "monday-cafe",
    ]);
    expect(events.map((event) => event.date.toISOString())).toEqual([
      "2025-02-03T13:00:00.000Z",
      "2025-02-10T13:00:00.000Z",
      "2025-02-17T13:00:00.000Z",
      "2025-02-24T13:00:00.000Z",
    ]);
    expect(events.every((event) => event.startTime === "13:00")).toBe(true);
    expect(events.every((event) => event.endTime === "15:00")).toBe(true);
  });
});
