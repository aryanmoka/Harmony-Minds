// RadarChart.tsx — Spotify-style dark radar chart (ready to paste)
interface RadarChartProps {
  data: {
    danceability: number;
    energy: number;
    valence: number;
    acousticness: number;
  };
}

export function RadarChart({ data }: RadarChartProps) {
  const categories = [
    { key: 'danceability', label: 'Danceability' },
    { key: 'energy', label: 'Energy' },
    { key: 'valence', label: 'Happiness' },
    { key: 'acousticness', label: 'Acoustic' },
  ];

  // visual config
  const size = 200;
  const center = size / 2;
  const radius = 80;

  // accent & palette tuned for dark theme (Spotify-like green)
  const ACCENT = 'rgba(29,185,84,0.95)'; // spotify green
  const ACCENT_FADE = 'rgba(29,185,84,0.25)';
  const GRID_COLOR = 'rgba(255,255,255,0.06)'; // faint grid
  const LINE_COLOR = 'rgba(255,255,255,0.12)'; // radial lines
  const LABEL_COLOR = 'rgba(230,230,230,0.95)';
  const VALUE_COLOR = 'rgba(200,200,200,0.95)';

  // compute points for each category based on data value (0..1)
  const points = categories.map((cat, i) => {
    const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2; // start at top
    const value = Math.max(0, Math.min(1, (data as any)[cat.key] ?? 0));
    const x = center + Math.cos(angle) * radius * value;
    const y = center + Math.sin(angle) * radius * value;
    return { x, y, angle, label: cat.label, value };
  });

  // polygon path for the data area
  const pathData =
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';

  // grid levels (fractional radii)
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        {/* defs for soft gradient fill */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.25" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.12" />
          </linearGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* concentric polygon grid */}
        {gridLevels.map((level, gi) => {
          const gridPoints = categories.map((_, idx) => {
            const angle = (Math.PI * 2 * idx) / categories.length - Math.PI / 2;
            return {
              x: center + Math.cos(angle) * radius * level,
              y: center + Math.sin(angle) * radius * level,
            };
          });
          const gridPath =
            gridPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') +
            ' Z';

          return (
            <path
              key={gi}
              d={gridPath}
              fill="none"
              stroke={GRID_COLOR}
              strokeWidth={1}
              opacity={0.8}
            />
          );
        })}

        {/* radial lines */}
        {categories.map((_, i) => {
          const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
          const x2 = center + Math.cos(angle) * radius;
          const y2 = center + Math.sin(angle) * radius;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke={LINE_COLOR}
              strokeWidth={1}
              opacity={0.9}
            />
          );
        })}

        {/* data polygon filled with gradient */}
        <path d={pathData} fill="url(#radarGradient)" stroke={ACCENT} strokeWidth={2} style={{ filter: 'none' }} />

        {/* data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.8} fill={ACCENT} stroke="rgba(0,0,0,0.25)" strokeWidth={0.5} />
        ))}

        {/* subtle outline glow under filled polygon */}
        <path d={pathData} fill="none" stroke={ACCENT_FADE} strokeWidth={6} opacity={0.07} strokeLinecap="round" strokeLinejoin="round" />

        {/* center marker (optional) */}
        <circle cx={center} cy={center} r={1.5} fill={LINE_COLOR} />
      </svg>

      {/* labels positioned around the radar */}
      {points.map((p, i) => {
        const labelAngle = p.angle;
        const labelDistance = radius + 22;
        const labelX = center + Math.cos(labelAngle) * labelDistance;
        const labelY = center + Math.sin(labelAngle) * labelDistance;

        // determine text alignment by angle
        const align: React.CSSProperties = {
          left: `${(labelX / size) * 100}%`,
          top: `${(labelY / size) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: '86px',
        };

        return (
          <div
            key={i}
            className="absolute text-xs font-medium"
            style={{
              ...align,
              color: LABEL_COLOR,
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: 12, marginBottom: 4 }}>{p.label}</div>
            <div style={{ fontSize: 12, color: VALUE_COLOR, fontWeight: 700 }}>
              {Math.round(p.value * 100)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
