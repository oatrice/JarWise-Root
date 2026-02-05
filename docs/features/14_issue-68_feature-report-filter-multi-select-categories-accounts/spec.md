# Specification

| | |
| --- | --- |
| **Feature ID** | `REPORT-02` |
| **Feature Name** | Report Filter: Multi-Select Categories & Accounts |
| **Version** | `1.0` |
| **Status** | `Draft` |

---

## 1. Goal

To provide users with granular control over their financial reports and charts by allowing them to dynamically include or exclude specific categories (Jars) and accounts (Wallets). This enables more focused analysis, helping users gain precise insights into their spending, saving, and income patterns.

## 2. Actors

*   **User**: Any individual viewing a report who wants to customize the data being displayed.

## 3. User Journey

1.  **Navigate to Reports**: The user navigates to a report page (e.g., "Spending by Category").
2.  **Identify Filter Control**: The user sees a "Filter" button. By default, it may have a badge indicating no active filters.
3.  **Open Filter Panel**: The user clicks the "Filter" button, which opens a filter panel (e.g., a collapsible sidebar or a modal).
4.  **View Filter Options**: The panel displays two primary sections:
    *   **Accounts (Wallets)**: A list of all available accounts with checkboxes.
    *   **Categories (Jars)**: A list of all available categories with checkboxes.
    *   By default, all checkboxes in both sections are checked.
5.  **Apply Filters**: The user customizes the selection. For example, they uncheck the "Groceries" category and the "Business Credit Card" account.
6.  **See Real-time Updates**: As the user changes the checkbox selections, the report data (charts, tables, summary totals) updates instantly to reflect the new criteria. The total count of displayed transactions also updates.
7.  **Use Bulk Actions**: The user notices the "Select All" and "Clear All" buttons within each section. They click "Clear All" under "Categories" to quickly deselect everything, then select only the "Travel" and "Dining Out" categories.
8.  **Close Panel**: The user closes the filter panel. The report remains in its filtered state.
9.  **Observe Filter Indicator**: The "Filter" button now displays a visual indicator (e.g., a colored dot or a badge) to signify that filters are currently active.
10. **Session Persistence**: The user navigates to another part of the application and then returns to the same report. Their previously selected filters ("Travel" and "Dining Out" categories) are still applied.

## 4. Functional Requirements

| ID | Requirement | Description |
| --- | --- | --- |
| **FR1** | **Filter Panel UI** | The system must provide a filter panel (sidebar or modal) that is accessible from report pages. |
| **FR2** | **Multi-Select Accounts** | Users must be able to select or deselect one or more accounts (Wallets) using checkboxes to include or exclude their transactions from the report. |
| **FR3** | **Multi-Select Categories** | Users must be able to select or deselect one or more categories (Jars) using checkboxes to include or exclude their transactions from the report. |
| **FR4** | **Bulk Selection Actions** | Each filter section (Accounts, Categories) must include "Select All" and "Clear All" (or "Deselect All") actions to modify all checkboxes in that section at once. |
| **FR5** | **Real-time Report Update** | The report data, charts, and summary figures must update automatically and immediately whenever a filter selection is changed. |
| **FR6** | **Filtered Transaction Count** | The UI must display a count of the transactions that match the current filter criteria. |
| **FR7** | **Active Filter Indicator** | A persistent visual indicator (e.g., a badge on the "Filter" button) must be displayed when any filter is active (i.e., not in its default "all selected" state). |
| **FR8** | **Session Persistence** | The applied filter state for a given report type must be remembered for the duration of the user's session. |
| **FR9** | **Hierarchical Selection (Conditional)** | *If hierarchical items are available (see Dependencies)*, selecting/deselecting a parent item must automatically select/deselect all of its child items. |

## 5. Non-Functional Requirements

| ID | Requirement | Description |
| --- | --- | --- |
| **NFR1** | **Performance** | Report updates after a filter change should complete in under 2 seconds for a dataset of up to 10,000 transactions. |
| **NFR2** | **Usability** | The filter panel must be intuitive and handle a large number of categories/accounts gracefully (e.g., with scrolling). |

## 6. Specification by Example (SBE)

### Scenario 1: Vacation Spending Review

*   **Given**: The user has the following transactions recorded:

    | Date | Payee | Amount | Category | Account |
    | :--- | :--- | :--- | :--- | :--- |
    | 2023-10-01 | SuperMart | $50.00 | Groceries | Checking |
    | 2023-10-02 | Gas Station | $40.00 | Transport | Credit Card |
    | 2023-10-03 | Airline Co. | $300.00 | Travel | Credit Card |
    | 2023-10-04 | Beach Cafe | $25.00 | Dining Out | Credit Card |
    | 2023-10-05 | Rent | $1200.00 | Housing | Checking |

*   **When**: The user wants to review only their vacation spending, which was paid for with their Credit Card. They apply the following filters:

    **User Filter Selection**
    | Filter Group | Selected Items |
    | :--- | :--- |
    | **Accounts** | `[x] Credit Card`, `[ ] Checking` |
    | **Categories** | `[x] Travel`, `[x] Dining Out`, `[ ] Groceries`, `[ ] Transport`, `[ ] Housing` |

*   **Then**: The report updates to show only the transactions that match **both** the account and category selections.

    **Resulting Report Data**
    | Date | Payee | Amount | Category | Account |
    | :--- | :--- | :--- | :--- | :--- |
    | 2023-10-03 | Airline Co. | $300.00 | Travel | Credit Card |
    | 2023-10-04 | Beach Cafe | $25.00 | Dining Out | Credit Card |
    | | **Total** | **$325.00** | | |
    | | **Transaction Count** | **2** | | |

### Scenario 2: Excluding a Single Account

*   **Given**: The user has the same initial set of transactions as in Scenario 1.

*   **When**: The user wants to see all their spending **except** for what was paid from their Checking account. They apply the following filters:

    **User Filter Selection**
    | Filter Group | Selected Items |
    | :--- | :--- |
    | **Accounts** | `[x] Credit Card`, `[ ] Checking` |
    | **Categories** | `[x] Groceries`, `[x] Transport`, `[x] Travel`, `[x] Dining Out`, `[x] Housing` (All selected) |

*   **Then**: The report updates to show all transactions from the "Credit Card" account, regardless of category.

    **Resulting Report Data**
    | Date | Payee | Amount | Category | Account |
    | :--- | :--- | :--- | :--- | :--- |
    | 2023-10-02 | Gas Station | $40.00 | Transport | Credit Card |
    | 2023-10-03 | Airline Co. | $300.00 | Travel | Credit Card |
    | 2023-10-04 | Beach Cafe | $25.00 | Dining Out | Credit Card |
    | | **Total** | **$365.00** | | |
    | | **Transaction Count** | **3** | | |

## 7. Out of Scope

*   Saving filter configurations as named "presets" for later use.
*   Filtering by other transaction attributes like tags, payees, or notes.
*   Applying filters globally across different report types (e.g., filters on a "Spending" report will not affect an "Income vs. Expense" report).

## 8. Dependencies

*   **#67 (Hierarchical Accounts & Categories)**: The implementation of hierarchical selection (FR9) is dependent on the completion of this feature. If #67 is not implemented, the filter will display a flat list of items.
*   **#59 (Reports & Data Export)**: This feature is an enhancement to the core reporting functionality defined in #59. A base report view must exist to apply these filters to.