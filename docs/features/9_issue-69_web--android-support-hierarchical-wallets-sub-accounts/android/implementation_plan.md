# Implementation Plan: Android Hierarchical Wallets (Phase 2)

**Feature:** Support Hierarchical Wallets (Sub-accounts) on Android
**Parent Context:** [Web Implementation](../web/implementation_plan.md)
**Status:** Planning

---

## 🎯 Goal
Replicate the hierarchical wallet management features from the Web Mock UI on Android using Jetpack Compose.

> **Note:** Just like the Web phase, **Balance Roll-ups** (sums of child wallets) are **Out of Scope**. Each wallet has its own independent balance.

## 🛠️ Step-by-Step Implementation

### 1. Data Model Updates
**File:** `app/src/main/java/com/oatrice/jarwise/model/Models.kt`
- Add `Wallet` data class:
```kotlin
data class Wallet(
    val id: String,
    val name: String,
    val balance: Double,
    val color: Color,
    val icon: ImageVector,
    val parentId: String? = null,
    val level: Int = 0
)
```

### 2. Mock Data Seeding
**File:** `app/src/main/java/com/oatrice/jarwise/data/GeneratedMockData.kt`
- Add `val wallets: List<Wallet>` with hierarchical sample data (Bank Account > Savings, etc.).

### 3. UI Components
- **`ManageWalletsScreen`**:
    - Display wallets in a list.
    - Implement a `WalletTreeItem` composable for indentation and visual hierarchy cues.
- **`AddEditWalletScreen` (or Modal/Dialog)**:
    - Add "Parent Wallet" Dropdown/Selector.
    - Filter options (hide self and descendants).

### 4. Logic & Validation (ViewModel)
**File:** `ManageWalletsViewModel.kt`
- **State Management:** Hold `wallets` list.
- **Validation:**
    - **Max Depth:** Prevent nesting > 3 levels.
    - **Circular Dependency:** Prevent setting descendant as parent.
- **Recursive Updates:** When parent changes, update `level` for all children.
    - **Safe Deletion:** Check if wallet has children before delete. Block deletion and show alert if children exist (Phase 1 Logic).

## 🧪 Verification
- **Build & Install:** Use the project script:
  ```bash
  ./Android/scripts/build_and_install_debug.sh
  ```
- **Manual Verification:**
    - Open app on Emulator/Device.
    - Verify visual indentation of sub-wallets.
    - Test "Add Child" flow and "Parent Selection".
    - Verify Alerts for Max Depth & Circular Dependency.
