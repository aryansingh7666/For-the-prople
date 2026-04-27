import { CartesianGrid, Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { Fragment } from "react";
import { CORRELATION, CORRELATION_LABELS, STATES } from "../data";
import { ChartCard, DarkTooltip } from "../ChartBits";
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

export function SocioEconomic() {
  const { religion, state: stateFilter } = useFilters();
  const data = STATES.map((s) => ({
    x: s.literacy, y: s.gdp_per_capita / 1000, z: s.population_m, name: s.name, code: s.code,
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
            <div className="h-[300px] md:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="Literacy" unit="%" domain={[55, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" />
                  <YAxis type="number" dataKey="y" name="GDP/cap" unit="k" domain={[40, 480]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" />
                  <ZAxis type="number" dataKey="z" range={[60, 1200]} />
                  <Tooltip content={<DarkTooltip formatter={(v: number, n: string) => n === "GDP/cap" ? `₹${v}k` : n === "Literacy" ? `${v}%` : `${v}M`} />} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={data} fill="hsl(var(--saffron))" isAnimationActive animationDuration={300}>
                    {data.map((d, i) => {
                      const isStateMatch = stateFilter !== "IN" && d.code === stateFilter;
                      const dimByReligion = religion !== "All" && d.religionShare < 15;
                      const base = d.x > 80 ? "hsl(var(--india-green))" : d.x > 70 ? "hsl(var(--india-blue))" : "hsl(var(--saffron))";
                      return (
                        <Cell key={i}
                          fill={isStateMatch ? "hsl(var(--india-red))" : base}
                          fillOpacity={dimByReligion ? 0.18 : isStateMatch ? 1 : 0.7}
                          stroke={isStateMatch ? "hsl(var(--india-red))" : "none"}
                          strokeWidth={isStateMatch ? 2 : 0} />
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
