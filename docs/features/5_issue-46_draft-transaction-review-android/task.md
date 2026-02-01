# Task: Draft Transaction Review (Android) - Issue #46

## Overview
Implement Draft Transaction feature for Android, porting functionality from JarWise-Web. Includes 5 features implemented in phases.

---

## Phase 1: Draft Transaction Review (Core)
> **Priority:** 🔴 High | **Status:** ✅ Complete

- [x] Write `TransactionDraftTest.kt` (TDD RED phase)
- [x] Update `Transaction.kt` - Add `status` and `type` fields
- [x] Update `TransactionDao.kt` - Add draft query methods
- [x] Create database migration for new fields
- [x] Update `SlipImportScreen.kt` - Add "Save Draft" button
- [x] Update `TransactionCard.kt` - Add Draft badge/styling
- [x] Write unit tests for draft logic
- [x] Manual verification ✅ Passed

---

## Phase 2: Transaction Grouping + Daily Totals
> **Priority:** 🟡 Medium | **Status:** 🚀 In Progress

- [x] Create `TransactionGroupingUtilsTest.kt` (TDD RED)
- [x] Create `TransactionGroupingUtils.kt` with grouping logic
- [x] Add `DailyTransactionGroup` data class
- [x] Update `TransactionHistoryScreen.kt` with grouped UI
- [x] Write unit tests (TDD GREEN) ✅ 5/5 pass
- [/] Manual verification

---

## Phase 3: Scroll-to-Hide + BottomNav
> **Priority:** 🟡 Medium | **Status:** 📝 Planned

- [ ] Implement scroll direction detection hook
- [ ] Add scroll-to-hide animation for TopAppBar
- [ ] Create reusable BottomNav component
- [ ] Integrate BottomNav with scroll visibility

---

## Backlog
- [ ] Backend API integration (separate issue created)
- [ ] Sync offline drafts with backend when online
