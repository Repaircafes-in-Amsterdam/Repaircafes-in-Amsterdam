import { expect, test } from "vitest";
import normalizeRange from "./normalizeRange";

test("should return the same range for MM-DD:MM-DD format", () => {
  expect(normalizeRange("07-01:07-31")).toBe("07-01:07-31");
});

test("should normalize MM:MM format to MM-01:MM-31", () => {
  expect(normalizeRange("07:08")).toBe("07-01:08-31");
});

test("should normalize MM format to MM-01:MM-31", () => {
  expect(normalizeRange("07")).toBe("07-01:07-31");
});

test("should normalize single day format to MM-DD:MM-DD", () => {
  expect(normalizeRange("07-15")).toBe("07-15:07-15");
});

test("should handle single month range spanning over year-end", () => {
  expect(normalizeRange("12:01")).toBe("12-01:01-31"); // December to January
});
