# Obsidian Dynamics Portfolio Audit

## Scope

Cross-project review of front-facing product positioning, legal/trust cohesion, and API/firehose access policy across:

- Obsidian Dynamics (parent)
- SkyGrid (sister product under Obsidian Dynamics)
- Strait-Signal (sister company)

## Required Portfolio Pattern

### Standalone

- Each product owns roadmap, pricing, docs UX, and support motion.
- Each product keeps its own domain narrative and user journey.

### Unified

- Parent-managed identity and entitlements for enterprise-sensitive surfaces.
- Shared schema semantics and policy baseline.
- Shared observability and incident taxonomy.
- Parent-only access to live cross-domain firehose data.

## Implementation Notes

- Product pages are simplified to emphasize "clear job per product" and "shared governance under Obsidian."
- Sister products expose sample API payloads for integration while withholding live enterprise streams.
- Parent website maintains the canonical narrative for portfolio-level architecture.
- Full-system operational alignment status and checklist now live in `FULL_SYSTEM_ALIGNMENT_AUDIT.md`.
- Portfolio pricing and sales messaging baseline now live in `PRICING_COPY_DECK.md`.
- Parent outreach template set now lives in `EMAIL_TEMPLATE_LIBRARY.md` and `email-templates/`.
- API value-add and monetization rollout guidance now lives in `API_VALUE_MAXIMIZATION_PLAYBOOK.md`.
- Atlas central enterprise control-plane decision is now formalized in `ATLAS_ENTERPRISE_CONTROL_PLANE.md`.
