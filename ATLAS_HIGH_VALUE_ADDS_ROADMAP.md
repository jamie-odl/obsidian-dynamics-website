# Atlas High-Value Adds and Recommendations

Date: 2026-04-23  
Status: Execution-ready roadmap (v1)

## Goal

Position Atlas as the enterprise control plane in Obsidian Dynamics while keeping SkyGrid, Strait-Signal, and RelayPoint as active standalone products and signal feeders.

## Strategic Principles

- Atlas is the decision layer, not another telemetry dashboard.
- Module products remain standalone wedges and customer entry points.
- Live cross-domain Atlas intelligence stays Atlas Strategic-governed.
- Every Atlas score must be explainable enough for enterprise procurement and governance review.

## Scope and Non-Goals

### In Scope (90 days)

- Atlas decision actions
- Atlas simulation APIs
- Tenant exposure overlays
- Explainability payloads and report outputs
- Executive briefing automation
- Enterprise SLA visibility
- Connector pack v1
- Benchmark index beta

### Out of Scope (this cycle)

- Global digital twin coverage
- Unbounded asset classes and geographies
- Full autonomous decision automation without human-in-the-loop controls

## Priority Stack (Highest Value First)

### 1) Decision Actions Layer (P0)

Deliverables:
- Action recommendation engine per risk/cascade event
- Action types:
  - reroute
  - re-sequence handoff
  - increase inventory/time buffer
  - trigger elevated monitoring
- Action confidence and impact estimate fields in response payload

Why high value:
- Converts Atlas from risk visibility to operational decision support.

Primary KPI:
- Action recommendation workflow completion rate.

### 2) Scenario Simulation API (P0)

Deliverables:
- `POST /v1/atlas/simulations`
- `GET /v1/atlas/simulations/{id}`
- Inputs:
  - node or corridor stress assumption
  - horizon (hours/days)
  - severity multiplier
- Outputs:
  - affected nodes
  - cascade depth
  - confidence
  - recommended mitigations

Why high value:
- Supports planning, underwriting, and strategic resilience decisions.

Primary KPI:
- Simulations run per enterprise tenant per week.

### 3) Customer Exposure Overlay (P0)

Deliverables:
- Tenant overlay layer on Atlas:
  - critical nodes
  - route concentration
  - dependency concentration
  - top fragility hotspots by tenant

Why high value:
- Makes Atlas specific to customer reality, not generic market intelligence.

Primary KPI:
- Weekly active executive and risk users.

### 4) Explainability Pack (P1)

Deliverables:
- Score reason chain payload:
  - input factors
  - weighted contribution
  - baseline deltas
  - confidence rationale
- Explainability endpoint and downloadable methodology note

Why high value:
- Lowers procurement friction and strengthens trust.

Primary KPI:
- Reduction in sales objections related to model transparency.

### 5) Executive Portfolio Briefing (P1)

Deliverables:
- Automated weekly and monthly Atlas executive packs:
  - fragility movements
  - cascade watchlist
  - recommended mitigations
  - exposure changes

Why high value:
- Expands Atlas usage from operators to C-level decision loops.

Primary KPI:
- Recurring report subscriptions and open/forward rate.

### 6) Reliability and SLA Exposure (P1)

Deliverables:
- Enterprise Atlas reliability dashboard:
  - p95 latency
  - data freshness
  - delivery success
  - incident timeline
- SLA mapping by support class

Why high value:
- Justifies premium support and enterprise pricing.

Primary KPI:
- Premium support attachment rate.

### 7) Atlas Connector Pack (P2)

Deliverables:
- Connector v1 for Jira/ServiceNow/SIEM/TMS/collaboration routing
- One-click route from Atlas alert to execution systems

Why high value:
- Increases workflow embed and lowers churn.

Primary KPI:
- Percent of enterprise tenants with at least one active connector.

### 8) Atlas Benchmark Index (P2)

Deliverables:
- Index views for tenant vs peer/corridor benchmark:
  - fragility percentile
  - resilience percentile
  - trend movement

Why high value:
- Supports thought leadership and strategic upsell.

Primary KPI:
- Strategic account expansion and benchmark report demand.

## Delivery Plan (30/60/90)

## 0-30 Days

1. Deliver decision action schema + initial UI cards.
2. Publish simulation API contract with constrained backend.
3. Deliver exposure overlay MVP for pilot tenants.
4. Define acceptance tests and rollout checklist.

## 31-60 Days

1. Deliver explainability endpoint and report export.
2. Launch weekly executive Atlas brief.
3. Launch enterprise reliability panel for Atlas.
4. Start commercial pilot packaging for Atlas add-ons.

## 61-90 Days

1. Launch connector pack v1.
2. Launch benchmark index beta.
3. Enable premium Atlas add-ons in billing catalog.
4. Run expansion campaigns to Atlas Strategic prospects.

## Workstreams and Owners (Recommended)

- Product:
  - roadmap sequencing
  - customer problem framing
  - feature acceptance
- Engineering:
  - API contracts
  - scoring services
  - connector integration
  - reliability metrics
- Data/Model:
  - score design and calibration
  - explainability payload quality
  - benchmark methodology
- GTM/Sales:
  - pilot motions
  - enterprise narrative
  - package and pricing rollout
- Customer Success:
  - executive onboarding
  - workflow adoption
  - renewal and expansion feedback

## Acceptance Criteria by Initiative

### Decision Actions Layer

- Action payload includes action type, confidence, expected impact, and rationale.
- At least 3 action types enabled in pilot.
- Event-to-action latency under defined threshold for pilot tenants.

### Simulation API

- Simulation job request/response contract is stable and versioned.
- Outputs include impacted node list, cascade depth, and confidence.
- Audit trail exists for simulation runs.

### Exposure Overlay

- Tenant-specific dependency map renders for configured entities.
- Overlay supports exportable summary for account review.
- Access controls enforce tenant isolation.

### Explainability Pack

- Every score includes reason codes and weighted factors.
- Method note export available for procurement review.
- Explainability fields are consistent across UI/API/report outputs.

### Executive Briefing

- Weekly generation job completes reliably for pilot accounts.
- Brief includes top movements, cascade watchlist, and action summary.
- Distribution log and delivery confirmation are stored.

### Reliability/SLA Panel

- Atlas endpoint p95 latency and freshness metrics visible.
- SLA status mapping reflects current support tier.
- Incident annotations available for enterprise users.

### Connector Pack

- At least 2 connectors production-ready in v1.
- Delivery retries and status states visible to users.
- Failed routing is auditable and recoverable.

### Benchmark Index

- Index methodology is documented and reproducible.
- Tenant and peer comparisons available in dashboard and export.
- Index update cadence is transparent.

## Dependencies

- Stable Atlas entity schema and endpoint contract
- Entitlement enforcement and meter logging alignment
- Billing catalog updates for Atlas add-ons
- Observability and alerting instrumentation
- Legal/commercial review for benchmark positioning language

## Risks and Mitigations

- Risk: Atlas becomes too abstract for buyers.
  - Mitigation: Lead with decision actions and exposure overlays.
- Risk: Scope explosion.
  - Mitigation: Keep MVP constrained to 25-100 nodes and one corridor theme.
- Risk: Procurement pushback on opaque scoring.
  - Mitigation: Explainability pack is mandatory for all score payloads.
- Risk: Slower enterprise cycles.
  - Mitigation: Pilot package with clear ROI scorecard and executive brief.

## Commercial Recommendations

- Keep modules as standalone wedges.
- Position Atlas as the mandatory enterprise layer for cross-domain decisioning.
- Include these in Atlas Ops baseline:
  - decision actions
  - simulations
  - exposure overlay
- Sell advanced Atlas surfaces as add-ons:
  - benchmark index
  - deeper replay
  - connector pack
  - premium SLA reporting

## Product Governance Recommendations

- Require explainability fields on every Atlas score output.
- Keep release constrained to avoid premature sprawl.
- Enforce entitlement policy:
  - sample Atlas views in module-only tiers
  - full live Atlas in Core Enterprise only
- Maintain strict tenant isolation for exposure overlays and simulation artifacts.

## KPI Framework (Definitions)

1. Atlas conversion rate
   - Module-enterprise accounts converted to Atlas bundles over period.
2. Executive WAU
   - Weekly active executive/risk decision users in Atlas.
3. Warning lead-time
   - Mean duration between Atlas high-risk flag and externally visible disruption signal.
4. Atlas add-on attach rate
   - Share of Atlas Ops/Strategic accounts with at least one Atlas premium add-on.
5. Renewal uplift
   - Renewal delta for customers using simulations + action workflows versus non-users.

## Reporting Cadence

- Weekly:
  - build progress
  - pilot account adoption
  - risk register updates
- Monthly:
  - KPI trend review
  - pricing/add-on effectiveness
  - roadmap reprioritization decisions

## Immediate Next Steps

1. Create per-initiative tickets with acceptance criteria in delivery tracker.
2. [In progress] Finalize Atlas endpoint versioning and payload contracts.
   - Implemented initial `/v1/atlas` contract surface in API: node fragility + action recommendations, scenario simulation create/read, and customer exposure overlay.
   - Next: publish OpenAPI examples + lock contract tests for pilot tenants.
3. Align GTM messaging with action-first Atlas positioning.
4. Start two enterprise pilots with exposure overlay + simulation scope.
