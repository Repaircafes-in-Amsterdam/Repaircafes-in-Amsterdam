import { RC } from "@/app/types";

export default function createTestRC(options: Partial<RC>): RC {
  return {
    name: "test",
    slug: "test",
    startTime: ["0:00"],
    endTime: ["23:00"],
    rrule: [""],
    open: { nl: "" },
    closed: "",
    closedRanges: [],
    exceptions: [],
    address: "",
    district: "",
    doRepair: "",
    dontRepair: "",
    moreInfo: "",
    coordinate: [],
    email: "",
    verified: true,
    ...options,
  };
}
