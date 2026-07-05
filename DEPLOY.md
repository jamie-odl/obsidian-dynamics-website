# Deploy — weareobsidian.co.uk marketing site

Static marketing pages for **We Are Obsidian** / Obsidian Node live in this repository. The operational platform (portal, admin, API, demo) stays in [obsidian-node](https://github.com/thevenomv/obsidian-node).

## What lives here

| Path | Content |
|------|---------|
| `/` | Obsidian Node marketing home |
| `/about`, `/contact`, `/pilot` | Company, enquiries, pilot programme |
| `/construction`, `/logistics` | Industry pages |
| `/privacy`, `/terms` | Legal |
| `/api/contact` | Contact form (Vercel serverless + Resend) |

## What stays in obsidian-node

| Path | Content |
|------|---------|
| `/portal` | Asset portal PWA |
| `/admin` | Operations console |
| `/api/*` | BLE ingest, heartbeat, cron |
| `/demo` | Live demo (needs backend) |
| `/sign-in`, `/sign-up` | Portal auth |

## Recommended production layout (single domain)

Point `www.weareobsidian.co.uk` at the DigitalOcean droplet. Use Caddy to route by path:

1. **App paths** → Next.js on `127.0.0.1:3003` (`/portal`, `/admin`, `/api`, `/demo`, `/sign-in`, `/sign-up`)
2. **Marketing paths** → static files from this repo at `/var/www/weareobsidian-marketing`

See `deploy/Caddyfile.weareobsidian.example` in obsidian-node for the combined config.

```bash
# On droplet — refresh marketing static files
cd /var/www/weareobsidian-marketing
git pull origin main
```

## Alternative: Vercel for marketing only

Deploy this repo to Vercel with `weareobsidian.co.uk` as the production domain. Proxy app paths to the droplet (set `OBSIDIAN_NODE_ORIGIN` in Vercel and add rewrites), or use a subdomain such as `app.weareobsidian.co.uk` for the portal.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Contact form delivery |
| `CONTACT_TO` | Inbox (default `jamie@obsidiandynamics.co.uk`) |
| `CONTACT_FROM` | From address (default `We Are Obsidian <contact@weareobsidian.co.uk>`) |
| `OBSIDIAN_INTELLIGENCE_API_URL` | Legacy intelligence API proxy (replaces `CIVITAS_API_URL`) |

Do not commit `.env*` files with secrets.

## Local preview

Open `index.html` via a static server, or use Vercel CLI:

```bash
npx vercel dev
```

## Rebrand note

The former **Civitas** intelligence product references have been retired from the public site. Env var `CIVITAS_API_URL` is still accepted as a fallback for API proxies during transition.
