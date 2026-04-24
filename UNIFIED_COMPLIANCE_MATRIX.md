# Unified Compliance Matrix — SOC 2 Type II and GDPR

Date: 2026-04-24  
Scope: Obsidian Dynamics (Atlas), ProjectSkygrid, Strait-Signal, RelayPoint  
Frameworks: SOC 2 Type II (Security, Availability, Confidentiality), GDPR

## Audit Alignment Statement

This matrix aligns all product surfaces to a common control baseline so the portfolio can be assessed consistently for:

- SOC 2 Type II readiness and evidence generation
- GDPR operational compliance and accountability

Note on supplier assurance:

- Render SOC 2 Type II report period (`2024-10-01` to `2025-09-30`) may be retained as historical supplier evidence only.
- Active production architecture is DigitalOcean App Platform + Vercel + managed third-party processors.

---

## Control Baseline (Cross-Project)

## 1) Security (SOC 2 CC series)

- **Identity and access control**: SSO/MFA where available, least-privilege roles, quarterly access reviews.
- **AuthN/AuthZ enforcement**: plan/entitlement checks server-side, route protection, API key lifecycle controls.
- **Secrets management**: all production secrets in platform env stores, no plaintext secrets in repo.
- **Logging and monitoring**: structured security logs, error monitoring, alert routing, incident response workflow.
- **Change management**: PR review, CI checks, deployment logs, rollback playbooks.

## 2) Availability

- **Health checks and service monitoring**: uptime probes, dependency health, alerting.
- **Backup and recovery**: database backup policy, restore test cadence, RTO/RPO targets documented.
- **Capacity and resilience**: rate limiting, abuse controls, autoscaling config, incident escalation.

## 3) Confidentiality

- **Data classification**: public/internal/restricted data treatment.
- **Encryption in transit and at rest**: TLS everywhere, managed DB/storage encryption controls.
- **Data minimization**: collect only required operational fields; avoid excessive retention.

## 4) GDPR Core Requirements

- **Lawful basis and transparency**: updated privacy disclosures per product and processor use.
- **Data subject rights**: access, deletion, rectification, objection workflow documented and testable.
- **Retention and deletion**: policy by data type with automated/operational deletion procedure.
- **Processor management**: DPA/SCC coverage for all subprocessors, subprocessor register maintained.
- **Breach handling**: incident classification, 72-hour notification workflow where applicable.

---

## Project-by-Project Alignment

## Obsidian Dynamics / Atlas

- **In place**: centralized auth/billing routing, security and privacy pages, audit-oriented operational docs.
- **Needs completion**:
  - publish final legal SLA annex harmonization across terms/privacy/support
  - formalize monthly access review and key-rotation evidence logs
  - implement subprocessor change notification workflow

## ProjectSkygrid

- **In place**: extensive security implementation controls, audit logging, entitlement/rate-limit controls, DO production runbooks.
- **Needs completion**:
  - remove/close legacy provider references operationally (Render account closure evidence)
  - complete periodic restore drill evidence (not just backup enabled status)
  - finalize GDPR DSAR runbook and data retention schedule publication

## Strait-Signal

- **In place**: auth, subscription gates, rate limiting, monitoring hooks, production deployment specs.
- **Needs completion**:
  - finalize Stripe webhook/entitlement operational test evidence
  - formal DSAR and deletion workflow for account and telemetry-linked records
  - periodic access review and incident drill recordkeeping

## RelayPoint

- **In place**: baseline FastAPI controls and public policy surfaces.
- **Needs completion**:
  - harden production auth model and audit logs equivalent to sister products
  - add explicit retention/deletion and DSAR procedure
  - align incident response and uptime evidence capture with portfolio standard

---

## Evidence Pack Requirements (SOC 2 Type II + GDPR)

For each monthly cycle, retain:

- access review output (approved users, removed users, reviewer, timestamp)
- secret/key rotation log (what rotated, when, by whom)
- incident log + post-incident review (if any)
- backup success + restore test evidence
- deployment/change log with approvals
- vulnerability/dependency scan results and remediation notes
- GDPR request log (DSAR/deletion requests and response times)
- subprocessor register delta (added/removed/changed providers)

---

## Immediate Portfolio Actions (Execution Order)

1. Complete Render provider decommission evidence (references removed, account closed, DNS/routes validated).
2. Publish and enforce a single retention/deletion schedule across all products.
3. Execute and archive one restore drill per critical datastore.
4. Run quarterly access review process and archive signed results.
5. Finalize DPA/SCC coverage and confirm GDPR role mapping (controller/processor) for each product flow.

---

## Audit Readiness Status

- **Aligned baseline established**: yes (this matrix)
- **Code and operational controls partially implemented**: yes
- **Audit-pass guarantee**: no system can guarantee pass without independent auditor testing and complete evidence history
- **Current state**: execution-ready with clear remaining work items above

