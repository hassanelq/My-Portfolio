// A small original dot-map illustration; generated as static SVG, with no animation bundle.
const land = [
  [
    [-167, 70],
    [-136, 72],
    [-119, 57],
    [-100, 52],
    [-79, 50],
    [-61, 47],
    [-81, 25],
    [-96, 17],
    [-113, 29],
    [-128, 49],
    [-166, 56],
  ],
  [
    [-80, 12],
    [-66, 10],
    [-49, -2],
    [-35, -10],
    [-46, -25],
    [-67, -55],
    [-76, -27],
  ],
  [
    [-18, 35],
    [0, 37],
    [12, 33],
    [35, 30],
    [50, 12],
    [39, -12],
    [18, -35],
    [5, -28],
    [-2, -7],
    [-16, 7],
  ],
  [
    [-10, 36],
    [-8, 59],
    [9, 71],
    [27, 70],
    [45, 56],
    [61, 55],
    [77, 73],
    [147, 72],
    [176, 61],
    [157, 47],
    [135, 35],
    [125, 20],
    [103, 5],
    [86, 20],
    [73, 10],
    [57, 27],
    [41, 32],
    [31, 44],
    [12, 44],
  ],
  [
    [112, -13],
    [138, -10],
    [155, -25],
    [151, -38],
    [129, -35],
    [113, -23],
  ],
  [
    [-55, 59],
    [-30, 68],
    [-24, 81],
    [-51, 83],
    [-66, 72],
  ],
  [
    [46, -13],
    [51, -16],
    [48, -26],
    [44, -25],
  ],
  [
    [129, 33],
    [143, 45],
    [146, 41],
    [136, 31],
  ],
  [
    [166, -35],
    [178, -39],
    [174, -46],
    [166, -45],
  ],
];
function inside(x: number, y: number, polygon: number[][]) {
  let yes = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i],
      [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      yes = !yes;
  }
  return yes;
}
export function DotMap() {
  const dots = [];
  for (let lon = -176; lon <= 178; lon += 3.6)
    for (let lat = -54; lat <= 80; lat += 3.6) {
      if (land.some((poly) => inside(lon, lat, poly)))
        dots.push(
          <circle
            key={`${lon}-${lat}`}
            cx={((lon + 180) / 360) * 1000}
            cy={(82 - lat) * 2.5}
            r={1.55}
            fill="currentColor"
            opacity={0.3 + (Math.cos(lon * 0.05) + 1) * 0.18}
          />,
        );
    }
  return (
    <div className="map-visual">
      <svg viewBox="0 0 1000 350" aria-hidden="true">
        {dots}
        <circle cx="479" cy="121" r="4" fill="#98ff38" />
        <circle
          cx="479"
          cy="121"
          r="10"
          fill="none"
          stroke="#98ff38"
          strokeOpacity=".4"
        />
        <path d="M489 121H560" stroke="#757575" strokeWidth=".7" />
        <text x="570" y="125" fill="#a5a5a5" fontSize="9" letterSpacing="1.5">
          CASABLANCA
        </text>
      </svg>
      <div className="map-coordinate mono">33.5731° N / 7.5898° W</div>
      <div className="map-caption mono">
        BASED IN MOROCCO
        <br />
        BUILDING WITHOUT BORDERS
      </div>
    </div>
  );
}
