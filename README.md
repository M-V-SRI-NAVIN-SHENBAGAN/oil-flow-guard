# Remix of PetroGuard AI

Build a high-quality, hackathon-ready web application called "PetroShield AI" — an AI-powered strategic petroleum supply-chain intelligence and disruption management platform.

The goal is to demonstrate how governments, oil companies, and energy analysts could use AI to detect geopolitical risks, simulate oil-supply disruptions, optimize tanker rerouting, and manage Strategic Petroleum Reserves (SPR).

This is a prototype/demo, not a production system. Prioritize an impressive, realistic UI, smooth interactions, clear visual storytelling, and working simulated data.

1. Overall Design

Create a premium dark-mode energy intelligence dashboard.

Visual style:

Dark navy/black background

Glassmorphism cards

Subtle blue/cyan/amber/red accents

High-tech intelligence/command-center aesthetic

Clean typography

Professional enough to look like a government/energy trading intelligence platform

Responsive desktop-first design

Smooth animations and transitions

Use charts, maps, gauges, status indicators, and data cards extensively

Avoid making it look like a generic admin dashboard

Use a sidebar navigation with:

Overview

Risk Map

Scenario Simulator

Route Optimizer

Strategic Reserves

AI Agents

Intelligence Feed

Top navigation should contain:

Current system status: "SYSTEM OPERATIONAL"

Last intelligence update

Global risk score

User/profile icon

2. HERO / OVERVIEW PAGE

The landing dashboard should immediately communicate the problem and solution.

Header:

PetroShield AI
"AI-Powered Strategic Petroleum Intelligence"

Subtitle:
"Predict. Simulate. Reroute. Stabilize."

Add a prominent global status panel showing:

Global Oil Supply Risk: HIGH

Current disruption probability: 68%

Estimated supply exposure: 4.2 MMbbl/d

Brent price: $91.40/bbl

Strategic reserve coverage: 43 days

Add small trend indicators showing whether each metric is increasing or decreasing.

Hero Visual

Make the largest element a global interactive oil trade route map.

The map should show:

Major oil-producing regions

Major consuming regions

Oil tanker/shipping routes

Strait of Hormuz

Bab-el-Mandeb

Suez Canal

Cape of Good Hope

West African routes

Use glowing animated route lines.

Risk areas should appear as heat zones.

Example risk levels:

Strait of Hormuz: 82% HIGH RISK

Bab-el-Mandeb: 71% HIGH RISK

Suez: 54% MEDIUM RISK

Cape of Good Hope: 21% LOW RISK

Clicking a chokepoint should open a side panel showing:

Risk score

Estimated disruption probability

Oil volume passing through

Current threat level

Alternative routes

AI recommendation

3. SPATIAL-TEMPORAL RISK MAP

Create a dedicated Risk Map page.

This should be one of the strongest visuals in the prototype.

Show an interactive world map with:

Oil trade routes

Chokepoints

Risk heatmap

Tanker movement simulation

Oil-producing countries

Refineries

Import-dependent regions

Add a timeline slider:

NOW | +7 DAYS | +30 DAYS | +60 DAYS | +90 DAYS

Changing the timeline should update the simulated risk levels.

Example:

At NOW:
Hormuz = 82%

At +30 DAYS:
Hormuz = 91%

At +60 DAYS:
Hormuz = 87%

At +90 DAYS:
Hormuz = 62%

Add filters:

Geopolitical Risk

Weather

Shipping

Supply

Refining

Price

Include a "Run AI Risk Analysis" button.

When clicked, show an AI analysis panel explaining:

"AI detects elevated disruption probability around Strait of Hormuz. Recommend increasing reserve readiness and pre-positioning alternative tanker routes."

4. SCENARIO IMPACT SIMULATOR

Create a page called Scenario Simulator.

The user should be able to create hypothetical disruption scenarios.

Add scenario cards:

Scenario A

"Strait of Hormuz Disruption"

Scenario B

"Bab-el-Mandeb Closure"

Scenario C

"Russian Export Reduction"

Scenario D

"Multiple Chokepoint Disruption"

Allow the user to select:

Disruption location

Severity

Duration

Affected oil volume

Start date

Include a large button:

RUN AI SIMULATION

After clicking, display a 30/60/90-day impact forecast.

Create a dual-panel visualization:

BASELINE

vs.

DISRUPTED

Show:

Global supply

Supply gap

Brent crude price

Refining utilization

Shipping cost

Strategic reserve requirement

Example simulated results:

30 DAYS:
Supply gap: 2.1 MMbbl/d
Price: $104/bbl

60 DAYS:
Supply gap: 3.4 MMbbl/d
Price: $119/bbl

90 DAYS:
Supply gap: 4.0 MMbbl/d
Price: $137/bbl

Use interactive line charts.

Add an AI-generated summary:

"Under the selected scenario, global supply disruption reaches 4.0 MMbbl/d by day 90. India faces elevated import exposure. AI recommends rerouting 18% of affected cargo through alternative corridors and initiating controlled SPR release."

5. ADAPTIVE ROUTE OPTIMIZER

Create a page called Route Optimizer.

The purpose is to demonstrate AI automatically finding better oil transportation routes during disruption.

Show a split-screen map:

LEFT:

STANDARD ROUTE

Hormuz → Indian Ocean → India

RIGHT:

AI OPTIMIZED ROUTE

West Africa → Cape of Good Hope → Indian Ocean → India

Display animated tanker paths.

Under the map, create a comparison table:

MetricStandardAI OptimizedDistance4,500 km7,800 kmTransit Time8 days14 daysCost$2.4M$3.1MRisk82%27%Supply Reliability61%89%

Add a large AI recommendation card:

AI RECOMMENDATION

"Reroute 18% of exposed cargo through the Cape of Good Hope corridor."

Add a button:

APPLY OPTIMIZED ROUTE

When clicked, update the map and metrics with an animation.

Also include a route scoring system:

Risk Score
Cost Score
Time Score
Supply Reliability Score

6. STRATEGIC PETROLEUM RESERVE DASHBOARD

Create a page called Strategic Reserves.

Focus on India's strategic petroleum reserves.

Create three major reserve cards:

Visakhapatnam

Capacity: 1.33 MMT
Current inventory: 78%

Mangalore

Capacity: 1.50 MMT
Current inventory: 71%

Padur

Capacity: 2.50 MMT
Current inventory: 64%

Display:

Current inventory

Storage capacity

Days of coverage

Recommended release rate

Recovery estimate

Create a large line chart titled:

SPR DEPLETION VS SUPPLY RECOVERY

X-axis:
Day 0 → Day 90

Y-axis:
Inventory %

Show:

Visakhapatnam depletion curve

Mangalore depletion curve

Padur depletion curve

Global supply recovery curve

Add three scenarios:

NORMAL
MODERATE DISRUPTION
SEVERE DISRUPTION

Allow users to switch between scenarios.

Add an AI recommendation:

"Maintain reserve coverage above the 30-day strategic threshold. Begin controlled release only when supply deficit exceeds 3 MMbbl/d."

7. MULTI-AGENT AI ARCHITECTURE

Create a page called AI Agents.

This page should visually explain how the AI system works.

Create a futuristic architecture diagram with connected nodes.

Agent 1 — Intelligence Agent

Collects:

News

Shipping signals

Geopolitical events

Weather

Market signals

↓

Agent 2 — Risk Analysis Agent

Calculates:

Chokepoint risk

Supply disruption probability

Regional exposure

↓

Agent 3 — Scenario Agent

Simulates:

30-day

60-day

90-day disruption scenarios

↓

Agent 4 — Optimization Agent

Optimizes:

Tanker routes

Supply allocation

Cost

Risk

Transit time

↓

Agent 5 — Strategic Reserve Agent

Determines:

SPR release timing

Release quantity

Reserve coverage

↓

Strategic Decision Engine

Outputs:

Recommended route

Reserve strategy

Supply allocation

Risk mitigation plan

Animate data flowing between the agents.

Show each agent as a glowing node/card.

When the user clicks an agent, show:

Agent status

Inputs

Current task

Output

Confidence score

8. LIVE INTELLIGENCE FEED

Create an Intelligence Feed page.

Show simulated intelligence events in chronological order.

Example:

🔴 HIGH
"Elevated military activity detected near Strait of Hormuz"
2 minutes ago

🟠 MEDIUM
"Tanker insurance premiums increased 12%"
8 minutes ago

🟡 WATCH
"Weather disruption developing near Cape of Good Hope"
21 minutes ago

🟢 LOW
"West African export capacity remains stable"
32 minutes ago

Each event should show:

Source category

Timestamp

Geographic location

Risk impact

AI interpretation

Add filters for:

Geopolitical

Shipping

Weather

Market

Supply

9. AI COPILOT

Add a floating AI Copilot button in the bottom-right corner.

Clicking it opens a chat panel.

The user should be able to ask questions such as:

"What happens if Hormuz closes for 60 days?"

"Which route should India use?"

"When should SPR release begin?"

"Which refinery is most exposed?"

The prototype can use predefined simulated responses rather than a real LLM backend.

Make responses appear as if generated by the PetroShield AI system.

Example:

USER:
"What happens if Hormuz closes for 60 days?"

AI:
"Based on the current simulation, a 60-day Hormuz disruption could create an estimated 3.4 MMbbl/d global supply gap. Brent prices may reach approximately $119/bbl. India should increase alternative sourcing and consider controlled SPR release."

Include buttons below the response:

[Run Scenario]
[Optimize Routes]
[Analyze SPR]

10. DEMO MODE

Because this is a hackathon prototype, create a Demo Mode.

Add a button:

RUN DISRUPTION DEMO

When clicked, automatically demonstrate the complete workflow:

Risk level increases

Hormuz turns red on map

Supply gap increases

Oil price increases

AI detects disruption

Scenario simulation starts

Alternative route is calculated

Tankers are rerouted

SPR depletion forecast updates

AI recommends a strategic response

Show a progress timeline at the bottom:

DETECTION → SIMULATION → OPTIMIZATION → RESERVE RESPONSE

This should be visually impressive during the hackathon presentation.

11. DATA

Use realistic but clearly simulated/demo data.

Do NOT claim that the prototype is using live intelligence unless an actual API is connected.

Create a centralized mock-data layer so that values can easily be replaced with real APIs later.

Use simulated data for:

Oil prices

Shipping routes

Risk scores

Supply volumes

Reserve inventories

Tanker movements

Geopolitical events

Refinery utilization

Structure the code so future APIs can be integrated easily.

12. TECHNICAL REQUIREMENTS

Build the application using:

React

TypeScript

Tailwind CSS

Modern component architecture

Recharts or another suitable charting library

Interactive map library such as Leaflet/Mapbox if available

Lucide icons

Responsive design

Use reusable components.

Create separate components for:

RiskMap

RiskCard

ScenarioChart

RouteComparison

ReserveChart

AIAgentGraph

IntelligenceFeed

AICopilot

MetricCard

Timeline

Avoid unnecessary complexity.

The prototype must run immediately with mock data.

13. IMPORTANT UI REQUIREMENTS

The application should look like a real strategic energy intelligence platform, not a student CRUD application.

Prioritize:

Visual impact

Interactive map

Scenario simulation

Route optimization

SPR forecasting

AI agent visualization

Smooth animations

Clear storytelling

Use realistic numbers and terminology.

Use tooltips on charts.

Use animated counters for major metrics.

Use glowing status indicators.

Use transitions when switching scenarios.

Make important alerts visually prominent.

14. HACKATHON DEMO FLOW

The application should support this exact 3-minute presentation:

STEP 1 — Overview

Show:

"Global Oil Supply Risk: HIGH"

STEP 2 — Trigger disruption

Select:

"Strait of Hormuz — Severe Disruption — 60 Days"

STEP 3 — AI Simulation

Click:

"RUN AI SIMULATION"

Show supply gap and price increase.

STEP 4 — Route Optimization

Show standard Hormuz route becoming high risk.

AI recommends:

"Cape of Good Hope alternative"

STEP 5 — Strategic Reserve

Show SPR depletion forecast.

AI recommends controlled reserve release.

STEP 6 — Final Decision

Display:

AI STRATEGIC RECOMMENDATION

"Reroute 18% of exposed cargo, initiate controlled SPR release, and maintain reserve coverage above the strategic threshold."

End with:

PETROSHIELD AI
"Predict. Simulate. Reroute. Stabilize."

Make this entire flow polished and visually impressive.

Do not build authentication, payments, complex backend infrastructure, or unnecessary CRUD features. Focus entirely on the hackathon demonstration and the five core visuals.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://oil-flow-guard.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6c9b2577-7baa-42f9-ad0b-a9a2d6b26611).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
