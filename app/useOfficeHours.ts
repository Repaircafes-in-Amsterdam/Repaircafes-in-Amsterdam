import getParamHook, { Option } from "./getParamHook";

const defaultValue = "false";

export const options: Option[] = [{ value: defaultValue }, { value: "true" }];

// TODO find a more sensible param name
// outside-office-hours / off-hours / offTime / freeTime / offWorkTime
export default getParamHook("office-hours", defaultValue, options);
