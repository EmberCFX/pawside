import { serviceAreas } from "@/data/serviceAreas";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Stylized service-area map.
 *
 * Drawn as vector rather than shipped as a picture, because the towns come from
 * data/serviceAreas.ts: add an entry with coordinates and it places itself, with
 * no image to re-export. That also keeps the labels real text — crisp at any
 * size, and readable to a screen reader through the description below the map.
 *
 * The geometry is a plain equirectangular projection with a cosine correction on
 * longitude, fitted to the viewBox at a single uniform scale so relative
 * distances stay honest. Concentric rings mark drive-radius bands out from the
 * home base; they run past the frame on purpose, so the coverage reads as
 * continuing rather than stopping at the edge.
 */
const VIEW_W = 1400;
const VIEW_H = 1000;
const PADDING = 115;
const MILES_PER_DEGREE_LAT = 69;
const RADIUS_BANDS_MILES = [5, 10, 20];

/** The Connecticut River, as coordinate waypoints so it projects with everything else. */
const RIVER_WAYPOINTS: Array<[number, number]> = [
  [42.44, -72.545],
  [42.395, -72.565],
  [42.352, -72.583],
  [42.323, -72.612],
  [42.289, -72.607],
  [42.256, -72.598],
  [42.224, -72.604],
  [42.196, -72.598],
  [42.158, -72.601],
  [42.118, -72.612],
  [42.07, -72.598],
];

interface Projection {
  project: (lat: number, lng: number) => { x: number; y: number };
  pixelsPerMile: number;
}

function buildProjection(): Projection {
  const lats = serviceAreas.map((a) => a.coords.lat);
  const lngs = serviceAreas.map((a) => a.coords.lng);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const centerLat = (minLat + maxLat) / 2;
  // Longitude degrees shrink toward the poles; without this the valley leans.
  const lngScale = Math.cos((centerLat * Math.PI) / 180);

  const xs = lngs.map((lng) => lng * lngScale);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);

  const spanX = maxX - minX || 1;
  const spanY = maxLat - minLat || 1;

  // One scale for both axes, so the arrangement of towns stays geographically true.
  const scale = Math.min((VIEW_W - PADDING * 2) / spanX, (VIEW_H - PADDING * 2) / spanY);

  const drawnW = spanX * scale;
  const drawnH = spanY * scale;
  const offsetX = (VIEW_W - drawnW) / 2;
  const offsetY = (VIEW_H - drawnH) / 2;

  return {
    project: (lat, lng) => ({
      x: offsetX + (lng * lngScale - minX) * scale,
      // Latitude increases northward, SVG y increases downward.
      y: offsetY + (maxLat - lat) * scale,
    }),
    pixelsPerMile: scale / MILES_PER_DEGREE_LAT,
  };
}

function smoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return "";
  // Catmull-Rom through the waypoints, converted to cubic béziers.
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function ServiceAreaMap({ className }: { className?: string }) {
  const { project, pixelsPerMile } = buildProjection();

  const homeArea =
    serviceAreas.find((area) => area.name === site.homeBase.city) ?? serviceAreas[0];
  const home = project(homeArea.coords.lat, homeArea.coords.lng);

  const river = smoothPath(RIVER_WAYPOINTS.map(([lat, lng]) => project(lat, lng)));

  const covered = serviceAreas.filter((a) => a.status !== "waitlist").map((a) => a.name);
  const description = `Map of the ${site.homeBase.region} area Pawside serves, centered on ${homeArea.name}, ${homeArea.state}. Covered towns: ${covered.join(", ")}.`;

  return (
    <div className={cn("relative overflow-hidden bg-navy-900", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-full w-full"
        role="img"
        aria-label={description}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="pawside-map-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#36CEC1" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#36CEC1" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#36CEC1" stopOpacity="0" />
          </radialGradient>
          <pattern id="pawside-map-grid" width="70" height="70" patternUnits="userSpaceOnUse">
            <path
              d="M 70 0 L 0 0 0 70"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.04"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill="#011C35" />
        <rect width={VIEW_W} height={VIEW_H} fill="url(#pawside-map-grid)" />
        <circle
          cx={home.x}
          cy={home.y}
          r={RADIUS_BANDS_MILES[2] * pixelsPerMile}
          fill="url(#pawside-map-glow)"
        />

        <path
          d={river}
          fill="none"
          stroke="#36CEC1"
          strokeOpacity="0.16"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {RADIUS_BANDS_MILES.map((miles) => {
          const radius = miles * pixelsPerMile;
          // South of the ring so labels stay inside the frame (north-side 10/20
          // MI labels clipped at the top). Skip a label that would still overflow.
          const labelY = home.y + radius + 22;
          const showLabel = labelY > 28 && labelY < VIEW_H - 16;

          return (
            <g key={miles}>
              <circle
                cx={home.x}
                cy={home.y}
                r={radius}
                fill="none"
                stroke="#36CEC1"
                strokeOpacity="0.22"
                strokeWidth="1.5"
                strokeDasharray="3 9"
              />
              {showLabel ? (
                <text
                  x={home.x}
                  y={labelY}
                  textAnchor="middle"
                  className="font-sans"
                  fill="#6CD5CC"
                  fillOpacity="0.5"
                  fontSize="19"
                  letterSpacing="2.4"
                >
                  {miles} MI
                </text>
              ) : null}
            </g>
          );
        })}

        {serviceAreas.map((area) => {
          const { x, y } = project(area.coords.lat, area.coords.lng);
          const isHome = area.slug === homeArea.slug;
          const isWaitlist = area.status === "waitlist";
          const offset = area.labelOffset ?? { x: 18, y: 5 };

          return (
            <g key={area.slug}>
              {isHome ? (
                <circle cx={x} cy={y} r="26" fill="#36CEC1" fillOpacity="0.16" />
              ) : null}
              <circle
                cx={x}
                cy={y}
                r={isHome ? 9 : 6.5}
                fill={isWaitlist ? "#011C35" : isHome ? "#36CEC1" : "#6CD5CC"}
                fillOpacity={isWaitlist ? 1 : area.status === "core" ? 1 : 0.75}
                stroke={isWaitlist ? "#6CD5CC" : "none"}
                strokeOpacity="0.55"
                strokeWidth="2"
                strokeDasharray={isWaitlist ? "3 3" : undefined}
              />
              <text
                x={x + offset.x}
                y={y + offset.y}
                textAnchor={area.labelAnchor ?? "start"}
                className="font-display"
                fill={isHome ? "#FFFFFF" : "#E4ECF4"}
                fillOpacity={isWaitlist ? 0.55 : isHome ? 1 : 0.82}
                fontSize={isHome ? 30 : 25}
                fontWeight={isHome ? 600 : 500}
              >
                {area.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
