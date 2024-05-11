"use client";
import getParamHook, { Option } from "../getParamHook";

const defaultValue = "";

export const options: Option[] = [{ value: defaultValue, label: "" }];

export default getParamHook("active", defaultValue, options);
