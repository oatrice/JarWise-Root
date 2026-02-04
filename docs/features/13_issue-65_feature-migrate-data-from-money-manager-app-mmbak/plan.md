# Implementation Plan: Migrate Data from Money Manager App (.mmbak)

> **Refers to**: [Spec: Money Manager Data Migration](./spec.md)
> **Status**: Verified Plan

## 1. Architecture & Design
The implementation will follow a client-server architecture. The Android client will provide the user interface for file selection and status display. The core processing logic—parsing, validation, and data insertion—will be handled by a new **backend service written in Go**. This approach offloads complex and potentially long-running tasks from the user's device, ensuring a responsive UI and robust processing.

The process will be exposed via a new REST API endpoint that accepts a multipart form data request containing both the `.mmbak` and `.xls` files.

### Component View
> [!IMPORTANT]
> **Platform Scope Policy:**
> - **Android**: Full implementation with production-ready code and tests.
> - **Web**: Mock UI only for this phase.
>
> **Development Order:** **Web Mock UI FIRST** → Android Full Implementation / Backend SECOND.

- **Modified Components**:
    - `SettingsScreen` (Android/Web): A new navigation item "Data Migration" will be added.
    - `Backend API Router`: A new route group for migrations.

- **New Components**:
    - **Backend (Go)**:
        - `MigrationHandler`: A new HTTP handler (controller) to handle the `/api/v1/migrations/money-manager` endpoint.
        - `MigrationService`: The main service orchestrating the entire migration flow.
        - `MmbakParser`: A utility (struct/interface) to read the `.mmbak` (SQLite) file and extract data types.
        - `XlsReportParser`: A utility to parse the `.xls` (HTML) file and extract summary totals.
        - `MigrationRepo`: A repository interface responsible for inserting the mapped data into the JarWise database within a single transaction.
    - **Android**:
        - `MigrationUploadScreen.kt`: A new screen for uploading the two required files.
        - `MigrationStatusScreen.kt`: A screen to display the progress, validation result (preview/error), and final status.
        - `MigrationViewModel.kt`: A ViewModel to manage the state and logic for the migration flow on the client side.
    - **Web**:
        - `MigrationUploadScreen.js`: A mock UI screen for the file upload interface.
        - `MigrationStatusScreen.js`: A mock UI screen for displaying status.

- **Dependencies**:
    - **Backend (Go)**:
        - `github.com/mattn/go-sqlite3`: Driver for reading the `.mmbak` SQLite database file.
        - `golang.org/x/net/html` or similar: For parsing the HTML content of the `.xls` report file (or standard `encoding/xml` if applicable, but description says HTML).
        - Standard `net/http` or `gin/echo`: For handling file uploads and routing.

### Data Model Changes
No changes are required to the existing JarWise database schema (`wallets`, `jars`, `transactions`). This feature will only perform `INSERT` operations into these tables.

### Deployment Strategy
**Cloud Run (Google Cloud)** is the selected deployment target.
- **Why**: Handles containerized Go binaries efficiently, scales to zero when not in use (cost-effective), and provides a robust environment for SQLite processing compared to Function-as-a-Service.
- **Configuration**:
    - Dockerfile optimized for Go (multi-stage build).
    - Memory limit: 512MB - 1GB (to handle parsing of large DBs).
    - Timeout: 300s (5 mins) to ensure large migrations complete.

---

## 2. Step-by-Step Implementation

### Step 1: Web - Mock UI Implementation (PRIORITY)
- **Goal**: Create the non-functional UI for the web platform first to visualize the flow, including success/failure states.
- **Code**:
    - Create React components for `MigrationUploadScreen` and `MigrationStatusScreen`.
    - The upload screen will have two `<input type="file">` elements and a disabled "Import" button.
    - **Enhanced Status Screen**: Implement static states for:
        - **Loading**: Spinner with "Parsing files..." text.
        - **Preview**: Table showing "Found 3 Wallets, 12 Jars, 450 Transactions".
        - **Success**: Green checkmark with "Import Complete" message.
        - **Failure**: Red alert box with "Validation Failed: Income mismatch (DB: 500 vs Report: 550)".
    - Add navigation from `SettingsScreen` to the new `MigrationUploadScreen`.
- **Files**:
    - `web/src/screens/MigrationUploadScreen.js` (New)
    - `web/src/screens/MigrationStatusScreen.js` (New)
    - `web/src/navigation/AppNavigator.js` (Modify)
- **Verification**:
    - Manually navigate through the web application.
    - Confirm the "Data Migration" option appears in Settings.
    - Confirm the upload and status screens are displayed correctly.

### Step 2: Backend - API Endpoint and Service Scaffolding (Go)
- **Goal**: Create the basic structure for the migration feature on the backend in Go.
- **Code**:
    - Define a new struct `MigrationData` to hold the uploaded files' metadata/paths temporarily.
    - Create a `MigrationHandler` with a method `HandleUpload` mapped to `POST /api/v1/migrations/money-manager`.
    - Create the `MigrationService` interface and implementation.
    - The initial handler should parse the multipart form, validate file presence, and return a JSON response `{"status": "received"}`.
- **Files**:
    - `backend/internal/api/handlers/migration_handler.go` (New)
    - `backend/internal/service/migration_service.go` (New)
    - `backend/cmd/server/routes.go` (Modify)
- **Verification**:
    - Use `curl` or Postman to send a multipart/form-data request with two dummy files.
    - Verify `200 OK` and JSON response.

### Step 3: Backend - `.mmbak` (SQLite) Parser (Go)
- **Goal**: Implement the logic to read and extract data from the Money Manager database backup.
- **Code**:
    - Create an `MmbakParser` struct.
    - Use `database/sql` with `github.com/mattn/go-sqlite3` to open the uploaded file as a readonly DB.
    - Execute SQL queries to select from `account`, `category`, and `trans`.
    - Map rows to struct definitions (`AccountDTO`, `CategoryDTO`, `TransactionDTO`).
    - Calculate total income and expense in Go or via SQL aggregation.
- **Files**:
    - `backend/internal/parser/mmbak_parser.go` (New)
    - `backend/internal/parser/mmbak_parser_test.go` (New)
- **Verification**:
    - Write a Go unit test with a sample `.mmbak` file.
    - Assert correct counts and totals.

### Step 4: Backend - `.xls` (HTML) Parser (Go)
- **Goal**: Implement the logic to parse the validation report (HTML format) and extract summary totals.
- **Code**:
    - Create an `XlsReportParser` struct.
    - Use `golang.org/x/net/html` (or `goquery`) to parse the file content.
    - Implement logic to traverse the DOM, find specific table cells for "Total Income" and "Total Expense".
    - specific string parsing helper to handle currency symbols and commas.
- **Files**:
    - `backend/internal/parser/xls_parser.go` (New)
    - `backend/internal/parser/xls_parser_test.go` (New)
- **Verification**:
    - Write a Go unit test with a sample `.xls` file.
    - Assert correct float extraction.

### Step 5: Backend - Validation and Preview Logic
- **Goal**: Integrate parsers to perform cross-validation.
- **Code**:
    - In `MigrationService.ProcessAndValidate`, call both parsers.
    - Compare totals (using a small epsilon for float comparison if needed).
    - Return `MigrationPreviewResponse` on success or `MigrationErrorResponse` on failure.
- **Files**:
    - `backend/internal/service/migration_service.go` (Modify)
    - `backend/internal/service/migration_service_test.go` (New)
- **Verification**:
    - Integration tests for service layer (mocking parsers or using real files).

### Step 6: Backend - Transactional Data Import
- **Goal**: Implement final atomic database write.
- **Code**:
    - In `MigrationRepo`, implement `SaveMoneyManagerData(ctx, data)`.
    - Use `tx, err := db.BeginTx(ctx, options)` to start a transaction.
    - Iterate and validly insert Wallets, Jars, and Transactions.
    - `tx.Commit()` on success, `tx.Rollback()` on error.
    - Update controller to handle the "Commit" confirmation action if separated, or handle it in one go if designed that way (Plan implies 2 stages: Preview then Commit).
- **Files**:
    - `backend/internal/repository/migration_repo.go` (New)
    - `backend/internal/service/migration_service.go` (Modify)
- **Verification**:
    - Integration test with a real test database (e.g. SQLite in memory or Docker Postgres).
    - Verify Rollback on error.

### Step 7: Android - Full UI and ViewModel Implementation
- **Goal**: Build the complete, functional user interface on Android.
- **Code**:
    - Create the `MigrationUploadScreen` and `MigrationStatusScreen` using Jetpack Compose.
    - Implement file pickers for the `.mmbak` and `.xls` files.
    - Create the `MigrationViewModel` to handle UI state (loading, preview, success, error) and to interact with the backend API.
    - Use a state-driven approach where the UI observes state changes from the ViewModel.
- **Files**:
    - `Android/app/src/main/java/.../migration/MigrationUploadScreen.kt` (New)
    - `Android/app/src/main/java/.../migration/MigrationStatusScreen.kt` (New)
    - `Android/app/src/main/java/.../migration/MigrationViewModel.kt` (New)
    - `Android/app/src/main/java/.../navigation/AppNavGraph.kt` (Modify)
- **Verification**:
    - Run the app in an emulator.
    - Verify the UI components display correctly.
    - Verify that selecting files updates the UI state.
    - Unit test the `MigrationViewModel` logic using mock API responses.

### Step 8: Android - End-to-End Integration
- **Goal**: Connect the Android UI to the live backend API.
- **Code**:
    - Implement the API service calls in the Android networking layer (e.g., using Retrofit).
    - Update the `MigrationViewModel` to call the real API endpoints for validation and commit.
    - Handle multipart file uploading from the Android client.
- **Files**:
    - `Android/app/src/main/java/.../api/MigrationApiService.kt` (New/Modify)
    - `Android/app/src/main/java/.../migration/MigrationViewModel.kt` (Modify)
- **Verification**:
    - Perform a full manual end-to-end test as described in the Verification Plan below.
    - Full manual pass (Happy Path & Unhappy Path).

---

## 3. Verification Plan
*How will we verify success?*

> [!IMPORTANT]
> **Android Build Policy**: MUST use scripts in `Android/scripts/` (e.g., `build_android.sh`) to ensure correct JDK version (Java 21).

### Automated Tests
- [X] **Backend Unit Tests**: `backend/app/tests/parsers/` covering both `mmbak_parser` and `xls_report_parser` with valid and malformed sample files.
- [X] **Backend Integration Tests**: `backend/app/tests/services/test_migration_service.py` covering:
    - Successful validation and preview generation.
    - Failed validation due to mismatched totals.
    - Full, successful, transactional import.
    - Rolled-back import on simulated database error.
- [X] **Android ViewModel Tests**: `Android/app/src/test/java/.../migration/MigrationViewModelTest.kt` covering UI state transitions based on mock API responses.

### Manual Verification
- [ ] **Scenario 1 (Happy Path)**:
    - [ ] Navigate to `Settings > Data Migration`.
    - [ ] Upload the matching `.mmbak` and `.xls` files from SBE 1.
    - [ ] Verify a loading indicator is shown.
    - [ ] Verify the "Validation Successful" message and correct preview summary ("2 Wallets, 3 Jars, and 3 Transactions") are displayed.
    - [ ] Click "Confirm Import".
    - [ ] Verify the final "Import complete!" message is shown.
    - [ ] Navigate back to the main app screens and confirm that the "Checking" and "Savings" wallets, "Salary", "Groceries", and "Rent" jars, and the 3 corresponding transactions are present and accurate.

- [ ] **Scenario 2 (Validation Failure)**:
    - [ ] Navigate to `Settings > Data Migration`.
    - [ ] Upload the mismatched files from SBE 2.
    - [ ] Verify the specific "Validation Failed" error message is displayed, showing both the database totals and the report totals.
    - [ ] Verify that the import process is halted and no "Confirm" button is available.
    - [ ] Check the database to ensure no data was written.

- [ ] **Scenario 3 (Invalid File Type)**:
    - [ ] Navigate to `Settings > Data Migration`.
    - [ ] Attempt to upload a file with an incorrect extension (e.g., `.txt` or `.jpg`).
    - [ ] Verify the UI prevents selection or the backend returns a user-friendly "Invalid file format" error.

---

## 4. Future Work & Out of Scope
- **User Override on Validation Error**: Allowing users to force import despite validation mismatches (Risk of data corruption).
- **Import History**: Keeping a log of past imports.
- **Undo Import**: One-click rollback after session is closed (Architecture handles rollback on error during import, but not after commit).
