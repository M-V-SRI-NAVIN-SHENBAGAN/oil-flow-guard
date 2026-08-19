import { useId } from "react";
import { cn } from "@/lib/utils";
import { LAND_PATHS, MAP_H, MAP_W, project, routePath } from "./geo";
import { riskColor } from "@/data/petro";

export interface MapRoute {
  id: string;
  points: [number, number][];
  color?: string;
  risk?: number;
  dashed?: boolean;
  width?: number;
  animate?: boolean;
  label?: string;
}

export interface MapMarker {
  id: string;
  lon: number;
  lat: number;
  label?: string;
  risk?: number;
  kind?: "chokepoint" | "producer" | "consumer" | "refinery" | "reserve";
  active?: boolean;
  onClick?: () => void;
}

export interface MapTanker {
  id: string;
  points: [number, number][];
  color?: string;
  duration?: number;
  delay?: number;
}

interface Props {
  routes?: MapRoute[];
  markers?: MapMarker[];
  tankers?: MapTanker[];
  heat?: { lon: number; lat: number; risk: number; radius?: number }[];
  className?: string;
  viewBox?: string;
  showGraticule?: boolean;
}

const kindStyle: Record<string, { color: string; r: number }> = {
  producer: { color: "var(--caution)", r: 3.2 },
  consumer: { color: "var(--cyan)", r: 3.2 },
  refinery: { color: "var(--safe)", r: 3 },
  reserve: { color: "var(--primary)", r: 4 },
  chokepoint: { color: "var(--critical)", r: 5 },
};

export function WorldMap({
  routes = [],
  markers = [],
  tankers = [],
  heat = [],
  className,
  viewBox,
  showGraticule = true,
}: Props) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox={viewBox ?? `0 0 ${MAP_W} ${MAP_H}`}
      className={cn("h-full w-full select-none", className)}
      role="img"
      aria-label="Global oil trade route risk map (simulated data)"
    >
      <defs>
        <radialGradient id={`${uid}-heat`}>
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="55%" stopColor="currentColor" stopOpacity="0.2" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${uid}-ocean`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.24 0.04 254)" />
          <stop offset="100%" stopColor="oklch(0.18 0.03 258)" />
        </linearGradient>
      </defs>

      <rect width={MAP_W} height={MAP_H} fill={`url(#${uid}-ocean)`} />

      {showGraticule && (
        <g stroke="oklch(0.6 0.06 240 / 8%)" strokeWidth="0.6">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`h${i}`} x1={0} x2={MAP_W} y1={(i * MAP_H) / 10} y2={(i * MAP_H) / 10} />
          ))}
          {Array.from({ length: 19 }, (_, i) => (
            <line key={`v${i}`} y1={0} y2={MAP_H} x1={(i * MAP_W) / 18} x2={(i * MAP_W) / 18} />
          ))}
        </g>
      )}

      <g>
        {LAND_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="oklch(0.3 0.035 250 / 85%)"
            stroke="oklch(0.62 0.06 235 / 35%)"
            strokeWidth="0.8"
          />
        ))}
      </g>

      {/* risk heat zones */}
      <g>
        {heat.map((h, i) => {
          const [x, y] = project(h.lon, h.lat);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={h.radius ?? 22 + h.risk / 3}
              fill={`url(#${uid}-heat)`}
              style={{ color: riskColor(h.risk) }}
            />
          );
        })}
      </g>

      {/* routes */}
      <g fill="none" strokeLinecap="round">
        {routes.map((r) => {
          const d = routePath(r.points);
          const color = r.color ?? (r.risk != null ? riskColor(r.risk) : "var(--primary)");
          return (
            <g key={r.id}>
              <path d={d} stroke={color} strokeWidth={(r.width ?? 1.6) + 3} opacity={0.16} />
              <path
                d={d}
                stroke={color}
                strokeWidth={r.width ?? 1.6}
                opacity={0.95}
                filter={`url(#${uid}-glow)`}
                strokeDasharray={r.dashed ? "6 6" : "10 6"}
                className={r.animate === false ? undefined : "animate-dash"}
              />
            </g>
          );
        })}
      </g>

      {/* tankers */}
      <g>
        {tankers.map((t) => {
          const d = routePath(t.points);
          return (
            <g key={t.id}>
              <path id={`${uid}-${t.id}`} d={d} fill="none" stroke="none" />
              <circle r="3.4" fill={t.color ?? "var(--cyan)"} filter={`url(#${uid}-glow)`}>
                <animateMotion
                  dur={`${t.duration ?? 9}s`}
                  begin={`${t.delay ?? 0}s`}
                  repeatCount="indefinite"
                  path={d}
                />
              </circle>
            </g>
          );
        })}
      </g>

      {/* markers */}
      <g>
        {markers.map((m) => {
          const [x, y] = project(m.lon, m.lat);
          const style = kindStyle[m.kind ?? "producer"] ?? kindStyle.producer!;
          const color = m.risk != null ? riskColor(m.risk) : style.color;
          const isChoke = m.kind === "chokepoint";
          return (
            <g
              key={m.id}
              transform={`translate(${x} ${y})`}
              onClick={m.onClick}
              className={m.onClick ? "cursor-pointer" : undefined}
            >
              {isChoke && (
                <circle r="9" fill={color} opacity="0.25" className="animate-pulse-ring" style={{ transformOrigin: "center" }} />
              )}
              <circle r={style.r} fill={color} filter={`url(#${uid}-glow)`} />
              {m.active && <circle r={style.r + 5} fill="none" stroke={color} strokeWidth="1.2" />}
              {m.onClick && <circle r="14" fill="transparent" />}
              {m.label && (
                <text
                  x={style.r + 5}
                  y={3}
                  fontSize={isChoke ? 9.5 : 8}
                  fill={isChoke ? color : "oklch(0.85 0.02 240 / 85%)"}
                  className="num pointer-events-none"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {m.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
