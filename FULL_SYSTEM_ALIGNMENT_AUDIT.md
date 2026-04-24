# Full System Alignment Audit

Date: 2026-04-23

## Scope

Cross-portfolio audit and alignment pass across:

- Obsidian Dynamics (parent)
- SkyGrid (sister product)
- Strait-Signal (sister product)

Coverage areas:

- Brand and hierarchy
- Pricing and commercial language
- Legal and trust posture
- Reports and dashboards
- API/firehose policy
- Email templates and outreach messaging
- Documentation coherence

## Alignment Status

### 1) Brand and Governance

Status: **Aligned**

- Parent-first positioning is maintained across portfolio surfaces.
- Sister products are represented as standalone products under Obsidian governance.
- Hero widget surfaces are now present on all three properties for sticky monitoring behavior.

### 2) Pricing and Commercial Copy

Status: **Aligned**

- Pricing structure is tiered by module and escalates to Obsidian Core.
- Core tier narrative and CTA language are codified in `PRICING_COPY_DECK.md`.
- Parent-level value path remains explicit: module adoption -> unified Core orchestration.

### 3) Legal/Trust and Policy Baseline

Status: **Mostly aligned**

- Sister product legal surfaces (privacy/terms/cookies/security) are in place.
- Parent and sister relationship language is visible on front-facing pages.
- Remaining recommendation: enforce one legal annex workflow for changes across all three sites in release checks.

### 4) Reports and Dashboard Alignment

Status: **Aligned**

- Added portfolio-governance notices to:
  - `ProjectSkygrid/frontend/app/reports/page.tsx`
  - `ProjectSkygrid/frontend/app/dashboard/page.tsx`
  - `StraitSignal/apps/web/src/app/dashboard/page.tsx`
- Reports and dashboards now explicitly reflect standalone + unified operating model.

### 5) API and Firehose Policy

Status: **Aligned**

- Live enterprise firehose remains parent-scoped via Obsidian Dynamics enterprise controls.
- Sister module surfaces support sanitized sample payload pathways for integration and testing.
- Entitlement model is aligned around access claims and governance boundaries.

### 6) Email Templates and Outreach

Status: **Aligned**

- Existing SkyGrid templates retained and updated with parent-governance rules:
  - `ProjectSkygrid/docs/email-template-library.md`
- New Strait-Signal template set created:
  - `StraitSignal/EMAIL_TEMPLATE_LIBRARY.md`
  - `StraitSignal/apps/web/public/email-templates/01-freight-forwarder-outreach.html`
  - `StraitSignal/apps/web/public/email-templates/02-pilot-invite-follow-up.html`
  - `StraitSignal/apps/web/public/email-templates/03-weekly-maritime-risk-digest.html`
- New Obsidian parent template set created:
  - `obsidian-dynamics-website/EMAIL_TEMPLATE_LIBRARY.md`
  - `obsidian-dynamics-website/email-templates/01-core-enterprise-outreach.html`
  - `obsidian-dynamics-website/email-templates/02-executive-brief-invite.html`
  - `obsidian-dynamics-website/email-templates/03-monthly-portfolio-digest.html`

### 7) Documentation Cohesion

Status: **Aligned with minor housekeeping**

- Unified operating-model docs exist across portfolio repositories.
- Pricing copy deck and email library docs now exist for all three properties.
- Housekeeping recommendation: remove duplicate legacy content blocks in older email template files during next cleanup PR.

## High-Value Follow-Through (Next Sprint)

1. Add CI lint/check to assert required legal/footer links and parent/sister references on all public pages.
2. Add a shared campaign variable schema for email templates (recipient segment, CTA, links, unsubscribe placeholder).
3. Add dashboard/report release checklist items to verify portfolio-governance notice copy remains intact.
4. Add monthly portfolio review cadence that compares product-level metrics and escalates Core expansion candidates.

## API Value and Monetization Extension

- Detailed API value-maximization and monetization execution plan is now tracked in:
  - `API_VALUE_MAXIMIZATION_PLAYBOOK.md`
- Endpoint-level entitlement and billing meter execution matrix is now tracked in:
  - `ENDPOINT_ENTITLEMENT_METER_MATRIX.md`
- This includes:
  - additional third-party API/service utilization strategy
  - endpoint packaging and metering model
  - 30/60/90 monetization rollout guidance

## Atlas Portfolio Positioning Clarification

- Atlas is now designated as the Obsidian Core Enterprise aggregation and decision layer.
- SkyGrid, Strait-Signal, and RelayPoint remain active standalone products and continue to be developed and commercialized independently.
- Portfolio strategy is module-first adoption with Atlas-driven enterprise unification.
