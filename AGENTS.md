# Project Overview

`quiz-app` is a `pnpm` workspace for a quiz authoring product. It contains a Vue 3 frontend, a NestJS API, a shared TypeScript package for quiz contracts, and Playwright end-to-end coverage.

# Stack Summary

- Package manager: `pnpm` workspace
- Frontend: Vue 3, Vite, TypeScript, Pinia, Vue Router, Axios, Tailwind CSS
- Backend: NestJS, TypeScript, Mongoose, class-validator
- Shared package: `packages/shared`
- End-to-end tests: Playwright

# Local Runtime Defaults

- Web app: `http://localhost:3000`
- API base URL: `http://localhost:3001/api`
- API port: `3001`
- CORS frontend origin: `http://localhost:3000`
- Optional persistence: configure `MONGODB_URI`; otherwise the API uses the in-memory quiz repository.
- Local login fixture: `admin@quiz.app` / `admin1234`

# Repository Structure

- `apps/web`: Vue client app. Main code lives under `apps/web/src`.
- `apps/api`: NestJS API. Main code lives under `apps/api/src`.
- `packages/shared`: shared quiz types and enums consumed by web and API.
- `tests/e2e`: Playwright tests in `tests/e2e/specs`.
- `docs/architecture.md`: short architecture notes.
- `.env.example`: local environment template.

# Coding Conventions

- Follow the existing strict TypeScript setup in `tsconfig.base.json`.
- Use the current style: double quotes, semicolons, and straightforward named imports.
- Keep backend changes aligned with the existing Nest layering inside quiz modules: `presentation`, `application`, `domain`, `infrastructure`.
- Keep frontend changes inside Vue SFCs or `src` modules that match the current Vite/Vue structure.
- Reuse types from `@quiz-app/shared` instead of redefining contracts.
- Treat `lint` in this repo as type-check validation. There is no repo-level ESLint or Prettier config to extend right now.

# Safety Rules

- Prefer editing source files under `apps/*/src`, `packages/shared/src`, and `tests/e2e/specs`.
- For docs-only requests, keep changes scoped to the requested Markdown files.
- Do not hand-edit generated output under `dist/`, dependencies under `node_modules/`, or Playwright output under `tests/e2e/test-results/`.
- Do not introduce new tools, config systems, or architectural layers unless the task explicitly requires them.
- Preserve the in-memory API fallback when `MONGODB_URI` is not configured unless the task is specifically about persistence.
- Avoid changing unrelated docs or application code when the task is limited to Codex/project setup.

# Validation Commands

- `pnpm lint`
- `pnpm build`
- `pnpm test:e2e`

Notes:

- On Windows PowerShell, use `pnpm.cmd` if script execution blocks `pnpm.ps1`.
- `pnpm test:e2e` starts the workspace through Playwright's `webServer` config and is slower than `lint` or `build`.
- For Markdown-only edits, `git diff --check` is usually enough unless the requested change affects runnable examples or commands.

# Expected Final Output

- Summarize what changed in a few sentences.
- List the files you created or modified.
- Report which validation commands were run and their actual result.
- If something was not run or failed, say so plainly and include the relevant reason.
