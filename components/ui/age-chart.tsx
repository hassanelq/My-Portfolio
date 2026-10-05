"use client";
import { useEffect, useId, useRef, useState } from "react";
import { SeriesSwatch } from "@/components/tools/series-swatch";
import { formatMoney, type Currency } from "@/lib/format";

export type AgeSeries = {
  id: string;
  label: string;
  color: string;
  dash: string;
  basis: string;
  points: { age: number; value: number }[];
};
const short = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function AgeChart({
  series,
  age,
  targetAge,
  marker,
  endLabels = true,
  sliderLabel = "Explore savings by age",
  chartLabel = "Historical savings adjusted for inflation",
  axisLabel = "Age",
  tickInterval = 10,
  currency = "DH",
  chartHeight,
}: {
  series: AgeSeries[];
  age: number;
  targetAge: number;
  marker?: { age: number; label: string };
  endLabels?: boolean;
  sliderLabel?: string;
  chartLabel?: string;
  axisLabel?: string;
  tickInterval?: number;
  currency?: Currency;
  chartHeight?: { desktop: number; mobile: number };
}) {
  const money = (value: number) => formatMoney(value, currency);
  const container = useRef<HTMLDivElement>(null),
    [width, setWidth] = useState(720),
    [active, setActive] = useState<number | null>(null),
    hint = useId();
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(280, entry.contentRect.width)),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const height =
      width < 520
        ? (chartHeight?.mobile ?? 310)
        : (chartHeight?.desktop ?? 350),
    left = 12,
    right = width < 620 || !endLabels ? 16 : 150,
    top = 32,
    bottom = height - 36,
    plotWidth = width - left - right;
  const values = series.flatMap((s) => s.points.map((p) => p.value));
  const rawMax = Math.max(1000, ...values);
  const rawMin = Math.min(0, ...values);
  const range = rawMax - rawMin;
  const magnitude = 10 ** Math.floor(Math.log10(range / 4));
  const step =
    [1, 2, 5, 10].find((n) => n * magnitude >= range / 4)! * magnitude;
  const maximum = Math.ceil(rawMax / step) * step;
  const minimum = Math.floor(rawMin / step) * step;
  const firstTick = minimum === 0 ? step : minimum;
  const X = (year: number) =>
    left + ((year - age) / (targetAge - age)) * plotWidth;
  const Y = (value: number) =>
    bottom - ((value - minimum) / (maximum - minimum)) * (bottom - top);
  const index =
    active === null ? null : Math.max(0, Math.min(targetAge - age, active));
  const activeValues = series.flatMap((s) => {
    const point = s.points.find((p) => p.age === age + (index ?? 0));
    return point ? [{ ...s, value: point.value }] : [];
  });
  const ticks = [
    age,
    ...Array.from(
      { length: Math.ceil((targetAge - age) / tickInterval) + 1 },
      (_, i) =>
        Math.ceil((age + 1) / tickInterval) * tickInterval + i * tickInterval,
    ).filter((n) => n < targetAge - Math.min(2, tickInterval / 2)),
    targetAge,
  ];
  const endings = series
    .map((s) => ({ id: s.id, y: Y(s.points.at(-1)!.value) }))
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < endings.length; i++)
    endings[i].y = Math.max(endings[i].y, endings[i - 1].y + 19);
  // Keep clustered endpoints inside the plot, including an all-zero scenario.
  if (endings.length && endings.at(-1)!.y > bottom) {
    endings[endings.length - 1].y = bottom;
    for (let i = endings.length - 2; i >= 0; i--)
      endings[i].y = Math.min(endings[i].y, endings[i + 1].y - 19);
  }
  const endPositions = Object.fromEntries(
    endings.map((item) => [item.id, item.y]),
  );
  function locate(event: React.PointerEvent<SVGRectElement>) {
    const svg = event.currentTarget.ownerSVGElement!;
    const bounds = svg.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) * width) / bounds.width;
    setActive(
      Math.max(
        0,
        Math.min(
          targetAge - age,
          Math.round(((x - left) / plotWidth) * (targetAge - age)),
        ),
      ),
    );
  }
  return (
    <div className="savings-chart" ref={container}>
      <p className="sr-only" id={hint}>
        Hover or tap to explore. With the chart focused, use left and right
        arrow keys to change {axisLabel.toLowerCase()}.
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="savings-chart-svg"
        aria-label={chartLabel}
      >
        {Array.from(
          { length: Math.round((maximum - firstTick) / step) + 1 },
          (_, i) => firstTick + i * step,
        ).map((value) => (
          <g key={value}>
            <line
              x1={left}
              x2={width - right}
              y1={Y(value)}
              y2={Y(value)}
              stroke="var(--color-graphite)"
            />
            <text
              x={left}
              y={Y(value) - 9}
              fill="var(--color-smoke)"
              fontSize={13}
            >
              {short(value)} {currency}
            </text>
          </g>
        ))}
        {ticks.map((year) => (
          <text
            key={year}
            x={X(year)}
            y={height - 10}
            textAnchor={
              year === age ? "start" : year === targetAge ? "end" : "middle"
            }
            fill="var(--color-smoke)"
            fontSize={13}
          >
            {year}
          </text>
        ))}
        {series.map((s) => (
          <g key={s.id}>
            <path
              d={s.points
                .map(
                  (p, i) =>
                    `${i ? "L" : "M"}${X(p.age).toFixed(2)},${Y(p.value).toFixed(2)}`,
                )
                .join(" ")}
              stroke={s.color}
              strokeDasharray={s.dash}
              strokeWidth={s.id === "cash" ? 1.6 : 2.3}
              fill="none"
            />
            <circle
              cx={X(s.points.at(-1)!.age)}
              cy={Y(s.points.at(-1)!.value)}
              r={3}
              fill={s.color}
            />
            {endLabels && width >= 620 && (
              <>
                <path
                  d={`M${X(targetAge) + 5},${Y(s.points.at(-1)!.value)}L${X(targetAge) + 11},${endPositions[s.id]}`}
                  stroke={s.color}
                  strokeWidth=".7"
                />
                <text
                  x={X(targetAge) + 14}
                  y={endPositions[s.id] + 4}
                  fill={s.color}
                  fontSize={13}
                >
                  {s.label}
                </text>
              </>
            )}
          </g>
        ))}
        {marker && (
          <g aria-hidden="true">
            <line
              x1={X(marker.age)}
              x2={X(marker.age)}
              y1={top}
              y2={bottom}
              stroke="var(--color-smoke)"
              strokeDasharray="3 5"
            />
            <text
              x={Math.max(70, Math.min(width - 70, X(marker.age)))}
              y={17}
              textAnchor="middle"
              fill="var(--color-chalk)"
              fontSize={13}
            >
              {marker.label}
            </text>
          </g>
        )}
        {index !== null && (
          <g>
            <line
              x1={X(age + index)}
              x2={X(age + index)}
              y1={top - 8}
              y2={bottom}
              stroke="var(--color-smoke)"
              strokeDasharray="3 5"
            />
            {activeValues.map((s) => (
              <circle
                key={s.id}
                cx={X(age + index)}
                cy={Y(s.value)}
                r={4}
                fill={s.color}
                stroke="var(--color-obsidian)"
                strokeWidth={2}
              />
            ))}
          </g>
        )}
        <rect
          x={left}
          y={0}
          width={plotWidth}
          height={bottom + 8}
          fill="transparent"
          className="savings-chart-hit"
          role="slider"
          tabIndex={0}
          aria-label={sliderLabel}
          aria-describedby={hint}
          aria-valuemin={age}
          aria-valuemax={targetAge}
          aria-valuenow={age + (index ?? 0)}
          aria-valuetext={`${axisLabel} ${age + (index ?? 0)}. ${activeValues.map((s) => `${s.label}: ${money(s.value)}`).join(". ")}`}
          onPointerMove={locate}
          onPointerDown={locate}
          onPointerLeave={(event) => {
            if (event.pointerType !== "touch") setActive(null);
          }}
          onFocus={() => setActive((current) => current ?? 0)}
          onBlur={() => setActive(null)}
          onKeyDown={(event) => {
            if (
              ["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)
            ) {
              event.preventDefault();
              setActive(
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? targetAge - age
                    : Math.max(
                        0,
                        Math.min(
                          targetAge - age,
                          (index ?? 0) + (event.key === "ArrowRight" ? 1 : -1),
                        ),
                      ),
              );
            }
          }}
        />
      </svg>
      {index !== null && (
        <div
          className="savings-chart-tooltip"
          role="tooltip"
          style={{
            width: Math.min(300, width - 8),
            left: Math.max(
              4,
              Math.min(
                width - Math.min(300, width - 8) - 4,
                X(age + index) + 16,
              ),
            ),
            top: 6,
          }}
        >
          <strong>
            {axisLabel} {age + index}
          </strong>
          {activeValues.map((s) => (
            <div key={s.id}>
              <span>
                <SeriesSwatch {...s} />
                {s.label}
              </span>
              <b>{money(s.value)}</b>
            </div>
          ))}
        </div>
      )}
      <div className="savings-legend">
        {series.map((s) => (
          <span key={s.id} title={s.basis}>
            <SeriesSwatch {...s} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
