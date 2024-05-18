import { expect, test } from "vitest";
import compareDates from "./compareDates";

test("should return 0 for the same dates", () => {
  expect(compareDates("07-15", "07-15")).toBe(0);
});

test("should return a negative number when the first date is earlier in the same month", () => {
  expect(compareDates("07-10", "07-15")).toBeLessThan(0);
});

test("should return a positive number when the first date is later in the same month", () => {
  expect(compareDates("07-20", "07-15")).toBeGreaterThan(0);
});

test("should return a negative number when the first date is in an earlier month", () => {
  expect(compareDates("06-15", "07-15")).toBeLessThan(0);
});

test("should return a positive number when the first date is in a later month", () => {
  expect(compareDates("08-15", "07-15")).toBeGreaterThan(0);
});

test("should handle dates at the beginning and end of the month", () => {
  expect(compareDates("07-01", "07-31")).toBeLessThan(0);
  expect(compareDates("07-31", "07-01")).toBeGreaterThan(0);
});

test("should handle dates at the beginning and end of the year", () => {
  expect(compareDates("01-01", "12-31")).toBeLessThan(0);
  expect(compareDates("12-31", "01-01")).toBeGreaterThan(0);
});
