# Implementation Plan: Report Filter: Multi-Select Categories & Accounts

> **Refers to**: [Spec Link](./spec.md)
> **Status**: Draft

## 1. Architecture & Design
The implementation will follow a reactive, state-driven UI pattern. A central `ViewModel` on Android will manage the filter state (selected accounts and categories) and expose the filtered data to the UI. The UI components will be stateless, reacting to data streams from the `ViewModel`. For session persistence, the `ViewModel` will be scoped to the navigation graph of the reports feature, ensuring its state is retained during navigation within the feature but cleared when the user leaves it entirely.

The web implementation will be a UI mock, focusing on creating the necessary React components to visualize the feature without implementing the backing logic.

### Component View
> [!IMPORTANT]
> **Platform Scope Policy:**
> - **Android**: Full implementation with production-ready code and tests.
> - **Web**: Mock UI only for this phase.
>
> **Development Order:** Web Mock UI FIRST → Android Full Implementation SECOND.

- **Modified Components**:
    - `ReportsPage.tsx` (Web): To include the new filter button and panel.
    - `ReportScreen.kt` (Android): To integrate the filter button, launch the filter panel, and display filtered data.
    - `ReportViewModel.kt` (Android): To be enhanced with state management for filters.

- **New Components**:
    - `FilterButton.tsx` (Web): A button component that can display an "active" state.
    - `FilterPanel.tsx` (Web): A mock UI panel with checkbox lists for filtering.
    - `FilterPanelBottomSheet.kt` (Android): A `BottomSheetDialogFragment` to host the filter selection UI.
    - `FilterSection.kt` (Android): A reusable Jetpack Compose composable for displaying a list of selectable items with "Select All" and "Clear All" actions.

- **Dependencies**:
    - This feature builds upon an existing reports screen (`#59`).
    - The hierarchical selection feature (`#67`) is an optional enhancement; the initial implementation will assume flat lists.

### Data Model Changes
A new state holder data class will be defined in the Android presentation layer to represent the current filter configuration. No database schema changes are required.

```kotlin
// Defined in the presentation layer, likely within the ViewModel file.
// File: com/example/reports/ReportViewModel.kt

data class ReportFilterState(
    val selectedAccountIds: Set<String> = emptySet(),
    val selectedCategoryIds: Set<String> = emptySet()
) {
    // A helper to determine if any filter is active.
    // Assumes initial state is all items selected.
    fun isDefault(totalAccounts: Int, totalCategories: Int): Boolean {
        return selectedAccountIds.size == totalAccounts && selectedCategoryIds.size == totalCategories
    }
}
```

---

## 2. Step-by-Step Implementation

### Phase 1: Web (Mock UI)

#### Step 1: Create Mock Filter Components
- **Description**: Create the stateless React components for the filter button and the filter panel. The panel will display hardcoded lists of accounts and categories with checkboxes.
- **Files**:
    - **New**: `src/components/reports/FilterButton.tsx`
    - **New**: `src/components/reports/FilterPanel.tsx`
- **Verification**:
    - Run Storybook or a similar tool to view the new components.
    - The `FilterButton` should have a prop to toggle its visual "active" state.
    - The `FilterPanel` should render two sections (Accounts, Categories) with lists of items, checkboxes, and "Select All" / "Clear All" buttons. The component will be visually complete but non-functional.

#### Step 2: Integrate Mock Panel into Report Page
- **Description**: Add the `FilterButton` to the `ReportsPage`. Implement local state management to toggle the visibility of the `FilterPanel` when the button is clicked.
- **Files**:
    - **Modify**: `src/pages/ReportsPage.tsx`
- **Verification**:
    - Navigate to the reports page in the web app.
    - The "Filter" button should be visible.
    - Clicking the button should show the `FilterPanel`.
    - Clicking it again (or a close button on the panel) should hide it.

---

### Phase 2: Android (Full Implementation)

#### Step 3: Enhance ReportViewModel for State Management
- **Description**: Augment the existing `ReportViewModel` to manage the filter state. This includes holding lists of all available accounts/categories and the sets of currently selected IDs.
- **Files**:
    - **Modify**: `com/example/reports/ReportViewModel.kt`
- **Code**:
    - Introduce `MutableStateFlow<ReportFilterState>` to hold the current selections.
    - Add public functions to modify the state: `toggleAccountSelection(id: String)`, `toggleCategorySelection(id: String)`, `selectAllAccounts()`, `clearAllAccounts()`, etc.
    - The ViewModel will be scoped to the reports navigation graph (`@HiltViewModel` with `hiltNavGraphViewModels`) to ensure state persistence during the session.
- **Verification**:
    - Unit tests will verify that calling the public functions correctly updates the `ReportFilterState`.

#### Step 4: Implement Data Filtering Logic
- **Description**: Create a derived `StateFlow` in the `ReportViewModel` that combines the raw transaction data with the `ReportFilterState` flow. This new flow will emit the filtered list of transactions whenever the filters change.
- **Files**:
    - **Modify**: `com/example/reports/ReportViewModel.kt`
- **Code**:
    - Use the `combine` operator on the `allTransactionsFlow` and `filterStateFlow`.
    - The lambda inside `combine` will perform the filtering: `transactions.filter { it.accountId in filterState.selectedAccountIds && it.categoryId in filterState.selectedCategoryIds }`.
    - Expose the result as `val filteredTransactions: StateFlow<List<Transaction>>`.
    - Expose `val transactionCount: StateFlow<Int>` derived from the filtered list.
- **Verification**:
    - Unit tests for the `ReportViewModel` will assert that `filteredTransactions` and `transactionCount` emit correct values when the filter state is changed.

#### Step 5: Build the Filter Panel UI
- **Description**: Create a `BottomSheetDialogFragment` that contains the filter UI built with Jetpack Compose. This UI will display the lists of accounts and categories, allowing for multi-selection.
- **Files**:
    - **New**: `com/example/reports/ui/FilterPanelBottomSheet.kt`
    - **New**: `com/example/reports/ui/FilterSection.kt` (Composable)
- **Code**:
    - `FilterPanelBottomSheet` will get the shared `ReportViewModel`.
    - The UI will collect the filter state from the `ViewModel` to correctly display the checkbox states.
    - User interactions (checkbox clicks, "Select All" clicks) will call the corresponding methods on the `ViewModel`.
- **Verification**:
    - Launch the bottom sheet in an isolated test environment or on the main screen.
    - Verify that the lists of accounts and categories are displayed correctly.
    - Verify that interacting with the UI elements triggers the `ViewModel` functions (can be checked via logging or debugger).

#### Step 6: Integrate Filter Panel into Report Screen
- **Description**: Add a "Filter" button to the main `ReportScreen`. This button will launch the `FilterPanelBottomSheet`. The report's charts and tables will be updated to consume the `filteredTransactions` flow from the `ViewModel`.
- **Files**:
    - **Modify**: `com/example/reports/ui/ReportScreen.kt`
- **Code**:
    - Add a `Button` or `IconButton` to the screen's top bar.
    - The `onClick` handler will use the `FragmentManager` to show the `FilterPanelBottomSheet`.
    - The composables displaying the report data (e.g., `LazyColumn` for transactions, chart component) will now `collectAsState` from `viewModel.filteredTransactions`.
- **Verification**:
    - Manually test the full flow on a device/emulator.
    - Clicking the filter button opens the panel.
    - Changing selections in the panel and closing it should immediately reflect in the data shown on the `ReportScreen`.

#### Step 7: Implement Active Filter Indicator
- **Description**: The "Filter" button on the `ReportScreen` must visually indicate when filters are active (i.e., not in the default "all selected" state).
- **Files**:
    - **Modify**: `com/example/reports/ui/ReportScreen.kt`
    - **Modify**: `com/example/reports/ReportViewModel.kt`
- **Code**:
    - In `ReportViewModel`, expose a new `val isFilterActive: StateFlow<Boolean>`. This will be derived from the `filterStateFlow` by comparing the current selection against the total number of available items.
    - In `ReportScreen`, the filter button composable will collect this boolean state and change its appearance (e.g., add a colored dot or change its icon) accordingly.
- **Verification**:
    - When all items are selected, the indicator is off.
    - Deselecting even one item should turn the indicator on.
    - Re-selecting all items should turn the indicator off.

---

## 3. Verification Plan
*How will we verify success?*

> [!IMPORTANT]
> **Android Build Policy**: MUST use scripts in `Android/scripts/` (e.g., `build_android.sh`) instead of direct `./gradlew` to ensure correct JDK version (Java 21).

### Automated Tests
- [X] **Unit Tests**: `app/src/test/java/com/example/reports/ReportViewModelTest.kt`
    - Test that `toggleAccountSelection` adds/removes IDs from the state.
    - Test that `selectAll` and `clearAll` functions work as expected for both accounts and categories.
    - Test that the `filteredTransactions` flow emits a correctly filtered list when the filter state changes.
    - Test that `isFilterActive` flow emits `true` when a filter is applied and `false` otherwise.

### Manual Verification
- [ ] **FR1**: Navigate to a report screen. Verify a "Filter" button is present. Clicking it opens a bottom sheet panel.
- [ ] **FR2/FR3**: The panel correctly lists all available accounts and categories with checked checkboxes by default.
- [ ] **FR5**: Deselect a category. Verify the report chart and transaction list update instantly to exclude items from that category.
- [ ] **FR5**: Deselect an account. Verify the report updates to exclude transactions from that account.
- [ ] **FR5**: Apply filters on both accounts and categories simultaneously. Verify the report shows only transactions matching both criteria (as per SBE 1).
- [ ] **FR4**: In the "Categories" section, tap "Clear All". Verify all category checkboxes are unchecked and the report shows no data (or a "no results" message). Tap "Select All" and verify all are checked and the report data returns.
- [ ] **FR6**: Verify the displayed transaction count updates correctly with every filter change.
- [ ] **FR7**: Deselect one item. Close the panel. Verify the "Filter" button now has a visual indicator (e.g., a colored dot).
- [ ] **FR7**: Re-open the panel, tap "Select All" for the modified section, and close it. Verify the indicator on the "Filter" button disappears.
- [ ] **FR8**: Apply a specific filter (e.g., only "Travel" category). Navigate to another screen (e.g., Dashboard) and then navigate back to the report. Verify the "Travel" filter is still applied.
- [ ] **NFR1**: On a debug build with ~10,000 transactions, verify that changing a filter updates the UI in under 2 seconds.
- [ ] **NFR2**: If there are more accounts/categories than fit on the screen, verify the lists within the filter panel are scrollable.