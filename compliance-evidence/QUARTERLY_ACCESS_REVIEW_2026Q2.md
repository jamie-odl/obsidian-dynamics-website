# Quarterly Access Review — 2026 Q2

Review window: 2026-04-01 to 2026-06-30  
Review owner: Security + Platform Ops  
Framework mapping: SOC 2 Type II (CC6), GDPR Article 32

## Scope

- Identity providers and auth systems
- Cloud hosting/control planes
- Source control and CI/CD
- Billing and support systems
- Monitoring and alerting systems
- Production data stores and admin paths

## Systems Reviewed

| System | In scope accounts/roles | Reviewer | Date | Outcome | Notes |
| --- | --- | --- | --- | --- | --- |
| Vercel (all projects) | owners/admin/deployers |  |  |  |  |
| DigitalOcean (apps, DB, spaces) | owners/admin/operators |  |  |  |  |
| GitHub org/repos | admins/maintainers |  |  |  |  |
| Stripe | admins/billing operators |  |  |  |  |
| Resend | admins/domain operators |  |  |  |  |
| Clerk | admins/support roles |  |  |  |  |
| Sentry | owners/admins/members |  |  |  |  |
| Production databases | direct/indirect admin access |  |  |  |  |

## Removal / Downgrade Actions

| User or service account | System | Action | Ticket/reference | Completed by | Completed at |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Evidence Attachments Checklist

- [ ] Export of current users/roles per system
- [ ] Diff vs previous quarter
- [ ] Removal/downgrade evidence (screenshots or audit logs)
- [ ] Reviewer sign-off
- [ ] Final approval sign-off

## Sign-off

- Reviewer: ______________________
- Security approver: ______________________
- Date: ______________________

