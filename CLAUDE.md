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
- **Payments:** Lemon Squeezy — Free / Race Day Kit ($15 one-time) / Starter
  ($9 mo · $54 yr) / Pro ($19 mo · $114 yr)
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
  `next/headers` cookies), `lib/supabase/middleware.ts` (session-refresh +
  route-protection logic used by root `middleware.ts`), `lib/pricing.ts`
  (pricing tier data).
- `types/` — shared TypeScript types (`PricingTier`, `Profile`, and the
  `Sport`/`ExperienceLevel`/`Goal`/`Sex`/`PlanType` unions — keep these in
  sync with the CHECK constraints in `supabase/migrations/0001_profiles.sql`).
- `supabase/migrations/` — hand-written SQL, applied manually via the
  Supabase SQL Editor (no Supabase CLI/project link set up). When the schema
  changes, add a new numbered migration file rather than editing an applied
  one.
- `middleware.ts` — refreshes the Supabase session on every request and
  redirects unauthenticated visitors away from `/dashboard` and
  `/onboarding` (see `PROTECTED_PREFIXES` in `lib/supabase/middleware.ts`).

## Theming

Dark theme only, no light/dark toggle — `<html className="dark">` is set in
`app/layout.tsx` and `app/globals.css` defines a single palette shared by
`:root` and `.dark`. Primary/accent color is orange `#F97316`
(`--primary` / `--accent` in `app/globals.css`, oklch `0.705 0.213 47.604`).
Colors are consumed through Tailwind tokens (`bg-primary`, `text-foreground`,
`border-border`, etc.) defined in `tailwind.config.ts` — never hardcode hex
colors in components, use the semantic token.

## Auth & onboarding flow

- Signup (`app/auth/signup`) → email confirmation (if enabled on the Supabase
  project) → `app/auth/callback` exchanges the code for a session →
  `/onboarding` → on completion redirects to `/dashboard`.
- A Postgres trigger (`handle_new_user` in the migration) auto-creates a bare
  `profiles` row the moment `auth.users` gets a new row, so app code only
  ever `UPDATE`s `profiles`, never `INSERT`s. `onboarding_completed_at` is
  the gate: null means the wizard hasn't been finished, and both
  `/dashboard` (page-level check) and `login()` (`app/auth/actions.ts`) use
  it to decide whether to send the user to `/onboarding` or `/dashboard`.
- All auth mutations (`signup`, `login`, `logout`) are Server Actions in
  `app/auth/actions.ts` — errors are surfaced via a `?error=` search param
  redirect rather than thrown, since a thrown error can't cross a Server
  Action boundary back to a form.

## Rules

- **`NEXT_PUBLIC_SUPABASE_URL` must end in `.supabase.co`, never `.supabase.com`.**
  This has already been a real bug once — the two look identical at a
  glance and the `.com` typo fails silently until the first live request.
  If auth calls start timing out or erroring, check this first.
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
