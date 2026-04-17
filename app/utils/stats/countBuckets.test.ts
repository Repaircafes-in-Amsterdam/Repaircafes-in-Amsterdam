import { describe, expect, it } from "vitest";
import countBuckets, { countDynamicBuckets } from "./countBuckets";

describe("countBuckets", () => {
  it("counts ordered buckets including zero values", () => {
    const items = [
      { id: "a" as const },
      { id: "c" as const },
      { id: "a" as const },
    ];

    expect(
      countBuckets(items, ["a", "b", "c"] as const, (item) => item.id),
    ).toEqual([
      { id: "a", value: 2 },
      { id: "b", value: 0 },
      { id: "c", value: 1 },
    ]);
  });
});

describe("countDynamicBuckets", () => {
  it("counts and sorts dynamic buckets", () => {
    const items = [
      { district: "West" },
      { district: "Centrum" },
      { district: "West" },
    ];

    expect(countDynamicBuckets(items, (item) => item.district)).toEqual([
      { id: "Centrum", value: 1 },
      { id: "West", value: 2 },
    ]);
  });
});
