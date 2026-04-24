# Cross-Project Execution Tracker

Date: 2026-04-23  
Owner: Obsidian Dynamics Program

This tracker converts the highest-value next actions into executable deliverables across Obsidian Dynamics, ProjectSkygrid, and Strait-Signal.

## Execution Status Legend

- DONE: implemented and shipped in code/content
- IN PROGRESS: partially implemented, remaining actions listed
- TODO: not yet implemented

## 1) Monetization Hardening (Cross-Project)

- DONE: Atlas-led packaging language aligned on sister pricing pages (`Atlas Core`, `Atlas Ops`, `Atlas Strategic`).
- DONE: Unified entitlement + SLA baseline surfaced in public pricing copy for both sister products.
- IN PROGRESS: backend enforcement parity for all entitlement gates across every endpoint.
- TODO: final legal SLA annex harmonization (terms/privacy/support language consistency pass).

## 2) Product Proof (ROI and Evidence)

- DONE: Obsidian platform surfaces include proof chips, ROI calculators, and mini case outcomes.
- IN PROGRESS: project-specific KPI dashboards for SkyGrid and Strait-Signal to mirror Atlas proof format.
- TODO: automate report snapshots into monthly evidence packs per product.

## 3) Enterprise Trust and Compliance

- DONE: trust-center/evidence/methodology links wired on Atlas and platform flows.
- IN PROGRESS: SOC2-ready evidence mapping completion (access logs, retention, incident drill records).
- DONE: publish unified compliance baseline matrix (`UNIFIED_COMPLIANCE_MATRIX.md`) and processor register (`SUBPROCESSOR_REGISTER.md`) for cross-project alignment.

## 4) Sales Acceleration

- DONE: role-specific use-case and conversion CTA patterns are live on Obsidian website pages.
- IN PROGRESS: before/after mini case snapshots are seeded; needs expansion to 3 vertical case studies per product.
- TODO: add buyer-persona landing variants (Ops, Risk, Insurance, Integration) for SkyGrid and Strait-Signal.

## 5) Atlas as Enterprise Mandatory Layer

- DONE: public pricing and positioning now treats Atlas as enterprise decision layer and parent control plane.
- DONE: sister module tiers remain standalone while Atlas governs cross-domain live scope.
- IN PROGRESS: enforce Atlas requirement at entitlement contract layer for enterprise cross-domain APIs.
- TODO: add enterprise upsell prompts in module dashboards when cross-domain actions are attempted.

## 6) Project-Specific Delivery Checklist

### Obsidian Dynamics (Atlas)

- DONE: Atlas roadmap document updated to Atlas-native enterprise language.
- IN PROGRESS: lock v1 contracts and publish strict changelog governance.
- TODO: quarterly Fragility Index automation pipeline.

### ProjectSkygrid

- DONE: pricing now aligned to Atlas bundles and SLA/entitlement baseline.
- IN PROGRESS: sample-vs-live endpoint hardening and commercial API readiness.
- TODO: reliability panel and ingestion health publishing for customer visibility.

### Strait-Signal

- DONE: pricing now aligned to Atlas bundles and DaaS narrative.
- IN PROGRESS: route recommendations with confidence bands and forecast layer packaging.
- TODO: webhook playbook templates and replay pack monetization surface.

## 7) Next Build Wave (Implementation Order)

1. Endpoint entitlement parity audit and fixes (SkyGrid + Strait-Signal APIs).
2. Shared compliance matrix page and legal annex alignment.
3. Product KPI dashboard components for SkyGrid and Strait-Signal.
4. Enterprise integration playbooks (webhooks/templates/export packs).
5. Atlas contract freeze and automated contract test gate in CI.

## 8) Review List: Access, Distribution, and Language Tone

- TODO: Replace internal/public-facing "hero widget" references in product copy with neutral terms (`Overview panel`, `Signal snapshot`, `Portfolio view`).
- TODO: remove upsell-leaning phrasing from CTAs and pricing-adjacent copy; prefer operational value language (`Get operational view`, `Open risk snapshot`, `View current signals`).
- TODO: implement tier-relative widget access model (no hard paywall at top-level page):
  - All visitors: delayed or sample snapshots with clear timestamp/source labeling.
  - Registered/free: limited live window, reduced history, lower update cadence.
  - Paid tiers: deeper history, higher refresh cadence, exports, and alerts.
- TODO: add "what changes by tier" matrix directly under each widget to make access boundaries transparent.
- TODO: define download policy:
  - Public: 1-page image/PDF snapshot only (watermarked, no raw rows).
  - Free/registered: capped CSV/PDF exports (limited rows/date range).
  - Paid tiers: full CSV/PDF/API export scopes by entitlement.
- TODO: apply metering + anti-abuse controls to downloads (rate limits, signed URLs, row caps, and watermarking).
- TODO: A/B test two CTA sets for tone shift (commercial vs operational) and retain the variant with stronger qualified conversion.

## 9) Next High-Value Actions (Priority Sequence)

1. Instrument panel/download usage analytics (view rate, click rate, conversion-to-contact by tier and page).
2. Ship real public snapshot assets (scheduled PDF generation with timestamp + watermark) for Atlas and RelayPoint.
3. Implement entitlement-aware export endpoints (`public_snapshot`, `limited_export`, `full_export`) with rate limits and audit logs.
4. Add RelayPoint replay mini-view (`last 24h` public, `7d` registered, full paid) to validate tier-relative value quickly.
5. Launch pricing/access explainer strip on all module pages for consistency with index + RelayPoint implementation.

## 10) Website Enhancements (Including RelayPoint)

### Cross-site

- TODO: unify CTA language to operational wording only (`Discuss scope`, `View access`, `Open status`).
- TODO: add a shared "Data freshness + source provenance" component on all overview panels.
- TODO: publish a lightweight "What each tier includes" page and link from `platform.html`, `relaypoint.html`, and `index.html`.
- TODO: add downloadable monthly operational brief templates (PDF) to increase shareability and lead quality.

### RelayPoint-specific

- TODO: expose a public "Propagation Watch" panel with top 3 active transition chains and confidence bands.
- TODO: add route/handoff comparison cards (e.g., corridor A vs corridor B) with concise operational impact text.
- TODO: publish RelayPoint-specific API examples (`/v1/transitions/scores`, `/v1/history/replay`) with sample query patterns.
- TODO: add analyst annotation layer in snapshots so exported reports include decision rationale context.

## 11) Developer Central and Dynamic Media

- DONE: publish `developer-central.html` as the central engineering workspace within Obsidian Dynamics (API, status, trust, methodology, integration entry points).
- DONE: add global navigation entry for Developer Central and route API page CTA to it.
- DONE: expand Developer Central scope to include account workspace, billing/usage, environment model, recommendations, and cross-project links.
- DONE: publish `MEDIA_IMPLEMENTATION_GUIDE.md` with product-authentic motion standards, technical specs, performance, and accessibility guardrails.
- DONE: publish `onboarding.html` with project-specific onboarding tracks and API setup sequence.
- DONE: publish standalone onboarding pages for each product (`onboarding-skygrid.html`, `onboarding-strait-signal.html`, `onboarding-relaypoint.html`, `onboarding-atlas.html`).
- DONE: wire standalone onboarding links from product pages and Developer Central.
- DONE: publish `account-operations.html` covering billing, lockout policy, recovery flow, and communications requirements.
- DONE: publish authentication policy content for mandatory email-link 2FA and allowlist-based developer access.
- DONE: update `contact.html` intake options to include onboarding support and account operations workflows.
- DONE: update `EMAIL_TEMPLATE_LIBRARY.md` with required operational templates from signup through recovery events.
- DONE: implement backend auth routes (`/api/auth/request-link`, `/api/auth/verify`, `/api/auth/session`, `/api/auth/logout`) and frontend route guards for protected developer portal pages.
- DONE: publish `DEVELOPER_PORTAL_AUTH_SETUP.md` with deployment environment variables and operations guidance.
- DONE: add docs versioning metadata and changelog blocks inside Developer Central (contract versions, deprecation windows, migration notes).
- DONE: add sandbox credentials/request workflow and webhook replay examples.
- TODO: add analytics for Developer Central engagement (resource clicks, contact conversion, page flow).

### Dynamic visual strategy (recommended)

- TODO: avoid generic stock video loops as primary brand motion; prefer product-authentic captures (dashboard interactions, real map transitions, replay snippets).
- TODO: produce 6-10 short silent clips (6-12s, MP4/WebM) from real product flows, with lightweight overlays and captions.
- TODO: use poster images + lazy-loading + reduced-motion fallback to protect performance and accessibility.
- TODO: place motion only in high-value blocks (homepage context strip, RelayPoint propagation panel, SkyGrid signal panel), not every section.

## 12) Auth Deployment + Hardening TODOs

- DONE: configure production environment variables in hosting platform:
  - `AUTH_TOKEN_SECRET`
  - `DEVELOPER_ALLOWLIST` (current allowlisted account only)
  - `RESEND_API_KEY`
  - `AUTH_EMAIL_FROM`
  - `NODE_ENV=production`
- TODO: verify outbound email domain setup for Resend (SPF, DKIM, DMARC alignment) and run test delivery for login-link messages.
- TODO: rotate any API keys shared in chat or outside secure secret storage; ensure no credentials are committed to repository files.
- TODO: implement one-time token replay protection for magic links (store token nonce/jti server-side and invalidate after first use).
- TODO: add auth endpoint rate limiting (`/api/auth/request-link`, `/api/auth/verify`, `/api/auth/session`) to reduce abuse risk.
- DONE: implement one-time token replay protection for magic links (jti-based single-use enforcement).
- DONE: add auth endpoint rate limiting (`/api/auth/request-link`, `/api/auth/verify`, `/api/auth/session`) to reduce abuse risk.
- DONE: add auth event audit logging (login-link requested, verified, failed verification, logout, rate-limit events).
- TODO: add session invalidation controls (manual revoke, forced logout on allowlist removal, secret rotation playbook).
- TODO: add periodic access review task (confirm only approved developer accounts remain allowlisted).
- TODO: execute end-to-end production test script:
  - request link -> receive email -> verify link -> reach protected page
  - session timeout behavior
  - logout and post-logout access denial
  - non-allowlisted account denial path

## 13) Central Billing Integration

- DONE: add centralized billing page (`billing.html`) with module and Atlas tier checkout actions.
- DONE: add Stripe checkout API route (`/api/billing/checkout`) mapping plan codes to environment-based price IDs.
- DONE: add Stripe billing portal API route (`/api/billing/portal`) to open customer portal by billing email.
- DONE: wire platform/products/developer-central to centralized billing entry point.
- DONE: set Stripe server-side environment in Vercel (`STRIPE_SECRET_KEY`, billing return URLs, and all `PRICE_*` variables configured).
- TODO: replace test Stripe key with production key and rotate any exposed keys.

## 14) DNS and Mail Authentication

- IN PROGRESS: GoDaddy DNS baseline configured for Resend sending path:
  - `MX send -> feedback-smtp.us-east-1.amazonses.com (priority 10)`
  - `TXT send -> v=spf1 include:amazonses.com ~all`
  - `TXT _dmarc -> v=DMARC1; p=none; ...`
- TODO: complete Resend domain verification and publish provider-specific DKIM records (requires successful Resend domain API/dashboard access).

## 15) Compliance Execution Pack (SOC 2 Type II + GDPR)

- DONE: created centralized evidence pack folder `compliance-evidence/` for quarterly control evidence.
- DONE: added quarterly access review record (`QUARTERLY_ACCESS_REVIEW_2026Q2.md`) covering all systems.
- DONE: added restore drill record (`RESTORE_DRILL_LOG_2026Q2.md`) for critical datastores.
- DONE: added unified retention/deletion + DSAR evidence register (`RETENTION_DELETION_AND_DSAR_EVIDENCE.md`).
- DONE: added DPA/SCC tracker for all active subprocessors (`DPA_SCC_COVERAGE_TRACKER.md`).
- DONE: added Render decommission evidence record (`RENDER_DECOMMISSION_EVIDENCE.md`) including closure checklist and sign-off section.
