# SBE: Report Filtering by Categories and Accounts

> 📅 Created: 2026-02-05
> 🔗 Issue: https://github.com/oatrice/JarWise-Root/issues/68

---

## Feature: Report Filtering by Categories and Accounts

To provide users with granular control over their financial reports, this feature allows for the filtering of data by selecting multiple categories (Jars) and accounts (Wallets). The report updates in real-time to reflect the selections, and a visual indicator displays the number of active filters and matching transactions.

### Scenario: Happy Path - Filtering by multiple categories and accounts

**Given** the user is viewing the "Monthly Expenses" report for January 2026
**When** the user selects a combination of Jars and Wallets from the filter panel
**Then** the report data and transaction count update to display only transactions that belong to ANY of the selected Jars AND ANY of the selected Wallets

#### Examples

| Selected Jars                 | Selected Wallets          | Expected Transaction IDs | Expected Count | Filter Indicator Text |
|-------------------------------|---------------------------|--------------------------|----------------|-----------------------|
| `["Groceries"]`               | `["Main Checking"]`       | `[101, 108]`             | 2              | "2 filters active"    |
| `["Groceries", "Transport"]`  | `["Main Checking"]`       | `[101, 105, 108]`        | 3              | "3 filters active"    |
| `["Utilities"]`               | `["Credit Card", "PayPal"]` | `[210, 215, 221]`        | 3              | "3 filters active"    |
| `["Entertainment", "Health"]` | `["Credit Card"]`         | `[301, 305, 310]`        | 3              | "3 filters active"    |
| `["Shopping"]`                | `["Main Checking", "PayPal"]` | `[404, 409]`             | 2              | "3 filters active"    |

### Scenario: Edge Case - Filtering with hierarchical parent items

**Given** the user's Jars are structured hierarchically (e.g., "Food" contains "Groceries" and "Restaurants")
**When** the user selects a parent Jar or Wallet in the filter panel
**Then** the report includes all transactions from the selected parent item AND all of its child items

#### Examples

| Selected Item (Parent) | Expected Items in Filter                            | Expected Transaction IDs | Expected Count |
|------------------------|-----------------------------------------------------|--------------------------|----------------|
| `["Food"]`             | `["Food", "Groceries", "Restaurants"]`              | `[101, 108, 115, 119]`   | 4              |
| `["Bank of Example"]`  | `["Bank of Example", "Main Checking", "Savings"]`   | `[101, 105, 108, 501]`   | 4              |
| `["Utilities"]`        | `["Utilities", "Electricity", "Internet", "Water"]` | `[210, 211, 212]`        | 3              |
| `["Food", "Health"]`   | `["Food", "Groceries", "Restaurants", "Health"]`    | `[101, 108, 115, 119, 310]` | 5              |

### Scenario: Error Handling - No transactions match the filter criteria

**Given** the user is viewing the "Monthly Expenses" report
**When** the user selects a combination of Jars and Wallets for which no transactions exist, or clears all selections
**Then** the report area displays a message "No matching transactions found" and the transaction count is updated to 0

#### Examples

| Selected Jars       | Selected Wallets      | Expected Message                 | Expected Count |
|---------------------|-----------------------|----------------------------------|----------------|
| `["Entertainment"]` | `["Savings Account"]` | "No matching transactions found" | 0              |
| `["Gifts"]`         | `["Main Checking"]`   | "No matching transactions found" | 0              |
| `[]` (Cleared All)  | `["Credit Card"]`     | "No matching transactions found" | 0              |
| `["Groceries"]`     | `[]` (Cleared All)    | "No matching transactions found" | 0              |
| `["Investments"]`   | `["PayPal"]`          | "No matching transactions found" | 0              |