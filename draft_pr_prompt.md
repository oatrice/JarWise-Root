# PR Draft Prompt

You are an AI assistant helping to create a Pull Request description.
    
TASK: [Feature] Transaction Linking & Transfers
ISSUE: {
  "title": "[Feature] Transaction Linking & Transfers",
  "number": 71
}

GIT CONTEXT:
COMMITS:
c50c14c feat: [Feature] Transaction Linking & Transfers...
4029c35 ✨ feat(transactions): implement transfer linking feature
8511921 ✨ feat(transactions): add transaction linking feature for transfers
8a95ed3 ✨ feat(transactions): add transaction linking and transfer functionality
1fd04d8 ✨ feat(transactions): add transaction linking and transfer feature
b74985f ✨ feat(migration): Implement Money Manager data migration

STATS:
CHANGELOG.md                                       |   9 +
 VERSION                                            |   2 +-
 docs/ROADMAP.md                                    |   2 +-
 .../14-issue-71_transaction_linking/analysis.md    | 264 +++++++++++
 .../android/implementation_plan.md                 |  72 +++
 .../android/task.md                                |  21 +
 .../android/walkthrough.md                         |  59 +++
 .../14-issue-71_transaction_linking/code_review.md |  15 +
 .../14-issue-71_transaction_linking/plan.md        | 217 +++++++++
 .../14-issue-71_transaction_linking/spec.md        | 166 +++++++
 .../specs/sbe_issue-71.md                          |  53 +++
 .../unified-transfer-row.md                        |  77 ++++
 docs/features/issue-71_transaction_linking/spec.md |  37 --
 draft_pr_body.md                                   | 199 ++++++---
 draft_pr_prompt.md                                 | 484 +++++++++++----------
 prompt_android.txt                                 | 238 ++++++++++
 prompt_backend.txt                                 | 238 ++++++++++
 prompt_frontend.txt                                | 296 +++++++++++++
 18 files changed, 2136 insertions(+), 313 deletions(-)

KEY FILE DIFFS:
diff --git a/CHANGELOG.md b/CHANGELOG.md
index 382df7c..9077615 100644
--- a/CHANGELOG.md
+++ b/CHANGELOG.md
@@ -1,5 +1,14 @@
 # Changelog
 
+## [0.7.0] - 2026-02-11
+
+### Added
+- **[Feature] Transaction Linking for Transfers:** Implemented a system to link the debit and credit transactions when transferring funds between user-owned accounts (e.g., from a Wallet to a Jar). This provides a clearer financial overview by treating internal transfers as a single, unified event, preventing them from being incorrectly counted in income or expense reports.
+- **[Docs]** Added extensive new planning, analysis, and specification documents for the transaction linking feature.
+
+### Changed
+- **[Docs]** Updated the project `ROADMAP.md` to reflect the completion of new features.
+
 ## [0.6.0] - 2026-02-04
 
 ### Added
diff --git a/VERSION b/VERSION
index a918a2a..faef31a 100644
--- a/VERSION
+++ b/VERSION
@@ -1 +1 @@
-0.6.0
+0.7.0
diff --git a/docs/ROADMAP.md b/docs/ROADMAP.md
index dc4f665..c2e4171 100644
--- a/docs/ROADMAP.md
+++ b/docs/ROADMAP.md
@@ -23,7 +23,7 @@ This document outlines the strategic direction and priority of features for JarW
     - ✅ **Done** (v1.7.0) - Implemented Google Login & Drive Backup.
 - **#65 Legacy Data Migration**
     - Import/Migrate data from "Money Manager" or legacy formats to new schema.
-    - **Status:** 🟢 **Ready**
+    - ✅ **Done** (v1.8.0) - Android Implementation Complete.
 
 ## 🔴 Phase 3: Usability & Advanced Features
 *Enhancing user experience and reporting.*
diff --git a/docs/features/14-issue-71_transaction_linking/analysis.md b/docs/features/14-issue-71_transaction_linking/analysis.md
new file mode 100644
index 0000000..884f3ae
--- /dev/null
+++ b/docs/features/14-issue-71_transaction_linking/analysis.md
@@ -0,0 +1,264 @@
+# Analysis Template
+
+> 📋 Template สำหรับการวิเคราะห์ก่อนเริ่มพัฒนา Feature
+
+---
+
+## 📌 Feature Information
+
+| รายการ | รายละเอียด |
+|--------|-----------|
+| **Feature Name** | Transaction Linking & Transfers |
+| **Issue URL** | [#71](https://github.com/owner/repo/issues/71) |
+| **Date** | 2023-10-27 |
+| **Analyst** | Luma AI (Senior Technical Analyst) |
+| **Priority** | 🔴 High |
+| **Status** | 📝 Draft |
+
+---
+
+## 1. Requirement Analysis
+
+### 1.1 Problem Statement
+
+> อธิบายปัญหาที่ต้องการแก้ไข
+
+```
+Currently, users lack a proper way to record fund transfers between their own accounts (e.g., moving money from a checking account to a savings account). Such transfers are often recorded as a separate expense and a separate income, which incorrectly inflates the total income/expense figures in reports. This makes it difficult for users to get an accurate overview of their financial health, as internal money movements are treated the same as external spending or earning.
+```
+
+### 1.2 User Stories
+
+| # | As a | I want to | So that |
+|---|------|-----------|---------|
+| 1 | User | link an expense from one account to an income in another account | I can accurately represent a transfer of my own funds. |
+| 2 | User | have a simple "Create Transfer" option | I can quickly record transfers without manually creating two separate transactions. |
+| 3 | User | see that two transactions are linked when viewing their details | I can easily navigate between the two sides of a transfer and understand the flow of money. |
+| 4 | User | have transfers excluded from my main income and expense reports | my financial summaries reflect actual gains and losses, not internal fund movements. |
+
+### 1.3 Acceptance Criteria
+
+- [ ] **AC1:** The `Transaction` data model is updated with a new nullable field, `relatedTransactionId`.
+- [ ] **AC2:** A new "Transfer" option in the UI allows a user to specify a "From" account, a "To" account, and an amount.
+- [ ] **AC3:** Submitting a transfer creates two `Transaction` records: one negative (expense) from the "From" account and one positive (income) to the "To" account, with the same absolute amount.
+- [ ] **AC4:** The two created transactions are linked via their `relatedTransactionId` fields, pointing to each other. This creation process must be atomic.
+- [ ] **AC5:** On the Transaction Detail screen, a linked transaction displays a clickable link to its counterpart.
+- [ ] **AC6:** Deleting one transaction in a linked pair automatically unlinks the other (its `relatedTransactionId` is set to null), but does not delete it.
+- [ ] **AC7:** Reporting features (e.g., Income vs Expense chart) provide an option to include or exclude transactions identified as transfers.
+
+---
+
+## 2. Feature Analysis
+
+### 2.1 User Flow
+
+```mermaid
+flowchart TD
+    A[User opens Add Transaction screen] --> B{Selects Transaction Type}
+    B -->|Expense/Income| C[Fills standard form]
+    B -->|Transfer| D[Selects 'Transfer' tab]
+    D --> E[Fills 'From Account', 'To Account', 'Amount', 'Date']
+    E --> F[Clicks 'Save']
+    F --> G[System creates two linked transactions in a single DB transaction]
+    G --> H[Redirects to transaction list and shows success message]
+    H --> I[End]
+    C --> F
+```
+
+### 2.2 Screen/Page Requirements
+
+| หน้าจอ | Actions | Components |
+|--------|---------|------------|
+| **Add/Edit Transaction Screen** | - Select transaction type (Income, Expense, Transfer)<br>- Create a transfer by selecting from/to accounts<br>- Edit details of a transaction | - Tabs: `Expense`, `Income`, `Transfer`<br>- Dropdowns: `From Account`, `To Account`<br>- Inputs: `Amount`, `Date`, `Notes`<br>- Button: `Save Transaction` |
+| **Transaction Detail Screen** | - View all transaction details<br>- Navigate to the linked transaction if one exists | - Standard detail fields (Amount, Account, Date, etc.)<br>- New Section: `Linked Transaction`<br>- Hyperlink: `View linked expense/income from [Account Name]` |
+
+### 2.3 Input/Output Specification
+
+#### Inputs
+
+*API Endpoint: `POST /api/transfers`*
+
+| Field | Type | Required | Validation |
+|-------|------|----------|------------|
+| `fromAccountId` | string (UUID) | ✅ | Must be a valid account ID belonging to the user. |
+| `toAccountId` | string (UUID) | ✅ | Must be a valid account ID belonging to the user, different from `fromAccountId`. |
+| `amount` | number | ✅ | Must be a positive number. |
+| `transactionDate` | string (ISO 8601) | ✅ | Must be a valid date. |
+| `notes` | string | ❌ | Max 500 characters. |
+
+#### Outputs
+
+*API Response: `201 Created`*
+
+| Field | Type | Description |
+|-------|------|-------------|
+| `expenseTransaction` | object | The newly created expense transaction object. |
+| `incomeTransaction` | object | The newly created income transaction object. |
+
+---
+
+## 3. Impact Analysis
+
+### 3.1 Affected Components
+
+| Component | Impact Level | Description |
+|-----------|--------------|-------------|
+| **Database (Transaction Table)** | 🔴 High | Requires a schema migration to add the `relatedTransactionId` column and a foreign key constraint/index. |
+| **Backend API (Transaction Service)** | 🔴 High | Requires a new endpoint for creating transfers and modifications to existing CUD logic to handle linking/unlinking. |
+| **Frontend (Add Transaction Page)** | 🔴 High | Significant UI changes are needed to introduce the "Transfer" flow, which is different from standard income/expense entry. |
+| **Frontend (Reporting Module)** | 🟡 Medium | Reporting logic must be updated to correctly filter and aggregate data, with the ability to exclude transfers. |
+| **Frontend (Transaction Detail Page)** | 🟡 Medium | UI needs to be updated to display the link to the related transaction. |
+| **Data Access Layer (Repository)** | 🔴 High | New methods are required to perform the atomic creation of two linked transactions. |
+
+### 3.2 Breaking Changes
+
+- [ ] **BC1:** The `Transaction` object returned from all transaction-related API endpoints will now include the `relatedTransactionId` field. Mobile and web clients must be updated to handle this new field, even if just to ignore it, to prevent deserialization errors.
+
+### 3.3 Backward Compatibility Plan
+
+```
+The new `relatedTransactionId` field will be nullable in the database, ensuring that existing records are not affected. The API will be versioned (e.g., /v2/transactions) if the change is deemed too disruptive. However, the current plan is to coordinate frontend and backend releases. Older clients will ignore the new field. The core create/update/delete endpoints for single transactions will remain unchanged in their function.
+```
+
+---
+
+## 4. Feasibility Analysis
+
+### 4.1 Technical Feasibility
+
+| คำถาม | คำตอบ | หมายเหตุ |
+|-------|-------|----------|
+| เทคโนโลยีรองรับหรือไม่? | ✅ | Standard feature for RDBMS and backend frameworks. Requires database transaction support. |
+| ทีมมี Skills เพียงพอหรือไม่? | ✅ | The required skills (SQL, API development, frontend development) are present in the team. |
+| Infrastructure รองรับหรือไม่? | ✅ | No new infrastructure is required. |
+
+### 4.2 Time Feasibility
+
+| ประเด็น | รายละเอียด |
+|--------|-----------|
+| **Estimated Effort** | 15 person-days (Backend: 5, Frontend: 7, QA: 3) |
+| **Deadline** | N/A (To be determined by project manager) |
+| **Buffer Time** | 3 days |
+| **Feasible?** | ✅ | The effort is manageable within a standard 2-3 week sprint. |
+
+### 4.3 Budget Feasibility
+
+| รายการ | ค่าใช้จ่าย | หมายเหตุ |
+|--------|-----------|----------|
+| Development Hours | N/A | Internal resource allocation. No direct external cost. |
+| **Total** | **0** | |
+
+---
+
+## 5. Security Analysis
+
+### 5.1 Sensitive Data
+
+| ข้อมูล | Sensitivity Level | Protection Method |
+|--------|------------------|-------------------|
+| Transaction Details (amount, date) | 🟡 Sensitive | Standard TLS encryption, access control based on user ownership. |
+| Account/Wallet IDs | 🟡 Sensitive | Access control to ensure users can only interact with their own accounts. |
+| `relatedTransactionId` | 🟢 Normal | No direct sensitive information, but access should be controlled as part of the transaction record. |
+
+### 5.2 Attack Vectors
+
+| Vector | Risk Level | Mitigation |
+|--------|-----------|------------|
+| **Cross-User Data Manipulation** | 🔴 High | Backend logic must strictly validate that both `fromAccountId` and `toAccountId` belong to the authenticated user making the request. |
+| **Data Integrity Violation** | 🟡 Medium | The creation of the two linked transactions must be wrapped in a single database transaction to ensure atomicity. If one part fails, the entire operation must be rolled back. |
+
+### 5.3 Authentication & Authorization
+
+```
+All API endpoints related to this feature (`POST /api/transfers`, updates to `PUT /api/transactions/:id`, etc.) must be protected and require a valid user authentication token (e.g., JWT). The business logic layer must contain authorization checks to verify that the user owns all resources (accounts, transactions) they are attempting to modify.
+```
+
+---
+
+## 6. Performance & Scalability Analysis
+
+### 6.1 Performance Targets
+
+| Metric | Target | Current |
+|--------|--------|---------|
+| Response Time (Create Transfer) | < 300ms | N/A |
+| DB Query Time (Find linked tx) | < 50ms | N/A |
+| Error Rate | < 0.1% | N/A |
+
+### 6.2 Scalability Plan
+
+| Scenario | Expected Users | Scaling Strategy |
+|----------|---------------|------------------|
+| Normal | 10k | A database index should be added to the `relatedTransactionId` column to ensure efficient lookups. |
+| Peak | 50k | The current architecture (standard web app stack) is sufficient. No special scaling is needed for this feature. |
+| Growth (1yr) | 100k+ | Monitor query performance on the Transaction table. If it becomes a bottleneck, consider read replicas. |
+
+---
+
+## 7. Gap Analysis
+
+| ด้าน | As-Is (ปัจจุบัน) | To-Be (ต้องการ) | Gap |
+|------|-----------------|-----------------|-----|
+| **Data Model** | `Transaction` table has no field for linking. | `Transaction` table has a `relatedTransactionId` field. | A database migration script is required to alter the table schema. |
+| **Business Logic** | Transactions are treated as independent events. | A "Transfer" is a special, atomic operation creating two linked transactions. | New service-layer logic is needed to handle the atomic creation, linking, and unlinking of transactions. |
+| **User Interface** | Users must manually create two separate transactions to simulate a transfer. | A streamlined, dedicated UI for creating transfers. | A new "Transfer" tab/view must be designed and implemented on the "Add Transaction" screen. |
+
+---
+
+## 8. Risk Analysis
+
+| Risk | Probability | Impact | Score | Mitigation Plan |
+|------|-------------|--------|-------|-----------------|
+| **Data Inconsistency** (e.g., only one side of a transfer is created) | 🟡 Medium | 🔴 High | 6 | Enforce the creation of the transaction pair within a single, atomic database transaction in the backend service. |
+| **Confusing User Experience** | 🟡 Medium | 🟡 Medium | 4 | Create clear UI mockups and conduct a design review before implementation. Use clear labels like "From" and "To". |
+| **Incorrect Reporting** (Transfers are not excluded correctly) | 🟡 Medium | 🟡 Medium | 4 | Implement specific unit and integration tests for the reporting module to verify the filtering logic for transfers. |
+
+> **Risk Score:** Probability × Impact (High=3, Medium=2, Low=1)
+
+---
+
+## 9. Summary & Recommendations
+
+### 9.1 Analysis Summary
+
+| หมวด | Status | Key Findings |
+|------|--------|--------------|
+| Requirement | ✅ Clear | The goal and user needs are well-defined. |
+| Feature | ✅ Defined | The technical requirements for the data model, logic, and UI are specified. |
+| Impact | 🔴 High | This feature requires changes across the entire stack: database, backend, and frontend. |
+| Feasibility | ✅ Feasible | The feature is technically feasible with the current team and technology stack. |
+| Security | ⚠️ Needs Review | Authorization checks are critical to prevent users from manipulating others' data. |
+| Performance | ✅ Acceptable | A database index on the new column is required to maintain performance. |
+| Risk | ⚠️ Some Risks | The primary risk is data inconsistency, which can be mitigated with atomic database transactions. |
+
+### 9.2 Recommendations
+
+1.  **Implement with Atomicity:** The backend logic for creating a transfer MUST use a database transaction to ensure that either both linked transactions are created successfully or none are.
+2.  **Add Database Index:** A database index must be created on the `relatedTransactionId` column to prevent performance degradation on transaction lookups.
+3.  **Prioritize Clear UX:** Design a dedicated and intuitive UI for the "Transfer" flow. Avoid retrofitting the existing income/expense forms, as this could lead to user confusion.
+
+### 9.3 Next Steps
+
+- [ ] Create and review the database migration script.
+- [ ] Define the final API contract for the `POST /api/transfers` endpoint.
+- [ ] Develop UI/UX mockups for the "Add Transfer" screen and the updated "Transaction Detail" screen.
+- [ ] Create backend tasks for API endpoint and service logic.
+- [ ] Create frontend tasks for UI implementation.
+
+---
+
+## 📎 Appendix
+
+### Related Documents
+
+- [Link to PRD]
+- [Link to Design Docs]
+- [Link to API Specs]
+
+### Sign-off
+
+| Role | Name | Date | Signature |
+|------|------|------|-----------|
+| Analyst | Luma AI | 2023-10-27 | ✅ |
+| Tech Lead | [Name] | [Date] | ⬜ |
+| PM | [Name] | [Date] | ⬜ |
\ No newline at end of file
diff --git a/docs/features/14-issue-71_transaction_linking/android/implementation_plan.md b/docs/features/14-issue-71_transaction_linking/android/implementation_plan.md
new file mode 100644
index 0000000..549285d
--- /dev/null
+++ b/docs/features/14-issue-71_transaction_linking/android/implementation_plan.md
@@ -0,0 +1,72 @@
+# Implementation Plan - Issue #71: Transaction Linking & Transfers
+
+This plan outlines the steps to implement transaction linking, specifically for the "Transfer" feature.
+
+## User Review Required
+
+> [!IMPORTANT]
+> **Database Migration**: A destructive migration is NOT planned, but we will be adding a column `linkedTransactionId`. Ensure strict testing of the migration script.
+
+> [!WARNING]
+> **Architecture**: We are introducing new Use Cases (`CreateTransferUseCase`) and modifying the Repository. If `TransactionRepository` does not exist, it will be created to abstract the DAO.
+
+## Proposed Changes
+
+### Data Layer
+
+#### [MODIFY] [Transaction.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/Transaction.kt)
+- Add `linkedTransactionId: String? = null` to the data class.
+
+#### [NEW] [TransactionRepository.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/repository/TransactionRepository.kt)
+- Create interface and implementation if missing, or update existing.
+- Add `createTransfer(fromTransaction: Transaction, toTransaction: Transaction)` method.
+- Ensure this method executes in a database transaction (using `@Transaction` in DAO or `withTransaction` block).
+
+#### [MODIFY] [TransactionDao.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/data/TransactionDao.kt)
+- Functionality for inserting multiple transactions will be handled here or in the Repository via `RoomDatabase.withTransaction`.
+
+### Domain Layer
+
+#### [NEW] [CreateTransferUseCase.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/domain/use_case/CreateTransferUseCase.kt)
+- Encapsulate the logic for creating two linked transactions (Expense + Income).
+- Validate inputs (Same amount, different wallets).
+
+#### [NEW] [UnlinkTransactionsUseCase.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/domain/use_case/UnlinkTransactionsUseCase.kt)
+- handle unlinking logic.
+
+### UI Layer
+
+#### [MODIFY] [AddTransactionScreen.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/AddTransactionScreen.kt)
+- Add "Transfer" Tab (alongside Income/Expense).
+- When "Transfer" is selected:
+    - Show `From Wallet` and `To Wallet` dropdowns/cards.
+    - Hide `Jar` selection (or auto-select "Transfer" jar if applicable).
+- Update logic to call `CreateTransferUseCase` (via ViewModel).
+
+#### [MODIFY] [TransactionHistoryScreen.kt](file:///Users/oatrice/Software-projects/JarWise/Android/app/src/main/java/com/oatrice/jarwise/ui/TransactionHistoryScreen.kt) / Detail Screen
+- Show "Linked to" indicator.
+
+## Verification Plan
+
+### Automated Tests
+- **Unit Tests**:
+    - `CreateTransferUseCaseTest`: Verify it creates two transactions with correct IDs linked.
+    - `TransactionRepositoryTest`: Verify database insertion and rollback on failure.
+    - `TransactionTest`: Verify model integrity.
+- **Migration Test**:
+    - Verify schema upgrade works without data loss.
+
+### Manual Verification
+1.  **Create Transfer**:
+    - Open Add Transaction > Select "Transfer" tab.
+    - Select From: Wallet A, To: Wallet B, Amount: 100.
+    - Save.
+    - **Expect**: Two transactions appear in history. -100 in Wallet A, +100 in Wallet B.
+2.  **Verify Link**:
+    - Click on the -100 transaction.
+    - **Expect**: See "Linked to: +100 (Wallet B)".
+    - Click the link.
+    - **Expect**: Navigate to the +100 transaction details.
+3.  **Delete Transfer**:
+    - Delete the -100 transaction.
+    - **Expect**: The +100 transaction remains but is now unlinked (standalone income).
diff --git a/docs/features/14-issue-71_transaction_linking/android/task.md b/docs/features/14-issue-71_transaction_linking/android/task.md
new file mode 100644
index 0000000..0645093
--- /dev/null
+++ b/docs/features/14-issue-71_transaction_li
... (Diff truncated for size) ...

PR TEMPLATE:
# 📋 Monorepo Update Summary
<!-- 
Brief description of changes affecting the project structure or multiple 
platforms 
-->

## ✅ Checklist
- [ ] 🏗️ I have moved the related issue to "In Progress" on the Kanban board

## 🎯 Type

- [ ] 📦 Monorepo Structure
- [ ] 📄 Documentation (Root)
- [ ] 🔄 Workflow/CI Update
- [ ] 🚀 Release Management
- [ ] 💥 Breaking change

## 🔗 Affected Platforms

- [ ] Web
- [ ] Android
- [ ] iOS
- [ ] Mobile (Flutter)

## 📝 Detailed Changes

<!-- Describe the high-level purpose of this PR -->

## 📸 Screenshots (if applicable)
<!-- 
IMPORTANT: Always use width="400" for screenshots
Use HTML <img> tag for width control:

<img src="https://raw.githubusercontent.com/oatrice/JarWise-Root/branch-name/path/to/image.png" width="400" />
-->

## 🧪 Testing
- [ ] Changes verified locally
- [ ] Documentation reviewed for accuracy

## 🚀 Migration/Deployment

- [ ] Environment variables updated
- [ ] Global Dependencies installed

```bash
# Migration commands if applicable
```

## 🔗 Related Issues

<!-- 
Use 'Resolves' keyword with FULL repo reference for auto-linking.
This makes the PR appear in the Issue's "Development" sidebar:

Development
├── oatrice/JarWise-Web#6
└── oatrice/JarWise-Android#7

Example: Resolves oatrice/JarWise-Root#16
-->
- Resolves oatrice/JarWise-Root#

**Breaking Changes**: <!-- Yes/No -->
**Migration Required**: <!-- Yes/No -->


INSTRUCTIONS:
1. Generate a comprehensive PR description in Markdown format.
2. If a template is provided, fill it out intelligently.
3. If no template, use a standard structure: Summary, Changes, Impact.
4. Focus on 'Why' and 'What'.
5. Do not include 'Here is the PR description' preamble. Just the body.
6. IMPORTANT: Always use FULL URLs for links to issues and other PRs (e.g., https://github.com/owner/repo/issues/123), do NOT use short syntax (e.g., #123) to ensuring proper linking across platforms.
