import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RELIGIONS, STATES, type StateRecord } from "../data";
import { ChartCard, DarkTooltip } from "../ChartBits";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useFilters } from "../store";

function StateSelect({ value, onChange, color }: { value: string; onChange: (s: string) => void; color: string }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className={`bg-card border-2 rounded-md px-3 py-2 text-sm font-medium focus:outline-none`}
      style={{ borderColor: color }}>
      {STATES.map((s) => (<option key={s.code} value={s.code}>{s.name}</option>))}
    </select>
  );
}

function ReligionDonut({ s, color }: { s: StateRecord; color: string }) {
  const data = RELIGIONS.map((r) => ({ name: r.key, value: s.religion[r.key], color: r.color })).filter((d) => d.value > 0);
  return (
    <div className="relative h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2}>
            {data.map((d, i) => (<Cell key={i} fill={d.color} />))}
          </Pie>
          <Tooltip content={<DarkTooltip formatter={(v: number) => `${v.toFixed(1)}%`} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="font-display text-base" style={{ color }}>{s.code}</div>
          <div className="text-[10px] text-muted-foreground">{s.name}</div>
        </div>
      </div>
    </div>
  );
}

export function Comparison() {
  const { state, year, religion, caste } = useFilters();
  const [aCode, setA] = useState("MH");
  const [bCode, setB] = useState("BR");

  useEffect(() => {
    if (state !== "IN" && state !== bCode) {
      setA(state);
    }
  }, [state, bCode]);

  const A = STATES.find((s) => s.code === aCode)!;
  const B = STATES.find((s) => s.code === bCode)!;

  const metrics = [
    { key: "Population (M)", a: A.population_m, b: B.population_m, fmt: (v: number) => v.toFixed(1) },
    { key: "Literacy %", a: A.literacy, b: B.literacy, fmt: (v: number) => `${v.toFixed(1)}%` },
    { key: "Urban %", a: A.urban_pct, b: B.urban_pct, fmt: (v: number) => `${v.toFixed(1)}%` },
    { key: "GDP/cap ₹k", a: A.gdp_per_capita / 1000, b: B.gdp_per_capita / 1000, fmt: (v: number) => `₹${v.toFixed(0)}k` },
    { key: `Turnout ${year} %`, a: A.turnout[year], b: B.turnout[year], fmt: (v: number) => `${v.toFixed(1)}%` },
  ];

  if (religion !== "All") {
    metrics.push({
      key: `${religion} Pop %`,
      a: A.religion[religion as keyof typeof A.religion] ?? 0,
      b: B.religion[religion as keyof typeof B.religion] ?? 0,
      fmt: (v: number) => `${v.toFixed(1)}%`
    });
  }

  const barData = metrics.map((m) => ({ metric: m.key, [A.code]: m.a, [B.code]: m.b }));

  return (
    <section id="comparison" className="scroll-mt-24 space-y-6">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="bp-pill mb-2">Section 06 · Comparison</div>
          <h2 className="bp-section-title text-2xl md:text-4xl">State vs State</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <StateSelect value={aCode} onChange={setA} color="hsl(var(--saffron))" />
          <span className="text-muted-foreground font-display text-xl text-center">vs</span>
          <StateSelect value={bCode} onChange={setB} color="hsl(var(--india-blue))" />
        </div>
      </header>

      <div className="grid-12">
        <div className="col-span-12 lg:col-span-8">
          <ChartCard title="Side-by-side metrics" subtitle="5 indicators">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey={A.code} name={A.name} fill="hsl(var(--saffron))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={B.code} name={B.name} fill="hsl(var(--india-blue))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        <div className="col-span-12 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bp-card p-4"><ReligionDonut s={A} color="hsl(var(--saffron))" /></div>
          <div className="bp-card p-4"><ReligionDonut s={B} color="hsl(var(--india-blue))" /></div>
        </div>
      </div>

      <ChartCard title="Head-to-head" subtitle="Winner of each metric is highlighted">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="text-left py-2 px-3">Metric</th>
                <th className="text-right py-2 px-3 text-saffron">{A.name}</th>
                <th className="text-center py-2 px-3">Δ</th>
                <th className="text-right py-2 px-3 text-india-blue">{B.name}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => {
                const aWins = m.a >= m.b;
                const delta = m.a - m.b;
                return (
                  <tr key={m.key} className="border-b border-border/40">
                    <td className="py-2 px-3">{m.key}</td>
                    <td className={`py-2 px-3 text-right font-mono ${aWins ? "text-saffron font-semibold" : "text-muted-foreground"}`}>
                      {m.fmt(m.a)}{aWins && " ★"}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-xs">
                      {delta > 0 ? <span className="text-india-green inline-flex items-center gap-1"><ArrowUp className="w-3 h-3" />{Math.abs(delta).toFixed(1)}</span>
                                : <span className="text-india-red inline-flex items-center gap-1"><ArrowDown className="w-3 h-3" />{Math.abs(delta).toFixed(1)}</span>}
                    </td>
                    <td className={`py-2 px-3 text-right font-mono ${!aWins ? "text-india-blue font-semibold" : "text-muted-foreground"}`}>
                      {m.fmt(m.b)}{!aWins && " ★"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </section>
  );
}
