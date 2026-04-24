# Developer Portal Auth Setup

This project now includes developer portal authentication with:

- allowlisted account enforcement
- email-link second factor flow
- signed session cookies for protected pages

## Protected Pages

- `developer-central.html`
- `onboarding.html`
- `onboarding-skygrid.html`
- `onboarding-strait-signal.html`
- `onboarding-relaypoint.html`
- `onboarding-atlas.html`
- `account-operations.html`

Unauthenticated users are redirected to `developer-login.html`.

## Backend Endpoints

- `POST /api/auth/request-link` - request one-time login email link
- `GET /api/auth/verify?token=...` - verify link and create session
- `GET /api/auth/session` - check active session
- `POST /api/auth/logout` - clear session

## Required Environment Variables

- `AUTH_TOKEN_SECRET` - long random secret used for token signing
- `DEVELOPER_ALLOWLIST` - comma-separated allowlisted emails
- `RESEND_API_KEY` - Resend API key for sending login links
- `AUTH_EMAIL_FROM` - sender address (e.g. `security@yourdomain.com`)
- `NODE_ENV` - `production` in deployed environment

## Stripe Billing Environment Variables

- `STRIPE_SECRET_KEY`
- `BILLING_SUCCESS_URL`
- `BILLING_CANCEL_URL`
- `BILLING_PORTAL_RETURN_URL`

Per-plan Stripe price IDs:

- `PRICE_SKYGRID_STARTER`
- `PRICE_SKYGRID_PROFESSIONAL`
- `PRICE_SKYGRID_ENTERPRISE`
- `PRICE_STRAIT_STARTER`
- `PRICE_STRAIT_PROFESSIONAL`
- `PRICE_STRAIT_ENTERPRISE`
- `PRICE_RELAYPOINT_STANDARD`
- `PRICE_ATLAS_ANALYST`
- `PRICE_ATLAS_OPERATIONS`
- `PRICE_ATLAS_ENTERPRISE`
- `PRICE_ATLAS_OEM`

Example:

```env
AUTH_TOKEN_SECRET=replace-with-long-random-secret
DEVELOPER_ALLOWLIST=jamie@obsidiandynamics.co.uk
RESEND_API_KEY=re_xxx
AUTH_EMAIL_FROM=security@obsidiandynamics.co.uk
NODE_ENV=production
```

## Operational Notes

- Do not store plaintext passwords in code or docs.
- Keep allowlist minimal and update only through approved process.
- Rotate `AUTH_TOKEN_SECRET` and email API keys periodically.
- Keep API endpoints non-cacheable (`Cache-Control: no-store` already configured in `vercel.json`).
- Magic links are one-time-use (`jti` replay-protected) and expire in 15 minutes.
- Basic rate limiting is enforced per IP on auth endpoints to reduce abuse.
- Auth events are emitted to logs as JSON (`auth_*` events) for audit and monitoring.
