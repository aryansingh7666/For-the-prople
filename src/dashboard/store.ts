import { create } from "zustand";
import type { CasteGroup, ElectionYear, Religion } from "./data";

interface FilterState {
  state: string;             // "IN" or state code
  caste: "All" | CasteGroup;
  religion: "All" | Religion;
  year: ElectionYear;
  topTenOnly: boolean;
  setState: (s: string) => void;
  setCaste: (c: "All" | CasteGroup) => void;
  setReligion: (r: "All" | Religion) => void;
  setYear: (y: ElectionYear) => void;
  setTopTenOnly: (b: boolean) => void;
  clear: (k: keyof FilterState) => void;
  clearAll: () => void;
}

export const useFilters = create<FilterState>((set) => ({
  state: "IN",
  caste: "All",
  religion: "All",
  year: 2024,
  topTenOnly: false,
  setState: (state) => set({ state }),
  setCaste: (caste) => set({ caste }),
  setReligion: (religion) => set({ religion }),
  setYear: (year) => set({ year }),
  setTopTenOnly: (topTenOnly) => set({ topTenOnly }),
  clear: (k) => set((s) => {
    if (k === "state") return { ...s, state: "IN" };
    if (k === "caste") return { ...s, caste: "All" };
    if (k === "religion") return { ...s, religion: "All" };
    if (k === "year") return { ...s, year: 2024 };
    if (k === "topTenOnly") return { ...s, topTenOnly: false };
    return s;
  }),
  clearAll: () => set({ state: "IN", caste: "All", religion: "All", year: 2024, topTenOnly: false }),
}));

export function useHasActiveFilters() {
  const { state, caste, religion, year, topTenOnly } = useFilters();
  return state !== "IN" || caste !== "All" || religion !== "All" || year !== 2024 || topTenOnly;
}
