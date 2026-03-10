# SBE: View Spending Graph by Jar Category

> 📅 Created: 2026-02-12
> 🔗 Issue: https://github.com/oatrice/JarWise-Root/issues/48

---

## Feature: View Spending Graph by Jar Category

To help users understand their spending habits, the system will provide a graphical representation of expenses for each Jar Category and Sub-category. Users can dynamically switch the view to see spending aggregated by week, month, or year.

### Scenario: Happy Path - User views spending graph for a category with transactions

**Given** the user has recorded several transactions in a specific Jar Category
**When** the user navigates to that category's detail page and selects a time period view
**Then** the system displays a graph correctly aggregating the total spending for that period

#### Examples

| Jar Category | Selected View | Transactions (Date, Amount in THB) | Expected Graph Data (Period, Total) |
|--------------|---------------|------------------------------------|-------------------------------------|
| Food         | Monthly       | `[{"2026-01-10", 150}, {"2026-01-25", 300}, {"2026-02-05", 250}]` | `[{"Jan 2026", 450}, {"Feb 2026", 250}]` |
| Transport    | Yearly        | `[{"2025-11-20", 1200}, {"2026-01-15", 950}, {"2026-03-01", 1100}]` | `[{"2025", 1200}, {"2026", 2050}]` |
| Shopping     | Weekly        | `[{"2026-02-02", 500}, {"2026-02-04", 750}, {"2026-02-10", 1200}]` | `[{"Feb 2-8", 1250}, {"Feb 9-15", 1200}]` |
| Utilities    | Monthly       | `[{"2026-01-28", 2100}, {"2026-02-27", 2150}, {"2026-03-28", 2050}]` | `[{"Jan 2026", 2100}, {"Feb 2026", 2150}, {"Mar 2026", 2050}]` |

### Scenario: Edge Case - User views graph for a category with no spending data

**Given** the user is viewing a Jar Category
**When** the user selects a time period for which there are no transactions in that category
**Then** the system displays a clear message indicating no data is available instead of an empty graph

#### Examples

| Jar Category | Selected View | Transactions (Date, Amount in THB) | Expected Outcome |
|--------------|---------------|------------------------------------|----------------------------------------------------|
| Gifts        | This Year     | `[]`                               | Display message: "No spending data for this period" |
| Vacation     | This Month    | `[{"2026-01-15", 15000}]`           | Display message: "No spending data for this period" |
| Electronics  | This Week     | `[{"2026-02-01", 3000}]`           | Display message: "No spending data for this period" |
| Hobbies      | All Time      | `[]`                               | Display message: "No spending data for this category" |

### Scenario: Error Handling - User switches between different time period views

**Given** the user is viewing a spending graph for a Jar Category in a specific time period view (e.g., "Monthly")
**When** the user selects a different time period view (e.g., "Weekly")
**Then** the graph immediately refreshes and displays the spending data aggregated by the newly selected period

#### Examples

| Jar Category | Initial View | Action: Select New View | Transactions (Date, Amount in THB) | Expected New Graph Data (Period, Total) |
|--------------|--------------|-------------------------|------------------------------------|-----------------------------------------|
| Entertainment| Monthly      | Weekly                  | `[{"2026-03-02", 350}, {"2026-03-10", 500}, {"2026-03-11", 150}]` | `[{"Mar 2-8", 350}, {"Mar 9-15", 650}]` |
| Transport    | Yearly       | Monthly                 | `[{"2026-01-20", 800}, {"2026-02-15", 900}, {"2026-02-25", 150}]` | `[{"Jan 2026", 800}, {"Feb 2026", 1050}]` |
| Groceries    | Weekly       | Yearly                  | `[{"2025-12-28", 700}, {"2026-01-05", 900}]` | `[{"2025", 700}, {"2026", 900}]` |