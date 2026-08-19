import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  BASE_KPIS,
  DEMO_KPIS,
  DEMO_STEPS,
  type Kpi,
} from "@/data/petro";

interface PetroState {
  kpis: Kpi[];
  demoActive: boolean;
  demoStep: number; // -1 = not started, else index of last completed step
  demoComplete: boolean;
  routeApplied: boolean;
  lastUpdate: string;
  startDemo: () => void;
  resetDemo: () => void;
  applyRoute: (v: boolean) => void;
  hormuzRisk: number;
  copilotOpen: boolean;
  setCopilotOpen: (v: boolean) => void;
  askCopilot: (q: string) => void;
  pendingQuestion: string | null;
  clearPendingQuestion: () => void;
}

const Ctx = createContext<PetroState | null>(null);

export function PetroProvider({ children }: { children: ReactNode }) {
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(-1);
  const [routeApplied, setRouteApplied] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState("00:00:00");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const tick = () =>
      setLastUpdate(
        new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" }) + " UTC",
      );
    tick();
    const i = setInterval(tick, 30_000);
    return () => clearInterval(i);
  }, []);

  const startDemo = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    setDemoActive(true);
    setDemoStep(-1);
    setRouteApplied(false);
    let i = 0;
    timer.current = setInterval(() => {
      setDemoStep(i);
      if (i >= 5) setRouteApplied(true);
      i += 1;
      if (i >= DEMO_STEPS.length && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }, 1400);
  }, []);

  const resetDemo = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setDemoActive(false);
    setDemoStep(-1);
    setRouteApplied(false);
  }, []);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const escalated = demoActive && demoStep >= 1;

  const value = useMemo<PetroState>(
    () => ({
      kpis: escalated ? DEMO_KPIS : BASE_KPIS,
      demoActive,
      demoStep,
      demoComplete: demoStep >= DEMO_STEPS.length - 1,
      routeApplied,
      lastUpdate,
      startDemo,
      resetDemo,
      applyRoute: setRouteApplied,
      hormuzRisk: escalated ? 96 : 82,
      copilotOpen,
      setCopilotOpen,
      askCopilot: (q: string) => {
        setPendingQuestion(q);
        setCopilotOpen(true);
      },
      pendingQuestion,
      clearPendingQuestion: () => setPendingQuestion(null),
    }),
    [escalated, demoActive, demoStep, routeApplied, lastUpdate, startDemo, resetDemo, copilotOpen, pendingQuestion],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePetro() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePetro must be used inside PetroProvider");
  return ctx;
}
