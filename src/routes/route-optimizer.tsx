import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Route as RouteIcon, Ship, Timer, TrendingDown, AlertTriangle } from "lucide-react";
import { ROUTE_COMPARISON } from "@/data/petro";
import { WorldMap } from "@/components/map/WorldMap";
import { AICallout, AnimatedNumber, PageHeader, Panel } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/route-optimizer")({
  head: () => ({
    meta: [
      { title: "Route Optimizer — PetroShield AI" },
      {
        name: "description",
        content:
          "AI-optimized tanker rerouting: compare standard and alternative corridors across risk, cost, transit time and reliability. Simulated prototype.",
      },
      { property: "og:title", content: "Route Optimizer — PetroShield AI" },
      {
        property: "og:description",
        content: "Reduce maritime risk through AI-suggested alternative tanker corridors.",
      },
    ],
  }),
  component: RouteOptimizer,
});

const ROUTES = [
  { key: "standard", ...ROUTE_COMPARISON.standard },
  { key: "optimized", ...ROUTE_COMPARISON.optimized },
] as const;

function RouteOptimizer() {
  const [selected, setSelected] = useState<"standard" | "optimized">("optimized");
  const active = ROUTE_COMPARISON[selected];

  return (
    <>
      <PageHeader
        eyebrow="Layer 04 · Logistics Optimization"
        title="Route Optimizer"
        description="Solve multi-objective tanker routing across laden voyages. Trade transit time and freight cost for risk reduction and supply reliability."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Standard risk" value={ROUTE_COMPARISON.standard.risk} suffix="%" tone="critical" />
        <MiniStat label="Optimized risk" value={ROUTE_COMPARISON.optimized.risk} suffix="%" tone="safe" />
        <MiniStat label="Risk reduction" value={ROUTE_COMPARISON.standard.risk - ROUTE_COMPARISON.optimized.risk} suffix=" pts" tone="safe" />
        <MiniStat label="Exposed cargo rerouted" value={18} suffix="%" tone="cyan" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Corridor Comparison" subtitle="Standard vs AI-optimized route" bodyClassName="p-0" className="overflow-hidden">
          <div className="relative">
            <WorldMap
              className="aspect-[2/1]"
              routes={ROUTES.map((r) => ({
                id: r.key,
                points: r.points,
                risk: r.risk,
                width: r.key === selected ? 2.6 : 1.2,
                dashed: r.key === "standard",
              }))}
              heat={[
                { lon: 56.5, lat: 26.6, risk: 82 },
                { lon: 18.5, lat: -34.6, risk: 21 },
              ]}
              tankers={[
                { id: "ro-1", points: ROUTE_COMPARISON.standard.points, duration: 10, color: "var(--critical)" },
                { id: "ro-2", points: ROUTE_COMPARISON.optimized.points, duration: 16, delay: 2, color: "var(--safe)" },
              ]}
              markers={[
                { id: "ras", lon: 50.0, lat: 26.6, kind: "producer" },
                { id: "jamnagar", lon: 70.0, lat: 22.4, kind: "refinery" },
                { id: "hormuz", lon: 56.5, lat: 26.6, kind: "chokepoint", risk: 82, label: "HORMUZ 82%" },
                { id: "cape", lon: 18.5, lat: -34.6, kind: "chokepoint", risk: 21, label: "CAPE 21%" },
              ]}
            />
            <div className="num absolute bottom-3 left-4 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-[var(--critical)]" /> Standard route
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-[var(--safe)]" /> AI optimized route
              </span>
            </div>
          </div>
        </Panel>

        <div className="space-y-5">
          {ROUTES.map((r) => {
            const on = selected === r.key;
            return (
              <button
                key={r.key}
                onClick={() => setSelected(r.key)}
                className={cn(
                  "w-full animate-rise rounded-xl border p-4 text-left transition",
                  on ? "glass-strong border-primary/50" : "glass border-border/60 hover:border-primary/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RouteIcon className={cn("h-4 w-4", on ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-[13px] font-semibold", on ? "text-foreground" : "text-muted-foreground")}>
                      {r.name}
                    </span>
                  </div>
                  {on && <CheckCircle2 className="h-4 w-4 text-safe" />}
                </div>
                <p className="mt-1.5 text-[12px] text-muted-foreground">{r.path}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-md bg-secondary/40 px-2.5 py-1.5">
                    <span className="text-muted-foreground">Distance</span>
                    <p className="num mt-0.5 font-semibold text-foreground">{r.distance.toLocaleString()} nm</p>
                  </div>
                  <div className="rounded-md bg-secondary/40 px-2.5 py-1.5">
                    <span className="text-muted-foreground">Transit</span>
                    <p className="num mt-0.5 font-semibold text-foreground">{r.transit} days</p>
                  </div>
                  <div className="rounded-md bg-secondary/40 px-2.5 py-1.5">
                    <span className="text-muted-foreground">Cost</span>
                    <p className="num mt-0.5 font-semibold text-foreground">${r.cost}M/voyage</p>
                  </div>
                  <div className="rounded-md bg-secondary/40 px-2.5 py-1.5">
                    <span className="text-muted-foreground">Reliability</span>
                    <p className="num mt-0.5 font-semibold text-foreground">{r.reliability}%</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={cn("num rounded-md px-2 py-0.5 text-[10.5px] font-semibold", r.risk >= 70 ? "bg-critical/15 text-critical" : "bg-safe/15 text-safe")}>
                    RISK {r.risk}%
                  </span>
                  {r.key === "optimized" && (
                    <span className="num rounded-md bg-cyan/15 px-2 py-0.5 text-[10.5px] font-semibold text-cyan">
                      -55 RISK PTS
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          <AICallout title="AI ROUTING RECOMMENDATION" confidence={90}>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-[12.5px]">
                <Ship className="h-4 w-4 text-primary" />
                <span>
                  Reroute <strong className="text-cyan">18%</strong> of exposed India-bound cargo
                </span>
              </div>
              <div className="flex items-center gap-2 text-[12.5px]">
                <Timer className="h-4 w-4 text-warn" />
                <span>+6 transit days accepted</span>
              </div>
              <div className="flex items-center gap-2 text-[12.5px]">
                <TrendingDown className="h-4 w-4 text-safe" />
                <span>
                  Risk <strong className="text-critical">82%</strong> → <strong className="text-safe">27%</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[12.5px]">
                <AlertTriangle className="h-4 w-4 text-warn" />
                <span>Reliability 61% → 89%</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="num flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] tracking-[0.14em] text-primary hover:bg-primary/20">
                <ArrowRight className="h-3.5 w-3.5" /> APPLY TO 38 VOYAGES
              </button>
            </div>
          </AICallout>
        </div>
      </div>
    </>
  );
}

function MiniStat({ label, value, suffix, tone }: { label: string; value: number; suffix: string; tone: "critical" | "safe" | "cyan" }) {
  const c = tone === "critical" ? "text-critical" : tone === "safe" ? "text-safe" : "text-cyan";
  return (
    <div className="glass rounded-xl px-4 py-3.5">
      <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold", c)}>
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
    </div>
  );
}
