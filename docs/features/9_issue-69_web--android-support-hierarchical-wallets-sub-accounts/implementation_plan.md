# Implementation Plan: Hierarchical Wallets (Sub-accounts) #69

**Feature:** Support Hierarchical Wallets (Sub-accounts)
**Issue:** [#69](https://github.com/oatrice/JarWise-Root/issues/69)
**Status:** In Progress
**Parent Context:** This feature is a specific enhancement under [#67 Hierarchical Accounts](../../8_issue-67_feature-hierarchical-accounts-categories-sub-wallet-sub-jar/spec.md).
**Specification:** [spec.md](./spec.md)

---

## 🗺️ Roadmap

## 🗺️ MVP Roadmap (Shared)

```
Phase 1: Foundation                      Phase 2: Migration       Phase 3: Usability
#69 Wallets Mock (Web) ──┐
                         ├──→ #67 Hierarchy (Full) ──→ #65 Migration ──→ #68 Report Filter
#57 Custom Wallets ──────┘
```

> **Note:** This document focuses on **#69 Wallets Mock (Phase 1.1)**.

## 📍 Local Plan (Issue #69)

```
Phase 1: Web Mock UI (Current Focus) ──→ Phase 2: Android Implementation ──→ Phase 3: Integration
```

| Phase | Component | Goal |
|-------|-----------|------|
| **1 (Priority)** | **Web (Mock)** | **Validate UI/UX for sub-accounts with Visual Tree & Parent Selection.** |
| 2 | Android | Implement logic in `ManageWalletsViewModel` and UI. |
| 3 | Shared | Full database migration and integration with Issue #67. See [Issue #70](https://github.com/oatrice/JarWise-Root/issues/70). |

---

## 🛠️ Phase 1: Web Mock UI (Detailed)

### 1. Data Model Updates
Modify `src/utils/generatedMockData.ts` to include hierarchy fields for Wallets.

```typescript
export type Wallet = {
    id: string;
    name: string;
    balance: number;
    color: string;
    icon: LucideIcon;
    // New Fields
    parentId: string | null; // NULL = Top Level
    level: number;           // 0 = Root, 1 = Sub-account
}
```

### 2. Mock Data Seeding
Add sample hierarchical data:
- **Bank Account** (Parent)
    - **Savings** (Child)
    - **Checking** (Child)
- **Cash Wallet** (Parent)

### 3. UI Implementation (`ManageWallets.tsx`)
- **Visual Tree:** Render wallets with indentation to show hierarchy.
- **Add/Edit Modal:** Add a "Parent Wallet" dropdown selector.
    - Validate that a wallet cannot inherit from itself or its descendants.
- **Delete Logic:** Mock behavior for creating "Delete" confirmation (Standard behavior: Prevent delete if has children, or Cascade).

---

## 🧪 Verification Plan

### Phase 1: Web Manual Verification
1.  **View:** Verify that "Savings" appears nested under "Bank Account" with correct indentation.
2.  **Create:** Click "Add Wallet", select "Bank Account" as parent, save, and verify it appears as a child.
3.  **Edit:** Change a wallet's parent and verify it moves in the list.
4.  **Delete:** Try to delete a parent wallet (Mock alert).

---

## 🔗 Dependencies
- Relies on the `Allocation` concept from Issue #67 but applied to Wallets.
- Requires `feat/69-hierarchical-wallets` branch.
