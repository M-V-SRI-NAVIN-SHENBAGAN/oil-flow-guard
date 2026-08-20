import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Droplets, ShieldCheck, TrendingDown } from "lucide-react";
import { RESERVES, SPR_SCENARIO_META, sprCurves, type SprScenario } from "@/data/petro";
import { AICallout, AnimatedNumber, PageHeader, Panel, ScoreBar } from "@/components/kit";
import { chartTooltip } from "@/components/chartTheme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reserves")({
  head: () => ({
    meta: [
      { title: "Strategic Petroleum Reserves — PetroShield AI" },
      {
        name: "description",
        content:
          "Monitor SPR fill levels, coverage days and simulated drawdown under normal, moderate and severe disruption scenarios. Prototype data.",
      },
      { property: "og:title", content: "Strategic Petroleum Reserves — PetroShield AI" },
      {
        property: "og:description",
        content: "Simulate reserve drawdown and keep coverage above the strategic threshold.",
      },
    ],
  }),
  component: Reserves,
});

const SCENARIOS: SprScenario[] = ["NORMAL", "MODERATE", "SEVERE"];

function Reserves() {
  const [scenario, setScenario] = useState<SprScenario>("MODERATE");
  const meta = SPR_SCENARIO_META[scenario];
  const data = sprCurves(scenario);
  const latest = data[data.length - 1]!;
  const totalCoverage = RESERVES.reduce((acc, r) => acc + r.coverageDays, 0);
  const totalCapacity = RESERVES.reduce((acc, r) => acc + r.capacityMMT, 0);
  const avgFill = RESERVES.reduce((acc, r) => acc + r.fill, 0) / RESERVES.length;

  return (
    <>
      <PageHeader
        eyebrow="Layer 05 · Reserve Management"
        title="Strategic Petroleum Reserves"
        description="Track Indian SPR sites, model 90-day drawdown under disruption scenarios, and arm release triggers to keep coverage above the 30-day strategic threshold."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReserveStat label="Total Capacity" value={totalCapacity} suffix=" MMT" />
        <ReserveStat label="Average Fill" value={avgFill} suffix="%" />
        <ReserveStat label="Aggregate Coverage" value={totalCoverage} suffix=" days" />
        <ReserveStat label="90-Day Recovery" value={latest.recovery ?? 0} suffix="%" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="Reserve Sites" subtitle="Live-style SPR inventory dashboard">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {RESERVES.map((r) => (
              <div key={r.id} className="glass rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/15">
                    <Droplets className="h-4 w-4 text-cyan" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground">{r.state}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <ScoreBar label="Fill level" value={r.fill} color="var(--cyan)" suffix="%" />
                  <ScoreBar label="Coverage" value={r.coverageDays} color="var(--primary)" suffix=" days" />
                </div>
                <dl className="mt-3 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="num">{r.capacityMMT} MMT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max release</span>
                    <span className="num">{r.releaseRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Refill</span>
                    <span className="num">{r.recovery}</span>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Scenario Selector" subtitle="Choose a disruption severity">
          <div className="space-y-3">
            {SCENARIOS.map((s) => {
              const on = scenario === s;
              return (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-left transition",
                    on
                      ? "border-primary/50 bg-primary/15"
                      : "border-border/60 bg-secondary/30 hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold">{s}</span>
                    <span
                      className={cn(
                        "num rounded-md px-2 py-0.5 text-[10.5px] font-semibold",
                        s === "SEVERE" ? "bg-critical/15 text-critical" : "bg-primary/15 text-primary",
                      )}
                    >
                      {meta.rate} MMbbl/d
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">{SPR_SCENARIO_META[s].note}</p>
                </button>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="90-Day Fill Trajectory" subtitle={`${scenario} scenario · simulated drawdown`}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={10} tickFormatter={(d) => `D${d}`} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} domain={[0, 100]} width={38} />
              <Tooltip {...chartTooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {RESERVES.map((r) => (
                <Line
                  key={r.id}
                  type="monotone"
                  dataKey={r.id}
                  name={r.name}
                  stroke={r.id === "vizag" ? "var(--cyan)" : r.id === "mangalore" ? "var(--primary)" : "var(--safe)"}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
              <Line
                type="monotone"
                dataKey="recovery"
                name="Recovery rate %"
                stroke="var(--warn)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Aggregate Coverage" subtitle="Days of import coverage vs 30-day threshold">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="covFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={10} tickFormatter={(d) => `D${d}`} />
              <YAxis stroke="var(--muted-foreground)" fontSize={10} width={38} />
              <Tooltip {...chartTooltip} />
              <Area
                type="monotone"
                dataKey="recovery"
                name="Coverage proxy"
                stroke="var(--cyan)"
                strokeWidth={2}
                fill="url(#covFill)"
              />
              <Line type="monotone" dataKey={() => 30} name="30-day threshold" stroke="var(--critical)" strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <AICallout title="SPR POLICY RECOMMENDATION" confidence={86}>
        <p>
          Under the <strong className="text-warn">{scenario}</strong> scenario, the Strategic Reserve Agent recommends:{" "}
          <strong className="text-foreground">{meta.note}</strong>
        </p>
        <p className="mt-2">
          Aggregate coverage is projected at <strong className="text-cyan">{latest.recovery}%</strong> of the strategic threshold by Day 90. Maintain a
          controlled release posture and begin pre-positioning refill cargoes once the deficit falls below 2.0 MMbbl/d.
        </p>
      </AICallout>
    </>
  );
}

function ReserveStat({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="glass rounded-xl px-4 py-3.5">
      <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">
        <AnimatedNumber value={value} decimals={suffix === " days" ? 0 : 1} suffix={suffix} />
      </p>
    </div>
  );
}
