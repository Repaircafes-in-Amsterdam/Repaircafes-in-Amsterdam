import getParamHook from "./getParamHook";

const defaultValue = "false";

// TODO find a more sensible param name
// outside-office-hours / off-hours / offTime / freeTime / offWorkTime
export default getParamHook("office-hours", defaultValue);
