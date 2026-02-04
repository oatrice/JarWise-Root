# Transaction Linking & Transfers Walkthrough

## Overview
This feature implements 2-way transaction linking to support "Transfers" between wallets. Transfers consist of two linked transactions (Expense + Income) which are excluded from standard financial reports to maintain accurate income/expense tracking.

## Implementation Details

### Data Layer
- **Schema Update**: Added `linkedTransactionId` (String?) to `Transaction` entity.
- **Migration**: Created `MIGRATION_6_7` to alter the `transactions` table.
- **Repository**:
    - `createTransfer`: Atomically inserts Expense and Income transactions, linking them to each other.
    - `unlinkTransaction`: Handles unlinking logic (setting `linkedTransactionId` to null for both parties).

### Domain Layer
- **CreateTransferUseCase**: Encapsulates the logic for creating transfers.
- **UnlinkTransactionsUseCase**: Handles unlinking commands.

### UI Layer
- **AddTransactionScreen**:
    - Added "Transfer" tab.
    - Implemented Source/Destination Wallet selection.
    - Wired to `MainViewModel.saveTransfer`.
- **TransactionCard**:
    - Added "🔗 Linked" indicator for linked transactions.
- **Visuals**:
    - "Transfer" tab hides "Jar Selection" as transfers are wallet-to-wallet (using internal "transfer-in"/"transfer-out" jar IDs).

### Reporting
- **TransactionGroupingUtils**: Updated to exclude linked transactions from `totalIncome` and `totalExpense` calculations in daily summaries.

## Verification

### Automated Tests
- **Unit Test**: `CreateTransferUseCaseTest` verifies that:
    - An Expense transaction is created with correct amount and source wallet.
    - An Income transaction is created with correct amount and destination wallet.
    - Logic handles the flow correctly (verified with FakeRepository).

### Manual Verification Steps
1. **Create Transfer**:
    - Open "Add Transaction".
    - Select "Transfer" tab.
    - Choose Amount, From Wallet, To Wallet.
    - Save.
2. **Verify List**:
    - Check Transaction History.
    - See two new transactions (one negative, one positive).
    - ensure they have "🔗 Linked" tag.
3. **Verify Totals**:
    - Check the Daily Header total.
    - It should NOT include the transfer amounts (if implemented correctly).
4. **Unlink (Future Work)**:
    - Tap a linked transaction (Detail View pending).
    - Unlink option should separate them.

## Next Steps
- Implement `TransactionDetailScreen` to allow viewing linkage and unlinking.
- Add specific "Transfer" icon/type visualization in history list.
