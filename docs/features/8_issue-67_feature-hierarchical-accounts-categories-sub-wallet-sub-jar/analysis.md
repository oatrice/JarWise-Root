# Analysis Template

> 📋 Template สำหรับการวิเคราะห์ก่อนเริ่มพัฒนา Feature

---

## 📌 Feature Information

| รายการ | รายละเอียด |
|--------|-----------|
| **Feature Name** | Hierarchical Accounts & Categories (Sub-Wallet, Sub-Jar) |
| **Issue URL** | [#67](https://github.com/example/repo/issues/67) |
| **Date** | 2023-10-27 |
| **Analyst** | Luma AI (Senior Technical Analyst) |
| **Priority** | 🔴 High |
| **Status** | 📝 Draft |

---

## 1. Requirement Analysis

### 1.1 Problem Statement

> อธิบายปัญหาที่ต้องการแก้ไข

```
The current system enforces a flat and rigid structure for financial accounts ("Jars") and categories, limiting users to a fixed set of top-level items. This prevents users from organizing their finances in a more granular, hierarchical way that matches their personal budgeting model. Consequently, detailed tracking is difficult, and reporting for broad categories can be skewed by large, specific expenses (e.g., a "Travel" expense bloating the general "Play" category).
```

### 1.2 User Stories

| # | As a | I want to | So that |
|---|------|-----------|---------|
| 1 | User | create custom categories and sub-categories under my main Jars | I can track my spending with greater detail and organization. |
| 2 | User | promote a frequently used category to become its own top-level Jar | I can assign it a dedicated budget and goal when it becomes a significant part of my finances. |
| 3 | User | demote a Jar to be a category under another Jar | I can simplify my budget structure if an expense area becomes less important. |
| 4 | User | freely add, delete, and reorder my Jars and categories | I can have full control to structure my financial plan exactly as I see fit. |

### 1.3 Acceptance Criteria

- [ ] **AC1:** Users can perform full CRUD (Create, Read, Update, Delete) operations on Jars (top-level items) and Categories (nested items) at any level.
- [ ] **AC2:** The system is pre-seeded with 6 default Jars (NEC, PLAY, etc.), but the user can modify or delete them.
- [ ] **AC3:** A user can "Promote" a category to a top-level Jar. All existing transactions associated with that category must be correctly re-assigned to the new Jar.
- [ ] **AC4:** A user can "Demote" a Jar to become a category under another Jar. All existing transactions associated with the demoted Jar must be correctly re-assigned to the new parent Jar.
- [ ] **AC5:** A user can re-order items (Jars or categories) within the same hierarchical level.
- [ ] **AC6:** When a user attempts to delete a Jar or Category that contains transactions, the system must prompt them to re-assign these transactions to another item before the deletion can be completed.
- [ ] **AC7:** The sum of percentage targets for Jars is optional and does not need to equal 100%.
- [ ] **AC8:** The API and database schema support a nested structure, with a recommendation to limit the depth to 3 levels on the UI for a better user experience.

---

## 2. Feature Analysis

### 2.1 User Flow

```mermaid
flowchart TD
    A[User opens Account/Jar Management screen] --> B[Views hierarchical list of Jars & Categories]
    B --> C{User wants to promote a Category}
    C -->|Yes| D[User selects a Category and clicks 'Promote']
    D --> E[System shows confirmation modal: "Promote 'Travel' to a new Jar?"]
    E --> F[User confirms]
    F --> G[Backend: Creates new Jar, updates parent_id, re-assigns associated transactions]
    G --> H[UI: Refreshes list to show new top-level Jar]
    H --> I[End]
    C -->|No| J[User performs other actions: Add, Edit, Reorder, etc.]
    J --> I
```

### 2.2 Screen/Page Requirements

| หน้าจอ | Actions | Components |
|--------|---------|------------|
| **Account/Jar Management** | View hierarchy, Add, Edit, Delete, Reorder (Drag & Drop), Promote, Demote | - Interactive Tree View Component<br>- "Add Jar/Category" Button<br>- Context Menu (Right-click or ellipsis) for actions<br>- Modal Forms for Add/Edit |
| **Transaction Form** | Select a category/jar for a transaction | - Hierarchical Dropdown/Selector Component |
| **Reports Screen** | Filter data by Jar or specific sub-category | - Multi-level Filter Component that reflects the hierarchy |

### 2.3 Input/Output Specification

#### Inputs

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | ✅ | Not empty, max 50 chars |
| `parent_id` | integer | ❌ | Must be a valid `id` from the same table if provided |
| `target_percent` | integer | ❌ | 0-100, applicable only to top-level Jars (level=0) |
| `icon` | string | ❌ | Valid icon identifier |
| `color` | string | ❌ | Valid hex color code |

#### Outputs

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier for the allocation item. |
| `name` | string | Name of the Jar or Category. |
| `parent_id` | integer/null | ID of the parent item; `null` for top-level Jars. |
| `level` | integer | The depth of the item in the hierarchy (0 for Jars). |
| `children` | array | An array of child allocation objects, representing the next level down. |
| `is_active` | boolean | Whether the item is active or archived. |

---

## 3. Impact Analysis

### 3.1 Affected Components

| Component | Impact Level | Description |
|-----------|--------------|-------------|
| **Database Schema** | 🔴 High | Requires deprecating old Jar/Category tables and creating a new unified `allocations` table. A data migration script is essential. |
| **Backend API** | 🔴 High | All endpoints related to Jars, Categories, and Transactions must be rewritten or replaced. New endpoints for hierarchy management (promote, demote, reorder) are needed. |
| **Frontend: Account Mgmt UI** | 🔴 High | The existing list view must be replaced with a new, complex tree view component to manage the hierarchy. |
| **Data Migration Script** | 🔴 High | A critical, one-time script is needed to migrate all existing user data from the old flat structure to the new hierarchical model without data loss. |
| **Frontend: Transaction Form** | 🟡 Medium | The simple category dropdown must be replaced with a hierarchical selector. |
| **Frontend: Reporting** | 🟡 Medium | Reporting logic and filters must be updated to aggregate and filter data based on the new parent-child relationships. |

### 3.2 Breaking Changes

- [ ] **BC1:** The API contract for fetching and managing accounts/categories will change completely. Old endpoints will be deprecated.
- [ ] **BC2:** The data structure of `Transaction` objects will be modified to use a single `allocation_id` foreign key instead of separate `jar_id` or `category_id`.
- [ ] **BC3:** Existing mobile/web clients will cease to function correctly without an update to support the new API and data structures.

### 3.3 Backward Compatibility Plan

```
A hard cutover is recommended due to the fundamental nature of the schema change.
1.  **API Versioning:** Introduce a new API version (e.g., /v2). All new features will be built on v2.
2.  **Forced Update:** Mobile clients will be required to update to a new version that consumes the v2 API.
3.  **Communication:** Clearly communicate the upcoming changes and the need for an update to the user base in advance.
A temporary compatibility layer for the v1 API is technically possible but would add significant complexity and is not recommended.
```

---

## 4. Feasibility Analysis

### 4.1 Technical Feasibility

| คำถาม | คำตอบ | หมายเหตุ |
|-------|-------|----------|
| เทคโนโลยีรองรับหรือไม่? | ✅ | The proposed adjacency list model (`parent_id`) is a standard and well-supported pattern in SQL databases. Modern frontend frameworks have robust libraries for tree views. |
| ทีมมี Skills เพียงพอหรือไม่? | ✅ | The required skills (SQL, API design, frontend state management) are standard for a web/mobile development team. The main challenge is careful planning, not technical capability. |
| Infrastructure รองรับหรือไม่? | ✅ | No special infrastructure is required. Database performance for recursive queries should be monitored and can be optimized with proper indexing. |

### 4.2 Time Feasibility

| ประเด็น | รายละเอียด |
|--------|-----------|
| **Estimated Effort** | 4-6 weeks | Includes backend, frontend, data migration, and testing. |
| **Deadline** | N/A | To be determined based on business priorities. |
| **Buffer Time** | 1 week | Recommended for handling unforeseen issues, especially with data migration. |
| **Feasible?** | ✅ | The timeline is challenging but achievable with a dedicated focus. The data migration is the highest-risk component affecting the timeline. |

### 4.3 Budget Feasibility

| รายการ | ค่าใช้จ่าย | หมายเหตุ |
|--------|-----------|----------|
| **Development Effort** | [Internal Cost] | Primary cost is developer and QA time. |
| **External Services** | None | No new third-party services or licenses are required for this feature. |
| **Total** | [Internal Cost] | |

---

## 5. Security Analysis

### 5.1 Sensitive Data

| ข้อมูล | Sensitivity Level | Protection Method |
|--------|------------------|-------------------|
| **Transaction Data** | 🔴 Critical | Encryption at rest, strict per-user access control on all API endpoints. |
| **Allocation Names** | 🟡 Sensitive | Per-user access control to prevent users from seeing each other's category names. |
| **User ID** | 🟡 Sensitive | Must be included in the `allocations` table to enforce data ownership. |

### 5.2 Attack Vectors

| Vector | Risk Level | Mitigation |
|--------|-----------|------------|
| **Insecure Direct Object Reference (IDOR)** | 🔴 High | An attacker could attempt to modify another user's categories by guessing IDs. Mitigation: Enforce strict ownership checks on every API call. Every query must be scoped to the authenticated `user_id`. |
| **Circular Dependency** | 🟡 Medium | A user could create an infinite loop by setting an item's parent to one of its own children. Mitigation: Implement server-side validation to prevent re-parenting an item to one of its descendants. |

### 5.3 Authentication & Authorization

```
- **Authentication:** All API endpoints must be protected and require a valid JWT or session token.
- **Authorization:** A `user_id` column **must be added** to the proposed `allocations` table. All database queries (SELECT, INSERT, UPDATE, DELETE) for allocations and related transactions must include a `WHERE user_id = :current_user_id` clause to ensure data isolation between users.
```

---

## 6. Performance & Scalability Analysis

### 6.1 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time (Get Hierarchy) | < 300ms | N/A |
| API Response Time (CRUD) | < 150ms | N/A |
| Error Rate | < 0.1% | N/A |

### 6.2 Scalability Plan

| Scenario | Expected Users | Scaling Strategy |
|----------|---------------|------------------|
| Normal | 10k - 100k | - Use Common Table Expressions (CTEs) for efficient recursive queries in SQL.<br>- Add database indexes on `parent_id` and `user_id`. |
| Peak | 100k+ | - Implement server-side caching (e.g., Redis) for user allocation hierarchies. Invalidate cache on any modification. |
| Growth (1yr) | 500k+ | - Monitor query performance. If CTEs become a bottleneck, consider alternative models like Materialized Path or Nested Set for representing hierarchies, though this adds complexity. |

---

## 7. Gap Analysis

| ด้าน | As-Is (ปัจจุบัน) | To-Be (ต้องการ) | Gap |
|------|-----------------|-----------------|-----|
| **Data Model** | Flat structure with separate `Jars` and `Categories` tables. | Single `allocations` table with a self-referencing `parent_id` to represent a tree. | Requires a complete database schema redesign and a complex data migration process. |
| **User Interface** | Simple list views for managing Jars and Categories separately. | A unified, interactive tree view for managing the entire hierarchy with drag-and-drop and context actions. | Requires a full rewrite of the account management screen using more advanced UI components. |
| **API Layer** | Separate RESTful endpoints for `/jars` and `/categories`. | A new set of endpoints (e.g., `/v2/allocations`) to manage the hierarchical structure. | Requires designing and building a new version of the API and planning for the deprecation of the old one. |

---

## 8. Risk Analysis

| Risk | Probability | Impact | Score | Mitigation Plan |
|------|-------------|--------|-------|-----------------|
| **Data Migration Failure** | 🟡 Medium | 🔴 High | 6 | Develop a thoroughly tested migration script. Perform dry runs on a staging DB with a production data snapshot. Have a clear rollback plan. |
| **Scope Creep** | 🔴 High | 🟡 Medium | 6 | Strictly adhere to the core features defined. Defer advanced reporting or analytics on the new hierarchy to a future release. Enforce a hard limit on nesting depth (e.g., 3 levels) initially. |
| **Performance Degradation** | 🟡 Medium | 🟡 Medium | 4 | Proactively implement performance best practices: use CTEs, index foreign keys and user IDs, and implement caching for the hierarchy data. |

> **Risk Score:** Probability × Impact (High=3, Medium=2, Low=1)

---

## 9. Summary & Recommendations

### 9.1 Analysis Summary

| หมวด | Status | Key Findings |
|------|--------|--------------|
| Requirement | ✅ Clear | The user need for a flexible, hierarchical structure is well-defined and justified. |
| Feature | ✅ Defined | Core operations (CRUD, Promote, Demote, Reorder) are clearly specified. |
| Impact | 🔴 High | This is a foundational architectural change affecting the entire stack from DB to UI. |
| Feasibility | ✅ Feasible | The feature is technically feasible but requires significant development effort and careful planning. |
| Security | ⚠️ Needs Review | The proposed schema is missing a `user_id` for ownership, which is a critical security requirement. |
| Performance | ✅ Acceptable | Performance is manageable with standard optimization techniques (indexing, caching, efficient queries). |
| Risk | ⚠️ Medium | The primary risk lies in the data migration process, which could lead to data loss if not executed perfectly. |

### 9.2 Recommendations

1.  **Amend Schema:** Immediately add a non-nullable `user_id` column to the proposed `allocations` table to enforce data ownership and security.
2.  **Prioritize Data Migration Plan:** The data migration script and its testing should be treated as a top-priority sub-task. A detailed plan, including rollback procedures, must be created and approved before implementation begins.
3.  **Adopt API Versioning:** Implement a `/v2` for the new API to ensure a clean break from the old structure and prevent disruption to existing clients who have not yet updated.

### 9.3 Next Steps

- [ ] [**Design**] Finalize the `allocations` table schema, including the `user_id` field and necessary indexes.
- [ ] [**Planning**] Create a detailed technical specification for the data migration script.
- [ ] [**Backend**] Design the new `/v2/allocations` API endpoints.
- [ ] [**Frontend**] Create mockups and select a component library for the hierarchical tree view UI.

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