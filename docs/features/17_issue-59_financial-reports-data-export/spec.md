# Specification

**Feature ID:** `FEAT-059`
**Title:** Financial Reports & Charts
**Platforms:** Android, Web, iOS
**Related Issue:** [#59](https://github.com/oatrice/JarWise-Root/issues/59)

---

## 1. User Story

**As a** user,
**I want to** view comprehensive financial reports with interactive charts,
**so that I can** analyze my spending habits, identify trends, and make informed financial decisions.

---

## 2. Acceptance Criteria

### Reports & Charts
- [ ] **AC1: Monthly Report:** Summary of income and expenses by category for a selected month.
- [ ] **AC2: Yearly Report:** Annual overview with income/expense trends.
- [ ] **AC3: Jar Distribution:** Pie/Donut chart showing expense distribution across Jars.
- [ ] **AC4: Spending Trends:** Line chart showing spending over time (daily/weekly/monthly).
- [ ] **AC5: Category Breakdown:** Bar chart showing expenses by category.
- [ ] **AC6: Comparison:** Compare financial data between months or years side-by-side.

### Filters & Options
- [ ] **AC7: Date Range:** Custom date range selection for reports.
- [ ] **AC8: Filter by Jar/Wallet:** Filter by specific Jars or Wallets.
- [ ] **AC9: Filter by Category:** Filter by specific categories.

> [!NOTE]
> **Export features** (Excel, CSV, PDF, DB Backup) have been split into separate issues:
> - [#89](https://github.com/oatrice/JarWise-Root/issues/89) - Data Export (Excel & CSV)
> - [#90](https://github.com/oatrice/JarWise-Root/issues/90) - PDF Report Generation
> - [#91](https://github.com/oatrice/JarWise-Root/issues/91) - Database Backup (Android)

---

## 3. User Journey

1.  **Navigation:** User navigates to a "Reports" tab.
2.  **Dashboard:** User sees Summary Cards (Income, Expense, Net) and key charts.
3.  **Charts:** User taps on a chart to view detailed drilldown (e.g., Monthly Report).
4.  **Filtering:** User applies filters (date range, Jar, Category) to update all charts.

---

## 4. Specification by Example (SBE)

### Scenario 1: Viewing Spending Trends
**Given** the user has transaction data for the last 6 months
**When** the user views the "Spending Trends" chart
**Then** a line chart is displayed showing total expenses for each of the last 6 months
**And** tapping a data point shows the exact total for that month.

### Scenario 2: Comparing Two Months
**Given** the user is on the Reports screen
**When** the user selects "Compare" and chooses January vs February
**Then** a side-by-side bar chart shows income and expenses for both months.

---
