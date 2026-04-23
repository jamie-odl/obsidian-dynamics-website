# Endpoint-to-Meter Entitlement Matrix

Date: 2026-04-23

## Purpose

Define exactly which API endpoints are available at each tier, what usage meter each endpoint increments, where limits apply, and when overage billing should trigger.

Tiers used in this matrix:

- Starter
- Professional
- Enterprise
- Obsidian Core Enterprise

## Meter Definitions (Canonical)

- `api_calls_month`: all authenticated API requests that return non-5xx responses.
- `history_query_units`: replay/history endpoints weighted by returned rows and window depth.
- `webhook_destinations_active`: active webhook endpoints configured per account.
- `webhook_delivery_events`: delivery attempts (including retries) per month.
- `export_jobs`: export generation requests (CSV/JSON/PDF).
- `report_schedules`: active recurring report schedules.
- `enrichment_units`: weighted calls using third-party enrichment providers.
- `firehose_stream_minutes`: connected minutes for internal enterprise SSE firehose.
- `firehose_replay_gb`: historical firehose replay payload volume.

## SkyGrid Endpoint Matrix

| Endpoint Group | Example Routes | Starter | Professional | Enterprise | Core Enterprise | Primary Meter(s) |
|---|---|---|---|---|---|---|
| Public status/network | `/api/v1/network/live`, `/api/v1/network/mission-summary` | Yes | Yes | Yes | Yes | none |
| Historical leaderboard | `/api/v1/network/anomaly-leaderboard` | Limited window | Full | Full + larger limits | Full + cross-domain | `api_calls_month`, `history_query_units` |
| Watch grids | `/api/v1/watch-grids*` | Low caps | Medium caps | High caps | High caps | `api_calls_month` |
| Webhooks config/test | `/api/v1/webhooks*` | Basic | Expanded | Advanced | Advanced | `webhook_destinations_active`, `webhook_delivery_events` |
| Node telemetry ingest | `/api/v1/maritime/ais-packets`, `/api/v1/rf-intelligence/sweeps` | No | Optional add-on | Yes | Yes | `api_calls_month`, `enrichment_units` |
| Aircraft enrichment/watch | `/api/v1/aircraft/{icao24}/enrichment`, `/api/v1/flight-watches*` | No | Limited | Yes | Yes | `enrichment_units`, `api_calls_month` |
| Account usage/value APIs | `/api/v1/account/usage`, `/api/v1/account/value` | Yes | Yes | Yes | Yes | none (control-plane) |
| Internal firehose | `/api/v1/internal/firehose/*` | No | No | No | Yes only | `firehose_stream_minutes`, `firehose_replay_gb` |

## Strait-Signal Endpoint Matrix

| Endpoint Group | Example Routes | Starter | Professional | Enterprise | Core Enterprise | Primary Meter(s) |
|---|---|---|---|---|---|---|
| Locations and routes | `/api/locations*`, `/api/routes/risk` | Yes | Yes | Yes | Yes | `api_calls_month` |
| Alerts and analytics | `/api/alerts`, `/api/analytics/overview` | Limited | Full | Full + higher throughput | Full + cross-domain | `api_calls_month` |
| API keys | `/api/keys*` | Limited keys | More keys | Highest keys | Highest keys | `api_calls_month` |
| Webhooks | `/api/webhooks*`, `/api/webhooks/test` | Basic | Expanded | SLA-capable | SLA-capable | `webhook_destinations_active`, `webhook_delivery_events` |
| Export | `/api/locations/{id}/export` | Low daily quota | Medium | High | High | `export_jobs`, `history_query_units` |
| V1 portfolio API | `/v1/maritime/events`, `/v1/transitions/scores`, `/v1/history/replay` | Limited replay | Expanded replay | Full replay | Full replay + parent joins | `api_calls_month`, `history_query_units` |
| Billing control endpoints | `/billing/*` webhook/status surfaces | Platform internal | Platform internal | Platform internal | Platform internal | none (billing infra) |
| Firehose live/sample policy | sample endpoints in sister envs | Sample only | Sample only | Sample only | Live parent scope | `api_calls_month`, `firehose_stream_minutes` |

## Additional API Integrations and Value Meters

| Integration | Endpoints/Flows Influenced | Value Add Surface | Billable Meter Mapping |
|---|---|---|---|
| Clerk | Auth/session exchange, org/role claims | Scoped API keys, role-based entitlements | supports meter partitioning by role/team |
| Stripe | Checkout/webhook lifecycle | Overage and add-on billing automation | all billable meters map to Stripe usage records |
| Sentry | API reliability and error telemetry | SLA tier proof and premium support | used for SLA qualification, not direct meter |
| Datalastic AIS | Maritime enrichment and vessel context | Higher confidence maritime decisions | `enrichment_units` |
| Weatherbit | Weather-driven risk context | Better anomaly confidence scoring | `enrichment_units` |
| GDELT | Disruption narrative intelligence | Intelligence brief and signal context | `enrichment_units`, optional report add-on |
| Map APIs | Dashboard/embed map rendering | Embeddable operations widgets | embed SKU usage counter (future meter) |

## Overage Triggers (Recommended)

Use soft warning at 70%, 85%, and 100% for each capped meter.

Hard overage billing starts when any of the following exceed included quotas:

- `api_calls_month`
- `webhook_delivery_events`
- `export_jobs`
- `history_query_units`
- `enrichment_units`

No hard cutoff in production paths by default; apply graceful degradation only when abuse/risk controls require it.

## Stripe Meter Mapping (Implementation Stub)

| Internal Meter | Stripe Usage Product | Billing Cadence |
|---|---|---|
| `api_calls_month` | `api-call-overage` | monthly |
| `webhook_delivery_events` | `webhook-delivery-overage` | monthly |
| `export_jobs` | `export-job-overage` | monthly |
| `history_query_units` | `replay-query-overage` | monthly |
| `enrichment_units` | `enrichment-overage` | monthly |
| `firehose_stream_minutes` | `firehose-stream-overage` | monthly |
| `firehose_replay_gb` | `firehose-replay-overage` | monthly |

## Enforcement Notes

- Live cross-domain firehose remains Obsidian Core Enterprise-only.
- Sister-company product environments continue exposing sanitized sample firehose surfaces.
- Entitlement claims are the source of truth for runtime gating.
- Meter writes should happen after auth/entitlement checks and before response return for billable endpoints.

## Next Implementation Tasks

1. Add meter emit calls in both backends at endpoint handler boundaries.
2. Implement usage aggregation jobs and account-level rollups.
3. Wire Stripe usage record writes for mapped billable meters.
4. Add dashboard usage forecast and projected overage panel.
5. Add contract tests for tier gating and meter increment behavior.
