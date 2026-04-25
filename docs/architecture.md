# Architecture Notes

`quiz-app` is organized as a pnpm workspace with separate packages for the browser client, API, shared contracts, and end-to-end tests. The main design goal is to keep quiz data contracts consistent across the stack while allowing the API to run with or without MongoDB.

## Workspace Boundaries

- `apps/web` owns the Vue 3 user experience, routing, local session handling, Pinia state, and HTTP service wrappers.
- `apps/api` owns the NestJS API, request validation, quiz use cases, authentication fixture, and persistence selection.
- `packages/shared` owns cross-package TypeScript contracts such as `Quiz`, `Question`, and `QuizStatus`.
- `tests/e2e` owns Playwright coverage against the running workspace.

## Runtime Flow

```text
Browser
  -> Vue Router protected routes
  -> Pinia quiz store
  -> Axios service modules
  -> NestJS controllers under /api
  -> Application services
  -> QuizRepository interface
  -> MongoDB repository or in-memory repository
```

The web app runs on `http://localhost:3000`. The API runs on `http://localhost:3001` and exposes routes under the global `/api` prefix.

## Frontend

The Vue app keeps route-level screens under `apps/web/src/views` and shared UI under `apps/web/src/components`.

- `src/router/index.ts` defines authenticated routes and redirects unauthenticated users to `/login`.
- `src/services/auth-session.ts` stores the local authenticated state in `sessionStorage`.
- `src/services/http.ts` creates the Axios client from `VITE_API_BASE_URL`, falling back to `http://localhost:3001/api`.
- `src/services/quiz-api.ts` contains the quiz HTTP calls.
- `src/stores/quizzes.ts` centralizes quiz loading, saving, publishing, and unpublishing state.

Views should call stores or service modules instead of hardcoding API requests directly in templates.

## Backend

The API uses NestJS modules and keeps quiz behavior split by layer:

- `presentation`: controllers and HTTP route definitions.
- `application`: use-case services and DTO validation boundaries.
- `domain`: repository interfaces and domain-facing data contracts.
- `infrastructure`: persistence implementations, schemas, and mappers.

`QuizController` exposes quiz CRUD and status routes. `QuizService` coordinates repository calls and translates missing quizzes into `NotFoundException`.

The auth module currently provides a simple local login fixture at `POST /api/auth/login` for product flow and e2e coverage.

## Persistence

The quiz module binds the `QUIZ_REPOSITORY` token at startup:

- If `MONGODB_URI` is configured, `MongoQuizRepository` connects with Mongoose and stores quizzes in the `quizzes` collection.
- If `MONGODB_URI` is missing, `InMemoryQuizRepository` stores quizzes in a process-local map.

This fallback is intentional. It keeps local development and Playwright startup lightweight, so changes should preserve it unless persistence is the focus of the task.

## Shared Contracts

`packages/shared` is the source of truth for quiz contracts used by both the web and API. New quiz fields, enum values, or contract changes should start there, then flow into API DTOs, persistence mapping, frontend forms, and e2e assertions as needed.

## Validation and Tests

`pnpm lint` is type-check validation across workspace packages. `pnpm build` verifies build output for packages with build scripts. `pnpm test:e2e` runs Playwright and starts the workspace through `tests/e2e/playwright.config.ts`.

For architecture-sensitive changes, prefer validating at the narrowest useful level first, then run the broader workspace commands when contracts, routing, persistence, or user flows are affected.
