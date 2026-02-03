```markdown
# Specification: Money Manager Data Migration

| | |
| --- | --- |
| **Feature ID** | `MIG-01` |
| **Title** | Migrate Data from Money Manager App (.mmbak) |
| **Issue URL** | [#65](https://github.com/oatrice/JarWise-Root/issues/65) |
| **Related** | [#20](https://github.com/oatrice/JarWise-Root/issues/20) (Data Migration Epic) |
| **Author** | Expert Product Manager |
| **Status** | **Draft** |

---

## 1. Goal

To provide a seamless transition for users migrating from the "Money Manager" application to JarWise. By automating the import of their complete financial history, we eliminate the significant pain point of manual data entry, lower the barrier to adoption, and allow users to retain their valuable historical data for analysis within JarWise from day one.

## 2. User Stories

- **As a new JarWise user**, I want to import my entire transaction history from the Money Manager app, so that I can switch to JarWise without losing years of financial data.
- **As a user migrating my data**, I want the system to validate the import against a human-readable report (`.xls`), so that I can be confident that all my data was transferred accurately and completely.

## 3. User Journey

1.  The user navigates to the `Settings > Data Migration` section within the JarWise application.
2.  They select the "Import from Money Manager" option.
3.  The system presents an interface with two distinct upload fields:
    -   "Upload Database Backup (.mmbak)"
    -   "Upload Exported Report (.xls)"
4.  The user selects and uploads both the `.mmbak` file (as the primary data source) and the `.xls` file (as the validation source).
5.  The system begins processing the files in the background. A loading indicator is displayed.
6.  The system first parses the `.mmbak` (SQLite) file to extract accounts, categories, and transactions.
7.  It then parses the `.xls` (HTML) file to extract the summary totals for Income and Expense.
8.  **Cross-Validation Step**: The system compares the calculated totals from the `.mmbak` file with the summary totals from the `.xls` file.
9.  **Scenario A (Happy Path - Validation Succeeds)**:
    -   The system displays a "Validation Successful" message and a preview summary.
    -   *Example Preview:* "Ready to Import: 3 Wallets, 25 Jars, and 1,254 Transactions. Click 'Confirm Import' to proceed."
    -   The user clicks "Confirm Import".
    -   The system performs the data mapping and saves the new Wallets, Jars, and Transactions to the JarWise database.
    -   A final success message is shown: "Import complete! Your Money Manager data is now available in JarWise."
10. **Scenario B (Unhappy Path - Validation Fails)**:
    -   The system displays a specific error message.
    -   *Example Error:* "Validation Failed: The totals do not match. Please ensure both files were exported at the same time.
        -   Database Totals: Income $5,120.50 / Expense $3,450.00
        -   Report Totals: Income $5,000.00 / Expense $3,200.00"
    -   The import process is halted, and no data is saved. The user is prompted to upload a matching set of files.

## 4. Functional Requirements

| ID | Requirement | Details |
| --- | --- | --- |
| **FR1** | **Dual File Upload** | The system MUST provide an interface that requires the user to upload both a `.mmbak` file and an `.xls` file to proceed. |
| **FR2** | **`.mmbak` Parser** | The system MUST be able to read the SQLite database within the `.mmbak` file and extract data from the relevant tables (e.g., accounts, categories, transactions). |
| **FR3** | **`.xls` Parser** | The system MUST be able to parse the HTML content of the `.xls` file to find and extract the summary values for "Total Income" and "Total Expense". |
| **FR4** | **Cross-Validation** | Before any data is written, the system MUST calculate the sum of all income and expense transactions from the `.mmbak` data and compare them against the totals extracted from the `.xls` file. The import can only proceed if these values match exactly. |
| **FR5** | **Schema Mapping** | The system MUST map the data from Money Manager to the JarWise schema as follows: <br> - `Money Manager Account` -> `JarWise Wallet` (including name and initial balance). <br> - `Money Manager Category` -> `JarWise Jar` (including name and type: Income/Expense). <br> - `Money Manager Transaction` -> `JarWise Transaction` (linking to the correct Wallet and Jar, preserving amount, date, and note). |
| **FR6** | **Import Preview** | After successful validation, the system MUST display a summary of the data to be imported (count of wallets, jars, and transactions) and require explicit user confirmation before writing to the database. |
| **FR7** | **Transactional Import** | The entire import process (creating wallets, jars, and transactions) MUST be executed as a single database transaction. If any part of the import fails, the entire operation must be rolled back, leaving the user's JarWise data in its original state. |
| **FR8** | **Error Handling** | The system MUST provide clear, user-friendly error messages for common failure scenarios, including: invalid file formats, corrupted files, and validation mismatches. |

## 5. Non-Functional Requirements

| ID | Requirement | Details |
| --- | --- | --- |
| **NFR1** | **Performance** | For a typical dataset (e.g., 5,000 transactions), the entire process from file upload to validation and preview should take less than 30 seconds. |
| **NFR2** | **Accuracy** | The financial data (amounts, dates) imported into JarWise must be 100% identical to the data in the primary source (`.mmbak` file). |
| **NFR3** | **Usability** | The import wizard must be simple and intuitive, with clear instructions at each step. |

## 6. Specification by Example (SBE)

### Scenario 1: Successful Import with Matching Files

**Given** the user provides the following two files:

1.  `my_data.mmbak` containing the following simplified data:

    **`account` table**
    | id | title | initial_balance |
    |----|---------|-----------------|
    | 1 | Checking | 1000.00 |
    | 2 | Savings | 5000.00 |

    **`category` table**
    | id | title | type |
    |----|---------|------|
    | 10 | Salary | 1 |
    | 20 | Groceries| 0 |
    | 21 | Rent | 0 |

    **`trans` table**
    | id | account_id | category_id | amount | note | date |
    |----|------------|-------------|--------|----------------|------------|
    | 101| 1 | 10 | 2500.00| Paycheck | 2023-10-01 |
    | 102| 1 | 20 | -75.50 | Weekly shop | 2023-10-02 |
    | 103| 1 | 21 | -1200.00| Monthly Rent | 2023-10-05 |

2.  `my_report.xls` containing the following summary:

    | Category | Amount |
    |---|---|
    | **Total Income** | **$2,500.00** |
    | **Total Expense**| **$1,275.50** |

**When** the user uploads both files and clicks "Start Import".

**Then** the system performs the cross-validation:
-   Calculated Income from `.mmbak`: `2500.00`
-   Calculated Expense from `.mmbak`: `75.50 + 1200.00 = 1275.50`
-   The values match the `.xls` report.

**And** the system presents a preview: "Ready to Import: 2 Wallets, 3 Jars, and 3 Transactions."

**And** upon user confirmation, the following data is created in the JarWise database:

**`wallets` table**
| id | name | initial_balance |
|----|----------|-----------------|
| 1 | Checking | 1000.00 |
| 2 | Savings | 5000.00 |

**`jars` table**
| id | name | type |
|----|-----------|---------|
| 1 | Salary | INCOME |
| 2 | Groceries | EXPENSE |
| 3 | Rent | EXPENSE |

**`transactions` table**
| id | wallet_id | jar_id | amount | description | date |
|----|-----------|--------|---------|----------------|------------|
| 1 | 1 | 1 | 2500.00 | Paycheck | 2023-10-01 |
| 2 | 1 | 2 | -75.50 | Weekly shop | 2023-10-02 |
| 3 | 1 | 3 | -1200.00| Monthly Rent | 2023-10-05 |

---

### Scenario 2: Validation Fails Due to Mismatched Files

**Given** the user provides two files from different time periods:

1.  `my_data_october.mmbak` with the same data as Scenario 1.
    -   Calculated Income: `$2,500.00`
    -   Calculated Expense: `$1,275.50`

2.  `my_report_september.xls` which is an older report with different totals:

    | Category | Amount |
    |---|---|
    | **Total Income** | **$2,500.00** |
    | **Total Expense**| **$1,150.00** |

**When** the user uploads both files and clicks "Start Import".

**Then** the system performs the cross-validation and detects a mismatch.

**And** the system displays the following error message and halts the import:

> **Validation Failed: The totals do not match.**
>
> Please ensure both the database backup (.mmbak) and the exported report (.xls) were generated at the same time.
>
> - **Database Totals:**
>   - Income: `$2,500.00`
>   - Expense: `$1,275.50`
> - **Report Totals:**
>   - Income: `$2,500.00`
>   - Expense: `$1,150.00`

**And** no data is written to the JarWise database.

## 7. Out of Scope

-   Importing from any other format (e.g., CSV, QIF, OFX).
-   Importing other Money Manager data types like Assets, Liabilities, Budgets, or recurring transactions. The focus is solely on Accounts, Categories, and historical Transactions.
-   Handling encrypted or password-protected `.mmbak` files.
-   An "Undo" feature after a successful import. The import is a one-time operation.
-   Real-time synchronization with the Money Manager app.
```