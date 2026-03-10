# Specification

**Feature ID:** `FEAT-048`
**Title:** Expense Graph for Jar Categories and Sub-categories with Time Period Selection
**Platforms:** Android, Web
**Related Issue:** [#48](https://github.com/oatrice/JarWise-Root/issues/48)

---

## 1. User Story

**As a** user,
**I want to** view a graph of my expenses within a specific Jar Category or Sub-category,
**so that I can** visually analyze my spending patterns over different time periods (week, month, year) and make better financial decisions.

---

## 2. Acceptance Criteria

- **AC1: Graph Display:** A bar chart component MUST be displayed on the details screen for both Jar Categories and Jar Sub-categories.
- **AC2: Time Period Selection:** The user MUST be able to select the time period for the graph. The available options are "Weekly", "Monthly", and "Yearly".
- **AC3: Data Accuracy:** The graph MUST accurately represent the sum of all expenses for the selected Jar Category/Sub-category within each time interval (e.g., each bar for "Monthly" view represents the total spending for that month).
- **AC4: Axis Representation:**
    - The X-axis MUST represent the time intervals (e.g., Week 1, Week 2; Jan, Feb; 2023, 2024).
    - The Y-axis MUST represent the total expense amount.
- **AC5: Tooltips:** When a user hovers over (Web) or taps on (Android) a bar in the graph, a tooltip MUST appear showing the exact time period and the total amount spent.
- **AC6: No Data State:** If there are no transactions for the selected category/sub-category in the given time frame, the graph area MUST display a user-friendly message (e.g., "No spending data available for this period.").
- **AC7: Default View:** The default view for the graph SHOULD be "Monthly".
- **AC8: Cross-Platform Consistency:** The feature's core functionality and visual representation MUST be consistent across both Android and Web platforms.

---

## 3. User Journey

1.  The user opens the application and navigates to the "Jars" screen.
2.  The user taps on a specific Jar Category (e.g., "🍔 Food").
3.  The application navigates to the "Food" category details screen.
4.  Below the category details, the user sees a new section containing a bar chart visualizing their spending.
5.  By default, the graph shows monthly spending totals for the "Food" category.
6.  The user sees and interacts with a time period selector (e.g., tabs labeled "Weekly", "Monthly", "Yearly").
7.  The user taps on "Weekly".
8.  The graph updates instantly to show the total spending for each of the recent weeks. A tooltip on a bar shows "Week of Oct 23-29: ฿1,250.50".
9.  The user then taps on a Sub-category within "Food", such as "☕ Coffee".
10. The application navigates to the "Coffee" sub-category details screen, which also displays a similar graph, but now showing data only for "Coffee" expenses.

---

## 4. Specification by Example (SBE)

### Scenario 1: Viewing Monthly Expenses for "Food" Category

**Given** the user has the following transactions in the "🍔 Food" category:

| Date       | Sub-category | Amount (฿) |
| :--------- | :----------- | :--------- |
| 2023-09-05 | Groceries    | 1,200.00   |
| 2023-09-20 | Dining Out   | 850.50     |
| 2023-10-11 | Groceries    | 975.00     |
| 2023-10-25 | Dining Out   | 1,100.00   |
| 2023-10-28 | Coffee       | 120.00     |
| 2023-11-02 | Groceries    | 1,500.00   |

**When** the user navigates to the "🍔 Food" category details screen and selects the "Monthly" view.

**Then** the system should display a bar chart with the following aggregated data points:

| X-Axis (Month) | Y-Axis (Total Amount ฿) |
| :------------- | :---------------------- |
| September 2023 | 2,050.50                |
| October 2023   | 2,195.00                |
| November 2023  | 1,500.00                |

---

### Scenario 2: Viewing Weekly Expenses for "Groceries" Sub-category with a Zero-Spend Week

**Given** the user has the following transactions in the "Groceries" sub-category:

| Date       | Sub-category | Amount (฿) |
| :--------- | :----------- | :--------- |
| 2023-10-16 | Groceries    | 450.00     |
| 2023-10-18 | Groceries    | 300.00     |
| 2023-11-02 | Groceries    | 800.00     |
| 2023-11-04 | Groceries    | 700.00     |

*(Note: Assume the week of Oct 23 - Oct 29 has zero spending in this sub-category)*

**When** the user navigates to the "Groceries" sub-category details screen and selects the "Weekly" view.

**Then** the system should display a bar chart with the following aggregated data points, including a zero value for the week with no spending.

| X-Axis (Week Of) | Y-Axis (Total Amount ฿) |
| :--------------- | :---------------------- |
| Oct 16, 2023     | 750.00                  |
| Oct 23, 2023     | 0.00                    |
| Oct 30, 2023     | 1,500.00                |

---

## 5. Out of Scope

-   Custom date range selection for the graph.
-   Comparing data across different periods (e.g., This Month vs. Last Month).
-   Alternative graph types (e.g., pie charts, line charts).
-   Drilling down from a graph bar to a filtered list of transactions.

---

## 6. Error Handling & Edge Cases

-   **No Transactions in Category:** If a Jar Category or Sub-category has never been used, the graph area will display the message: "No spending data available for this category."
-   **Single Data Point:** If there is only one transaction or all transactions fall within a single time interval (e.g., one week), the graph will render a single bar correctly.
-   **Data Loading:** A loading indicator (e.g., a spinner or skeleton screen) must be displayed while the graph data is being fetched from the server.
-   **API Failure:** If the data fails to load, a user-friendly error message should be displayed with an option to retry (e.g., "Could not load chart data. Tap to retry.").