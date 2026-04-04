# Articys Template

A monorepo starter with Better Auth, TanStack Router, Hono server, and Stripe-backed billing.

## Requirements

- `pnpm` 10+
- `bun`
- PostgreSQL
- Stripe account

## Quick start

```bash
pnpm install
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
pnpm db:push
pnpm dev
```

## Environment

### `apps/web`

```env
VITE_SERVER_URL=http://localhost:3000
```

### `apps/server`

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/articys
BETTER_AUTH_SECRET=<32+ chars>
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
NODE_ENV=development
PORT=3000
```

Optional: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `REDIS_URL`, `LOG_LEVEL`

## Commands

- `pnpm dev` - start both apps
- `pnpm dev:web` - web only
- `pnpm dev:server` - server only
- `pnpm build`
- `pnpm check-types`
- `pnpm db:push` / `pnpm db:generate` / `pnpm db:migrate` / `pnpm db:studio`
- `pnpm --filter web test`
- `pnpm --filter server test`
