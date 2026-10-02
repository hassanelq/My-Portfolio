/** Use the same line pattern in the chart, controls, legend and results. */
export function SeriesSwatch({ color, dash }: { color: string; dash: string }) {
  return (
    <svg
      width="24"
      height="12"
      viewBox="0 0 24 12"
      aria-hidden="true"
      className="series-swatch"
    >
      <line
        x1="1"
        x2="23"
        y1="6"
        y2="6"
        stroke={color}
        strokeWidth="2"
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    </svg>
  );
}
