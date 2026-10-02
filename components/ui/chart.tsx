import { compact } from "@/lib/utils";
export interface Point {
  x: number;
  y: number;
}
export interface Series {
  label: string;
  color: string;
  points: Point[];
  dashed?: boolean;
}
export function LineChart({
  series,
  label,
  xLabel,
  yLabel,
  references = [],
  hideAxes = false,
  yDomain,
  xDomain,
}: {
  series: Series[];
  label: string;
  xLabel?: string;
  yLabel?: string;
  references?: { x?: number; y?: number; label: string; color?: string }[];
  hideAxes?: boolean;
  yDomain?: [number, number];
  xDomain?: [number, number];
}) {
  const all = series
    .flatMap((s) => s.points)
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  if (!all.length) return <p className="chart-caption">No data to display.</p>;
  const width = 600,
    height = 300,
    pad = hideAxes ? 12 : 48,
    right = hideAxes ? 12 : 18,
    bottom = hideAxes ? 12 : 40,
    top = 20;
  const xmin = xDomain?.[0] ?? Math.min(...all.map((p) => p.x)),
    xmax = xDomain?.[1] ?? Math.max(...all.map((p) => p.x));
  let ymin = yDomain?.[0] ?? Math.min(...all.map((p) => p.y)),
    ymax = yDomain?.[1] ?? Math.max(...all.map((p) => p.y));
  if (ymin === ymax) {
    ymin -= 1;
    ymax += 1;
  } else if (!yDomain) {
    const margin = (ymax - ymin) * 0.08;
    ymin -= margin;
    ymax += margin;
  }
  const X = (x: number) =>
      pad + ((x - xmin) / (xmax - xmin || 1)) * (width - pad - right),
    Y = (y: number) =>
      height - bottom - ((y - ymin) / (ymax - ymin)) * (height - bottom - top);
  return (
    <svg
      className="chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
    >
      {!hideAxes && (
        <>
          {Array.from({ length: 5 }, (_, i) => {
            const y = ymin + ((ymax - ymin) * i) / 4;
            return (
              <g key={i}>
                <line
                  x1={pad}
                  y1={Y(y)}
                  x2={width - right}
                  y2={Y(y)}
                  stroke="#2b2b2b"
                  strokeWidth=".8"
                />
                <text x={pad - 9} y={Y(y) + 3} textAnchor="end">
                  {compact(y)}
                </text>
              </g>
            );
          })}
          {Array.from({ length: 5 }, (_, i) => {
            const x = xmin + ((xmax - xmin) * i) / 4;
            return (
              <text key={i} x={X(x)} y={height - 21} textAnchor="middle">
                {compact(x)}
              </text>
            );
          })}
          {xLabel && (
            <text x={width / 2} y={height - 2} textAnchor="middle">
              {xLabel}
            </text>
          )}
          {yLabel && (
            <text x={pad} y={10}>
              {yLabel}
            </text>
          )}
        </>
      )}
      {ymin < 0 && ymax > 0 && (
        <line
          x1={pad}
          x2={width - right}
          y1={Y(0)}
          y2={Y(0)}
          stroke="#656565"
          strokeDasharray="3 4"
        />
      )}
      {references.map((ref, i) => (
        <g key={i}>
          {ref.x !== undefined && ref.x >= xmin && ref.x <= xmax && (
            <>
              <line
                x1={X(ref.x)}
                x2={X(ref.x)}
                y1={top}
                y2={height - bottom}
                stroke={ref.color ?? "#777"}
                strokeDasharray="3 4"
              />
              <text x={X(ref.x) + 5} y={top + 12}>
                {ref.label}
              </text>
            </>
          )}
          {ref.y !== undefined && ref.y >= ymin && ref.y <= ymax && (
            <>
              <line
                x1={pad}
                x2={width - right}
                y1={Y(ref.y)}
                y2={Y(ref.y)}
                stroke={ref.color ?? "#777"}
                strokeDasharray="4 4"
              />
              <text x={width - right} y={Y(ref.y) - 7} textAnchor="end">
                {ref.label}
              </text>
            </>
          )}
        </g>
      ))}
      {series.map((line) => (
        <path
          key={line.label}
          d={line.points
            .map(
              (point, i) =>
                `${i ? "L" : "M"}${X(point.x).toFixed(2)},${Y(point.y).toFixed(2)}`,
            )
            .join(" ")}
          fill="none"
          stroke={line.color}
          strokeWidth={hideAxes ? 1.8 : 2}
          strokeDasharray={line.dashed ? "5 4" : undefined}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
export function ChartLegend({
  series,
}: {
  series: Pick<Series, "label" | "color">[];
}) {
  return (
    <div className="chart-legend">
      {series.map((s) => (
        <span key={s.label}>
          <i style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}
