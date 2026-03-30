# Implementation Plan: Job-Based, Validate-First Money Manager Migration

> **Issue**: [#96](https://github.com/oatrice/JarWise-Root/issues/96)
> **Status**: Draft
> **Depends On**: [#97](https://github.com/oatrice/JarWise-Root/issues/97)

## 1. Summary

Replace the Web mock migration flow with a job-based backend workflow. Users must upload both `.mmbak` and `.xls`, wait for validation to finish, review preview results, and explicitly confirm import. Jobs are authenticated, owned by a single user, and imports are blocked when duplicates are detected for that same user.

## 2. Key Changes

### 2.1 Backend Job Model

- Add a `migration_jobs` table keyed by job ID and owned by `user_id`.
- Persist:
  - job phase
  - message
  - preview counts
  - validation errors
  - duplicate summary
  - temp file paths
  - confirmability
  - expiry timestamps
- Supported phases:
  - `validating`
  - `preview_ready`
  - `duplicate_blocked`
  - `importing`
  - `completed`
  - `failed`
  - `expired`

### 2.2 Duplicate Detection Model

- Add a `migration_source_refs` table keyed by `(user_id, source_system, entity_type, source_id)`.
- Store both source ID references and a normalized content fingerprint for each imported wallet, jar, and transaction.
- Use source reference lookups as the primary duplicate detector.
- Use content fingerprint as a secondary detector and warning path for malformed or reused source IDs.
- Validation blocks the whole import when any duplicates exist and returns grouped duplicate details for wallets, categories, and transactions.

### 2.3 Validate-First Flow

- Replace the single upload-and-import path with three endpoints:
  - `POST /api/v1/migrations/money-manager/jobs`
  - `GET /api/v1/migrations/money-manager/jobs/:jobId`
  - `POST /api/v1/migrations/money-manager/jobs/:jobId/confirm`
- `POST /jobs` saves both uploaded files, creates a job, starts validation in the background, and returns the new job ID immediately.
- Validation parses both files, checks totals, computes preview counts, checks duplicates for the authenticated user, and sets the job phase to either `preview_ready`, `duplicate_blocked`, or `failed`.
- `POST /confirm` is allowed only when the job belongs to the current user, is not expired, and is in `preview_ready`.
- Confirm import re-runs parse and duplicate checks against the saved files, then performs the import transaction. This guards against races and stale preview state.

### 2.4 Import Transaction

- Import writes new JarWise UUIDs for `wallets`, `jars`, and `transactions`.
- Imported domain records use the `user_id` ownership model delivered by `#97`.
- After successful inserts, write `migration_source_refs` for every imported source entity in the same transaction.
- If any duplicate or integrity issue appears during confirm, roll back the entire import and mark the job failed or duplicate-blocked.

### 2.5 File Lifecycle

- Save uploaded files in temp storage on job creation.
- Keep temp files only until the job is completed, failed, or expired.
- Default preview expiry: 24 hours.
- Add a background cleanup path that removes expired temp files and marks old preview jobs as `expired`.

### 2.6 Web Flow

- `MigrationUploadScreen` uploads both files and navigates to `MigrationStatusScreen` with the returned job ID.
- `MigrationStatusScreen` polls `GET /jobs/:jobId` every 1-2 seconds.
- On `preview_ready`, show real counts and a confirm button on the same screen.
- On `duplicate_blocked`, show duplicate details and disable confirm.
- On `failed`, show validation or import error details.
- On `completed`, show real imported counts returned by the job status.
- Keep the existing two-screen UX and do not add a separate result screen.

## 3. Public APIs And Interfaces

### `POST /api/v1/migrations/money-manager/jobs`

- Request: multipart form with `mmbak_file` and `xls_file`
- Auth required
- Response:

```json
{
  "jobId": "string",
  "phase": "validating",
  "message": "string"
}
```

### `GET /api/v1/migrations/money-manager/jobs/:jobId`

- Auth required
- Response:

```json
{
  "jobId": "string",
  "phase": "string",
  "message": "string",
  "counts": {
    "wallets": 0,
    "jars": 0,
    "transactions": 0,
    "totalIncome": 0,
    "totalExpense": 0
  },
  "validationErrors": [],
  "duplicateSummary": {
    "wallets": [],
    "categories": [],
    "transactions": []
  },
  "canConfirmImport": false,
  "expiresAt": "RFC3339 timestamp"
}
```

### `POST /api/v1/migrations/money-manager/jobs/:jobId/confirm`

- Auth required
- Response:

```json
{
  "jobId": "string",
  "phase": "importing",
  "message": "string"
}
```

### Status Payload Defaults

- `counts`: `{ wallets, jars, transactions, totalIncome, totalExpense }`
- `validationErrors`: structured list with code and message
- `duplicateSummary`: grouped arrays for wallets, categories, and transactions with source IDs and display names where available
- `canConfirmImport`: `true` only in `preview_ready`

## 4. Step-by-Step Implementation

### Step 1: Introduce User-Scoped Migration Persistence

- Add `migration_jobs` and `migration_source_refs` tables.
- Ensure both tables are keyed or constrained by `user_id`.
- Add indexes for job lookup, expiry cleanup, and source reference duplicate checks.

### Step 2: Split Migration API Into Job Endpoints

- Replace the old single-step flow with job creation, status polling, and confirm endpoints.
- Require authenticated user context on every migration endpoint.
- Keep the job response shape rich enough for Web to render preview, duplicates, and completion.

### Step 3: Implement Validation Pipeline

- Save both uploaded files when the job is created.
- Parse `.mmbak` and `.xls`.
- Validate totals and compute preview counts.
- Run duplicate detection for the authenticated user.
- Persist terminal validation state as either `preview_ready`, `duplicate_blocked`, or `failed`.

### Step 4: Implement Confirm Import

- Allow confirm only from `preview_ready`.
- Re-parse and re-check duplicates during confirm.
- Insert user-owned wallets, jars, and transactions in one transaction.
- Write source refs and fingerprints in the same transaction.
- Mark job as `completed` only after commit succeeds.

### Step 5: Add Cleanup And Expiry Handling

- Expire stale preview jobs after 24 hours.
- Remove temp files for completed, failed, and expired jobs.
- Return `expired` status for stale jobs instead of allowing confirm.

### Step 6: Connect Web Screens

- Update `MigrationUploadScreen` to submit multipart form data and capture the returned job ID.
- Update `MigrationStatusScreen` to poll job status, render preview counts, duplicates, errors, and final counts.
- Implement confirm import from the same screen.

## 5. Test Plan

### Backend Migration Tests

- Job creation starts validation and returns a job ID.
- Polling shows phase transitions correctly.
- Matched files reach `preview_ready`.
- Mismatched files reach `failed`.
- Duplicates for the same user reach `duplicate_blocked`.
- Same source IDs imported by a different user are allowed.
- Confirm import succeeds only from `preview_ready`.
- Confirm import is idempotent and rejects completed or expired jobs.
- Import transaction rolls back on failure.
- Source refs are written only on successful commit.

### Web Tests

- Upload screen submits both files and stores job ID.
- Status screen polls until preview or terminal phase.
- Confirm button appears only when `canConfirmImport` is true.
- Duplicate-blocked jobs show duplicate lists and no confirm path.
- Completed jobs show real imported counts.

### End-to-End Tests

- Sign in as user A, import valid files, confirm success.
- Sign in again as user A, re-upload same files, and see duplicate block.
- Sign in as user B, upload the same files, and validation plus import still succeed.

## 6. Assumptions And Defaults

- Session strategy is fixed to server-side opaque sessions with an HttpOnly cookie.
- Identity source is Google Sign-In only for this phase.
- `users` table plus `user_id` foreign keys is the required ownership model.
- Duplicate detection uses both source reference rows and content fingerprints.
- `#97` must land before `#96`, or both must be developed in one branch with `#97` complete first.
- `#96` continues to require both `.mmbak` and `.xls`; `.xls`-only import is out of scope.
