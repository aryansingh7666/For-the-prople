import { useMemo, useState } from "react";
import { STATES } from "./data";
import { useFilters } from "./store";

// Stylized "tile-map" of India — each state = a labeled rounded square
// arranged in a geographic grid (col, row). Saffron→white→green colour scale.
const TILE: Record<string, [number, number]> = {
  // col, row
  JK: [3, 0], // not in dataset, omitted
  HP: [3, 1], UK: [4, 1], PB: [2, 1], HR: [3, 2], DL: [4, 2],
  RJ: [2, 3], UP: [4, 3], BR: [6, 3], AS: [8, 2],
  GJ: [1, 4], MP: [3, 4], JH: [6, 4], WB: [7, 4],
  MH: [2, 5], CT: [4, 5], OR: [6, 5],
  TS: [3, 6], AP: [4, 7], KA: [2, 7], GA: [1, 6],
  TN: [3, 8], KL: [2, 8],
};

type Metric = "literacy" | "turnout" | "gdp_per_capita";

function colorScale(t: number) {
  // 0 → saffron, 0.5 → white, 1 → green
  if (t < 0.5) {
    const k = t / 0.5;
    return `color-mix(in srgb, hsl(var(--saffron)) ${(1 - k) * 100}%, white ${k * 100}%)`;
  }
  const k = (t - 0.5) / 0.5;
  return `color-mix(in srgb, white ${(1 - k) * 100}%, hsl(var(--india-green)) ${k * 100}%)`;
}

export function IndiaMap({ metric = "literacy", drawAnimate = false }: { metric?: Metric; drawAnimate?: boolean }) {
  const { state: activeState, setState } = useFilters();
  const [hover, setHover] = useState<string | null>(null);

  const values = useMemo(() => {
    const arr = STATES.map((s) => s[metric] as number);
    const min = Math.min(...arr), max = Math.max(...arr);
    return { min, max };
  }, [metric]);

  const cell = 56, gap = 6;
  const cols = 10, rows = 9;
  const W = cols * (cell + gap) + 16, H = rows * (cell + gap) + 16;

  const hovered = hover ? STATES.find((s) => s.code === hover) : null;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="India tile-map">
        <defs>
          <linearGradient id="legend-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="hsl(var(--saffron))" />
            <stop offset="50%" stopColor="white" />
            <stop offset="100%" stopColor="hsl(var(--india-green))" />
          </linearGradient>
        </defs>

        {STATES.map((s, i) => {
          const pos = TILE[s.code];
          if (!pos) return null;
          const [c, r] = pos;
          const x = 8 + c * (cell + gap), y = 8 + r * (cell + gap);
          const v = s[metric] as number;
          const t = (v - values.min) / (values.max - values.min || 1);
          const fill = colorScale(t);
          const isActive = activeState === s.code;
          return (
            <g key={s.code} className="map-path"
              onMouseEnter={() => setHover(s.code)}
              onMouseLeave={() => setHover((h) => (h === s.code ? null : h))}
              onClick={() => setState(isActive ? "IN" : s.code)}
              style={drawAnimate ? { animation: `fade-in 0.6s ${i * 35}ms ease-out both` } : undefined}
            >
              <rect
                x={x} y={y} width={cell} height={cell} rx={10}
                fill={fill}
                stroke={isActive ? "hsl(var(--saffron))" : "hsl(var(--border))"}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive || !activeState || activeState === "IN" ? 1 : 0.55}
              />
              <text x={x + cell / 2} y={y + cell / 2 + 4} textAnchor="middle"
                className="font-mono" fontSize="12" fontWeight={600}
                fill="hsl(var(--background))">{s.code}</text>
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${W - 220}, ${H - 28})`}>
          <rect width="200" height="10" rx="5" fill="url(#legend-grad)" />
          <text x="0" y="-4" fontSize="10" fill="hsl(var(--muted-foreground))" className="font-mono">
            {values.min.toFixed(0)}
          </text>
          <text x="200" y="-4" fontSize="10" textAnchor="end" fill="hsl(var(--muted-foreground))" className="font-mono">
            {values.max.toFixed(0)}
          </text>
        </g>
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute top-2 right-2 bp-card p-3 text-xs animate-fade-in">
          <div className="font-display text-base">{hovered.name}</div>
          <div className="text-muted-foreground">Population: <span className="font-mono text-foreground">{hovered.population_m.toFixed(1)}M</span></div>
          <div className="text-muted-foreground">Literacy: <span className="font-mono text-foreground">{hovered.literacy.toFixed(1)}%</span></div>
          <div className="text-muted-foreground">Turnout 2024: <span className="font-mono text-foreground">{hovered.turnout[2024].toFixed(1)}%</span></div>
          <div className="text-muted-foreground">GDP/cap: <span className="font-mono text-foreground">₹{(hovered.gdp_per_capita / 1000).toFixed(0)}k</span></div>
          <div className="mt-1 text-[10px] text-saffron">Click to filter →</div>
        </div>
      )}
    </div>
  );
}
