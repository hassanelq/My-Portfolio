"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { HistoricalResult } from "@/lib/math/dca";

export type SavingsSeries = HistoricalResult & {
  label: string;
  color: string;
  basis: string;
};
export const dirhams = (value: number) =>
  `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value).replace(/\u202f/g, "\u00a0")} DH`;
const short = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function DCAChart({
  series,
  age,
  targetAge,
}: {
  series: SavingsSeries[];
  age: number;
  targetAge: number;
}) {
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
  const height = width < 520 ? 310 : 350,
    left = 12,
    right = width < 620 ? 16 : 150,
    top = 32,
    bottom = height - 36,
    plotWidth = width - left - right;
  const rawMax = Math.max(
    1000,
    ...series.flatMap((s) => s.points.map((p) => p.value)),
  );
  const magnitude = 10 ** Math.floor(Math.log10(rawMax / 4));
  const step =
    [1, 2, 5, 10].find((n) => n * magnitude >= rawMax / 4)! * magnitude;
  const maximum = Math.ceil(rawMax / step) * step;
  const X = (year: number) =>
    left + ((year - age) / (targetAge - age)) * plotWidth;
  const Y = (value: number) => bottom - (value / maximum) * (bottom - top);
  const index =
    active === null ? null : Math.max(0, Math.min(targetAge - age, active));
  const ticks = [
    age,
    ...Array.from(
      { length: Math.ceil((targetAge - age) / 10) + 1 },
      (_, i) => Math.ceil((age + 1) / 10) * 10 + i * 10,
    ).filter((n) => n < targetAge - 2),
    targetAge,
  ];
  const endings = series
    .map((s) => ({ id: s.id, y: Y(s.median) }))
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < endings.length; i++)
    endings[i].y = Math.max(endings[i].y, endings[i - 1].y + 19);
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
        arrow keys to change age.
      </p>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="savings-chart-svg"
        aria-label="Historical savings in today's dirhams"
      >
        {Array.from(
          { length: Math.round(maximum / step) },
          (_, i) => (i + 1) * step,
        ).map((value) => (
          <g key={value}>
            <line
              x1={left}
              x2={width - right}
              y1={Y(value)}
              y2={Y(value)}
              stroke="#303537"
            />
            <text x={left} y={Y(value) - 9} fill="#aab0b8" fontSize={12}>
              {short(value)} DH
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
            fill="#adb3b9"
            fontSize={12}
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
              strokeWidth={s.id === "cash" ? 1.6 : 2.3}
              fill="none"
            />
            <circle cx={X(targetAge)} cy={Y(s.median)} r={3} fill={s.color} />
            {width >= 620 && (
              <>
                <path
                  d={`M${X(targetAge) + 5},${Y(s.median)}L${X(targetAge) + 11},${endPositions[s.id]}`}
                  stroke={s.color}
                  strokeWidth=".7"
                />
                <text
                  x={X(targetAge) + 14}
                  y={endPositions[s.id] + 4}
                  fill={s.color}
                  fontSize={12}
                >
                  {s.label}
                </text>
              </>
            )}
          </g>
        ))}
        {index !== null && (
          <g>
            <line
              x1={X(age + index)}
              x2={X(age + index)}
              y1={top - 8}
              y2={bottom}
              stroke="#aaa"
              strokeDasharray="3 5"
            />
            {series.map((s) => (
              <circle
                key={s.id}
                cx={X(age + index)}
                cy={Y(s.points[index].value)}
                r={4}
                fill={s.color}
                stroke="#101010"
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
          aria-label="Explore savings by age"
          aria-describedby={hint}
          aria-valuemin={age}
          aria-valuemax={targetAge}
          aria-valuenow={age + (index ?? 0)}
          aria-valuetext={`Age ${age + (index ?? 0)}. ${series.map((s) => `${s.label}: ${dirhams(s.points[index ?? 0].value)}`).join(". ")}`}
          onPointerMove={locate}
          onPointerDown={locate}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(0)}
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
            left: Math.max(4, Math.min(width - 250, X(age + index) + 16)),
            top: 6,
          }}
        >
          <strong>Age {age + index}</strong>
          {series.map((s) => (
            <div key={s.id}>
              <span>
                <i style={{ background: s.color }} />
                {s.label}
              </span>
              <b>{dirhams(s.points[index].value)}</b>
            </div>
          ))}
        </div>
      )}
      <div className="savings-legend">
        {series.map((s) => (
          <span key={s.id} title={s.basis}>
            <i style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}
