# API `src` Folder Structure

The NestJS backend source code lives in `apps/api/src`. This folder contains the app entry point, the root module, and all feature modules organized by domain.

## Top-Level Files

- `main.ts` bootstraps the NestJS application, applies global pipes (`ValidationPipe`), enables CORS, and starts the HTTP server on the configured port.
- `app.module.ts` is the root module. It imports all feature modules and wires together global configuration such as the MongoDB connection.

## Folders

### `modules`

All feature code lives here, one subfolder per domain. Each module follows the same clean architecture layering described below.

---

#### `modules/auth`

Handles user authentication and identity.

- `auth.controller.ts` exposes HTTP endpoints for login, register, refresh, logout, profile, avatar, and Google OAuth.
- `auth.service.ts` implements business logic: JWT token issuance (access 15 min / refresh 7 days), password hashing with `scrypt`, admin account seeding, and Google OAuth integration.
- `auth.module.ts` wires the controller, service, strategies, guards, and repository together.
- `google-oauth.config.ts` holds Passport Google OAuth2 strategy configuration.

Sub-folders:

- `decorators` — custom NestJS decorators, e.g. `@Public()` to opt routes out of the global JWT guard.
- `dto` — request body classes validated by `class-validator` (`LoginDto`, `RegisterDto`, `RefreshTokenDto`, `UpdateAvatarDto`).
- `guards` — `JwtAuthGuard` (global) and `GoogleAuthGuard` (OAuth flow).
- `strategies` — Passport strategies: `JwtStrategy` and `GoogleStrategy`.
- `infrastructure/persistence` — repository interface (`user.repository.ts`), Mongoose schema (`user.schema.ts`), and two implementations: `MongoUserRepository` and `InMemoryUserRepository`.

---

#### `modules/quiz`

Handles quiz management, publishing, and attempt submission.

Sub-folders follow strict clean architecture layers:

- **`application`** — business logic and DTOs.
  - `quiz.service.ts` manages quiz CRUD, publishing, duplication, and slug generation.
  - `attempt.service.ts` manages starting and submitting quiz attempts.
  - `dto/` contains request/response classes: `CreateQuizDto`, `UpdateQuizDto`, `QuestionDto`, `CreateAttemptDto`, `SubmitAttemptDto`.

- **`domain`** — pure domain interfaces, no framework dependencies.
  - `quiz.repository.ts` defines the `QuizRepository` interface.
  - `attempt.repository.ts` defines the `AttemptRepository` interface.
  - `quiz-attempt.ts` defines the `QuizAttempt` domain type.

- **`infrastructure/persistence`** — data access implementations.
  - `quiz.schema.ts` and `quiz-attempt.schema.ts` define the Mongoose schemas.
  - `mongo-quiz.repository.ts` and `mongo-attempt.repository.ts` implement the domain interfaces against MongoDB.
  - `in-memory-quiz.repository.ts` and `in-memory-attempt.repository.ts` are used as fallbacks when `MONGODB_URI` is not set.
  - `mappers.ts` converts Mongoose documents to plain domain objects before they reach the service layer.

- **`presentation`** — HTTP layer only.
  - `quiz.controller.ts` maps HTTP routes to service calls. Contains no business logic.

- `quiz.module.ts` uses a factory provider to select Mongo or in-memory repositories at startup based on environment.

---

## Practical Rule of Thumb

- Put HTTP routing in `presentation/` controllers — no business logic there.
- Put business logic and validation in `application/` services and DTOs.
- Put domain interfaces and pure types in `domain/` — no NestJS or Mongoose imports.
- Put database schemas, repository implementations, and mappers in `infrastructure/persistence/`.
- Put guards, strategies, and decorators at the module root level alongside the module file.
- Add a new top-level folder under `modules/` for each new domain feature.
