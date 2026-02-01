# SBE: Hierarchical Wallets Management

> 📅 Created: 2026-02-01
> 🔗 Issue: https://github.com/oatrice/JarWise-Root/issues/69

---

## Feature: Hierarchical Wallets Management

To better organize finances, users can structure their wallets in a parent-child hierarchy. This allows for grouping related accounts, such as having "Savings" and "Checking" as sub-wallets under a main "Bank Account", providing a clearer overview of financial allocations.

### Scenario: Happy Path - Creating a new sub-wallet

**Given** the user is on the 'Manage Wallets' screen and has existing wallets
**When** the user creates a new wallet and selects an existing wallet as its parent
**Then** the new wallet is created and correctly listed as a child of the selected parent wallet

#### Examples

| Parent Wallet Name | New Sub-Wallet Name | Expected Hierarchy Display |
|--------------------|---------------------|----------------------------|
| Bank Account       | Savings             | Bank Account > Savings     |
| Investments        | Stocks              | Investments > Stocks       |
| Vacation Fund      | Europe Trip 2027    | Vacation Fund > Europe Trip 2027 |
| Credit Cards       | Visa Card           | Credit Cards > Visa Card   |
| Living Expenses    | Groceries           | Living Expenses > Groceries|

### Scenario: Edge Case - Creating a multi-level hierarchy

**Given** a user has an existing parent-child wallet structure
**When** the user creates a new wallet and selects an existing sub-wallet as its parent
**Then** the new wallet is created successfully, forming a three-level (or deeper) hierarchy

#### Examples

| Grandparent Wallet | Parent Wallet (Sub-wallet of Grandparent) | New Sub-Wallet Name | Expected Hierarchy Display          |
|--------------------|-------------------------------------------|---------------------|-------------------------------------|
| Investments        | Stocks                                    | Tech Stocks         | Investments > Stocks > Tech Stocks  |
| Bank Account       | Savings                                   | Emergency Fund      | Bank Account > Savings > Emergency Fund |
| Living Expenses    | Utilities                                 | Electricity Bill    | Living Expenses > Utilities > Electricity Bill |

### Scenario: Error Handling - Attempting to delete a parent wallet

**Given** a parent wallet exists with one or more sub-wallets assigned to it
**When** the user attempts to delete the parent wallet
**Then** the system prevents the deletion and prompts the user to reassign the child wallets to a new parent or make them top-level wallets

#### Examples

| Parent to Delete | Child Wallets                    | Expected System Prompt/Action                                                 |
|------------------|----------------------------------|-------------------------------------------------------------------------------|
| Bank Account     | "Savings", "Checking"            | "Cannot delete 'Bank Account'. Reassign its 2 sub-wallets first."             |
| Investments      | "Stocks"                         | "Cannot delete 'Investments'. Reassign its 1 sub-wallet first."               |
| Living Expenses  | "Rent", "Groceries", "Utilities" | "Cannot delete 'Living Expenses'. Reassign its 3 sub-wallets first."          |
| Vacation Fund    | "Europe Trip 2027"               | "Cannot delete 'Vacation Fund'. Please reassign 'Europe Trip 2027' first."    |