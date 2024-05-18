import isDateInRange from "./isDateInRange";
import { expect, test } from "vitest";

test("should return true for a date within a normal range within the same year", () => {
  const date = new Date("2024-07-15");
  expect(isDateInRange(date, "07-01:07-31")).toBe(true);
});

test("should return false for a date outside a normal range within the same year", () => {
  const date = new Date("2024-08-01");
  expect(isDateInRange(date, "07-01:07-31")).toBe(false);
});

test("should return true for a date within an overlapping range across the year end", () => {
  const date = new Date("2024-01-05");
  expect(isDateInRange(date, "12-01:01-15")).toBe(true);
});

test("should return false for a date outside an overlapping range across the year end", () => {
  const date = new Date("2024-02-01");
  expect(isDateInRange(date, "12-01:01-15")).toBe(false);
});

test("should return true for a date that is the same as the range start", () => {
  const date = new Date("2024-07-01");
  expect(isDateInRange(date, "07-01:07-31")).toBe(true);
});

test("should return true for a date that is the same as the range end", () => {
  const date = new Date("2024-07-31");
  expect(isDateInRange(date, "07-01:07-31")).toBe(true);
});

test("should return true for a date within a one-day range", () => {
  const date = new Date("2024-07-15");
  expect(isDateInRange(date, "07-15:07-15")).toBe(true);
});

test("should return false for a date outside a one-day range", () => {
  const date = new Date("2024-07-16");
  expect(isDateInRange(date, "07-15:07-15")).toBe(false);
});

test("should handle February 29th correctly in a leap year", () => {
  const date = new Date("2024-02-29");
  expect(isDateInRange(date, "02-28:03-01")).toBe(true);
});

test("should handle February 28th correctly in a non-leap year", () => {
  const date = new Date("2023-02-28");
  expect(isDateInRange(date, "02-28:03-01")).toBe(true);
});

test("should return true for a date within a month-to-month range", () => {
  const date = new Date("2024-07-15");
  expect(isDateInRange(date, "07:08")).toBe(true);
});

test("should return false for a date outside a month-to-month range", () => {
  const date = new Date("2024-09-01");
  expect(isDateInRange(date, "07:08")).toBe(false);
});

test("should return true for a date within a single month range", () => {
  const date = new Date("2024-07-15");
  expect(isDateInRange(date, "07")).toBe(true);
});

test("should return false for a date outside a single month range", () => {
  const date = new Date("2024-08-01");
  expect(isDateInRange(date, "07")).toBe(false);
});

test("should return true for a date within a single day range", () => {
  const date = new Date("2024-07-15");
  expect(isDateInRange(date, "07-15")).toBe(true);
});

test("should return false for a date outside a single day range", () => {
  const date = new Date("2024-07-16");
  expect(isDateInRange(date, "07-15")).toBe(false);
});
