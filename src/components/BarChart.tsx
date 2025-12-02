// BarChart.tsx — Spotify-style dark UI

interface BarChartProps {
  data: {
    label: string;
    value: number;
    color?: string; // no longer used, but kept for compatibility
  }[];
}

export function BarChart({ data }: BarChartProps) {
  return (
    <div className="space-y-5">
      {data.map((item, index) => (
        <div key={index}>
          {/* Label + value */}
          <div className="flex justify-between mb-2">
            <span className="text-sm text-white font-medium">{item.label}</span>
            <span className="text-sm font-semibold text-[var(--accent)]">
              {Math.round(item.value * 100)}%
            </span>
          </div>

          {/* Background bar */}
          <div className="h-3 bg-surface rounded-full overflow-hidden border border-muted">
            {/* Foreground bar */}
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${item.value * 100}%`,
                backgroundColor: "var(--accent)",
                boxShadow: "0 0 10px rgba(30, 215, 96, 0.6)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
