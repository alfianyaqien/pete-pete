# Deployment (Vercel)

PetePete is a Nuxt 4 app with a Nitro server (the `/api/*` routes). It's
configured for Vercel (`nitro.preset = 'vercel'` in `nuxt.config.ts`) and pinned
to Node 24 (`engines.node` in `package.json`).

**Before deploying:** finish [Supabase setup](./supabase-setup.md) so you have
`NUXT_SUPABASE_URL` and `NUXT_SUPABASE_SERVICE_KEY`.

---

## Step 0 - Put the code in Git (once)

The project isn't a git repo yet. `.env` is already gitignored, so secrets won't
be committed.

```bash
git init
git add -A
git commit -m "Initial commit"
```

Create an **empty** repo on GitHub (no README), then:

```bash
git branch -M main
git remote add origin git@github.com:<you>/pete-pete.git
git push -u origin main
```

> Sanity check that no secret is staged: `git ls-files | grep -E '(^|/)\.env$'`
> should print nothing.

---

## Step 1 - Deploy

Pick one route.

### Route A - Vercel Dashboard (recommended)

1. <https://vercel.com/new> → **Import** your GitHub repo.
2. Framework preset auto-detects **Nuxt**. Leave build settings as-is
   (Build `npm run build`, Install `npm install`).
3. Expand **Environment Variables** and add (for **Production**, and
   **Preview** if you want PR previews to hit the DB):

   | Name | Value |
   |---|---|
   | `NUXT_SUPABASE_URL` | `https://<ref>.supabase.co` |
   | `NUXT_SUPABASE_SERVICE_KEY` | your `service_role` key |

4. **Deploy.**

### Route B - Vercel CLI

```bash
npm i -g vercel          # or use: npx vercel

vercel link              # link to a new/existing Vercel project

# add the secrets (paste the value when prompted)
vercel env add NUXT_SUPABASE_URL production
vercel env add NUXT_SUPABASE_SERVICE_KEY production

vercel --prod            # build + deploy to production
```

---

## Step 2 - Verify the live deployment

```bash
BASE=https://<your-app>.vercel.app

# create a bill through the deployed API
curl -s -X POST "$BASE/api/bills" -H 'content-type: application/json' \
  -d '{"title":"Prod test","participants":[{"name":"A"},{"name":"B"}]}'

# open the returned id in a browser:  $BASE/bill/<id>
```

The row should show up in Supabase → **Table editor → bills**. Open `/` and
create a bill through the UI as a final check.

---

## Notes & gotchas

- **Env vars are server-only.** The Supabase service key is read by Nitro routes
  via `runtimeConfig` - it never ships to the browser. Do **not** prefix them so
  they land in `public`. Names must be exactly `NUXT_SUPABASE_URL` /
  `NUXT_SUPABASE_SERVICE_KEY` (Nuxt maps `NUXT_*` onto `runtimeConfig`).
- **Redeploy after changing env vars** - Vercel bakes them at build time for the
  server bundle; a var change needs a new deployment.
- **No Supabase configured?** The app still boots but uses the in-memory store
  (data resets constantly, and each serverless invocation is isolated), so bills
  will appear to vanish. Always set both env vars in production.
- **Node version:** pinned to `24.x` via `engines` (Vercel retired Node 18/20
  for the functions runtime - 22.x or 24.x are the supported majors). Change it
  there or in Vercel → Project → Settings → Node.js Version.
- **Custom domain:** Vercel → Project → Settings → Domains.
- **Social preview image:** the share card is `public/og.svg` (referenced by the
  OG/Twitter meta). Text previews (title + description) work everywhere. Some
  chat apps - notably WhatsApp - don't render **SVG** preview images, so for a
  guaranteed image, export a **1200×630 PNG** to `public/og.png` and change the
  two `ogImage`/`twitterImage` values in `app/app.vue` from `/og.svg` to
  `/og.png`.
- **Schema changes:** only needed when the `bills` *columns* change - the
  entry/participant shape lives in JSONB and is validated in-app (see
  [supabase-setup.md](./supabase-setup.md)).
