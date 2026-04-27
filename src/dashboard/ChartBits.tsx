import { ReactNode } from "react";

interface DarkTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number | string; color?: string; fill?: string }[];
  label?: string | number;
  formatter?: (value: number | string, name: string) => React.ReactNode;
}

export function DarkTooltip({ active, payload, label, formatter }: DarkTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bp-card !p-3 text-xs min-w-[140px] animate-fade-in">
      {label != null && <div className="font-display text-sm mb-1">{label}</div>}
      {payload?.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
            <span className="text-muted-foreground">{p.name}</span>
          </span>
          <span className="font-mono text-foreground">
            {formatter ? formatter(p.value, p.name) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChartCard({ title, subtitle, children, action, delay = 0 }: {
  title: string; subtitle?: string; children: ReactNode; action?: ReactNode; delay?: number;
}) {
  return (
    <div className="bp-card p-5 animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
