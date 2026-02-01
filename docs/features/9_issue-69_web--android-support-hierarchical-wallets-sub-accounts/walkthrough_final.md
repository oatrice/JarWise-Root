# Validation Walkthrough: Hierarchical Wallets (Web Mock)

**Goal:** Verify the implementation of hierarchical wallets, ensuring correct visualization, data integrity, and constraint enforcement (Max Depth & Circular Dependencies).

## ✅ Prerequisites
1.  Ensure the web dev server is running (`npm run dev`).
2.  Open the app in your browser (usually `http://localhost:5173`).
3.  Navigate to the **Manage Wallets** screen (click "My Wallets" on the dashboard, then "Manage" if available, or access the route directly).

## 🧪 Test Scenarios

### 1. Visual Hierarchy & Rendering
*   **Action:** Observe the wallet list.
*   **Expected Result:**
    *   Top-level wallets (e.g., "Bank Account", "Cash Wallet") are aligned to the left.
    *   Child wallets (e.g., "K-Bank Savings") are **indented** below their parents.
    *   Connecting lines (tree view guides) are visible.

### 2. Create a Sub-Wallet (Happy Path)
*   **Action:**
    1.  Click **"Add Wallet"**.
    2.  Enter Name: `Emergency Fund`.
    3.  Parent Wallet: Select `Bank Account` (or any Level 0 wallet).
    4.  Click **"Create Wallet"**.
*   **Expected Result:**
    *   The modal closes.
    *   `Emergency Fund` appears in the list, **indented** directly under `Bank Account`.

### 3. Max Depth Constraint (3 Levels Limit)
*   **Setup:** Ensure you have a structure: `Root (L0) > Child (L1)`. (e.g., `Bank Account > Emergency Fund`).
*   **Action A (Create Grandchild - Allowed):**
    1.  Create `Grandchild` and set Parent to `Emergency Fund`.
    2.  **Result:** Success (Level 2).
*   **Action B (Create Great-Grandchild - Blocked):**
    1.  Try to create `Great Grandchild`.
    2.  Try to select `Grandchild` as Parent.
*   **Expected Result:**
    *   The system should **Alert**: "Cannot add child to this wallet (Max depth reached)".
    *   The action is blocked.

### 4. Circular Dependency Prevention
*   **Action:**
    1.  Click on `Bank Account` (Level 0) to edit it.
    2.  In the **Parent Wallet** dropdown, try to select one of its children (e.g., `K-Bank Savings`).
*   **Expected Result:**
    *   The system should **Alert**: "Cannot set a descendant as parent (Circular Dependency)".
    *   The selection reverts or is ignored.

### 5. Recursive Move (Moving a Branch)
*   **Action:**
    1.  Create a new root wallet named `New Root`.
    2.  Select `Bank Account` (which has children).
    3.  Change its Parent to `New Root`.
*   **Expected Result:**
    *   `Bank Account` moves under `New Root`.
    *   **Crucially:** All children of `Bank Account` (e.g., `K-Bank Savings`) must move *with* it, maintaining their relative position under `Bank Account`.

### 6. Safe Deletion Guard
*   **Action:** Try to delete `Bank Account` (which has children).
*   **Expected Result:**
    *   The system should **Alert**: "Cannot delete a wallet that has sub-accounts...".
    *   Deletion is blocked.

## Validation Walkthrough: Android Database Integration (Local Persistence)
**Goal**: Verify that the Android app successfully compiles and runs with Room Database integration, ensuring Wallets are persisted locally.

### 1. Build Verification
*   **Action**: Build the project using Gradle (`./gradlew :app:assembleDebug`).
*   **Expected Result**:
    *   Build completes successfully (`BUILD SUCCESSFUL`).
    *   Room Schema is generated/validated.
    *   Database Migration (Ver 4 -> 5) code is compiled without errors.

### 2. Runtime Behavior (Manual Test Recommended)
*   **Action**: Launch the app on an Emulator or Device.
*   **Test**:
    1.  Create a new Wallet (e.g., "Persistence Test").
    2.  Restart the App.
    3.  Verify "Persistence Test" wallet still exists (loaded from DB).

### 3. User Feedback Verification
*   **Default Wallets Check:**
    1.  Clear App Data or Uninstall/Reinstall.
    2.  Launch App.
    3.  Verify that 3 default wallets (Cash, Bank Account, Credit Card) appear automatically.
*   **Safe Delete Check:**
    1.  Click "Delete" icon on any wallet.
    2.  **Verify:** A confirmation dialog appears ("Are you sure...?").
    3.  Click "Cancel" -> Wallet remains.
    4.  Click "Delete" -> Wallet is removed.

