import { createFileRoute } from "@tanstack/react-router";
import { Activity, Brain, CheckCircle2, Clock, Cpu, Loader2, Radio, ShieldCheck, Zap } from "lucide-react";
import { AGENTS, DECISION_ENGINE } from "@/data/petro";
import { AICallout, PageHeader, Panel } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "AI Agents — PetroShield AI" },
      {
        name: "description",
        content:
          "Multi-agent swarm for petroleum intelligence: signal ingestion, risk analysis, scenario simulation, route optimization and SPR policy. Simulated demo.",
      },
      { property: "og:title", content: "AI Agents — PetroShield AI" },
      {
        property: "og:description",
        content: "Specialist AI agents working together to predict, simulate, reroute and stabilize oil supply.",
      },
    ],
  }),
  component: Agents,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  intel: Radio,
  risk: Brain,
  scenario: Activity,
  optimize: Cpu,
  reserve: ShieldCheck,
};

function Agents() {
  return (
    <>
      <PageHeader
        eyebrow="Layer 06 · Multi-Agent Swarm"
        title="AI Agents"
        description="Five specialist agents ingest signals, quantify risk, run disruption simulations, optimize routes and manage SPR policy — coordinated by a strategic decision engine."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AgentStat label="Agents Active" value={AGENTS.filter((a) => a.status === "ACTIVE").length} suffix=" / 5" icon={Zap} tone="safe" />
        <AgentStat label="Processing" value={AGENTS.filter((a) => a.status === "PROCESSING").length} suffix="" icon={Loader2} tone="warn" />
        <AgentStat label="Avg Confidence" value={Math.round(AGENTS.reduce((a, b) => a + b.confidence, 0) / AGENTS.length)} suffix="%" icon={CheckCircle2} tone="cyan" />
        <AgentStat label="Decision Engine" value={DECISION_ENGINE.confidence} suffix="%" icon={Brain} tone="primary" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {AGENTS.map((agent) => {
          const Icon = ICONS[agent.id] ?? Activity;
          return (
            <Panel key={agent.id} title={agent.name} subtitle={agent.role} className="animate-rise">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-cyan/20">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold">{agent.name}</p>
                  <StatusBadge status={agent.status} />
                </div>
              </div>

              <div className="mt-4 space-y-3 text-[12.5px]">
                <div>
                  <p className="num text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Inputs</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1">
                    {agent.inputs.map((i) => (
                      <li key={i} className="rounded-md border border-border/60 px-2 py-0.5 text-[10.5px] text-muted-foreground">
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="num text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Current Task</p>
                  <p className="mt-1 text-foreground/90">{agent.task}</p>
                </div>
                <div className="rounded-lg border border-primary/30 bg-primary/10 p-3">
                  <p className="num text-[10px] tracking-[0.16em] text-primary uppercase">Latest Output</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/90">{agent.output}</p>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> Latency {agent.latency}
                  </span>
                  <span className="num rounded-md bg-primary/15 px-2 py-0.5 text-[10.5px] font-semibold text-primary">
                    Confidence {agent.confidence}%
                  </span>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel title="Strategic Decision Engine" subtitle="Cross-agent coordination output">
        <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
          <ul className="space-y-2">
            {DECISION_ENGINE.outputs.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-safe" />
                <span className="text-foreground/90">{o}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col justify-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 text-center">
            <p className="num text-[10px] tracking-[0.2em] text-primary uppercase">Consensus Confidence</p>
            <p className="text-4xl font-semibold text-foreground">
              <span className="num">{DECISION_ENGINE.confidence}</span>%
            </p>
            <p className="text-[11px] text-muted-foreground">All agents aligned on recommended posture</p>
          </div>
        </div>
      </Panel>

      <AICallout title="AGENT SWARM SUMMARY" confidence={DECISION_ENGINE.confidence}>
        The swarm is currently tracking 14,208 signals per hour across 62 sources. The consensus decision is to reroute 18% of exposed cargo via the Cape of
        Good Hope, hold SPR release until the deficit exceeds 3.0 MMbbl/d, and hedge 62% of Q3 price exposure. All recommendations update automatically as new
        signals arrive.
      </AICallout>
    </>
  );
}

function StatusBadge({ status }: { status: "ACTIVE" | "PROCESSING" | "STANDBY" }) {
  const styles =
    status === "ACTIVE"
      ? "bg-safe/15 text-safe border-safe/40"
      : status === "PROCESSING"
        ? "bg-warn/15 text-warn border-warn/40"
        : "bg-muted/15 text-muted-foreground border-border/60";
  return (
    <span className={cn("num inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10.5px] font-semibold tracking-wider", styles)}>
      {status === "PROCESSING" && <Loader2 className="h-3 w-3 animate-spin" />}
      {status === "ACTIVE" && <span className="relative h-1.5 w-1.5 rounded-full bg-current" />}
      {status}
    </span>
  );
}

function AgentStat({
  label,
  value,
  suffix,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  suffix: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "safe" | "warn" | "cyan" | "primary";
}) {
  const c = tone === "safe" ? "text-safe" : tone === "warn" ? "text-warn" : tone === "cyan" ? "text-cyan" : "text-primary";
  return (
    <div className="glass rounded-xl px-4 py-3.5">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", c)} />
        <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      </div>
      <p className={cn("mt-1 text-2xl font-semibold", c)}>
        <span className="num">{value}</span>
        {suffix}
      </p>
    </div>
  );
}
