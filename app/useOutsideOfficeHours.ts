import { create } from "zustand";
import { combine } from "zustand/middleware";

const useOutsideOfficeHours = create(
  combine({ value: false }, (set) => ({
    setValue: (value: boolean) => set(() => ({ value })),
  })),
);
export default useOutsideOfficeHours;
