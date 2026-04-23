# Atlas Enterprise Control Plane

Date: 2026-04-23

## Decision

Atlas is the central enterprise layer for Obsidian Dynamics.
It is not a standalone telemetry feed. It is the strategic dependency and cascade intelligence control plane above:

- SkyGrid (air-domain signals)
- Strait-Signal (maritime-domain signals)
- RelayPoint (transition and propagation signals)

Portfolio operating stance:

- SkyGrid, Strait-Signal, and RelayPoint remain active standalone products with their own roadmap, onboarding, and commercial motions.
- Atlas is the enterprise aggregation and interpretation layer in Obsidian Core, not a replacement for module execution.

## Role in the Portfolio

### Module Layer

- SkyGrid: detects air and weather-linked disruption patterns.
- Strait-Signal: detects maritime and chokepoint disruption patterns.
- RelayPoint: models handoff and propagation pathways.
- Each module continues standalone delivery and customer value creation.

### Atlas Layer (Control Plane)

- Scores systemic fragility and resilience for critical nodes.
- Identifies dependency concentration and substitution weakness.
- Predicts probable cascade paths and impact zones.
- Produces executive-grade, explainable intelligence outputs.
- Combines module outputs into a unified enterprise decision plane.

### Obsidian Core Enterprise

- Enforces parent-level governance and entitlements.
- Controls live firehose scope (parent enterprise only).
- Serves Atlas outputs and cross-domain orchestration APIs.

## Required Atlas API Surface (V1)

- `GET /v1/atlas/nodes`
- `GET /v1/atlas/nodes/{id}/fragility`
- `GET /v1/atlas/nodes/{id}/dependencies`
- `GET /v1/atlas/cascades`
- `GET /v1/atlas/replay/{node_id}`

## Score Model (Explainable First)

For each node:

- `fragility_score` (0-100): current vulnerability vs baseline
- `systemic_importance_score` (0-100): downstream network criticality
- `cascade_risk_score` (0-100): probability local stress propagates
- `resilience_score` (0-100): ability to absorb and recover
- `reason_codes`: interpretable drivers (congestion, weather drag, transfer overload, etc.)

## Access and Entitlement Policy

- Starter/Pro/Enterprise sister module environments:
  - Atlas sample and constrained views only.
  - No live parent firehose.
- Obsidian Core Enterprise:
  - Full Atlas live intelligence and replay.
  - Parent-governed cross-domain orchestration scope.

## MVP Constraints (To Avoid Scope Creep)

- 25-100 critical nodes
- one region or strategic corridor theme
- one dependency model and one score refresh cadence
- one dashboard view + one API payload family + one report output

## Commercial Position

Atlas should be sold as an enterprise intelligence layer, not a standalone low-tier SKU.
Module products remain sellable and valuable on their own.

- Primary fit: Core Enterprise
- Packaging:
  - Atlas included in Core Enterprise baseline
  - optional add-ons: expanded replay depth, premium enrichment, executive index reporting
  - module-specific standalone plans remain available for focused operational adoption

## Near-Term Implementation Sequence

1. Lock Atlas schema and endpoint contract.
2. Wire Atlas scoring from existing module signals.
3. Add entitlement gates for Atlas live vs sample.
4. Launch executive dashboard and report templates.
5. Enable metering for replay depth and premium Atlas outputs.

## High-Value Add Roadmap Reference

For prioritized Atlas feature expansion and commercial recommendations, see:

- `ATLAS_HIGH_VALUE_ADDS_ROADMAP.md`
