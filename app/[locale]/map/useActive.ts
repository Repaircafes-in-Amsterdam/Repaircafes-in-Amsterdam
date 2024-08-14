"use client";
import getParamHook, { Option } from "@/app/getParamHook";

const defaultValue = "";

export const options: Option[] = [{ value: defaultValue, label: "" }];

export default getParamHook("active", defaultValue, options);
