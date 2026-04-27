import { CartesianGrid, Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { Fragment } from "react";
import { CORRELATION, CORRELATION_LABELS, STATES } from "../data";
import { ChartCard } from "../ChartBits";
import { useFilters } from "../store";

function corrColor(v: number) {
  // RdBu: -1 red, 0 grey, +1 blue
  const t = (v + 1) / 2;
  if (t < 0.5) {
    const k = t / 0.5;
    return `hsl(var(--india-red) / ${1 - k * 0.7})`;
  }
  const k = (t - 0.5) / 0.5;
  return `hsl(var(--india-blue) / ${0.3 + k * 0.7})`;
}

const BubbleTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] border-l-[3px] border-[#2563EB] p-[14px_16px] animate-in fade-in duration-200 pointer-events-none min-w-[200px]">
        <div className="font-bold text-base text-slate-900 mb-1.5">{d.name}</div>
        <div className="space-y-1 text-[13px] text-slate-600">
          <div className="flex justify-between"><span>Literacy:</span> <span className="font-mono font-bold text-slate-900">{d.x}%</span></div>
          <div className="flex justify-between"><span>GDP/capita:</span> <span className="font-mono font-bold text-slate-900">₹{(d.y/1000).toFixed(0)}k</span></div>
          <div className="flex justify-between"><span>HDI Score:</span> <span className="font-mono font-bold text-slate-900">{d.hdi.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Population:</span> <span className="font-mono font-bold text-slate-900">{d.z.toFixed(1)}M</span></div>
        </div>
      </div>
    );
  }
  return null;
};

export function SocioEconomic() {
  const { religion, state: stateFilter } = useFilters();
  const data = STATES.map((s) => ({
    x: s.literacy, y: s.gdp_per_capita, z: s.population_m, name: s.name, code: s.code,
    hdi: s.hdi,
    religionShare: s.religion[religion as keyof typeof s.religion] ?? 0,
  }));

  return (
    <section id="socioeconomic" className="scroll-mt-24 space-y-6">
      <header>
        <div className="bp-pill mb-2">Section 03 · Socio-Economic</div>
        <h2 className="bp-section-title text-2xl md:text-4xl">The wealth–education spiral</h2>
      </header>

      <div className="grid-12">
        <div className="col-span-12 lg:col-span-7">
          <ChartCard title="Literacy vs GDP per capita" subtitle={religion === "All" ? "Bubble size = population (millions)" : `Highlighting states where ${religion} ≥ 15%`}>
            <div className="h-[340px] md:h-[400px] relative overflow-visible">
              <div className="absolute top-2 right-2 bg-card/80 p-2 rounded-md border border-border shadow-sm z-10 text-[10px] md:text-[11px] space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-muted-foreground">High HDI (&gt;0.65)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  <span className="text-muted-foreground">Low HDI (&lt;0.65)</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="Literacy" unit="%" domain={[55, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" label={{ value: "Literacy %", position: "bottom", offset: 0, fontSize: 11 }} />
                  <YAxis type="number" dataKey="y" name="GDP/cap" domain={[40000, 500000]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" label={{ value: "GDP per capita (₹)", angle: -90, position: "insideLeft", fontSize: 11, dy: 60 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <ZAxis type="number" dataKey="z" range={[20, 70]} />
                  <Tooltip content={<BubbleTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={data} isAnimationActive animationDuration={400}>
                    {data.map((d, i) => {
                      const isStateMatch = stateFilter !== "IN" && d.code === stateFilter;
                      const dimByReligion = religion !== "All" && d.religionShare < 15;
                      const base = d.hdi >= 0.65 ? "#10B981" : "#2563EB";
                      return (
                        <Cell key={i}
                          fill={isStateMatch ? "hsl(var(--india-red))" : base}
                          fillOpacity={dimByReligion ? 0.2 : 0.85}
                          stroke="white"
                          strokeWidth={2}
                          className="transition-all duration-150 hover:scale-[1.15] cursor-pointer origin-center"
                          style={{ transformOrigin: "center" }}
                        />
                      );
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <ChartCard title="Correlation matrix" subtitle="Pearson r across 5 indicators · 20 states" delay={50}>
            <div className="grid" style={{ gridTemplateColumns: `auto repeat(${CORRELATION_LABELS.length}, 1fr)`, gap: 4 }}>
              <div />
              {CORRELATION_LABELS.map((l) => (<div key={l} className="text-[10px] font-mono text-muted-foreground text-center pb-1">{l}</div>))}
              {CORRELATION.map((row, i) => (
                <Fragment key={i}>
                  <div key={`l-${i}`} className="text-[10px] font-mono text-muted-foreground pr-2 self-center text-right">{CORRELATION_LABELS[i]}</div>
                  {row.map((v, j) => (
                    <div key={`${i}-${j}`} className="aspect-square rounded flex items-center justify-center text-[11px] font-mono" style={{ background: corrColor(v), color: Math.abs(v) > 0.6 ? "white" : "hsl(var(--foreground))" }}>
                      {v.toFixed(2)}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-muted-foreground flex items-center gap-2">
              <span className="w-3 h-3 rounded" style={{ background: "hsl(var(--india-red))" }} /> negative
              <span className="w-3 h-3 rounded mx-2" style={{ background: "hsl(var(--muted))" }} /> none
              <span className="w-3 h-3 rounded" style={{ background: "hsl(var(--india-blue))" }} /> positive
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Literacy ↔ HDI", v: 0.93, note: "The strongest pair in the matrix." },
          { label: "Urbanisation ↔ GDP", v: 0.81, note: "Cities concentrate productivity." },
          { label: "Wealth ↔ Turnout", v: -0.05, note: "Wealth doesn't bring voters out." },
        ].map((c, i) => (
          <div key={i} className="bp-card p-5 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</div>
            <div className="bp-kpi-number text-4xl mt-2">{c.v > 0 ? "+" : ""}{c.v.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-2">{c.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
