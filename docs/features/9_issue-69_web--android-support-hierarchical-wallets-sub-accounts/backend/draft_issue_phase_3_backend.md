---
title: "[Backend] Hierarchical Wallets - Safe Deletion & Validation (Phase 3)"
labels: ["backend", "feature", "phase-3"]
---

# Feature: Hierarchical Wallets Backend Support

This issue covers the backend implementation and full database integration for Hierarchical Wallets (Sub-accounts), following the initial Web Mock UI (Phase 1) and Android UI (Phase 2).

## 1. Overview

**Related Issue:** [#69](https://github.com/oatrice/JarWise-Root/issues/69) (Web Mock UI Phase)

We need to implement the core backend logic to support robust parent-child wallet relationships, specifically ensuring data integrity during creation and deletion.

## 2. Requirements

### 2.1 API Updates

- **`POST /api/wallets` & `PUT /api/wallets/:id`**
    - Accept `parentId` field.
    - **Validation:**
        - `parentId` cannot be the wallet's own ID.
        - **Circular Dependency Check:** Prevent A -> B -> A.

- **`DELETE /api/wallets/:id`**
    - **Check for Children:** Prevent deletion if children exist and no reassignment plan is provided.
    - **Reassignment Logic:** explicit `reassignChildrenTo` param in body.
        - If present, move all children to new parent (or root if null) before deleting.
        - Must be atomic (transactional).

### 2.2 Database

- Ensure `Allocation.parentId` is indexed.
- (Optional) Foreign Key constraint `parentId` references `id`.

## 3. Implementation Plan (from Design Doc)

1.  **Modify Controller/Service:** Update `WalletService` to handle `parentId` and implement circular dependency checks.
2.  **Transactions:** Wrap deletion+reassignment in a single DB transaction.
3.  **Tests:**
    - Unit tests for circular dependency detection.
    - Integration tests for Atomic Deletion (ensure children are moved, not orphaned).

## 4. Risks

- **Deep Nesting Performance:** Recursion checks should be optimized.
- **Data Integrity:** Must ensure no "orphan" wallets exist if a delete operation fails halfway.
