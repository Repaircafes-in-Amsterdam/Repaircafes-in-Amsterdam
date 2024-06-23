import { create } from "zustand";
import { combine } from "zustand/middleware";

const useHoverStore = create(
  combine({ hoveredMarker: "", hoveredRow: "" }, (set) => ({
    setHoveredMarker: (slug: string) => set(() => ({ hoveredMarker: slug })),
    setHoveredRow: (slug: string) => set(() => ({ hoveredRow: slug })),
  })),
);
export default useHoverStore;
