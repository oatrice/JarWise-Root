# Specification

| | |
| --- | --- |
| **Feature ID** | `REPORT-02` |
| **Feature Name** | Report Filter: Multi-Select Categories & Accounts |
| **Issue URL** | https://github.com/oatrice/JarWise-Root/issues/68 |
| **Version** | `1.1` |
| **Status** | `Implemented (MVP)` |

---

## 1. Goal

Provide users with granular control over **Transaction History** by allowing them to filter results by multiple Categories (Jars) and Accounts (Wallets). The intent is to enable focused review of transactions without changing core report logic yet.

## 2. Scope (Current Implementation)

### 2.1 Web
- Location: **Transaction History** page.
- UI: Bottom sheet modal with multi-select dropdowns for Jars and Wallets.
- Actions: **Apply** and **Clear**.
- Indicator: Active filter dot on filter icon.
- Data: Client-side filtering of local transactions (localStorage).

### 2.2 Android
- Location: **Transaction History** screen.
- UI: Bottom sheet with selectable lists for Jars and Wallets.
- Actions: **Apply** and **Clear**.
- Indicator: Filter icon changes color when active.
- Data: Client-side filtering of in-memory transactions.

### 2.3 Backend
- Endpoint: `GET /api/v1/reports`
- Filters: `jar_ids`, `wallet_ids` (comma-separated strings).
- Compatibility: Supports `category_ids` and `account_ids` aliases.
- Date filters: `start_date`, `end_date` (YYYY-MM-DD or RFC3339).

## 3. User Journey (Implemented)

1. User opens **Transaction History**.
2. User taps the **Filter** icon.
3. User selects one or more Jars and/or Wallets.
4. User taps **Apply**.
5. Transaction list and count update to match the selected filters.
6. Filter icon shows active state.
7. User can tap **Clear** to remove all filters.

## 4. Functional Requirements (Implemented)

| ID | Requirement | Description |
| --- | --- | --- |
| **FR1** | Filter UI | A filter modal/bottom sheet is accessible from Transaction History. |
| **FR2** | Multi-Select Jars | Users can select multiple Jars (Categories). |
| **FR3** | Multi-Select Wallets | Users can select multiple Wallets (Accounts). |
| **FR4** | Apply/Clear | Users can apply current selections or clear all filters. |
| **FR5** | Filtered Count | The transaction count reflects filtered results. |
| **FR6** | Active Indicator | Filter icon shows active state when filters are applied. |

## 5. Deferred / Not Implemented (Yet)

- **Select All** action per section.
- **Real-time updates** without pressing Apply.
- **Session persistence** when navigating away and returning.
- **Hierarchy-aware selection** (parent/child).
- **Report page integration** (filters currently live on Transaction History only).

## 6. Non-Functional Requirements

| ID | Requirement | Description |
| --- | --- | --- |
| **NFR1** | Usability | Filter lists remain scrollable when options exceed viewport height. |
| **NFR2** | Performance | Filtering should feel instant for typical local datasets (<1,000 transactions). |

## 7. Specification by Example (Updated)

### Scenario: Filter Transaction History by Jar + Wallet

**Given** the user has these transactions:

| Date | Note | Amount | Jar | Wallet |
| --- | --- | --- | --- | --- |
| 2026-02-01 | Groceries | 50 | necessities | wallet-cash |
| 2026-02-02 | Flight | 300 | travel | wallet-bank |
| 2026-02-03 | Coffee | 5 | play | wallet-cash |

**When** the user selects:
- Jars: `necessities`, `play`
- Wallets: `wallet-cash`

**Then** only these transactions are shown:

| Date | Note | Amount | Jar | Wallet |
| --- | --- | --- | --- | --- |
| 2026-02-01 | Groceries | 50 | necessities | wallet-cash |
| 2026-02-03 | Coffee | 5 | play | wallet-cash |

**And** the transaction count updates to `2`.

## 8. Dependencies

- **#67 (Hierarchical Accounts & Categories)**: Needed for hierarchical selection (deferred).
- **#59 (Reports & Data Export)**: Filters are currently applied in Transaction History; report pages can adopt these filters later.
