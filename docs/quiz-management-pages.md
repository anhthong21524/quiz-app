# Quiz Management Pages

This document records the authenticated quiz management screens in the web app. The source of truth is `apps/web/src/router/index.ts`, where each route under `/management` is registered.

## Count Summary

- Total management routes/screens: 9
- Unique Vue view components used by those routes: 8
- Quiz builder internal steps: 2

`Create Quiz` and `Edit Quiz Questions` are separate routes, but both render `CreateQuizView.vue`. The quiz builder also has two internal steps, `Configuration` and `Questions`, controlled inside the same view.

## Routed Screens

| # | Route | Screen | Component | Purpose |
|---|---|---|---|---|
| 1 | `/management` | Management dashboard | `ManagementView.vue` | Provides the authenticated landing page for quiz authors. It summarizes quiz counts, published and in-progress work, total submissions, and recent quizzes so the user can quickly continue editing or review activity. |
| 2 | `/management/quizzes` | My Quizzes | `MyQuizzesView.vue` | Lists quizzes created by the authenticated user. It supports managing quiz status and common actions such as search, filter, sort, edit, publish, unpublish, duplicate, delete, share, and copy private access codes. |
| 3 | `/management/create-quiz` | Create Quiz | `CreateQuizView.vue` | Starts the guided quiz builder for a new quiz. The first step captures quiz configuration, then the second step lets the user add and organize questions before saving. |
| 4 | `/management/quizzes/:id/questions` | Edit Quiz Questions | `CreateQuizView.vue` | Opens an existing quiz in the same guided builder. It lets the user review or update quiz configuration and edit the question set for an existing quiz. |
| 5 | `/management/results` | Quiz Results | `ResultQuizPage.vue` | Shows an overview of quiz performance across all quizzes. It helps the user compare quiz outcomes and navigate into detailed results for a selected quiz. |
| 6 | `/management/results/:quizId` | Quiz Result Detail | `ResultQuizDetailView.vue` | Shows submissions and analytics for one quiz. It is used to inspect learner attempts, scores, answer review data, and quiz-specific performance details. |
| 7 | `/management/profile` | Profile | `ProfileView.vue` | Lets the authenticated user manage personal account information, including profile details used in the management experience. |
| 8 | `/management/configuration` | Configuration | `ConfigurationSettingsView.vue` | Manages quiz setup defaults and configurable Subject / Domain choices used when creating or editing quizzes. |
| 9 | `/management/password` | Password Settings | `PasswordSettingsView.vue` | Provides the account password management screen for updating authentication credentials. |

## Quiz Builder Internal Steps

The quiz builder is not split into additional routes, but it does present two internal screens inside `CreateQuizView.vue`:

| Step | Label | Purpose |
|---|---|---|
| 1 | Configuration | Captures or reviews the quiz title, description, subject, domain, difficulty, time limit, visibility, number of questions, and related setup options. |
| 2 | Questions | Lets the user create, edit, navigate, validate, and save the quiz questions and answer options. |

## Redirects And Aliases

The router also includes convenience redirects and aliases that lead into the management screens but do not add new screens:

- `/create-quiz` redirects to `/management/create-quiz`.
- `/editor` redirects to `/management/create-quiz`.
- `/editor/:id` redirects to `/management/quizzes/:id/questions`.
- `/results` redirects to `/management/results`.
- `/results/:quizId` redirects to `/management/results/:quizId`.
- `/profile` redirects to `/management/profile`.
- `/configuration` and `/account` redirect to `/management/configuration`.
- `/password` redirects to `/management/password`.
- `/management/account` is an alias for `/management/configuration`.
- `/management/editor` redirects to `/management/create-quiz`.
- `/management/editor/:id` redirects to `/management/quizzes/:id/questions`.
