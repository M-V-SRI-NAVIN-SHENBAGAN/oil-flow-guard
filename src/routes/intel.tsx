import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Brain, Clock, Filter, Globe2, MapPin, TrendingUp, Wind, Zap } from "lucide-react";
import { FEED, DEMO_FEED_INJECT, type FeedCategory, type FeedSeverity } from "@/data/petro";
import { AICallout, PageHeader, Panel } from "@/components/kit";
import { usePetro } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/intel")({
  head: () => ({
    meta: [
      { title: "Intelligence Feed — PetroShield AI" },
      {
        name: "description",
        content:
          "Real-time-style intelligence feed of geopolitical, shipping, weather, supply and market signals for petroleum supply-chain risk. Simulated data.",
      },
      { property: "og:title", content: "Intelligence Feed — PetroShield AI" },
      {
        property: "og:description",
        content: "Correlated intelligence signals from AIS, news, weather and market sources.",
      },
    ],
  }),
  component: Intel,
});

const CATEGORIES: { id: FeedCategory; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "Geopolitical", icon: Globe2 },
  { id: "Shipping", icon: MapPin },
  { id: "Weather", icon: Wind },
  { id: "Supply", icon: Zap },
  { id: "Market", icon: TrendingUp },
];

const SEVERITY_ORDER: Record<FeedSeverity, number> = { HIGH: 0, MEDIUM: 1, WATCH: 2, LOW: 3 };

function Intel() {
  const { demoActive, demoStep } = usePetro();
  const [filter, setFilter] = useState<FeedCategory | "ALL">("ALL");

  const feed = demoActive && demoStep >= 1 ? [DEMO_FEED_INJECT, ...FEED] : FEED;
  const filtered = filter === "ALL" ? feed : feed.filter((f) => f.category === filter);
  const sorted = [...filtered].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || a.minutesAgo - b.minutesAgo);

  return (
    <>
      <PageHeader
        eyebrow="Layer 07 · Signal Intelligence"
        title="Intelligence Feed"
        description="Correlated stream of geopolitical, shipping, weather, supply and market signals. Severity-ranked and interpreted by the Intelligence Agent."
      />

      <Panel
        title="Filters"
        subtitle="Focus by signal category"
        action={
          <span className="num text-[10.5px] text-muted-foreground">
            {filtered.length} of {feed.length} signals
          </span>
        }
      >
        <div className="flex flex-wrap gap-2">
          <FilterButton id="ALL" label="All" active={filter === "ALL"} onClick={() => setFilter("ALL")} />
          {CATEGORIES.map(({ id, icon: Icon }) => (
            <FilterButton
              key={id}
              id={id}
              label={id}
              active={filter === id}
              onClick={() => setFilter(id)}
              icon={Icon}
            />
          ))}
        </div>
      </Panel>

      <div className="space-y-3">
        {sorted.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>

      <AICallout title="INTELLIGENCE SUMMARY" confidence={94}>
        <p>
          The Intelligence Agent processed <strong className="text-cyan">14,208 signals</strong> in the last hour from 62 sources and flagged{" "}
          <strong className="text-warn">27 items</strong> for escalation. Two HIGH-severity items relate to Hormuz and Bab-el-Mandeb transit — these are the
          dominant drivers of the current risk surface.
        </p>
        <p className="mt-2">
          The demo injection shows how PetroShield would react to a confirmed transit suspension: auto-triggering reroute plans, SPR release triggers and a
          cross-agent consensus recommendation.
        </p>
      </AICallout>
    </>
  );
}

function FeedCard({ item }: { item: (typeof FEED)[number] }) {
  const severity = item.severity;
  const tone =
    severity === "HIGH" ? "border-critical/50 bg-critical/10" : severity === "MEDIUM" ? "border-warn/50 bg-warn/10" : "border-border/60 bg-secondary/30";
  const text = severity === "HIGH" ? "text-critical" : severity === "MEDIUM" ? "text-warn" : severity === "WATCH" ? "text-caution" : "text-muted-foreground";

  const CategoryIcon = CATEGORIES.find((c) => c.id === item.category)?.icon ?? Brain;

  return (
    <div className={cn("animate-rise rounded-xl border p-4 transition hover:border-primary/40", tone)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("num rounded-md border px-2 py-0.5 text-[10.5px] font-semibold tracking-wider", text)}>{severity}</span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CategoryIcon className="h-3.5 w-3.5" /> {item.category}
          </span>
        </div>
        <span className="num flex items-center gap-1 text-[10.5px] text-muted-foreground">
          <Clock className="h-3 w-3" /> {item.minutesAgo}m ago
        </span>
      </div>
      <h3 className="mt-2 text-[15px] font-semibold text-foreground">{item.title}</h3>
      <p className="mt-1 flex items-center gap-1 text-[12px] text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" /> {item.location}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-background/40 p-3">
          <p className="num text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Modelled Impact</p>
          <p className="mt-1 text-[12.5px] text-foreground/90">{item.impact}</p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-3">
          <p className="num text-[10px] tracking-[0.16em] text-primary uppercase">AI Interpretation</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/90">{item.interpretation}</p>
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  id,
  label,
  active,
  onClick,
  icon: Icon,
}: {
  id: FeedCategory | "ALL";
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "num flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10.5px] tracking-[0.1em] transition",
        active ? "border-primary/50 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground",
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label.toUpperCase()}
    </button>
  );
}
