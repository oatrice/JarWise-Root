# Implementation Plan: Financial Reports & Charts

> **Refers to**: [Spec Link](./spec.md)
> **Status**: Draft

## 1. Architecture & Design

Centralized backend for data aggregation ensures consistency across platforms.

### Component View
> [!IMPORTANT]
> **Platform Scope Policy:**
> - **Android**: Charts using Vico.
> - **Web**: Charts using Chart.js/Recharts.
> - **iOS**: Charts using SwiftCharts.

- **Modified Components**:
    - **All Platforms**: Navigation to include a "Reports" tab.
- **New Components**:
    - **Backend**: `ReportHandler` endpoint `GET /api/reports`
    - **Web**: `src/pages/Reports.tsx`
    - **Android**: `ui/reports/ReportsScreen.kt`
    - **iOS**: `Views/Reports/ReportsView.swift`

### API Response

```json
{
  "summary": { "income": 1000, "expense": 500, "net": 500 },
  "trend": [{ "date": "2023-01", "income": 500, "expense": 200 }],
  "byCategory": [{ "categoryId": "c1", "name": "Food", "amount": 300 }],
  "byJar": [{ "jarId": "j1", "name": "Necessary", "amount": 400 }],
  "comparison": { "current": {}, "previous": {} }
}
```

---

## 2. Step-by-Step Implementation

### Step 0: Backend API
- Create `GET /api/reports` with query params: `from`, `to`, `wallet_id`, `jar_id`.
- Return aggregated JSON data.

### Step 1: Web UI
- `src/pages/Reports.tsx` with Recharts.
- Summary Cards + Line/Bar/Pie charts + Filter bar.

### Step 2: Android UI
- `ui/reports/ReportsScreen.kt` with Vico.
- Summary Cards + Charts + Filters.

### Step 3: iOS UI
- `Views/Reports/ReportsView.swift` with SwiftCharts.
- Summary Cards + Charts + Filters.

> [!NOTE]
> Export features are tracked in separate issues: #89, #90, #91.

---
