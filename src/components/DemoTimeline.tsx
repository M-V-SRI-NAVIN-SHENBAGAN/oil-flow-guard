import { CheckCircle2, Loader2 } from "lucide-react";
import { DEMO_PHASES, DEMO_STEPS, FINAL_RECOMMENDATION } from "@/data/petro";
import { usePetro } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DemoTimeline() {
  const { demoActive, demoStep, demoComplete, resetDemo } = usePetro();
  if (!demoActive) return null;

  const current = DEMO_STEPS[Math.max(0, demoStep)];
  const progress = ((demoStep + 1) / DEMO_STEPS.length) * 100;

  return (
    <div className="glass-strong animate-rise fixed inset-x-0 bottom-0 z-40 border-x-0 border-b-0 px-5 py-3.5 lg:left-[248px]">
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-[240px] flex-1">
          <div className="flex items-center gap-2">
            {demoComplete ? (
              <CheckCircle2 className="h-4 w-4 text-safe" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            <span className="num text-[11px] tracking-[0.16em] text-primary">
              {current?.phase ?? "DETECTION"}
            </span>
            <span className="text-[13px] font-medium">{current?.label}</span>
            <span className="hidden text-[12px] text-muted-foreground md:inline">· {current?.detail}</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-critical via-warn to-safe transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {DEMO_PHASES.map((p, i) => {
            const reached = demoStep >= i * 2;
            return (
              <div key={p} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "num rounded-md border px-2 py-1 text-[10px] tracking-[0.14em] transition",
                    reached
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border/60 text-muted-foreground",
                  )}
                >
                  {p}
                </span>
                {i < DEMO_PHASES.length - 1 && (
                  <span className={cn("h-px w-5", reached ? "bg-primary/60" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={resetDemo}
          className="num rounded-md border border-border/70 px-3 py-1.5 text-[10.5px] tracking-[0.14em] text-muted-foreground hover:text-foreground"
        >
          END DEMO
        </button>
      </div>

      {demoComplete && (
        <div className="animate-rise mt-3 rounded-lg border border-safe/40 bg-safe/10 px-4 py-2.5">
          <p className="num text-[10.5px] tracking-[0.2em] text-safe">AI STRATEGIC RECOMMENDATION</p>
          <p className="mt-1 text-[13px] text-foreground/90">{FINAL_RECOMMENDATION}</p>
          <p className="num mt-1 text-[10.5px] tracking-[0.24em] text-primary">
            PETROSHIELD AI — PREDICT. SIMULATE. REROUTE. STABILIZE.
          </p>
        </div>
      )}
    </div>
  );
}
