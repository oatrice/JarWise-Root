# Implementation Plan

| | |
| --- | --- |
| **Title** | [Web] Support Hierarchical Wallets (Sub-accounts) |
| **Version** | 1.0 |
| **Status** | **Ready for Implementation** |
| **Author** | Senior Software Architect |
| **Date** | 2023-10-27 |
| **Spec** | [#69](https://github.com/oatrice/JarWise-Root/issues/69) |

---

## 1. Overview

This document outlines the technical implementation plan for introducing hierarchical wallets (sub-accounts) to the JarWise web application. The plan covers backend API modifications to support parent-child relationships and the necessary frontend changes to manage and display these relationships.

The core of this implementation involves:
1.  Utilizing the existing `Allocation.parentId` field in the database.
2.  Updating the Wallet creation/editing forms to allow parent assignment.
3.  Implementing robust validation to prevent invalid states (e.g., circular dependencies).
4.  Reworking the "Manage Wallets" view to display the hierarchy visually.
5.  Creating a safe deletion flow for parent wallets that ensures child wallets are not orphaned.

This plan adheres to the principle of a phased rollout, focusing on core functionality first and deferring non-essential features like balance roll-ups and drag-and-drop functionality.

## 2. Prerequisites

-   Existing backend infrastructure for CRUD operations on wallets (`Allocations`).
-   Existing frontend components for listing wallets and a modal form for adding/editing them.
-   Familiarity with the application's state management library (e.g., Redux, Zustand, React Query).

## 3. Architectural Changes

### 3.1. Backend

-   **Validation Logic:** New validation logic will be introduced in the `WalletService` layer to prevent invalid hierarchical structures. This includes checks to prevent a wallet from being its own parent and, more critically, to prevent circular dependencies (e.g., A -> B -> C -> A).
-   **API Endpoint Modification:** The `DELETE /api/wallets/:id` endpoint will be modified to conditionally require a payload for reassigning child wallets. This ensures the deletion of a parent wallet is an atomic operation that includes the reassignment of its children. All database operations within this endpoint (update children, delete parent) must be wrapped in a transaction.

### 3.2. Frontend

-   **State Transformation:** The application will fetch the list of wallets as a flat array from the API. A client-side utility function will be created to transform this flat list into a nested tree structure. This tree will be the source of truth for rendering the hierarchical list, simplifying the rendering logic.
-   **Component Structure:**
    -   The existing `WalletList` component will be refactored to recursively render the wallet tree. A new `WalletTreeItem` component will be introduced to handle the rendering of a single wallet and its children, managing indentation based on its depth in the tree.
    -   A new modal, `ReassignChildrenModal`, will be created to handle the specific UI flow for deleting a parent wallet.

## 4. Data Model

No changes are required to the database schema. The implementation will leverage the existing `Allocation` (aliased as `Wallet` for clarity) table structure.

**`Allocations` Table:**

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` / `INT` | Primary Key |
| `name` | `VARCHAR` | The name of the wallet. |
| `parentId` | `UUID` / `INT` | Foreign key to `Allocations.id`. `NULL` for top-level wallets. |
| `...` | `...` | Other existing wallet fields. |

---

## 5. Step-by-Step Implementation

### Step 1: Backend - Enhance Wallet Create/Update Logic

**Task:** Modify the `POST /api/wallets` and `PUT /api/wallets/:id` endpoints to accept and validate the `parentId`.

-   **Sub-task 1.1:** Update the controller and service layers to handle the `parentId` field in the request body.
-   **Sub-task 1.2:** Implement validation logic in the `WalletService`.
    -   A wallet's `id` cannot be set as its own `parentId`.
    -   **Circular Dependency Check:** Before saving, if a `parentId` is provided, traverse up the hierarchy from the proposed parent. If the current wallet's `id` is found in its own ancestry, throw a validation error.
-   **Files to Modify:**
    -   `src/server/controllers/WalletController.ts`
    -   `src/server/services/WalletService.ts`
    -   `src/server/validators/WalletValidator.ts`
-   **Verification:**
    -   Write unit tests for the `WalletService` to specifically cover the circular dependency check.
    -   Use an API client (e.g., Postman) to test the endpoints:
        -   Successfully create a child wallet.
        -   Successfully move a wallet to a new parent.
        -   Successfully move a wallet to the root (parentId: null).
        -   Verify that attempting to set a wallet as its own parent returns a `400 Bad Request`.
        -   Verify that attempting to create a circular dependency (e.g., making a grandparent a child of its own grandchild) returns a `400 Bad Request`.

### Step 2: Frontend - Update Wallet Form

**Task:** Add a "Parent Wallet" dropdown to the "Add/Edit Wallet" modal.

-   **Sub-task 2.1:** In the `WalletForm` component, add a new `Select` input for "Parent Wallet".
-   **Sub-task 2.2:** Populate the dropdown with the list of all available wallets, fetched via the existing wallet data hook.
-   **Sub-task 2.3:** Add a default/first option to the dropdown labeled "– No Parent –", which corresponds to a `null` value for `parentId`.
-   **Sub-task 2.4:** Filter the list of potential parents to exclude the wallet currently being edited and all of its descendants. This provides a better user experience and an initial layer of client-side validation.
-   **Files to Modify:**
    -   `src/client/components/modals/WalletForm.tsx`
    -   `src/client/hooks/useWallets.ts` (or equivalent data fetching logic)
-   **Verification:**
    -   Open the "Add Wallet" modal. The dropdown should list all wallets and the "No Parent" option.
    -   Open the "Edit Wallet" modal for a top-level wallet. The dropdown should list all other wallets. The wallet itself should not be in the list.
    -   Open the "Edit Wallet" modal for a parent wallet. The dropdown should not contain the wallet itself or any of its children.
    -   Save a wallet with a new parent and verify the API call includes the correct `parentId`.

### Step 3: Frontend - Display Wallet Hierarchy

**Task:** Render the wallets in a nested, indented list on the "Manage Wallets" page.

-   **Sub-task 3.1:** Create a utility function `buildWalletTree(wallets: Wallet[]): WalletTreeNode[]`. This function will take the flat array of wallets from the API and convert it into a tree structure (e.g., objects with a `children` array).
-   **Sub-task 3.2:** Create a new recursive component, `WalletTreeItem.tsx`. This component will render a single wallet's details and then recursively call itself to render its `children`, passing an incremented `depth` prop to control indentation.
-   **Sub-task 3.3:** Update the `ManageWalletsPage.tsx` or `WalletList.tsx` component to use the `buildWalletTree` utility and render the list using the new `WalletTreeItem` component.
-   **Sub-task 3.4:** Apply CSS for indentation (e.g., `padding-left: ${depth * 20}px;`) and add a visual cue like `↳` for child items.
-   **Files to Create/Modify:**
    -   `src/client/utils/walletUtils.ts` (new)
    -   `src/client/components/wallets/WalletTreeItem.tsx` (new)
    -   `src/client/pages/ManageWalletsPage.tsx` (or `WalletList.tsx`)
-   **Verification:**
    -   Navigate to the "Manage Wallets" page.
    -   Verify that wallets with a `parentId` are rendered indented beneath their parent.
    -   Verify the visual cue is present.
    -   Test with multiple levels of nesting (e.g., 3 levels deep) to ensure rendering is correct.

### Step 4: Backend - Implement Safe Parent Deletion

**Task:** Modify the `DELETE /api/wallets/:id` endpoint to handle the reassignment of children.

-   **Sub-task 4.1:** In the `WalletService`, before deleting a wallet, check if it has any children (i.e., wallets where `parentId` matches the ID being deleted).
-   **Sub-task 4.2:** If there are no children, proceed with the deletion as normal.
-   **Sub-task 4.3:** If there are children, check the request body for a `reassignChildrenTo` property. If it's missing, throw a `400 Bad Request` error with a message like "Cannot delete a wallet with children without a reassignment plan."
-   **Sub-task 4.4:** If `reassignChildrenTo` is present, wrap the following operations in a single database transaction:
    1.  Update all child wallets, setting their `parentId` to the value of `reassignChildrenTo` (`null` if they are to become top-level).
    2.  Delete the original parent wallet.
-   **Files to Modify:**
    -   `src/server/controllers/WalletController.ts`
    -   `src/server/services/WalletService.ts`
-   **Verification:**
    -   Using an API client, attempt to `DELETE` a parent wallet without a request body. Verify it fails with a `400` error.
    -   `DELETE` a parent wallet with `{ "reassignChildrenTo": null }` in the body. Verify the parent is deleted and its children now have `parentId = null`.
    -   `DELETE` a parent wallet with `{ "reassignChildrenTo": "some_other_wallet_id" }`. Verify the parent is deleted and its children are now parented to the new wallet.
    -   Verify that deleting a wallet with no children works as before.

### Step 5: Frontend - Implement Parent Deletion UI Flow

**Task:** Create the modal and client-side logic for safely deleting a parent wallet.

-   **Sub-task 5.1:** Create a new modal component `ReassignChildrenModal.tsx`. This modal will display a warning message and a dropdown list of wallets to select as the new parent, including the "– No Parent –" option.
-   **Sub-task 5.2:** In `ManageWalletsPage.tsx`, modify the `handleDelete` function. Before calling the delete API, check if the selected wallet has children (using the client-side tree structure).
-   **Sub-task 5.3:** If it has children, open the `ReassignChildrenModal`. If not, proceed with the standard delete confirmation.
-   **Sub-task 5.4:** When the user confirms the deletion in the `ReassignChildrenModal`, call the `DELETE /api/wallets/:id` endpoint, passing the selected new parent ID in the request body as `reassignChildrenTo`.
-   **Sub-task 5.5:** After a successful API call, refetch the wallet list to update the UI.
-   **Files to Create/Modify:**
    -   `src/client/components/modals/ReassignChildrenModal.tsx` (new)
    -   `src/client/pages/ManageWalletsPage.tsx`
    -   `src/client/api/walletApi.ts` (or equivalent)
-   **Verification:**
    -   Click the delete button on a wallet with no children. The standard confirmation should appear and deletion should work.
    -   Click the delete button on a parent wallet. The new `ReassignChildrenModal` must appear.
    -   Cancel the modal; no action should be taken.
    -   Select "– No Parent –" and confirm. Verify the parent is gone and the children are now top-level wallets in the UI.
    -   Select another wallet as the new parent and confirm. Verify the parent is gone and the children are now nested under the newly selected parent.

## 6. Risks and Mitigation

-   **Risk:** The circular dependency check logic on the backend could be complex and resource-intensive if hierarchies are very deep.
    -   **Mitigation:** The check involves a simple loop/recursive query that is unlikely to cause performance issues with the expected nesting depth of 3-4 levels. The database query should be optimized.
-   **Risk:** Transforming the wallet list into a tree on the client-side on every render could be inefficient for users with a very large number of wallets.
    -   **Mitigation:** Use memoization (e.g., `React.useMemo`) to ensure the tree transformation function only runs when the raw wallet list changes.
-   **Risk:** The user experience for managing deeply nested hierarchies might be poor.
    -   **Mitigation:** The current design (indentation) is optimized for 2-3 levels as per the specification. This is acceptable for V1. Future iterations could add features like collapsible sections if required.

## 7. Rollout Plan

-   This feature can be developed behind a feature flag.
-   **Phase 1 (Internal QA):** Deploy to a staging environment with the feature flag enabled for the QA team and internal stakeholders.
-   **Phase 2 (Full Release):** Once verified, enable the feature flag for all users. No database migration is needed, so the rollout is low-risk from a data integrity perspective.