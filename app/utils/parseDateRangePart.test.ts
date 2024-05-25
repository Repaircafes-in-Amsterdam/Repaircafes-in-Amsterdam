import parseDateRangePart from "./parseDateRangePart";
import { expect, it } from "vitest";

const year = 2024;

const tests = [
  ["YYYY-MM-DD", "2024-05-23", "day"],
  ["YYYY-MM-DD", "2025-05-23", "day"],
  ["MM-DD", "05-23", "day"],
  ["YYYY-MM", "2024-05", "month"],
  ["MM", "05", "month"],
  ["MM", "5", "month"],
  ["YYYY", "2025", "year"],
];

for (const [format, part, expectedGranularity] of tests) {
  it(`parses ${format} format`, () => {
    const [date, actualGranularity] = parseDateRangePart(part, year) ?? [];
    if (date) {
      expect(date.format(format)).toBe(part);
      expect(actualGranularity).toBe(expectedGranularity);
    }
  });
}

it("returns null for invalid formats", () => {
  expect(parseDateRangePart("invalid", year)).toBeNull();
});
