# Implementation Plan - Issue #71: Transaction Linking & Transfers

This plan outlines the steps to implement transaction linking, specifically for the "Transfer" feature.

## User Review Required

> [!IMPORTANT]
> **Database Migration**: A destructive migration is NOT planned, but we will be adding a column `linkedTransactionId`. Ensure strict testing of the migration script.

> [!WARNING]
> **Architecture**: We are introducing new Use Cases (`CreateTransferUseCase`) and modifying the Repository. If `TransactionRepository` does not exist, it will be created to abstract the DAO.

## Proposed Changes

### Data Layer

#### [MODIFY] [Transaction.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/Transaction.kt)
- Add `linkedTransactionId: String? = null` to the data class.

#### [NEW] [TransactionRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/TransactionRepository.kt)
- Create interface and implementation if missing, or update existing.
- Add `createTransfer(fromTransaction: Transaction, toTransaction: Transaction)` method.
- Ensure this method executes in a database transaction (using `@Transaction` in DAO or `withTransaction` block).

#### [MODIFY] [TransactionDao.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/TransactionDao.kt)
- Functionality for inserting multiple transactions will be handled here or in the Repository via `RoomDatabase.withTransaction`.

### Domain Layer

#### [NEW] [CreateTransferUseCase.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/domain/use_case/CreateTransferUseCase.kt)
- Encapsulate the logic for creating two linked transactions (Expense + Income).
- Validate inputs (Same amount, different wallets).

#### [NEW] [UnlinkTransactionsUseCase.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/domain/use_case/UnlinkTransactionsUseCase.kt)
- handle unlinking logic.

### UI Layer

#### [MODIFY] [AddTransactionScreen.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/AddTransactionScreen.kt)
- Add "Transfer" Tab (alongside Income/Expense).
- When "Transfer" is selected:
    - Show `From Wallet` and `To Wallet` dropdowns/cards.
    - Hide `Jar` selection (or auto-select "Transfer" jar if applicable).
- Update logic to call `CreateTransferUseCase` (via ViewModel).

#### [MODIFY] [TransactionHistoryScreen.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/TransactionHistoryScreen.kt) / Detail Screen
- Show "Linked to" indicator.

## Verification Plan

### Automated Tests
- **Unit Tests**:
    - `CreateTransferUseCaseTest`: Verify it creates two transactions with correct IDs linked.
    - `TransactionRepositoryTest`: Verify database insertion and rollback on failure.
    - `TransactionTest`: Verify model integrity.
- **Migration Test**:
    - Verify schema upgrade works without data loss.

### Manual Verification
1.  **Create Transfer**:
    - Open Add Transaction > Select "Transfer" tab.
    - Select From: Wallet A, To: Wallet B, Amount: 100.
    - Save.
    - **Expect**: Two transactions appear in history. -100 in Wallet A, +100 in Wallet B.
2.  **Verify Link**:
    - Click on the -100 transaction.
    - **Expect**: See "Linked to: +100 (Wallet B)".
    - Click the link.
    - **Expect**: Navigate to the +100 transaction details.
3.  **Delete Transfer**:
    - Delete the -100 transaction.
    - **Expect**: The +100 transaction remains but is now unlinked (standalone income).
