# AI Project Overview (Deep Dive + Onboarding)

Last updated: 2026-02-19

## 0) Executive summary

This is a Nuxt 3 single-page web app that turns exported WhatsApp chats into story-style insights. Parsing and analytics run locally in-browser (worker-based), with optional encrypted sharing through Firestore. Paid subscription flows are handled through Firebase Cloud Functions + Stripe.

There are effectively two deploy targets:

- Dev/staging-like delivery on Firebase Hosting (`whatsanalyze-wrapped`), including PR previews.
- Production delivery on GitHub Pages via CNAME `wrapped.whatsanalyze.com`.

## 1) Product surfaces and runtime behavior

### Core user journey

1. User opens homepage, uploads `.txt` or `.zip` WhatsApp export.
2. Browser worker parses file and runs analyzers.
3. Results are rendered in story slides (`StoryCarousel` + `Stories/*`).
4. User can generate encrypted share URL:
   - Ciphertext stored in Firestore.
   - Decryption material serialized into URL query params.
5. Recipient opens URL and can decrypt/render the story client-side.

### Monetization journey

1. User gets one free upload (`uploadAccessStore`).
2. Additional uploads trigger subscription paywall.
3. Checkout starts from FE callable to functions.
4. Stripe webhook persists subscription metadata and queues confirmation mail.
5. FE verify page validates subscription and can open Stripe billing portal.

## 2) Repository map (what matters most first)

- `frontend/` — Nuxt 3 SPA (`ssr: false`)
  - `pages/` route entrypoints (`index`, `results`, `subscription/*`)
  - `components/Stories/` story slides
  - `assets/workers/` parser worker implementation
  - `store/` Pinia stores for result, upload gating, subscription state
  - `utils/parsing/` parser orchestration + analyzers
  - `utils/sharing/` encryption + Firestore + URL encoding
  - `plugins/firebase.client.ts` runtime Firebase init
- `functions/` — Firebase Functions TS project
  - `src/stripe/*` checkout/webhook/portal/verify logic
  - `src/mail.ts` queues transactional mail docs in Firestore
  - `src/index.ts` exports callable and HTTP endpoints
- `.github/workflows/` CI/CD automation
- `firebase.json` + `.firebaserc` Firebase deploy topology

## 3) Frontend architecture in detail

### 3.1 App shell and routing

- `frontend/app.vue`
  - sticky nav with locale switch + subscription status
  - footer privacy/open-source sections
- i18n: `@nuxtjs/i18n`, strategy is `prefix` with locales `en/de/es/fr/pt/it`.
- `frontend/pages/index.vue` builds marketing page and upload entrypoint.
- `frontend/pages/results.vue` handles shared-link hydration (`uuid/iv/key`) and story carousel.

### 3.2 Parsing pipeline

- Upload entry: `frontend/components/Upload.vue`
  - validates upload access policy
  - sends file to worker via `sendFile()`
  - routes to results after parse
- Worker plumbing:
  - `frontend/assets/workers/index.ts` (`PromiseWorker` bridge)
  - `frontend/assets/workers/parsing.worker.ts` (runs parser in worker)
- Parser orchestrator: `frontend/utils/parsing/index.ts`
  - input: `.txt` or `.zip` (first matching txt in zip)
  - parser lib: `whatsapp-chat-parser`
  - filters out system messages and restricts results to `getTargetYear()`
  - runs analyzers and returns aggregate result object

### 3.3 Analyzer set

- `emojiAnalyzer.ts` — per-author/global top emojis + max-emoji message
- `wordUsageAnalyzer.ts` — top words + relative shares + longest message
- `timeDeltaAnalyzer.ts` — longest inactivity gap
- `activeDatesAnalyzer.ts` — most active day and ISO week
- `messagesPerMonthAnalyzer.ts` — monthly counts by author
- `firstMessagesAnalyzer.ts` — first message per author
- `emojiOverTimeAnalyzer.ts` — top monthly emoji trends

### 3.4 State model (Pinia)

- `stats` store: parse output, loading state, persisted in session storage
- `userData` store: encrypted share save/load wrappers
- `subscription` store: verified subscription state in local storage
- `uploadAccess` store: one-free-upload flag in local storage

### 3.5 Sharing and crypto

- AES-GCM encryption implemented in browser (`crypto.subtle`)
- Flow:
  1. generate random key + IV
  2. encrypt serialized parser output
  3. store ciphertext doc in Firestore `data/{uuid}`
  4. place `uuid + iv + rawKey` in URL params

Security implication: confidentiality depends on URL secrecy because key material is embedded in URL.

### 3.6 Firebase in frontend

- `frontend/modules/firebase.ts` injects firebase config into runtime config.
- `frontend/plugins/firebase.client.ts` initializes:
  - app
  - firestore
  - functions (optionally emulator on localhost:5001)
  - analytics

## 4) Backend architecture in detail (functions)

### 4.1 Entry points

- `functions/src/index.ts` exports:
  - health/demo callable/http endpoints (`hello`, `helloHttp`)
  - stripe endpoints (`createCheckoutSession`, `getCheckoutSession`, `createCustomerPortal`, `verifySubscription`, `stripeWebhook`)

### 4.2 Stripe callable endpoints

- `createCheckoutSession.ts`
  - validates request origin against `ALLOWED_ORIGINS`
  - creates subscription checkout session with `PRO_PRICE_ID`
  - returns checkout URL
- `getCheckoutSession.ts`
  - used after success redirect to fetch session details
- `verifySubscription.ts`
  - checks Firestore `subscriptions` by `email + subscriptionId`
  - validates `expiresAt`
- `createCustomerPortal.ts`
  - validates user against same lookup
  - creates Stripe billing portal session

### 4.3 Webhook and persistence

- `stripe/webhook.ts` handles signed Stripe webhooks.
- Primary event: `invoice.payment_succeeded`
  - `subscription_create` = first successful payment
  - `subscription_cycle` = renewal
- Persists subscription record in Firestore `subscriptions/{customerId}` with rolling `expiresAt = now + 30 days`.
- On initial subscription, queues confirmation email by writing to Firestore `mail` collection.

### 4.4 Param + secret model

- Secrets via Firebase Secrets Manager:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Non-secret params via `.env.<projectId>` files:
  - `PRO_PRICE_ID`
  - `ALLOWED_ORIGINS`
  - `EMAIL_BASE_URL`
  - `APP_NAME`
  - `STRIPE_PUBLISHABLE_KEY`

## 5) Environment and tooling matrix

### Node versions and package managers

- Root frontend toolchain:
  - `.tool-versions`: Node `24.11.1`
  - `.nvmrc`: `24`
  - frontend uses `pnpm` (`pnpm@9.15.3` pinned)
- Functions:
  - runtime target Node `22`
  - local scripts use `npm`

### Nix shells

- Root `flake.nix`: Node 24 + pnpm + firebase-tools + gh + python.
- `functions/flake.nix`: Node 22 + stripe-cli.
- `.envrc`/`functions/.envrc` use flake shells.

### Firebase project aliases

- `dev` => `whatsanalyze-wrapped`
- `prod` => `whatsanalyze-wrapped-prod`
- default => dev project

## 6) CI/CD and deploy topology (exact behavior)

### 6.1 Shared frontend build action

- `.github/actions/build-frontend/action.yml`
  - sets up pnpm 9 + Node 22
  - installs frontend deps
  - runs static generation (`pnpm run generate`)

### 6.2 Workflows

1. `firebase-hosting-preview.yml`
   - on PR to `production`
   - build with env `dev`
   - deploy preview channel `pr-<number>` (7 days)

2. `firebase-hosting-merge.yml`
   - on push to `production`
   - build with env `dev`
   - deploy to Firebase Hosting live channel for dev project

3. `github-pages-deploy.yml`
   - manual trigger only
   - build with env `prod`
   - deploy static artifact to GitHub Pages

### 6.3 Hosting behavior

- `firebase.json` serves `frontend/.output/public` and rewrites all paths to `index.html`.
- GitHub Pages uses same generated static output and custom domain via root `CNAME` (`wrapped.whatsanalyze.com`).

## 7) Verified public site observations

Reviewed deployed site at `https://wrapped.whatsanalyze.com`:

- Marketing + trust logos sections present.
- Upload entry + privacy claim visible.
- Subscription pricing section live.
- Open-source/GitHub link present.
- Locale-prefixed routing active (`/en/...`).

## 8) Practical local setup runbook (start-here)

### 8.1 Frontend only

1. Enter project root (optionally Nix shell).
2. `cd frontend && pnpm install`
3. `pnpm dev`
4. Open `http://localhost:3000`

### 8.2 Frontend + local functions

1. Start functions emulator in `functions/`:
   - `npm install`
   - `npm run dev`
2. Start frontend with emulator mode in `frontend/`:
   - `pnpm dev_with_functions`

### 8.3 Stripe local testing

1. Start stripe listener forwarding to local webhook endpoint.
2. Ensure webhook secret is set for local function runtime.
3. Trigger test events and verify:
   - `subscriptions` documents update
   - confirmation email doc appears in `mail`

## 9) Data model and storage locations

- Firestore collections used by app/function flows:
  - `data/{uuid}` => encrypted shared result payload
  - `subscriptions/{customerId}` => subscription access records
  - `mail/{autoId}` => email queue entries (extension-driven delivery)

- Browser storage usage:
  - `sessionStorage` => stats/result data
  - `localStorage` => subscription state + free-upload flag

## 10) Known inconsistencies / risks to resolve early

1. Node version drift:
   - local frontend docs/config expect Node 24
   - CI build action uses Node 22

2. Legacy/unused worker file:
   - `frontend/public/worker/fileWorker.js` appears older and likely obsolete relative to TS worker pipeline.

3. Functions setup script mismatch:
   - `functions/scripts/setup-stripe.sh` references `.env.dev` / `.env.prod` templates that are not present.
   - actual env files are project-id based (`.env.whatsanalyze-wrapped*`).

4. Default base URL mismatch possibility:
   - `frontend/nuxt.config.ts` fallback `BASE_URL` uses `https://www.wrapped.whatsanalyze.com`
   - deployed canonical domain is `https://wrapped.whatsanalyze.com`.

5. Sensitive file hygiene:
   - local secret material file exists under `functions/.secret.local`.
   - should stay untracked and rotated if ever exposed.

6. Parser serialization schema:
   - dynamic zod schema currently `z.any()` for analyzer outputs (minimal runtime guarantees).

7. Auth model for subscription verification:
   - verification by `email + subscriptionId` is functional but weak as a long-lived identity model.

## 11) Suggested first-week work plan

### Day 1: Repro + deploy confidence

- Run frontend and functions locally.
- Complete end-to-end test:
  - upload sample chat
  - create share link
  - open share link in clean browser
  - run checkout + verify flow

### Day 2: Configuration hardening

- Align Node versions across docs/local/CI.
- Fix setup script env-template references.
- Confirm all required params/secrets per project are documented in one place.

### Day 3: Security and logging pass

- Remove noisy logs from production-sensitive paths.
- Verify secret files are ignored and not tracked.
- Review Firestore rules / access assumptions (rules not present in repo).

### Day 4+: Code quality and product iteration

- Add targeted tests around parser analyzers.
- Harden share-link and subscription verification edge cases.
- Address stale/legacy files and dead code paths.

## 12) Quick file index for onboarding

Frontend start points:

- `frontend/nuxt.config.ts`
- `frontend/app.vue`
- `frontend/pages/index.vue`
- `frontend/pages/results.vue`
- `frontend/components/Upload.vue`
- `frontend/utils/parsing/index.ts`
- `frontend/utils/sharing/firestore.ts`

Functions start points:

- `functions/src/index.ts`
- `functions/src/stripe/common.ts`
- `functions/src/stripe/createCheckoutSession.ts`
- `functions/src/stripe/webhook.ts`
- `functions/src/stripe/verifySubscription.ts`
- `functions/src/mail.ts`

Deployment start points:

- `.github/workflows/firebase-hosting-preview.yml`
- `.github/workflows/firebase-hosting-merge.yml`
- `.github/workflows/github-pages-deploy.yml`
- `.github/actions/build-frontend/action.yml`
- `firebase.json`
- `.firebaserc`
