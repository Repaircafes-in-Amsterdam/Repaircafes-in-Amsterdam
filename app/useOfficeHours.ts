import getParamHook, { Option } from "./getParamHook";

const defaultValue = "false";

export const options: Option[] = [{ value: defaultValue }, { value: "true" }];

// TODO find a more sensible param name
export default getParamHook("office-hours", defaultValue, options);
