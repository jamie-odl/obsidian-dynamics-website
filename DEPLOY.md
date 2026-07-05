# Deploy — obsidiandynamics.co.uk marketing site

Static marketing pages for **Obsidian Dynamics** / Obsidian Node live in this repository. The operational platform (portal, admin, API, demo) stays in [obsidian-node](https://github.com/thevenomv/obsidian-node).

## What lives here

| Path | Content |
|------|---------|
| `/` | Obsidian Node marketing home |
| `/about`, `/contact`, `/pilot` | Company, enquiries, pilot programme |
| `/construction`, `/logistics` | Industry pages |
| `/privacy`, `/terms` | Legal |

On the **droplet**, contact form POSTs go to obsidian-node at `/api/contact` (Caddy routes `/api/*` to Next.js). This repo’s `api/contact.js` is used on **Vercel** only.

## What stays in obsidian-node

| Path | Content |
|------|---------|
| `/portal` | Asset portal PWA |
| `/admin` | Operations console |
| `/api/*` | BLE ingest, heartbeat, cron, **contact form** |
| `/demo` | Live demo (needs backend) |
| `/sign-in`, `/sign-up` | Portal auth |

## Recommended production layout (single domain)

Point `www.obsidiandynamics.co.uk` at the DigitalOcean droplet. Use Caddy to route by path:

1. **App paths** → Next.js on `127.0.0.1:3003` (`/portal`, `/admin`, `/api`, `/demo`, `/sign-in`, `/sign-up`)
2. **Marketing paths** → static files from this repo at `/var/www/obsidiandynamics-marketing`

See `deploy/Caddyfile.obsidiandynamics.example` in obsidian-node for the combined config.

```bash
# On droplet — refresh marketing static files
cd /var/www/obsidiandynamics-marketing
git pull origin main
```

## Alternative: Vercel for marketing only

Deploy this repo to Vercel with `obsidiandynamics.co.uk` as the production domain. Proxy app paths to the droplet (set `OBSIDIAN_NODE_ORIGIN` in Vercel and add rewrites), or use a subdomain such as `app.obsidiandynamics.co.uk` for the portal.

## Environment variables

### Droplet (obsidian-node `.env`)

Contact delivery on production uses the Next.js backend, not this repo’s serverless handler.

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Verified sender, e.g. `Obsidian Dynamics <contact@obsidiandynamics.co.uk>` |
| `RESEND_FROM` | Optional alias for `EMAIL_FROM` |
| `CONTACT_EMAIL` | Inbox for submissions (default `contact@obsidiandynamics.co.uk`) |

### Vercel (this repo — if using Vercel contact handler)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Contact form delivery |
| `CONTACT_TO` | Inbox (default `contact@obsidiandynamics.co.uk`) |
| `CONTACT_FROM` | From address (default `Obsidian Dynamics <contact@obsidiandynamics.co.uk>`) |
| `OBSIDIAN_INTELLIGENCE_API_URL` | Intelligence API proxy base URL |

Do not commit `.env*` files with secrets.

## Resend dashboard (obsidiandynamics.co.uk)

1. [Resend → Domains](https://resend.com/domains) → **Add domain** → `obsidiandynamics.co.uk`
2. Add DNS records shown (SPF, DKIM; optional DMARC)
3. Wait until status is **Verified**
4. Set `EMAIL_FROM` / `CONTACT_FROM` to an address on that domain (e.g. `contact@obsidiandynamics.co.uk`)
5. Ensure the inbox (`CONTACT_EMAIL` / `CONTACT_TO`) can receive mail — forward `contact@` to your personal inbox if needed

## Local preview

Open `index.html` via a static server, or use Vercel CLI:

```bash
npx vercel dev
```
