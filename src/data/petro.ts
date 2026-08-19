/**
 * PetroShield AI — centralized mock/simulated data layer.
 *
 * ALL values below are SIMULATED demo data for prototype purposes.
 * Replace each exported function with a real API call later; the shapes
 * are intentionally API-friendly (plain serializable objects).
 */

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export const riskLevel = (score: number): RiskLevel =>
  score >= 85 ? "CRITICAL" : score >= 70 ? "HIGH" : score >= 45 ? "MEDIUM" : "LOW";

export const riskColor = (score: number) =>
  score >= 85
    ? "var(--critical)"
    : score >= 70
      ? "var(--critical)"
      : score >= 45
        ? "var(--warn)"
        : "var(--safe)";

export interface Chokepoint {
  id: string;
  name: string;
  short: string;
  lon: number;
  lat: number;
  risk: number;
  disruptionProbability: number;
  volumeMMbd: number;
  threat: string;
  alternatives: string[];
  recommendation: string;
  /** risk by timeline horizon in days */
  forecast: Record<Horizon, number>;
}

export type Horizon = 0 | 7 | 30 | 60 | 90;
export const HORIZONS: Horizon[] = [0, 7, 30, 60, 90];
export const horizonLabel = (h: Horizon) => (h === 0 ? "NOW" : `+${h} DAYS`);

export const CHOKEPOINTS: Chokepoint[] = [
  {
    id: "hormuz",
    name: "Strait of Hormuz",
    short: "HORMUZ",
    lon: 56.5,
    lat: 26.6,
    risk: 82,
    disruptionProbability: 68,
    volumeMMbd: 20.9,
    threat: "Elevated naval activity, GPS interference, insurance repricing",
    alternatives: ["East-West Pipeline (Saudi)", "ADCOC Fujairah Pipeline", "Cape of Good Hope corridor"],
    recommendation:
      "Pre-position 3 VLCCs at Fujairah, raise SPR readiness to Tier-2 and hedge 18% of exposed cargo.",
    forecast: { 0: 82, 7: 85, 30: 91, 60: 87, 90: 62 },
  },
  {
    id: "bab",
    name: "Bab-el-Mandeb",
    short: "BAB-EL-MANDEB",
    lon: 43.3,
    lat: 12.6,
    risk: 71,
    disruptionProbability: 57,
    volumeMMbd: 6.2,
    threat: "Sustained maritime attacks on commercial shipping, convoy delays",
    alternatives: ["Cape of Good Hope corridor", "SUMED Pipeline"],
    recommendation:
      "Divert non-time-critical cargo to Cape corridor; accept +9 transit days for a 44-point risk reduction.",
    forecast: { 0: 71, 7: 74, 30: 78, 60: 69, 90: 55 },
  },
  {
    id: "suez",
    name: "Suez Canal",
    short: "SUEZ",
    lon: 32.55,
    lat: 30.4,
    risk: 54,
    disruptionProbability: 38,
    volumeMMbd: 9.2,
    threat: "Transit volume down 41%, queue congestion, surcharge volatility",
    alternatives: ["SUMED Pipeline", "Cape of Good Hope corridor"],
    recommendation: "Maintain flow with dynamic scheduling; monitor southern approach risk daily.",
    forecast: { 0: 54, 7: 58, 30: 61, 60: 52, 90: 41 },
  },
  {
    id: "cape",
    name: "Cape of Good Hope",
    short: "CAPE",
    lon: 18.5,
    lat: -34.6,
    risk: 21,
    disruptionProbability: 12,
    volumeMMbd: 8.8,
    threat: "Seasonal swell and storm systems; bunkering capacity strain",
    alternatives: ["Suez Canal", "Panama Canal (non-crude)"],
    recommendation: "Primary contingency corridor. Secure bunkering slots at Durban and Walvis Bay.",
    forecast: { 0: 21, 7: 24, 30: 33, 60: 29, 90: 22 },
  },
  {
    id: "malacca",
    name: "Strait of Malacca",
    short: "MALACCA",
    lon: 100.4,
    lat: 2.6,
    risk: 38,
    disruptionProbability: 24,
    volumeMMbd: 16.1,
    threat: "Congestion risk, piracy watch level moderate",
    alternatives: ["Lombok Strait", "Sunda Strait"],
    recommendation: "No action required; retain Lombok routing as overflow option.",
    forecast: { 0: 38, 7: 39, 30: 44, 60: 46, 90: 37 },
  },
  {
    id: "turkish",
    name: "Turkish Straits",
    short: "BOSPORUS",
    lon: 29.0,
    lat: 41.1,
    risk: 49,
    disruptionProbability: 31,
    volumeMMbd: 3.2,
    threat: "Sanctions inspection backlog, weather closures",
    alternatives: ["Baltic exports", "Druzhba pipeline"],
    recommendation: "Expect 2-4 day inspection delays; buffer refinery feedstock accordingly.",
    forecast: { 0: 49, 7: 52, 30: 57, 60: 50, 90: 44 },
  },
];

export interface GeoNode {
  id: string;
  name: string;
  lon: number;
  lat: number;
  type: "producer" | "consumer" | "refinery";
  detail: string;
}

export const GEO_NODES: GeoNode[] = [
  { id: "ras", name: "Ras Tanura", lon: 50.0, lat: 26.6, type: "producer", detail: "6.5 MMbbl/d export terminal" },
  { id: "basra", name: "Basra Oil Terminal", lon: 48.2, lat: 29.7, type: "producer", detail: "3.3 MMbbl/d" },
  { id: "kharg", name: "Kharg Island", lon: 50.3, lat: 29.2, type: "producer", detail: "1.6 MMbbl/d" },
  { id: "bonny", name: "Bonny (Nigeria)", lon: 7.2, lat: 4.4, type: "producer", detail: "1.4 MMbbl/d" },
  { id: "luanda", name: "Angola Offshore", lon: 12.2, lat: -9.0, type: "producer", detail: "1.1 MMbbl/d" },
  { id: "primorsk", name: "Primorsk", lon: 28.6, lat: 60.3, type: "producer", detail: "0.9 MMbbl/d" },
  { id: "houston", name: "US Gulf Coast", lon: -95.0, lat: 29.4, type: "producer", detail: "4.1 MMbbl/d export" },
  { id: "tupi", name: "Santos Basin", lon: -43.0, lat: -24.0, type: "producer", detail: "1.3 MMbbl/d" },
  { id: "jamnagar", name: "Jamnagar Refinery", lon: 70.0, lat: 22.4, type: "refinery", detail: "1.24 MMbbl/d — 92% util." },
  { id: "vadinar", name: "Vadinar Refinery", lon: 69.7, lat: 22.4, type: "refinery", detail: "0.40 MMbbl/d — 88% util." },
  { id: "paradip", name: "Paradip Refinery", lon: 86.6, lat: 20.3, type: "refinery", detail: "0.30 MMbbl/d — 84% util." },
  { id: "ulsan", name: "Ulsan (KR)", lon: 129.3, lat: 35.5, type: "refinery", detail: "0.84 MMbbl/d — 90% util." },
  { id: "rotterdam", name: "Rotterdam", lon: 4.4, lat: 51.9, type: "refinery", detail: "0.40 MMbbl/d — 81% util." },
  { id: "india", name: "India Demand Hub", lon: 78.9, lat: 20.6, type: "consumer", detail: "5.4 MMbbl/d — 87% imported" },
  { id: "china", name: "China Demand Hub", lon: 112.0, lat: 32.0, type: "consumer", detail: "15.8 MMbbl/d — 72% imported" },
  { id: "japan", name: "Japan Demand Hub", lon: 138.5, lat: 36.0, type: "consumer", detail: "3.3 MMbbl/d — 97% imported" },
  { id: "europe", name: "EU Demand Hub", lon: 9.0, lat: 49.0, type: "consumer", detail: "12.7 MMbbl/d — 90% imported" },
  { id: "usa", name: "US Demand Hub", lon: -90.0, lat: 39.0, type: "consumer", detail: "20.1 MMbbl/d" },
];

export interface TradeRoute {
  id: string;
  name: string;
  points: [number, number][];
  volume: string;
  risk: number;
  kind: "primary" | "alt";
}

export const TRADE_ROUTES: TradeRoute[] = [
  {
    id: "gulf-india",
    name: "Arabian Gulf → India",
    points: [
      [50, 26.5],
      [56.5, 26.6],
      [60, 23],
      [66, 21],
      [70, 22.2],
    ],
    volume: "3.8 MMbbl/d",
    risk: 82,
    kind: "primary",
  },
  {
    id: "gulf-asia",
    name: "Arabian Gulf → East Asia",
    points: [
      [52, 27],
      [56.5, 26.6],
      [62, 20],
      [72, 10],
      [85, 6],
      [100.4, 2.6],
      [106, 6],
      [115, 18],
      [122, 28],
      [129, 34],
    ],
    volume: "11.4 MMbbl/d",
    risk: 74,
    kind: "primary",
  },
  {
    id: "gulf-europe",
    name: "Arabian Gulf → Europe (Suez)",
    points: [
      [54, 26],
      [56.5, 26.6],
      [58, 22],
      [52, 14],
      [43.3, 12.6],
      [38, 20],
      [34, 27],
      [32.55, 30.4],
      [30, 33],
      [18, 36],
      [5, 37],
      [-5, 36.5],
      [-9, 43],
      [4.4, 51.9],
    ],
    volume: "4.6 MMbbl/d",
    risk: 68,
    kind: "primary",
  },
  {
    id: "cape",
    name: "Cape of Good Hope Corridor",
    points: [
      [7.2, 4.4],
      [8, -6],
      [13, -20],
      [18.5, -34.6],
      [28, -36],
      [45, -25],
      [58, -10],
      [66, 8],
      [70, 20],
      [70, 22.2],
    ],
    volume: "2.2 MMbbl/d",
    risk: 27,
    kind: "alt",
  },
  {
    id: "wafrica",
    name: "West Africa → Europe / Asia",
    points: [
      [7.2, 4.4],
      [0, 8],
      [-10, 20],
      [-12, 30],
      [-9, 38],
      [-5, 36.5],
      [4.4, 51.9],
    ],
    volume: "1.8 MMbbl/d",
    risk: 24,
    kind: "alt",
  },
  {
    id: "usgc",
    name: "US Gulf Coast → Europe",
    points: [
      [-95, 29.4],
      [-84, 26],
      [-75, 30],
      [-55, 38],
      [-30, 44],
      [-10, 49],
      [4.4, 51.9],
    ],
    volume: "1.9 MMbbl/d",
    risk: 15,
    kind: "alt",
  },
  {
    id: "russia",
    name: "Baltic → Asia (Russian Grades)",
    points: [
      [28.6, 60.3],
      [12, 56],
      [2, 52],
      [-9, 43],
      [-12, 30],
      [-6, 12],
      [10, -5],
      [18.5, -34.6],
      [45, -25],
      [62, -5],
      [70, 15],
      [72, 20],
    ],
    volume: "1.4 MMbbl/d",
    risk: 46,
    kind: "alt",
  },
];

/* ---------------------------------- KPIs --------------------------------- */

export interface Kpi {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  delta: number;
  deltaLabel: string;
  tone: "critical" | "warn" | "safe" | "cyan";
}

export const BASE_KPIS: Kpi[] = [
  {
    id: "risk",
    label: "Global Oil Supply Risk",
    value: 71,
    suffix: "/100",
    delta: 6.4,
    deltaLabel: "vs 7-day avg",
    tone: "critical",
  },
  {
    id: "prob",
    label: "Disruption Probability",
    value: 68,
    suffix: "%",
    delta: 4.1,
    deltaLabel: "72h trend",
    tone: "warn",
  },
  {
    id: "exposure",
    label: "Supply Exposure",
    value: 4.2,
    decimals: 1,
    suffix: " MMbbl/d",
    delta: 0.6,
    deltaLabel: "at-risk volume",
    tone: "warn",
  },
  {
    id: "brent",
    label: "Brent Crude",
    value: 91.4,
    decimals: 2,
    prefix: "$",
    suffix: "/bbl",
    delta: 2.8,
    deltaLabel: "session change",
    tone: "critical",
  },
  {
    id: "spr",
    label: "Reserve Coverage",
    value: 43,
    suffix: " days",
    delta: -2,
    deltaLabel: "vs last month",
    tone: "cyan",
  },
];

/** Escalated KPI set used by DEMO MODE. */
const base = (i: number) => BASE_KPIS[i] as Kpi;
export const DEMO_KPIS: Kpi[] = [
  { ...base(0), value: 93, delta: 22, tone: "critical" },
  { ...base(1), value: 91, delta: 23, tone: "critical" },
  { ...base(2), value: 8.7, delta: 4.5, tone: "critical" },
  { ...base(3), value: 128.6, delta: 37.2, tone: "critical" },
  { ...base(4), value: 31, delta: -12, tone: "warn" },
];

export const BRENT_HISTORY = [
  { t: "D-30", price: 79.2, risk: 41 },
  { t: "D-25", price: 80.8, risk: 44 },
  { t: "D-20", price: 82.1, risk: 48 },
  { t: "D-15", price: 84.7, risk: 55 },
  { t: "D-10", price: 86.2, risk: 59 },
  { t: "D-7", price: 87.9, risk: 63 },
  { t: "D-5", price: 88.6, risk: 66 },
  { t: "D-3", price: 89.9, risk: 68 },
  { t: "D-1", price: 90.7, risk: 70 },
  { t: "NOW", price: 91.4, risk: 71 },
];

export const SUPPLY_MIX = [
  { region: "Middle East", volume: 26.4, risk: 78 },
  { region: "North America", volume: 24.1, risk: 14 },
  { region: "Russia / CIS", volume: 13.6, risk: 58 },
  { region: "Africa", volume: 7.4, risk: 34 },
  { region: "Latin America", volume: 6.6, risk: 22 },
  { region: "Asia Pacific", volume: 7.1, risk: 29 },
];

/* ------------------------------- Scenarios -------------------------------- */

export interface ScenarioPreset {
  id: string;
  code: string;
  title: string;
  location: string;
  severity: number;
  duration: number;
  volume: number;
  summary: string;
  tone: "critical" | "warn" | "caution";
}

export const SCENARIOS: ScenarioPreset[] = [
  {
    id: "a",
    code: "SCENARIO A",
    title: "Strait of Hormuz Disruption",
    location: "Strait of Hormuz",
    severity: 80,
    duration: 60,
    volume: 12.5,
    summary: "Partial closure of Hormuz transit with convoy escorting and insurance withdrawal.",
    tone: "critical",
  },
  {
    id: "b",
    code: "SCENARIO B",
    title: "Bab-el-Mandeb Closure",
    location: "Bab-el-Mandeb",
    severity: 65,
    duration: 45,
    volume: 6.2,
    summary: "Full rerouting of Red Sea traffic around the Cape, +9 to +14 transit days.",
    tone: "warn",
  },
  {
    id: "c",
    code: "SCENARIO C",
    title: "Russian Export Reduction",
    location: "Baltic / Black Sea",
    severity: 55,
    duration: 90,
    volume: 3.1,
    summary: "Sanctions tightening removes seaborne Russian barrels from the Asian pool.",
    tone: "caution",
  },
  {
    id: "d",
    code: "SCENARIO D",
    title: "Multiple Chokepoint Disruption",
    location: "Hormuz + Bab-el-Mandeb",
    severity: 95,
    duration: 90,
    volume: 18.4,
    summary: "Simultaneous Gulf and Red Sea disruption — worst-case global stress test.",
    tone: "critical",
  },
];

export interface ScenarioInput {
  location: string;
  severity: number;
  duration: number;
  volume: number;
  startDate: string;
}

export interface ScenarioPoint {
  day: number;
  baselineSupply: number;
  disruptedSupply: number;
  gap: number;
  baselinePrice: number;
  price: number;
  refining: number;
  shipping: number;
  sprDraw: number;
}

/** Deterministic simulated impact model — swap for a real solver later. */
export function simulateScenario(input: ScenarioInput): ScenarioPoint[] {
  const k = (input.severity / 100) * (input.volume / 12.5);
  const out: ScenarioPoint[] = [];
  for (let day = 0; day <= 90; day += 5) {
    const ramp = Math.min(1, day / Math.max(12, input.duration * 0.45));
    const decay = day > input.duration ? Math.max(0.35, 1 - (day - input.duration) / 120) : 1;
    const gap = +(4.9 * k * ramp * decay).toFixed(2);
    const baselineSupply = 101.8;
    const price = +(91.4 + gap * 11.4 + Math.pow(gap, 1.6) * 1.9).toFixed(1);
    out.push({
      day,
      baselineSupply,
      disruptedSupply: +(baselineSupply - gap).toFixed(2),
      gap,
      baselinePrice: +(91.4 + day * 0.03).toFixed(1),
      price,
      refining: +(92 - gap * 4.2).toFixed(1),
      shipping: +(100 + gap * 26).toFixed(0),
      sprDraw: +(gap * 0.62).toFixed(2),
    });
  }
  return out;
}

export function scenarioMilestones(points: ScenarioPoint[]) {
  const at = (d: number) => points.find((p) => p.day === d) ?? points[points.length - 1];
  return [30, 60, 90].map((d) => ({ day: d, ...at(d) }));
}

/* ---------------------------------- Routes -------------------------------- */

export const ROUTE_COMPARISON = {
  standard: {
    name: "STANDARD ROUTE",
    path: "Hormuz → Arabian Sea → Indian Ocean → India",
    distance: 4500,
    transit: 8,
    cost: 2.4,
    risk: 82,
    reliability: 61,
    points: [
      [50, 26.5],
      [56.5, 26.6],
      [60, 23],
      [64, 21],
      [70, 22.2],
    ] as [number, number][],
  },
  optimized: {
    name: "AI OPTIMIZED ROUTE",
    path: "West Africa → Cape of Good Hope → Indian Ocean → India",
    distance: 7800,
    transit: 14,
    cost: 3.1,
    risk: 27,
    reliability: 89,
    points: [
      [7.2, 4.4],
      [9, -10],
      [14, -24],
      [18.5, -34.6],
      [30, -35],
      [48, -22],
      [60, -6],
      [68, 10],
      [70, 22.2],
    ] as [number, number][],
  },
};

/* ------------------------------ SPR reserves ------------------------------ */

export interface Reserve {
  id: string;
  name: string;
  state: string;
  capacityMMT: number;
  fill: number;
  coverageDays: number;
  releaseRate: string;
  recovery: string;
  lon: number;
  lat: number;
}

export const RESERVES: Reserve[] = [
  {
    id: "vizag",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    capacityMMT: 1.33,
    fill: 78,
    coverageDays: 14,
    releaseRate: "0.18 MMbbl/d",
    recovery: "38 days to refill at 0.09 MMbbl/d",
    lon: 83.3,
    lat: 17.7,
  },
  {
    id: "mangalore",
    name: "Mangalore",
    state: "Karnataka",
    capacityMMT: 1.5,
    fill: 71,
    coverageDays: 15,
    releaseRate: "0.21 MMbbl/d",
    recovery: "44 days to refill at 0.10 MMbbl/d",
    lon: 74.85,
    lat: 12.9,
  },
  {
    id: "padur",
    name: "Padur",
    state: "Karnataka",
    capacityMMT: 2.5,
    fill: 64,
    coverageDays: 21,
    releaseRate: "0.32 MMbbl/d",
    recovery: "57 days to refill at 0.14 MMbbl/d",
    lon: 74.75,
    lat: 13.4,
  },
];

export type SprScenario = "NORMAL" | "MODERATE" | "SEVERE";

export const SPR_SCENARIO_META: Record<SprScenario, { rate: number; recovery: number; note: string }> = {
  NORMAL: { rate: 0.09, recovery: 0.9, note: "Routine drawdown; no strategic release required." },
  MODERATE: { rate: 0.28, recovery: 0.55, note: "Controlled release recommended from Day 18." },
  SEVERE: { rate: 0.55, recovery: 0.3, note: "Tier-1 release; coverage breaches 30-day threshold by Day 62." },
};

export function sprCurves(scenario: SprScenario) {
  const meta = SPR_SCENARIO_META[scenario];
  const rows: Record<string, number>[] = [];
  for (let day = 0; day <= 90; day += 5) {
    const row: Record<string, number> = { day };
    RESERVES.forEach((r, i) => {
      const drain = meta.rate * day * (1 + i * 0.12);
      row[r.id] = +Math.max(8, r.fill - drain).toFixed(1);
    });
    row['recovery'] = +Math.min(100, 42 + day * meta.recovery).toFixed(1);
    rows.push(row);
  }
  return rows;
}

/* --------------------------------- Agents --------------------------------- */

export interface Agent {
  id: string;
  index: number;
  name: string;
  role: string;
  status: "ACTIVE" | "PROCESSING" | "STANDBY";
  inputs: string[];
  task: string;
  output: string;
  confidence: number;
  latency: string;
}

export const AGENTS: Agent[] = [
  {
    id: "intel",
    index: 1,
    name: "Intelligence Agent",
    role: "Signal ingestion",
    status: "ACTIVE",
    inputs: ["Global news wires", "AIS shipping signals", "Geopolitical event feeds", "Weather models", "Market tape"],
    task: "Ingesting 14,208 signals/hr across 62 sources; deduplicating and geotagging events.",
    output: "312 material events in the last 24h · 27 flagged for escalation",
    confidence: 94,
    latency: "1.2s",
  },
  {
    id: "risk",
    index: 2,
    name: "Risk Analysis Agent",
    role: "Threat quantification",
    status: "PROCESSING",
    inputs: ["Geotagged events", "Historic chokepoint incidents", "Insurance premia", "Naval posture"],
    task: "Recomputing chokepoint risk surfaces and regional exposure matrices.",
    output: "Hormuz 82 · Bab-el-Mandeb 71 · Suez 54 · Cape 21",
    confidence: 91,
    latency: "2.6s",
  },
  {
    id: "scenario",
    index: 3,
    name: "Scenario Agent",
    role: "Disruption simulation",
    status: "ACTIVE",
    inputs: ["Risk surfaces", "Supply/demand balances", "Elasticity curves", "OPEC spare capacity"],
    task: "Running 30/60/90-day Monte Carlo disruption ensembles (4,000 paths).",
    output: "Median 90-day gap 4.0 MMbbl/d · P90 price $148/bbl",
    confidence: 88,
    latency: "6.1s",
  },
  {
    id: "optimize",
    index: 4,
    name: "Optimization Agent",
    role: "Route & allocation solver",
    status: "ACTIVE",
    inputs: ["Fleet positions", "Bunker prices", "War-risk premia", "Port slots"],
    task: "Solving multi-objective routing over 214 laden voyages.",
    output: "Reroute 18% of exposed cargo via Cape · risk 82 → 27",
    confidence: 90,
    latency: "4.4s",
  },
  {
    id: "reserve",
    index: 5,
    name: "Strategic Reserve Agent",
    role: "SPR policy",
    status: "STANDBY",
    inputs: ["Reserve inventories", "Deficit forecast", "Refinery intake", "Release logistics"],
    task: "Evaluating release triggers against the 30-day strategic threshold.",
    output: "Hold until deficit > 3.0 MMbbl/d; then release 0.71 MMbbl/d for 21 days",
    confidence: 86,
    latency: "1.9s",
  },
];

export const DECISION_ENGINE = {
  name: "Strategic Decision Engine",
  outputs: [
    "Recommended route: Cape of Good Hope corridor (18% of exposed cargo)",
    "Reserve strategy: controlled release at 0.71 MMbbl/d from Day 18",
    "Supply allocation: +0.4 MMbbl/d West African, +0.3 MMbbl/d US Gulf",
    "Risk mitigation: hedge 62% of Q3 exposure, raise war-risk cover at Fujairah",
  ],
  confidence: 92,
};

/* ---------------------------- Intelligence feed --------------------------- */

export type FeedCategory = "Geopolitical" | "Shipping" | "Weather" | "Market" | "Supply";
export type FeedSeverity = "HIGH" | "MEDIUM" | "WATCH" | "LOW";

export interface FeedItem {
  id: string;
  severity: FeedSeverity;
  category: FeedCategory;
  title: string;
  location: string;
  minutesAgo: number;
  impact: string;
  interpretation: string;
}

export const FEED: FeedItem[] = [
  {
    id: "f1",
    severity: "HIGH",
    category: "Geopolitical",
    title: "Elevated military activity detected near Strait of Hormuz",
    location: "26.6°N, 56.5°E — Strait of Hormuz",
    minutesAgo: 2,
    impact: "+7 risk points · 20.9 MMbbl/d exposed",
    interpretation:
      "Pattern matches the pre-escalation signature observed in prior transit interference events. Recommend Tier-2 reserve readiness.",
  },
  {
    id: "f2",
    severity: "MEDIUM",
    category: "Market",
    title: "Tanker insurance premiums increased 12%",
    location: "London marine market",
    minutesAgo: 8,
    impact: "+$0.34/bbl freight cost on Gulf-East routes",
    interpretation: "Underwriters are pricing a sustained disruption. Cape routing economics improve by ~9%.",
  },
  {
    id: "f3",
    severity: "WATCH",
    category: "Weather",
    title: "Weather disruption developing near Cape of Good Hope",
    location: "34.6°S, 18.5°E — Cape corridor",
    minutesAgo: 21,
    impact: "Potential +1.5 transit days on the contingency corridor",
    interpretation: "Swell forecast to peak in 60h. Advance departures by 12h to preserve schedule integrity.",
  },
  {
    id: "f4",
    severity: "LOW",
    category: "Supply",
    title: "West African export capacity remains stable",
    location: "Bonny / Escravos, Nigeria",
    minutesAgo: 32,
    impact: "1.4 MMbbl/d confirmed liftings",
    interpretation: "Supports the substitution assumption underpinning the Cape reroute recommendation.",
  },
  {
    id: "f5",
    severity: "MEDIUM",
    category: "Shipping",
    title: "AIS gaps reported for 6 VLCCs east of Fujairah",
    location: "25.1°N, 56.4°E",
    minutesAgo: 47,
    impact: "Tracking confidence down to 78%",
    interpretation: "Consistent with GPS interference rather than diversion. Continue radar cross-validation.",
  },
  {
    id: "f6",
    severity: "HIGH",
    category: "Shipping",
    title: "Two operators suspend Red Sea transits for 14 days",
    location: "Bab-el-Mandeb",
    minutesAgo: 63,
    impact: "0.9 MMbbl/d rerouted to Cape corridor",
    interpretation: "Effective closure for those fleets. Suez throughput expected to fall a further 6%.",
  },
  {
    id: "f7",
    severity: "LOW",
    category: "Market",
    title: "OPEC+ signals readiness to review spare capacity",
    location: "Vienna",
    minutesAgo: 88,
    impact: "Up to 2.1 MMbbl/d theoretical offset",
    interpretation: "Offsets roughly half of the modelled 60-day gap, but with a 30-45 day activation lag.",
  },
  {
    id: "f8",
    severity: "WATCH",
    category: "Supply",
    title: "Refinery maintenance extended at Ulsan complex",
    location: "35.5°N, 129.3°E",
    minutesAgo: 121,
    impact: "-0.12 MMbbl/d product output",
    interpretation: "Minor regional tightening; no impact on the India exposure model.",
  },
  {
    id: "f9",
    severity: "MEDIUM",
    category: "Geopolitical",
    title: "Inspection regime tightened in the Turkish Straits",
    location: "41.1°N, 29.0°E",
    minutesAgo: 154,
    impact: "2-4 day transit delay",
    interpretation: "Buffer feedstock at Black Sea-fed refineries; low systemic risk.",
  },
];

export const DEMO_FEED_INJECT: FeedItem = {
  id: "demo-1",
  severity: "HIGH",
  category: "Geopolitical",
  title: "CONFIRMED: Transit suspension declared at Strait of Hormuz",
  location: "26.6°N, 56.5°E — Strait of Hormuz",
  minutesAgo: 0,
  impact: "CRITICAL · 20.9 MMbbl/d transit affected",
  interpretation:
    "Decision Engine escalated to Tier-1. Reroute plan and SPR release schedule generated automatically.",
};

/* --------------------------------- Copilot -------------------------------- */

export interface CopilotReply {
  match: string[];
  text: string;
}

export const COPILOT_REPLIES: CopilotReply[] = [
  {
    match: ["hormuz", "60", "close"],
    text: "Based on the current simulation, a 60-day Hormuz disruption could create an estimated 3.4 MMbbl/d global supply gap. Brent prices may reach approximately $119/bbl, with refining utilisation falling to 78%. India should increase alternative sourcing and consider a controlled SPR release from Day 18.",
  },
  {
    match: ["route", "india", "reroute"],
    text: "The Optimization Agent recommends the Cape of Good Hope corridor for 18% of India-bound exposed cargo. Transit rises from 8 to 14 days and cost from $2.4M to $3.1M per voyage, but risk drops from 82% to 27% and supply reliability improves from 61% to 89%.",
  },
  {
    match: ["spr", "reserve", "release"],
    text: "Hold strategic release until the modelled deficit exceeds 3.0 MMbbl/d — projected at Day 18 under Scenario A. Recommended profile: 0.71 MMbbl/d combined across Padur, Mangalore and Visakhapatnam for 21 days, keeping aggregate coverage above the 30-day strategic threshold.",
  },
  {
    match: ["refinery", "exposed", "exposure"],
    text: "Jamnagar is the most exposed node: 1.24 MMbbl/d capacity with 71% of feedstock sourced through Hormuz. Vadinar follows at 0.40 MMbbl/d and 64% Gulf dependency. Pre-positioning West African grades covers roughly 38% of the Jamnagar shortfall.",
  },
  {
    match: ["price", "brent", "oil price"],
    text: "Brent is simulated at $91.40/bbl with a 68% disruption probability priced in. Under Scenario A the model reaches $104/bbl at Day 30, $119/bbl at Day 60 and $137/bbl at Day 90, with a P90 tail of $148/bbl.",
  },
  {
    match: ["bab", "mandeb", "red sea"],
    text: "A Bab-el-Mandeb closure removes 6.2 MMbbl/d of transit. Most volume absorbs into the Cape corridor at +9 to +14 transit days and +$0.34/bbl freight. Global gap peaks near 1.9 MMbbl/d — material but manageable without an SPR release.",
  },
];

export const COPILOT_FALLBACK =
  "PetroShield AI has correlated your query against the current risk surface. Headline state: global supply risk HIGH (71/100), disruption probability 68%, 4.2 MMbbl/d exposed. The dominant driver is the Strait of Hormuz at 82% risk. Recommended posture: pre-position alternative tanker capacity via the Cape corridor and raise reserve readiness to Tier-2.";

export const COPILOT_SUGGESTIONS = [
  "What happens if Hormuz closes for 60 days?",
  "Which route should India use?",
  "When should SPR release begin?",
  "Which refinery is most exposed?",
];

/* -------------------------------- Demo mode -------------------------------- */

export interface DemoStep {
  id: string;
  phase: "DETECTION" | "SIMULATION" | "OPTIMIZATION" | "RESERVE RESPONSE";
  label: string;
  detail: string;
}

export const DEMO_STEPS: DemoStep[] = [
  { id: "d1", phase: "DETECTION", label: "Anomaly detected", detail: "Intelligence Agent flags naval escalation near Hormuz" },
  { id: "d2", phase: "DETECTION", label: "Risk surface recomputed", detail: "Hormuz risk 82 → 96 · global risk HIGH → CRITICAL" },
  { id: "d3", phase: "SIMULATION", label: "Scenario ensemble launched", detail: "4,000 Monte Carlo paths across 30/60/90 days" },
  { id: "d4", phase: "SIMULATION", label: "Impact quantified", detail: "Supply gap 8.7 MMbbl/d · Brent $128.60/bbl" },
  { id: "d5", phase: "OPTIMIZATION", label: "Alternative corridor solved", detail: "Cape of Good Hope routing scored 27 risk / 89 reliability" },
  { id: "d6", phase: "OPTIMIZATION", label: "Fleet rerouted", detail: "38 laden voyages re-tasked · 18% of exposed cargo diverted" },
  { id: "d7", phase: "RESERVE RESPONSE", label: "SPR forecast updated", detail: "Coverage 43 → 31 days · release trigger armed" },
  { id: "d8", phase: "RESERVE RESPONSE", label: "Strategic recommendation issued", detail: "Controlled release 0.71 MMbbl/d · coverage held above threshold" },
];

export const DEMO_PHASES = ["DETECTION", "SIMULATION", "OPTIMIZATION", "RESERVE RESPONSE"] as const;

export const FINAL_RECOMMENDATION =
  "Reroute 18% of exposed cargo, initiate controlled SPR release, and maintain reserve coverage above the strategic threshold.";
