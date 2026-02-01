# Specification

| | |
| --- | --- |
| **Title** | [Web] Support Hierarchical Wallets (Sub-accounts) |
| **Version** | 1.0 |
| **Status** | **Draft** |
| **Author** | Expert Product Manager |
| **Date** | 2023-10-27 |
| **Issue** | [#69](https://github.com/oatrice/JarWise-Root/issues/69) |

---

## 1. Overview

This document specifies the requirements for implementing hierarchical wallets (sub-accounts) within the JarWise application. This feature will allow users to organize their financial accounts into a nested, tree-like structure. For example, a user could create a primary "Bank Account" wallet and then nest their "Savings" and "Checking" accounts underneath it. This enhancement provides greater organizational flexibility and a more intuitive way to manage related financial accounts.

This specification focuses on the core backend logic (`parentId`) and the initial Web UI implementation. The Android implementation is planned for a future phase.

## 2. Goal

The primary goal is to empower users with a more sophisticated way to organize their wallets. By grouping related accounts, users can better visualize their financial landscape, simplify navigation, and align the app's structure with their real-world financial arrangements.

- **For the User:** "I want to group my 'Savings' and 'Checking' accounts under my main 'Bank of America' wallet so I can see them organized together and reduce clutter in my main wallet list."
- **For the Business:** Increase user engagement and satisfaction by providing advanced organizational tools that cater to users with multiple accounts at single institutions.

## 3. Scope

### In Scope

-   **Wallet Hierarchy Management (Web UI):**
    -   Creating a new wallet as a child of an existing wallet.
    -   Editing an existing wallet to change its parent (including moving it to the top level).
    -   A visual representation of the hierarchy (e.g., indented list) on the "Manage Wallets" screen.
-   **Parent Deletion Logic:**
    -   Implementing a safe deletion process that requires users to reassign child wallets before a parent wallet can be deleted.
-   **Backend Logic:**
    -   Utilizing the existing `Allocation.parentId` field to store the hierarchical relationship.

### Out of Scope

-   **Android Implementation:** This specification is for the Web UI (Phase 1). Android will be addressed in a separate specification.
-   **Balance Roll-ups:** The balance of a parent wallet will **not** automatically display the sum of its children's balances in this phase. Each wallet's balance remains independent.
-   **Transaction Roll-ups:** Viewing a parent wallet will **not** display a combined list of its children's transactions.
-   **Complex Permissions:** No special permissions or access controls for sub-wallets will be implemented.
-   **Unlimited Nesting Depth:** While technically possible, the UI will be optimized for 2-3 levels of nesting. Deeper hierarchies are not a primary design goal for this phase.

### Future Work
-   **Phase 2:** Android Implementation.
-   **Phase 3:** Backend Integration & Safe Deletion Logic. See [Issue #70](https://github.com/oatrice/JarWise-Root/issues/70).

## 4. User Journey

1.  **Navigation:** The user navigates to the "Settings" -> "Manage Wallets" page.
2.  **Observation:** The user sees their existing wallets in a flat list. They decide to group their "Chase Checking" and "Chase Savings" accounts.
3.  **Creation/Editing:** The user clicks "Edit" on the "Chase Savings" wallet.
4.  **Parent Assignment:** Inside the "Edit Wallet" modal, they see a new dropdown field labeled "Parent Wallet". They select "Chase Checking" from the list.
5.  **Confirmation:** The user saves the changes.
6.  **Verification:** The user is returned to the "Manage Wallets" list. They now see "Chase Savings" indented underneath "Chase Checking", clearly indicating the parent-child relationship.

## 5. Functional Requirements

### FR1: Create and Edit a Sub-Wallet

As a user managing my wallets, I want to assign a parent to a wallet so that I can organize my accounts hierarchically.

-   **FR1.1:** The "Add Wallet" and "Edit Wallet" modals MUST include a dropdown field labeled "Parent Wallet".
-   **FR1.2:** This dropdown MUST list all other existing wallets, allowing the user to select one as the parent.
-   **FR1.3:** The dropdown MUST include a default option such as "None" or "– No Parent –" to designate the wallet as a top-level account.
-   **FR1.4:** A wallet cannot be assigned as its own parent. The system MUST prevent this.
-   **FR1.5:** A wallet cannot be assigned to one of its own descendants (to prevent circular dependencies).

### FR2: View Wallet Hierarchy

As a user, I want to see my wallets displayed in a clear hierarchy so I can easily understand their relationships.

-   **FR2.1:** On the "Manage Wallets" screen, wallets with a parent MUST be visually indented under their parent wallet.
-   **FR2.2:** A visual cue, such as a line or icon (e.g., `↳`), SHOULD be used to reinforce the child relationship.
-   **FR2.3 (Optional):** Parent wallets with children could have a toggle (e.g., `▼`/`►`) to collapse/expand their list of sub-wallets.

### FR3: Delete a Parent Wallet

As a user, I want to be protected from accidentally orphaning sub-wallets when I delete a parent wallet.

-   **FR3.1:** When a user attempts to delete a wallet that has one or more sub-wallets, the system MUST prevent immediate deletion.
-   **FR3.2:** A confirmation modal MUST be displayed, informing the user that the wallet has sub-wallets.
-   **FR3.3:** The modal MUST require the user to choose a new parent for the orphaned sub-wallets. The options should include:
    -   Making them top-level wallets ("No Parent").
    -   Assigning them to another existing wallet.
-   **FR3.4:** The deletion can only proceed after the user has confirmed the reassignment plan for all child wallets.
-   **FR3.5:** Deleting a wallet with no children should follow the existing deletion process.

## 6. Specification by Example (SBE)

### Scenario 1: Creating a New Hierarchy

**Context:** A user wants to organize their bank accounts. They have two top-level wallets: "Bank of America" and "My Cash". They want to add their "Checking" and "Savings" accounts under "Bank of America".

**Initial State (Wallets Table):**

| `id` | `name` | `parentId` |
| :--- | :--- | :--- |
| 101 | Bank of America | `null` |
| 102 | My Cash | `null` |

**User Actions:**

1.  User clicks "Add New Wallet".
2.  Enters `name`: "Checking".
3.  Selects `Parent Wallet`: "Bank of America" (ID: 101).
4.  Saves the new wallet.
5.  User clicks "Add New Wallet" again.
6.  Enters `name`: "Savings".
7.  Selects `Parent Wallet`: "Bank of America" (ID: 101).
8.  Saves the new wallet.

**Final State (Wallets Table):**

| `id` | `name` | `parentId` |
| :--- | :--- | :--- |
| 101 | Bank of America | `null` |
| 102 | My Cash | `null` |
| 103 | Checking | `101` |
| 104 | Savings | `101` |

**Expected UI Display:**

```
- Bank of America
  ↳ Checking
  ↳ Savings
- My Cash
```

---

### Scenario 2: Deleting a Parent Wallet with Reassignment

**Context:** A user is closing their "Credit Cards" account group and wants to delete the parent wallet, but keep the individual card accounts for historical records.

**Initial State (Wallets Table):**

| `id` | `name` | `parentId` |
| :--- | :--- | :--- |
| 201 | Investments | `null` |
| 202 | Credit Cards | `null` |
| 203 | Visa Card | `202` |
| 204 | Amex Card | `202` |

**User Actions:**

1.  User navigates to "Manage Wallets" and clicks the "Delete" icon for the "Credit Cards" wallet (ID: 202).
2.  A modal appears with the message:
    > **Cannot Delete Parent Wallet**
    >
    > "Credit Cards" has 2 sub-wallets. Please reassign them before deleting.
    >
    > Reassign "Visa Card" and "Amex Card" to:
    > `[Dropdown: "– No Parent –"]`
    >
    > `[Cancel] [Delete Wallet]`
3.  The user keeps the default selection "– No Parent –" and clicks "Delete Wallet".

**Final State (Wallets Table):**

| `id` | `name` | `parentId` |
| :--- | :--- | :--- |
| 201 | Investments | `null` |
| 203 | Visa Card | `null` |
| 204 | Amex Card | `null` |

**Expected UI Display:**

```
- Investments
- Visa Card
- Amex Card
```

### Scenario 3: Creating a Multi-level Hierarchy (Edge Case)

**Context:** A user wants to create a deeper nesting structure, "Investments > Stocks > Tech Stocks".

**Initial State (Wallets Table):**

| `id` | `name` | `parentId` |
| :--- | :--- | :--- |
| 301 | Investments | `null` |
| 302 | Stocks | `301` |

**User Actions:**

1.  User clicks "Add New Wallet".
2.  Enters `name`: "Tech Stocks".
3.  Selects `Parent Wallet`: "Stocks" (ID: 302).
4.  Saves the new wallet.

**Final State (Wallets Table):**

| `id` | `name` | `parentId` |
| :--- | :--- | :--- |
| 301 | Investments | `null` |
| 302 | Stocks | `301` |
| 303 | Tech Stocks | `302` |

**Expected UI Display:**

```
- Investments
  ↳ Stocks
    ↳ Tech Stocks
```

## 7. Open Questions

1.  **Maximum Hierarchy Depth:** Is there a technical or UI limit to how many levels deep the nesting can go? (Recommendation: For UI sanity, visually support 3-4 levels well, but don't enforce a hard backend limit initially).
2.  **Drag-and-Drop:** The issue mentions drag-and-drop as a possibility. Is this a requirement for Phase 1, or is parent selection via the edit modal sufficient? (Recommendation: Defer drag-and-drop to a future iteration to simplify the initial implementation).
3.  **Orphan Reassignment Granularity:** In the deletion scenario (FR3), do we need to allow reassigning children to *different* new parents, or is reassigning all of them to the *same* new parent sufficient for V1? (Recommendation: A single new parent for all orphans is sufficient for V1).