# API Value Maximization and Monetization Playbook

Date: 2026-04-23

## Objective

Convert existing API infrastructure (first-party and third-party integrations) into higher retention, larger ACV, and clearer upsell pathways to Obsidian Core.

## Integration Inventory (What You Already Use)

### 1) Core Product APIs

- Project SkyGrid API surfaces (events, leaderboards, reports, watch grids, webhooks, billing, entitlements).
- Strait-Signal API surfaces (locations, routes, alerts, analytics, API keys, webhooks, billing, export, firehose sample/live gates).
- Parent-level entitlement and firehose policy control (Obsidian Dynamics Core enterprise scope).

### 2) Third-Party APIs and Services in Active Use

- Identity/Auth: Clerk
- Billing: Stripe
- Observability/error tracking: Sentry
- Mapping/visualization: MapTiler / Mapbox / Cesium ecosystem
- Maritime data providers: Datalastic AIS
- Weather enrichment: Weatherbit
- News enrichment: GDELT DOC 2.0
- Notification and delivery rails: webhook dispatch and email delivery setup (Resend-related operational scripts)

## High-Value Monetization Model by API Surface

### A) Core Detection and Analytics APIs

Monetize via:
- Request volume bands (calls/month)
- Retention depth (history window, replay range)
- Query complexity (single endpoint calls vs. composite analytics)
- Scheduled intelligence report jobs

Packaging:
- Starter: basic query limits + short history
- Professional: increased limits + scheduled reporting + expanded replay
- Enterprise/Core: highest limits + cross-domain joins + parent governance features

### B) Webhooks and Delivery APIs

Monetize via:
- Number of destinations
- Delivery SLA tier (best effort vs. priority queue)
- Retry/guaranteed delivery windows
- Signed payload verification and audit export

High-margin add-on:
- "Priority Delivery Pack" (SLA, retry policy controls, dedicated throughput)

### C) Data Enrichment APIs (AIS, Weather, News)

Treat enrichment as a premium intelligence layer:
- Standard enrichment in Pro
- Enhanced enrichment in Enterprise (broader provider coverage, lower latency updates, confidence overlays)
- Paid "Attribution Mode" add-on with source lineage summaries for compliance reporting

### D) Report and Export APIs

Monetize via:
- Exports/day
- Format families (CSV/JSON baseline, PDF intelligence as premium)
- Scheduled recurring report bundles
- White-label branding and executive brief formatting

Upsell:
- "Board Pack API" (monthly preformatted executive export package)

### E) Parent Firehose and Cross-Domain APIs

Policy stays:
- Live cross-domain firehose remains Obsidian Core Enterprise only.
- Sister product environments continue to expose sanitized sample APIs.

Monetize via:
- Core Enterprise base entitlement
- Optional throughput packs
- Historical firehose replay windows as paid extension

## Best Value-Add Moves for Additional APIs

### Clerk (Identity)

Value-add:
- API key scopes per team role (ops, analyst, integration)
- Tenant-level entitlement dashboards

Revenue effect:
- Enterprise governance upsell and reduced churn risk in procurement-heavy buyers.

### Stripe (Billing)

Value-add:
- Metered overages on calls, destinations, exports, replay depth
- Prepaid usage blocks and annual commitment discounts
- Add-on bundles (priority delivery, advanced enrichment, report automation)

Revenue effect:
- Captures growth without forcing hard plan cliffs.

### Sentry (Observability)

Value-add:
- Customer-facing reliability reporting for enterprise accounts
- Internal pricing tied to reliability class (standard vs. premium operations support)

Revenue effect:
- Justifies premium support and SLA tiers.

### Map APIs (MapTiler/Mapbox/Cesium)

Value-add:
- Embeddable map widgets with usage entitlements
- Branded operational map embeds for partner portals

Revenue effect:
- New "Embed/API channel" SKU and OEM-style upsell.

### Datalastic + Weatherbit + GDELT

Value-add:
- "Enrichment Confidence API" that returns event + confidence + source blend metadata
- Source-specific premium packs (maritime + weather + disruption intelligence)

Revenue effect:
- Higher ARPU from customers who need richer context for operational decisions.

## Recommended SKU and Metering Framework

### Common Meters

- API calls/month
- Webhook destinations
- Export jobs/day
- Report schedules/month
- Replay history days
- Enrichment query weight (standard vs. premium)

### Add-On Catalog

- Priority delivery pack
- Advanced enrichment pack
- Historical replay extension
- Executive reporting pack
- Embed widget/API pack
- Governance and audit pack

## 30/60/90 Execution Plan

### 0-30 Days

1. Publish endpoint-to-meter mapping for both sister products and Core.
2. Enable soft-limit warnings at 70/85/100%.
3. Expose usage panels in dashboard billing pages.
4. Launch add-on descriptors in pricing copy and sales decks.

### 31-60 Days

1. Turn on Stripe metered overages for at least two dimensions:
   - API calls
   - webhook destinations
2. Launch scheduled report bundles as paid add-on.
3. Roll out integration-grade webhook SLA tier.

### 61-90 Days

1. Launch enrichment confidence pack (AIS + weather + disruption context).
2. Launch embeddable widget SKU with entitlement gating.
3. Add enterprise firehose replay extension for Core customers.

## Implementation Artifacts to Create Next

1. Endpoint-to-plan entitlement matrix (all public and internal APIs) - now created in `ENDPOINT_ENTITLEMENT_METER_MATRIX.md`.
2. Meter event contract (what gets counted, when, and by which key).
3. Stripe product/price map for base tiers + add-ons + overages.
4. Dashboard usage UX spec (threshold warnings, upgrade prompts, forecasted overage).
5. Sales enablement one-pager for each add-on SKU.

## Success Metrics

- Net revenue retention uplift from usage-based overages and add-ons.
- Attach rate of enrichment/report/add-on packs.
- Conversion rate from module enterprise to Obsidian Core.
- Reduction in churn from plan cliff events (via soft overage model).
- Time-to-expand for existing customers (days from first paid usage to first add-on).
