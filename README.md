# Articys Template

Articys is a monorepo starter with a real application seam already in place: Better Auth for sessions, a TanStack Router web app, a Hono server, and a Stripe-backed billing module that gates todo creation by subscription status.

## Latest updates

- Web billing frontend: checkout, customer portal access, and billing success or cancel routes.
- Stripe billing backend: billing customers, subscriptions, webhook handling, and status endpoints.
- Subscription-aware todos: free users are capped, the dashboard shows usage, and upgrade prompts are wired into the flow.
- Web shell polish: responsive header improvements, updated auth layout, and wider shared containers.

## Repo layout

- `apps/web`: Vite + React 19 + TanStack Router frontend.
- `apps/server`: Bun + Hono backend with Better Auth, Drizzle, and Stripe support.

## Requirements

- `pnpm` 10+
- `bun`
- PostgreSQL
- Stripe account and price IDs
- Resend account if you want email delivery instead of local/dev behavior

## Getting started

1. Install dependencies with `pnpm install`.
2. Create the required environment files for `apps/server` and `apps/web`.
3. Run database migrations or push the schema.
4. Start the web and server apps.

```bash
pnpm install
pnpm db:push
pnpm dev
```

Useful alternatives:

- `pnpm dev:web`
- `pnpm dev:server`
- `pnpm build`
- `pnpm check-types`

## Environment

### `apps/web`

```env
VITE_SERVER_URL=http://localhost:3000
```

### `apps/server`

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/articys
BETTER_AUTH_SECRET=replace-with-at-least-32-characters
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
RESEND_API_KEY=re_... # optional
EMAIL_FROM=noreply@example.com # optional
EMAIL_REPLY_TO=team@example.com # optional
REDIS_URL=redis://localhost:6379 # optional
NODE_ENV=development
LOG_LEVEL=info
PORT=3000
HOST=0.0.0.0
```

## Database

The billing work added Drizzle schema and migration files under `apps/server/src/infrastructure/database`. Use one of:

- `pnpm db:push` for local schema sync
- `pnpm db:generate` to generate a migration
- `pnpm db:migrate` to apply migrations
- `pnpm db:studio` to inspect data

## What the template already covers

- Protected auth flow with register, login, password reset, and email verification screens
- Feature-first web modules for auth, billing, and todos
- Billing status and plan-aware dashboard behavior
- Server-side billing module with ports, use cases, repositories, and Stripe integration
- Shared app configuration for billing redirect URLs

## Testing

- Web tests: `pnpm --filter web test`
- Server tests: `pnpm --filter server test`

## Notes

Stripe checkout and portal flows require valid Stripe credentials and configured monthly or yearly price IDs. Email sending requires Resend credentials if you want production-style auth emails.
