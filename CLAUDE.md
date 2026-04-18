# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Maison MK** is a luxury hotel consulting landing page for Kenza. It is a static single-page site deployed on GitHub Pages. The target stack documented in `README.md` is Vercel + Supabase + Vanilla JS (the "Zero Cost Golden Stack"), but the current production deployment is GitHub Pages.

## Architecture

```
docs/          → Static files deployed to GitHub Pages (the live site)
  index.html   → Single-page app, sections: Hero, Manifeste, Piliers, Contact
  styles.css   → All styles
  app.js       → All client-side logic (i18n, form, scroll reveals)
server.js      → Node.js + SQLite local dev server (NOT deployed — GitHub Pages only)
role prompt/   → AI agent system prompts for prompting Claude in specific roles
```

**Two separate backends exist:**
- **Production** (`docs/app.js`): form POSTs to `/api/contact` via fetch, intended for Vercel Serverless Functions. Supabase credentials are currently placeholders (`VOTRE_URL` / `VOTRE_KEY`).
- **Local dev** (`server.js`): Node.js HTTP server with SQLite (`kenzah.db`), exposes `/api/contact`, `/api/hotels`, and static file serving from `./public/`.

## Commands

```bash
# Local dev server (uses SQLite, serves from ./public/)
npm start          # node server.js → http://localhost:3000

# The live site (docs/) has no build step — edit files directly
# Open docs/index.html in a browser or serve with any static server:
npx serve docs
```

**Deployment**: pushing to `main` triggers `.github/workflows/deploy.yml` which uploads `./docs` to GitHub Pages automatically.

## Key Patterns

### i18n (FR/EN)
All user-facing strings live in the `translations` object in `app.js`. HTML elements use `data-i18n="key.path"` attributes; `translationsApply(lang)` walks the DOM and sets `textContent`. Elements needing HTML content use `data-i18n-html="key.path"`.

### Scroll Reveals
Elements with `[data-reveal]` are observed by an `IntersectionObserver`. When 12% visible, the class `is-visible` is added (CSS handles the transition).

### Form Submission
`handleSubmit` in `app.js` validates fields, formats the phone via `window.iti` (intl-tel-input), then POSTs JSON to `/api/contact`. The `server.js` endpoint expects `{ name, email, phone, company, message }`.

### CDN Dependencies
Loaded in `index.html` — no bundler:
- `@supabase/supabase-js@2`
- `intl-tel-input@19.5.6`
- Google Fonts (Inter)

## Design Constraints (from README "Constitution")

- **Zero Cost**: no paid services. Use Vercel Hobby + Supabase Free + Google Gemini Free Tier.
- **Aesthetic**: "Silence & Luxe" — timeless, stripped-back, no visual noise.
- **Tone**: French primary, English secondary. Luxury hospitality vocabulary. Never casual.

## AI Role Prompts

`role prompt/` contains system prompts for four distinct AI personas used when prompting Claude for work on this project:
- `ROLE_ARCHITECT.md` — infrastructure/SQL/Mermaid diagrams, zero-cost validation
- `ROLE_BUILDER.md` — pixel-perfect frontend implementation
- `ROLE_EXPERT.md` — Michelin standard tone/style guardian
- `ROLE_STRATEGIST.md` — business strategy

When working on a specific concern, prefix your prompt with the matching role context.
