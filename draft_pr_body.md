```markdown
# 📋 Monorepo Update Summary
This Pull Request introduces comprehensive financial reporting and data export capabilities across Web and Android platforms. It includes a robust backend data aggregation engine and redesigned UI components for interactive charting and analysis.

## ✅ Checklist
- [x] 🏗️ I have moved the related issue to "In Progress" on the Kanban board

## 🎯 Type

- [ ] 📦 Monorepo Structure
- [x] 📄 Documentation (Root)
- [ ] 🔄 Workflow/CI Update
- [ ] 🚀 Release Management
- [ ] 💥 Breaking change
- [x] ✨ Feature (Implicit, as a new functional capability)

## 🔗 Affected Platforms

- [x] Web
- [x] Android
- [ ] iOS
- [ ] Mobile (Flutter)

## 📝 Detailed Changes

This PR implements Issue #59: "[Web | Android] Financial Reports & Data Export," aiming to provide users with deep insights into their spending habits through interactive charts, category breakdowns, and period comparisons. While the objective includes "data export capabilities," the current focus is on "Display & Charting," with full export functionality (CSV/Excel/PDF) slated for future issues (#89 and #90).

### 1. Backend: Data Aggregation Engine (Go)
The core logic for processing transactions and generating report data has been implemented.
-   **Dynamic Bucketing**: Data points are automatically grouped into daily or monthly trends.
-   **Dual Breakdown**: Tracks both Income and Expense for categories and jars separately.
-   **Comparison Logic**: Automatically fetches and compares data with the previous period (e.g., this month vs. last month).
-   **Consolidated Models**: Refactored `Report` and `ChartData` into a unified structure for cross-platform consistency.

### 2. Web: Interactive Dashboard (React)
The React dashboard has been updated with real-time data fetching and interactive Recharts.
-   **Date Range Filters**: Supports Month, Quarter, and Year views.
-   **Summary Cards**: Provides a quick view of Total Income, Expense, and Net balance.
-   **Rich Charts**:
    -   **Trend Line Chart**: Comparison of income vs. expense over time.
    -   **Dual Bar Chart**: Category-wise revenue/expense breakdown.
    -   **Jar Distribution**: Pie chart showing allocation per jar.
-   **Comparison Section**: Visual indicator of spending changes from the previous period.

### 3. Android: Analytics Screen (Jetpack Compose)
A premium analytics experience has been developed using Jetpack Compose and the Vico chart library.
-   **Unified Data Layer**: Implemented full DTO, API (Retrofit), and Repository layers for reporting.
-   **DI & State Management**: Integrated `ReportsViewModel` with Koin-based dependency injection.
-   **Premium UI**: Features smooth loading states, transitions, and multi-series line/bar charts for trends and categories.

## 📸 Screenshots (if applicable)
<!-- 
Please add screenshots of the new financial reports on both Web and Android,
using width="400" for each. Example:

<img src="https://raw.githubusercontent.com/oatrice/JarWise-Root/branch-name/path/to/web_screenshot.png" width="400" />
<img src="https://raw.githubusercontent.com/oatrice/JarWise-Root/branch-name/path/to/android_screenshot.png" width="400" />
-->
No screenshots provided in the `docs` folder for this feature yet. Please add them manually if available.

## 🧪 Testing
-   **Automated Tests (Backend)**: Unit tests in `report_service_test.go` cover aggregation, trend grouping, and period comparison calculations. All tests passed.
-   **Manual Verification (Web)**: Verified data fetching from `/api/v1/reports` and UI rendering.
-   **Manual Verification (Android)**: Verified UI components and chart rendering using mock data (full integration testing pending backend deployment).

## 🚀 Migration/Deployment

- [ ] Environment variables updated
- [ ] Global Dependencies installed

```bash
# No specific migration commands required for this feature,
# but ensure the backend server is running for full functionality.
```

## 🔗 Related Issues

- Resolves https://github.com/oatrice/JarWise-Root/issues/59

**Breaking Changes**: No
**Migration Required**: No
```