# Auth Form Validation Architecture

## 1. Architecture Summary

Authentication validation is split by responsibility:

- `packages/shared/src/auth.ts`: shared limits and password policy that both web and API can import.
- `apps/web/src/lib/validation/errorMessages.ts`: user-facing validation copy.
- `apps/web/src/lib/validation/validators.ts`: primitive field validators and password rule status helpers.
- `apps/web/src/lib/validation/authSchema.ts`: login and register form schemas, normalized values, and field error maps.
- `apps/web/src/lib/validation/normalizeAuthError.ts`: Axios/NestJS auth error mapping into safe field and form messages.
- `apps/web/src/components/forms/*`: small reusable display components for field errors, form errors, password hints, and future form fields.
- `apps/web/src/views/LoginView.vue`: interaction state, submit timing, API calls, and route transitions.
- `apps/api/src/modules/auth/dto/*.ts`: backend validation aligned with shared limits and client messages.

Vue components should own only interaction state and rendering: touched, dirty, submit attempts, loading state, and API orchestration. Validation schemas own rules and normalized payloads. Message mapping owns wording and server error safety. Shared owns constants that must not drift between frontend and backend.

Future flows should reuse the same primitives:

- confirm password: `validatePasswordConfirmation()`
- forgot password: `validateEmail()`
- password reset: `validateNewPassword()` plus confirmation
- account creation enablement: keep future-only fields out of API payloads until the shared contract changes
- localization: replace `authValidationMessages` with keyed message lookups without changing validators

## 2. Root Cause Analysis

### A. Login Validation Failures

| Issue | Symptom | How to detect | Exact fix | Long-term risk |
| --- | --- | --- | --- | --- |
| Empty email allowed | Submit reaches API with blank email. | Submit login with empty email. | `validateEmail()` returns `Email is required.` and disables submit. | Backend becomes the only guard and UX feels broken. |
| Invalid email accepted | `abc` posts to `/auth/login`. | Type non-email and inspect network. | Shared email validator runs on input state, blur, and submit. | Login/register drift and inconsistent support tickets. |
| Empty password submits | API call happens with empty password. | Clear password and press Enter. | `validateRequiredPassword()` blocks submit. | Bad auth telemetry and noisy server logs. |
| Validation timing is wrong | Errors show immediately on page load or only after API failure. | Open `/login`, tab through fields, and submit invalid values. | Show field errors after blur or submit attempt only. | Users ignore noisy validation or miss hidden validation. |
| Behavior inconsistent | Button, errors, and API calls disagree. | Compare disabled state with submit handling. | Use one schema result for button state and submit guard. | Duplicate component rules diverge over time. |

### B. Register Validation Failures

| Issue | Symptom | How to detect | Exact fix | Long-term risk |
| --- | --- | --- | --- | --- |
| Missing required fields | Register posts incomplete data. | Submit blank signup fields. | `validateRegisterForm()` requires email, password, and confirmation. | Future onboarding fails silently. |
| Email differs from login | Same email passes one form and fails another. | Test whitespace and malformed email in both modes. | Both schemas call `validateEmail()`. | User confusion and duplicate fixes. |
| Password mismatch | User creates typoed password. | Enter different password/confirm values. | `validatePasswordConfirmation()` blocks submit. | Account creation succeeds with an unknown password if backend later accepts confirm separately. |
| Required vs optional unclear | Name field blocks unexpectedly or is sent before API supports it. | Toggle name behavior in signup. | Name is optional client-side and not sent to API yet. | Backend `forbidNonWhitelisted` rejects future-only payloads. |
| Rules drift | Register enforces stronger rules than reset. | Compare validators across auth files. | Shared password primitives are reused. | Security and UX become hard to reason about. |

### C. Password Rule Failures

| Issue | Symptom | How to detect | Exact fix | Long-term risk |
| --- | --- | --- | --- | --- |
| Rules unclear | User sees policy only after submit. | Open signup and inspect password area. | `PasswordHint.vue` shows rules before failure. | More failed attempts and abandonment. |
| Weak passwords accepted | Common passwords pass registration. | Try `password123`. | `AUTH_PASSWORD_POLICY.weakPasswords` and `validateNewPassword()`. | Weak accounts and later policy churn. |
| Frontend/backend mismatch | Client passes, API rejects. | Run `pnpm lint` and compare DTO imports. | API DTOs import shared `AUTH_PASSWORD_POLICY`. | Production-only validation bugs. |
| Rules appear too late | Errors appear after submit only. | Type short password without blurring. | Hint updates live; error appears after blur/submit. | User has no path to fix before failure. |
| Messages differ | "Min 8" vs "Use 8 characters." | Compare copy in DTO and client messages. | Central message templates and matching DTO messages. | Inconsistent brand voice. |

### D. Error Messaging Failures

| Issue | Symptom | How to detect | Exact fix | Long-term risk |
| --- | --- | --- | --- | --- |
| Raw backend errors shown | Technical class-validator text appears. | Force a 400/500 response. | `normalizeAuthError()` and `getUserMessage()`. | Security leakage and poor trust. |
| Inconsistent wording | Same error has different phrasing. | Test login/register invalid email. | `authValidationMessages`. | Harder localization and QA. |
| Field/form mixed poorly | Invalid credentials shown under password only. | Login with wrong credentials. | Credential failures are form-level banners. | Users change the wrong field repeatedly. |
| Errors not cleared | Old server error remains after typing. | Fail login, edit email. | `handleFieldInput()` clears field and form server errors. | Stale UI blocks recovery. |
| Too many errors at once | Every field screams on first paint. | Open form with empty values. | Errors render after touched or submit attempt. | Noisy UX and lower completion. |

### E. Maintainability Failures

| Issue | Symptom | How to detect | Exact fix | Long-term risk |
| --- | --- | --- | --- | --- |
| Rules duplicated | Regex and password lengths appear in views. | Search auth views. | Move rules to `lib/validation`. | Small changes require risky edits. |
| Inline hardcoding | Components contain policy constants. | Inspect SFC scripts. | Shared constants and schemas. | Policy cannot be audited. |
| Messages scattered | Same copy lives in multiple files. | Search for "Email is required". | Message templates in one module, DTO copies aligned. | i18n becomes expensive. |
| No password source of truth | API says 72 max, UI says 8 min only. | Compare DTOs and UI. | `AUTH_PASSWORD_POLICY` shared. | Client/server mismatch. |
| Auth flows scale messily | Forgot/reset/register each invents state. | Add a new form. | Reuse validators, display components, and normalization. | More bugs per new flow. |

## 3. Validation State Model

| State | Meaning | UI behavior | Field errors | Form errors | Submit |
| --- | --- | --- | --- | --- | --- |
| pristine | User has not edited the field/form. | Quiet default UI. | Hidden. | Hidden. | Disabled if schema invalid. |
| touched | Field blurred at least once. | Show that field's validation. | Show for touched field. | Hidden unless submit/API failed. | Based on schema validity. |
| dirty | Field value changed. | Clear stale server errors for that field. | Show only if also touched or submitted. | Clear stale form error. | Based on schema validity. |
| invalid | Current schema has errors. | Keep button disabled and block submit. | Show touched/submitted errors. | Optional summary only after submit. | Disabled. |
| valid | Current schema passes. | Normal field styling. | Hidden. | Hidden. | Enabled unless submitting. |
| submitting | API call in progress. | Busy label and spinner. | Keep current errors stable. | Hidden unless API returns failure. | Disabled. |
| submit_failed | API rejected or network failed. | Form banner or field errors. | Server field errors if provided. | Show safe normalized message. | Re-enabled if schema valid. |
| submit_succeeded | Auth succeeded. | Route to management app. | Hidden. | Hidden. | N/A. |

Premature validation is avoided by rendering client field errors only after `touched` or `submitAttempted`. Noisy UX is avoided by showing password guidance as neutral hint text, not red error text, while the user is still typing.

## 4. FORM-1 Implementation

Login validates email required, email format, and password required. Email is trimmed before validation and API submission. Password is not trimmed for submission because passwords are secrets, but empty or spaces-only values fail required validation.

Validation runs:

- input: recompute schema and clear stale server errors
- blur: mark field touched and show field error if invalid
- submit: mark all validation visible, block invalid values, then call API

Wrong credentials are handled as a form-level message: `Incorrect email or password. Please try again.`

## 5. FORM-2 Implementation

Register uses `validateRegisterForm()` with email, password, confirm password, and optional name support. The current API payload intentionally sends only email and password because the NestJS DTO does not accept `name` or `confirmPassword` yet. When account creation grows, update `RegisterPayload`, `RegisterDto`, and `registerPayloadFrom()` together.

## 6. FORM-3 Implementation

Current password policy:

- minimum length: 8
- maximum length: 72
- password cannot be only spaces
- common weak passwords are blocked for registration/reset
- confirmation must match where confirmation exists
- character categories are recommended in hint text, not required

This avoids harsh UX while still preventing obvious weak choices. The API imports the same shared policy constants, so backend and frontend limits stay aligned.

## 7. FORM-4 Implementation

Central message ownership:

- field copy: `authValidationMessages`
- password hint copy: `passwordHintText`
- feature/API copy: `apps/web/src/lib/api/error-messages.ts`
- auth API normalization: `normalizeAuthError()`

Technical errors are never rendered directly. Unknown server failures fall back to safe generic copy.

## 8. User Flow Design

Login flow:

1. User opens `/login`; fixture credentials are valid and submit is enabled.
2. User edits input; stale server errors clear.
3. User blurs invalid field; field error appears.
4. User submits; client schema blocks invalid values.
5. API call starts only when valid.
6. Success redirects to quizzes; invalid credentials show form banner.

Register flow:

1. User opens create-account tab.
2. Password hint is visible before failure.
3. Field errors appear after blur or submit.
4. Submit is enabled only when email, password, and confirmation pass.
5. API errors normalize into field errors or a safe form banner.

## 9. Validation and Error Display Strategy

Priority:

1. Client field error after touched/submitted
2. Server field error after failed submit
3. Form-level auth/network/server error
4. Neutral password hint text

Editing a field clears its server field error and the form banner. Client errors remain derived from current schema state.

## 10. Component Design

- `FormField.vue`: future wrapper for label/input/error slots. It should not know validation rules or API details.
- `FieldErrorText.vue`: small accessible field message renderer.
- `FormErrorBanner.vue`: form-level error renderer with `role="alert"`.
- `PasswordHint.vue`: neutral live checklist for password policy.

Components receive strings and values. They do not own schemas, submit behavior, or backend normalization.

## 11. Validation Schema and Rule Code

Implemented in:

- `apps/web/src/lib/validation/validators.ts`
- `apps/web/src/lib/validation/authSchema.ts`
- `packages/shared/src/auth.ts`

The schemas return normalized payload values, issue lists, first-error-per-field maps, and `isValid`.

## 12. Error Message Mapping Code

Implemented in:

- `apps/web/src/lib/validation/errorMessages.ts`
- `apps/web/src/lib/validation/normalizeAuthError.ts`
- `apps/web/src/lib/api/error-messages.ts`

`normalizeAuthError()` converts API errors into `{ fieldErrors, formError }` and treats 401 login failures as invalid credentials.

## 13. Login Form Integration Code

Implemented in `apps/web/src/views/LoginView.vue`.

Key behavior:

- uses `validateLoginForm()`
- disables submit while invalid or submitting
- shows field errors after blur/submit
- shows form banner for credentials/API failures
- trims email payload via `loginPayloadFrom()`

## 14. Register Form Integration Code

Implemented in `apps/web/src/views/LoginView.vue`.

Key behavior:

- uses `validateRegisterForm()`
- validates confirm password client-side
- shows `PasswordHint.vue`
- sends only email/password until the API contract adds future fields

## 15. Accessibility and UX Requirements

- Inputs set `aria-invalid` only when an error is visible.
- Inputs link to error text through `aria-describedby`.
- Form banners use `role="alert"` and `aria-live="polite"`.
- Native buttons and inputs preserve keyboard navigation.
- Submit uses `aria-busy` during API calls.
- Password hints are neutral guidance, not error alerts.

## 16. Performance and Maintainability Notes

Validation is synchronous, tiny, and computed from reactive form state. No extra library is needed for the current auth surface. Add a schema library only if nested forms, async field validation, or localization keys become large enough to justify it.

Keep adding auth forms by composing primitives, not copying regexes or password constants into components.

## 17. Debugging Checklist

- Email: blank, spaces around email, malformed email, max length.
- Password: blank, spaces-only, short, longer than 72, common weak password.
- Submit: disabled when invalid, disabled while submitting, Enter key submit blocked when invalid.
- Error clearing: server banner clears on edit; field server error clears on field edit.
- Server mapping: 401 login shows invalid credentials; 400/422 field errors are safe.
- Consistency: login/register share email validator and messages.
- Accessibility: `aria-invalid`, `aria-describedby`, focus outlines, alert banner.

## 18. Edge Cases

| Edge case | Cause | Fix | Verification |
| --- | --- | --- | --- |
| Email with spaces | Copy/paste or autofill. | Trim email before validation/submission. | `" admin@quiz.app "` logs in. |
| Password only spaces | User input is technically non-empty. | Required password checks `trim()`. | Spaces-only password shows required error. |
| Server returns generic error | Network/API failure has no field data. | Safe form banner fallback. | Mock 500 and verify no technical text. |
| User edits after error | Stale server state remains. | Clear server field/form errors on input. | Fail login, edit email, banner clears. |
| Multiple invalid fields | Form submit exposes all relevant client errors. | `submitAttempted` makes errors visible. | Blank signup submit shows email/password/confirm errors. |
| Password mismatch | Confirmation differs. | Cross-field validator. | Change confirm value and submit stays disabled. |
| Backend rule change | DTO policy changes only server-side. | Keep policy in shared constants. | API and web lint/build after policy edit. |
| Autofill issues | Browser fills without blur timing. | Computed validation reads current model; submit validates again. | Autofill credentials and press Enter. |

## 19. Final Recommended Implementation Plan

1. Keep shared auth limits in `packages/shared/src/auth.ts`.
2. Use `authSchema.ts` for every auth form submit guard.
3. Use `validators.ts` primitives for forgot password and reset password.
4. Keep `normalizeAuthError.ts` as the only auth-specific API error mapper.
5. Add `name` to shared/API payloads only when the product truly supports profile creation.
6. Add i18n by changing message lookup storage, not by changing validator control flow.
7. Extend E2E coverage for invalid login, signup password mismatch, invalid credentials, and error clearing.
