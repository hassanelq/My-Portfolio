// Abstract static diagrams give each discipline a visual identity without embedding project demos.
export function ProjectMark({ variant = 0 }: { variant?: number }) {
  return (
    <svg
      className="project-mark"
      viewBox="0 0 320 150"
      fill="none"
      aria-hidden="true"
    >
      <path d="M20 125H300M30 135V15" stroke="#303030" />
      {variant % 3 === 0 ? (
        Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M30 ${115 - i * 5} C 85 ${120 - i * 9}, 140 ${15 + i * 12}, 292 ${25 + i * 12}`}
            stroke={i === 3 ? "#e4e1d9" : "#6f6759"}
            strokeOpacity={i === 3 ? 1 : 0.45}
          />
        ))
      ) : variant % 3 === 1 ? (
        <>
          <path d="M55 125 Q80 60 270 20" stroke="#d9d6cd" />
          {Array.from({ length: 60 }, (_, i) => (
            <circle
              key={i}
              cx={70 + ((i * 31) % 208)}
              cy={40 + ((i * 47) % 82)}
              r={1.9}
              fill="#6f6759"
            />
          ))}
          <circle cx="118" cy="57" r="5" stroke="#f3f3f3" />
        </>
      ) : (
        <>
          {[45, 135, 225].map((x, i) => (
            <g key={x}>
              <rect
                x={x}
                y={40 + (i % 2) * 20}
                width="50"
                height="48"
                rx="3"
                stroke={i === 1 ? "#d9d6cd" : "#6f6759"}
              />
              <path
                d={`M${x + 13} ${60 + (i % 2) * 20}h24m-24 8h14`}
                stroke="#626262"
              />
              {i < 2 && (
                <path
                  d={`M${x + 50} ${65 + (i % 2) * 20}h20v${i === 0 ? 20 : -20}h20`}
                  stroke="#555"
                />
              )}
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
