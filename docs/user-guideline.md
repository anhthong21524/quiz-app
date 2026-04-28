# User Guideline

This guide explains how to use Quiz App as a quiz creator, administrator, or learner. It assumes the app is running locally with the default development URLs.

## Quick Start

- Open the web app at `http://localhost:3000`.
- The app uses the API at `http://localhost:3001/api`; regular users do not need to open the API directly.
- For local testing, sign in with:
  - Email: `admin@quiz.app`
  - Password: `admin1234`
- Protected pages redirect to the login page when the current session is not signed in.

## Sign In or Create an Account

### Sign in with email and password

1. Open `http://localhost:3000/login`.
2. Enter your email and password.
3. Select **Sign in**.
4. After a successful sign-in, the app opens the quiz management area.

### Sign in with Google

1. Open `http://localhost:3000/login`.
2. Select **Sign in with Google**.
3. Complete the Google account approval flow.
4. After a successful sign-in, the app returns to the quiz management area.

If Google sign-in is not configured for the current environment, continue with email and password instead.

### Create an account

1. Open `http://localhost:3000/login`.
2. Switch to the create-account form.
3. Enter the required details.
4. Submit the form.

Password and email validation messages appear beside the fields when values are missing or invalid.

## For Quiz Creators and Administrators

Signed-in users can open the management dashboard, create quizzes, manage existing quizzes, review results, update profile details, configure quiz subjects, and change passwords.

### Open the Management Dashboard

Open **Management** to see an overview of your quiz activity.

- A hero section helps you create your first quiz or continue editing recent work.
- Summary cards show total quizzes, in-progress quizzes, published quizzes, and total submissions.
- A recent quizzes table helps you jump back into editing or review recent activity.

Use the dashboard as the main starting point after signing in when you want a quick overview before opening a specific page.

### Create a Quiz

1. Sign in.
2. Open **Create Quiz** from the header or management dashboard.
3. Fill in the quiz configuration:
   - Quiz title
   - Quiz description
   - Subject / Domain
   - Number of questions, from 1 to 50
   - Time limit, or **Unlimited**
   - Difficulty: Easy, Medium, or Hard
4. Choose access and participant behavior:
   - **Private quiz** hides the quiz from public browsing and requires a 6-character access code.
   - **Show summary** controls whether participants see the result summary after submission.
   - **Allow answer review** controls whether participants can review correct and incorrect answers.
   - **Allow retake** controls whether participants can restart after submission.
5. Select **Create questions**.
6. For each question:
   - Write the question text.
   - Add at least two answer options.
   - Mark the correct option.
   - Add an optional explanation.
7. Use the question navigator to move between questions and track completion.
8. Select **Save quiz** after the final question.

### Edit a Quiz

1. Open **My Quizzes**.
2. Select the edit icon for the quiz.
3. Update the configuration or questions.
4. Select **Save configuration**, **Edit questions**, **Next question**, or **Update quiz** as needed.

Published quizzes open in view-only mode. To change a published quiz, return to **My Quizzes**, unpublish it, edit the quiz, and publish it again when ready.

### Manage Quizzes

Open **My Quizzes** to search, filter, sort, and manage quizzes.

- Use the search box to find quizzes by title or subject.
- Filter by status or subject.
- Switch between list and grid views.
- Select table headers to sort supported columns.
- Use the action buttons to preview, edit, share, publish, unpublish, duplicate, or delete a quiz.
- Select a quiz row to open its result detail when submissions exist.

Quiz statuses:

- **In progress**: The quiz is still being built.
- **Published**: The quiz is available to participants.
- **Unpublished**: The quiz exists but is not available to participants.

Deleting a quiz is permanent and requires confirmation.

### Publish and Share a Quiz

1. Open **My Quizzes**.
2. Use the quiz action menu.
3. Select **Publish**.
4. Confirm the publish action.

After publishing:

- Public quizzes can be shared with the share action.
- Private quizzes show a private badge and require an access code.
- For private quizzes, copy the access code from the quiz configuration or from **My Quizzes** after publishing.

To remove participant access, use **Unpublish** from the quiz action menu. The quiz can be published again later.

### Review Results

Open **Quiz Results** to analyze submissions.

- Summary cards show total quizzes, submissions, and average score.
- The performance table lists quizzes with submissions and average scores.
- Search and filter results by quiz, subject, and date range.
- Export the result list as CSV.
- Open a quiz result detail page to review participant submissions.
- On the detail page, select a submission to view score, time spent, selected answers, correct answers, and explanations.

The result detail page can also export submissions as CSV.

## For Learners

Public users can open the home page, browse public quizzes, enter a private quiz code, and take published quizzes.

### Take a Public Quiz

1. Open **Public Quizzes**.
2. Search or sort the available quizzes if needed.
3. Select a quiz.
4. Enter your name on the quiz landing page.
5. Select **Start quiz**.
6. Answer every question.
7. Select **Submit quiz** when all questions are answered.

Timed quizzes show a countdown. If the timer reaches zero, the attempt is submitted automatically. During an active attempt, the app warns before leaving the quiz page.

After submission, the participant may see a summary, answer review, or retake option depending on the quiz settings.

### Take a Private Quiz

1. Open **Public Quizzes**.
2. Select **Enter code**.
3. Enter the 6-character access code shared by the quiz creator.
4. After the code is accepted, enter your name and start the quiz.

If a private quiz link already includes an access code, the app opens the quiz landing page directly.

## Manage Settings

Open the account/settings area from the signed-in header.

- **Profile**: View username and email. Upload an avatar image under 2 MB.
- **Configuration**: Add, edit, remove, reorder, or reset Subject / Domain values. These values appear in the quiz creation dropdown. Keep at least one value configured.
- **Password**: Update your password by entering the current password, a valid new password, and a matching confirmation.

## Troubleshooting

- If protected pages redirect to login, sign in again.
- If the public quiz list does not show a quiz, confirm the quiz is published and not private.
- If a private code fails, check that the quiz is published, private, and that the 6-character code was copied correctly.
- If a published quiz cannot be edited, unpublish it first from **My Quizzes**.
- If result pages show no data, make sure participants have submitted attempts for that quiz.
- If local data disappears after restarting without MongoDB, the API is using the in-memory repository. Configure `MONGODB_URI` for persistent storage.
