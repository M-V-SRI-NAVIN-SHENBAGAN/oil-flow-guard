import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader2, Play } from "lucide-react";
import {
  SCENARIOS,
  simulateScenario,
  scenarioMilestones,
  type ScenarioPoint,
} from "@/data/petro";
import { AICallout, AnimatedNumber, PageHeader, Panel } from "@/components/kit";
import { chartTooltip } from "@/components/chartTheme";
import { usePetro } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Scenario Impact Simulator — PetroShield AI" },
      {
        name: "description",
        content:
          "Simulate oil supply disruptions across 30/60/90 days: supply gap, Brent price, refining utilisation and SPR requirement. Prototype data.",
      },
      { property: "og:title", content: "Scenario Impact Simulator — PetroShield AI" },
      {
        property: "og:description",
        content: "Model chokepoint disruptions and their global price and supply consequences.",
      },
    ],
  }),
  component: Simulator,
});

function Simulator() {
  const { demoActive, demoStep } = usePetro();
  const [preset, setPreset] = useState(SCENARIOS[0]!);
  const [severity, setSeverity] = useState(SCENARIOS[0]!.severity);
  const [duration, setDuration] = useState(SCENARIOS[0]!.duration);
  const [volume, setVolume] = useState(SCENARIOS[0]!.volume);
  const [startDate, setStartDate] = useState("2026-09-01");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ScenarioPoint[] | null>(null);

  const autoRun = demoActive && demoStep >= 3 && !result;
  if (autoRun) {
    // deterministic auto-fill during the scripted demo
    setTimeout(() => setResult(simulateScenario({ location: preset.location, severity: 95, duration: 60, volume: 18, startDate })), 0);
  }

  const choose = (s: (typeof SCENARIOS)[number]) => {
    setPreset(s);
    setSeverity(s.severity);
    setDuration(s.duration);
    setVolume(s.volume);
    setResult(null);
  };

  const run = () => {
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(simulateScenario({ location: preset.location, severity, duration, volume, startDate }));
      setRunning(false);
    }, 1700);
  };

  const milestones = result ? scenarioMilestones(result) : null;
  const last = result?.[result.length - 1];

  return (
    <>
      <PageHeader
        eyebrow="Layer 03 · Impact Modelling"
        title="Scenario Simulator"
        description="Construct hypothetical disruption events and quantify their 30/60/90-day effect on global supply, price and reserve requirements."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {SCENARIOS.map((s) => {
          const on = preset.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => choose(s)}
              className={cn(
                "glass animate-rise relative overflow-hidden rounded-xl p-4 text-left transition hover:-translate-y-0.5",
                on && "ring-1 ring-primary/60",
              )}
            >
              <span
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ background: `var(--${s.tone === "caution" ? "caution" : s.tone})` }}
              />
              <p className="num text-[10px] tracking-[0.22em] text-muted-foreground">{s.code}</p>
              <p className="mt-1.5 text-[15px] font-semibold">{s.title}</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{s.summary}</p>
              <p className="num mt-3 text-[10.5px] text-primary">
                SEV {s.severity} · {s.duration}D · {s.volume} MMbbl/d
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
        <Panel title="Scenario Parameters">
          <div className="space-y-5">
            <Field label="Disruption location">
              <select
                value={preset.id}
                onChange={(e) => choose(SCENARIOS.find((s) => s.id === e.target.value)!)}
                className="w-full rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-[13px] outline-none"
              >
                {SCENARIOS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.location}
                  </option>
                ))}
              </select>
            </Field>
            <Slider label="Severity" value={severity} min={10} max={100} suffix="%" onChange={setSeverity} />
            <Slider label="Duration" value={duration} min={7} max={120} suffix=" days" onChange={setDuration} />
            <Slider
              label="Affected volume"
              value={volume}
              min={1}
              max={21}
              step={0.5}
              suffix=" MMbbl/d"
              onChange={setVolume}
            />
            <Field label="Start date">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="num w-full rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-[13px] outline-none"
              />
            </Field>

            <button
              onClick={run}
              disabled={running}
              className="num flex w-full items-center justify-center gap-2 rounded-lg border border-primary/50 bg-gradient-to-r from-primary/35 to-cyan/20 py-3.5 text-[12px] font-bold tracking-[0.2em] transition hover:from-primary/55 disabled:opacity-60"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              RUN AI SIMULATION
            </button>
          </div>
        </Panel>

        <div className="space-y-5">
          {!result && !running && (
            <Panel title="Awaiting Simulation">
              <p className="py-16 text-center text-sm text-muted-foreground">
                Configure a disruption scenario and run the AI simulation to generate a 90-day impact forecast.
              </p>
            </Panel>
          )}

          {running && (
            <Panel title="Simulation In Progress">
              <div className="space-y-2 py-12 text-center">
                <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
                <p className="num text-[12px] tracking-[0.16em] text-muted-foreground">
                  RUNNING 4,000 MONTE CARLO PATHS…
                </p>
              </div>
            </Panel>
          )}

          {result && milestones && last && (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                {milestones.map((m) => (
                  <div key={m.day} className="glass animate-rise rounded-xl p-4">
                    <p className="num text-[10.5px] tracking-[0.22em] text-primary">{m.day} DAYS</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">Supply gap</p>
                    <p className="num text-2xl font-semibold text-critical">
                      <AnimatedNumber value={m.gap} decimals={1} suffix=" MMbbl/d" />
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground">Brent price</p>
                    <p className="num text-xl font-semibold text-warn">
                      <AnimatedNumber value={m.price} decimals={0} prefix="$" suffix="/bbl" />
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Baseline" subtitle="No disruption">
                  <Stat k="Global supply" v={`${last.baselineSupply} MMbbl/d`} />
                  <Stat k="Supply gap" v="0.0 MMbbl/d" tone="safe" />
                  <Stat k="Brent crude" v={`$${last.baselinePrice}/bbl`} />
                  <Stat k="Refining utilisation" v="92.0%" />
                  <Stat k="Shipping cost index" v="100" />
                  <Stat k="SPR requirement" v="0.00 MMbbl/d" tone="safe" />
                </Panel>
                <Panel title="Disrupted" subtitle={`${preset.title} · day 90`} className="ring-1 ring-critical/30">
                  <Stat k="Global supply" v={`${last.disruptedSupply} MMbbl/d`} tone="warn" />
                  <Stat k="Supply gap" v={`${last.gap} MMbbl/d`} tone="critical" />
                  <Stat k="Brent crude" v={`$${last.price}/bbl`} tone="critical" />
                  <Stat k="Refining utilisation" v={`${last.refining}%`} tone="warn" />
                  <Stat k="Shipping cost index" v={`${last.shipping}`} tone="warn" />
                  <Stat k="SPR requirement" v={`${last.sprDraw} MMbbl/d`} tone="critical" />
                </Panel>
              </div>

              <Panel title="Supply & Price Trajectory" subtitle="Baseline vs disrupted — simulated">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={result}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="day"
                      stroke="var(--muted-foreground)"
                      fontSize={10}
                      tickFormatter={(d) => `D${d}`}
                    />
                    <YAxis yAxisId="l" stroke="var(--muted-foreground)" fontSize={10} width={38} />
                    <YAxis yAxisId="r" orientation="right" stroke="var(--muted-foreground)" fontSize={10} width={40} />
                    <Tooltip {...chartTooltip} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      yAxisId="l"
                      type="monotone"
                      dataKey="baselinePrice"
                      name="Baseline $/bbl"
                      stroke="var(--muted-foreground)"
                      strokeDasharray="4 4"
                      dot={false}
                    />
                    <Line
                      yAxisId="l"
                      type="monotone"
                      dataKey="price"
                      name="Disrupted $/bbl"
                      stroke="var(--critical)"
                      strokeWidth={2.4}
                      dot={false}
                    />
                    <Line
                      yAxisId="r"
                      type="monotone"
                      dataKey="gap"
                      name="Supply gap MMbbl/d"
                      stroke="var(--caution)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="r"
                      type="monotone"
                      dataKey="sprDraw"
                      name="SPR draw MMbbl/d"
                      stroke="var(--safe)"
                      strokeWidth={1.8}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Panel>

              <AICallout title="AI SIMULATION SUMMARY" confidence={88}>
                Under the selected scenario, global supply disruption reaches{" "}
                <strong className="text-critical">{last.gap} MMbbl/d</strong> by day 90 with Brent at{" "}
                <strong className="text-warn">${last.price}/bbl</strong>. India faces elevated import exposure through
                the affected corridor. AI recommends rerouting 18% of affected cargo through alternative corridors and
                initiating a controlled SPR release once the deficit exceeds 3.0 MMbbl/d.
              </AICallout>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="num mb-1.5 text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      {children}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="num text-[10px] tracking-[0.16em] text-muted-foreground uppercase">{label}</span>
        <span className="num text-[12px] font-semibold text-primary">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
        aria-label={label}
      />
    </div>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: "critical" | "warn" | "safe" }) {
  const c = tone ? `text-${tone}` : "text-foreground";
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2 text-[13px] last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className={cn("num font-semibold", c)}>{v}</span>
    </div>
  );
}
