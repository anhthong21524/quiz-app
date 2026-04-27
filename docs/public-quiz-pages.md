# Public Pages And Quiz Pages

This document records the public route-level pages in the web app, then calls out which of those pages belong to the learner-facing quiz flow. It excludes authenticated quiz management pages under `/management`.

The route source of truth is `apps/web/src/router/index.ts`.

## Count Summary

- Total route-level public pages/screens: 8
- Public pages that are part of the learner quiz flow: 4
- Main quiz-taking route: `/q/:slug/take`
- Internal quiz-taking states inside that route: active quiz, submitted results, and answer review

Redirect-only routes, such as `/home`, are not counted as screens because they do not render their own page component.

## Public Routed Screens

| # | Route | Screen | Component | Purpose |
|---|---|---|---|---|
| 1 | `/` | Home | `HomeView.vue` | Introduces Quiz App to public visitors and gives learners a direct path to start or browse public quizzes. |
| 2 | `/about` | About | `AboutView.vue` | Explains the product, its learning goals, and its main benefits. It links visitors toward creating or browsing quizzes, but it is not part of taking a quiz attempt. |
| 3 | `/quizzes` | Public Quizzes | `PublicQuizzesView.vue` | Lets learners browse published public quizzes without signing in. The page supports search, sorting, loading more quizzes, and entry into a selected quiz. It also provides a path to private quiz access-code entry. |
| 4 | `/quizzes/private` | Private Quiz Entry | `PrivateQuizEntryView.vue` | Lets learners enter a 6-character private quiz access code. When the code is valid, the learner is routed to the quiz landing page with the access code included so the private quiz can be unlocked. |
| 5 | `/q/:slug` | Quiz Landing / Start Page | `PublicQuizLandingPage.vue` | Shows the selected quiz details before an attempt begins. Learners can review the quiz title, description, question count, time limit, and question type, then enter their name to create an attempt and start the quiz. |
| 6 | `/q/:slug/take` | Take Quiz | `PublicQuizTakeView.vue` | Hosts the active quiz attempt. Learners answer questions, move between questions, see progress and timer information, submit the quiz, and may review results or retake the quiz depending on quiz settings. |
| 7 | `/login` | Sign In / Create Account | `LoginView.vue` | Lets public visitors sign in or create an account. Authenticated users are redirected away from this page to the management dashboard. |
| 8 | `/auth/callback` | Auth Callback | `AuthCallbackView.vue` | Handles the Google OAuth callback by storing tokens, syncing the profile, and redirecting the user. It renders only a temporary loading spinner. |

## Learner Quiz Flow Pages

These are the 4 public pages that directly support browsing, unlocking, starting, taking, submitting, or reviewing a quiz attempt:

| # | Route | Screen |
|---|---|---|
| 1 | `/quizzes` | Public Quizzes |
| 2 | `/quizzes/private` | Private Quiz Entry |
| 3 | `/q/:slug` | Quiz Landing / Start Page |
| 4 | `/q/:slug/take` | Take Quiz |

## Quiz-Taking Internal States

The quiz-taking route is one routed screen, but it can show several learner-facing states:

| State | Purpose |
|---|---|
| Active quiz | Displays the current question, answer options, progress, timer, navigation controls, clear-answer action, and submit action. |
| Submitted results | Shows the learner's score or submission confirmation after the attempt is submitted. It may include summary information, retake, review, and back-to-quizzes actions depending on quiz settings. |
| Answer review | Lets the learner compare selected answers with correct answers after submission when answer review is enabled for the quiz. |

## Not Included

### Management Pages

The following quiz-related screens are management pages and are intentionally excluded from this count:

- `/management/quizzes`
- `/management/create-quiz`
- `/management/quizzes/:id/questions`
- `/management/results`
- `/management/results/:quizId`

### Redirect Routes

The following routes redirect to another route and are not counted as separate screens:

- `/home` redirects to `/`.
- `/profile` redirects to `/management/profile`.
- `/account` redirects to `/management/configuration`.
- `/configuration` redirects to `/management/configuration`.
- `/password` redirects to `/management/password`.
- `/create-quiz` redirects to `/management/create-quiz`.
- `/editor` redirects to `/management/create-quiz`.
- `/editor/:id` redirects to `/management/quizzes/:id/questions`.
- `/results` redirects to `/management/results`.
- `/results/:quizId` redirects to `/management/results/:quizId`.
