import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PolarAngleAxis } from "recharts";
import { CANDIDATES, partyTransparency } from "../data";
import { ALL_INDIA, STATES } from "../data";
import { useFilters } from "../store";
import { ChartCard, DarkTooltip } from "../ChartBits";

function Gauge({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative w-[140px] h-[140px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} stroke="#F1F5F9" strokeWidth="12" fill="none" />
          <circle 
            cx="70" cy="70" r={radius} stroke={color} strokeWidth="12" fill="none"
            strokeDasharray={circumference}
            style={{ 
              strokeDashoffset: circumference,
              animation: `gauge-fill 1.2s ease-out forwards`,
              strokeLinecap: "round"
            }}
            className="transition-all duration-1000"
          />
          <style>{`
            @keyframes gauge-fill {
              from { stroke-dashoffset: ${circumference}; }
              to { stroke-dashoffset: ${offset}; }
            }
          `}</style>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="bp-kpi-number text-2xl font-bold">{value.toFixed(1)}%</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</span>
        </div>
      </div>
    </div>
  );
}

export function Transparency() {
  const { state, religion, caste } = useFilters();
  const filteredCandidates = useMemo(() => {
    let arr = CANDIDATES;
    if (state !== "IN") arr = arr.filter((c) => c.state === state);
    if (caste !== "All") arr = arr.filter((c) => c.caste === caste);
    if (religion !== "All") {
      const matchStates = new Set(STATES.filter((s) => (s.religion[religion as keyof typeof s.religion] ?? 0) >= 10).map((s) => s.code));
      arr = arr.filter((c) => matchStates.has(c.state));
    }
    return arr;
  }, [state, religion, caste]);

  const total = filteredCandidates.length || 1;
  const crim = filteredCandidates.filter((c) => c.criminal).length;
  const ser = filteredCandidates.filter((c) => c.serious).length;

  const histogram = useMemo(() => {
    const bins = [0.1, 0.5, 1, 5, 10, 50, 100, 500, 1000];
    const labels = bins.map((b) => `≤${b}`);
    const all = new Array(bins.length).fill(0);
    const win = new Array(bins.length).fill(0);
    for (const c of filteredCandidates) {
      const idx = bins.findIndex((b) => c.assets_cr <= b);
      const i = idx === -1 ? bins.length - 1 : idx;
      all[i]++; if (c.winner) win[i]++;
    }
    return labels.map((l, i) => ({ bucket: l, all: all[i], winners: win[i] }));
  }, [filteredCandidates]);

  const eduLabels: Record<string, string> = {
    Illiterate: "None",
    Primary: "Primary",
    Secondary: "Sec.",
    HigherSec: "H.Sec",
    "Graduate+": "Grad.",
    PhD: "PhD"
  };

  const eduColors: Record<string, string> = {
    Illiterate: "#94A3B8",
    Primary: "#93C5FD",
    Secondary: "#60A5FA",
    HigherSec: "#3B82F6",
    "Graduate+": "#2563EB",
    PhD: "#1E3A8A",
  };

  const eduBreakdown = useMemo(() => {
    const buckets: Record<string, number> = {};
    for (const c of filteredCandidates) buckets[c.education] = (buckets[c.education] || 0) + 1;
    const order = ["Illiterate", "Primary", "Secondary", "HigherSec", "Graduate+", "PhD"];
    return order.map((e) => ({ 
      education: e, 
      label: eduLabels[e] || e,
      count: buckets[e] || 0, 
      pct: ((buckets[e] || 0) / total) * 100 
    }));
  }, [filteredCandidates, total]);

  const parties = useMemo(() => partyTransparency(filteredCandidates), [filteredCandidates]);
  const [sortBy, setSortBy] = useState<"criminal_pct" | "serious_pct" | "median_assets">("criminal_pct");
  const sortedParties = useMemo(() => [...parties].sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number)), [parties, sortBy]);

  function redCell(v: number, max: number) {
    const t = v / max;
    return `hsl(var(--india-red) / ${0.08 + t * 0.5})`;
  }
  const maxC = Math.max(...parties.map((p) => p.criminal_pct), 1);
  const maxS = Math.max(...parties.map((p) => p.serious_pct), 1);

  return (
    <section id="transparency" className="scroll-mt-24 space-y-6">
      <header>
        <div className="bp-pill mb-2">Section 05 · Transparency</div>
        <h2 className="bp-section-title text-2xl md:text-4xl">Who runs for parliament?</h2>
        {(state !== "IN" || religion !== "All" || caste !== "All") && (
          <p className="text-xs text-muted-foreground mt-1">
            Showing {total} candidates {state !== "IN" && `from ${STATES.find((s) => s.code === state)?.name}`}
            {religion !== "All" && ` · ${religion}-majority regions`}
            {caste !== "All" && ` · ${caste} group`}
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-1 bp-card p-2 md:p-4">
          <Gauge value={(crim / total) * 100} label="Criminal" color="#EF4444" />
        </div>
        <div className="col-span-1 bp-card p-2 md:p-4">
          <Gauge value={(ser / total) * 100} label="Serious" color="#2563EB" />
        </div>
        <div className="col-span-2 md:col-span-2">
          <ChartCard title="Declared assets" subtitle="₹ Crore · log-scale" delay={50}>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogram} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="bucket" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} stroke="hsl(var(--border))" />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
                  <Bar dataKey="winners" name="Winners" fill="hsl(var(--saffron))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Education breakdown of all candidates" subtitle={`${total} synthetic records`}>
        <div className="space-y-2.5 py-1">
          {eduBreakdown.map((e, i) => (
            <div key={e.education} className="grid grid-cols-12 items-center gap-2 md:gap-3 text-xs md:text-sm animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="col-span-3 md:col-span-2 font-medium truncate">{e.label}</div>
              <div className="col-span-7 md:col-span-9">
                <div className="h-2.5 md:h-3 rounded-full bg-muted/40 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, e.pct * 2.5)}%`, background: eduColors[e.education] }} />
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 text-right font-mono text-muted-foreground">{e.pct.toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard title="Party transparency table" subtitle="Sortable · red gradient = higher concern" delay={100}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left py-2 px-3">Party</th>
                <th className="text-right py-2 px-3">Candidates</th>
                {(["criminal_pct", "serious_pct", "median_assets"] as const).map((k) => (
                  <th key={k} className="text-right py-2 px-3">
                    <button onClick={() => setSortBy(k)} className={`hover:text-saffron ${sortBy === k ? "text-saffron" : ""}`}>
                      {k === "criminal_pct" ? "Criminal %" : k === "serious_pct" ? "Serious %" : "Median assets ₹Cr"}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedParties.map((p) => (
                <tr key={p.party} className="border-b border-border/40 hover:bg-card/50 transition-colors">
                  <td className="py-2 px-3 font-medium">{p.party}</td>
                  <td className="py-2 px-3 text-right font-mono">{p.total}</td>
                  <td className="py-2 px-3 text-right font-mono" style={{ background: redCell(p.criminal_pct, maxC) }}>{p.criminal_pct.toFixed(1)}%</td>
                  <td className="py-2 px-3 text-right font-mono" style={{ background: redCell(p.serious_pct, maxS) }}>{p.serious_pct.toFixed(1)}%</td>
                  <td className="py-2 px-3 text-right font-mono">₹{p.median_assets.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </section>
  );
}
