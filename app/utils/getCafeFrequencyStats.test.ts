import { describe, expect, it } from "vitest";
import createTestRC from "@/app/utils/createTestRC";
import getCafeFrequencyStats, {
  classifyRRuleFrequency,
} from "./getCafeFrequencyStats";

describe("classifyFrequencyRule", () => {
  it("classifies weekly rules as weekly", () => {
    expect(classifyRRuleFrequency(["FREQ=WEEKLY;BYDAY=MO;INTERVAL=1"])).toBe(
      "weekly",
    );
  });

  it("classifies two-week intervals as biweekly", () => {
    expect(classifyRRuleFrequency(["FREQ=WEEKLY;BYDAY=MO;INTERVAL=2"])).toBe(
      "biweekly",
    );
  });

  it("classifies monthly second and fourth weekday rules as biweekly", () => {
    expect(classifyRRuleFrequency(["FREQ=MONTHLY;BYDAY=2FR,4FR"])).toBe(
      "biweekly",
    );
  });

  it("classifies monthly positional rules as monthly", () => {
    expect(
      classifyRRuleFrequency(["FREQ=MONTHLY;BYSETPOS=2;BYDAY=SA;INTERVAL=1"]),
    ).toBe("monthly");
    expect(classifyRRuleFrequency(["FREQ=MONTHLY;BYDAY=2SA"])).toBe("monthly");
  });

  it("classifies dense monthly rules based on actual occurrences", () => {
    expect(
      classifyRRuleFrequency(["FREQ=MONTHLY;BYDAY=1WE,2WE,3WE,-1SA"]),
    ).toBe("weekly");
  });

  it("classifies multi-days weekly rules as other based on gap", () => {
    expect(classifyRRuleFrequency(["FREQ=WEEKLY;BYDAY=TU,SA;INTERVAL=1"])).toBe(
      "other",
    );
  });

  it("classifies sparse rules as other", () => {
    expect(
      classifyRRuleFrequency(["FREQ=MONTHLY;BYSETPOS=1;BYDAY=MO;INTERVAL=2"]),
    ).toBe("other");
  });

  it("classifies multiple rules combined based on overall occurrences", () => {
    expect(
      classifyRRuleFrequency([
        "FREQ=MONTHLY;BYDAY=1WE,3WE",
        "FREQ=MONTHLY;INTERVAL=1;BYDAY=1TH",
      ]),
    ).toBe("weekly");

    expect(
      classifyRRuleFrequency([
        "FREQ=WEEKLY;BYDAY=TU;INTERVAL=1",
        "FREQ=WEEKLY;BYDAY=SA;INTERVAL=1",
      ]),
    ).toBe("other");
  });
});

describe("getCafeFrequencyStats", () => {
  it("counts each cafe once based on its combined rrules", () => {
    const cafes = [
      createTestRC({
        rrule: [
          "FREQ=MONTHLY;BYDAY=1WE,3WE",
          "FREQ=MONTHLY;INTERVAL=1;BYDAY=1TH",
        ],
      }),
      createTestRC({
        rrule: ["FREQ=WEEKLY;BYDAY=TU;INTERVAL=1"],
      }),
      createTestRC({
        rrule: ["FREQ=MONTHLY;BYDAY=1WE,2WE,3WE,-1SA"],
      }),
      createTestRC({
        rrule: ["FREQ=MONTHLY;BYDAY=2SA"],
      }),
    ];

    expect(getCafeFrequencyStats(cafes)).toEqual([
      { id: "weekly", value: 3 },
      { id: "biweekly", value: 0 },
      { id: "monthly", value: 1 },
      { id: "other", value: 0 },
    ]);
  });
});
