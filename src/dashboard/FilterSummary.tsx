import { STATES } from "./data";
import { useFilters, useHasActiveFilters } from "./store";
import { X } from "lucide-react";

export function FilterSummary() {
  const { state, caste, religion, year, topTenOnly, clearAll } = useFilters();
  const active = useHasActiveFilters();
  if (!active) return null;
  const stateName = state === "IN" ? "All India" : STATES.find((s) => s.code === state)?.name;
  const parts: string[] = [];
  if (state !== "IN") parts.push(stateName!);
  if (caste !== "All") parts.push(caste);
  if (religion !== "All") parts.push(religion);
  parts.push(String(year));
  if (topTenOnly) parts.push("Top 10");
  return (
    <div className="container mx-auto px-3 md:px-6 py-2 flex items-center gap-2 text-xs md:text-sm">
      <span className="text-muted-foreground">Filtered by:</span>
      <span className="font-semibold text-navy">{parts.join(" · ")}</span>
      <button onClick={clearAll}
        className="ml-auto inline-flex items-center gap-1 text-saffron hover:underline font-medium min-h-[36px] px-2">
        <X className="w-3.5 h-3.5" /> Clear all
      </button>
    </div>
  );
}