# Walkthrough: Backend Implementation for Data Migration (Issue 65)

This document details the backend structure and logic implemented to support migrating data from the Money Manager application to JarWise.

## 1. Architecture Overview

The backend is built using **Go** and follows a clean architecture pattern:
- **`cmd/server`**: Entry point.
- **`internal/api`**: HTTP Handlers and Router.
- **`internal/service`**: Business logic (File processing, migration flow).
- **`internal/parser`**: Logic to extract data from `.mmbak` (SQLite) and `.xls` (HTML) files.
- **`internal/validator`**: Comparison logic to ensure data integrity.
- **`internal/importer`**: Mapping logic to transform external data into JarWise domain models.

## 2. Key Components

### 2.1 Parsers
- **`MmbakParser`**: Uses `go-sqlite3` to query the SQLite database directly.
  - **Tables Used:** `ASSETS` (Wallets), `ZCATEGORY` (Categories), `INOUTCOME` (Transactions).
  - **Schema Handling:** Adapted to real Money Manager schema (using `uid` and specific column names).
- **`XlsParser`**: Parses the "Fake XLS" (HTML Table) exported by the app using `golang.org/x/net/html`.

### 2.2 Validation Logic
- Compares **Total Income/Expense** and **Transaction Counts** between the DB and XLS report.
- Returns detailed errors if discrepancies exceed thresholds.
- **Current Status:** successfully detects mismatches (e.g., 9475 vs 10414 transactions).

### 2.3 API Endpoint
- **POST** `/api/v1/migrations/money-manager`
- **Inputs:** `mmbak_file` (multipart), `xls_file` (multipart)
- **Response:** JSON with status, validation results, and job ID.

## 3. Verification Results

Tested via `curl` with real user data:

```json
{
  "status": "error",
  "message": "Validation failed. Discrepancies found."
}
```

The system correctly identified that the parsed SQLite data (9475 records) did not match the XLS report (10414 records), preventing an invalid import.

## 4. Next Steps
- Implement frontend integration to call this API.
- Refine validation rules to handle "Transfers" which might be causing the count mismatch.
- Connect the `Importer` to the real JarWise Postgres database.
