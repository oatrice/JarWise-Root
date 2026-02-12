# Implementation Plan: Report Filter: Multi-Select Categories & Accounts

> **Refers to**: [Spec Link](./spec.md)
> **Status**: Completed (MVP)

## 1. Architecture & Design (Delivered)

The filter UI is implemented on **Transaction History** (Web + Android) with client-side filtering of the visible transaction list. A bottom sheet / modal exposes multi-select jars and wallets, and an **Apply** button updates results. A visual indicator on the Filter icon shows when filters are active.

Backend support was added to `/api/v1/reports` to accept jar/wallet filters for future report pages.

### Components Implemented

**Web**
- `Web/src/components/MultiSelectDropdown.tsx`
- `Web/src/components/ReportFiltersSheet.tsx`
- `Web/src/pages/TransactionHistory.tsx`

**Android**
- `Android/app/src/main/java/com/oatrice/jarwise/ui/reportfilter/ReportFilterUiState.kt`
- `Android/app/src/main/java/com/oatrice/jarwise/ui/reportfilter/ReportFilterViewModel.kt`
- `Android/app/src/main/java/com/oatrice/jarwise/ui/reportfilter/ReportFilterSheet.kt`
- `Android/app/src/main/java/com/oatrice/jarwise/ui/TransactionHistoryScreen.kt`

**Backend**
- `Backend/internal/models/report.go`
- `Backend/internal/service/report_service.go`
- `Backend/internal/api/handlers/report_handler.go`
- `Backend/internal/api/router.go`
- `Backend/internal/repository/transaction_repository.go`

---

## 2. Deviations from Original Plan

- Filters are implemented on **Transaction History** instead of Reports page.
- Web implementation is **fully functional** (not mock-only).
- No **Select All** actions; only **Clear** and **Apply**.
- No **session persistence** across navigation (in-session only).

---

## 3. Verification Plan (Completed)

### Automated Tests
- **Web**: `cd Web && npm test` ✅
- **Backend**: `cd Backend && go test ./...` ✅
- **Android**: `./Android/scripts/run_tests.sh` ✅

### Manual Verification (Key Steps)
- Open Transaction History → open Filter sheet.
- Select jar/wallet → Apply → list and count update.
- Clear → Apply → list resets.
- Filter indicator shows when active.
- No-matches state shows if filters return empty list.

---

## 4. Manual Verification (Human QA)

### Android (Transaction History)

1. Open **Transaction History**.
2. Tap **Filter** icon (top-right).
   - Expect: Bottom sheet appears with **Jars** and **Wallets** sections.
3. Select one Jar (e.g. `Necessities`), tap **Apply**.
   - Expect: List is filtered, count decreases, filter icon turns **active** (blue).
4. Open Filter again, select another Jar (e.g. `Play`), tap **Apply**.
   - Expect: List shows both jars.
5. Open Filter, tap **Clear** then **Apply**.
   - Expect: All transactions return, filter icon inactive (gray).
6. Select combination with no matches, tap **Apply**.
   - Expect: Empty state “No matches found”.
7. Open Filter, change selections, dismiss by tapping outside.
   - Expect: No change unless **Apply** tapped.

### Web (Transaction History)

1. Navigate to **Transaction History**.
2. Click **Filter** icon.
   - Expect: Bottom sheet modal opens.
3. Select Jar(s) and Wallet(s), click **Apply Filters**.
   - Expect: List filtered, count updates, active dot appears.
4. Click **Clear**, then **Apply Filters**.
   - Expect: Full list returns.
5. Choose filters with no matches.
   - Expect: “No matches found” empty state.

### Backend (Reports API)

1. Start server: `cd Backend && go run cmd/server/main.go`
2. Visit:
   - `GET /api/v1/reports`
   - `GET /api/v1/reports?jar_ids=necessities`
   - `GET /api/v1/reports?wallet_ids=wallet-bank`
3. Expect:
   - JSON response includes `transaction_count` and filtered list.

