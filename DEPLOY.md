# Deploy — Obsidian Dynamics marketing (Civitas)

Static marketing pages for **Obsidian Dynamics** / Civitas (UK developer contributions intelligence) live in this repository.

| Path | Purpose |
|------|---------|
| `/` | Civitas homepage (or offline holding page when SITE OFFLINE) |
| `/research`, `/about`, `/contact` | Research, company, enquiries |
| `/admin` | Rewritten to `obsidian-dynamics-admin` (do not remove) |
| `/privacy`, `/terms` | Legal |

**Obsidian Node is not served on weareobsidian.co.uk.** Former Node paths (`/node`, `/pilot`, `/construction`, `/logistics`, `/demo`, `/portal`) permanently redirect to `/`.

## SITE OFFLINE (optional holding page)

Production normally serves the full marketing site (`buildCommand: null`, `outputDirectory: "."`).

To take marketing offline temporarily without removing `/admin`:

- Holding page source: `offline.html`
- Build: `node scripts/build-offline.mjs` → `offline-dist/`
- Set `vercel.json` to `"buildCommand": "node scripts/build-offline.mjs"` and `"outputDirectory": "offline-dist"`
- **`/admin` rewrites are preserved** (Civitas admin must keep working)
- Auth pages kept online: `/developer-login`, `/developer-central`, `/developer-api`, `/access-denied` (plus `css`/`js`/`fonts`/`img`)
- Marketing HTML in the repo is unchanged and can be restored

### Restore the live marketing site

1. In `vercel.json`, set:
   - `"buildCommand": null`
   - `"outputDirectory": "."`
2. Commit, push, and redeploy (`vercel --prod` or Git push to `main`).
3. Confirm `https://www.weareobsidian.co.uk/` shows the Civitas homepage and `/admin` still works.

### Take offline again

1. Restore the offline `buildCommand` / `outputDirectory` values above (or revert the restore commit).
2. Redeploy.

## Vercel

Project: `obsidian-dynamics-website`

```bash
vercel --prod
```

Contact form POSTs use this repo’s `api/contact.js` on Vercel.

## Domains

- Production: `https://www.weareobsidian.co.uk`
- Apex `weareobsidian.co.uk` → `www` (see `vercel.json`)
