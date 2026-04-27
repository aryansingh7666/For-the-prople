import { useFilters } from "./store";
import { STATES } from "./data";
import { Command, PlayCircle, X } from "lucide-react";
import { Logo } from "../components/Logo";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "demographics", label: "Demographics" },
  { id: "socioeconomic", label: "Socio-Economic" },
  { id: "politics", label: "Politics" },
  { id: "transparency", label: "Transparency" },
  { id: "comparison", label: "Comparison" },
];

export function Navbar({ onOpenPalette, onPlayStory }: { onOpenPalette: () => void; onPlayStory: () => void }) {
  const { state, caste, religion, year, topTenOnly, clear } = useFilters();
  const stateName = state === "IN" ? null : STATES.find((s) => s.code === state)?.name;

  const pills: { label: string; onClear: () => void }[] = [];
  if (stateName) pills.push({ label: `📍 ${stateName}`, onClear: () => clear("state") });
  if (caste !== "All") pills.push({ label: `Caste: ${caste}`, onClear: () => clear("caste") });
  if (religion !== "All") pills.push({ label: `Religion: ${religion}`, onClear: () => clear("religion") });
  pills.push({ label: `Year: ${year}`, onClear: () => clear("year") });
  if (topTenOnly) pills.push({ label: "Top 10 only", onClear: () => clear("topTenOnly") });

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-[0_2px_12px_-6px_hsl(var(--saffron)/0.15)]">
      <div className="container mx-auto flex items-center gap-2 md:gap-4 py-2 md:py-3 px-3 md:px-6">
        <a href="#overview" className="flex items-center gap-2 group">
          <Logo size={28} />
          <div className="leading-tight">
            <div className="font-display text-sm md:text-base font-bold text-navy">For the People</div>
            <div className="hidden sm:block text-[10px] text-muted-foreground -mt-0.5 font-mono uppercase tracking-wider">India's Socio-Political Intelligence Platform</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-xs px-2.5 py-1.5 rounded-md text-muted-foreground hover:text-saffron hover:bg-muted transition-colors font-medium">
              {s.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">
          <div className="hidden md:flex items-center gap-2 flex-wrap justify-end">
          {pills.map((p, i) => (
            <button key={i} onClick={p.onClear} className="bp-pill group">
              {p.label}
              <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
            </button>
          ))}
          <button onClick={onPlayStory} className="bp-pill hover:text-saffron min-h-[36px]">
            <PlayCircle className="w-3.5 h-3.5" /> Story
          </button>
          </div>
          <button onClick={onOpenPalette} className="bp-pill hover:text-saffron min-h-[44px]">
            <Command className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Search</span>
            <kbd className="ml-1 font-mono text-[10px] text-muted-foreground">⌘K</kbd>
          </button>
        </div>
      </div>
      {/* Gradient accent line */}
      <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, hsl(var(--saffron)), hsl(var(--india-blue)), hsl(var(--india-purple)))" }} />
    </header>
  );
}
