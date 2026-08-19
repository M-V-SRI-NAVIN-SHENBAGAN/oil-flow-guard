import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, Play, ShieldAlert, X } from "lucide-react";
import {
  BRENT_HISTORY,
  CHOKEPOINTS,
  GEO_NODES,
  SUPPLY_MIX,
  TRADE_ROUTES,
  riskColor,
  riskLevel,
} from "@/data/petro";
import { WorldMap } from "@/components/map/WorldMap";
import { AICallout, MetricCard, Panel, PageHeader, RiskBadge, ScoreBar } from "@/components/kit";
import { usePetro } from "@/lib/store";
import { chartTooltip } from "@/components/chartTheme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PetroShield AI — Global Oil Supply Risk Command Center" },
      {
        name: "description",
        content:
          "Live-style command center for global petroleum supply risk: chokepoint scoring, trade-route mapping and AI disruption guidance. Simulated demo data.",
      },
      { property: "og:title", content: "PetroShield AI — Global Oil Supply Risk Command Center" },
      {
        property: "og:description",
        content: "Predict. Simulate. Reroute. Stabilize. AI-powered strategic petroleum intelligence.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { kpis, hormuzRisk, demoActive, startDemo, askCopilot } = usePetro();
  const [selected, setSelected] = useState<string | null>(null);
  const choke = CHOKEPOINTS.find((c) => c.id === selected);
  const risk = (c: (typeof CHOKEPOINTS)[number]) => (c.id === "hormuz" ? hormuzRisk : c.risk);

  return (
    <>
      <PageHeader
        eyebrow="Predict. Simulate. Reroute. Stabilize."
        title="PetroShield AI"
        description="AI-Powered Strategic Petroleum Intelligence — detecting geopolitical risk, simulating supply disruption and optimizing global crude logistics."
        action={
          <button
            onClick={startDemo}
            className="num flex items-center gap-2 rounded-lg border border-critical/45 bg-gradient-to-r from-critical/30 to-warn/20 px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] transition hover:from-critical/45"
          >
            <Play className="h-4 w-4" /> RUN DISRUPTION DEMO
          </button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((k) => (
          <MetricCard
            key={k.id}
            label={k.label}
            value={k.value}
            decimals={k.decimals ?? 0}
            {...(k.prefix ? { prefix: k.prefix } : {})}
            {...(k.suffix ? { suffix: k.suffix } : {})}
            delta={k.delta}
            deltaLabel={k.deltaLabel}
            tone={k.tone}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Global Oil Trade & Chokepoint Risk"
          subtitle="Simulated tanker corridors, producing regions and heat-mapped risk zones — click a chokepoint for detail"
          action={
            <span
              className={`num rounded-md border px-2 py-1 text-[10.5px] tracking-[0.16em] ${
                demoActive
                  ? "border-critical/50 bg-critical/15 text-critical"
                  : "border-warn/50 bg-warn/15 text-warn"
              }`}
            >
              {demoActive ? "STATUS: CRITICAL" : "STATUS: HIGH"}
            </span>
          }
          bodyClassName="p-0"
          className="overflow-hidden"
        >
          <div className="relative">
            <WorldMap
              className="aspect-[2/1]"
              routes={TRADE_ROUTES.map((r) => ({
                id: r.id,
                points: r.points,
                risk: r.id === "gulf-india" || r.id === "gulf-asia" ? hormuzRisk : r.risk,
                width: r.kind === "primary" ? 1.8 : 1.2,
                dashed: r.kind === "alt",
              }))}
              heat={CHOKEPOINTS.map((c) => ({ lon: c.lon, lat: c.lat, risk: risk(c) }))}
              tankers={[
                { id: "t1", points: TRADE_ROUTES[0]!.points, duration: 10 },
                { id: "t2", points: TRADE_ROUTES[1]!.points, duration: 16, delay: 1 },
                { id: "t3", points: TRADE_ROUTES[3]!.points, duration: 18, delay: 2, color: "var(--safe)" },
                { id: "t4", points: TRADE_ROUTES[5]!.points, duration: 14, delay: 3, color: "var(--caution)" },
              ]}
              markers={[
                ...GEO_NODES.map((n) => ({ id: n.id, lon: n.lon, lat: n.lat, kind: n.type })),
                ...CHOKEPOINTS.map((c) => ({
                  id: c.id,
                  lon: c.lon,
                  lat: c.lat,
                  kind: "chokepoint" as const,
                  risk: risk(c),
                  label: `${c.short} ${risk(c)}%`,
                  active: selected === c.id,
                  onClick: () => setSelected(c.id),
                })),
              ]}
            />

            <div className="num absolute bottom-3 left-4 flex flex-wrap gap-3 text-[10px] text-muted-foreground">
              {[
                ["var(--critical)", "HIGH RISK"],
                ["var(--warn)", "MEDIUM"],
                ["var(--safe)", "LOW / ALT CORRIDOR"],
                ["var(--caution)", "PRODUCER"],
                ["var(--cyan)", "DEMAND HUB"],
              ].map(([c, l]) => (
                <span key={l} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                  {l}
                </span>
              ))}
            </div>

            {choke && (
              <aside className="glass-strong animate-rise absolute top-3 right-3 bottom-3 w-[320px] max-w-[80%] overflow-y-auto rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="num text-[10px] tracking-[0.22em] text-primary">CHOKEPOINT DOSSIER</p>
                    <h3 className="mt-1 text-lg font-semibold">{choke.name}</h3>
                  </div>
                  <button onClick={() => setSelected(null)} aria-label="Close">
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <div className="mt-3">
                  <RiskBadge score={risk(choke)} />
                </div>
                <div className="mt-4 space-y-3">
                  <ScoreBar label="Risk score" value={risk(choke)} color={riskColor(risk(choke))} suffix="%" />
                  <ScoreBar
                    label="Disruption probability"
                    value={choke.disruptionProbability}
                    color="var(--warn)"
                    suffix="%"
                  />
                </div>
                <dl className="mt-4 space-y-2 text-[12.5px]">
                  <Row k="Volume through" v={`${choke.volumeMMbd} MMbbl/d`} />
                  <Row k="Threat level" v={riskLevel(risk(choke))} />
                  <Row k="Coordinates" v={`${choke.lat}°, ${choke.lon}°`} />
                </dl>
                <p className="mt-3 text-[12.5px] text-muted-foreground">{choke.threat}</p>
                <p className="num mt-4 text-[10px] tracking-[0.2em] text-muted-foreground">ALTERNATIVE ROUTES</p>
                <ul className="mt-1.5 space-y-1 text-[12.5px]">
                  {choke.alternatives.map((a) => (
                    <li key={a} className="flex items-start gap-1.5">
                      <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safe" />
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-lg border border-primary/35 bg-primary/10 p-3">
                  <p className="num text-[10px] tracking-[0.2em] text-primary">AI RECOMMENDATION</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed">{choke.recommendation}</p>
                </div>
              </aside>
            )}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Chokepoint Risk Board" subtitle="Simulated composite risk index">
            <div className="space-y-3.5">
              {CHOKEPOINTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className="w-full text-left transition hover:opacity-90"
                >
                  <ScoreBar label={c.name} value={risk(c)} color={riskColor(risk(c))} suffix="%" />
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Brent & Risk Index — 30 Days">
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={BRENT_HISTORY}>
                <defs>
                  <linearGradient id="brentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--critical)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--critical)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} domain={[70, 100]} width={34} tickLine={false} />
                <Tooltip {...chartTooltip} />
                <Area
                  type="monotone"
                  dataKey="price"
                  name="Brent $/bbl"
                  stroke="var(--critical)"
                  strokeWidth={2}
                  fill="url(#brentFill)"
                />
                <Line type="monotone" dataKey="risk" name="Risk index" stroke="var(--primary)" strokeWidth={1.6} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Panel>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
        <Panel title="Regional Supply & Risk" subtitle="MMbbl/d production vs composite risk">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={SUPPLY_MIX} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} />
              <YAxis
                type="category"
                dataKey="region"
                stroke="var(--muted-foreground)"
                fontSize={10}
                width={98}
                tickLine={false}
              />
              <Tooltip {...chartTooltip} cursor={{ fill: "var(--secondary)", opacity: 0.3 }} />
              <Bar dataKey="volume" name="MMbbl/d" radius={[0, 4, 4, 0]}>
                {SUPPLY_MIX.map((s) => (
                  <Cell key={s.region} fill={riskColor(s.risk)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <AICallout title="AI STRATEGIC ASSESSMENT" confidence={92}>
          <p>
            The Strait of Hormuz remains the dominant systemic vulnerability at{" "}
            <strong className="text-critical">{hormuzRisk}% risk</strong>, with 20.9 MMbbl/d of transit exposure.
            Combined with elevated Bab-el-Mandeb activity, PetroShield estimates a 68% probability of a material
            supply disruption within 90 days and 4.2 MMbbl/d of at-risk volume.
          </p>
          <p className="mt-2">
            Recommended posture: pre-position alternative tanker capacity through the Cape of Good Hope corridor,
            hedge Q3 exposure, and raise strategic reserve readiness to Tier-2 while coverage stands at 43 days.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/simulator"
              className="num flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] tracking-[0.14em] text-primary hover:bg-primary/20"
            >
              <ShieldAlert className="h-3.5 w-3.5" /> RUN SCENARIO
            </Link>
            <Link
              to="/route-optimizer"
              className="num rounded-md border border-cyan/40 bg-cyan/10 px-3 py-1.5 text-[11px] tracking-[0.14em] text-cyan hover:bg-cyan/20"
            >
              OPTIMIZE ROUTES
            </Link>
            <button
              onClick={() => askCopilot("What happens if Hormuz closes for 60 days?")}
              className="num rounded-md border border-border/70 px-3 py-1.5 text-[11px] tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              ASK COPILOT
            </button>
          </div>
        </AICallout>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="num font-medium">{v}</dd>
    </div>
  );
}
