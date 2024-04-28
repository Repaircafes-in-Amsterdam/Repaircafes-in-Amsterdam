import getParamHook, { Option } from "./getParamHook";

const defaultValue = "false";

export const options: Option[] = [{ value: defaultValue }, { value: "true" }];

export default getParamHook("office-hours", defaultValue, options);
