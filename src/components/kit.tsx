import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { riskLevel } from "@/data/petro";

/* ------------------------------ Animated number ---------------------------- */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const b = value;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(a + (b - a) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span className={cn("num", className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* --------------------------------- Panel ---------------------------------- */
export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("glass animate-rise rounded-xl", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-border/60 px-5 py-3.5">
          <div>
            {title && (
              <h2 className="font-display text-[13px] font-semibold tracking-[0.18em] text-foreground/90 uppercase">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ------------------------------- Risk badge -------------------------------- */
export function RiskBadge({ score, label }: { score: number; label?: string }) {
  const lvl = riskLevel(score);
  const tone =
    lvl === "LOW"
      ? "text-safe border-safe/40 bg-safe/10"
      : lvl === "MEDIUM"
        ? "text-caution border-caution/40 bg-caution/10"
        : "text-critical border-critical/40 bg-critical/10";
  return (
    <span
      className={cn(
        "num inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold tracking-wider",
        tone,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {label ?? `${score}% ${lvl}`}
    </span>
  );
}

/* ------------------------------- Metric card ------------------------------- */
const toneMap = {
  critical: "text-critical",
  warn: "text-warn",
  safe: "text-safe",
  cyan: "text-cyan",
} as const;

export function MetricCard({
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  delta,
  deltaLabel,
  tone = "cyan",
  className,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: number;
  deltaLabel?: string;
  tone?: keyof typeof toneMap;
  className?: string;
}) {
  const Icon = delta == null || delta === 0 ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <div className={cn("glass group relative overflow-hidden rounded-xl px-4 py-3.5", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <p className="text-[10.5px] font-medium tracking-[0.16em] text-muted-foreground uppercase">{label}</p>
      <p className={cn("mt-1.5 text-2xl font-semibold", toneMap[tone])}>
        <AnimatedNumber
          value={value}
          decimals={decimals}
          {...(prefix ? { prefix } : {})}
          {...(suffix ? { suffix } : {})}
        />
      </p>
      {delta != null && (
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Icon className={cn("h-3.5 w-3.5", delta > 0 ? "text-critical" : "text-safe")} />
          <span className="num">
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
          {deltaLabel && <span className="opacity-70">{deltaLabel}</span>}
        </p>
      )}
    </div>
  );
}

/* ------------------------------ Section header ----------------------------- */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="animate-rise">
        <p className="num text-[11px] tracking-[0.3em] text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-1.5 text-3xl font-semibold text-foreground">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------- Score meter ------------------------------- */
export function ScoreBar({
  label,
  value,
  color = "var(--primary)",
  suffix = "",
}: {
  label: string;
  value: number;
  color?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="num font-semibold" style={{ color }}>
          {value}
          {suffix}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary/70">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(100, value)}%`, background: color, boxShadow: `0 0 12px ${color}` }}
        />
      </div>
    </div>
  );
}

/* -------------------------------- AI callout ------------------------------- */
export function AICallout({
  title = "AI RECOMMENDATION",
  children,
  confidence,
  actions,
}: {
  title?: string;
  children: ReactNode;
  confidence?: number;
  actions?: ReactNode;
}) {
  return (
    <div className="glass-strong animate-rise relative overflow-hidden rounded-xl p-5">
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-cyan to-safe" />
      <div className="absolute inset-0 -z-10 opacity-40 panel-grid" />
      <div className="flex items-center gap-2">
        <span className="num rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10.5px] font-semibold tracking-[0.2em] text-primary">
          {title}
        </span>
        {confidence != null && (
          <span className="num text-[11px] text-muted-foreground">confidence {confidence}%</span>
        )}
      </div>
      <div className="mt-3 text-sm leading-relaxed text-foreground/90">{children}</div>
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
