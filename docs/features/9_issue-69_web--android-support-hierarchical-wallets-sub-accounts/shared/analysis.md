# Analysis Template

> 📋 Template สำหรับการวิเคราะห์ก่อนเริ่มพัฒนา Feature

---

## 📌 Feature Information

| รายการ | รายละเอียด |
|--------|-----------|
| **Feature Name** | Support Hierarchical Wallets (Sub-accounts) |
| **Issue URL** | [#69](https://github.com/owner/repo/issues/69) |
| **Date** | 2023-10-27 |
| **Analyst** | Luma AI (Senior Technical Analyst) |
| **Priority** | 🔴 High |
| **Status** | 📝 Draft |

---

## 1. Requirement Analysis

### 1.1 Problem Statement

> อธิบายปัญหาที่ต้องการแก้ไข

```
Currently, users can only manage their wallets (accounts) in a flat list. This structure is rigid and does not allow for grouping related accounts, such as a primary bank account with its associated savings and checking sub-accounts. This limitation makes it difficult for users to organize their finances in a way that mirrors their real-world financial structure, reducing the app's flexibility and organizational power.
```

### 1.2 User Stories

| # | As a | I want to | So that |
|---|------|-----------|---------|
| 1 | User | create a new wallet as a sub-account of an existing wallet | I can group my related financial accounts together for better organization. |
| 2 | User | view my wallets in a hierarchical tree structure | I can easily understand the relationships between my main accounts and sub-accounts. |
| 3 | User | move a sub-account to a different parent or make it a top-level account | I can reorganize my financial structure as my needs change. |
| 4 | User | be prompted to reassign sub-accounts when deleting a parent account | I do not accidentally lose important data or orphan my sub-accounts. |

### 1.3 Acceptance Criteria

- [ ] **AC1:** A user can successfully create a new wallet and assign an existing wallet as its parent through the UI.
- [ ] **AC2:** The wallet management screen must display wallets in a clear hierarchical (tree-like) structure, visually distinguishing between parent and child wallets (e.g., through indentation).
- [ ] **AC3:** When a user attempts to delete a wallet that has sub-wallets, the system must present a prompt asking the user to either delete all sub-wallets or reassign them to a different parent wallet.

---

## 2. Feature Analysis

### 2.1 User Flow

```mermaid
flowchart TD
    A[User navigates to Wallet Management screen] --> B[Clicks "Add New Wallet"]
    B --> C[Add/Edit Wallet modal appears]
    C --> D[User fills in wallet details <br/>(Name, Initial Balance, etc.)]
    D --> E{Select a Parent Wallet?}
    E -->|Yes| F[User selects an existing wallet from a dropdown list]
    E -->|No| G[Leaves parent field empty]
    F --> H[Clicks "Save"]
    G --> H
    H --> I[Modal closes and wallet list refreshes]
    I --> J[New wallet is displayed in the correct position within the hierarchy]
    J --> K[End]
```

### 2.2 Screen/Page Requirements

| หน้าจอ | Actions | Components |
|--------|---------|------------|
| **Wallet Management List** | - View wallets in a tree structure<br/>- Expand/Collapse parent wallets<br/>- Initiate Add, Edit, Delete actions<br/>- (Phase 1) Drag-and-drop to re-parent wallets | - Tree View / Nested List Component<br/>- "Add Wallet" Button<br/>- Expand/Collapse Icons<br/>- Context Menu per wallet (Edit, Delete, Move) |
| **Add/Edit Wallet Modal** | - Enter/update wallet name and other details<br/>- Select a parent wallet from a list<br/>- Clear parent selection to make it a top-level wallet | - Text Input for Name<br/>- Number Input for Balance<br/>- Dropdown/Searchable Select for "Parent Wallet"<br/>- Save/Cancel Buttons |

### 2.3 Input/Output Specification

#### Inputs

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | ✅ | Not empty, max 100 chars |
| `initialBalance` | number | ✅ | Must be >= 0 |
| `parentId` | string (UUID/ID) | ❌ | Must be a valid ID of a wallet owned by the user. Cannot create a circular dependency. |

#### Outputs

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The unique identifier for the wallet. |
| `name` | string | The name of the wallet. |
| `balance` | number | The current balance of the wallet. |
| `parentId` | string \| null | The ID of the parent wallet, or null if it is a top-level wallet. |
| `children` | Array<Wallet> | (Recommended API output) A nested array of child wallet objects to facilitate frontend rendering. |

---

## 3. Impact Analysis

### 3.1 Affected Components

| Component | Impact Level | Description |
|-----------|--------------|-------------|
| **Frontend: Web (React/Next.js)** | 🔴 High | Major UI overhaul of the Wallet Management page is required, changing from a simple list to an interactive tree view. State management logic must be updated to handle a nested data structure. New components for the tree and updated modals are needed. |
| **Backend API (Python/Node.js)** | 🟡 Medium | The `wallets` API endpoints (`create`, `update`, `delete`, `list`) must be modified. `DELETE` logic needs to handle child reassignment. `UPDATE` needs validation to prevent circular dependencies. The `LIST` endpoint should be optimized to return hierarchical data efficiently. |
| **Frontend: Android** | 🔴 High | (Phase 2) Similar to the web, this requires a significant rewrite of the `ManageWalletsViewModel` and the corresponding UI to support and display a tree structure. |
| **Database Schema (`Allocation` table)** | 🟢 Low | The `parentId` field already exists. A foreign key constraint and an index should be added if they are not already present to ensure data integrity and query performance. |
| **Reporting & Analytics** | 🟡 Medium | Any existing reports or dashboards that aggregate wallet data may need to be updated. A decision is needed on whether parent wallet totals should include child balances. |

### 3.2 Breaking Changes

- [ ] **BC1:** The API endpoint for listing wallets (`GET /api/wallets`) may change its response structure from a flat array to a nested JSON tree. This would break older clients that expect a flat list.

### 3.3 Backward Compatibility Plan

```
To avoid breaking existing clients (especially mobile before Phase 2), we can implement one of the following strategies:
1.  **Versioning:** Create a new endpoint, e.g., `GET /api/v2/wallets`, that returns the hierarchical structure, while the old `v1` endpoint remains unchanged.
2.  **Query Parameter:** Add a query parameter to the existing endpoint, e.g., `GET /api/wallets?format=tree`. If the parameter is absent, the API returns the old flat list. This is the recommended approach for its simplicity.
```

---

## 4. Feasibility Analysis

### 4.1 Technical Feasibility

| คำถาม | คำตอบ | หมายเหตุ |
|-------|-------|----------|
| เทคโนโลยีรองรับหรือไม่? | ✅ | Standard relational database features (self-referencing foreign keys) and frontend libraries for tree views (e.g., react-arborist, dnd-kit) are widely available. |
| ทีมมี Skills เพียงพอหรือไม่? | ✅ | The concepts are standard for web development. Implementing robust validation and an intuitive drag-and-drop UI are the main challenges, but they are manageable. |
| Infrastructure รองรับหรือไม่? | ✅ | No new infrastructure is required. This feature relies on existing application servers and databases. |

### 4.2 Time Feasibility

| ประเด็น | รายละเอียด |
|--------|-----------|
| **Estimated Effort** | **Phase 1 (Web):** 12-15 developer-days (Backend: 4-5 days, Frontend: 8-10 days) |
| **Deadline** | N/A (Assumed to fit within 1-2 standard sprints) |
| **Buffer Time** | 3 days |
| **Feasible?** | ✅ | The estimate is reasonable for the scope of work. |

### 4.3 Budget Feasibility

| รายการ | ค่าใช้จ่าย | หมายเหตุ |
|--------|-----------|----------|
| Developer Time | [Internal Cost] | No external costs are anticipated. The budget is entirely based on the allocation of developer hours. |
| **Total** | [Internal Cost] | |

---

## 5. Security Analysis

### 5.1 Sensitive Data

| ข้อมูล | Sensitivity Level | Protection Method |
|--------|------------------|-------------------|
| Wallet Name & Balance | 🟡 Sensitive | All API endpoints must enforce authorization, ensuring users can only access their own financial data. |
| Wallet IDs (`id`, `parentId`) | 🟢 Normal | Standard protection. Exposing them is not a risk as long as authorization is enforced. |

### 5.2 Attack Vectors

| Vector | Risk Level | Mitigation |
|--------|-----------|------------|
| **IDOR (Insecure Direct Object Reference)** | 🟡 Medium | On any `update` or `create` request, the backend must verify that the `parentId` (if provided) belongs to the currently authenticated user. |
| **Circular Dependency** | 🟡 Medium | The backend must perform a validation check before updating a wallet's `parentId` to ensure the new parent is not a descendant of the wallet itself, which would create an infinite loop. |
| **Mass Assignment** | 🟢 Low | Ensure that only permitted fields (`name`, `parentId`, etc.) can be updated through the API endpoint. |

### 5.3 Authentication & Authorization

```
All API endpoints related to this feature (`/api/wallets/*`) must be protected and require a valid user session/token. Authorization logic must be strictly enforced at the service layer for every request to ensure a user can only view, create, edit, or delete their own wallets and cannot assign a wallet to a parent they do not own.
```

---

## 6. Performance & Scalability Analysis

### 6.1 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time (Get Wallets) | < 300ms | N/A |
| Page Load Time (Wallet Mgmt) | < 2s | N/A |
| Error Rate | < 0.1% | N/A |

### 6.2 Scalability Plan

| Scenario | Expected Users | Scaling Strategy |
|----------|---------------|------------------|
| Normal | < 50 wallets/user | A single API call fetching the entire tree is acceptable. Use efficient database queries (e.g., Recursive CTEs). |
| Peak | > 200 wallets/user | The API might become slow. Implement lazy loading on the frontend, where child nodes are fetched only when a parent is expanded. |
| Growth (1yr) | N/A | Ensure `userId` and `parentId` columns in the `Allocation` table are indexed to maintain query performance as the table grows. |

---

## 7. Gap Analysis

| ด้าน | As-Is (ปัจจุบัน) | To-Be (ต้องการ) | Gap |
|------|-----------------|-----------------|-----|
| **Data Model & Logic** | The `parentId` field in the `Allocation` table exists but is unused. All business logic treats wallets as independent entities. | The `parentId` field is used to create a self-referencing hierarchical relationship. Backend logic must manage this structure. | Implement backend services for creating, reading, updating, and deleting wallets within a hierarchy, including all necessary validation. |
| **User Interface** | The Wallet Management screen displays a simple, flat list of all wallets. | The screen displays an interactive tree view that allows users to visualize and manage the parent-child relationships. | A complete redesign and implementation of the Wallet Management UI is required, including a new tree component and updated forms. |

---

## 8. Risk Analysis

| Risk | Probability | Impact | Score | Mitigation Plan |
|------|-------------|--------|-------|-----------------|
| **Data Integrity Corruption** (e.g., circular dependencies, orphans) | 🟡 Medium | 🔴 High | 6 | Implement robust server-side validation to prevent circular dependencies. Use database transactions for delete/re-parent operations to ensure atomicity. |
| **Poor UX with Drag-and-Drop** | 🟡 Medium | 🟡 Medium | 4 | Use a well-established, accessible frontend library for drag-and-drop. Conduct usability testing. Provide a non-D&D alternative for re-parenting (e.g., via an "Edit" form). |
| **Performance Degradation** (for users with many wallets) | 🟢 Low | 🟡 Medium | 2 | Design the API and UI with lazy-loading capabilities from the start, even if not implemented immediately. Ensure proper database indexing on `parentId`. |

> **Risk Score:** Probability × Impact (High=3, Medium=2, Low=1)

---

## 9. Summary & Recommendations

### 9.1 Analysis Summary

| หมวด | Status | Key Findings |
|------|--------|--------------|
| Requirement | ✅ Clear | The user need and acceptance criteria are well-defined. |
| Feature | ✅ Defined | The user flow, UI components, and I/O specs are outlined. |
| Impact | ⚠️ Medium | The feature requires significant frontend changes and moderate backend logic updates. It affects core financial organization functionality. |
| Feasibility | ✅ Feasible | The feature is technically feasible with standard technologies and existing team skills. |
| Security | ⚠️ Needs Review | Critical server-side validation is required to prevent data corruption and unauthorized access (IDOR, circular dependencies). |
| Performance | ✅ Acceptable | Performance should be acceptable for most users, with clear strategies (lazy loading) to handle edge cases. |
| Risk | ⚠️ Some Risks | The primary risk is data integrity, which must be mitigated with thorough backend validation and testing. |

### 9.2 Recommendations

1.  **Prioritize Backend Validation:** The highest priority should be implementing robust backend logic. This includes ownership checks, circular dependency prevention, and transactional integrity for delete/update operations. This forms the secure foundation for the feature.
2.  **Iterate on the Frontend:** For the web UI, begin by implementing a simple, non-interactive indented list to display the hierarchy. The more complex drag-and-drop functionality can be added in a subsequent iteration to de-risk the initial delivery.
3.  **Clarify Aggregation Rules:** A decision must be made with the product owner on how balances of parent wallets are displayed. Should they show their own balance, or an aggregated total including all children? This will impact both the API and UI.

### 9.3 Next Steps

- [ ] Finalize the API contract for `GET /api/wallets`, including the structure of the nested response.
- [ ] Create backend development tasks for CRUD operations with hierarchical validation.
- [ ] Create frontend development tasks for building the tree view component and updating the Add/Edit Wallet modal.
- [ ] Schedule a brief meeting with the Product Manager to clarify the balance aggregation requirement.

---

## 📎 Appendix

### Related Documents

- [Link to PRD]
- [Link to Design Docs]
- [Link to API Specs]

### Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Analyst | Luma AI | 2023-10-27 | ✅ |
| Tech Lead | [Name] | [Date] | ⬜ |
| PM | [Name] | [Date] | ⬜ |