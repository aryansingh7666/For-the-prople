import { useEffect, useMemo, useState } from "react";
import { ALL_INDIA, CANDIDATES, INSIGHTS, STATES } from "../data";
import { useFilters } from "../store";
import { useCountUp } from "../hooks";
import { ChartCard } from "../ChartBits";
import { IndiaMap } from "../IndiaMap";
import { ArrowDown, ArrowUp } from "lucide-react";

interface KpiDef { key: string; label: string; value: number; suffix: string; decimals: number; spark: number[]; note: string; color: string; }

function useKpis(): KpiDef[] {
  const { state, year, religion, caste } = useFilters();
  const s = state === "IN" ? ALL_INDIA : (STATES.find((x) => x.code === state) ?? ALL_INDIA);

  const filteredCands = useMemo(() => {
    let arr = CANDIDATES;
    if (state !== "IN") arr = arr.filter(c => c.state === state);
    if (caste !== "All") arr = arr.filter(c => c.caste === caste);
    if (religion !== "All") {
      const matchStates = new Set(STATES.filter(st => (st.religion[religion as keyof typeof st.religion] ?? 0) >= 10).map(st => st.code));
      arr = arr.filter(c => matchStates.has(c.state));
    }
    return arr;
  }, [state, religion, caste]);

  const crimPct = (filteredCands.filter(c => c.criminal).length / (filteredCands.length || 1)) * 100;
  const sortedAssets = [...filteredCands].map(c => c.assets_cr).sort((a, b) => a - b);
  const medianAssets = sortedAssets.length ? sortedAssets[Math.floor(sortedAssets.length / 2)] : 0;

  return [
    { key: "pop", label: "Population", value: s.population_m, suffix: "M", decimals: 1,
      spark: [1210, 1280, 1340, 1390, 1410, 1428], color: "saffron",
      note: `Data for ${s.name}. India is the world's most populous country.` },
    { key: "lit", label: "Literacy Rate", value: s.literacy, suffix: "%", decimals: 1,
      spark: [64.8, 70.0, 71.5, 73.0, 73.6, 74.0], color: "india-blue",
      note: `Baseline for ${s.name}. Gender gap narrowing slowly.` },
    { key: "gdp", label: "GDP per capita", value: s.gdp_per_capita, suffix: "₹", decimals: 0,
      spark: [110, 130, 150, 170, 185, 198], color: "india-green",
      note: `Nominal INR for ${s.name}. Maharashtra leads large states.` },
    { key: "turn", label: `Voter Turnout ${year}`, value: s.turnout[year], suffix: "%", decimals: 1,
      spark: [s.turnout[2014] - 2, s.turnout[2014], (s.turnout[2014]+s.turnout[2019])/2, s.turnout[2019], (s.turnout[2019]+s.turnout[2024])/2, s.turnout[2024]],
      color: "india-gold", note: `Turnout in ${s.name} for the ${year} general election.` },
    { key: "crim", label: "Candidates w/ Cases", value: crimPct, suffix: "%", decimals: 1,
      spark: [17, 21, 24, 27, 29, 31], color: "india-red",
      note: religion !== "All" || caste !== "All" ? `Filtered by ${religion}/${caste}.` : `ADR analysis: share rose to 31% in 2024.` },
    { key: "assets", label: "Median MP Assets", value: medianAssets, suffix: "₹Cr", decimals: 2,
      spark: [1.0, 1.4, 1.9, 2.3, 2.8, 3.2], color: "india-purple",
      note: `Based on ${filteredCands.length} candidates in ${s.name}.` },
  ];
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 120, h = 36;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9">
      <polyline points={pts} fill="none" stroke={`hsl(var(--${color}))`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - ((v - min) / (max - min || 1)) * h} r="1.8" fill={`hsl(var(--${color}))`} />
      ))}
    </svg>
  );
}

function formatCurrency(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
  return `₹${v.toLocaleString("en-IN")}`;
}

function KpiCard({ k, idx, pulse }: { k: KpiDef; idx: number; pulse?: number }) {
  const [target, setTarget] = useState(k.value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  useEffect(() => { setTarget(k.value); }, [k.value]);
  useEffect(() => {
    if (pulse == null) return;
    const dir = pulse > 0 ? "up" : "down";
    setFlash(dir);
    setTarget((t) => +(t * (1 + pulse / 100)).toFixed(4));
    const id = setTimeout(() => setFlash(null), 1100);
    return () => clearTimeout(id);
  }, [pulse]);

  const value = useCountUp(target, 1200, k.decimals);
  const isLargeNumber = value >= 100000;

  return (
    <div className="perspective animate-fade-up flip-card" style={{ animationDelay: `${300 + idx * 90}ms` }}>
      <div className="flip-inner relative bp-card p-5 h-[150px]">
        <div className={`flip-face absolute inset-0 p-5 ${flash === "up" ? "bp-flash-up" : flash === "down" ? "bp-flash-down" : ""}`}>
          <div className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground truncate">{k.label}</div>
          <div className="mt-3 flex items-baseline gap-1 overflow-hidden">
            <span 
              className="bp-kpi-number text-2xl md:text-4xl block w-full truncate"
              style={{ fontSize: isLargeNumber ? "clamp(1.2rem, 4vw, 1.6rem)" : "clamp(1.2rem, 4vw, 2.2rem)" }}
            >
              {k.key === "gdp" || (k.suffix === "₹" && value >= 100000) ? formatCurrency(value) : (
                <>
                  {k.suffix === "₹" ? "₹" : ""}
                  {value.toLocaleString("en-IN", { maximumFractionDigits: k.decimals })}
                  {k.suffix !== "₹" && <span className="text-xs md:text-base ml-0.5 text-muted-foreground">{k.suffix}</span>}
                </>
              )}
            </span>
          </div>
          <div className="absolute bottom-3 left-5 right-5 flex items-center gap-2 text-[11px] font-mono">
            {flash === "up" ? <ArrowUp className="w-3 h-3 text-india-green" /> : flash === "down" ? <ArrowDown className="w-3 h-3 text-india-red" /> : null}
            <span className="text-muted-foreground opacity-0">.</span>
          </div>
        </div>
        <div className="flip-face flip-back absolute inset-0 p-5 bg-card rounded-xl border border-saffron/40">
          <div className="text-[10px] uppercase tracking-wider text-saffron">{k.label} • trend</div>
          <div className="mt-3"><Sparkline data={k.spark} color={k.color} /></div>
          <p className="mt-2 text-[10px] leading-snug text-muted-foreground line-clamp-2">{k.note}</p>
        </div>
      </div>
    </div>
  );
}

export function Overview() {
  const kpis = useKpis();
  const [pulses, setPulses] = useState<Record<string, number>>({});
  useEffect(() => {
    const id = setInterval(() => {
      const next: Record<string, number> = {};
      const shuffled = [...kpis].sort(() => Math.random() - 0.5).slice(0, 3);
      for (const k of shuffled) next[k.key] = (Math.random() - 0.5) * 0.2; // ±0.1%
      setPulses(next);
    }, 8000);
    return () => clearInterval(id);
  }, [kpis]);

  const [sortKey, setSortKey] = useState<"population_m" | "literacy" | "gdp_per_capita" | "turnout">("population_m");
  const sorted = useMemo(() => {
    return [...STATES].sort((a, b) => {
      if (sortKey === "turnout") return b.turnout[2024] - a.turnout[2024];
      return (b[sortKey] as number) - (a[sortKey] as number);
    });
  }, [sortKey]);

  function cellColor(v: number, min: number, max: number) {
    const t = (v - min) / (max - min || 1);
    return `linear-gradient(90deg, hsl(var(--saffron) / ${0.06 + t * 0.35}), transparent)`;
  }
  const litMin = Math.min(...STATES.map((s) => s.literacy));
  const litMax = Math.max(...STATES.map((s) => s.literacy));
  const gdpMin = Math.min(...STATES.map((s) => s.gdp_per_capita));
  const gdpMax = Math.max(...STATES.map((s) => s.gdp_per_capita));
  const turnMin = Math.min(...STATES.map((s) => s.turnout[2024]));
  const turnMax = Math.max(...STATES.map((s) => s.turnout[2024]));

  return (
    <section id="overview" className="scroll-mt-24 space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="bp-pill mb-2">Section 01 · Overview</div>
          <h2 className="bp-section-title text-2xl md:text-4xl">India at a glance</h2>
          <p className="text-muted-foreground text-sm mt-1">Live snapshot of demographics, economy and democracy. Click any state on the map to filter the dashboard.</p>
        </div>
      </header>

      <div className="grid-12">
        <div className="col-span-12 lg:col-span-7">
          <ChartCard title="India tile-map" subtitle="Color: literacy rate · click a state to filter">
            <IndiaMap metric="literacy" drawAnimate />
          </ChartCard>
        </div>
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
          {kpis.map((k, i) => (<KpiCard key={k.key} k={k} idx={i} pulse={pulses[k.key]} />))}
        </div>
      </div>

      <ChartCard title="AI insight stream" subtitle="Auto-generated from the underlying datasets">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {INSIGHTS.map((it, i) => (
            <div key={i} className="insight-card animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{it.emoji}</span>
                <span className="font-display text-base">{it.title}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{it.text}</p>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="State leaderboard" subtitle="Sortable · gradient-coded">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left py-2 px-3">State</th>
                {(["population_m", "literacy", "gdp_per_capita", "turnout"] as const).map((k) => (
                  <th key={k} className="text-right py-2 px-3">
                    <button onClick={() => setSortKey(k)} className={`hover:text-saffron transition-colors ${sortKey === k ? "text-saffron" : ""}`}>
                      {k === "population_m" ? "Pop (M)" : k === "literacy" ? "Literacy %" : k === "gdp_per_capita" ? "GDP/cap ₹" : "Turnout 2024 %"}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((s, i) => (
                <tr key={s.code} className="border-b border-border/40 hover:bg-card/50 transition-colors">
                  <td className="py-2 px-3 font-medium">
                    <span className="font-mono text-xs text-muted-foreground mr-2">{i + 1}</span>{s.name}
                  </td>
                  <td className="py-2 px-3 text-right font-mono">{s.population_m.toFixed(1)}</td>
                  <td className="py-2 px-3 text-right font-mono" style={{ background: cellColor(s.literacy, litMin, litMax) }}>{s.literacy.toFixed(1)}</td>
                  <td className="py-2 px-3 text-right font-mono" style={{ background: cellColor(s.gdp_per_capita, gdpMin, gdpMax) }}>₹{(s.gdp_per_capita / 1000).toFixed(0)}k</td>
                  <td className="py-2 px-3 text-right font-mono" style={{ background: cellColor(s.turnout[2024], turnMin, turnMax) }}>{s.turnout[2024].toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </section>
  );
}
