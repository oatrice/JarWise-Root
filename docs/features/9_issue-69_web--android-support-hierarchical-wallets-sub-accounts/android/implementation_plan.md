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
    - Test "Add Child" flow and "Parent Selection".
    - Verify Alerts for Max Depth & Circular Dependency.

## 💾 Phase 3: Database Integration (Persistence)
**Goal:** Persist hierarchical wallet data using Room Database.

### 1. Database Schema
**File:** `app/src/main/java/com/oatrice/jarwise/model/Models.kt`
- Annotate `Wallet` with `@Entity(tableName = "wallets")`.
- `parentId` should be a nullable String.
- `level` is persisted to avoid recalculation on load.

### 2. Data Access Object (DAO)
**File:** `app/src/main/java/com/oatrice/jarwise/data/dao/WalletDao.kt` (Create New)
- `monitorWallets()`: Returns `Flow<List<Wallet>>`.
- `insertWallet()`, `updateWallet()`, `deleteWallet()`.

### 3. Repository Layer
**File:** `app/src/main/java/com/oatrice/jarwise/data/repository/WalletRepository.kt` (Create New)
- Abstraction layer to handle data operations.

### 4. ViewModel Update
**File:** `ManageWalletsViewModel.kt`
- Inject `WalletRepository`.
- Replace `_wallets` StateFlow based on MockData with `repository.wallets`.
- Update methods to call suspend repository functions.

### 5. Migration
**File:** `AppDatabase.kt`
- Increase Database Version (4 -> 5).
- Provide Migration Strategy (MIGRATION_4_5) to create the `wallets` table.
