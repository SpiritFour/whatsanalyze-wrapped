# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WhatsApp Wrapped is a privacy-first web application that analyzes WhatsApp chat exports and generates insights about conversations. All processing happens client-side in the browser—no data is sent to servers. Users can optionally create encrypted share links to securely share their results.

**Stack**: Nuxt 3, Vue 3, TypeScript, Tailwind CSS, Firebase (Firestore for encrypted data storage, Analytics), Chart.js for visualizations.

## Architecture

### Data Flow
1. **Upload & Parse** → User uploads `.txt` or `.zip` WhatsApp export via `Upload.vue` component
2. **Analysis** → `utils/parsing/index.ts` contains the `Parser` class that orchestrates all analyzers
3. **Storage** → Results stored in Pinia store (`store/userDataStore.ts`)
4. **Display** → `pages/results.vue` renders analyzed data with visualizations
5. **Sharing** → Optional encrypted sharing via Firestore + client-side encryption

### Key Modules

- **`utils/parsing/`**: Core analysis logic
  - `index.ts`: `Parser` class that runs analyzers and serializes/deserializes results using Zod
  - `analyzer/*.ts`: Individual analyzers (emoji, word usage, time deltas, messages per month, active dates)
  - `types.ts`: TypeScript types for messages and analysis results
  
- **`utils/sharing/`**: Encrypted sharing functionality
  - `firestore.ts`: Store/retrieve encrypted results from Firestore
  - `crypto.ts`: Client-side encryption/decryption utilities
  - `param.ts`: URL parameter encoding for share links
  
- **`store/`**: Pinia stores
  - `userDataStore.ts`: Main data store, handles saving/loading with encryption
  
- **Pages**: `pages/index.vue` (homepage) and `pages/results.vue` (results display)

- **Firebase**: `modules/firebase.ts` and `plugins/firebase.client.ts` initialize Firebase/Firestore

## Commands

```bash
# Development
pnpm dev              # Start dev server (localhost:3000)

# Building
pnpm build            # Build for production
pnpm generate         # Generate static site
pnpm preview          # Preview production build

# Preparation
pnpm postinstall      # Nuxt preparation (runs automatically after install)
```

## Important Notes

- **No lint/test commands**: This project doesn't have lint or test scripts configured
- **Firebase config**: Credentials are in `nuxt.config.ts` (public Firebase config, safe to commit)
- **SSR disabled**: `ssr: false` in Nuxt config—app renders client-side only for privacy
- **Strict TypeScript**: `strict: true` and `noImplicitThis: true` enabled
- **i18n support**: 5 locales configured (en, de, es, fr, pt) but messages not fully implemented yet
- **Workers**: `assets/workers/parsing.worker.ts` exists but may be used for background parsing tasks

## File Structure

```
frontend/
├── pages/              # Nuxt routes
├── components/         # Vue components (UI, visualizations)
├── utils/
│   ├── parsing/        # Chat analysis logic
│   └── sharing/        # Encryption & Firestore integration
├── store/              # Pinia state management
├── modules/            # Nuxt modules (Firebase)
├── plugins/            # Nuxt plugins
├── assets/             # CSS, images, workers
├── public/             # Static assets (backgrounds, instructions, chat example)
├── nuxt.config.ts      # Nuxt configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── app.vue             # Root component with header/footer
```

## Development Tips

- Chat analysis is performed using the `whatsapp-chat-parser` library
- Messages are filtered to exclude non-author entries (system messages)
- All results are JSON-serializable for easy sharing and storage
- Worker files exist for potential background processing optimization
- Visualization uses Chart.js + vue-chartjs
