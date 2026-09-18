# Player29 Website

Public website for **Player29**, a founder-led UK digital product company that shapes and builds digital products at the intersection of sport, media and technology.

This is a one-page site plus a privacy page. Its job is credibility: someone who meets the company in an email, proposal or conversation should immediately recognise a real, thoughtful product studio.

## Technology stack

- Next.js (App Router) and React
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui (Button, Input, Textarea, Label, Sheet)
- Vercel-ready deployment

## Requirements

- Node.js 20 or later
- npm 10 or later

## Installation

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` if you already know the public site URL or have a form endpoint.

## Development

```bash
npm run dev
```

The app listens on **http://127.0.0.1:43129** (an uncommon port, not 3000).

## Build, start and lint

```bash
npm run build
npm run start
npm run lint
npm run format
npm run format:check
```

## Project structure

```
src/
  app/                 Routes, metadata, Open Graph image, robots, sitemap
  components/
    brand/             Logo lockups
    layout/            Header, footer, skip link
    sections/          Homepage sections
    ui/                shadcn primitives
  config/site.ts       Company details, URLs, contact
  data/content.ts      Page copy and the featured-work content model
  lib/utils.ts
  styles/motion.css
public/brand/          Web-ready logos and preserved originals
```

## Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and Open Graph. Use the Vercel URL in preview/production, then the custom domain later. |
| `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` | Optional JSON POST endpoint (Formspree, Getform or similar). If empty, the contact form opens a `mailto:` message instead. |

Never commit `.env` or `.env.local`. `.env.example` is safe to commit.

Environments: **local** (developer machine), **preview** (each pull request / branch on Vercel), **production** (`main`).

## Logo and assets

Brand files live in `public/brand/`. Compact P29 app marks are used for the favicon, Apple touch icon and the mobile header. Full wordmarks are used in the desktop header (light, with 29 badge) and footer (dark).

Uncropped supplied files are kept in `public/brand/originals/`. Live files in `public/brand/` are the same artwork with **empty canvas cropped only** so they scale at header height. Do not redraw the wordmark in CSS or approximate it with a font.

### Limitations of the supplied files

- Wordmarks (`player29-wordmark-light.png`, `player29-wordmark-light-badge.png`, `player29-wordmark-dark.png`) are **opaque RGB canvases** (white or near-black), not transparent. They are placed on matching surfaces: light marks on the white header, the dark mark on the ink footer and Open Graph image. Do **not** run automatic background removal.
- Compact icons are rounded-square app icons. They include a pale or black fill; that fill is part of the artwork. Outer empty canvas was cropped; no alpha was invented.
- Because the wordmarks are not transparent, they will show a rectangular plate if placed on a mismatched colour (for example a light wordmark on a photograph). Export transparent masters from source if you need them on mixed backgrounds.
- The decorative 29 in the hero and closing section is a crop of the 29 badge from the supplied dark wordmark, still on its dark canvas, used only on dark surfaces.

## How to edit company copy

Almost all visitor-facing wording is in:

- `src/data/content.ts` — homepage copy, navigation, featured work, form labels
- `src/config/site.ts` — legal name, email, LinkedIn, company number, registered office, site URL

The privacy page copy lives in `src/app/privacy/page.tsx`.

## How to add future work or case studies

`featuredWork` in `src/data/content.ts` is already shaped for a later case study:

- `name`, `partner`, `status`, `description`, `role`
- `screenshot`, `video`, `launchUrl`, `appStoreUrl`, `caseStudyUrl`

Fill those fields when material is approved. Do not invent metrics, testimonials, users or clients. Do not publish Superclub (or any third-party) names, logos or artwork unless explicitly approved.

## Important IP and content restrictions

- Live site is **Player29**. Channel29 is historical source material only — it must not appear on the site.
- Do not publish third-party football IP found elsewhere in project files.
- Do not imply that previous employers’ work belongs to Player29.
- Do not add empty blog, careers, team or services pages to look larger.

## GitHub workflow

`main` is conceptually production. Use feature branches and pull requests for changes.

Suggested remote (private): `player29-website`.

If this repository is still on Cursor’s temporary git host, create the GitHub repo and push (Oliver may need to authenticate):

```bash
# Using GitHub CLI, once authenticated
gh auth login
gh repo create player29-website --private --source . --remote github --push

# Or create the empty private repo in the GitHub UI, then:
git remote add github git@github.com:YOUR_USER/player29-website.git
git push -u github main
```

Do not commit secrets.

## Deployment (Vercel)

1. Import the GitHub repository in [Vercel](https://vercel.com/new).
2. Framework preset: Next.js. Build command: `npm run build`. Output: default.
3. Set `NEXT_PUBLIC_SITE_URL` to the Vercel URL (for example `https://player29.vercel.app` — that exact subdomain may already be taken).
4. Optionally set `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT`.
5. Deploy. Preview deployments are created automatically for pull requests. Production tracks `main`.

The first deploy can use the free Vercel URL. HTTPS is automatic.

### Connecting a custom domain later

No rebuild or migration of the site is required.

1. In Vercel → Project → Settings → Domains, add the domain.
2. At the registrar, add the DNS records Vercel shows (usually an A record and/or CNAME).
3. Set that domain as the production domain in Vercel.
4. Update `NEXT_PUBLIC_SITE_URL` to `https://your-domain` (and the same value in `src/config/site.ts` fallback if you still use one).
5. Redeploy production so canonical links, sitemap and Open Graph URLs match.

## Licence

Unpublished. All rights reserved by Player29 Ltd.
