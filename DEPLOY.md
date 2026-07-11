# Deploy — Obsidian Dynamics marketing (Civitas)

Static marketing pages for **Obsidian Dynamics** / Civitas (UK developer contributions intelligence) live in this repository.

| Path | Purpose |
|------|---------|
| `/` | Civitas homepage |
| `/research`, `/about`, `/contact` | Research, company, enquiries |
| `/admin` | Rewritten to `obsidian-dynamics-admin` (do not remove) |
| `/privacy`, `/terms` | Legal |

**Obsidian Node is not served on weareobsidian.co.uk.** Former Node paths (`/node`, `/pilot`, `/construction`, `/logistics`, `/demo`, `/portal`) permanently redirect to `/`.

## Production config

`vercel.json` serves the full marketing site from the repo root:

- `"buildCommand": null`
- `"outputDirectory": "."`

There is **no** offline/maintenance holding page. To take the public site down, pause or remove the Vercel project / domain aliases — do not deploy a stub page with contact email.

## Vercel

Project: `obsidian-dynamics-website`

```bash
vercel --prod
```

Contact form POSTs use this repo’s `api/contact.js` on Vercel.

## Domains

- Production: `https://www.weareobsidian.co.uk`
- Apex `weareobsidian.co.uk` → `www` (see `vercel.json`)
