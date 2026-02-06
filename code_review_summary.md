# Code Review Summary (Root + Web + Backend + Android)

**Generated:** 2026-02-06

## Root (JarWise)
- Review date: 2026-02-05
- Status: PASS
- Changes applied: None
- Notes: Test suggestions only (no code issues)

## Web
- Review date: 2026-02-05
- Status: Issue found (render-loop lookup)
- Changes applied:
- Added `transactionsById` memoized map to avoid `find()` in render loop.
- Updated `TransactionHistory` to use O(1) lookup for linked transfers.
- Files touched: `Web/src/pages/TransactionHistory.tsx`

## Backend
- Review date: 2026-02-05
- Status: Issue noted in report (JSON struct tags)
- Changes applied: None
- Notes: `internal/models/report.go` already uses standard `json:"..."` tags as of 2026-02-06, so no edit was required.

## Android
- Review date: 2026-02-05
- Status: Improvements suggested (performance + redundant state)
- Changes applied:
- Added `count()` query to `WalletDao` and used it for `initializeDefaultsIfEmpty`.
- Simplified `ReportFilterViewModel` by removing redundant ID lists and iterating maps directly.
- Files touched:
- `Android/app/src/main/java/com/oatrice/jarwise/data/WalletDao.kt`
- `Android/app/src/main/java/com/oatrice/jarwise/data/repository/WalletRepository.kt`
- `Android/app/src/main/java/com/oatrice/jarwise/ui/reportfilter/ReportFilterViewModel.kt`

## Pending Test Coverage (from reviews)
- Web filter-sheet behaviors (close without apply, clear then apply, reopen after apply).
- Backend report edge cases (empty results, combined filters, missing JarID).
- Android edge cases (empty wallet list, data-source error, unusual wallet names).
