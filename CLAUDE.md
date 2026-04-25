# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (auto-builds shared package via postinstall)
pnpm install

# Run all services in development (shared watcher + API on :3000 + web on :5173)
pnpm dev

# Build all packages
pnpm build

# Type-check all packages (no emit)
pnpm lint

# Install Playwright browsers (once, before first E2E run)
pnpm test:e2e:install

# Run Playwright E2E tests (auto-starts all servers)
pnpm test:e2e
```

Per-package (from their directories or with `--filter`):
```bash
pnpm --filter @quiz-app/api dev      # API only
pnpm --filter @quiz-app/web dev      # Web only
pnpm --filter @quiz-app/shared build # Rebuild shared types
```

## Environment Setup

Copy `.env.example` to `.env` in `apps/api/`. The API runs without MongoDB — if `MONGODB_URI` is not set it falls back to an in-memory repository automatically.

Key env vars: `MONGODB_URI`, `DATABASE_NAME`, `PORT` (default 3000), `FRONTEND_URL`, `VITE_API_BASE_URL`, `VITE_SITE_URL`.

The `prebuild` script (`apps/web/scripts/generate-seo-files.mjs`) runs before every `vite build` and generates: `robots.txt`, `sitemap.xml` (using `VITE_SITE_URL`), and PNG assets (`og-image.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`) from the source SVGs. Run it manually with `node apps/web/scripts/generate-seo-files.mjs` after changing `og-image.svg` or `favicon.svg`.

## Architecture

pnpm monorepo with three workspaces:

```
apps/api/     — NestJS backend (port 3000)
apps/web/     — Vue 3 + Vite frontend (port 5173)
packages/shared/ — Shared TypeScript types (Quiz, Question, QuizStatus)
tests/e2e/    — Playwright tests
```

### Shared Package

`packages/shared` exports `Quiz`, `Question` interfaces and `QuizStatus` enum as dual ESM/CJS. Both frontend and backend import from `@quiz-app/shared` — this is the single source of truth for domain types. After editing shared types, the `dev` command keeps it rebuilt via tsup watch; for one-off rebuilds run `pnpm --filter @quiz-app/shared build`.

### Backend (Clean Architecture)

`apps/api/src/modules/quiz/` is organized in three layers:
- **Presentation** (`presentation/`): `QuizController` — HTTP routing only
- **Application** (`application/`): `QuizService` + DTOs — business logic, class-validator validation
- **Infrastructure** (`infrastructure/persistence/`): `MongoQuizRepository` and `InMemoryQuizRepository` both implement the `QuizRepository` interface

`QuizModule` uses a factory provider to select the repository at startup based on whether `MONGODB_URI` is set. Mappers in the infrastructure layer normalize Mongoose documents to domain `Quiz` objects before returning them to the service.

Global `ValidationPipe` is configured with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`.

`apps/api/src/modules/auth/` contains a simple auth module:
- `AuthController` — handles `POST /auth/login`
- `AuthService` — validates hardcoded admin credentials (`admin@quiz.app` / `admin1234`) and returns a user object; no JWT tokens

### Frontend

Vue 3 SFCs with Pinia for state (`useQuizStore` in `stores/`), Vue Router for navigation, and Axios via `services/http.ts`. The API base URL comes from `src/config/env.ts` which reads `VITE_API_BASE_URL`. Quiz API calls live in `services/quiz-api.ts`; auth API calls live in `services/auth-api.ts`; store actions wrap them with loading/error state.

Auth state is stored in `sessionStorage` via `services/auth-session.ts` (`isAuthenticated`, `setAuthenticated`). The router guard in `router/index.ts` redirects unauthenticated users to `/login` for protected routes, and redirects authenticated users away from `/login`.

SEO metadata (title, description, canonical, breadcrumbs) is applied per-route via `services/seo.ts` in a `router.afterEach` hook.

#### Views and Routes

| Route | View | Auth Required |
|-------|------|---------------|
| `/` | `HomeView` (Dashboard) | Yes |
| `/login` | `LoginView` | No (bare layout) |
| `/quizzes` | `MyQuizzesView` | Yes |
| `/create-quiz` | `CreateQuizView` | Yes |
| `/editor` | `QuizEditorView` (new quiz) | Yes |
| `/editor/:id` | `QuizEditorView` (edit quiz) | Yes |

### API Endpoints

| Method | Path | Action |
|--------|------|--------|
| POST | `/auth/login` | Sign in (hardcoded admin) |
| POST | `/api/quizzes` | Create quiz |
| GET | `/api/quizzes` | List all quizzes |
| GET | `/api/quizzes/:id` | Get quiz by ID |
| PATCH | `/api/quizzes/:id` | Update quiz |
| PATCH | `/api/quizzes/:id/publish` | Publish quiz |
| PATCH | `/api/quizzes/:id/unpublish` | Unpublish quiz |
