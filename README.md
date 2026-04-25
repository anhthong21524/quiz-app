# Quiz App

`quiz-app` is a pnpm workspace for authoring, managing, and publishing quizzes. It combines a Vue 3 frontend, a NestJS API, a shared TypeScript contracts package, and Playwright end-to-end coverage.

The API can use MongoDB when `MONGODB_URI` is configured. Without that value, it falls back to an in-memory quiz repository so local development can start without external services.

## Tech Stack

- Frontend: Vue 3, Vite, TypeScript, Pinia, Vue Router, Axios, Tailwind CSS
- Backend: NestJS, TypeScript, Mongoose, class-validator
- Shared package: TypeScript quiz contracts and enums
- Testing: Playwright
- Package manager: pnpm workspace

## Project Structure

```text
quiz-app/
|-- apps/
|   |-- web/              Vue client app
|   `-- api/              NestJS API
|-- packages/
|   `-- shared/           Shared quiz contracts
|-- tests/
|   `-- e2e/              Playwright tests
|-- docs/
|   `-- architecture.md   Architecture notes
|-- .env.example          Local environment template
|-- pnpm-workspace.yaml   Workspace package map
`-- README.md
```

## Getting Started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment template if you want to override local defaults or use MongoDB:

   ```powershell
   copy .env.example .env
   ```

   On macOS or Linux:

   ```bash
   cp .env.example .env
   ```

3. Install Playwright browsers if you plan to run e2e tests:

   ```bash
   pnpm test:e2e:install
   ```

4. Start the workspace:

   ```bash
   pnpm dev
   ```

5. Open the local apps:

- Web: [http://localhost:3000](http://localhost:3000)
- API quizzes endpoint: [http://localhost:3001/api/quizzes](http://localhost:3001/api/quizzes)

## Environment

The root `.env.example` documents the main runtime values:

- `MONGODB_URI`: optional MongoDB connection string
- `DATABASE_NAME`: MongoDB database name, defaults to `quiz_app`
- `PORT`: API port, defaults to `3001`
- `FRONTEND_URL`: CORS origin for the frontend, defaults to `http://localhost:3000`
- `VITE_API_BASE_URL`: frontend API base URL, defaults to `http://localhost:3001/api`
- `VITE_SITE_URL`: public web origin used for canonical URLs, robots, sitemap, and social metadata

## Authentication

The current API includes a simple login endpoint for local product flows and e2e tests:

- Endpoint: `POST /api/auth/login`
- Email: `admin@quiz.app`
- Password: `admin1234`

The frontend stores this local session in browser storage and protects the main quiz routes.

## Product Functionality

The application currently supports these user-facing flows:

- Sign in with the local admin account.
- View an authenticated dashboard with quiz activity, status summaries, and a continue-editing entry point.
- Browse the My Quizzes screen in list or grid view.
- Search, filter, and sort the My Quizzes display.
- Create a quiz through a guided two-step builder with quiz setup, question navigation, answer options, correct-answer selection, and progress tracking.
- Create or edit a persisted quiz through the editor route.
- Add and remove quiz questions in the editor.
- Add and remove answer options in the editor.
- Select the correct answer option for each editor question.
- Publish or unpublish quizzes through the API endpoints.
- Sign out from the account menu.

## How to Use the Application

1. Start the workspace with `pnpm dev`.
2. Open [http://localhost:3000](http://localhost:3000).
3. Sign in with `admin@quiz.app` and `admin1234`.
4. Use the header navigation to open `My Quizzes` or create a quiz.
5. Use `Create quiz` for the guided quiz-building workflow.
6. Use `/editor` for the API-backed editor that saves quiz title, description, questions, options, and correct-answer indexes.
7. Use `/editor/:id` to edit a quiz that already exists in the API repository.
8. Open the account menu and choose `Sign out` when finished.

## Current Limitations

- Account creation is visible in the auth UI, but it is disabled; use the local admin account.
- Google sign-in and forgot-password controls are placeholders.
- The guided `Create quiz` workflow currently manages its question state in the browser UI and does not submit to the API.
- The My Quizzes screen currently uses seeded display data from `apps/web/src/data/my-quizzes.ts`.
- API-backed quiz creation and editing lives in `/editor` and `/editor/:id`.

## Scripts

- `pnpm dev`: runs the shared package watcher, API, and web app together
- `pnpm build`: builds all workspace packages that expose a build script
- `pnpm lint`: runs type-check validation across the workspace
- `pnpm test`: runs package test scripts when present
- `pnpm test:e2e:install`: installs Playwright browsers
- `pnpm test:e2e`: runs the Playwright suite

On Windows PowerShell, use `pnpm.cmd` if script execution blocks `pnpm.ps1`.

## API Summary

- `POST /api/auth/login`
- `GET /api/quizzes`
- `GET /api/quizzes/:id`
- `POST /api/quizzes`
- `PATCH /api/quizzes/:id`
- `PATCH /api/quizzes/:id/publish`
- `PATCH /api/quizzes/:id/unpublish`

## App Routes

- `/login`: authentication screen
- `/`: authenticated home dashboard
- `/quizzes`: quiz list and management actions
- `/create-quiz`: guided quiz creation flow
- `/editor`: create a quiz in the editor
- `/editor/:id`: edit an existing quiz

## Development Notes

- Reuse shared quiz types from `@quiz-app/shared` in both the web and API packages.
- Backend quiz code is organized by Nest module layers: `presentation`, `application`, `domain`, and `infrastructure`.
- The API keeps an in-memory fallback when MongoDB is not configured.
- Playwright starts the workspace through its `webServer` configuration before running e2e specs.
