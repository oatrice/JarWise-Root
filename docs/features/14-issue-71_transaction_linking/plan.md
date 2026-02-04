# Implementation Plan: [Feature] Transaction Linking & Transfers

> **Refers to**: [Spec Link](./spec.md)
> **Status**: Draft

## 1. Architecture & Design
The implementation will focus on extending the existing `Transaction` data model and introducing new use cases to handle the lifecycle of linked transactions (transfers). The core logic will be encapsulated in the backend/domain layer to ensure consistency, with the Android UI being the primary client. The Web UI will be represented by static mockups in this phase.

### Component View
> [!IMPORTANT]
> **Platform Scope Policy:**
> - **Android**: Full implementation with production-ready code and tests.
> - **Web**: Mock UI only for this phase.
>
> **Development Order:** Web Mock UI FIRST → Android Full Implementation SECOND.

- **Modified Components**:
    - `data.model.Transaction`: Entity will be updated with a self-referencing link.
    - `data.repository.TransactionRepository`: Will be updated to handle creation, deletion, and querying of linked transactions.
    - `domain.use_case.DeleteTransactionUseCase`: Logic will be updated to handle unlinking before deletion.
    - `feature_add_edit_transaction.AddEditTransactionViewModel`: Will be enhanced to manage three modes (Expense, Income, Transfer).
    - `feature_add_edit_transaction.AddEditTransactionScreen`: UI will be updated with a mode selector and a new form for transfers.
    - `feature_transaction_detail.TransactionDetailViewModel`: Will be updated to fetch and provide linked transaction data.
    - `feature_transaction_detail.TransactionDetailScreen`: UI will be updated to display link information and provide navigation.
    - `domain.use_case.reporting.*`: All reporting use cases will be updated to exclude transfers by default.

- **New Components**:
    - `domain.use_case.CreateTransferUseCase`: A new use case to atomically create and link two transactions for a transfer.
    - `domain.use_case.UnlinkTransactionsUseCase`: A new use case to sever the link between two transactions.
    - `feature_add_edit_transaction.components.TransferForm`: A new composable for the transfer-specific input fields.
    - `feature_transaction_detail.components.LinkedTransactionInfo`: A new composable to display the link on the detail screen.

- **Dependencies**:
    - No new external libraries are anticipated. The implementation will use existing components from Jetpack Compose, Room, and Hilt/Koin for dependency injection.

### Data Model Changes
The `Transaction` entity will be modified to include a nullable field that points to its linked counterpart. This self-referencing foreign key establishes the one-to-one relationship.

```kotlin
// File: data/src/main/java/com/jarwise/data/model/Transaction.kt

@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val walletId: String,
    val type: TransactionType, // ENUM: INCOME, EXPENSE
    val amount: BigDecimal,
    val date: Instant,
    val notes: String?,
    
    // New field for FR1
    val linkedTransactionId: String? = null 
)
```
A database migration will be required to add the `linkedTransactionId` column to the `transactions` table.

---

## 2. Step-by-Step Implementation

### Step 0: Backend - Data Model and Repository Update
This foundational step prepares the database and data access layer for the new feature.

- **Code**:
    - **Modify `data/model/Transaction.kt`**: Add the `linkedTransactionId: String?` field.
    - **Create a new Room Migration**: Write a migration script to add the `linkedTransactionId` column to the `transactions` table.
    - **Update `data/dao/TransactionDao.kt`**: No immediate changes are needed for basic CRUD, but queries for reporting will be updated later.
- **Tests**:
    - **Update `data/TransactionDatabaseTest.kt`**: Add a test case to verify the migration runs successfully and the schema is correct.
- **Verification**:
    - The new migration script successfully applies to the database schema.
    - Existing unit tests for the repository and DAO continue to pass.

### Step 1: Web - UI Mockups
Create static mockups for the web interface to guide the Android implementation and gather early feedback.

- **Docs**:
    - Create Figma/PNG mockups for the following screens:
        1.  **Add Transaction Screen**: Showing the "Expense", "Income", and selected "Transfer" tabs. The "Transfer" form should display "From", "To", "Amount", "Date", and "Notes" fields.
        2.  **Transaction Detail Screen**: Showing a transaction that is part of a transfer, with a clear "Linked Transaction" section and a "View Transaction" button/link.
- **Code**: No code implementation. This step is purely for design and alignment.
- **Verification**:
    - Mockups are reviewed and approved by the project lead.
    - Mockups align with the UI/UX requirements in the specification.

### Step 2: Backend - Core Use Cases (Create, Unlink, Delete)
Implement the core business logic for managing transfers. This logic must be atomic and robust.

- **Code**:
    - **Create `domain/use_case/CreateTransferUseCase.kt`**:
        - Takes `fromWalletId`, `toWalletId`, `amount`, `date`, `notes` as input.
        - Validates that `fromWalletId` is not equal to `toWalletId`.
        - Creates two `Transaction` objects (one expense, one income) with unique IDs.
        - Sets `linkedTransactionId` on each object to the ID of the other.
        - Calls `transactionRepository.insertAllInTransaction(expenseTxn, incomeTxn)` to ensure atomicity.
    - **Modify `domain/use_case/DeleteTransactionUseCase.kt`**:
        - Before deleting the target transaction, check if `linkedTransactionId` is not null.
        - If it is, fetch the linked transaction.
        - Update the linked transaction by setting its `linkedTransactionId` to `null`.
        - Proceed with deleting the original transaction.
    - **Create `domain/use_case/UnlinkTransactionsUseCase.kt`**:
        - Takes a `transactionId` as input.
        - Fetches the transaction and its linked counterpart.
        - Updates both transactions, setting their `linkedTransactionId` to `null`.
- **Tests**:
    - **Create `domain/use_case/CreateTransferUseCaseTest.kt`**:
        - Test successful creation (two linked transactions are created).
        - Test failure when `fromWalletId` equals `toWalletId`.
    - **Update `domain/use_case/DeleteTransactionUseCaseTest.kt`**:
        - Add a test to verify that deleting a linked transaction unlinks its partner.
- **Verification**:
    - All new and existing unit tests pass.
    - The logic correctly enforces atomicity and data integrity rules.

### Step 3: Android - "Add Transfer" Screen Implementation
Implement the user interface for creating a new transfer.

- **Code**:
    - **Modify `features/add_edit_transaction/AddEditTransactionScreen.kt`**:
        - Add a `TabRow` to select the transaction mode (`Expense`, `Income`, `Transfer`).
        - Conditionally display the standard form or the new `TransferForm` based on the selected mode.
    - **Create `features/add_edit_transaction/components/TransferForm.kt`**:
        - A new composable containing dropdowns for "From" and "To" wallets, and inputs for amount, date, and notes.
    - **Modify `features/add_edit_transaction/AddEditTransactionViewModel.kt`**:
        - Add state to manage the selected mode.
        - Add state for the transfer form fields (`fromWallet`, `toWallet`, etc.).
        - Implement a function `createTransfer()` that calls the `CreateTransferUseCase`.
        - Add validation logic to prevent submission if `fromWallet` is the same as `toWallet`.
- **Tests**:
    - **Update `features/add_edit_transaction/AddEditTransactionViewModelTest.kt`**:
        - Add tests for the new transfer state management and validation logic.
- **Verification**:
    - The "Transfer" tab is visible and selectable on the Add Transaction screen.
    - The user can fill out the transfer form and submit it.
    - A successful submission creates two linked transactions in the database.
    - The form prevents submission if the source and destination wallets are identical.

### Step 4: Android - Transaction Detail Screen Update
Enhance the detail screen to display information about linked transactions.

- **Code**:
    - **Modify `features/transaction_detail/TransactionDetailViewModel.kt`**:
        - When fetching a transaction, check if `linkedTransactionId` is not null.
        - If it exists, fetch the summary details (e.g., amount, wallet name) of the linked transaction.
        - Expose the linked transaction data to the UI via `StateFlow`.
    - **Create `features/transaction_detail/components/LinkedTransactionInfo.kt`**:
        - A new composable that displays the linked transaction details (e.g., "↔️ Transfer with Savings Account").
        - Includes a clickable element to navigate to the linked transaction.
    - **Modify `features/transaction_detail/TransactionDetailScreen.kt`**:
        - Conditionally display the `LinkedTransactionInfo` composable if the view model indicates the transaction is part of a transfer.
        - Implement the navigation logic to open the detail screen for the linked transaction ID.
- **Verification**:
    - Open the detail view for a transaction that is part of a transfer.
    - The linked transaction information is clearly displayed.
    - Clicking the "View Transaction" link successfully navigates to the detail screen of the other transaction.
    - The info box is not visible for regular, unlinked transactions.

### Step 5: Backend - Reporting Logic Update
Adjust the financial reporting logic to exclude transfers from income/expense summaries by default.

- **Code**:
    - **Modify `data/dao/TransactionDao.kt`**:
        - Update queries used for reporting (e.g., `getIncomeSumForPeriod`, `getExpenseSumForPeriod`) to include `WHERE linkedTransactionId IS NULL`.
    - **Modify `domain/use_case/reporting/*`**:
        - Review all reporting use cases.
        - Add a boolean parameter `includeTransfers: Boolean = false` to relevant functions.
        - The use case will call the appropriate DAO method based on this parameter.
- **Tests**:
    - **Update reporting unit tests**:
        - Create a test scenario with income, expense, and transfer transactions.
        - Verify that the default report sum correctly excludes the transfer amount.
        - Verify that calling the report with `includeTransfers = true` includes the amount (if this feature is needed).
- **Verification**:
    - Generate a monthly summary report after creating a transfer.
    - The total income and expense figures should not be affected by the transfer amount.

---

## 3. Verification Plan
Successful completion will be verified through a combination of automated tests and a structured manual testing plan.

> [!IMPORTANT]
> **Android Build Policy**: MUST use scripts in `Android/scripts/` (e.g., `build_android.sh`) instead of direct `./gradlew` to ensure correct JDK version (Java 21).

### Automated Tests
- [ ] **Unit Tests**: All new and modified use cases, view models, and repository methods will have 100% test coverage for their business logic.
    - `CreateTransferUseCaseTest.kt`
    - `DeleteTransactionUseCaseTest.kt` (updated)
    - `AddEditTransactionViewModelTest.kt` (updated)
    - `TransactionDetailViewModelTest.kt` (updated)
    - `GenerateReportUseCaseTest.kt` (updated)
- [ ] **Integration Tests**:
    - [ ] A Room migration test in `data/TransactionDatabaseTest.kt` will be added to validate the schema change.
    - [ ] An end-to-end test will be considered for the "create transfer" flow using Espresso or a similar framework.

### Manual Verification
- [ ] **Create Transfer**:
    - [ ] Navigate to "Add Transaction" -> "Transfer".
    - [ ] Verify the "From" and "To" wallet dropdowns are populated.
    - [ ] Verify selecting the same wallet for "From" and "To" disables the "Save" button.
    - [ ] Successfully create a transfer between two different wallets.
    - [ ] Check the transaction list for both wallets; verify an expense appears in the source and an income in the destination.
- [ ] **View Linked Transaction**:
    - [ ] Tap on one of the transfer transactions to open its detail screen.
    - [ ] Verify the "Linked Transaction" info box is displayed correctly.
    - [ ] Click the link/button to navigate to the other transaction.
    - [ ] Verify you are now on the detail screen of the second transaction.
- [ ] **Delete Integrity**:
    - [ ] From the transaction list, delete one side of the transfer (e.g., the expense).
    - [ ] Verify the transaction is deleted.
    - [ ] Navigate to the detail screen of the remaining transaction (the income).
    - [ ] Verify the "Linked Transaction" info box is gone, and it is now a standalone income transaction.
- [ ] **Reporting Accuracy**:
    - [ ] Note the "Total Income" and "Total Expense" on a summary report.
    - [ ] Create a new transfer of $100.
    - [ ] Refresh the summary report.
    - [ ] Verify the "Total Income" and "Total Expense" figures have NOT changed.