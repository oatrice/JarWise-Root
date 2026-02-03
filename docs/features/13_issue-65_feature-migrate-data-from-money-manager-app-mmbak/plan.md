# Implementation Plan: Migrate Data from Money Manager App (.mmbak)

> **Refers to**: [Spec: Money Manager Data Migration](./spec.md)
> **Status**: Draft

## 1. Architecture & Design
The implementation will follow a client-server architecture. The Android client will provide the user interface for file selection and status display. The core processing logic—parsing, validation, and data insertion—will be handled by a new backend service. This approach offloads complex and potentially long-running tasks from the user's device, ensuring a responsive UI and robust processing.

The process will be exposed via a new REST API endpoint that accepts a multipart form data request containing both the `.mmbak` and `.xls` files.

### Component View
> [!IMPORTANT]
> **Platform Scope Policy:**
> - **Android**: Full implementation with production-ready code and tests.
> - **Web**: Mock UI only for this phase.
>
> **Development Order:** Web Mock UI FIRST → Android Full Implementation SECOND.

- **Modified Components**:
    - `SettingsScreen` (Android/Web): A new navigation item "Data Migration" will be added.
    - `Backend API Router`: A new route will be added to handle migration requests.

- **New Components**:
    - **Backend**:
        - `MigrationController`: A new controller to handle the `/api/v1/migrations/money-manager` endpoint.
        - `MoneyManagerMigrationService`: The main service orchestrating the entire migration flow.
        - `MmbakParser`: A utility class to read the `.mmbak` (SQLite) file and extract data into DTOs.
        - `XlsReportParser`: A utility class to parse the `.xls` (HTML) file and extract summary totals.
        - `MigrationRepository`: A data access class responsible for inserting the mapped data into the JarWise database within a single transaction.
    - **Android**:
        - `MigrationUploadScreen.kt`: A new screen for uploading the two required files.
        - `MigrationStatusScreen.kt`: A screen to display the progress, validation result (preview/error), and final status.
        - `MigrationViewModel.kt`: A ViewModel to manage the state and logic for the migration flow on the client side.
    - **Web**:
        - `MigrationUploadScreen.js`: A mock UI screen for the file upload interface.
        - `MigrationStatusScreen.js`: A mock UI screen for displaying status.

- **Dependencies**:
    - **Backend (Python)**:
        - `sqlite3`: Standard library for reading the `.mmbak` database file.
        - `beautifulsoup4`: For parsing the HTML content of the `.xls` report file.
        - `python-multipart`: For handling file uploads in the web framework (e.g., FastAPI).

### Data Model Changes
No changes are required to the existing JarWise database schema (`wallets`, `jars`, `transactions`). This feature will only perform `INSERT` operations into these tables.

---

## 2. Step-by-Step Implementation

### Step 1: Backend - API Endpoint and Service Scaffolding
- **Goal**: Create the basic structure for the migration feature on the backend.
- **Code**:
    - Create a new API endpoint `POST /api/v1/migrations/money-manager` that accepts two file uploads (`database_backup`, `exported_report`).
    - Create the `MoneyManagerMigrationService` class with placeholder methods for `process_and_validate` and `commit_import`.
    - The initial endpoint will simply accept the files and return a static JSON response, e.g., `{"status": "received"}`.
- **Files**:
    - `backend/app/api/v1/endpoints/migrations.py` (New)
    - `backend/app/services/migration_service.py` (New)
- **Verification**:
    - Use `curl` or Postman to send a multipart/form-data request with two dummy files to the new endpoint.
    - Verify that the server responds with a `200 OK` status and the expected JSON payload.

### Step 2: Backend - `.mmbak` (SQLite) Parser
- **Goal**: Implement the logic to read and extract data from the Money Manager database backup.
- **Code**:
    - Create an `MmbakParser` class.
    - Implement a method that takes the path to the `.mmbak` file as input.
    - Use the `sqlite3` library to connect to the file as a database.
    - Execute SQL queries to select all records from the `account`, `category`, and `trans` tables.
    - Map the raw SQL results into structured data transfer objects (DTOs) or simple dictionaries.
    - The parser should also calculate the total income and total expense from the transaction data.
- **Files**:
    - `backend/app/services/parsers/mmbak_parser.py` (New)
    - `backend/app/tests/parsers/test_mmbak_parser.py` (New)
- **Verification**:
    - Write a unit test that provides a sample `.mmbak` file (as specified in SBE).
    - Assert that the parser correctly extracts the expected number of accounts, categories, and transactions.
    - Assert that the calculated income and expense totals match the SBE scenario.

### Step 3: Backend - `.xls` (HTML) Report Parser
- **Goal**: Implement the logic to parse the validation report and extract summary totals.
- **Code**:
    - Create an `XlsReportParser` class.
    - Implement a method that takes the path to the `.xls` file as input.
    - Use the `BeautifulSoup` library to parse the file content as HTML.
    - Implement logic to find the specific table cells or tags containing "Total Income" and "Total Expense" and extract their corresponding monetary values.
    - Handle potential formatting issues like currency symbols or commas.
- **Files**:
    - `backend/app/services/parsers/xls_report_parser.py` (New)
    - `backend/app/tests/parsers/test_xls_report_parser.py` (New)
- **Verification**:
    - Write a unit test that provides a sample `.xls` file (as specified in SBE).
    - Assert that the parser correctly extracts the floating-point values for total income and total expense.

### Step 4: Backend - Validation and Preview Logic
- **Goal**: Integrate the parsers to perform cross-validation and generate a preview or error response.
- **Code**:
    - In `MoneyManagerMigrationService`, implement the `process_and_validate` method.
    - This method will call both the `MmbakParser` and `XlsReportParser`.
    - It will compare the calculated totals from the `.mmbak` data with the extracted totals from the `.xls` data.
    - If they match, it will return a success response containing the preview data (counts of wallets, jars, transactions).
    - If they don't match, it will return a detailed error response as specified in the SBE.
- **Files**:
    - `backend/app/services/migration_service.py` (Modify)
    - `backend/app/tests/services/test_migration_service.py` (New)
- **Verification**:
    - Write integration tests for the service layer.
    - Test the "happy path" with matching sample files and assert the correct preview data is returned.
    - Test the "unhappy path" with mismatched sample files and assert the correct error structure and values are returned.

### Step 5: Backend - Transactional Data Import
- **Goal**: Implement the final, atomic database write operation.
- **Code**:
    - Create a `MigrationRepository` with a method like `save_money_manager_data`.
    - This method must wrap all database `INSERT` statements within a single database transaction.
    - In `MoneyManagerMigrationService`, create a `commit_import` method that takes the parsed data, maps it to the JarWise schema (`Account` -> `Wallet`, `Category` -> `Jar`, etc.), and calls the repository to save it.
    - The API endpoint will be updated to have two stages: 1) Validate, 2) Commit. The client will call the commit stage after the user confirms the preview.
- **Files**:
    - `backend/app/data/repositories/migration_repository.py` (New)
    - `backend/app/services/migration_service.py` (Modify)
- **Verification**:
    - Write an integration test that calls the full import process.
    - After the call, query the database directly to verify that all wallets, jars, and transactions were created correctly.
    - Add a test that simulates a database error midway through the import and verify that the transaction is rolled back (no partial data is left in the database).

### Step 6: Web - Mock UI Implementation
- **Goal**: Create the non-functional UI for the web platform as per the development policy.
- **Code**:
    - Create React components for `MigrationUploadScreen` and `MigrationStatusScreen`.
    - The upload screen will have two `<input type="file">` elements and a disabled "Import" button.
    - The status screen will have static layouts for the preview, success, and error states.
    - Add navigation from `SettingsScreen` to the new `MigrationUploadScreen`.
- **Files**:
    - `web/src/screens/MigrationUploadScreen.js` (New)
    - `web/src/screens/MigrationStatusScreen.js` (New)
    - `web/src/navigation/AppNavigator.js` (Modify)
- **Verification**:
    - Manually navigate through the web application.
    - Confirm the "Data Migration" option appears in Settings.
    - Confirm the upload and status screens are displayed correctly, though non-functional.

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

---

## 3. Verification Plan
*How will we verify success?*

> [!IMPORTANT]
> **Android Build Policy**: MUST use scripts in `Android/scripts/` (e.g., `build_android.sh`) instead of direct `./gradlew` to ensure correct JDK version (Java 21).

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
