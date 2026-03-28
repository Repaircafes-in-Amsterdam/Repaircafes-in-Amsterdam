import { Festival } from "@/app/types";

export default function createTestFestival(
  options: Partial<Festival> = {},
): Festival {
  return {
    name: "Festival",
    slug: "festival",
    district: "Centrum",
    location: "Square",
    address: "Main street 1",
    dates: ["2025-02-08"],
    startTime: "10:00",
    endTime: "16:00",
    link: "https://example.com",
    description: { nl: "", en: "" },
    ...options,
  };
}
