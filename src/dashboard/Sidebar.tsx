import { useEffect, useState } from "react";
import { CASTE_GROUPS, RELIGIONS, STATES } from "./data";
import { useFilters, useHasActiveFilters } from "./store";
import { ChevronLeft, Filter } from "lucide-react";
import { Logo } from "../components/Logo";

export function FilterSidebar({ embedded = false }: { embedded?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  // Auto-collapse on tablet (md ≤ width < lg)
  useEffect(() => {
    if (embedded) return;
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setCollapsed(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [embedded]);
  const f = useFilters();
  const active = useHasActiveFilters();

  if (collapsed && !embedded) {
    return (
      <button onClick={() => setCollapsed(false)} title="Open filters"
        className="hidden md:flex sticky top-24 self-start relative w-[60px] min-h-[44px] items-center justify-center rounded-xl bg-navy text-white hover:bg-navy-deep transition-colors shadow-lg">
        <Logo size={24} className="opacity-80" />
        {active && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-saffron" />}
      </button>
    );
  }
  return (
    <aside className={
      embedded
        ? "w-full bg-navy text-white p-5 space-y-5 rounded-t-2xl"
        : "hidden md:block sticky top-24 self-start w-[280px] shrink-0 rounded-2xl bg-navy text-white p-5 space-y-5 shadow-[0_8px_32px_-12px_hsl(var(--navy)/0.4)]"
    }>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <div className="font-display text-sm font-bold text-white leading-tight">For the People</div>
            <div className="text-[9px] text-sky-soft uppercase tracking-tighter opacity-70">Intelligence</div>
          </div>
        </div>
        {!embedded && (
          <button onClick={() => setCollapsed(true)} className="text-sky-soft hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center">
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="pt-2 border-t border-white/10">
        <div className="text-[11px] text-sky-soft uppercase tracking-wider font-bold mb-3">Filters</div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wider text-sky-soft font-semibold flex items-center gap-1.5">
          State {f.state !== "IN" && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
        </label>
        <select value={f.state} onChange={(e) => f.setState(e.target.value)} className="navy-input">
          <option value="IN">All India</option>
          {STATES.map((s) => (<option key={s.code} value={s.code}>{s.name}</option>))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wider text-sky-soft font-semibold flex items-center gap-1.5">
          Caste group {f.caste !== "All" && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
        </label>
        <div className="flex flex-wrap gap-1">
          {(["All", ...CASTE_GROUPS] as const).map((c) => (
            <button key={c} onClick={() => f.setCaste(c)}
              className={`text-xs px-3 py-2 min-h-[36px] rounded-md border transition-colors ${f.caste === c ? "border-saffron bg-saffron text-white" : "border-white/20 text-sky-soft hover:text-white hover:border-white/40"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wider text-sky-soft font-semibold flex items-center gap-1.5">
          Religion {f.religion !== "All" && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
        </label>
        <select value={f.religion} onChange={(e) => f.setReligion(e.target.value as "All" | (typeof RELIGIONS)[number]["key"])} className="navy-input">
          <option value="All">All</option>
          {RELIGIONS.map((r) => (<option key={r.key} value={r.key}>{r.key}</option>))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[11px] uppercase tracking-wider text-sky-soft font-semibold flex items-center gap-1.5">
          Election year {f.year !== 2024 && <span className="w-1.5 h-1.5 rounded-full bg-saffron" />}
        </label>
        <div className="flex gap-1">
          {([2014, 2019, 2024] as const).map((y) => (
            <button key={y} onClick={() => f.setYear(y)}
              className={`flex-1 text-sm py-2.5 min-h-[44px] rounded-md border transition-colors ${f.year === y ? "border-saffron bg-saffron text-white" : "border-white/20 text-sky-soft hover:text-white hover:border-white/40"}`}>
              {y}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center justify-between text-sm cursor-pointer text-white min-h-[44px]">
        <span>Top 10 only <span className="text-[11px] text-sky-soft">· turnout chart</span></span>
        <input type="checkbox" checked={f.topTenOnly} onChange={(e) => f.setTopTenOnly(e.target.checked)}
          className="w-5 h-5 accent-[hsl(var(--saffron))]" />
      </label>

      <div className="flex gap-2">
        {active && (
          <button onClick={f.clearAll}
            className="flex-1 min-h-[44px] rounded-lg border border-white/30 text-white text-xs font-semibold hover:bg-white/10 transition-colors">
            CLEAR ALL
          </button>
        )}
        <button className="btn-pulse flex-1 min-h-[44px]" style={{ background: "linear-gradient(90deg, hsl(var(--saffron)), hsl(var(--india-blue)))" }}>
          TELEMETRY
        </button>
      </div>

      <div className="pt-4 border-t border-white/10 text-[11px] text-sky-soft leading-relaxed">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
          <span className="font-mono text-white">API STABLE</span>
          <span className="ml-auto font-mono">12ms</span>
        </div>
        Data: Census 2011, ECI, ADR India, RBI Handbook (rounded).
      </div>
    </aside>
  );
}
