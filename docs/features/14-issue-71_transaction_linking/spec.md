# Specification

| **Title** | [Feature] Transaction Linking & Transfers |
| --- | --- |
| **Status** | `Draft` |
| **Version** | `1.0` |
| **Issue URL** | https://github.com/oatrice/JarWise-Root/issues/71 |

---

## 1. Overview

This document specifies the requirements for a Transaction Linking feature. The primary goal is to allow users to represent the movement of funds between their own accounts (e.g., Wallets, Jars) as a "Transfer". This prevents such movements from being incorrectly counted as net income or expense in financial reports. The feature will also support linking other related transactions, such as refunds to original expenses.

The core of this feature is the ability to create a two-way link between two transactions. A streamlined user interface will be introduced to simplify the creation of transfer pairs.

## 2. Goal

As a user, I want to link two transactions together to represent a single financial event, such as a transfer between my accounts, a refund, or a debt repayment. This will ensure my financial reports are accurate by not double-counting money movement as both an expense and an income.

## 3. User Stories

*   **As a user managing multiple accounts,** I want to create a "Transfer" from my Savings Wallet to my Checking Wallet, so that the movement of funds is recorded accurately without affecting my overall income or expense totals.
*   **As a user reviewing my transaction history,** I want to see if a transaction is linked to another and be able to navigate directly to the linked transaction, so that I can easily understand the context of my financial activity.
*   **As a user correcting a mistake,** I want to unlink two transactions or delete one part of a transfer, so that the remaining transaction becomes a standalone income/expense and my records remain correct.
*   **As a user viewing my financial reports,** I want transfers to be excluded from my main expense and income summaries, so I can get a clear picture of my net financial gain or loss.

## 4. Functional Requirements

### FR1: Transaction Relationship
- The system must support a one-to-one relationship between two `Transaction` entities.
- A transaction can be linked to at most one other transaction.

### FR2: Two-Way Linking
- When Transaction A is linked to Transaction B, the system must automatically and immediately establish a reciprocal link from Transaction B back to Transaction A.
- This link must be maintained atomically; either both transactions are linked, or neither is.

### FR3: Unlinking Logic
- The system must provide a mechanism for a user to unlink a pair of transactions.
- When the link from Transaction A to Transaction B is removed, the reciprocal link from B to A must also be removed automatically.
- The two transactions will then revert to being independent income/expense transactions.

### FR4: Deletion Integrity
- If a linked Transaction A is deleted, its corresponding Transaction B must be automatically unlinked.
- Transaction B will remain in the system as a standalone transaction. It will not be deleted.

### FR5: "Create Transfer" Workflow
- The user interface must provide a dedicated workflow, separate from a standard transaction entry, to "Create a Transfer".
- This workflow shall require the user to specify:
    - `From Wallet` (Source of funds)
    - `To Wallet` (Destination of funds)
    - `Amount`
    - `Date`
    - `Notes` (Optional)
- Upon submission, the system will create two transactions simultaneously:
    1.  An **Expense** transaction for the specified `Amount` from the `From Wallet`.
    2.  An **Income** transaction for the same `Amount` into the `To Wallet`.
- These two newly created transactions must be automatically linked to each other.

### FR6: Display of Linked Transactions
- On the "Transaction Detail" view, if a transaction is linked, the system must display an indicator.
- The indicator must clearly state which transaction it is linked to (e.g., "Linked to: +$100.00 in Checking Wallet on Jan 15").
- This indicator must be a clickable link that navigates the user directly to the detail view of the related transaction.

### FR7: Reporting
- The system must be able to identify a pair of linked transactions as a "Transfer".
- In summary reports (e.g., "Total Income vs. Total Expense"), transfers should be excluded by default to avoid inflating the totals.
- Reports should offer an option to include or view transfers separately.

## 5. User Interface & User Experience (UI/UX)

### 5.1. Add/Edit Transaction Screen
- The "Add Transaction" screen will feature three primary modes, selectable via tabs or a segmented control: **Expense**, **Income**, and **Transfer**.
- When the **"Transfer"** mode is selected, the form fields will change to:
    - **From:** A dropdown to select the source Wallet/Jar.
    - **To:** A dropdown to select the destination Wallet/Jar.
    - **Amount:** A numeric input for the transfer amount.
    - **Date:** A date picker.
    - **Notes:** An optional text field.
- The system will prevent the user from selecting the same Wallet/Jar for both "From" and "To".

### 5.2. Transaction Detail View
- When viewing the details of a transaction that is part of a transfer pair, a dedicated section or field will be visible.
- **Example Display:**
    > **Type:** `Transfer` ↔️
    >
    > **Linked Transaction:** `Expense of $50.00 from Savings`
    > `[View Transaction ->]`
- Clicking the link will navigate the user to the detail screen of the other transaction in the pair.

## 6. Specification by Example (SBE)

### Scenario 1: User Creates a Transfer Between Wallets

**Given** the user has the following wallets:
| Wallet Name | Initial Balance |
| :--- | :--- |
| `Main Checking` | $1,500.00 |
| `Vacation Savings` | $800.00 |

**When** the user navigates to the "Add Transaction" screen, selects the "Transfer" tab, and enters the following information:
- **From:** `Main Checking`
- **To:** `Vacation Savings`
- **Amount:** `250.00`
- **Date:** `2023-10-26`
- **Notes:** `Monthly savings goal`

**Then** the system creates two new transactions and updates the wallet balances.

**Resulting Transactions:**
| ID | Wallet | Type | Amount | Date | Linked To ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `txn_101` | `Main Checking` | Expense | -$250.00 | 2023-10-26 | `txn_102` |
| `txn_102` | `Vacation Savings` | Income | +$250.00 | 2023-10-26 | `txn_101` |

**Resulting Wallet Balances:**
| Wallet Name | Final Balance |
| :--- | :--- |
| `Main Checking` | $1,250.00 |
| `Vacation Savings` | $1,050.00 |

And in a monthly report, the user's total income and expenses are not affected by this $250.00 movement.

---

### Scenario 2: User Deletes One Side of a Linked Transfer

**Given** the two linked transactions from Scenario 1 exist:
| ID | Wallet | Type | Amount | Date | Linked To ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `txn_101` | `Main Checking` | Expense | -$250.00 | 2023-10-26 | `txn_102` |
| `txn_102` | `Vacation Savings` | Income | +$250.00 | 2023-10-26 | `txn_101` |

**When** the user finds and deletes the expense transaction (`txn_101`) from their `Main Checking` wallet history.

**Then** the system must delete `txn_101` and automatically unlink `txn_102`.

**Resulting State:**
- Transaction `txn_101` is permanently deleted.
- Transaction `txn_102` is updated to remove its link. It now exists as a standalone income transaction.

**Resulting Transactions Table:**
| ID | Wallet | Type | Amount | Date | Linked To ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `txn_102` | `Vacation Savings` | Income | +$250.00 | 2023-10-26 | `null` |

**Note:** The wallet balances would become inconsistent as a result of this user action, but the system's behavior regarding the link is correct. The remaining transaction is now a simple "Income" and will be reflected as such in reports.

## 7. Out of Scope

- **Multi-currency Transfers:** This feature will only handle transfers where the "From" and "To" wallets share the same currency.
- **Linking to Multiple Transactions:** A transaction can only be linked to one other transaction (1:1 relationship). Grouping multiple expenses to one income (e.g., a reimbursement) is not covered.
- **Advanced Debt/Loan Tracking:** While this can be used for simple debt repayments, it will not include advanced features like interest calculation or amortization schedules.
- **Splitting Transactions:** Linking a portion of a transaction to another is not in scope. The entire amount of both transactions must match.

## 8. Acceptance Criteria

- [ ] A user can create a transfer using the dedicated "Transfer" UI.
- [ ] Creating a transfer results in two transactions: one expense and one income of the same amount.
- [ ] The two created transfer transactions are automatically linked to each other.
- [ ] The "Transaction Detail" screen for a linked transaction displays a link to its counterpart.
- [ ] Clicking the link navigates to the other transaction's detail screen.
- [ ] Deleting one transaction in a linked pair automatically unlinks the other transaction.
- [ ] Manually unlinking a transaction pair from the UI removes the link from both transactions.
- [ ] Standard Income/Expense reports must exclude transfer amounts by default.
- [ ] The user cannot create a transfer where the source and destination wallets are the same.