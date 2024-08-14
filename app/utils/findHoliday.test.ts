import { expect, test } from "vitest";
import { Holiday } from "@/app/types";
import findHoliday from "./findHoliday";

const holidays: Holiday[] = [
  createHoliday("A", "2024-07-01", "2024-07-31"),
  createHoliday("B", "2024-08-01", "2024-08-31"),
  createHoliday("C", "2024-09-01", "2024-09-01"),
  createHoliday("D", "2024-12-15", "2025-01-15"),
];

function createHoliday(
  name: string,
  startDate: string,
  endDate: string,
): Holiday {
  // Add a day to the end date to make it include the end date
  const endDateDate = new Date(endDate);
  endDateDate.setDate(endDateDate.getDate() + 1);
  return {
    name,
    startDate,
    endDate,
    startTime: new Date(startDate).getTime(),
    endTime: endDateDate.getTime(),
  };
}

test("should return the first holiday during provided date", () => {
  const tests: [string, string | undefined][] = [
    ["2024-07-15", "A"],
    ["2024-08-01", "B"],
    ["2024-08-31", "B"],
    ["2024-09-01", "C"],
    ["2024-12-15", "D"],
    ["2025-01-15", "D"],
    ["2025-01-17", undefined],
  ];
  for (const test of tests) {
    const date = new Date(test[0]);
    expect(findHoliday(date, holidays)?.name).toBe(test[1]);
  }
});
