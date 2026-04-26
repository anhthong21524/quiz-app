# Web `src` Folder Structure

The Vue frontend source code lives in `apps/web/src`. This folder contains the app entry point, route-level pages, reusable components, state stores, API clients, and shared frontend utilities.

## Top-Level Files

- `main.ts` initializes the Vue app, installs app plugins such as Pinia and Vue Router, and mounts the app into the page.
- `App.vue` is the root Vue component. It owns the top-level app shell and renders routed views.
- `styles.css` contains global styles and Tailwind CSS setup.
- `env.d.ts` provides TypeScript declarations for Vite client environment types.

## Folders

### `components`

Reusable Vue components used across pages and features.

This folder includes global UI pieces such as headers, tables, modals, loading indicators, stat cards, and toast lists. It also contains feature-specific component groups:

- `create-quiz` for quiz creation UI.
- `editor` for quiz question editing UI.
- `feedback` for error and empty states.
- `forms` for reusable form fields and validation display.
- `loading` for skeleton/loading components.
- `my-quizzes` for quiz list, grid, table, pagination, and actions.
- `results` for quiz performance, submissions, filters, and result detail UI.
- `settings` for account/settings page layout pieces.

### `composables`

Reusable Vue Composition API logic.

Use this folder for shared behavior that can be imported into components or views, such as global loading state, toast notifications, and retryable request handling.

### `config`

Frontend configuration derived from environment variables or local constants.

The current `env.ts` file centralizes environment-based values so API URLs and runtime settings are not scattered across components.

### `data`

Static or local frontend data used by views and components.

This is useful for display-ready data, fixtures, or local datasets that do not belong in API service modules.

### `lib`

Shared frontend utilities that are not tied to Vue component rendering.

Current subfolders include:

- `api` for API error handling helpers.
- `validation` for auth validation schemas, validators, and error normalization.

### `router`

Vue Router configuration.

This folder maps URL paths to route-level views and defines navigation behavior for the web app.

### `services`

Frontend service layer for API and browser-facing integrations.

This includes the shared HTTP client, auth API calls, quiz API calls, public quiz API calls, and SEO helpers. Components and stores should call these service modules instead of building raw HTTP requests directly.

### `stores`

Pinia stores for frontend state.

Use this folder for state that needs to be shared across components or routes, such as authentication, quiz lists, and active quiz attempts.

### `views`

Route-level Vue pages.

Views are the main screens connected to the router, such as home, login, profile, quiz creation, quiz management, public quiz taking, settings, and result pages. Views compose smaller pieces from `components`, call `stores` or `services`, and represent full user workflows.

## Practical Rule of Thumb

- Put full pages in `views`.
- Put reusable UI pieces in `components`.
- Put shared reactive logic in `composables`.
- Put app-wide state in `stores`.
- Put HTTP/API calls in `services`.
- Put validation, error helpers, and other plain TypeScript utilities in `lib`.
- Put route definitions in `router`.
- Put environment-derived settings in `config`.
