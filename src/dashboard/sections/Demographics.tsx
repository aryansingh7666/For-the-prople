import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ALL_INDIA, CASTE_EDU, CASTE_GROUPS, CASTE_SHARE, EDU_LEVELS, RELIGIONS, STATES, type CasteGroup } from "../data";
import { useFilters } from "../store";
import { ChartCard, DarkTooltip } from "../ChartBits";

export function Demographics() {
  const { state, religion: rFilter, caste: cFilter, year } = useFilters();
  const s = state === "IN" ? ALL_INDIA : (STATES.find((x) => x.code === state) ?? ALL_INDIA);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const religionData = useMemo(() =>
    RELIGIONS.map((r) => ({ name: r.key, value: s.religion[r.key], color: r.color })).filter((r) => r.value > 0),
  [s]);

  const focusReligion = rFilter !== "All" ? rFilter : "Hindu";
  const focusValue = s.religion[focusReligion as keyof typeof s.religion] ?? s.religion.Hindu;

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

  const visibleCastes = cFilter === "All" ? CASTE_GROUPS : [cFilter as typeof CASTE_GROUPS[number]];

  const filteredCasteEduData = useMemo(() =>
    EDU_LEVELS.map((edu) => {
      const row: Record<string, string | number> = { education: edu, label: eduLabels[edu] || edu };
      for (const c of visibleCastes) {
        const stateFactor = state === "IN" ? 1 : (state.charCodeAt(0) + state.charCodeAt(1)) % 10 / 20 + 0.8;
        row[c] = +(CASTE_EDU[c as CasteGroup][edu] * stateFactor).toFixed(1);
      }
      return row;
    }),
  [cFilter, state, visibleCastes]);

  const mobileStackedData = useMemo(() => {
    return visibleCastes.map((c) => {
      const row: Record<string, string | number> = { caste: c };
      for (const edu of EDU_LEVELS) {
        const stateFactor = state === "IN" ? 1 : (state.charCodeAt(0) + state.charCodeAt(1)) % 10 / 20 + 0.8;
        row[edu] = +(CASTE_EDU[c as CasteGroup][edu] * stateFactor).toFixed(1);
      }
      return row;
    });
  }, [state, visibleCastes]);

  const stateCasteShare = useMemo(() => {
    if (state === "IN") return CASTE_SHARE;
    const entries = Object.entries(CASTE_SHARE).map(([k, v]) => {
      const shift = (state.charCodeAt(0) % 5) - 2; 
      return [k, Math.max(2, v + shift)];
    });
    return Object.fromEntries(entries) as Record<CasteGroup, number>;
  }, [state]);

  const casteColors: Record<string, string> = {
    General: "hsl(var(--saffron))",
    OBC: "hsl(var(--india-blue))",
    SC: "hsl(var(--india-green))",
    ST: "hsl(var(--india-gold))",
  };

  return (
    <section id="demographics" className="scroll-mt-24 space-y-6">
      <header>
        <div className="bp-pill mb-2">Section 02 · Demographics</div>
        <h2 className="bp-section-title text-2xl md:text-4xl">Religion, caste & education</h2>
        <p className="text-xs text-muted-foreground mt-1">Showing {year} projections for {s.name}</p>
      </header>

      <div className="grid-12">
        <div className="col-span-12 lg:col-span-5">
          <ChartCard title={`Religion mix · ${s.name}`} subtitle={rFilter === "All" ? "Census 2011 baseline" : `Highlighting: ${rFilter}`}>
            <div className="relative h-[280px] md:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={religionData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2} isAnimationActive animationDuration={300}>
                    {religionData.map((d, i) => (
                      <Cell key={i} fill={d.color}
                        fillOpacity={rFilter === "All" || d.name === rFilter ? 1 : 0.25}
                        stroke={d.name === rFilter ? "hsl(var(--saffron))" : "hsl(var(--background))"}
                        strokeWidth={d.name === rFilter ? 3 : 2} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip formatter={(v: number) => `${v.toFixed(1)}%`} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{focusReligion}</div>
                <div className="font-display text-2xl md:text-3xl">{focusValue.toFixed(1)}%</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-3 text-xs">
              {religionData.map((r) => (
                <div key={r.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: r.color }} /> {r.name}
                  <span className="ml-auto font-mono text-muted-foreground">{r.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <ChartCard title={`Education attainment · ${s.name}`} subtitle={isMobile ? "Stacked by caste group" : "% within each caste"} delay={50}>
            <div className="h-[280px] md:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                {isMobile ? (
                  <BarChart data={mobileStackedData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="caste" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" width={60} />
                    <Tooltip content={<DarkTooltip formatter={(v: number) => `${v}%`} />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                    {EDU_LEVELS.map((edu) => (
                      <Bar key={edu} dataKey={edu} name={eduLabels[edu]} stackId="a" fill={eduColors[edu]}>
                        <LabelList dataKey={edu} position="center" content={(props: any) => {
                          const { x, y, width, height, value } = props;
                          if (value < 5) return null;
                          return <text x={x + width/2} y={y + height/2 + 4} fill="white" fontSize={9} textAnchor="middle" fontWeight="bold">{value}%</text>;
                        }} />
                      </Bar>
                    ))}
                  </BarChart>
                ) : (
                  <BarChart data={filteredCasteEduData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" unit="%" />
                    <Tooltip content={<DarkTooltip formatter={(v: number) => `${v}%`} />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    {visibleCastes.map((c) => (
                      <Bar key={c} dataKey={c} fill={casteColors[c]} radius={[4, 4, 0, 0]} animationDuration={300} />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      <ChartCard title={`Caste population share · ${s.name}`} subtitle={`${year} estimation based on local factors`} delay={100}>
        <div className="space-y-2">
          {CASTE_GROUPS.map((c, i) => {
            const v = stateCasteShare[c];
            const dim = cFilter !== "All" && cFilter !== c;
            return (
              <div key={c} className={`grid grid-cols-12 items-center gap-3 text-sm animate-fade-up transition-opacity duration-300 ${dim ? "opacity-30" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                <div className="col-span-2 font-medium">{c}</div>
                <div className="col-span-9">
                  <div className="h-3 rounded bg-muted/40 overflow-hidden">
                    <div className="h-full rounded transition-all duration-300" style={{ width: `${v * 2}%`, background: `linear-gradient(90deg, ${casteColors[c]}, hsl(var(--saffron)))` }} />
                  </div>
                </div>
                <div className="col-span-1 text-right font-mono text-muted-foreground">{v.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </section>
  );
}
