# Retention, Deletion, and DSAR Evidence Register

Framework mapping: GDPR Articles 5, 15-22, 30, 32

## Data Retention Schedule (Unified)

| Data class | Example systems | Retention | Deletion method | Legal basis/notes |
| --- | --- | --- | --- | --- |
| Account profile data | Clerk/app user tables | Active account + 12 months post-closure | Soft delete then hard delete batch | Contract + legitimate interest |
| Billing records | Stripe, internal subscription tables | 7 years | Provider retention + internal archive controls | Legal obligation |
| Security/audit logs | API audit tables, app logs | 12 months hot + 12 months cold archive | TTL + archive purge | Security + accountability |
| Operational telemetry (raw) | anomaly/event streams | 90 days (raw), aggregated retained longer | rolling purge job | Minimization principle |
| Export artifacts/reports | snapshots/exports | 30-180 days by tier | signed URL expiry + storage lifecycle | Customer contract |
| Support/contact records | contact forms/email support | 24 months | periodic purge | Legitimate interest |

## DSAR Workflow Evidence

| Request ID | Request type (access/delete/rectify/export) | Product | Received at | Verified identity | SLA due date | Completed at | Outcome | Evidence ref |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |

## DSAR Control Checklist

- [ ] Intake channel documented and monitored
- [ ] Identity verification performed before action
- [ ] Scope search across all in-scope systems
- [ ] Deletion/anonymization executed where legally permitted
- [ ] Response sent within SLA (30 days default)
- [ ] Request and completion evidence archived

## Product-Level Confirmation

- [ ] Atlas/Obsidian DSAR workflow tested
- [ ] SkyGrid DSAR workflow tested
- [ ] Strait-Signal DSAR workflow tested
- [ ] RelayPoint DSAR workflow tested

