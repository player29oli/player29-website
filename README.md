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

Edit `.env.local` if you already know the public site URL, have a form endpoint, or want to enable `/login`.

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
content/default.json   Committed fallback copy for the public site
src/
  app/                 Routes, metadata, Open Graph image, robots, sitemap
  app/login            Unlisted founder sign-in
  app/admin            Content editor (session required)
  app/api/admin        Image upload for the editor
  components/
    admin/             Editor UI
    brand/             Logo lockups and social icons
    layout/            Header, footer, skip link
    sections/          Homepage sections
    ui/                shadcn primitives
  config/site.ts       Env-driven URL, theme colour, form endpoint
  lib/auth             Session cookie, CSRF, rate limit
  lib/content          Schema, store (file or Vercel Blob)
  lib/utils.ts
  styles/motion.css
public/brand/          Web-ready logos and preserved originals
public/uploads/        Local image uploads from the editor
```

## Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and Open Graph. Use the Vercel URL in preview/production, then the custom domain later. |
| `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` | Optional JSON POST endpoint (Formspree, Getform or similar). If empty, the contact form opens a `mailto:` message instead. |
| `ADMIN_EMAIL` | Founder email for `/login`. Must contain `@`. |
| `ADMIN_PASSWORD` | Founder password. At least 8 characters. |
| `AUTH_SECRET` | HMAC secret for the session cookie. At least 16 characters. `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token. Required on Vercel so edits persist across deploys. Locally, omit this and edits go to `.data/content.json`. |

Never commit `.env` or `.env.local`. `.env.example` is safe to commit.

If `ADMIN_EMAIL`, `ADMIN_PASSWORD` or `AUTH_SECRET` is missing, `/login` explains that admin is disabled. It does not show a broken form.

Environments: **local** (developer machine), **preview** (each pull request / branch on Vercel), **production** (`main`).

## Content admin

There is no hosted CMS. Oliver edits the live copy from a first-party editor.

1. Copy `.env.example` to `.env.local`.
2. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (8+ characters) and `AUTH_SECRET` (16+ characters).
3. Restart `npm run dev`.
4. Open **http://127.0.0.1:43129/login** — this address is not linked from the homepage, header, footer or sitemap.
5. After sign-in you land on `/admin`. Change wording, replace images, add / remove / reorder homepage sections, and edit footer details and social links, then **Save changes**.

The **Footer** tab edits:

- Company name (legal name)
- Footer description
- Public email
- Company number
- Registered office
- Copyright prefix
- Privacy link label and URL
- Social links (label + URL) — add, remove and reorder

Public pages only show a social when it has a real URL. LinkedIn, Instagram, X/Twitter, YouTube, TikTok, Facebook and GitHub get a matching icon; anything else uses a generic link icon. Empty or placeholder URLs stay hidden. Do not add profiles that are not live.

The session is an httpOnly cookie (12 hours), SameSite=Lax. Login is CSRF-checked and rate-limited (8 attempts per 15 minutes per IP, in memory). Sign out from the editor.

### How content is stored

| Place | When it is used |
| --- | --- |
| `content/default.json` | Committed fallback. The public site always has the current copy if the store is empty or invalid. |
| `.data/content.json` | Local edits when `BLOB_READ_WRITE_TOKEN` is not set. Gitignored. |
| Vercel Blob (`player29/content.json`) | When `BLOB_READ_WRITE_TOKEN` is set. This is what production on Vercel must use so saves survive deploys and serverless instances. |

Read order: Blob (if configured) → local file → `content/default.json`.

Images uploaded in the editor go to `public/uploads/` locally, or to `player29/uploads/` on Blob in production.

To freeze a published snapshot into git, copy the saved JSON over `content/default.json` and commit it.

### How to add a section type later

Section types are a closed list, not an open page builder. Current types: hero, intro, work, capabilities, approach, about, closing, rich text, media.

1. Add the type to `SECTION_TYPES` in `src/lib/content/schema.ts` and extend the union plus `parse*` / `createSection`.
2. Render it in `src/components/sections/homepage-sections.tsx` (and a section component).
3. Add editor fields in `src/components/admin/admin-fields.tsx`.
4. Add a label in `SECTION_LABELS`.

Do not add a hosted CMS or an unbounded block library.

## How to edit company copy

Use `/login` and the editor for on-page wording, imagery and homepage section order.

Environment-only values stay in `.env.local` / Vercel env (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT`). Theme colour lives in `src/config/site.ts`.

If you prefer a code change instead of the editor, edit `content/default.json` (or the saved `.data/content.json`) and keep the schema in `src/lib/content/schema.ts`.

## How to add future work or case studies

The **Work** section in the editor (and in `content/default.json`) is already shaped for a later case study:

- `name`, `partner`, `status`, `description`, `role`
- `screenshot`, `video`, `launchUrl`, `appStoreUrl`, `caseStudyUrl`

Fill those fields when material is approved. Do not invent metrics, testimonials, users or clients. Do not publish Superclub (or any third-party) names, logos or artwork unless explicitly approved.

## Logo and assets

Brand files live in `public/brand/`. Compact P29 app marks are used for the favicon, Apple touch icon and the mobile header. Full wordmarks are used in the desktop header (light, with 29 badge) and footer (dark).

Uncropped supplied files are kept in `public/brand/originals/`. Live files in `public/brand/` are the same artwork with **empty canvas cropped only** so they scale at header height. Do not redraw the wordmark in CSS or approximate it with a font.

### Limitations of the supplied files

- Wordmarks (`player29-wordmark-light.png`, `player29-wordmark-light-badge.png`, `player29-wordmark-dark.png`) are **opaque RGB canvases** (white or near-black), not transparent. They are placed on matching surfaces: light marks on the white header, the dark mark on the ink footer and Open Graph image. Do **not** run automatic background removal.
- Compact icons are rounded-square app icons. They include a pale or black fill; that fill is part of the artwork. Outer empty canvas was cropped; no alpha was invented.
- Because the wordmarks are not transparent, they will show a rectangular plate if placed on a mismatched colour (for example a light wordmark on a photograph). Export transparent masters from source if you need them on mixed backgrounds.
- The decorative 29 in the hero and closing section is a crop of the 29 badge from the supplied dark wordmark, still on its dark canvas, used only on dark surfaces.

## Important IP and content restrictions

- Live site is **Player29**. Channel29 is historical source material only — it must not appear on the site.
- Do not publish third-party football IP found elsewhere in project files.
- Do not imply that previous employers’ work belongs to Player29.
- Do not add empty blog, careers, team or services pages to look larger.

## GitHub workflow

Canonical remote (private): [player29oli/player29-website](https://github.com/player29oli/player29-website). `main` is conceptually production.

```bash
git remote add github https://github.com/player29oli/player29-website.git
git push -u github HEAD:main
```

Do not commit secrets.

## Deployment (Vercel)

1. Import the GitHub repository in [Vercel](https://vercel.com/new).
2. Framework preset: Next.js. Build command: `npm run build`. Output: default.
3. Set `NEXT_PUBLIC_SITE_URL` to the Vercel URL (for example `https://player29.vercel.app` — that exact subdomain may already be taken).
4. Optionally set `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT`.
5. For the content editor on Vercel: create a Blob store in the project, then set `BLOB_READ_WRITE_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `AUTH_SECRET`. Without the Blob token, saves cannot persist on serverless.
6. Deploy. Preview deployments are created automatically for pull requests. Production tracks `main`.

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
