# Quiz App

`quiz-app` is a `pnpm` workspace for authoring, managing, publishing, and taking quizzes. It combines a Vue 3 frontend, a NestJS API, shared TypeScript contracts, and Playwright end-to-end coverage.

The default local setup runs the web app at [http://localhost:3000](http://localhost:3000) and the API at [http://localhost:3001/api](http://localhost:3001/api). MongoDB is optional: when `MONGODB_URI` is not configured, the API uses in-memory repositories so local development can start without external services.

## Tech Stack

| Area | Stack |
|---|---|
| Frontend | Vue 3, Vite, TypeScript, Pinia, Vue Router, Axios, Tailwind CSS |
| Backend | NestJS, TypeScript, Mongoose, class-validator, Passport, JWT |
| Shared package | TypeScript quiz, auth, configuration, and results contracts |
| Testing | Playwright |
| Package manager | pnpm workspace |

## Workspace Layout

```text
quiz-app/
|-- apps/
|   |-- web/              Vue client app
|   `-- api/              NestJS API
|-- packages/
|   `-- shared/           Shared contracts and enums
|-- tests/
|   `-- e2e/              Playwright tests
|-- docs/
|   `-- architecture.md   Architecture notes
|-- .env.example          Root local environment template
|-- pnpm-workspace.yaml   Workspace package map
`-- README.md
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Optional: copy the root environment template if you want to override defaults or enable MongoDB:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   The web app reads Vite variables from the root `.env`. The API reads `apps/api/.env` first, then the root `.env`, so root values can configure both apps.

3. Install Playwright browsers once before the first e2e run:

   ```bash
   pnpm test:e2e:install
   ```

4. Start the workspace:

   ```bash
   pnpm dev
   ```

5. Open the local services:

   - Web: [http://localhost:3000](http://localhost:3000)
   - API base URL: [http://localhost:3001/api](http://localhost:3001/api)

6. Sign in with the local fixture account:

   - Email: `admin@quiz.app`
   - Password: `admin1234`

## Environment

Key values in the root `.env.example`:

| Variable | Description | Local default |
|---|---|---|
| `MONGODB_URI` | Optional MongoDB connection string. Leave blank for in-memory repositories. | blank |
| `DATABASE_NAME` | MongoDB database name. | `quiz_app` |
| `PORT` | API port. | `3001` |
| `FRONTEND_URL` | CORS origin and OAuth redirect target for the frontend. | `http://localhost:3000` |
| `VITE_API_BASE_URL` | API base URL used by the Vue client. | `http://localhost:3001/api` |
| `VITE_SITE_URL` | Public web origin used for canonical URLs, sitemap, and metadata. | `http://localhost:3000` |
| `JWT_SECRET` | Secret used to sign JWT access tokens. Set a strong value for shared environments. | development fallback |
| `AUTH_ADMIN_EMAIL` | Seeded local admin email. | `admin@quiz.app` |
| `AUTH_ADMIN_PASSWORD` | Seeded local admin password. | `admin1234` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. | blank |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret. | blank |
| `GOOGLE_CALLBACK_URL` | Authorized Google OAuth callback URL. | `http://localhost:3001/api/auth/google/callback` |

`apps/api/.env.example` is available when you only need server-side values, but use the root `.env` for values that must also reach the frontend.

## Authentication

The API issues 15 minute JWT access tokens and 7 day refresh tokens. The Vue auth store keeps the current user, access token, and refresh token in `localStorage`, and the Axios client refreshes expired access tokens when possible.

The local admin account is seeded on API startup if it does not already exist. User registration is available at `POST /api/auth/register`. Google OAuth is enabled when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are configured; otherwise the frontend hides the Google sign-in option based on `GET /api/auth/google/status`.

## Product Functionality

- Sign in with a local account or Google OAuth.
- Register a new account.
- View an authenticated dashboard with quiz activity, status summaries, and recent submissions.
- Browse and manage quizzes in a paginated table with search, filtering, and sorting.
- Create and edit quizzes with setup details, questions, answer options, and correct-answer selection.
- Duplicate, publish, unpublish, and delete quizzes.
- Browse published public quizzes.
- Gate private quizzes behind an access code.
- Take a quiz from a public landing page at `/q/:slug`.
- View all quiz results, per-quiz submissions, and performance statistics.
- Manage profile avatar, subject/domain configuration, and password settings.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Run the shared package watcher, API, and web app together. |
| `pnpm build` | Build all workspace packages that expose a build script. |
| `pnpm lint` | Run workspace package validation scripts. |
| `pnpm test` | Run package test scripts when present. |
| `pnpm test:e2e:install` | Install Playwright browsers. |
| `pnpm test:e2e` | Run the Playwright e2e suite. |

On Windows PowerShell, use `pnpm.cmd` if script execution blocks `pnpm.ps1`.

Per-package examples:

```bash
pnpm --filter @quiz-app/api dev
pnpm --filter @quiz-app/web dev
pnpm --filter @quiz-app/shared build
```

## API Reference

All routes are served under the API base URL `http://localhost:3001/api`.

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Sign in and receive JWT tokens. |
| POST | `/api/auth/register` | Public | Register a new account. |
| POST | `/api/auth/refresh` | Public | Refresh access and refresh tokens. |
| POST | `/api/auth/logout` | Public | Invalidate a refresh token. |
| GET | `/api/auth/me` | Required | Get the current user profile. |
| PATCH | `/api/auth/me/avatar` | Required | Update the current user's avatar URL. |
| GET | `/api/auth/google/status` | Public | Check whether Google OAuth is enabled. |
| GET | `/api/auth/google` | Public | Start the Google OAuth flow. |
| GET | `/api/auth/google/callback` | Public | Complete the Google OAuth flow and redirect to the web app. |

### Quizzes

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/quizzes` | Required | List quizzes for the current user. |
| GET | `/api/quizzes/public` | Public | List all published public quizzes. |
| POST | `/api/quizzes/access-code` | Public | Validate a private quiz access code. |
| GET | `/api/quizzes/slug/:slug` | Public | Get a quiz by slug, with optional `?accessCode=`. |
| GET | `/api/quizzes/results/summary` | Required | Get aggregate result totals for the current user. |
| GET | `/api/quizzes/results/performance` | Required | Get per-quiz performance statistics. |
| GET | `/api/quizzes/results/recent` | Required | Get recent submissions, with optional `?limit=N`. |
| GET | `/api/quizzes/:id/results` | Required | Get submissions for a specific quiz. |
| GET | `/api/quizzes/:id` | Public | Get a quiz by ID. |
| POST | `/api/quizzes` | Required | Create a quiz. |
| PATCH | `/api/quizzes/:id` | Required | Update a quiz. |
| PATCH | `/api/quizzes/:id/publish` | Required | Publish a quiz. |
| PATCH | `/api/quizzes/:id/unpublish` | Required | Unpublish a quiz. |
| DELETE | `/api/quizzes/:id` | Required | Delete a quiz. |
| POST | `/api/quizzes/:id/duplicate` | Required | Duplicate a quiz. |
| POST | `/api/quizzes/:id/attempts` | Public | Start a quiz attempt. |
| POST | `/api/quizzes/:id/attempts/:attemptId/submit` | Public | Submit quiz attempt answers. |

### Configuration

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/configuration` | Required | Get the current user's quiz configuration. |
| PUT | `/api/configuration/subject-domains` | Required | Update subject/domain choices. |

## App Routes

| Route | View | Auth required |
|---|---|---|
| `/` | Home landing page | No |
| `/about` | About page | No |
| `/quizzes` | Browse published quizzes | No |
| `/quizzes/private` | Private quiz access-code entry | No |
| `/login` | Sign in and register | No |
| `/auth/callback` | Google OAuth callback | No |
| `/q/:slug` | Public quiz landing page | No |
| `/q/:slug/take` | Take a quiz | No |
| `/management` | Dashboard | Yes |
| `/management/quizzes` | My Quizzes | Yes |
| `/management/create-quiz` | Create quiz | Yes |
| `/management/quizzes/:id/questions` | Edit quiz questions | Yes |
| `/management/quizzes/results` | All quiz results | Yes |
| `/management/quizzes/results/:quizId` | Single quiz submissions | Yes |
| `/management/me/profile` | Profile settings | Yes |
| `/management/me/configuration` | Subject/domain configuration | Yes |
| `/management/me/account` | Alias for configuration | Yes |
| `/management/me/password` | Password settings | Yes |

Legacy paths `/profile`, `/account`, `/create-quiz`, `/editor`, `/results`, `/results/:quizId`, `/management/results`, `/management/results/:quizId`, `/management/profile`, `/management/configuration`, `/management/account`, and `/management/password` all redirect to their current routes.

## Architecture Notes

- Backend modules follow layered NestJS boundaries: `presentation`, `application`, `domain`, and `infrastructure`.
- Auth, quiz, attempt, and configuration data use MongoDB repositories when `MONGODB_URI` is configured and in-memory repositories otherwise.
- Shared contracts live in `packages/shared` and are consumed by both `apps/web` and `apps/api`.
- The web `prebuild` script generates SEO files and PWA assets before each Vite build.
- Playwright starts the workspace through `tests/e2e/playwright.config.ts` before running e2e specs.

See [docs/architecture.md](docs/architecture.md) for additional architecture notes.
