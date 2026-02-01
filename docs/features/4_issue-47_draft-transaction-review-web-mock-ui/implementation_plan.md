# Implementation Plan: Transaction Group Summary

**Issue:** [#47](https://github.com/oatrice/JarWise-Root/issues/47) | **Branch:** `feat/transaction-group-summary`

**Goal:** Group transactions by date with daily income/expense totals and scroll-to-hide navigation.

## User Review Required

> [!IMPORTANT]
> **Database Schema:** This feature requires adding a `status` field (ENUM: 'pending', 'draft', 'approved') to the Transaction model.
> **Breaking Change:** API consumers may need to filter out drafts from normal transaction queries.

---

## Proposed Changes

### Web Platform

---

#### Data Layer

##### [MODIFY] [Transaction.ts](file:///Users/oatrice/Software-projects/JarWise/Web/src/types/Transaction.ts)
- Add `status: 'pending' | 'draft' | 'approved'` field to Transaction interface.
- Add `slipImageUrl?: string` for slip reference.

##### [NEW] [useDraftTransactions.ts](file:///Users/oatrice/Software-projects/JarWise/Web/src/hooks/useDraftTransactions.ts)
- Hook for managing draft transaction CRUD operations.
- Methods: `saveDraft()`, `getDrafts()`, `deleteDraft()`, `resumeDraft()`.

---

#### UI Layer

##### [MODIFY] [ImportSlip.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/ImportSlip.tsx)
- Add "Save as Draft" button alongside "Approve" button.
- Implement draft saving logic with confirmation feedback.

##### [NEW] [DraftList.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/DraftList.tsx)
- Display list of pending draft transactions.
- Enable resume/delete actions per draft.
- Show draft count, amount preview, and date.

##### [MODIFY] [Dashboard.tsx](file:///Users/oatrice/Software-projects/JarWise/Web/src/pages/Dashboard.tsx)
- Add Draft Card widget showing pending draft count.
- Navigate to DraftList on tap.

---

## Verification Plan

### Manual Verification
1. **Save Draft Flow:**
   - Import slip → Edit transaction data → Tap "Save Draft"
   - Verify confirmation toast appears
   - Verify transaction appears in Draft List
2. **Resume Draft Flow:**
   - Open Draft List → Tap a draft
   - Verify Review screen opens with pre-filled data
3. **Dashboard Widget:**
   - Verify draft count updates correctly
   - Verify navigation to Draft List works
