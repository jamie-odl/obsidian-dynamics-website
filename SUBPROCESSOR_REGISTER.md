# Subprocessor Register (Portfolio)

Date: 2026-04-24  
Products: Atlas, SkyGrid, Strait-Signal, RelayPoint

## Active Subprocessors

- **DigitalOcean** — app hosting, managed database, object storage
- **Vercel** — frontend/serverless hosting
- **Stripe** — billing and subscription processing
- **Resend** — transactional email delivery
- **Clerk** — authentication and user identity services
- **Sentry** — error monitoring and diagnostics
- **Map providers / geospatial APIs** — operational map tiles/geodata (where configured)

## Conditional / Data Enrichment Providers

- **Datalastic** — AIS enrichment (Strait-Signal)
- **Open-Meteo** — weather enrichment
- **GDELT** — disruption/news enrichment
- **Notamify** — NOTAM enrichment (SkyGrid when configured)

## Decommissioned / Closing

- **Render** — marked for account closure (no active production references in the SkyGrid codebase after cleanup).

Required closure evidence:

1. account closed/deactivated confirmation
2. billing termination confirmation
3. DNS/traffic verification showing no active service dependency
4. archival of SOC 2 Type II report (historical vendor assurance only)

## GDPR / Contractual Requirements Per Subprocessor

For each active processor:

- DPA executed and archived
- SCC/addendum validated where required for cross-border transfer
- processing purpose documented
- categories of data documented
- retention/deletion commitments documented
- incident notification terms documented

## Change Control

- update this register before production introduction of any new processor
- notify internal stakeholders of risk classification change
- update privacy disclosures and processor list where legally required

