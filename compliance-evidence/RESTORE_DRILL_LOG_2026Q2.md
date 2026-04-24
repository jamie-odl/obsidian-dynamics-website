# Restore Drill Log — 2026 Q2

Drill window: 2026-04-01 to 2026-06-30  
Framework mapping: SOC 2 Type II (Availability A1), GDPR Art. 32(1)(c)

## Critical Datastores

| Datastore | Product(s) | Backup source | Restore target | RTO target | RPO target |
| --- | --- | --- | --- | --- | --- |
| Managed PostgreSQL (SkyGrid) | SkyGrid | DO managed backups | Isolated restore instance | 4h | 1h |
| Managed PostgreSQL/Timescale (Strait-Signal) | Strait-Signal | DO managed backups | Isolated restore instance | 4h | 1h |
| Object storage snapshots | Atlas/RelayPoint/exports | DO Spaces/versioned artifacts | Isolated bucket | 4h | 24h |

## Drill Execution Records

| Datastore | Drill date | Backup timestamp restored | Restore success | Integrity checks passed | Actual RTO | Actual RPO | Operator | Evidence ref |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |

## Validation Checklist

- [ ] Schema/table counts match expected baseline
- [ ] Sample business queries return valid results
- [ ] Application connectivity test passed on restored copy
- [ ] Restore artifacts deleted after validation (least retention)
- [ ] Post-drill findings captured and actioned

## Issues and Follow-up

| Issue | Severity | Corrective action | Owner | Due date | Status |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Sign-off

- Platform lead: ______________________
- Security/Compliance reviewer: ______________________
- Date: ______________________

