# Technical Analysis: Issue #56

**Title:** [Web | Android] Enhance Add Transaction (Date & Wallet)

## 1. Summary

This document outlines the technical approach to enhance the "Add Transaction" feature. The core goals are to allow users to specify a precise date and time for a transaction and to introduce the concept of a "Wallet" as the source of funds, distinct from the expense "Jar" (category).

The implementation will be phased:
- **Phase 1 (Web):** Focus on building the UI/UX components with mocked data and logic.
- **Phase 2 (Android):** A full-stack implementation including native UI and database integration.

This analysis primarily details the work required for Phase 1 (Web) and outlines the necessary backend and database changes that will be required for full functionality.

## 2. Scope of Work

### In Scope

- **Web (Phase 1):**
    - Create a reusable Date & Time Picker component for the "Add Transaction" form. It must default to the current date and time.
    - Create a reusable Wallet Selector component (e.g., a dropdown).
    - Integrate both new components into the existing "Add Transaction" form/modal.
    - For this initial phase, the list of wallets will be hardcoded or stored in `localStorage`.
    - The form's `onSubmit` handler will be a mock function that logs the selected data to the console or stores it in `localStorage`.

- **Future Work (Implied for full feature):**
    - Backend API modifications to accept `transactionDate` and `walletId`.
    - Database schema changes to the `transactions` table and the creation of a new `wallets` table.
    - Full implementation on Android, including native UI and Room database integration.

### Out of Scope

- **For Phase 1 (Web):**
    - Backend API development or changes.
    - Database schema migrations.
    - User functionality to create, edit, or delete wallets.
    - Any reporting or analytics features based on wallets.
    - Full end-to-end data persistence to the database.

## 3. Proposed Solution

This solution assumes a React/Next.js frontend and a Node.js/Express backend with a PostgreSQL/MySQL database.

### Frontend (Web - Phase 1)

1.  **Date/Time Picker Component (`DateTimePicker.tsx`):**
    - **Library:** We will leverage a well-supported library like `react-datepicker` or the date picker component from an existing UI library (e.g., Material-UI, Ant Design) to ensure accessibility and a good user experience.
    - **State:** The component will be controlled, receiving its `value` and an `onChange` handler from the parent form.
    - **Implementation:**
        ```jsx
        // In AddTransactionForm.tsx
        const [transactionDate, setTransactionDate] = useState(new Date());

        <DateTimePicker
          selected={transactionDate}
          onChange={(date) => setTransactionDate(date)}
          showTimeSelect
          dateFormat="Pp" // e.g., "9/27/2023, 3:30 PM"
        />
        ```

2.  **Wallet Selector Component (`WalletSelector.tsx`):**
    - **UI:** A standard `<select>` dropdown element will be used for simplicity.
    - **Data:** For Phase 1, a mock array of wallet objects will be defined.
        ```javascript
        const mockWallets = [
          { id: 'w1', name: 'Cash' },
          { id: 'w2', name: 'Bank Account' },
          { id: 'w3', name: 'Credit Card' },
        ];
        ```
    - **Implementation:**
        ```jsx
        // In AddTransactionForm.tsx
        const [selectedWalletId, setSelectedWalletId] = useState('');

        <WalletSelector
          wallets={mockWallets}
          value={selectedWalletId}
          onChange={(e) => setSelectedWalletId(e.target.value)}
        />
        ```

3.  **Add Transaction Form (`AddTransactionForm.tsx`):**
    - The form's state will be expanded to include `transactionDate` and `selectedWalletId`.
    - The `onSubmit` handler will be updated to collect these new values and log them.
        ```javascript
        const handleSubmit = (event) => {
          event.preventDefault();
          const transactionData = {
            // ... other fields like amount, description, jarId
            walletId: selectedWalletId,
            transactionDate: transactionDate.toISOString(),
          };
          console.log('Submitting transaction:', transactionData);
          // Or: localStorage.setItem('lastTransaction', JSON.stringify(transactionData));
        };
        ```

## 4. Impact Analysis

-   **Frontend:**
    -   **Modified Components:** `AddTransactionForm.tsx` will be significantly updated.
    -   **New Components:** `DateTimePicker.tsx`, `WalletSelector.tsx`.
    -   **State Management:** The global state (if using Redux/Zustand) will eventually need a `wallets` slice. For Phase 1, local component state is sufficient.
    -   **Display Components:** Any component that lists or shows transaction details will need to be updated in the future to display the transaction date and wallet source.

-   **Backend (Future):**
    -   The Transaction creation service and controller will require modification to handle the new fields.
    -   A new `Wallets` service, controller, and routes will be needed (`GET /api/wallets`, `POST /api/wallets`, etc.).
    -   Authorization logic must be updated to ensure users can only access and use their own wallets.

-   **Database (Future):**
    -   A schema migration will be required. This is a high-impact change.
    -   Existing records in the `transactions` table will need to be backfilled. A default `wallet_id` could be created for each user, and `transaction_date` could be populated from the existing `created_at` timestamp.

## 5. Data Model & API Changes (For Full Implementation)

### Data Model Changes

**`transactions` Table:**
-   Add column: `transaction_date` (Type: `TIMESTAMP WITH TIME ZONE`, not nullable).
-   Add column: `wallet_id` (Type: `UUID` or `INTEGER`, foreign key referencing `wallets.id`, not nullable).

**New `wallets` Table:**
-   `id` (PK, `UUID` or `SERIAL`)
-   `user_id` (FK, `UUID` or `INTEGER`, references `users.id`)
-   `name` (`VARCHAR(255)`, not nullable)
-   `type` (`VARCHAR(50)`, e.g., 'CASH', 'BANK', 'CREDIT_CARD')
-   `created_at` (`TIMESTAMP`)
-   `updated_at` (`TIMESTAMP`)

### API Changes

**`POST /api/transactions` (Modified)**
-   The request body will be updated to include the new optional fields.
-   **Request Body:**
    ```json
    {
      "amount": 15.75,
      "description": "Lunch with team",
      "jarId": "jar-uuid-123",
      "walletId": "wallet-uuid-456",
      "transactionDate": "2023-10-27T13:30:00.000Z"
    }
    ```

**`GET /api/wallets` (New)**
-   Fetches a list of wallets for the authenticated user.
-   **Response Body (200 OK):**
    ```json
    [
      { "id": "wallet-uuid-456", "name": "Bank Account" },
      { "id": "wallet-uuid-789", "name": "Cash" }
    ]
    ```

## 6. Testing Strategy (Phase 1)

-   **Unit Tests (Jest / React Testing Library):**
    -   Verify that the `DateTimePicker` component renders correctly and calls its `onChange` handler when a new date is selected.
    -   Verify that the `WalletSelector` component renders the list of mock wallets and calls its `onChange` handler on selection.
    -   Test the `AddTransactionForm` to ensure it correctly initializes state and aggregates all form data, including the new fields, upon submission.

-   **End-to-End Tests (Cypress / Playwright):**
    -   A test script will navigate to the "Add Transaction" form.
    -   It will interact with the date picker to select a past date/time.
    -   It will select a wallet from the dropdown.
    -   It will fill in the remaining fields and submit the form.
    -   The test will assert that the mocked submission handler was called with the correct, complete data payload.

## 7. Assumptions & Risks

-   **Assumptions:**
    -   A standard UI component library is in use, or we have the green light to add a library like `react-datepicker`.
    -   The existing "Jar" selection logic is stable and will not be affected.
    -   The UI/UX design for the updated form is straightforward and does not require extensive design work.

-   **Risks:**
    -   **UX Complexity:** Adding two new required fields to the form could make it feel cluttered. Careful placement and design are needed to maintain a smooth user experience.
    -   **Future Data Migration:** The strategy for migrating existing production data (transactions created before this feature) needs to be carefully planned to avoid data integrity issues. This is the most significant risk for the full feature rollout.

## 8. Effort Estimation (Phase 1 - Web UI Only)

-   **Frontend Development:** **Medium (M)**
    -   Component creation (Date Picker, Wallet Selector): 3 Story Points
    -   Form integration, state management, and mock logic: 5 Story Points
-   **Testing (Unit & E2E):** **Small (S)**
    -   Writing tests for new components and updating form tests: 3 Story Points

**Total Estimated Effort (Phase 1): ~11 Story Points**