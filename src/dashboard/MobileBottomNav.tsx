import { BarChart3, Filter, Users, Vote, Scale, GitCompareArrows } from "lucide-react";

const ITEMS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "demographics", label: "People", icon: Users },
  { id: "politics", label: "Politics", icon: Vote },
  { id: "transparency", label: "Trust", icon: Scale },
  { id: "comparison", label: "Compare", icon: GitCompareArrows },
];

export function MobileBottomNav({ onOpenFilters }: { onOpenFilters: () => void }) {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border
                 shadow-[0_-4px_16px_-4px_rgba(30,64,175,0.12)] flex items-stretch
                 pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      {ITEMS.map((it) => {
        const Icon = it.icon;
        return (
          <button key={it.id} onClick={() => go(it.id)}
            className="flex-1 min-h-[56px] flex flex-col items-center justify-center gap-0.5
                       text-[10px] font-medium text-muted-foreground active:text-navy">
            <Icon className="w-5 h-5" />
            {it.label}
          </button>
        );
      })}
      <button onClick={onOpenFilters}
        className="flex-1 min-h-[56px] flex flex-col items-center justify-center gap-0.5
                   text-[10px] font-semibold text-saffron border-l border-border">
        <Filter className="w-5 h-5" />
        Filters
      </button>
    </nav>
  );
}