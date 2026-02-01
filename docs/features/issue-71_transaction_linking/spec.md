# Feature: Transaction Linking (Issue #71)

**Issue:** #71 (New)
**Goal:** Implement 2-way linking between Income/Expense transactions to represent Transfers, Debt Repayments, or Refund scenarios.
**Parent Context:** This was originally considered part of [#56 Enhance Add Transaction](../6_issue-56_web-android-enhance-add-transaction-date-wallet), but extracted for clarity.

## 📝 Description
Users need to link two separate transactions to show they are related. The most common use case is a **Transfer** (money leaving one Jar/Wallet and entering another).

### Use Cases
1.  **Transfer:** -100 from Wallet A (Expense) linked to +100 to Wallet B (Income).
    *   System should recognize this pair as a "Transfer" and potentially exclude it from "Total Expense/Income" reports.
2.  **Debt Repayment:** Payment to credit card linked to the original expense (advanced).
3.  **Refund:** Income linked to a previous Expense.

## 🛠️ Requirements

### 1. Data Model
*   Add `relatedTransactionId` (String, nullable) to `Transaction` entity.
*   Ensure referential integrity (if possible, or handle via app logic).

### 2. Logic (2-Way Linking)
*   **Linking:** When Transaction A links to Transaction B, Transaction B must automatically link back to Transaction A.
*   **Unlinking:** Deleting or unlinking A must update B to remove the link.

### 3. UI/UX
*   **Transaction Detail:** Show "Linked to: [Transaction B]" with a clickable link.
*   **Add/Edit Screen:** Option to "Create Transfer" which automatically creates two transactions and links them.

## 🔗 Related Issues
*   [#69 Hierarchical Wallets](../9_issue-69_web--android-support-hierarchical-wallets-sub-accounts) (Completed) - Wallets are prerequisites for Transfers.
*   [#56 Enhance Add Transaction](../6_issue-56_web-android-enhance-add-transaction-date-wallet) - The UI for adding these links fits here.

## 📅 Plan
1.  **Database Migration:** Add `relatedTransactionId` column.
2.  **Repository Logic:** Methods to `insertTransfer(from, to)` that handles the dual creation and linking in a transaction.
3.  **UI:** "Transfer" Tab in Add Transaction screen.
