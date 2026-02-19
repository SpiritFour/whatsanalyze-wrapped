# Repository Guidelines

## Project Structure & Module Organization
`frontend/` (Nuxt 3 SPA) holds `pages/` (routes), `components/`, `store/` (Pinia), `server/` (API proxies), `utils/`, `types/`, and `i18n/locales/`. Styling sits in `assets/css/` with shared tokens in `tailwind.config.ts`; static files go in `public/`. `modules/firebase/` contains the Firebase wiring. Static builds land in `frontend/.output/public`. Deployments are automated via GitHub Actions (see `.github/workflows/`). Use `frontend/public/chat_example.txt` plus `telegram.js` only for local sample data.

## Build, Test, and Development Commands
- `cd frontend && pnpm install`: install dependencies (pnpm 9+ required by `packageManager`).
- `pnpm dev` (set `NUXT_ENV_LOCAL=1` for local runtime config): hot reload at `http://localhost:3000`.
- `pnpm build`: production build in `.output`.
- `pnpm generate`: create the static export in `.output/public`.

## Nix Flakes
This project uses Nix flakes for development dependencies. When running CLI tools like `stripe`, `gh`, or `firebase`, use the Nix shell:
- `cd functions && nix develop` to enter the shell, or
- `nix develop -c <command>` to run a single command (e.g., `nix develop -c stripe login`).

## Coding Style & Naming Conventions
Author Vue files with `<script setup lang="ts">`, two-space indentation, and PascalCase component filenames for Nuxt auto-imports. Pinia stores use the `useXStore` pattern inside `store/*.ts`, and composables stay near their features (e.g., `utils/analytics.ts`). Favor Tailwind utilities over bespoke CSS—extend shared tokens in `tailwind.config.ts` instead of hard-coding colors. Run `pnpm nuxi lint` to invoke ESLint and `pnpm prettier --write .` before opening a PR.

## Testing Guidelines
There is no automated suite yet, so complete a manual regression each time: run `pnpm dev`, import `frontend/public/chat_example.txt`, verify charts, share links, and locale toggles, and check that encrypted payloads remain client-only. When adding deterministic logic, colocate Vitest specs such as `utils/__tests__/parser.spec.ts` and wire them into a future `pnpm test` to keep coverage expectations explicit.

## Commit & Pull Request Guidelines
Commits follow the existing short, imperative style (`fix ts / ignore`, `emojii podest`). Keep each commit scoped and prefer prefixes like `feat:`, `fix:`, or `chore:` when clarity helps. PRs must include a summary, linked issue or task, screenshots/GIFs for UI work, and explicit “Testing” notes (command + dataset). Call out any configuration or env changes (`NUXT_ENV_LOCAL`, PayPal IDs, Firebase keys) so reviewers can reproduce.

## Security & Configuration Tips
Runtime config derives from `NUXT_ENV_LOCAL`, `BASE_URL`, and secrets such as `SENTRY_AUTH_TOKEN`; inject them via your shell or `.env` and never commit live credentials. Treat uploaded chats as sensitive: avoid logging message contents and clear temporary exports after manual runs.

## Beads Multi-Agent Coordination (Task Locking)

When multiple coding agents run in parallel, use this exact protocol to avoid collisions:

1. **Pick only unassigned work**
   - Use `bd ready --unassigned --json`
   - Do **not** pick items already assigned or `in_progress`

2. **Atomically claim before coding**
   - Use `bd update <issue-id> --claim`
   - This sets assignee + `in_progress` in one step

3. **Announce ownership**
   - Add a start note: `bd comments add <issue-id> "Starting work: <scope>"`
   - Include files/components you plan to touch

4. **One agent = one active task**
   - Never work two tasks concurrently in the same repo
   - Finish or hand off before claiming another

5. **Use merge slot for integration-critical changes**
   - Merge slot exists as `vibecode-merge-slot`
   - Acquire before high-conflict merges/rebases, release after:
     - `bd merge-slot acquire`
     - `bd merge-slot release`

6. **Close the loop**
   - On completion, add result summary + artifact links
   - Update status to `closed` only after acceptance criteria are met

7. **If collision happens anyway**
   - First claimer keeps task
   - Second agent immediately unassigns itself / switches to another unassigned issue
   - Record handoff note in comments

**Important:** `bd ready` intentionally includes both `open` and `in_progress`. For agent picking, always use `--unassigned`.

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
