import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  Cpu,
  Droplets,
  Fuel,
  Gauge,
  Globe2,
  Play,
  Radio,
  RotateCcw,
  Route as RouteIcon,
  ShieldAlert,
  UserCircle2,
} from "lucide-react";
import type { ReactNode } from "react";
import { usePetro } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AICopilot } from "@/components/AICopilot";
import { DemoTimeline } from "@/components/DemoTimeline";
import { AnimatedNumber } from "@/components/kit";

const NAV = [
  { to: "/", label: "Overview", icon: Gauge },
  { to: "/risk-map", label: "Risk Map", icon: Globe2 },
  { to: "/simulator", label: "Scenario Simulator", icon: Activity },
  { to: "/route-optimizer", label: "Route Optimizer", icon: RouteIcon },
  { to: "/reserves", label: "Strategic Reserves", icon: Fuel },
  { to: "/agents", label: "AI Agents", icon: Cpu },
  { to: "/intel", label: "Intelligence Feed", icon: Radio },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { kpis, demoActive, startDemo, resetDemo } = usePetro();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const risk = kpis[0]?.value ?? 71;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="glass sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col rounded-none border-y-0 border-l-0 lg:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-cyan/50 shadow-[0_0_24px_-6px_var(--primary)]">
            <Droplets className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display text-[15px] leading-tight font-bold tracking-wide">PETROSHIELD</p>
            <p className="num text-[9.5px] tracking-[0.28em] text-primary">AI · INTEL</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition",
                  active
                    ? "bg-primary/12 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                )}
              >
                {active && (
                  <span className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r bg-primary shadow-[0_0_12px_var(--primary)]" />
                )}
                <Icon className={cn("h-4 w-4", active && "text-primary")} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2.5 p-3">
          <button
            onClick={demoActive ? resetDemo : startDemo}
            className={cn(
              "num flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-3 text-[11px] font-semibold tracking-[0.14em] transition",
              demoActive
                ? "border-critical/50 bg-critical/15 text-critical hover:bg-critical/25"
                : "border-critical/40 bg-gradient-to-r from-critical/25 to-warn/20 text-foreground hover:from-critical/40",
            )}
          >
            {demoActive ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {demoActive ? "RESET DEMO" : "RUN DISRUPTION DEMO"}
          </button>
          <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
            Prototype · all figures are simulated demo data, not live intelligence.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="glass sticky top-0 z-40 flex flex-wrap items-center gap-4 rounded-none border-x-0 border-t-0 px-5 py-3">
          <div className="flex items-center gap-2 lg:hidden">
            <Droplets className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-bold">PETROSHIELD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-safe opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-safe shadow-[0_0_10px_var(--safe)]" />
            </span>
            <span className="num text-[11px] font-semibold tracking-[0.16em] text-safe">SYSTEM OPERATIONAL</span>
          </div>

          <TopStat label="LAST INTEL UPDATE" value={useLastUpdate()} />
          <div className="hidden items-center gap-2 md:flex">
            <span className="num text-[10px] tracking-[0.16em] text-muted-foreground">GLOBAL RISK</span>
            <span
              className={cn(
                "num rounded-md border px-2 py-0.5 text-[12px] font-bold",
                risk >= 85
                  ? "border-critical/50 bg-critical/15 text-critical"
                  : "border-warn/50 bg-warn/15 text-warn",
              )}
            >
              <AnimatedNumber value={risk} />
              /100 {risk >= 85 ? "CRITICAL" : "HIGH"}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {demoActive && (
              <span className="num flex items-center gap-1.5 rounded-md border border-critical/50 bg-critical/15 px-2 py-1 text-[10.5px] tracking-[0.16em] text-critical">
                <ShieldAlert className="h-3.5 w-3.5" /> DEMO ESCALATION LIVE
              </span>
            )}
            <span className="hidden text-right sm:block">
              <span className="block text-[12px] leading-tight font-medium">Strategic Analyst</span>
              <span className="num block text-[10px] text-muted-foreground">CLEARANCE · TIER-1</span>
            </span>
            <UserCircle2 className="h-8 w-8 text-muted-foreground" />
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-border/50 px-3 py-2 lg:hidden">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px]",
                pathname === to ? "bg-primary/15 text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 space-y-6 px-5 py-6 pb-32">{children}</main>
        <DemoTimeline />
        <AICopilot />
      </div>
    </div>
  );
}

function useLastUpdate() {
  return usePetro().lastUpdate;
}

function TopStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="hidden flex-col sm:flex">
      <span className="num text-[9.5px] tracking-[0.16em] text-muted-foreground">{label}</span>
      <span className="num text-[12px] text-foreground/90">{value}</span>
    </div>
  );
}

export { Bot };
