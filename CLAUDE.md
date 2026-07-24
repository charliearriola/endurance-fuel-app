# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project

**Endurance Fuel System** — a web app that sells personalized nutrition plans to
runners, cyclists, swimmers, and triathletes (macro calculators, fueling guides,
race day protocols). Part of the Gas2U product family.

## Stack

- **Framework:** Next.js 14 (App Router, TypeScript, RSC by default)
- **UI:** Tailwind CSS v3 + shadcn/ui (classic `new-york` style, Radix primitives,
  CSS variables for theming, `lucide-react` icons)
- **Auth / DB:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Payments:** Lemon Squeezy — 3 one-time-payment tiers ($15 / $47 / $99)
- **Deployment:** Vercel

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

## Folder Structure

- `app/` — routes (App Router). Keep pages thin; compose them from
  `components/sections/*`.
- `components/ui/` — shadcn/ui primitives (generated via `npx shadcn@2.3.0 add
  <component>` — see note below on CLI version).
- `components/sections/` — landing-page and marketing sections (`hero.tsx`,
  `pricing.tsx`, etc.), one section per file.
- `lib/` — utilities and config. `lib/supabase/client.ts` (browser client),
  `lib/supabase/server.ts` (server client for Server Components/Actions using
  `next/headers` cookies), `lib/pricing.ts` (pricing tier data).
- `types/` — shared TypeScript types (e.g. `PricingTier`).

## Theming

Dark theme only, no light/dark toggle — `<html className="dark">` is set in
`app/layout.tsx` and `app/globals.css` defines a single palette shared by
`:root` and `.dark`. Primary/accent color is orange `#F97316`
(`--primary` / `--accent` in `app/globals.css`, oklch `0.705 0.213 47.604`).
Colors are consumed through Tailwind tokens (`bg-primary`, `text-foreground`,
`border-border`, etc.) defined in `tailwind.config.ts` — never hardcode hex
colors in components, use the semantic token.

## Rules

- **shadcn CLI version is pinned to `2.3.0`.** The `shadcn@latest` CLI now
  defaults to a `base-ui` + Tailwind v4 preset (`@theme`, `@custom-variant`
  CSS-first config) that is incompatible with this project's Tailwind v3
  setup and will break the build. Always run
  `npx shadcn@2.3.0 add <component>` to add new components.
- Supabase clients: use `createClient()` from `lib/supabase/client.ts` in
  Client Components, and from `lib/supabase/server.ts` in Server
  Components/Actions/Route Handlers. Never share one instance across both.
- Env vars live in `.env.local` (gitignored); `.env.example` documents the
  required keys (Supabase + Lemon Squeezy).
- Follow existing section-component conventions: one default export per file
  in `components/sections/`, composed in `app/page.tsx`.
- No test suite or CI is configured yet.
