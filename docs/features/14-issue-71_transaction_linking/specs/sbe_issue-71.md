# SBE: Transaction Linking & Transfers

> 📅 Created: 2026-02-04
> 🔗 Issue: https://github.com/oatrice/JarWise-Root/issues/71

---

## Feature: Transaction Linking and Transfers

To accurately represent financial movements, users can link two transactions together. This creates a bidirectional relationship, primarily for transfers between user accounts (e.g., moving money from a wallet to a savings jar), but also for refunds or debt repayments. When one transaction is linked, the other is automatically linked back. This ensures data integrity and allows for more accurate reporting by potentially excluding internal transfers from total income or expense calculations.

### Scenario: Happy Path - Creating a new transfer between two accounts

**Given** the user has two accounts with existing balances
**When** the user creates a transfer from a source account to a destination account
**Then** an expense and an income transaction are created, bidirectionally linked, and account balances are updated

#### Examples

| Source Account | Initial Source Balance | Destination Account | Initial Destination Balance | Transfer Amount | Expected Source Balance | Expected Destination Balance |
|----------------|------------------------|---------------------|-----------------------------|-----------------|-------------------------|----------------------------|
| Checking       | 500.00                 | Savings             | 2000.00                     | 150.00          | 350.00                  | 2150.00                    |
| Wallet         | 85.50                  | Credit Card         | -450.00                     | 85.50           | 0.00                    | -364.50                    |
| Investment     | 10000.00               | Checking            | 350.00                      | 1000.00         | 9000.00                 | 1350.00                    |

### Scenario: Edge Case - Unlinking an existing transfer

**Given** two transactions are already linked together as a transfer
**When** the user unlinks one of the transactions
**Then** the `relatedTransactionId` is cleared on both transactions, making them independent

#### Examples

| Expense Transaction ID | Income Transaction ID | Initial Expense Link (`relatedTransactionId`) | Initial Income Link (`relatedTransactionId`) | Expected Expense Link | Expected Income Link |
|------------------------|-----------------------|-----------------------------------------------|----------------------------------------------|-----------------------|----------------------|
| txn-exp-9f8e7d6c       | txn-inc-a1b2c3d4      | txn-inc-a1b2c3d4                              | txn-exp-9f8e7d6c                             | null                  | null                 |
| txn-exp-5a6b7c8d       | txn-inc-e9f8a7b6      | txn-inc-e9f8a7b6                              | txn-exp-5a6b7c8d                             | null                  | null                 |
| txn-exp-c1d2e3f4       | txn-inc-4g5h6i7j      | txn-inc-4g5h6i7j                              | txn-exp-c1d2e3f4                             | null                  | null                 |

### Scenario: Error Handling - Attempting a transfer with insufficient funds

**Given** the user's source account has a specific balance
**When** the user attempts to transfer an amount greater than the available balance
**Then** the transfer is blocked, no transactions are created, and an error message is displayed

#### Examples

| Source Account | Source Balance | Destination Account | Transfer Amount | Expected Error Message                 |
|----------------|----------------|---------------------|-----------------|----------------------------------------|
| Wallet         | 45.25          | Savings             | 45.26           | "Insufficient funds for this transfer."  |
| Checking       | 0.00           | Credit Card         | 10.00           | "Insufficient funds for this transfer."  |
| Emergency Fund | 1000.00        | Investment          | 1000.01         | "Insufficient funds for this transfer."  |
| Daily Cash     | -10.50         | Savings             | 5.00            | "Insufficient funds for this transfer."  |