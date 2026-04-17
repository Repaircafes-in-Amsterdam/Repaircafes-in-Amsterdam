import { describe, expect, it } from "vitest";
import createTestRC from "@/app/utils/createTestRC";
import countBuckets, { countDynamicBuckets } from "./countBuckets";
import { DAY_BUCKET_IDS } from "./classifyDay";
import { DAY_TYPE_BUCKET_IDS } from "./classifyDayType";
import { FREQUENCY_BUCKET_IDS } from "./classifyFrequency";
import { OFFICE_HOURS_BUCKET_IDS } from "./classifyOfficeHours";
import getCafeStats, { getCafesStats } from "./getCafeStats";

describe("getCafeStats", () => {
  it("classifies day, day type, office hours, district, and frequency", () => {
    const cafes = [
      createTestRC({
        slug: "monday-office",
        district: "Centrum",
        rrule: ["FREQ=WEEKLY;BYDAY=MO;INTERVAL=1"],
        endTime: ["17:00"],
      }),
      createTestRC({
        slug: "weekend-only",
        district: "West",
        rrule: ["FREQ=WEEKLY;BYDAY=SA;INTERVAL=1"],
        endTime: ["12:00"],
      }),
      createTestRC({
        slug: "mixed-days",
        district: "West",
        rrule: [
          "FREQ=WEEKLY;BYDAY=WE;INTERVAL=1",
          "FREQ=WEEKLY;BYDAY=SA;INTERVAL=1",
        ],
        endTime: ["17:00", "12:00"],
      }),
      createTestRC({
        slug: "weekday-evening",
        district: "Oost",
        rrule: ["FREQ=WEEKLY;BYDAY=TH;INTERVAL=1"],
        endTime: ["19:00"],
      }),
    ];

    const stats = getCafesStats(cafes);

    expect(countBuckets(stats, DAY_BUCKET_IDS, (cafe) => cafe.day)).toEqual([
      { id: "monday", value: 1 },
      { id: "tuesday", value: 0 },
      { id: "wednesday", value: 0 },
      { id: "thursday", value: 1 },
      { id: "friday", value: 0 },
      { id: "saturday", value: 1 },
      { id: "sunday", value: 0 },
      { id: "multiple", value: 1 },
    ]);

    expect(
      countBuckets(stats, DAY_TYPE_BUCKET_IDS, (cafe) => cafe.dayType),
    ).toEqual([
      { id: "workday", value: 2 },
      { id: "weekend", value: 1 },
      { id: "both", value: 1 },
    ]);

    expect(
      countBuckets(stats, OFFICE_HOURS_BUCKET_IDS, (cafe) => cafe.officeHours),
    ).toEqual([
      { id: "yes", value: 1 },
      { id: "no", value: 2 },
      { id: "both", value: 1 },
    ]);

    expect(countDynamicBuckets(stats, (cafe) => cafe.district)).toEqual([
      { id: "Centrum", value: 1 },
      { id: "Oost", value: 1 },
      { id: "West", value: 2 },
    ]);

    expect(
      countBuckets(stats, FREQUENCY_BUCKET_IDS, (cafe) => cafe.frequency),
    ).toEqual([
      { id: "weekly", value: 3 },
      { id: "biweekly", value: 0 },
      { id: "monthly", value: 0 },
      { id: "other", value: 1 },
    ]);
  });

  it("returns null when a cafe has no occurrences in the sample period", () => {
    const cafe = createTestRC({
      slug: "inactive",
      district: "Noord",
      rrule: ["UNTIL=20200101T000000Z;FREQ=WEEKLY;BYDAY=MO;INTERVAL=1"],
      endTime: ["17:00"],
    });

    expect(getCafeStats(cafe)).toBeNull();
  });

  it("filters out cafes without occurrences", () => {
    const activeCafe = createTestRC({
      slug: "active",
      district: "Centrum",
      rrule: ["FREQ=WEEKLY;BYDAY=MO;INTERVAL=1"],
      endTime: ["17:00"],
    });
    const inactiveCafe = createTestRC({
      slug: "inactive",
      district: "Noord",
      rrule: ["UNTIL=20200101T000000Z;FREQ=WEEKLY;BYDAY=MO;INTERVAL=1"],
      endTime: ["17:00"],
    });

    expect(getCafesStats([activeCafe, inactiveCafe])).toEqual([
      expect.objectContaining({ district: "Centrum" }),
    ]);
  });
});
