# SBE: Complete end-to-end Money Manager migration implementation

> Created: 2026-03-30
> Issue: https://github.com/oatrice/JarWise-Root/issues/96

---

## Feature: End-to-End Money Manager Migration

Replace the Web mock migration flow with an authenticated, job-based migration system. Users upload both Money Manager files, the backend validates first, the UI polls job status, duplicate source records are blocked for that user, and import only begins after explicit confirmation.

### Scenario: Happy Path - Validate First, Then Confirm Import

**Given** a signed-in user uploads matching `.mmbak` and `.xls` files that contain no duplicates for that user
**When** the backend finishes validation and the user confirms import
**Then** the job reaches `completed` and the status screen shows the real imported counts returned by the backend

#### Examples

| mmbak_file | xls_file | validation_phase | confirm_action | final_phase | wallets | jars | transactions |
|------------|----------|------------------|----------------|-------------|---------|------|--------------|
| `standard_backup.mmbak` | `standard_report.xls` | `preview_ready` | confirm | `completed` | 4 | 9 | 150 |
| `large_history.mmbak` | `large_history.xls` | `preview_ready` | confirm | `completed` | 12 | 28 | 2450 |
| `minimal.mmbak` | `minimal.xls` | `preview_ready` | confirm | `completed` | 1 | 2 | 5 |

### Scenario: Duplicate Blocking For The Same Authenticated User

**Given** a signed-in user uploads files that contain Money Manager source records already imported for that same user
**When** validation completes
**Then** the job reaches `duplicate_blocked`, import confirmation is disabled, and the UI shows which entities are duplicates

#### Examples

| user_email | duplicate_wallets | duplicate_categories | duplicate_transactions | final_phase | can_confirm_import | user_message |
|------------|-------------------|----------------------|------------------------|-------------|--------------------|--------------|
| `anna@example.com` | `Cash Wallet` | `` | `tx_104, tx_105` | `duplicate_blocked` | `false` | `Some transactions were already imported for this account.` |
| `anna@example.com` | `` | `Food, Transport` | `tx_010` | `duplicate_blocked` | `false` | `Some categories and transactions already exist in your migration history.` |
| `bob@example.com` | `Savings` | `Salary` | `` | `duplicate_blocked` | `false` | `This backup contains source records already imported for your account.` |

### Scenario: Validation Failure From Mismatched Export Pair

**Given** a signed-in user uploads `.mmbak` and `.xls` files from different export sessions
**When** validation compares totals and detects a mismatch
**Then** the job reaches `failed` and the UI shows actionable validation details without starting import

#### Examples

| db_income | db_expense | xls_income | xls_expense | final_phase | can_confirm_import | user_message |
|-----------|------------|------------|-------------|-------------|--------------------|--------------|
| `2500.00` | `1275.50` | `2500.00` | `1150.00` | `failed` | `false` | `Validation failed: the totals do not match.` |
| `5120.50` | `3450.00` | `5000.00` | `3200.00` | `failed` | `false` | `Please upload files generated from the same Money Manager export session.` |
| `980.00` | `420.00` | `980.00` | `0.00` | `failed` | `false` | `Validation failed before import. Review the uploaded files and try again.` |

### Scenario: Auth Required For Migration Access

**Given** a browser session without a valid authenticated JarWise user
**When** it tries to create or poll a migration job
**Then** the backend rejects the request and no migration data is exposed

#### Examples

| request | auth_state | status_code | result |
|---------|------------|-------------|--------|
| `POST /api/v1/migrations/money-manager/jobs` | `missing` | `401` | `Authentication required.` |
| `GET /api/v1/migrations/money-manager/jobs/job-123` | `expired` | `401` | `Session expired. Please sign in again.` |
| `POST /api/v1/migrations/money-manager/jobs/job-123/confirm` | `job belongs to another user` | `404` | `Migration job not found for the current authenticated user.` |
