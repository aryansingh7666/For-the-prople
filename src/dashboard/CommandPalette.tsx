import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useFilters } from "./store";
import { PARTY_2024, STATES } from "./data";
import { BarChart3, Building2, MapPin, Users, Vote } from "lucide-react";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; }

const SECTIONS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "demographics", label: "Demographics", icon: Users },
  { id: "socioeconomic", label: "Socio-Economic", icon: Building2 },
  { id: "politics", label: "Politics", icon: Vote },
  { id: "transparency", label: "Transparency", icon: BarChart3 },
  { id: "comparison", label: "Comparison", icon: MapPin },
];

export function CommandPalette({ open, onOpenChange }: Props) {
  const { setState, setYear } = useFilters();

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    onOpenChange(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Try 'Bihar turnout', 'BJP', '2019', 'transparency'…" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Sections">
          {SECTIONS.map((s) => (
            <CommandItem key={s.id} onSelect={() => go(s.id)}>
              <s.icon className="w-4 h-4 mr-2 text-saffron" /> Jump to {s.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="States">
          {STATES.map((s) => (
            <CommandItem key={s.code} value={`state ${s.name} ${s.code} turnout literacy`} onSelect={() => { setState(s.code); go("overview"); }}>
              <MapPin className="w-4 h-4 mr-2 text-india-blue" /> Filter by {s.name}
              <span className="ml-auto text-xs text-muted-foreground font-mono">{s.code}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Election year">
          {([2014, 2019, 2024] as const).map((y) => (
            <CommandItem key={y} value={`year ${y} turnout election`} onSelect={() => { setYear(y); go("politics"); }}>
              <Vote className="w-4 h-4 mr-2 text-india-green" /> Show {y} election
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Parties">
          {PARTY_2024.map((p) => (
            <CommandItem key={p.party} value={`party ${p.party} criminal cases representation`} onSelect={() => go("transparency")}>
              <BarChart3 className="w-4 h-4 mr-2" style={{ color: p.color }} /> {p.party} · transparency
              <span className="ml-auto text-xs text-muted-foreground font-mono">{p.seats} seats</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
