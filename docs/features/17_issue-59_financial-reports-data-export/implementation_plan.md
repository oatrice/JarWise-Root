# Implementation Plan - [Issue #59] Financial Reports & Data Export

This plan covers the refinement of the **Specification (Step 4)** and **Technical Implementation Plan (Step 5)** for the Financial Reports feature. These documents will define the data structures, API endpoints, and UI components needed to provide comprehensive reporting across Web and Android.

## User Review Required

> [!IMPORTANT]
> **Data Aggregation Strategy:**
> We will implement aggregation on the **Backend** to ensure consistency between Web, Android, and iOS. The reports will provide summary data, trends (time-series), category breakdowns, and jar distributions.

> [!WARNING]
> **Export Functionality:**
> As noted in the existing spec, full "Data Export" (CSV/Excel/PDF) is partially split into issues #89 and #90. This plan focuses on the **Display & Charting** data required for #59, but will include placeholders for the export endpoints.

## Proposed Changes

### Documentation (Step 4 & 5)

#### [MODIFY] [spec.md](file:///Users/oatrice/Software-projects/JarWise/docs/features/17_issue-59_financial-reports-data-export/spec.md)
- Define detailed data requirements for each chart type (Monthly, Yearly, Jar Distribution, Spending Trends, Category Breakdown).
- Add Specification by Example (SBE) scenarios for filtering and period comparison.

#### [MODIFY] [plan.md](file:///Users/oatrice/Software-projects/JarWise/docs/features/17_issue-59_financial-reports-data-export/plan.md)
- Define the `GET /api/reports` response schema in detail.
- Specify the Backend logic for `ReportService` (Period-based grouping, Category/Jar mapping).
- Outline the Web implementation using `Recharts`.
- Outline the Android implementation using `Vico`.

---

### Backend (Go / SQLite)

#### [MODIFY] [report.go](file:///Users/oatrice/Software-projects/JarWise/Backend/internal/models/report.go)
- Enhance `Report` struct to include:
    - `Summary` (Income/Expense/Net)
    - `Trend` (Array of data points for line charts)
    - `ByCategory` (Map/Array for bar/pie charts)
    - `ByJar` (Map/Array for distribution charts)

#### [MODIFY] [report_service.go](file:///Users/oatrice/Software-projects/JarWise/Backend/internal/service/report_service.go)
- Implement logic to group transactions by date (Daily, Weekly, or Monthly based on range).
- Implement aggregation by Category and Jar.

#### [NEW] [report_service_test.go](file:///Users/oatrice/Software-projects/JarWise/Backend/internal/service/report_service_test.go)
- [TDD] Add test cases for different report ranges and filters.

---

### Web (React / TypeScript)

#### [NEW] `src/pages/Reports.tsx`
- Implement the Reports dashboard with multiple chart sections.
- Add components for Date Range Picker and Category/Jar filters.

### Android (Kotlin / Jetpack Compose)

#### [NEW] `ui/reports/ReportsScreen.kt`
- Implement the Reports UI using Compose and Vico charts.

## Open Questions

- **Date Range Granularity**: Should the backend automatically decide if the trend is daily, weekly, or monthly based on the selected range? (e.g., < 31 days = daily, > 1 year = monthly).
- **Comparison Logic**: Do we want the comparison to be a separate API call or part of the main report response?

## Verification Plan

### Automated Tests
- `go test ./internal/service/...` for report aggregation logic.
- Vitest/Jest tests for Web chart data parsing.

### Manual Verification
- Verify that charts update correctly when filters are applied.
- Compare backend response with manual database queries to ensure totals are accurate.
