import { RC } from "../types";

export default function createTestRC(options: Partial<RC>): RC {
  return {
    name: "test",
    slug: "test",
    startTime: ["0:00"],
    endTime: ["23:00"],
    rrule: [""],
    open: "",
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
