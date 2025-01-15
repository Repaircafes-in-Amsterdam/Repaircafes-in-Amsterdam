import { describe, it, expect } from "vitest";
import hasOutOfOfficeHours from "./hasOutOfOfficeHours";
import { RC } from "@/app/types";
import createTestRC from "./createTestRC";

describe("hasOutOfOfficeHours", () => {
  it("returns true for events ending after 18:00 on weekdays", () => {
    const rc = createTestRC({
      rrule: ["FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR"],
      endTime: ["19:00"],
    });
    expect(hasOutOfOfficeHours(rc)).toBe(true);
  });

  it("returns false for events ending before 18:00 on weekdays", () => {
    const rc: RC = createTestRC({
      rrule: ["FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR"],
      endTime: ["17:00"],
    });
    expect(hasOutOfOfficeHours(rc)).toBe(false);
  });

  it("returns true for events on weekends regardless of end time", () => {
    const rc = createTestRC({
      rrule: ["FREQ=WEEKLY;BYDAY=SA,SU"],
      endTime: ["10:00"], // Time is irrelevant for weekends
    });
    expect(hasOutOfOfficeHours(rc)).toBe(true);
  });

  it("handles multiple rrules and endTimes", () => {
    const rc = createTestRC({
      rrule: ["FREQ=WEEKLY;BYDAY=MO", "FREQ=WEEKLY;BYDAY=TU"],
      endTime: ["12:00", "20:00"],
    });
    expect(hasOutOfOfficeHours(rc)).toBe(true);
  });

  it("returns false for weekdays ending before 18:00 with multiple endTimes", () => {
    const rc = createTestRC({
      rrule: ["FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR"],
      endTime: ["17:00", "16:00"], // Both times are before 18:00
    });
    expect(hasOutOfOfficeHours(rc)).toBe(false);
  });
});
