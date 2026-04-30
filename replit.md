# NO NAME — Brutalist Concept Store

## Overview
React + Vite single-page e-commerce concept site styled with TailwindCSS v4 and shadcn/Radix UI. Routing via `wouter`, data fetching via TanStack Query, animations via Framer Motion. The app is now a fullstack project with an Express + Drizzle/Postgres backend, Replit Auth for sign-in, account-stored cart/addresses, a multi-step checkout, and order-confirmation emails via Replit Mail.

## Tech Stack
- React 19 + TypeScript, Vite 7
- TailwindCSS v4, Radix UI / shadcn-style components
- wouter (router), TanStack React Query, Framer Motion
- Express 5 backend with Drizzle ORM (PostgreSQL via `pg`)
- Replit Auth (OpenID Connect) + Replit Mail
- Concurrently runs frontend (5000) and backend (3001) in dev

## Project Structure
- `src/App.tsx` — App shell, router, providers (QueryClient → Cart → Tooltip)
- `src/pages/` — `home`, `shop`, `product-detail`, `cart`, `checkout`, `order-confirmation`, `account`, `account/orders`, `contact`, `not-found`
- `src/components/` — UI + layout components, including `nav.tsx` with sign-in/account dropdown
- `src/lib/cart.tsx` — Cart context: localStorage when guest, server-synced when authenticated. Merges guest cart into server cart on sign-in.
- `src/lib/products.ts` — Product catalog with sizes/colors
- `src/hooks/use-auth.ts` — Auth hook (queries `/api/auth/user`)
- `shared/models/auth.ts` — Drizzle schema for `users`, `sessions` (Replit Auth required)
- `shared/models/commerce.ts` — Drizzle schema for `addresses`, `cart_items`, `orders` + zod input schemas
- `shared/schema.ts` — Re-exports both models so `db:push` migrates everything
- `server/index.ts` — Dev Express server bound to `127.0.0.1:3001`
- `server/production.ts` — Production server (serves built client + API on `0.0.0.0:5000`)
- `server/db.ts` — Drizzle pool
- `server/storage.ts` — Commerce data access (addresses / cart / orders)
- `server/routes.ts` — REST endpoints: addresses, cart CRUD, checkout, orders
- `server/replit_integrations/auth/` — Replit Auth blueprint (passport OIDC + session store)
- `server/utils/replitmail.ts` — Replit Mail helper for order confirmation emails
- `drizzle.config.ts` — Drizzle Kit config (`schema: shared/schema.ts`)
- `tsconfig.json` — Path aliases `@/*` → `src/*`, `@shared/*` → `shared/*`
- `vite.config.ts` — Vite dev server on `0.0.0.0:5000` with `/api` proxy → `http://localhost:3001`

## API Endpoints (all `/api/*`)
- `GET /api/auth/user` — current user (401 when guest)
- `GET /api/login`, `GET /api/logout`, `GET /api/callback` — Replit Auth flow
- `GET/POST /api/addresses`, `DELETE /api/addresses/:id`
- `GET /api/cart`, `POST /api/cart`, `PATCH /api/cart/:id`, `DELETE /api/cart/:id`, `DELETE /api/cart`
- `POST /api/checkout` — creates an order, clears cart, sends order email via Replit Mail
- `GET /api/orders` — current user's orders

## Replit Setup
- Workflow `Start application` runs `npm run dev` (concurrently starts both `tsx watch server/index.ts` on port 3001 and `vite` on port 5000).
- Backend binds `127.0.0.1:3001` (IPv4) — required because Vite's proxy connects via IPv4 only; binding to `localhost` may resolve IPv6-only on some Node setups.
- Vite proxies `/api` requests to the backend so the frontend uses same-origin `fetch("/api/...")`.

## Database (Postgres)
- Provided via `DATABASE_URL`. Run `npm run db:push` to sync schema.
- Tables: `sessions`, `users`, `addresses`, `cart_items`, `orders`.

## Email (Replit Mail)
- Order confirmation email is sent from the checkout endpoint to the connected Replit account email (the verified address tied to the deployment). No `to` field is supplied — Replit Mail routes it automatically.

## Deployment
- Target: `autoscale`
- Build: `npm run build` (Vite builds the client into `dist/`)
- Run: `npm run start` → `tsx server/production.ts` (Express serves the built client + API on port 5000).
- `SESSION_SECRET` must be set in production. Replit provides it automatically via the auth blueprint.

## Payments
- The checkout payment step is a **placeholder** (Visa / Mastercard / Google Pay buttons + optional reference label). No card numbers are accepted and no real charges are made. Stripe / Shopify integration is deferred until the user upgrades plan.
