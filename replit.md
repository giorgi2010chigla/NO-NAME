# NO NAME — Brutalist Concept Store

## Overview
A React + Vite single-page e-commerce concept site styled with TailwindCSS v4 and shadcn/Radix UI components. Routing handled by `wouter`, data fetching via TanStack Query, animations via Framer Motion.

## Tech Stack
- React 19 + TypeScript
- Vite 7
- TailwindCSS v4 (`@tailwindcss/vite`)
- Radix UI / shadcn-style components
- wouter for routing
- TanStack React Query
- Framer Motion

## Project Structure
- `src/App.tsx` — App shell, router, providers
- `src/pages/` — Route components (home, shop, product-detail, cart, contact, not-found)
- `src/components/` — UI + layout components
- `src/lib/` — Cart context, products data, utils
- `public/` — Static assets and product imagery
- `vite.config.ts` — Vite config (host 0.0.0.0, port 5000, allowed hosts open for Replit proxy)

## Replit Setup
- Workflow `Start application` runs `npm run dev` and serves on port 5000.
- Vite dev server binds `0.0.0.0:5000` with `allowedHosts: true` so Replit's proxied preview works.
- The previous `base: "/NO-NAME/"` was removed so the app works at the site root in dev and production.

## Deployment
Configured as a `static` deployment:
- Build: `npm run build`
- Publish dir: `dist`
