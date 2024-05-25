import { expect, it } from "vitest";
import isDateInRange from "./isDateInRange";

it("handles full date range (YYYY-MM-DD:YYYY-MM-DD)", () => {
  expect(isDateInRange("2024-05-23", "2024-05-01:2024-05-31")).toBe(true);
  expect(isDateInRange("2024-05-01", "2024-05-01:2024-05-31")).toBe(true);
  expect(isDateInRange("2024-05-31", "2024-05-01:2024-05-31")).toBe(true);
  expect(isDateInRange("2025-05-23", "2024-05-01:2024-05-31")).toBe(false);
});

it("handles single full date (YYYY-MM-DD)", () => {
  expect(isDateInRange("2024-05-23", "2024-05-23")).toBe(true);
  expect(isDateInRange("2024-05-23", "2024-05-22")).toBe(false);
});

it("handles month-day range (MM-DD:MM-DD)", () => {
  expect(isDateInRange("2024-05-23", "05-01:05-31")).toBe(true);
  expect(isDateInRange("2025-05-23", "05-01:05-31")).toBe(true);
  expect(isDateInRange("2024-06-23", "05-01:05-31")).toBe(false);
});

it("handles single month-day (MM-DD)", () => {
  expect(isDateInRange("2024-05-23", "05-23")).toBe(true);
  expect(isDateInRange("2025-05-23", "05-23")).toBe(true);
  expect(isDateInRange("2024-05-22", "05-23")).toBe(false);
});

it("handles year-month range (YYYY-MM:YYYY-MM)", () => {
  expect(isDateInRange("2024-05-23", "2024-05:2024-06")).toBe(true);
  expect(isDateInRange("2024-07-23", "2024-05:2024-06")).toBe(false);
});

it("handles single year-month (YYYY-MM)", () => {
  expect(isDateInRange("2024-05-23", "2024-05")).toBe(true);
  expect(isDateInRange("2024-06-23", "2024-05")).toBe(false);
  expect(isDateInRange("2025-05-23", "2024-05")).toBe(false);
});

it("handles month range (MM:MM)", () => {
  expect(isDateInRange("2024-05-23", "05:06")).toBe(true);
  expect(isDateInRange("2025-05-23", "05:06")).toBe(true);
  expect(isDateInRange("2024-07-23", "05:06")).toBe(false);
});

it("handles month range (MM:MM) crossing new year", () => {
  expect(isDateInRange("2024-01-23", "12:01")).toBe(true);
  expect(isDateInRange("2024-02-23", "12:01")).toBe(false);
  expect(isDateInRange("2024-12-23", "12:01")).toBe(true);
  expect(isDateInRange("2024-11-23", "12:01")).toBe(false);

  expect(isDateInRange("2024-01-23", "11:02")).toBe(true);
  expect(isDateInRange("2024-02-23", "11:02")).toBe(true);
  expect(isDateInRange("2024-03-23", "11:02")).toBe(false);
  expect(isDateInRange("2024-10-23", "11:02")).toBe(false);
  expect(isDateInRange("2024-11-23", "11:02")).toBe(true);
  expect(isDateInRange("2024-12-23", "11:02")).toBe(true);
});

it("handles single month (MM)", () => {
  expect(isDateInRange("2024-05-23", "05")).toBe(true);
  expect(isDateInRange("2025-05-23", "05")).toBe(true);
  expect(isDateInRange("2024-06-23", "05")).toBe(false);
});
