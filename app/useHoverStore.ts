import { create } from "zustand";
import { combine } from "zustand/middleware";

const useHoverStore = create(
  combine({ hoveredSlug: "" }, (set) => ({
    setHoveredSlug: (slug: string) => set(() => ({ hoveredSlug: slug })),
  })),
);
export default useHoverStore;
