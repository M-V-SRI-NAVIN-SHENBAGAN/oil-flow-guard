import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Brain, Loader2, X } from "lucide-react";
import {
  CHOKEPOINTS,
  GEO_NODES,
  HORIZONS,
  TRADE_ROUTES,
  horizonLabel,
  riskColor,
  riskLevel,
  type Horizon,
} from "@/data/petro";
import { WorldMap } from "@/components/map/WorldMap";
import { AICallout, PageHeader, Panel, RiskBadge, ScoreBar } from "@/components/kit";
import { usePetro } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risk-map")({
  head: () => ({
    meta: [
      { title: "Spatial-Temporal Risk Map — PetroShield AI" },
      {
        name: "description",
        content:
          "Interactive world map of oil trade routes, chokepoints and forecast risk across NOW to +90 days. Simulated prototype data.",
      },
      { property: "og:title", content: "Spatial-Temporal Risk Map — PetroShield AI" },
      {
        property: "og:description",
        content: "Forecast petroleum chokepoint risk across a 90-day horizon with AI analysis.",
      },
    ],
  }),
  component: RiskMap,
});

const FILTERS = ["Geopolitical Risk", "Weather", "Shipping", "Supply", "Refining", "Price"] as const;

function RiskMap() {
  const { demoActive } = usePetro();
  const [horizon, setHorizon] = useState<Horizon>(0);
  const [active, setActive] = useState<string[]>([...FILTERS]);
  const [selected, setSelected] = useState<string | null>("hormuz");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(false);

  const boost = demoActive ? 14 : 0;
  const scoreOf = (id: string) => {
    const c = CHOKEPOINTS.find((x) => x.id === id)!;
    return Math.min(99, c.forecast[horizon] + (id === "hormuz" ? boost : Math.round(boost / 3)));
  };
  const choke = CHOKEPOINTS.find((c) => c.id === selected);

  const markers = useMemo(
    () => [
      ...(active.includes("Supply") || active.includes("Refining")
        ? GEO_NODES.filter((n) => (n.type === "refinery" ? active.includes("Refining") : active.includes("Supply"))).map(
            (n) => ({ id: n.id, lon: n.lon, lat: n.lat, kind: n.type, label: n.name }),
          )
        : []),
      ...CHOKEPOINTS.map((c) => ({
        id: c.id,
        lon: c.lon,
        lat: c.lat,
        kind: "chokepoint" as const,
        risk: scoreOf(c.id),
        label: `${c.short} ${scoreOf(c.id)}%`,
        active: selected === c.id,
        onClick: () => setSelected(c.id),
      })),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [horizon, active, selected, demoActive],
  );

  const runAnalysis = () => {
    setAnalyzing(true);
    setAnalysis(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysis(true);
    }, 1600);
  };

  return (
    <>
      <PageHeader
        eyebrow="Layer 02 · Spatial-Temporal"
        title="Global Risk Map"
        description="Forecast risk surfaces across the world's petroleum arteries. Move the timeline to see how simulated risk evolves over the next 90 days."
        action={
          <button
            onClick={runAnalysis}
            className="num flex items-center gap-2 rounded-lg border border-primary/45 bg-primary/15 px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-primary transition hover:bg-primary/25"
          >
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            RUN AI RISK ANALYSIS
          </button>
        }
      />

      <Panel
        title="Timeline Projection"
        subtitle="Simulated risk propagation model"
        action={
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const on = active.includes(f);
              return (
                <button
                  key={f}
                  onClick={() => setActive((a) => (on ? a.filter((x) => x !== f) : [...a, f]))}
                  className={cn(
                    "num rounded-full border px-2.5 py-1 text-[10px] tracking-[0.1em] transition",
                    on
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.toUpperCase()}
                </button>
              );
            })}
          </div>
        }
      >
        <div className="flex items-center gap-2">
          {HORIZONS.map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={cn(
                "num flex-1 rounded-lg border px-3 py-2.5 text-[11px] font-semibold tracking-[0.14em] transition",
                horizon === h
                  ? "border-primary/60 bg-primary/20 text-primary shadow-[0_0_24px_-10px_var(--primary)]"
                  : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {horizonLabel(h)}
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={4}
          step={1}
          value={HORIZONS.indexOf(horizon)}
          onChange={(e) => setHorizon(HORIZONS[Number(e.target.value)] ?? 0)}
          className="mt-4 w-full accent-[var(--primary)]"
          aria-label="Forecast horizon"
        />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Panel title={`Risk Surface — ${horizonLabel(horizon)}`} bodyClassName="p-0" className="overflow-hidden">
          <div className="relative">
            <WorldMap
              className="aspect-[2/1]"
              routes={
                active.includes("Shipping")
                  ? TRADE_ROUTES.map((r) => ({
                      id: r.id,
                      points: r.points,
                      risk: r.risk,
                      dashed: r.kind === "alt",
                      width: r.kind === "primary" ? 1.8 : 1.1,
                    }))
                  : []
              }
              heat={
                active.includes("Geopolitical Risk")
                  ? CHOKEPOINTS.map((c) => ({ lon: c.lon, lat: c.lat, risk: scoreOf(c.id) }))
                  : []
              }
              tankers={
                active.includes("Shipping")
                  ? [
                      { id: "m1", points: TRADE_ROUTES[1]!.points, duration: 15 },
                      { id: "m2", points: TRADE_ROUTES[3]!.points, duration: 19, color: "var(--safe)" },
                      { id: "m3", points: TRADE_ROUTES[2]!.points, duration: 17, delay: 2, color: "var(--caution)" },
                    ]
                  : []
              }
              markers={markers}
            />
            {choke && (
              <aside className="glass-strong animate-rise absolute top-3 right-3 w-[290px] max-w-[80%] rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold">{choke.name}</h3>
                  <button onClick={() => setSelected(null)} aria-label="Close">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <div className="mt-2">
                  <RiskBadge score={scoreOf(choke.id)} />
                </div>
                <div className="mt-3 space-y-2.5">
                  {HORIZONS.map((h) => (
                    <ScoreBar
                      key={h}
                      label={horizonLabel(h)}
                      value={choke.forecast[h]}
                      color={riskColor(choke.forecast[h])}
                      suffix="%"
                    />
                  ))}
                </div>
                <p className="mt-3 text-[12.5px] text-muted-foreground">{choke.threat}</p>
              </aside>
            )}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title={`Chokepoint Forecast — ${horizonLabel(horizon)}`}>
            <div className="space-y-3">
              {CHOKEPOINTS.map((c) => (
                <div
                  key={c.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-border/50 px-3 py-2.5 transition hover:border-primary/40"
                  onClick={() => setSelected(c.id)}
                >
                  <div>
                    <p className="text-[13px] font-medium">{c.name}</p>
                    <p className="num text-[10.5px] text-muted-foreground">
                      {c.volumeMMbd} MMbbl/d · {riskLevel(scoreOf(c.id))}
                    </p>
                  </div>
                  <span className="num text-xl font-semibold" style={{ color: riskColor(scoreOf(c.id)) }}>
                    {scoreOf(c.id)}%
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          {(analyzing || analysis) && (
            <AICallout title="AI RISK ANALYSIS" confidence={analysis ? 91 : undefined}>
              {analyzing ? (
                <span className="num flex items-center gap-2 text-[12.5px] text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" /> Correlating 14,208 signals across 62 sources…
                </span>
              ) : (
                <>
                  <p>
                    AI detects elevated disruption probability around the Strait of Hormuz. Recommend increasing
                    reserve readiness and pre-positioning alternative tanker routes.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Peak modelled risk of {CHOKEPOINTS[0]!.forecast[30]}% occurs at +30 days, decaying to{" "}
                    {CHOKEPOINTS[0]!.forecast[90]}% by +90 days as substitution capacity and convoy protection mature.
                    Bab-el-Mandeb remains a secondary escalation vector; the Cape corridor stays viable throughout.
                  </p>
                </>
              )}
            </AICallout>
          )}
        </div>
      </div>
    </>
  );
}
