# Analysis Template

> 📋 Template สำหรับการวิเคราะห์ก่อนเริ่มพัฒนา Feature

---

## 📌 Feature Information

| รายการ | รายละเอียด |
|--------|-----------|
| **Feature Name** | Financial Reports & Data Export |
| **Issue URL** | [#59](https://github.com/oatrice/JarWise-Root/issues/59) |
| **Date** | 2026-02-12 |
| **Analyst** | AI Assistant |
| **Priority** | 🟡 Medium |
| **Status** | 📝 Draft |

---

## 1. Requirement Analysis

### 1.1 Problem Statement

> อธิบายปัญหาที่ต้องการแก้ไข

```
Currently, users lack a comprehensive view of their financial health. While they can see individual transactions and Jar totals, they cannot easily analyze trends, category breakdowns, or export data for external use. This limits their ability to make informed long-term financial decisions.
```

### 1.2 User Stories

| # | As a | I want to | So that |
|---|------|-----------|---------|
| 1 | User | view monthly and yearly summary reports | I can see my income vs. expenses at a glance. |
| 2 | User | see visual charts (Line, Bar, Pie) of my spending | I can easily identify trends and major expense categories. |
| 3 | User | export my transaction data to Excel or CSV | I can perform custom analysis or backup my data. |

### 1.3 Acceptance Criteria

- [ ] **AC1:** Reports Dashboard displays key metrics (Total Income, Expenses, Balance) for selected period.
- [ ] **AC2:** Charts (Trend Line, Category Bar, Jar Pie) render correctly with real data.
- [ ] **AC3:** Date range selector allows filtering by Month, Year, or Custom Range.
- [ ] **AC4:** Export function generates valid .xlsx and .csv files containing filtered transaction data.
- [ ] **AC5:** Backend provides optimized endpoints for aggregated report data.

---

## 2. Feature Analysis

### 2.1 User Flow

```mermaid
flowchart TD
    A[User navigates to Reports] --> B[View Dashboard (Summary Cards & Charts)]
    B --> C{Interact with Filters}
    C -->|Select Date Range| D[Dashboard updates data]
    C -->|Select Jar/Wallet| D
    B --> E[Click 'Export Data']
    E --> F[Select Format (Excel/CSV)]
    F --> G[Download/Share File]
```

### 2.2 Screen/Page Requirements

| หน้าจอ | Actions | Components |
|--------|---------|------------|
| **Reports Dashboard** | - View Summary Cards<br>- View Charts<br>- Filter Date/Jar<br>- Export Data | - **Summary Cards:** Income, Expense, Net.<br>- **Charts:** Line (Trend), Bar (Category), Pie (Jar).<br>- **Filter Bar:** Date Range Picker, Dropdowns.<br>- **Export Button:** Triggers export dialog. |

### 2.3 Input/Output Specification

#### Inputs

(For Backend API)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `startDate` | string (date) | ✅ | Start of reporting period. |
| `endDate` | string (date) | ✅ | End of reporting period. |
| `walletId` | string (uuid) | ❌ | Filter by specific wallet (optional). |
| `jarId` | string (uuid) | ❌ | Filter by specific jar (optional). |

#### Outputs

(API Response Body - Aggregated Data)

| Field | Type | Description |
|-------|------|-------------|
| `summary` | object | `{ income: 1000, expense: 500, net: 500 }` |
| `trend` | array | `[{ date: "2023-01", income: 500, expense: 200 }, ...]` |
| `byCategory` | array | `[{ categoryId: "c1", name: "Food", amount: 300 }, ...]` |
| `byJar` | array | `[{ jarId: "j1", name: "Necessary", amount: 400 }, ...]` |
| `comparison` | object | `{ current: {...}, previous: {...} }` |

#### Comparison Logic
- **Monthly:** Compare current month vs previous month (or same month last year).
- **Yearly:** Compare current year vs previous year.

---

## 3. Impact Analysis

### 3.1 Affected Components

| Component | Impact Level | Description |
|-----------|--------------|-------------|
| **Backend API** | 🔴 High | New endpoints for aggregated data and export generation. |
| **Web/Android/iOS UI** | 🟡 Medium | New screens and chart library integration. |
| **Database** | 🟢 Low | Read-heavy operations; may need indexing on `transaction_date`. |

