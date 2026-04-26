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

`apps/api/src/modules/auth/` contains the auth module:
- `AuthController` — handles login, register, refresh, logout, profile, avatar, and Google OAuth endpoints
- `AuthService` — issues JWT access tokens (15 min) and refresh tokens (7 days); seeds an admin account from `AUTH_ADMIN_EMAIL` / `AUTH_ADMIN_PASSWORD` env vars (defaults: `admin@quiz.app` / `admin1234`) on startup; supports Google OAuth via Passport
- Passwords are hashed with `scrypt`. Routes are protected globally by a JWT guard; mark public routes with `@Public()`.

Key auth env vars: `JWT_SECRET`, `AUTH_ADMIN_EMAIL`, `AUTH_ADMIN_PASSWORD`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

### Frontend

Vue 3 SFCs with Pinia for state (`useQuizStore` in `stores/`), Vue Router for navigation, and Axios via `services/http.ts`. The API base URL comes from `src/config/env.ts` which reads `VITE_API_BASE_URL`. Quiz API calls live in `services/quiz-api.ts`; auth API calls live in `services/auth-api.ts`; store actions wrap them with loading/error state.

Auth tokens (access + refresh) are stored in `sessionStorage`. The router guard in `router/index.ts` redirects unauthenticated users to `/login` for protected routes (`requiresAuth: true`), and redirects authenticated users away from `/login` to `/management`.

SEO metadata (title, description, canonical, breadcrumbs) is applied per-route via `services/seo.ts` in a `router.afterEach` hook.

#### Views and Routes

| Route | View | Auth Required |
|-------|------|---------------|
| `/` | `HomeView` (public landing) | No |
| `/about` | `AboutView` | No |
| `/quizzes` | `PublicQuizzesView` (browse published quizzes) | No |
| `/login` | `LoginView` | No |
| `/auth/callback` | `AuthCallbackView` (Google OAuth) | No (bare layout) |
| `/q/:slug` | `PublicQuizLandingPage` | No (bare layout) |
| `/q/:slug/take` | `PublicQuizTakeView` | No (bare layout) |
| `/management` | `ManagementView` (dashboard) | Yes |
| `/management/quizzes` | `MyQuizzesView` | Yes |
| `/management/profile` | `ProfileView` | Yes |
| `/management/account` | `AccountSettingsView` | Yes |
| `/management/password` | `PasswordSettingsView` | Yes |
| `/management/create-quiz` | `CreateQuizView` (new quiz) | Yes |
| `/management/quizzes/:id/questions` | `CreateQuizView` (edit questions) | Yes |
| `/management/editor` | `QuizEditorView` (new quiz) | Yes |
| `/management/editor/:id` | `QuizEditorView` (edit quiz) | Yes |
| `/results` | `ResultQuizPage` (all quiz results) | Yes |
| `/results/:quizId` | `ResultQuizDetailView` (single quiz submissions) | Yes |

Legacy paths (`/quizzes`, `/editor`, `/editor/:id`, etc.) redirect to their `/management/*` equivalents.

### API Endpoints

#### Auth (`/auth`)

| Method | Path | Auth | Action |
|--------|------|------|--------|
| POST | `/auth/login` | Public | Sign in, returns JWT tokens |
| POST | `/auth/register` | Public | Register new account |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | Public | Invalidate refresh token |
| GET | `/auth/me` | Required | Get current user profile |
| PATCH | `/auth/me/avatar` | Required | Update avatar URL |
| GET | `/auth/google/status` | Public | Check if Google OAuth is enabled |
| GET | `/auth/google` | Public | Initiate Google OAuth flow |
| GET | `/auth/google/callback` | Public | Google OAuth callback |

#### Quizzes (`/api/quizzes`)

| Method | Path | Auth | Action |
|--------|------|------|--------|
| GET | `/api/quizzes` | Required | List quizzes for current user |
| GET | `/api/quizzes/public` | Public | List all published quizzes |
| GET | `/api/quizzes/slug/:slug` | Public | Get quiz by slug |
| GET | `/api/quizzes/:id` | Public | Get quiz by ID |
| POST | `/api/quizzes` | Required | Create quiz |
| PATCH | `/api/quizzes/:id` | Required | Update quiz |
| PATCH | `/api/quizzes/:id/publish` | Required | Publish quiz |
| PATCH | `/api/quizzes/:id/unpublish` | Required | Unpublish quiz |
| DELETE | `/api/quizzes/:id` | Required | Delete quiz (204) |
| POST | `/api/quizzes/:id/duplicate` | Required | Duplicate quiz |
| POST | `/api/quizzes/:id/attempts` | Public | Start a quiz attempt |
| POST | `/api/quizzes/:id/attempts/:attemptId/submit` | Public | Submit attempt with answers |
