# Architecture Notes

- `apps/web` contains the Vue 3 client with routing, state management, and API services.
- `apps/api` contains the NestJS service organized into presentation, application, domain, and infrastructure layers.
- `packages/shared` exposes shared quiz contracts to keep frontend and backend in sync.
- `tests/e2e` holds Playwright coverage against the running monorepo stack.
