# Quiz App

## Project overview

`quiz-app` is a production-ready pnpm workspace that combines a Vue 3 quiz authoring frontend, a NestJS backend API, a shared TypeScript contracts package, and Playwright end-to-end coverage. The API uses MongoDB Atlas when `MONGODB_URI` is configured and falls back to an in-memory repository for local-first development so the workspace can start immediately.

## Tech stack

- Frontend: Vue 3, Vite, TypeScript, Pinia, Vue Router, Axios
- Backend: NestJS, TypeScript, Mongoose-compatible schema layer, class-validator
- Shared package: reusable quiz types and enums
- Testing: Playwright
- Monorepo: pnpm workspace

## Project structure

```text
quiz-app/
├─ apps/
│  ├─ web/
│  └─ api/
├─ packages/
│  └─ shared/
├─ tests/
│  └─ e2e/
├─ docs/
├─ .env.example
├─ package.json
├─ pnpm-workspace.yaml
└─ README.md
```

## Setup instructions

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment values if you want MongoDB Atlas persistence:

   ```bash
   copy .env.example .env
   ```

   On macOS or Linux, use `cp .env.example .env` instead.

3. Install Playwright browsers for end-to-end testing:

   ```bash
   pnpm test:e2e:install
   ```

4. Start the workspace:

   ```bash
   pnpm dev
   ```

5. Open the apps:

- Web: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3000/api/quizzes](http://localhost:3000/api/quizzes)

## Scripts

- `pnpm dev` runs the shared package watcher, NestJS API, and Vue frontend together
- `pnpm build` builds all workspace packages
- `pnpm lint` runs type-based lint checks across the workspace
- `pnpm test` runs package test scripts when present
- `pnpm test:e2e:install` installs Playwright browsers on a clean machine
- `pnpm test:e2e` runs the Playwright suite

## API summary

- `POST /api/quizzes`
- `PATCH /api/quizzes/:id`
- `GET /api/quizzes`
- `GET /api/quizzes/:id`
- `PATCH /api/quizzes/:id/publish`
- `PATCH /api/quizzes/:id/unpublish`

## Notes

- Configure `MONGODB_URI` and `DATABASE_NAME` to use MongoDB Atlas in development or production.
- Without `MONGODB_URI`, the API stores data in memory so local startup stays frictionless.
- Set `VITE_API_BASE_URL` if the frontend should target a non-default API origin.
