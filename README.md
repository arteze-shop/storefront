# Arteze Storefront

The Arteze shop's storefront is built on top of [Saleor's Paper Storefront](https://github.com/saleor/storefront) and extremely modified to match our brand along with custom integrations.

---

## ⚡ The Core Tech Stack

- **Next.js 16** with App Router and Server Components
- **React 19** with the latest concurrent features
- **TypeScript** in strict mode—your IDE will thank you
- **Tailwind CSS** with design tokens (OKLCH colors, CSS variables)
- **GraphQL Codegen** for type-safe Saleor API calls

---

## Quick Start

### 1. Get the Saleor Backend

**Option A:** Free [Saleor Cloud](https://cloud.saleor.io/?utm_source=storefront&utm_medium=github) account (recommended)

**Option B:** [Run locally with Docker](https://docs.saleor.io/docs/3.x/setup/docker-compose) or using the Arteze docker backend setup from this [repo](https://github.com/arteze-shop/backend)

### 2. Clone & Configure

```bash
# Using Saleor CLI (recommended)
npm i -g @saleor/cli@latest
saleor storefront create --url https://{YOUR_INSTANCE}/graphql/

# Or manually
git clone https://github.com/arteze/storefront.git
cd storefront
cp .env.example .env

pnpm install

# Optional — wire agent skills for Cursor (see "For AI Agents" below)
pnpm skills:bootstrap

```

Edit `.env` with your Saleor instance details:

```bash
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel # Your Saleor channel slug
```

**Multi-channel** (recommended — explicit allowlist):

```bash

STOREFRONT_CHANNELS=us,uk,eu
NEXT_PUBLIC_DEFAULT_CHANNEL=us
NEXT_PUBLIC_STOREFRONT_LOCALES=en,pl,de,fr,fi,nb # URL locale slugs
SALEOR_APP_TOKEN=... # Server-side only — footer currency selector metadata
```

> **Finding your channel slug:** In Saleor Dashboard → Configuration → Channels → copy the slug

> **Note:** `SALEOR_APP_TOKEN` alone no longer auto-discovers every Saleor channel. Set `STOREFRONT_CHANNELS` or opt in with `STOREFRONT_DISCOVER_CHANNELS=true` (see [Environment Variables](#environment-variables)).

### 3. Run

```bash
pnpm dev
```

Open [localhost:3000](http://localhost:3000). That's it.

---

## Development

### Commands

```bash
pnpm dev # Start dev server
pnpm build # Production build
pnpm run generate # Regenerate GraphQL types (storefront)
pnpm run generate:checkout # Regenerate GraphQL types (checkout)
```

### Project Structure

```
src/
├── app/ # Next.js App Router
│ ├── (storefront)/[locale]/[channel]/ # Browse, cart, account
│ └── (checkout)/checkout/ # Checkout route (/checkout)
├── messages/ # next-intl UI strings (per locale)
├── session-bridge/ # @paper/session-bridge — storefront ↔ checkout handoff
├── checkout/ # Checkout UI, providers, payment registry (GraphQL via server actions)
├── graphql/ # GraphQL queries
├── gql/ # Generated types (don't edit)
├── lib/ # Server utilities & cached data layer
│ ├── catalog/ # getCategoryData, getCollectionData, getFeaturedProducts
│ ├── menus/ # getNavbarMenuItems, getFooterMenuItems
│ ├── channels/ # getCachedChannelsList
│ ├── cache-manifest.ts # Tag registry + cacheLife mapping
│ └── cache-life-profiles.ts
├── ui/components/ # UI components
│ ├── account/ # Customer profile & address book
│ ├── pdp/ # Product detail page
│ ├── plp/ # Product listing page
│ ├── cart/ # Cart drawer
│ └── ui/ # Primitives (Button, Badge, etc.)
└── styles/brand.css # Design tokens
```

### For AI Agents

If you're working with AI coding assistants, point them to:

- **`AGENTS.md`** — Architecture, commands, gotchas
- **`skills/saleor-paper-storefront/`** — 21 project-specific rules (GraphQL, caching, i18n, checkout, etc.)
- **`skills/saleor-paper-storefront/references/code-conventions.md`** — File naming, exports, imports
- **[saleor/agent-skills](https://github.com/saleor/agent-skills)** — Universal Saleor patterns and optional community skills

After clone, wire skills for Cursor discovery (repo-root `skills/` is not scanned automatically):

```shell
pnpm skills:bootstrap
```

Symlinks the project skill into `.agents/skills/`, then runs `npx skills experimental_install` from `skills-lock.json`. Do **not** run `npx skills add . --skill saleor-paper-storefront` — it copies a drifting snapshot.

### Environment Variables

```env
# Required
NEXT_PUBLIC_SALEOR_API_URL=https://your-instance.saleor.cloud/graphql/
NEXT_PUBLIC_DEFAULT_CHANNEL=default-channel # Fallback channel; root "/" redirects here
# Multi-channel (recommended)
STOREFRONT_CHANNELS=us,uk,eu # Comma-separated allowlist — routes, revalidation, footer
# Optional
NEXT_PUBLIC_STOREFRONT_URL= # Canonical URLs and OG images
NEXT_PUBLIC_DEFAULT_LOCALE=en # Default URL locale slug
NEXT_PUBLIC_STOREFRONT_LOCALES=en,pl,de,fr,fi,nb # Enabled locale slugs
REVALIDATE_SECRET= # Manual cache invalidation (GET /api/revalidate)
SALEOR_WEBHOOK_SECRET= # Webhook HMAC verification
SALEOR_APP_TOKEN= # Server-side: footer channel metadata (never exposed to client)
STOREFRONT_DISCOVER_CHANNELS=true # Opt-in: discover ALL active Saleor channels from API
# (not recommended when Saleor has many channels; prefer STOREFRONT_CHANNELS)
# Storefront blog cms: sanity
SANITY_PROJECT_ID=
# The Ziina app must be installed and configured (with a channel config) in Saleor Dashboard.
NEXT_PUBLIC_ENABLE_ZIINA_PAYMENTS=true
ENABLE_ZIINA_PAYMENTS=true
```

**Channel resolution order** (`getStorefrontChannelSlugs`):

1. `STOREFRONT_CHANNELS` — explicit allowlist _(recommended)_
2. `STOREFRONT_DISCOVER_CHANNELS=true` + `SALEOR_APP_TOKEN` — all active channels from API
3. `NEXT_PUBLIC_DEFAULT_CHANNEL` only — single-channel storefront

---

## Payments

Arteze uses [Ziina](https://ziina.com/) as it's payment provider. Built as a new app which you can find in the extensions repo [here](https://github.com/arteze-shop/extensions).

Once added in the backend via the dashboard it can be activated by adding the API Key and setting `TEST|LIVE` options. After that just add the necessary env variables as described above and the checkout payments will be integrated.

You can also use dummy checkout payments and more info on that can be found in Saleor's docs.

---

## Blog

Arteze uses [Sanity](https://www.sanity.io/) for it's blog content. Our repo setup can be found [here](https://github.com/arteze-shop/studio).

Clone Sanity's `studio` outside this repo, run the dev server and add the env variables as shown in `.env.example`. For more info on setting up Sanity go through their [docs](https://www.sanity.io/docs?ref=navbar).
