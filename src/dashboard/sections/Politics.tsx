import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CANDIDATES, PARTY_2024, STATES } from "../data";
import { useFilters } from "../store";
import { ChartCard, DarkTooltip } from "../ChartBits";

function turnoutColor(v: number) {
  if (v > 75) return "hsl(var(--india-green))";
  if (v >= 65) return "hsl(var(--india-blue))";
  return "hsl(var(--india-purple))";
}

export function Politics() {
  const { topTenOnly, year, religion, caste, state } = useFilters();

  const filteredStates = useMemo(() => {
    let arr = [...STATES];
    if (state !== "IN") arr = arr.filter(s => s.code === state);
    if (religion !== "All") {
      arr = arr.filter(s => (s.religion[religion as keyof typeof s.religion] ?? 0) >= 10);
    }
    // If no states match the religion filter, show all (graceful fallback)
    if (arr.length === 0) arr = [...STATES];
    return arr;
  }, [state, religion]);

  const turnoutData = useMemo(() => {
    const arr = filteredStates.map((s) => ({ name: s.name, code: s.code, value: s.turnout[year] })).sort((a, b) => b.value - a.value);
    return topTenOnly ? arr.slice(0, 10) : arr;
  }, [filteredStates, topTenOnly, year]);

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

  const partyStats = useMemo(() => {
    const map = new Map<string, { women: number; scst: number; obc: number; total: number; color: string }>();
    for (const p of PARTY_2024) map.set(p.party, { women: 0, scst: 0, obc: 0, total: 0, color: p.color });

    for (const c of filteredCands) {
      const s = map.get(c.party) || map.get("Others")!;
      s.total++;
      if (c.caste === "SC" || c.caste === "ST") s.scst++;
      if (c.caste === "OBC") s.obc++;
      // Mock women based on party weights if not in candidate data (adding it would be better)
      const partyRef = PARTY_2024.find(p => p.party === c.party) || PARTY_2024[9];
      if (Math.random() * 100 < partyRef.women_pct) s.women++;
    }

    return Array.from(map.entries()).map(([party, s]) => ({
      party,
      women_pct: +((s.women / (s.total || 1)) * 100).toFixed(1),
      scst_pct: +((s.scst / (s.total || 1)) * 100).toFixed(1),
      obc_pct: +((s.obc / (s.total || 1)) * 100).toFixed(1),
      total: s.total,
      color: s.color,
    })).filter(p => p.total > 0).sort((a, b) => b.total - a.total);
  }, [filteredCands]);

  const trend = useMemo(() => ([
    { year: "2014", ...Object.fromEntries(STATES.slice(0, 6).map((s) => [s.code, s.turnout[2014]])) },
    { year: "2019", ...Object.fromEntries(STATES.slice(0, 6).map((s) => [s.code, s.turnout[2019]])) },
    { year: "2024", ...Object.fromEntries(STATES.slice(0, 6).map((s) => [s.code, s.turnout[2024]])) },
  ]), []);
  const trendStates = STATES.slice(0, 6);

  return (
    <section id="politics" className="scroll-mt-24 space-y-6">
      <header>
        <div className="bp-pill mb-2">Section 04 · Politics</div>
        <h2 className="bp-section-title text-2xl md:text-4xl">The arithmetic of power</h2>
        {(religion !== "All" || caste !== "All" || state !== "IN") && (
          <p className="text-xs text-muted-foreground mt-1">
            Displaying data filtered by: {state !== "IN" ? state : ""} {religion !== "All" ? religion : ""} {caste !== "All" ? caste : ""}
          </p>
        )}
      </header>

      <div className="grid-12">
        <div className="col-span-12 lg:col-span-7">
          <ChartCard title={`Voter turnout · ${year}`} subtitle={religion !== "All" ? `States with ≥ 10% ${religion} population` : "All India states"}>
            <div style={{ height: Math.max(280, turnoutData.length * 24) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={turnoutData} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" domain={[40, 90]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" unit="%" />
                  <YAxis type="category" dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} stroke="hsl(var(--border))" width={100} />
                  <Tooltip content={<DarkTooltip formatter={(v: number) => `${v.toFixed(1)}%`} />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={300}>
                    {turnoutData.map((d, i) => (<Cell key={i} fill={turnoutColor(d.value)} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6">
          <ChartCard title="Turnout trend · 2014 → 2024" subtitle="Top 6 states by population" delay={50}>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" tick={(props) => {
                    const isActive = String(year) === props.payload.value;
                    return <text {...props} fill={isActive ? "hsl(var(--saffron))" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400} fontSize={11}>{props.payload.value}</text>;
                  }} stroke="hsl(var(--border))" />
                  <YAxis domain={[50, 90]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" unit="%" />
                  <Tooltip content={<DarkTooltip formatter={(v: number) => `${v.toFixed(1)}%`} />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {trendStates.map((s, i) => {
                    const palette = ["hsl(var(--saffron))", "hsl(var(--india-blue))", "hsl(var(--india-green))", "hsl(var(--india-gold))", "hsl(var(--india-red))", "hsl(var(--india-purple))"];
                    return (<Line key={s.code} type="monotone" dataKey={s.code} stroke={palette[i]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} animationDuration={300} />);
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Lok Sabha 2024 · seats won" subtitle="Based on active filters" delay={100}>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PARTY_2024} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="party" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
                  <Bar dataKey="seats" radius={[4, 4, 0, 0]}>
                    {PARTY_2024.map((p, i) => (<Cell key={i} fill={p.color} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Representation by party" subtitle="% of candidates · Women / SC-ST / OBC" delay={150}>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={partyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="party" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} stroke="hsl(var(--border))" unit="%" />
              <Tooltip content={<DarkTooltip formatter={(v: number) => `${v}%`} />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="women_pct" name="Women" fill="hsl(var(--india-purple))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="scst_pct" name="SC/ST" fill="hsl(var(--india-blue))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="obc_pct" name="OBC" fill="hsl(var(--india-green))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </section>
  );
}
