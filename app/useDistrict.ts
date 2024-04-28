import getParamHook, { Option } from "./getParamHook";

const defaultValue = "any";

export const options: Option[] = [
  { value: defaultValue, label: "Alle" },
  { value: "Centrum", label: "Centrum" },
  { value: "Nieuw-West", label: "Nieuw-West" },
  { value: "Noord", label: "Noord" },
  { value: "Oost", label: "Oost" },
  { value: "West", label: "West" },
  { value: "Zuid", label: "Zuid" },
  { value: "Zuidoost", label: "Zuidoost" },
  { value: "Weesp", label: "Weesp" },
  { value: "Diemen", label: "Diemen" },
];

export default getParamHook("district", defaultValue, options);
