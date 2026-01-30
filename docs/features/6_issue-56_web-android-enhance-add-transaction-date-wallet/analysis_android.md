# Technical Analysis Document

**Issue:** #56 - [Web | Android] Enhance Add Transaction (Date & Wallet)

---

### 1. Summary

This document outlines the technical plan to enhance the "Add Transaction" feature. The core changes involve adding a date/time picker to allow users to specify when a transaction occurred and introducing a "Wallet" selector to distinguish the source of funds (e.g., Cash, Bank) from the expense category ("Jar"). The implementation will be phased, starting with a UI/UX mock on the Web platform, followed by a full-featured implementation on Android.

### 2. Problem Statement

The current "Add Transaction" functionality is too basic for practical use. It lacks two critical features:
1.  **Temporal Flexibility:** All transactions are implicitly recorded at the time of creation, preventing users from back-dating expenses or logging them later.
2.  **Source Ambiguity:** The form doesn't differentiate between the source of the money (the "Wallet") and its purpose (the "Jar"). This prevents users from tracking balances across different accounts (e.g., cash on hand vs. bank account balance).

This enhancement aims to solve these problems by providing users with more control and clarity when logging their financial activities.

### 3. Proposed Solution

The solution is divided into two phases, prioritizing the web UI first.

#### **Phase 1: Web (UI/UX Mock)**

This phase focuses on building the user interface in the React/Next.js frontend without requiring immediate backend changes.

*   **Component Modification:** The primary changes will be within the `AddTransactionForm` component.
*   **Date/Time Picker:**
    *   Integrate a well-established date picker library like `react-datepicker` or use a pre-built component from a UI library (e.g., Material-UI, Ant Design).
    *   The component will be configured to select both date and time.
    *   It will default to the current date and time (`new Date()`).
    *   The selected value will be managed in the component's local state (e.g., using a `useState` hook).
*   **Wallet Selector:**
    *   A new `<select>` dropdown or a custom dropdown component will be added to the form, labeled "Source" or "Wallet".
    *   For this mock phase, the options will be populated from a hardcoded array of objects, for example:
        ```javascript
        const mockWallets = [
          { id: 'w1', name: 'Cash' },
          { id: 'w2', name: 'Main Bank Account' },
          { id: 'w3', name: 'Credit Card' }
        ];
        ```
*   **Data Handling:**
    *   The form's submission logic will be updated to collect the new `transactionDate` and `selectedWalletId` values.
    *   On submit, the complete transaction object (including the new fields) will be serialized and saved to the browser's `localStorage` to simulate persistence.

#### **Phase 2: Android (Full Integration)**

This phase involves a complete, functional implementation on the Android platform.

*   **UI Implementation:**
    *   **Date/Time Selection:** Implement native `DatePickerDialog` and `TimePickerDialog` triggered from a button or text field on the "Add Transaction" screen. The selected date and time will be stored in the `ViewModel`.
    *   **Wallet Selection:** A `Spinner` (dropdown) will be used for wallet selection. It will be populated with data fetched from the local Room database.
*   **Database (Room):**
    *   The `Transaction` entity will be updated to include two new fields:
        *   `transactionDate: Long` (to store the Unix timestamp).
        *   `walletId: Long` (as a foreign key to the `Wallet` entity).
    *   A new `Wallet` entity and corresponding `WalletDao` will be created to store and retrieve wallet information.
*   **Data Layer:**
    *   The `TransactionRepository` and `WalletRepository` will be updated/created to handle fetching wallet lists and saving transactions with the new fields to the Room database.
    *   The `AddTransactionViewModel` will manage the UI state, including the list of available wallets and the user's form input.

### 4. Impact Analysis

*   **Frontend (Web & Android):**
    *   **High Impact:** The "Add Transaction" screen/component will undergo significant modification to accommodate the new UI elements. State management logic will need to be updated.
    *   **Low Impact:** The transaction list view and transaction detail view will need minor updates to display the new `transactionDate` and `walletName`.

*   **Backend (for Full Integration):**
    *   **High Impact:** The `transactions` table schema must be altered. A new `wallets` table is required. This will necessitate a database migration.
    *   **High Impact:** API endpoints for creating and retrieving transactions must be updated. A new endpoint for fetching wallets is required.

*   **Database (for Full Integration):**
    *   **`transactions` Table:**
        *   Add column `transaction_date` (Type: `TIMESTAMP WITH TIME ZONE`, Default: `CURRENT_TIMESTAMP`, Not Null).
        *   Add column `wallet_id` (Type: `UUID` or `BIGINT`, Foreign Key to `wallets.id`, Not Null).
    *   **New `wallets` Table:**
        *   `id` (PK, `UUID` or `BIGINT`)
        *   `user_id` (FK to `users.id`)
        *   `name` (VARCHAR(100), Not Null)
        *   `type` (VARCHAR(50), e.g., 'CASH', 'BANK', 'CREDIT_CARD')
        *   `created_at` (TIMESTAMP)

### 5. API Changes (for Full Integration)

*   **`POST /api/v1/transactions` (Modify)**
    *   **Purpose:** Create a new transaction.
    *   **Request Body (Additions):**
        ```json
        {
          "amount": 15.75,
          "description": "Lunch",
          "jarId": "j-abc-123",
          "walletId": "w-def-456", // New
          "transactionDate": "2023-10-27T12:30:00Z" // New, ISO 8601 format
        }
        ```

*   **`GET /api/v1/wallets` (New)**
    *   **Purpose:** Fetch the list of wallets for the authenticated user.
    *   **Response Body (Example):**
        ```json
        [
          { "id": "w-def-456", "name": "Main Bank Account", "type": "BANK" },
          { "id": "w-ghi-789", "name": "Cash", "type": "CASH" }
        ]
        ```

*   **`GET /api/v1/transactions` (Modify)**
    *   The response objects in the array should be updated to include `transactionDate` and wallet information.
        ```json
        {
          "id": "t-xyz-987",
          "amount": 15.75,
          "description": "Lunch",
          "transactionDate": "2023-10-27T12:30:00Z", // New
          "wallet": { // New
            "id": "w-def-456",
            "name": "Main Bank Account"
          },
          "jar": { /* ... */ }
        }
        ```

### 6. Tasks & Sub-tasks

#### **Phase 1: Web**
-   [ ] **UI:** Modify `AddTransactionForm` component layout.
-   [ ] **Component:** Add and configure a Date/Time Picker component.
-   [ ] **Component:** Add a "Wallet" `<select>` dropdown.
-   [ ] **Data:** Create a mock data array for the wallet list.
-   [ ] **State:** Update form's state management (`useState`/Redux) to handle `date` and `walletId`.
-   [ ] **Logic:** Implement `onSubmit` handler to save the complete transaction object to `localStorage`.
-   [ ] **UI:** Update the transaction list view to read from `localStorage` (for mocking) and display the new fields.

#### **Phase 2: Backend & Full Integration**
-   [ ] **DB:** Write a migration script to add `transaction_date` and `wallet_id` to the `transactions` table.
-   [ ] **DB:** Write a migration script to create the `wallets` table.
-   [ ] **API:** Create `Wallet` model, controller, and service.
-   [ ] **API:** Implement the `GET /api/v1/wallets` endpoint with authentication.
-   [ ] **API:** Update the `createTransaction` controller and service to accept and save `transactionDate` and `walletId`.
-   [ ] **API:** Update the `getTransactions` service to join wallet information and include it in the response.

### 7. Assumptions & Risks

*   **Assumptions:**
    *   A "Jar" selection component already exists and is functional.
    *   A user authentication system is in place, and the backend can identify the current user for all API requests.
    *   The existing frontend architecture (React/Next.js) can easily accommodate a new date-picker library.
*   **Risks:**
    *   **Date/Timezone Complexity:** Handling timezones correctly can be complex. The standard practice of storing all dates in UTC (as ISO 8601 strings) and converting them on the client-side should be strictly followed.
    *   **Scope Creep:** The introduction of "Wallets" may lead to requests for related features like wallet balance tracking, transfers between wallets, or wallet management screens. This issue must remain strictly focused on selecting a wallet during transaction creation.

### 8. Out of Scope

*   Creating, editing, or deleting wallets.
*   Calculating and displaying wallet balances.
*   Implementing transfers between wallets.
*   Editing existing transactions to add a date or wallet.