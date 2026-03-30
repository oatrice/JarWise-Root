# Implementation Plan: Real Google Sign-In and Backend Authentication

> **Issue**: [#97](https://github.com/oatrice/JarWise-Root/issues/97)
> **Status**: Draft
> **Dependency Direction**: This issue lands before [#96](https://github.com/oatrice/JarWise-Root/issues/96)

## 1. Summary

Replace Web mock auth with real Google Sign-In, verify identity in the Go backend, establish a real JarWise user and session model, and make all user-specific APIs run under authenticated user context. This work is the foundation for per-user migration isolation in `#96`.

## 2. Key Changes

### 2.1 Web Auth Flow

- Replace `useAuthMock` with a real auth provider and bootstrap hook.
- Integrate Google Identity Services and obtain a Google ID token on sign-in.
- Add app bootstrap logic that calls `GET /api/v1/auth/me` on load and gates protected screens until auth state is known.
- Update `LoginScreen`, `Dashboard`, and `SettingsOverlay` to consume real authenticated user state.
- Implement logout by calling backend logout and clearing client auth state.

### 2.2 Backend Auth Flow

- Add `POST /api/v1/auth/google` to accept a Google ID token, verify it server-side, resolve or create a JarWise user, create a session, and set an HttpOnly cookie.
- Add `GET /api/v1/auth/me` to return the authenticated JarWise user.
- Add `POST /api/v1/auth/logout` to revoke the current session and clear the cookie.
- Add auth middleware that loads the current user from the session cookie and attaches it to request context.
- Protect all user-specific endpoints already present in backend:
  - reports
  - report export
  - transfers
  - charts
  - graph
  - wallets
  - all migration endpoints

### 2.3 Session Strategy

- Use server-side sessions with an opaque random session token in an HttpOnly cookie named `jarwise_session`.
- Store only a hash of the session token in a `user_sessions` table.
- Cookie defaults:
  - `HttpOnly`
  - `SameSite=Lax`
  - `Path=/`
  - `Secure` in production
- Session lifetime: 30 days rolling expiration.
- Web fetches for authenticated APIs must use credentials included.

### 2.4 User Ownership Model

- Add a `users` table with a generated JarWise user ID and a unique `google_sub`.
- Add `user_id` foreign keys to `wallets`, `jars`, and `transactions`.
- Update repositories and services so reads and writes are always filtered by `user_id`.
- Stop treating global record IDs as shared across all users; all domain records become user-owned.

### 2.5 Verification Defaults

- Verify Google ID tokens against the configured Google client ID audience.
- Use backend user context as the only source of truth for authorization.
- Keep email and avatar as profile data, but use `google_sub` as the stable identity key.

## 3. Public APIs And Interfaces

### `POST /api/v1/auth/google`

- Request:

```json
{
  "idToken": "string"
}
```

- Response:

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "avatarUrl": "string"
  }
}
```

- Side effect: sets `jarwise_session` cookie.

### `GET /api/v1/auth/me`

- Response:

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "avatarUrl": "string"
  }
}
```

### `POST /api/v1/auth/logout`

- Response:

```json
{
  "success": true
}
```

- Side effect: expires the current session cookie.

### Auth Middleware Contract

- Unauthenticated request: `401`
- Authenticated but unauthorized resource: `403`

## 4. Step-by-Step Implementation

### Step 1: Add User And Session Storage

- Add `users` and `user_sessions` tables.
- Backfill `user_id` support into `wallets`, `jars`, and `transactions`.
- Add indexes needed for `google_sub`, session lookup, and user-scoped queries.

### Step 2: Add Backend Auth Endpoints And Middleware

- Implement Google token verification service.
- Implement auth handler endpoints for sign-in, current user, and logout.
- Implement middleware to load the authenticated user from `jarwise_session`.
- Wire middleware into all protected routes.

### Step 3: Refactor Backend Reads And Writes To Be User-Scoped

- Update repositories and services so all user-owned data is created and queried with `user_id`.
- Ensure all protected endpoints reject access to another user's resources.

### Step 4: Replace Mock Web Auth

- Introduce a real auth provider and bootstrapping flow on the Web side.
- Replace `useAuthMock` usage in `Dashboard`, `SettingsOverlay`, and related screens.
- Update `LoginScreen` to call Google Identity Services and exchange the returned credential with backend auth.

### Step 5: Session Restore And Logout

- On app load, call `GET /api/v1/auth/me` and render only after auth state resolves.
- Add logout action that calls backend logout and resets client auth state.

### Step 6: Prepare Downstream Features

- Ensure the authenticated user context is stable enough for `#96`.
- Document all auth assumptions and required env configuration for local and production use.

## 5. Test Plan

### Backend Auth Tests

- Valid Google token creates user and session.
- Returning user reuses existing user.
- Invalid token returns `401`.
- `/auth/me` returns user for valid session.
- Logout revokes session and clears cookie.
- Protected endpoints reject missing or expired session.
- Protected endpoints only return current user's data.

### Web Tests

- Login screen starts real sign-in flow.
- App bootstrap restores session from `/auth/me`.
- Logout clears authenticated state.
- Protected screens do not render while auth is unresolved.

### Integration Tests

- Two users cannot read each other's reports, wallets, or transactions.
- Same browser reload keeps session alive when cookie is valid.

## 6. Assumptions And Defaults

- Session strategy is fixed to server-side opaque sessions with an HttpOnly cookie.
- Identity source is Google Sign-In only for this phase.
- `users` table plus `user_id` foreign keys is the required ownership model.
- Backend user context is the only trusted authorization source.
- This issue must land before `#96`, or both must be developed in one branch with `#97` complete first.
