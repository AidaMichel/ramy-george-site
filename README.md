# Ramy George — website

Real website: **Astro** + **Sanity Studio** (the dashboard) + **Cloudflare Workers**.
Pages are rendered on demand at Cloudflare and read published Sanity content at request time, so dashboard changes appear on the live website without a manual rebuild. Full videos stay on Vimeo / YouTube; the site only carries posters and short muted loops.

```
web/       the public website (Astro)         → Cloudflare
studio/    the dashboard (Sanity Studio)      → free at https://<name>.sanity.studio
tools/     build_seed.py (starter content from the confirmed portfolio data)
.github/   automatic deploys (push, pull request, and every Publish in Sanity)
```

Pages: `/` · `/work/` · `/work/[project]/` · `/info/` (old `/about/` links redirect there) · `/contact/` · 404.

---

## Launch — no Terminal needed (about 30 minutes, all free)

You click and paste; GitHub does the technical work. **Never paste keys or tokens into a chat** — they only go into GitHub's settings page.
Screens on these sites change now and then; if a button has moved, look for the same words nearby.

### Step 1 · Accounts
Create free accounts at **github.com**, **sanity.io** and **cloudflare.com** (ideally with Ramy’s email, so he owns the site).

### Step 2 · Put the code on GitHub
1. Install **GitHub Desktop** and sign in. Unzip `ramy-george-site.zip`.
2. File → *Add local repository* → choose the `ramy-george-site` folder → *create a repository* → keep **Private** ticked → **Publish repository**.
   (Use the app, not drag-and-drop on the website — the website skips the hidden `.github` folder that holds the buttons.)
3. GitHub may start a *Deploy* run straight away; it just says “Website not published yet”. That’s expected.

### Step 3 · Sanity (the dashboard)
1. sanity.io/manage → **Create project** → name `Ramy George` → dataset `production` (public is fine). Copy the **Project ID**.
2. In the project → **API** → **Tokens** → *Add API token*:
   - name `deploy`, permission **Deploy Studio** → copy the token
   - name `starter-content`, permission **Editor** → copy the token (you’ll delete this one after launch)

### Step 4 · Cloudflare (the website)
1. Cloudflare dashboard → **Workers & Pages** → copy your **Account ID** (right-hand side).
2. Profile icon → **My Profile** → **API Tokens** → *Create Token* → template **Edit Cloudflare Workers** → continue → *Create* → copy the token.

### Step 5 · Paste everything into GitHub
Your repository → **Settings** → **Secrets and variables** → **Actions**.

| Tab | Name | Value |
|---|---|---|
| Secrets | `SANITY_DEPLOY_TOKEN` | the Sanity *deploy* token |
| Secrets | `SANITY_WRITE_TOKEN` | the Sanity *starter-content* token |
| Secrets | `CLOUDFLARE_API_TOKEN` | the Cloudflare token |
| Variables | `SANITY_PROJECT_ID` | the Sanity Project ID |
| Variables | `SANITY_STUDIO_HOST` | a name for the dashboard, e.g. `ramygeorge` → `ramygeorge.sanity.studio` |
| Variables | `CLOUDFLARE_ACCOUNT_ID` | the Cloudflare Account ID |

### Step 6 · Press the button
Repository → **Actions** → **Set up dashboard** → **Run workflow** → Run.
In about 3 minutes:
- the dashboard is online at `https://<SANITY_STUDIO_HOST>.sanity.studio` (log in with your Sanity account),
- all the starter content is loaded (if the dashboard already has content, this step skips itself — your edits are never overwritten),
- the website is published at `https://ramy-george.<your-subdomain>.workers.dev` (Actions → *Deploy* shows the address).

If a step turns red, open it — the first line says exactly which setting is missing. If the dashboard name is taken, change
`SANITY_STUDIO_HOST` and run again.

**Then clean up:** delete the `SANITY_WRITE_TOKEN` secret in GitHub and the `starter-content` token in Sanity. They were only needed once.

### Step 7 · Publishing content
No webhook or GitHub token is needed for normal content publishing. Edit in Sanity Studio and press **Publish**. The live website reads the published dataset on the next request; a tiny ~2-second server cache coalesces repeated reads, so changes normally appear within a couple of seconds after refresh.

### Step 8 · Your own domain (optional — the only paid part)
Buy the domain (Cloudflare → *Domain Registration* sells at cost), then in `web/wrangler.jsonc` uncomment `routes` with the domain, and add the
GitHub variable `SITE_URL` = `https://yourdomain.com`. HTTPS is automatic. Check the price before paying.

### Later, optional
- **Invite Ramy:** sanity.io/manage → *Members* → Invite (free plan includes a few seats).
- **Private draft preview:** second webhook like step 7 with projection `{"event_type": "sanity-draft"}` and Drafts **on**; GitHub secret
  `SANITY_READ_TOKEN` (a Sanity *Viewer* token); protect `ramy-george-preview.<subdomain>.workers.dev` with Cloudflare Zero Trust → Access
  (free up to 50 users); set variable `SANITY_STUDIO_PREVIEW_URL` and run *Set up dashboard* again with *Load the starter content* unticked.
- The dashboard redeploys itself whenever `studio/` changes (uses `SANITY_DEPLOY_TOKEN`).

Free-tier notes: requests for static files on Cloudflare Workers are free; a site of this size should sit comfortably inside
Sanity's free plan; GitHub Actions is free at this volume. Nothing here needs a paid plan — if that ever changes (e.g. very large
video uploads to Sanity), check before upgrading. Public or private Sanity dataset both work: for a private one, add the
`SANITY_READ_TOKEN` secret and pass it to the production build step too.

---

## Editing without code (Studio)

Open `https://<name>.sanity.studio`, edit, press **Publish**. The live site reads the new published content directly; refresh after a couple of seconds.
Uploading works the same everywhere: drag a file onto an image/file field, or click *Upload*. The Studio shows each image's size and warns
when a video poster is too small (under 1920×1080, or 720×1280 for vertical).

| I want to… | Where |
|---|---|
| Change the name, *Video Generalist* title or the skills line (first skill is shown bold) | SETTINGS → Site Settings |
| Change the hero text on the right, the *See the work ↓* button, or switch hero mode (Text only · Portrait · Single showcase · Multi-frame · Showreel) | HOME → Hero |
| Rename *Video*, change microcopy, reorder / hide homepage sections | HOME → Homepage Layout → Sections (drag to reorder, toggle *Show*) |
| Change About text / replace portrait / About links | HOME → About |
| Edit the Info page: experience, training & education, *Download CV ↗* | HOME → Info page (drag rows to reorder, + to add) |
| Upload a new CV (PDF) | SETTINGS → Site Settings → CV. The Info page link updates automatically |
| Update email / WhatsApp / LinkedIn, *Let’s talk* text, where the yellow button goes (WhatsApp or Email) | HOME → Contact |
| Footer: location line, back-to-top label, show email (off by default) | SETTINGS → Site Settings → Footer |
| Replace wordmark · favicon · default SEO / share image | SETTINGS → Site Settings |
| Nav labels, order, visibility | SETTINGS → Navigation |
| Rename / reorder / hide a video category | WORK → Video → Categories (drag) |
| Reorder videos inside a category | WORK → Video → *category* (drag) |
| Add a video (quick) | WORK → All Projects → + : Title, Kind *Video*, Category, Organisation, Role, **Poster** (required), Watch link → Publish |
| Add a Motion / AI Gen / Logo Animation piece | WORK → All Projects → + → Kind *Motion*, type, poster, short muted MP4 loop |
| Add a carousel (Posts & Carousels) | WORK → All Projects → + → Kind *Post*, upload slides in order |
| Move a project to another category / change Watch link / replace poster | open the project |
| Separate preview image, hover loop, mobile poster, Two Screens | project → *Advanced ↓* tab |
| Hide / archive a project | project → *Visible* off, or Advanced → Status *Archived* |
| Motion & AI filters (order, labels, visibility) | HOME → Homepage Layout → Motion & AI |
| Add / replace / regroup / reorder logos, change a logo’s size, pick light / official / dark version | CREDIBILITY → group (drag to reorder) |
| Rename or hide a logo group | HOME → Homepage Layout → Clients & Coverage |
| Preview a draft | document menu → *Open preview* (after step 5) |

Safety rules built in: a project with no Watch link shows no Watch button (never a dead link); homepage logos are never links;
a logo without a file is not shown; empty sections (e.g. Motion and Posts before real loops/artwork exist) are hidden; external links always open
in a new tab with `rel="noopener noreferrer"`; internal links never do.

## Local development

```
cd web && npm install && npm run dev        # http://localhost:4321 (uses seed content unless SANITY_PROJECT_ID is set)
npm run build                               # builds + audits every link (fails on dead links)
npx wrangler dev                            # runs the built site on Cloudflare's local runtime (headers, redirects, 404)
cd studio && npm install && npm run dev     # dashboard at http://localhost:3333
```

## Security, privacy, performance

- On-demand HTML rendering on Cloudflare Workers; published content is read from Sanity at request time. No cookies, analytics or trackers.
- Strict Content-Security-Policy (`web/public/_headers`): scripts only from this site, no inline scripts, no `eval`; frames only Vimeo / YouTube-nocookie.
- Vimeo/YouTube players load **only after** the visitor presses *Play here* (no third-party requests on page load).
- Only a read token is ever used at build time (for the private draft preview). No write credentials exist in the website or its build.
- A few KB of JavaScript in total (tabs, carousels, click-to-play); everything else is HTML/CSS. Fonts self-hosted.
- Keyboard: skip link, visible focus, arrow-key tabs and carousels. `prefers-reduced-motion` stops loops and smooth scrolling.

See `LINK-INVENTORY.md` for every destination and what is still needed.
