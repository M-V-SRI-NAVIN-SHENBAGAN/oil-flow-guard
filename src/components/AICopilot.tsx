import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, CornerDownLeft, Sparkles, X } from "lucide-react";
import { COPILOT_FALLBACK, COPILOT_REPLIES, COPILOT_SUGGESTIONS } from "@/data/petro";
import { usePetro } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "ai";
  text: string;
  actions?: boolean;
}

function answer(q: string) {
  const l = q.toLowerCase();
  let best: { score: number; text: string } | null = null;
  for (const r of COPILOT_REPLIES) {
    const score = r.match.filter((m) => l.includes(m)).length;
    if (score > 0 && (!best || score > best.score)) best = { score, text: r.text };
  }
  return best?.text ?? COPILOT_FALLBACK;
}

export function AICopilot() {
  const { copilotOpen, setCopilotOpen, pendingQuestion, clearPendingQuestion } = usePetro();
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "PetroShield Copilot online. I can explain the current risk surface, simulate disruptions, compare corridors and advise on strategic reserve timing. Simulated intelligence — demo data only.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const send = (q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "ai", text: answer(q), actions: true }]);
    }, 900);
  };

  useEffect(() => {
    if (pendingQuestion) {
      send(pendingQuestion);
      clearPendingQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuestion]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  return (
    <>
      <button
        onClick={() => setCopilotOpen(!copilotOpen)}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-gradient-to-br from-primary/80 to-cyan/60 shadow-[0_0_38px_-6px_var(--primary)] transition hover:scale-105"
        aria-label="Open AI Copilot"
      >
        {copilotOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Bot className="h-6 w-6 text-primary-foreground" />
        )}
      </button>

      {copilotOpen && (
        <div className="glass-strong animate-rise fixed right-6 bottom-24 z-50 flex h-[560px] w-[400px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl">
          <header className="flex items-center gap-2.5 border-b border-border/60 px-4 py-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-safe opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-safe" />
            </span>
            <div>
              <p className="font-display text-sm font-semibold">PETROSHIELD COPILOT</p>
              <p className="text-[10.5px] text-muted-foreground">Simulated strategic advisor</p>
            </div>
            <Sparkles className="ml-auto h-4 w-4 text-primary" />
          </header>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[88%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                    m.role === "user"
                      ? "bg-primary/20 text-foreground"
                      : "border border-border/60 bg-secondary/50 text-foreground/90",
                  )}
                >
                  {m.text}
                  {m.actions && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Link
                        to="/simulator"
                        className="num rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-[10.5px] tracking-wider text-primary hover:bg-primary/20"
                      >
                        RUN SCENARIO
                      </Link>
                      <Link
                        to="/route-optimizer"
                        className="num rounded-md border border-cyan/40 bg-cyan/10 px-2 py-1 text-[10.5px] tracking-wider text-cyan hover:bg-cyan/20"
                      >
                        OPTIMIZE ROUTES
                      </Link>
                      <Link
                        to="/reserves"
                        className="num rounded-md border border-safe/40 bg-safe/10 px-2 py-1 text-[10.5px] tracking-wider text-safe hover:bg-safe/20"
                      >
                        ANALYZE SPR
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-1 px-2 text-primary">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-current"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border/60 px-3 py-2.5">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {COPILOT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border/70 px-2.5 py-1 text-[10.5px] text-muted-foreground transition hover:border-primary/50 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/50 px-3 py-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask PetroShield AI…"
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" className="text-primary" aria-label="Send">
                <CornerDownLeft className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
