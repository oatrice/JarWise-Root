# SBE: Implement real Google Sign-In and backend authentication

> Created: 2026-03-30
> Issue: https://github.com/oatrice/JarWise-Root/issues/97

---

## Feature: Real Google Sign-In and Backend Authentication

Replace the Web mock login flow with a real Google Sign-In flow backed by server-side token verification and authenticated JarWise user context. The result should be a real user identity foundation that protected features such as migration can trust.

### Scenario: Successful First-Time Sign-In

**Given** a user has a valid Google account and no JarWise user record yet
**When** they complete Google Sign-In from the Web login screen and the backend verifies the Google ID token
**Then** JarWise creates the user, establishes an authenticated session, and the app loads with the real profile

#### Examples

| google_email | existing_user | backend_result | app_result |
|--------------|---------------|----------------|------------|
| `anna@example.com` | `false` | `user_created` | `signed_in` |
| `bob.finance@gmail.com` | `false` | `user_created` | `signed_in` |
| `claire.work@gmail.com` | `false` | `user_created` | `signed_in` |

### Scenario: Returning User Session Restore

**Given** a user previously signed in and still has valid JarWise session credentials
**When** they refresh the app or reopen the Web client
**Then** the app restores the authenticated session and protected screens load without using `useAuthMock`

#### Examples

| user_email | session_state | current_user_result | app_result |
|------------|---------------|---------------------|------------|
| `anna@example.com` | `valid` | `200 authenticated` | `dashboard loads` |
| `bob.finance@gmail.com` | `valid` | `200 authenticated` | `settings shows real profile` |
| `claire.work@gmail.com` | `valid` | `200 authenticated` | `migration screen is accessible` |

### Scenario: Invalid Google Token Rejected

**Given** the client submits an invalid, expired, or mismatched Google token
**When** the backend verifies the credential
**Then** sign-in fails and the app shows an actionable authentication error

#### Examples

| token_state | backend_result | status_code | user_message |
|-------------|----------------|-------------|--------------|
| `expired` | `token_invalid` | `401` | `Your Google session expired. Please try signing in again.` |
| `wrong_audience` | `token_invalid` | `401` | `This Google credential is not valid for this app.` |
| `tampered` | `token_invalid` | `401` | `We could not verify your Google sign-in.` |

### Scenario: Protected Endpoint Requires Authenticated User

**Given** a request reaches a protected backend endpoint without a valid authenticated JarWise session
**When** the backend evaluates authorization
**Then** the request is rejected and no protected user data is returned

#### Examples

| endpoint | auth_state | status_code | result |
|----------|------------|-------------|--------|
| `GET /api/v1/auth/me` | `missing` | `401` | `Authentication required.` |
| `POST /api/v1/migrations/money-manager/jobs` | `expired` | `401` | `Session expired. Please sign in again.` |
| `GET /api/v1/migrations/money-manager/jobs/job-123` | `belongs to another user` | `403` | `You do not have access to this resource.` |
